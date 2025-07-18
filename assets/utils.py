from io import BytesIO, TextIOWrapper
import json
import numpy as np
import pandas as pd
import pandas.api.types as types

def is_european(csv_bytes):
	header = TextIOWrapper(BytesIO(csv_bytes), 'utf-8').readline(1024)
	return header.count(';') > header.count(',')

def read_csv(csv_bytes):
	my_args = {'sep': ';', 'decimal': ','} if is_european(csv_bytes) else {}
	return pd.read_csv(BytesIO(csv_bytes), **my_args)

def read_excel(excel_bytes):
	return pd.read_excel(BytesIO(excel_bytes), engine = "openpyxl")

def read_parquet(parquet_bytes):
	return pd.read_parquet(BytesIO(parquet_bytes), engine = "fastparquet")

def to_csv(data):
	my_bytes = BytesIO()
	data.to_csv(my_bytes, index = False)
	return my_bytes.getbuffer()

def to_excel(data):
	my_bytes = BytesIO()
	data.to_excel(my_bytes, engine = "openpyxl", index = False)
	return my_bytes.getbuffer()

def to_parquet(data):
	my_bytes = BytesIO()
	data.to_parquet(my_bytes, engine = "fastparquet", index = False, compression = 'zstd')
	return my_bytes.getbuffer()

def is_numeric(series):
	return types.is_numeric_dtype(series)

def num_vars(dataframe):
	return tuple(column for column, dtype in dataframe.dtypes.items() if types.is_numeric_dtype(dtype))

def has_missing(series):
	return series.isna().any()

def same_categories(series1, series2):
	return series1.isin(series2).all() and series2.isin(series1).all()

def harmonized_variables(sample1, sample2, weights_var = None):
	if weights_var is not None:
		sample2 = sample2.dropna(subset = weights_var)
	
	vars1 = sample1.columns
	vars2 = sample2.columns
	common_vars = vars1.intersection(vars2)
	
	vars_info = {
		"harmonized": [],
		"nonharmonized": [],
		"unrelated": [[], []]
	}
	
	for var in common_vars:
		is_numeric_var = is_numeric(sample1[var])
		
		if is_numeric_var != is_numeric(sample2[var]):
			vars_info["nonharmonized"].append({"name": var, "reason": "type"})
		elif var == weights_var:
			vars_info["nonharmonized"].append({"name": var, "reason": "weight"})
		elif has_missing(sample1[var]) != has_missing(sample2[var]):
			vars_info["nonharmonized"].append({"name": var, "reason": "missing"})
		elif not is_numeric_var and not same_categories(sample1[var], sample2[var]):
			vars_info["nonharmonized"].append({"name": var, "reason": "categories"})
		else:
			vars_info["harmonized"].append(var)
	
	vars_info["unrelated"][0].extend(vars1.drop(common_vars))
	vars_info["unrelated"][1].extend(vars2.drop(common_vars))
	
	return vars_info

def to_json(data):
	return json.loads(data.to_json(orient = 'split', force_ascii = False, date_format = 'iso', date_unit = 's', double_precision = 15))

def serialize(details):
	details = to_json(details)
	return tuple(zip(details['index'], details['data']))

def numeric_details(var, dataframe, weights_var = None):
	data = dataframe[var]
	
	if weights_var is None:
		missing = data.isna().sum() / len(data)
		data = data.dropna()
		weights = None
	else:
		weights = dataframe[weights_var]
		valid_weights = weights.notna()
		data = data[valid_weights]
		weights = weights[valid_weights]
		missing = weights[data.isna()].sum() / weights.sum()
		valid_values = data.notna()
		data = data[valid_values]
		weights = weights[valid_values]
	
	details = {
		"mean": np.average(data, weights = weights),
		"deviation": np.sqrt(np.cov(data, aweights = weights)),
		"max": data.max(),
		"min": data.min()
	}
	
	if missing > 0: details[pd.NA] = missing
	return serialize(pd.Series(details, dtype = object, copy = False))

def value_counts(var, dataframe, weights_var = None):
	if weights_var is None:
		return dataframe[var].value_counts(dropna = False)
	else:
		dataframe = dataframe.loc[dataframe[weights_var].notna(), [var, weights_var]]
		return dataframe.groupby(var, sort = False, observed = True, dropna = False).sum()[weights_var].sort_values(ascending = False)

def categories_details(var, dataframe, weights_var = None):
	total = len(dataframe) if weights_var is None else dataframe[weights_var].sum()
	return serialize(value_counts(var, dataframe, weights_var) / total)

def curate(value):
	if pd.isnull(value): return None
	try:
		json.dumps(value)
		return value
	except TypeError:
		return value.item()

def numeric_inferred_totals(var, dataframe, weights_var = None):
	data = dataframe[var] if weights_var is None else dataframe[var] * dataframe[weights_var]
	return curate(data.sum())

def categories_inferred_totals(var, dataframe, weights_var = None):
	return serialize(value_counts(var, dataframe, weights_var))

def pop_total(sample, weights_var = None):
	if weights_var is None: return len(sample)
	else: return curate(sample[weights_var].sum())

invalid_dtypes = (types.is_datetime64_any_dtype, types.is_timedelta64_dtype)
prefix_sep = '_bettersurveys_'

def prepare_calibration(sample, population_totals, weights_var = None):
	if weights_var is not None: weights = sample[weights_var]
	sample = sample[list(population_totals.keys())].copy()
	dummy_columns = [name for name, totals in population_totals.items() if isinstance(totals, dict)]
	my_totals = {}
	
	for name, totals in population_totals.items():
		if isinstance(totals, dict):
			for category, total in totals.items():
				my_totals[name + prefix_sep + category] = total
		else:
			my_totals[name] = totals
	
	for column in dummy_columns:
		if any(is_dtype(sample[column]) for is_dtype in invalid_dtypes):
			original_values = pd.Series(sample[column].unique(), copy = False)
			valid_values = to_json(original_values)["data"]
			original_values = tuple(original_values.astype(str, copy = False))
			sample[column] = sample[column].astype(str, copy = False).replace(original_values, valid_values)
	
	sample = pd.get_dummies(sample, columns = dummy_columns, prefix_sep = prefix_sep)
	if weights_var is not None: sample[weights_var] = weights
	return sample, pd.Series(my_totals, copy = False)

def weights_properties(series):
	mean = series.mean()
	deviation = series.std()
	percentiles = np.nanpercentile(series, (25, 50, 75), method = "median_unbiased")
	
	properties = {
		"mean": mean,
		"deviation": deviation,
		"CV": deviation / mean,
		"min": series.min(),
		"Q1": percentiles[0],
		"median": percentiles[1],
		"Q3": percentiles[2],
		"max": series.max(),
		"IQR": percentiles[2] - percentiles[0],
		"skew": series.skew(),
		"kurt": series.kurt()
	}
	
	return serialize(pd.Series(properties, dtype = object, copy = False))

def single_estimation(series, weights):
	import inps
	interval = inps.confidence_interval(series, weights)
	return {
		'estimation': inps.estimation(series, weights),
		'interval_lower': interval[0],
		'interval_upper': interval[1]
	}

def advanced_estimation(sample, target_var, method, p_sample, covariates, p_weights_var, numeric):
	import inps
	kwargs = {'covariates': covariates}
	target_category = None
	
	if 'Psa' in method or 'Kw' in method:
		if 'Boost' in method: kwargs['model'] = inps.boosting_classifier()
		kwargs['weights_column'] = p_weights_var
		
		def estimator(np_sample, p_sample):
			weights = inps.psa_weights(np_sample, p_sample, **kwargs)['np'] if 'Psa' in method else inps.kw_weights(np_sample, p_sample, **kwargs)
			return inps.estimation(sample[target_var] if target_category is None else sample[target_var] == target_category, weights)
	elif 'Matching' in method:
		if 'Boost' in method: kwargs['model'] = inps.boosting_regressor() if numeric else inps.boosting_classifier()
		weights = None if p_weights_var is None else p_sample[p_weights_var]
		kwargs['target_column'] = target_var
		
		def estimator(np_sample, p_sample):
			kwargs['target_category'] = target_category
			matching_values = inps.matching_values(np_sample, p_sample, **kwargs)['p']
			return inps.estimation(matching_values, weights)
	elif 'Training' in method:
		if 'Boost' in method:
			kwargs['psa_model'] = inps.boosting_classifier()
			kwargs['matching_model'] = inps.boosting_regressor() if numeric else inps.boosting_classifier()
		
		weights = None if p_weights_var is None else p_sample[p_weights_var]
		kwargs['target_column'] = target_var
		kwargs['weights_column'] = p_weights_var
		
		def estimator(np_sample, p_sample):
			kwargs['target_category'] = target_category
			matching_values = inps.training_values(np_sample, p_sample, **kwargs)['p']
			return inps.estimation(matching_values, weights)
	else:
		raise ValueError(method)
	
	def get_estimation():
		return dict(zip(
			('estimation', 'interval_lower', 'interval_upper'),
			inps.advanced_confidence_interval(sample, p_sample, estimator)
		))
	
	if numeric:
		return {key: curate(value) for key, value in get_estimation().items()}
	else:
		categories = sample[target_var].unique()
		my_estimation = []
		
		for category in categories:
			target_category = category
			my_estimation.append(get_estimation())
		
		my_estimation = pd.DataFrame(my_estimation, index = categories)
		my_estimation.sort_values('estimation', ascending = False, inplace = True)
		return to_json(my_estimation)

def estimation(sample, target_var, weights_var = None, method = None, p_sample = None, covariates = None, p_weights_var = None):
	import inps
	
	sample = sample.dropna(subset = [target_var] if weights_var is None else [target_var, weights_var])
	if p_weights_var is not None: p_sample = p_sample.dropna(subset = [p_weights_var])
	numeric = is_numeric(sample[target_var])
	weights = None if weights_var is None else sample[weights_var]
	
	if method is None:
		values = sample[target_var]
	elif method.startswith("advanced"):
		return advanced_estimation(sample, target_var, method, p_sample, covariates, p_weights_var, numeric)
	else:
		model = None
		if method == "boosting": model = inps.boosting_regressor() if numeric else inps.boosting_classifier()
		values = inps.matching_values(sample, p_sample, target_var, covariates = covariates, model = model, training_weight = weights)["p"]
		weights = None if p_weights_var is None else p_sample[p_weights_var]
	
	if numeric:
		return {key: curate(value) for key, value in single_estimation(values, weights).items()}
	else:
		if isinstance(values, dict):
			my_estimation = pd.DataFrame((single_estimation(probs, weights) for probs in values["probs"].T), index = values["categories"])
		else:
			categories = values.unique()
			my_estimation = pd.DataFrame((single_estimation(values == category, weights) for category in categories), index = categories)
		
		my_estimation.sort_values('estimation', ascending = False, inplace = True)
		return to_json(my_estimation)
