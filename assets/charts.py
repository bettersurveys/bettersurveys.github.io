import pandas as pd
import altair as alt

chart_width = {"step": 150}
ticks_width = 100
multi_chart_width = {"step": 30}
multi_ticks_width = 20

def numeric(name, values):
	x = alt.X("name:N", title = name, axis = alt.Axis(labelAngle = 0))
	y = alt.Y("estimation:Q", title = None)
	y1 = alt.Y("interval_lower:Q", title = None)
	y2 = "interval_upper:Q"
	color = alt.Color("name:N", legend = None)
	
	bars = alt.Chart().mark_bar().encode(x = x, y = y, color = color)
	intervals = alt.Chart().mark_errorbar(ticks = {"width": ticks_width}, color = "black").encode(x = x, y = y1, y2 = y2)
	
	return alt.layer(bars.interactive(), intervals, data = values).properties(width = chart_width).to_json()

def categorical(name, values):
	x = alt.X("name:N", title = name, axis = alt.Axis(labelAngle = 0))
	y = alt.Y("estimation:Q", title = None, axis = alt.Axis(format = "%"))
	y1 = alt.Y("interval_lower:Q", title = None)
	y2 = "interval_upper:Q"
	color = alt.Color("index:N", title = None)
	xOffset = "index:N"
	
	bars = alt.Chart().mark_bar().encode(x = x, y = y, color = color, xOffset = xOffset)
	intervals = alt.Chart().mark_errorbar(ticks = {"width": multi_ticks_width}, color = "black").encode(x = x, y = y1, y2 = y2, xOffset = xOffset)
	
	return alt.layer(bars.interactive(), intervals, data = values).properties(width = multi_chart_width).to_json()

def numeric_df(values, x):
	values["name"] = x
	return pd.DataFrame([values])

def categorical_df(values, x):
	values = pd.DataFrame(**values)
	values["name"] = x
	values.reset_index(inplace = True)
	return values

def single(name, x, values):
	return numeric(name, numeric_df(values, x))

def single_categorical(name, x, values):
	return categorical(name, categorical_df(values, x))

def compared(name, x, values, alt_values):
	values = numeric_df(values, x[0])
	alt_values = numeric_df(alt_values, x[1])
	return numeric(name, pd.concat((values, alt_values), ignore_index = True))

def compared_categorical(name, x, values, alt_values):
	values = categorical_df(values, x[0])
	alt_values = categorical_df(alt_values, x[1])
	return categorical(name, pd.concat((values, alt_values), ignore_index = True))
