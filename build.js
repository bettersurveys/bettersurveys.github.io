let e,a,t,i=0;function n(){return i=(i+1)%Number.MAX_SAFE_INTEGER}async function s(e,a){let t=await fetch(e,a);if(t.ok)return t;throw t}function l(e){let a=document.createElement("template");return a.innerHTML=e.trim(),a.content.firstChild}class r{constructor(){this.event=new EventTarget,this.aux=new Event("e")}addListener(e,a){let t=this.event;e.myCallbacks?e.myCallbacks.push(a):e.myCallbacks=[a];let i=[new WeakRef(e),new WeakRef(a)];t.addEventListener("e",function e(){let[a,n]=i.map(e=>e.deref());a&&n&&(document.contains(a)?n():t.removeEventListener("e",e))})}addGlobalListener(e){this.event.addEventListener("e",e)}dispatch(){this.event.dispatchEvent(this.aux)}}class o{constructor(e){this.variable=e,this.event=new r}get value(){return this.variable}set value(e){this.variable=e,this.event.dispatch()}subscribe(e,a){this.event.addListener(e,a)}addGlobalListener(e){this.event.addGlobalListener(e)}}const c=new Worker("assets/webworker.js",{type:"module"}),d=new Map;async function u(){new Promise(e=>setTimeout(e))}async function p(){return new Promise(async e=>{await u(),d.size?c.addEventListener("message",async function a(){await u(),d.size||(c.removeEventListener("message",a),e())}):e()})}async function m(e,a,t){a&&await p();let i=n();return new Promise((a,n)=>{d.set(i,{onSuccess:a,onError:n}),c.postMessage({python:e,id:i,...t})})}async function h(e,a){return m(`
		import micropip
		micropip.install(${JSON.stringify(e)})
	`,a)}function w(e){return`await (await pyfetch("${e}")).memoryview()`}function v(){let e=location.pathname;return e.endsWith("/")?e:e+"/"}async function b(e,a,t){return m(`
		from pyodide.http import pyfetch
		with open("${a}", "wb") as my_file:
			my_file.write(${w(e)})
	`,t)}c.onmessage=function(e){let{id:a,...t}=e.data,{onSuccess:i,onError:n}=d.get(a);d.delete(a),Object.hasOwn(t,"error")?n(t.error):i(t.result)};const f=(async()=>{await b(`${v()}assets/utils.py`,"utils.py"),await m("import utils")})(),g=h("openpyxl");async function y(e,a){await g,await m(`
		from pyodide.http import pyfetch
		from io import BytesIO
		import pandas as pd
		${a} = pd.read_excel(BytesIO(${w(e)}), engine = "openpyxl")
	`)}async function $(e,a){let t=URL.createObjectURL(e);await y(t,a),URL.revokeObjectURL(t)}async function S(e,a){var t,i;let n;await g,await f,t=await m(`utils.to_excel(${e})`),i=`${a}.xlsx`,(n=document.createElement("a")).href=t,n.download=i,document.body.append(n),n.click(),URL.revokeObjectURL(t),n.remove()}async function E(e,a){return $(e,a)}async function L(e,a,t){if("Excel"==t)return S(e,a);throw Error(`Invalid extension: ${t}`)}async function k(e,a){return m(`
		${a} = ${e}
		del ${e}
	`)}async function q(e){return m(`del ${e}`)}async function _(e){return m(`${e}.columns.tolist()`)}async function x(e){return await f,m(`utils.num_vars(${e})`)}function N(e,a){return e&&e!=a?`, "${e}"`:""}async function T(e,a,t){return await f,m(`utils.harmonized_variables(${e}, ${a}${N(t)})`)}async function P(e,a,t,i){return await f,m(`utils.${a?"numeric":"categories"}_details("${e}", ${t}${N(i,e)})`)}async function M(e,a,t,i){await f;let n=await m(`utils.${a?"numeric":"categories"}_inferred_totals("${e}", ${t}${N(i)})`);return a?n:new Map(n)}async function W(e,a){return await f,await m(`utils.pop_total(${e}${N(a)})`)}g.then(()=>m("import openpyxl"));const z=new o("load"),D={value:!1},F=new o,H=new o;class O{constructor(e){this.targetName=e,this.event=new r}subscribe(e,a){this.event.addListener(e,a)}cancel(e){if(this[e]){let a=this[e].id;this[e].loadPromise.then(()=>q(a)),this[e]=null,this.event.dispatch()}}loadTemp(e){this.cancel("temp");let a={id:`temp${n()}`,filename:e.name};return a.loadPromise=E(e,a.id),this.temp=a,this.event.dispatch(),a.loadPromise.then(()=>{a.id==this.temp?.id&&(a.loaded=!0,this.event.dispatch())}).catch(e=>{if(a.id==this.temp?.id)throw console.error(e),this.temp=null,this.event.dispatch(),e})}confirmTemp(){this.cancel("final"),this.final=this.temp,this.temp=null,this.event.dispatch()}confirmFinal(){let a=this.final;return this.final=null,this.event.dispatch(),k(a.id,this.targetName).then(()=>{let t=a.filename.replace(/\.[^.]+$/,"");if("np_sample"==this.targetName)F.value=t;else if("p_sample"==this.targetName)e=a.weights,H.value=t;else throw Error(`Invalid name: ${this.targetName}`)})}}const A=new O("np_sample"),C=new O("p_sample");for(let e of[A,C])z.addGlobalListener(()=>e.cancel("final"));H.addGlobalListener(()=>{a=H.value&&W("p_sample",e)});const V=s("assets/texts.json").then(e=>e.json());async function R(e){return V.then(a=>a[e])}const j={maximumFractionDigits:2,minimumFractionDigits:2,maximumSignificantDigits:1,minimumSignificantDigits:1,roundingPriority:"morePrecision"},I=Intl.NumberFormat(void 0,j);j.style="percent";const B=Intl.NumberFormat(void 0,j);function G(e){let a=!1;return()=>{a||(a=!0,setTimeout(()=>{a=!1,e()}))}}function J(e){for(let a of e.querySelectorAll("dialog"))a.querySelector(".close-button").onclick=()=>a.close()}async function U(e){let a=l(`<dialog class="modal error">
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
		<img src="images/error.svg">
		<article>
			<h4>${await R("error")}</h4>
			<p>${e}</p>
		</article>
		<button class="button" autofocus>${await R("acceptError")}</button>
	</dialog>`);a.querySelectorAll("button").forEach(e=>e.addEventListener("click",()=>a.close())),a.addEventListener("close",()=>a.remove()),document.body.append(a),a.showModal()}async function X(e){let a=l(`<dialog class="modal loading">
		<img src="images/loading.svg"/>
		<p>${await R("loading")}</p>
		<p>${e}</p>
	</dialog>`);return a.addEventListener("cancel",e=>e.preventDefault()),a.addEventListener("close",()=>a.showModal()),a}function K(e,a){let t=l(`<article class="feedback">
		<img src="images/check-circle.svg"/>
		<div>
			<h3>${e}</h3>
			<p>${a}</p>
		</div>
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
	</article>`);return t.querySelector(".close-button").addEventListener("click",()=>t.remove()),t}function Q(e,a){return l(`<option${a?` value="${a}"`:""}>${e}</option>`)}function Y(e,a,t,i){let n=l(`<section class="estimation-table" style="--columns: ${e[e.length-1].length}"></section>`);for(let s=0;s<e.length;s++){let r=e[s],o=l(`<div class="row${s<a?" titles":""}"></div>`);for(let e=0;e<r.length;e++){let n=l(`<article>${r[e]}</article>`);(s<a||e<t)&&(n.classList.add("title"),i&&s==a-1&&e>=r.length-2&&n.classList.add("expanded")),o.append(n)}n.append(o)}return n}const Z=[A,C];function ee(e,a){let t;let i=l(e[a]?`<article class="uploaded-file">
			<span>${e[a].filename}</span>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
			<progress ${e[a].loaded?'value = "1"':""}></progress>
		</article>`:'<article class="uploaded-file" hidden></article>');return i.querySelector(".close-button")?.addEventListener("click",()=>e.cancel(a)),e.subscribe(i,()=>i.replaceWith(ee(e,a))),i}async function ea(e){let a=l(`<select name="weights-var">
		<option value="">${await R("noWeights")}</option>
	</select>`);return e?a.append(...e.map(e=>l(`<option>${e}</option>`))):a.disabled=!0,a}async function et(e){let a=l(`<section class="modal-input">
		<div class="modal-input-top">
			<h4>${await R("loadFile2Subaction")}</h4>
			<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await R("loadFile2SubactionHelp")}</span></span>
		</div>
		<select></select>
		<p>${await R("loadFile2SubactionSubtitle")}</p>
	</section>`);async function t(e){let t=await ea(e);return a.querySelector("select").replaceWith(t),t}return t(),e.subscribe(a,async()=>{let a=e.temp;if(a?.loaded){let i=await x(a.id);if(a.id==e.temp?.id){let e=await t(i);e.addEventListener("change",()=>a.weights=e.value)}}else t()}),a}async function ei(e){let a=l(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await R("loadFile"+e+"Title")}</h3>
				<p>${await R("loadFile"+e+"Subtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input padded">
			<div class="modal-input-top">
				<h4>${await R("loadFile"+e+"Action")}</h4>
				<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await R("loadFile"+e+"ActionHelp")}</span></span>
			</div>
			<label class="button reversed">
				<span class="large icon"><img src="images/upload.svg" data-inline/></span>
				<span>${await R("fileButton")}</span>
				<input name="file${e}" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" autofocus/>
			</label>
			<p>${await R("fileButtonSubtitle")}</p>
		</section>
		<article class="uploaded-file" hidden></article>
		<section class="buttons-row">
			<button class="button reversed minimal">${await R("cancel")}</button>
			<button class="button" disabled>${await R("fileButton")}</button>
		</section>
	</dialog>`),t=Z[e-1];a.querySelector(".button.reversed.minimal").addEventListener("click",()=>a.close());let i=a.querySelector("input[type=file]");i.addEventListener("change",()=>{t.loadTemp(i.files[0]).catch(async e=>U(await R("loadFileError")))}),i.addEventListener("click",()=>i.value=""),a.querySelector(".uploaded-file").replaceWith(ee(t,"temp"));let n=a.querySelector(".buttons-row > .button:last-of-type");return t.subscribe(n,()=>n.disabled=!t.temp?.loaded),n.addEventListener("click",()=>{t.confirmTemp(),a.close()}),2==e&&a.querySelector(".uploaded-file").after(await et(t)),a.addEventListener("close",()=>t.cancel("temp")),a}async function en(e){let a=l(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await R(`loadOption${e}`)}</h3>
		<p>${await R(`loadOption${e}Subtitle`)}</p>
		<article class="radio-file">
			<img src="images/empty.svg"/>
			<p>${await R("fileSelect")}</p>
			<article class="uploaded-file" hidden></article>
			<button class="button small"><span class="icon"><img src="images/upload.svg" data-inline/></span><span>${await R("fileButton")}</span></button>
		</article>
	</label>`),t=Z[e-1];a.querySelector(".radio-file").append(await ei(e)),a.querySelector(".uploaded-file").replaceWith(ee(t,"final"));let i=a.querySelector(".button:has(+ dialog)");i.addEventListener("click",()=>i.nextElementSibling.showModal());let n=new o(t.final?.loaded);return t.subscribe(a,()=>n.value=t.final?.loaded),n.subscribe(i,()=>i.disabled=n.value),[a,n,()=>t.confirmFinal()]}async function es(e){let a=l(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await R(`download${e}Title`)}</h3>
				<p>${await R(`download${e}Subtitle`)}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await R("downloadFilename")}</h4>
			</div>
			<input name="filename" type="text" autofocus/>
		</section>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await R("downloadFormat")}</h4>
			</div>
			<select name="format" class="big">
				<option value="" hidden>${await R("downloadFormatPlaceholder")}</option>
				<option>Excel</option>
			</select>
		</section>
		<section class="buttons-row">
			<button class="button reversed minimal">${await R("cancel")}</button>
			<button class="button" disabled>${await R("downloadConfirm")}</button>
		</section>
	</dialog>`),t=a.querySelector("input"),i=a.querySelector("select"),[n,s]=a.querySelectorAll(".button");function r(){s.disabled=!(t.value&&i.value)}return t.addEventListener("input",r),i.addEventListener("change",r),n.addEventListener("click",()=>a.close()),s.addEventListener("click",async()=>{let n=await X(await R("downloadLoading"));a.append(n),n.showModal(),L(1==e?"np_sample":"p_sample",t.value,i.value).then(()=>{a.close()}).catch(async e=>{console.error(e),U(await R("downloadError"))}).finally(()=>n.remove())}),r(),a}async function el(a){if("left"==a||"right"==a){let t="left"==a?1:2,i=await R(`loadFile${t}Title`),n="left"==a?F.value:H.value,s=l(`<header class="dual-header ${a}">
			<h2>${i}</h2>
			<label>
				<span>${await R("actions")}</span>
				<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
				<input type="checkbox" hidden/>
				<nav class="dropdown from-button">
					<a>${await R("loadNewData")}</a>
					<a>${await R("downloadData")}</a>
				</nav>
			</label>
			<p>${n}</p>
			<div class="border"></div>
		</header>`);"right"==a&&s.append(l(`<article>
				<span>${await R("weightsVar")}</span>
				<span>${e||await R("noWeights")}</span>
			</article>`));let r=s.querySelectorAll("nav > a"),o=await Promise.all([ei(t),es(t)]),c=Z[t-1];c.subscribe(s,async()=>{if(c.final){let e=await X(await R("loadFileLoading"));s.append(e),e.showModal(),c.confirmFinal()}});for(let e=0;e<o.length;e++)s.append(o[e]),r[e].addEventListener("click",()=>o[e].showModal());return s}if("single"==a)return l(`<header class="single-header"><h2>${await R("loadFile1Title")}</h2><p>${F.value}</p></header>`);throw Error(`Invalid type: ${a}`)}async function er(){let e=[];return H.value?e.push(await el("left"),l('<div class="border"></div>'),await el("right")):e.push(await el("single")),e}const eo=["load","data","bias","weight","eval","estimation"];async function ec(e,a){let t=l('<nav class="tabs"></nav>');t.append(...await Promise.all(eo.map(async e=>l(`<button>${await R(e+"Tab")}</button>`)))),e=eo.indexOf(e),t.children[e].classList.add("active");for(let i=0;i<t.children.length;i++){let n=t.children[i];n.addEventListener("click",()=>z.value=eo[i]),a||i==e||(n.disabled=!0)}return t}async function ed(e,a,t){let i=l(`<a>${await R("export"+t)}</a>`),n=await es(t);e.append(i),a.append(n),i.addEventListener("click",()=>n.showModal())}async function eu(){let e=l(`<article class="main-title-buttons">
		<label class="dropdown-button">
			<span>${await R("download")}</span>
			<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
			<input type="checkbox" hidden/>
			<nav class="dropdown from-button color"></nav>
		</label>
	</article>`),a=e.querySelector(".dropdown");return F.value&&await ed(a,e,1),H.value&&await ed(a,e,2),J(e),e}async function ep(){let e=l(`<main class="main-section">
		<nav class="breadcrumb">
			<a><img src="images/home.svg" data-inline/><span>${await R("home")}</span></a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await R("projectsTab")}</a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await R("defaultProject")}</a>
		</nav>
		<section class="main-title">
			<article class="main-title-text">
				<h1>${await R("defaultProject")}</h1>
				<p>${await R("defaultProjectDesc")}</p>
			</article>
		</section>
		<nav class="tabs"></nav>
		<main></main>
	</main>`);return e.querySelector(".tabs").replaceWith(await ec(z.value,F.value)),F.value&&e.querySelector(".main-title").append(await eu()),e}async function em(e){let a=l(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await R("noFileTitle")}</h3>
		<p>${await R("noFileSubtitle")}</p>
		<article class="radio-file">
			<img src="images/data.svg"/>
			<p>${await R("noFileSubSubtitle")}</p>
			<button class="button small adjusted"><span>${await R("noFileConfirm")}</span><span class="icon"><img src="images/arrow-right.svg" data-inline/></span></button>
		</article>
	</label>`),t=a.querySelector("button");t.addEventListener("click",()=>{t.disabled=!0,e.click()});let i=async()=>{H.value&&(await q("p_sample"),H.value=null)};return[a,new o(!0),i]}const eh=[,,];async function ew(e){return 1==e?`<button class="button" disabled>${await R("next")}</button>`:`<section class="buttons-row">
			<button class="button reversed minimal">${await R("back")}</button>
			<button class="button" disabled>${await R("loadFileConfirm")}</button>
		</section>`}async function ev(e=1){let a=l(`<main class="main-content">
		<header>
			<h2>${await R("loadTitle")}</h2>
			<p>${await R("loadSubtitle")}</p>
		</header>
		<main class="data-load-content">
			<article class="stepper">
				<span class="step-icon active">${1==e?1:'<img src="images/check.svg"/>'}</span>
				<span class="step-text active">${await R("loadStep1")}</span>
				<img src="images/stepper.svg"/>
				<span class="step-icon ${2==e?"active":""}">2</span>
				<span class="step-text ${2==e?"active":""}">${await R("loadStep2")}</span>
			</article>
			${await ew(e)}
			<label class="radio-label"></label>
			${await ew(e)}
		</main>`),t=a.querySelectorAll(".data-load-content > .button, .data-load-content > .buttons-row > .button:last-of-type"),i=a.querySelector(".radio-label"),n=[en(e)];for(let[a,l,r]of(2==e&&n.push(em(t[0])),n=await Promise.all(n),i.after(...n.map(e=>e[0])),n)){let i=a.querySelector("input");for(let a of t){function s(){i.checked&&(a.disabled=!l.value,eh[e-1]=r)}i.addEventListener("change",s),l.subscribe(a,s)}}for(let i of t)i.addEventListener("click",async()=>{if(i.disabled=!0,e<2)a.replaceWith(await ev(e+1));else{let e=await X(await R("loadFileLoading"));a.append(e),e.showModal(),await Promise.all(eh.map(e=>e())),D.value=!0,z.value="data"}});return a.querySelectorAll(".data-load-content > .buttons-row > .button:first-of-type").forEach(t=>{t.addEventListener("click",async()=>{t.disabled=!0,a.replaceWith(await ev(e-1))})}),i.remove(),J(a),a}async function eb(){let e=await ep();return e.querySelector("main").replaceWith(await ev()),e}let ef=new class{constructor(){this.cache=new Map}set(e,a){this.cache.set(a.name,e),a.hasTotals.value=!0}delete(e){this.cache.delete(e.name),e.hasTotals.value=!1}async verify(e,a){let t=await a.npDetails();return!t.some(e=>null==e[0])&&(a.isNpNumeric?"number"==typeof e:t.length==e.size&&t.every(a=>e.has(a[0])))}async refresh(e){let a=this.cache;for(let t of(this.cache=new Map,e)){let e=a.get(t.name);e&&await this.verify(e,t)&&this.set(e,t)}}},eg=new class{constructor(){this.cache=new Set}refresh(e){let a=this.cache;for(let t of(this.cache=new Set,e))t.selected.addGlobalListener(()=>{t.selected.value?this.cache.add(t.name):this.cache.delete(t.name)}),t.selected.value=t.selectable.value&&a.has(t.name)}};class ey{static baseProperties=["name","inNp","inP","isNpNumeric","isPNumeric","isHarmonized","harmonReason","pWeights"];constructor(e){for(let a of ey.baseProperties)this[a]=e[a];this.selected=new o(!1),this.expanded=new o(!1),this.hasTotals=new o(!1),this.selectable=new o(this.isHarmonized),this.hasTotals.addGlobalListener(()=>this.selectable.value=this.isHarmonized||this.hasTotals.value),this.selectable.addGlobalListener(()=>{this.selected.value&&!this.selectable.value&&(this.selected.value=!1)})}async npDetails(){return this.npCache||(this.npCache=P(this.name,this.isNpNumeric,"np_sample")),this.npCache}async pDetails(){return this.pCache||(this.pCache=P(this.name,this.isPNumeric,"p_sample",e)),this.pCache}async inferredTotals(){return this.inferredCache||(this.inferredCache=M(this.name,this.isPNumeric,"p_sample",e)),this.inferredCache}getTotals(){return ef.cache.get(this.name)}setTotals(e){ef.set(e,this)}deleteTotals(){ef.delete(this)}}class e${constructor(){this.event=new r}subscribe(e,a){this.event.addListener(e,a)}async variables(){return this.cache||(this.cache=this.variablesPromise().then(async e=>(await ef.refresh(e),eg.refresh(e),e))),this.cache}async filtered(e){return(await this.variables()).filter(e)}async harmonized(){return this.filtered(e=>e.isHarmonized)}async common(){return this.filtered(e=>e.inNp&&e.inP)}async npOnly(){return this.filtered(e=>e.inNp&&!e.inP)}async pOnly(){return this.filtered(e=>!e.inNp&&e.inP)}async get(e){return(await this.variables()).find(a=>a.name==e)}static async fromHarmonization(){let a=e,[t,i,n]=await Promise.all([T("np_sample","p_sample",a),x("np_sample"),x("p_sample")]);[i,n]=[i,n].map(e=>new Set(e));let s=[];function l(e){return new ey({pWeights:a,isNpNumeric:i.has(e.name),isPNumeric:n.has(e.name),...e})}s.push(...t.harmonized.map(e=>l({name:e,inNp:!0,inP:!0,isHarmonized:!0}))),s.push(...t.nonharmonized.map(e=>l({name:e.name,inNp:!0,inP:!0,isHarmonized:!1,harmonReason:e.reason})));for(let e=0;e<2;e++)s.push(...t.unrelated[e].map(a=>l({name:a,inNp:0==e,inP:1==e,isHarmonized:!1})));return s}static async fromData(){let[e,a]=[_("np_sample"),x("np_sample")];return a=new Set(await a),(await e).map(e=>new ey({name:e,inNp:!0,inP:!1,isNpNumeric:a.has(e)}))}refresh(){F.value?H.value?(this.areDual=!0,this.variablesPromise=e$.fromHarmonization):(this.areDual=!1,this.variablesPromise=e$.fromData):(this.areDual=null,this.variablesPromise=null),this.cache=null,this.event.dispatch()}}const eS=new e$;async function eE(e){return[await R("missing"),B.format(e[1])]}async function eL(e){return null==e[0]?eE(e):[await R(e[0]),I.format(e[1])]}async function ek(e){return null==e[0]?eE(e):[e[0],B.format(e[1])]}async function eq(e,a){return Promise.all(e.map(a?eL:ek))}function e_(e,a,t,i){if(!e.hasDetails&&a.checked){e.hasDetails=!0;let a="right"==i?t.pDetails():t.npDetails(),n="right"==i?t.isPNumeric:t.isNpNumeric,s=l('<section class="details"></section>');a.then(async a=>{a=await eq(a,n),s.append(...a.map(e=>l(`<article><span>${e[0]}</span><span>${e[1]}</span></article>`))),e.append(s)})}}async function ex(e){let a=l('<button class="button reversed"></button>');async function t(){a.innerHTML=e.hasTotals.value?await R("editTotals"):await R("insertTotals")}return e.hasTotals.subscribe(a,t),t(),a}function eN(e,a,t){let i=[l(`<span>${e}</span>`),l('<label><input type="number" step="any" required/></label>')],n=i[1].querySelector("input");return a&&(n.valueAsNumber=a),t&&(n.readOnly=!0),i}async function eT(e){let a=await e.npDetails(),t=l(`<section class="totals-container${e.isHarmonized?"":" single"}" style="--items: ${e.isNpNumeric?1:a.length}">
		<article class="totals-article">
			<h4>${await R("totals1")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>
	</section>`),i=t.querySelector(".totals-items"),n=e.getTotals();if(e.isNpNumeric)i.append(...eN(await R("total"),n));else for(let[e]of a)i.append(...eN(e,n?.get(e)));if(e.isHarmonized){let n=l(`<article class="totals-article">
			<h4>${await R("totals2")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>`);t.append(n),n=n.querySelector(".totals-items");let s=await e.inferredTotals();if(e.isPNumeric)n.append(...eN(await R("total"),s,!0));else for(let[e,a]of s)n.append(...eN(e,a,!0));let r=l(`<button class="button reversed">${await R("inferTotals")}</button>`);r.addEventListener("click",()=>(function(e,a,t,i){let n=e.querySelectorAll("input");if(i)n[0].valueAsNumber=t;else for(let e=0;e<a.length;e++)n[e].valueAsNumber=t.get(a[e][0])})(i,a,s,e.isPNumeric)),t.querySelector(".totals-article").append(r)}return t}async function eP(e,a,t){let i=[...e.querySelectorAll("input")];if(i.every(e=>!e.value))a.deleteTotals(),t.close();else if(i.every(e=>e.reportValidity())){if(a.isNpNumeric)a.setTotals(i[0].valueAsNumber);else{let e=await a.npDetails();a.setTotals(new Map(e.map((e,a)=>[e[0],i[a].valueAsNumber])))}t.close()}}async function eM(e){let a=l(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await R("editTotals")}</h3>
				<p>${await R("editTotalsSubtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="totals-container"></section>
		<section class="buttons-row">
			<button class="button reversed minimal" disabled>${await R("deleteTotals")}</button>
			<section>
				<button class="button reversed minimal">${await R("cancel")}</button>
				<button class="button" disabled>${await R("setTotals")}</button>
			</section>
		</section>
	</dialog>`),[t,i,n]=a.querySelectorAll(".button");return a.addEventListener("open",async()=>{(await e.npDetails()).some(e=>null==e[0])?(U(await R("missingError")),a.close()):(a.querySelector(".totals-container").replaceWith(await eT(e)),n.disabled=!1,t.disabled=!1)}),i.addEventListener("click",()=>a.close()),n.addEventListener("click",()=>eP(a.querySelector(".totals-items"),e,a)),t.addEventListener("click",()=>{a.querySelector(".totals-items").querySelectorAll("input").forEach(e=>e.value="")}),a}async function eW(e){let a=await ex(e),t=await eM(e);return a.addEventListener("click",()=>{t.showModal(),t.dispatchEvent(new Event("open"))}),[a,t]}async function ez(e){let a=l(`<header class="variable header">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${await R("variables")}</span>
	</header>`);"single"!=e&&a.classList.add(e),"right"!=e&&a.querySelector(".border").after(l(`<label class="checkbox icon">
			<input type="checkbox" hidden/>
			<img src="images/check.svg"/>
		</label>`));let t=await eS.filtered(a=>a["right"==e?"inP":"inNp"]),[i,n]=a.querySelectorAll("input");i.addEventListener("change",()=>{t.forEach(e=>{e.expanded.value!=i.checked&&(e.expanded.value=i.checked)})}),n?.addEventListener("change",()=>{t.forEach(e=>{e.selectable.value&&e.selected.value!=n.checked&&(e.selected.value=n.checked)})});let s=G(()=>i.checked=t.every(e=>e.expanded.value)),r=G(()=>{let e=t.filter(e=>e.selectable.value);n.checked=e.length&&e.every(e=>e.selected.value)});for(let e of t)e.expanded.subscribe(a,s),n&&(e.selected.subscribe(a,r),e.selectable.subscribe(a,r));return s(),n&&r(),a}async function eD(e){let a=l('<article class="variable-status"></article>');return e.isHarmonized?a.innerHTML='<img width="24" height="24" src="images/check-circle.svg"/>':e.harmonReason?a.innerHTML=`<span class="lead left"><img src="images/lead.svg"/><span class="tooltip">${await R(e.harmonReason+"Reason")}</span></span><img src="images/check-yellow.svg"/>`:a.innerHTML='<img src="images/block.svg"/>',a}async function eF(e,a){let t=l(`<article class="variable view ${"single"!=a?a:""} ${e.isHarmonized?"harmonized":""}">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${e.name}</span>
	</article>`),i=t.querySelector("input");if(i.checked=e.expanded.value,i.addEventListener("change",()=>e.expanded.value=i.checked),e.expanded.subscribe(t,()=>{i.checked=e.expanded.value,e_(t,i,e,a)}),"right"!=a){let a,i;t.querySelector(".border").after(((i=(a=l(`<label class="checkbox icon">
		<input type="checkbox" hidden/>
		<img src="images/check.svg"/>
	</label>`)).querySelector("input")).checked=e.selected.value,i.disabled=!e.selectable.value,i.addEventListener("change",()=>e.selected.value=i.checked),e.selected.subscribe(a,()=>i.checked=e.selected.value),e.selectable.subscribe(a,()=>i.disabled=!e.selectable.value),a))}return"right"==a?t.append(await eD(e)):t.append(...await eW(e)),e_(t,i,e,a),t}function eH(){return l('<div class="border"></div>')}function eO(e,a,t){e.expanded.subscribe(t,()=>{a.expanded.value!=e.expanded.value&&(a.expanded.value=e.expanded.value)})}async function eA(){let e=[];if(eS.areDual){e.push(await ez("left"),eH(),await ez("right"));let[a,t,i]=await Promise.all([eS.common(),eS.npOnly(),eS.pOnly()]),n=Math.max(t.length,i.length);for(let t of a)e.push(await eF(t,"left"),eH(),await eF(t,"right"));for(let a=0;a<n;a++){let n,s;t[a]&&(n=await eF(t[a],"left"),e.push(n)),e.push(eH()),i[a]&&(s=await eF(i[a],"right"),e.push(s)),t[a]&&i[a]&&(eO(t[a],i[a],n),eO(i[a],t[a],s))}}else{e.push(await ez("single"));let a=(await eS.variables()).map(e=>eF(e,"single"));e.push(...await Promise.all(a))}return e}async function eC(){let e;eS.variables().catch(async e=>{console.error(e),U(await R("loadFileFinalError")),z.value="load"});let a=l('<main class="main-content"></main>');if(eS.areDual){if(e=l('<section class="dual-container"></section>'),D.value){let e=(await R("loadedFilesSubtitle")).replace("$nVars",(await eS.harmonized()).length);a.append(K(await R("loadedFilesTitle"),e))}}else e=l('<section class="dual-container single"></section>');return e.append(...await er()),e.append(...await eA()),a.append(e),J(a),D.value=!1,eS.subscribe(a,async()=>a.replaceWith(await eC())),a}async function eV(){let e=await ep();return e.querySelector("main").replaceWith(await eC()),e}async function eR(e){let a=await eS.harmonized(),t=l(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await R("biasVar")}</span>
				<select id="bias-var" required${a.length?"":" disabled"}>
					<option value="" hidden>${await R("selectVar")}</option>
				</select>
			</label>
			<button id="estimate" class="button compact" disabled>${await R("getBias")}</button>
		</section>
	</section>`),i=t.querySelector("#bias-var");i.append(...a.map(e=>Q(e.name)));let n=t.querySelector("#estimate");return i.addEventListener("change",()=>{n.disabled=!i.value}),n.onclick=()=>{n.disabled=!0,e(i.value)},t}F.addGlobalListener(()=>eS.refresh()),H.addGlobalListener(()=>eS.refresh()),eS.refresh();const ej=h("altair==5.5.0",!0).then(async()=>{await b(`${v()}assets/charts.py`,"charts.py",!0),await m("import charts",!0)}),eI=new Promise(e=>{document.head.querySelector("[data-id=vegaEmbed]").onload=()=>e()});let eB=[];async function eG(e,a){await eI;let t=(await vegaEmbed(e,a,{renderer:"canvas"})).finalize;setTimeout(()=>eB.push([e,t]))}function eJ(e){if(document.body.contains(e[0]))return!0;e[1]()}async function eU(e,a,t,i){return await ej,eG(i,JSON.parse(await m(`charts.single${"data"in t?"_categorical":""}("${e}", "${a}", ${JSON.stringify(t)})`)))}async function eX(e,a,t,i,n){return await ej,eG(n,JSON.parse(await m(`charts.compared${"data"in t?"_categorical":""}("${e}", ${JSON.stringify(a)}, ${JSON.stringify(t)}, ${JSON.stringify(i)})`)))}async function eK(e,a,t,i){return await ej,eG(i,JSON.parse(await m(`charts.${e}(${JSON.stringify(a)}, ${t})`)))}async function eQ(e,a,t,i){let n=[[e],["",F.value,H.value]];if(i)n.push([await R("mean"),I.format(a.get("mean")),I.format(t.get("mean"))]);else for(let[e,i]of a.entries())n.push([null==e?await R("missing"):e,B.format(i),B.format(t.get(e))]);return[n,2,1]}async function eY(e,a,t,i){let n,s,l,r=[[e],["",await R("biasAbsolute"),await R("biasRelative")]];if(i)n=t.get("mean"),l=(s=a.get("mean")-n)/n,r.push([await R("mean"),I.format(s),B.format(l)]);else for(let[e,i]of a.entries())l=(s=i-(n=t.get(e)))/n,r.push([null==e?await R("missing"):e,I.format(100*s),B.format(l)]);return[r,2,1]}async function eZ(e,a){if(a)return{estimation:e.get("mean")};{let a=await R("missing");return{index:[...e.keys()].map(e=>null==e?a:e),columns:["estimation"],data:[...e.values()].map(e=>[e])}}}async function e0(e){let a=l(`<main class="estimation-results">
		<article>
			<h4>${await R("biasTable")}</h4>
		</article>
		<article>
			<h4>${await R("biasDifference")}</h4>
		</article>
		<article>
			<h4>${await R("biasChart")}</h4>
			<div></div>
		</article>
	</main>`),[t,i,n]=a.querySelectorAll("article"),s=await eS.get(e),[r,o]=await Promise.all([s.npDetails(),s.pDetails()]).then(e=>e.map(e=>new Map(e))),c=s.isNpNumeric;return t.append(Y(...await eQ(e,r,o,c))),i.append(Y(...await eY(e,r,o,c))),eX(e,[F.value,H.value],await eZ(r,c),await eZ(o,c),n.lastElementChild),a}async function e1(){let e=l(`<main class="main-content">
		<header>
			<h2>${await R("biasTitle")}</h2>
			<h3>${F.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await R((await eS.harmonized()).length?"emptyBias":"invalidBias")}</p>
			<img src="images/empty.svg"/>
			<span>${await R("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await X(await R("biasLoading"));e.append(i),i.showModal(),await e0(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),U(await R("biasError")),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await eR(a)),e}async function e4(){let e=await ep();return e.querySelector("main").replaceWith(await e1()),e}setInterval(function(){eB=eB.filter(eJ)},1e3);const e2=h("inps",!0).then(()=>m("import inps",!0));function e3(e,a){return a?`, ${e} = ${JSON.stringify(a)}`:""}async function e5(e,a,t,i,n){await Promise.all([f,e2]),await m(`
		from js import my_totals
		temp_sample, temp_totals = utils.prepare_calibration(${a}, my_totals.to_py()${e3("weights_var",i)})
	`,!1,{my_totals:t});let s=`${e3("weights_column",i)}${e3("population_size",n)}`;await m(`${a}["${e}"] = inps.calibration_weights(temp_sample, temp_totals${s})`),await m("del temp_sample, temp_totals")}async function e6(e,a,t,i,n,s,l,r){await e2;let o=`${e3("weights_column",i)}${e3("population_size",n)}${e3("covariates",s)}`;l&&(o+=", model = inps.boosting_classifier()"),await m(`${a}["${e}"] = inps.${r?"kw":"psa"}_weights(${a}, ${i?`${t}.dropna(subset = "${i}")`:t}${o})${r?"":'["np"]'}`)}async function e7(e,a,t,i,n,s,l){await Promise.all([f,e2]);let r=`${e3("weights_var",a)}${e3("method",t)}${e3("covariates",s)}${e3("p_weights_var",l)}`;return m(`utils.estimation(${i}, '${e}'${n?", p_sample = "+n:""}${r})`)}class e8{constructor(){this.name=R("calibration"),this.title=R("M\xe9todo de calibraci\xf3n"),this.description=R("calibrationDescription"),this.variables=eS.filtered(e=>e.selected.value&&e.hasTotals.value),this.acceptsOrig=!0}async estimate(e,a,t){if(!a&&!t)throw this.errorMsg=R("calibrationMissing"),Error("Info missing");this.errorMsg=R("calibrationError");let i=new Map((await this.variables).map(e=>[e.name,e.getTotals()]));await e5(e,"np_sample",i,t,a),F.event.dispatch()}}class e9{constructor(e,a){this.boosted=e,this.kernels=a;let t=a?"kw":"psa";e&&(t+="Boost"),this.name=R(t),this.title=R(t+"Title"),this.description=R(t+"Description"),this.errorMsg=R(t+"Error"),this.variables=eS.filtered(e=>e.selected.value&&e.isHarmonized),this.acceptsOrig=!1}async estimate(a,t,i){let n=(await this.variables).map(e=>e.name);await e6(a,"np_sample","p_sample",e,t,n,this.boosted,this.kernels),F.event.dispatch()}}const ae=["psa","calibration"];async function aa(){return l(`<main class="main-content">
		<header>
			<h2>${await R("weightTitle")}</h2>
			<h3>${F.value}</h3>
		</header>
		<main class="empty-content">
			<p>${await R("emptyDescription")}</p>
			<img src="images/empty.svg"/>
			<span>${await R("emptyTitle")}</span>
		</main>
	</main>`)}async function at(e){let a=l(`<section class="vars-table">
		<article>${await R("activeVars")}</article>
	</section>`);for(let t of e)a.append(l(`<article>${t}</article>`));return a}async function ai(e){let a=new Set([...e.options].map(e=>e.value));for(let t of ae)if(t=await R(t),a.has(t)){e.value=t;return}}async function an(){let e=l(`<main class="main-content">
		<header>
			<h2>${await R("weightTitle")}</h2>
			<h3>${F.value}</h3>
		</header>
		<form class="weight-form">
			<section class="inputs">
				<label for="method">
					<span>${await R("method")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await R("methodTitle")}</h4>
							<p>${await R("methodDescription")}</p>
						</span>
					</span>
				</label>
				<select id="method" required>
					<option value="" hidden>${await R("methodPlaceholder")}</option>
				</select>
				<article class="extra">
					<span>${await R("methodExplain")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await R("methodExplainTitle")}</h4>
							<p>${await R("methodExplainDescription")}</p>
						</span>
					</span>
				</article>
				<label for="orig-weights" hidden>
					<span>${await R("origWeights")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await R("origWeightsTitle")}</h4>
							<p>${await R("origWeightsDescription")}</p>
						</span>
					</span>
				</label>
				<select id="orig-weights" hidden>
					<option value="">${await R("uniformWeights")}</option>
				</select>
				<label for="pop-size">
					<span>${await R("popSize")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await R("popSizeTitle")}</h4>
							<p>${await R("popSizeDescription")}</p>
						</span>
					</span>
				</label>
				<input id="pop-size" type="number" placeholder="${await R("popSizePlaceholder")}"/>
			</section>
			<section class="vars-table" hidden></section>
			<a hidden>${await R("changeVars")}</a>
			<section class="inputs single">
				<label for="new-var-name">${await R("newVar")}</label>
				<input id="new-var-name" type="text" placeholder="${await R("newVarPlaceholder")}" required/>
			</section>
			<button class="button" type="button">${await R("weightButton")}</button>
		</form>
	</main>`);function t(a){return e.querySelector(a)}let[i,n,s]=["#method",".extra h4",".extra p"].map(t),r=["#orig-weights",'[for="orig-weights"]'].map(t),o=["#pop-size",'[for="pop-size"]'].map(t),c=t(".vars-table + a"),d=t("#new-var-name"),u=t("button"),p=await a;for(let a of(r[0].append(...(await eS.filtered(e=>e.isNpNumeric)).map(e=>l(`<option>${e.name}</option>`))),p&&(o[0].valueAsNumber=p),c.addEventListener("click",()=>z.value="data"),u.onclick=()=>i.reportValidity(),[new e8,new e9,new e9(!0),new e9(!1,!0),new e9(!0,!0)])){let t=await a.variables;if(t.length){let[p,m,h]=await Promise.all([a.name,a.title,a.description]);i.append(l(`<option>${p}</option>`)),i.addEventListener("change",async()=>{i.value==p&&(n.innerHTML=m,s.innerHTML=h,function(e,a,t){e.forEach(e=>e.hidden=!t),e[0].onchange=()=>a.forEach(a=>a.hidden=t&&!!e[0].value),e[0].onchange()}(r,o,a.acceptsOrig),e.querySelector(".vars-table").replaceWith(await at(t.map(e=>e.name))),c.hidden=!1,u.onclick=async()=>{if(d.reportValidity()&&(o[0].hidden||o[0].reportValidity())){let t=await X(await R("weightLoading"));e.append(t),t.showModal(),a.estimate(d.value,o[0].valueAsNumber,r[0].value).then(()=>{D.value=d.value,z.value="eval"}).catch(async e=>{console.error(e),U(await a.errorMsg),t.remove()})}})})}}return await ai(i),i.dispatchEvent(new Event("change")),e}async function as(){return(await eS.variables()).some(e=>e.selected.value)?an():aa()}async function al(){let e=await ep();return e.querySelector("main").replaceWith(await as()),e}async function ar(e,a,t,i=!1){let n=l(`<label>
		<span>${a}</span>
		<select id="${e}" ${i?"disabled":"required"}>
			<option value="" hidden>${await R("selectVar")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>Q(e.name))),n}async function ao(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function ac(e,a){let t=await eS.filtered(e=>e.isNpNumeric),i=l(`<section class="selectors">
		<section class="row">
			<label id="eval-var"></label>
			<div class="divider"></div>
			<label>
				<span>${await R("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<button id="estimate" class="button compact" disabled>${await R("getEval")}</button>
		</section>
	</section>`),[n,s]=["#eval-var","#compare-var"].map(e=>i.querySelector(e));n=await ao(n,ar("eval-var",await R("weightsVar"),t)),s=await ao(s,ar("compare-var",await R("compareVar"),t,!0));let r=i.querySelector("#compare");r.addEventListener("change",()=>{s.disabled=!r.checked});let o=i.querySelector("#estimate");function c(){o.disabled=!n.value||r.checked&&(!s.value||s.value==n.value)}for(let e of[n,r,s])e.addEventListener("change",c);return o.onclick=()=>{o.disabled=!0,e(n.value,r.checked,s.value)},a&&setTimeout(()=>{n.value=a,e(n.value)}),i}async function ad(e,a){return await f,m(`utils.weights_properties(${e}["${a}"])`)}async function au(e,a,t){let i,n,s=["",e];a&&s.push(t);let l=[s];i=ad("np_sample",e),a&&(n=ad("np_sample",t)),[i,n]=await Promise.all([i,n]);for(let e=0;e<i.length;e++){let[t,s]=i[e],r=[await R(t),I.format(s)];a&&r.push(I.format(n[e][1])),l.push(r)}return[l,1,1]}async function ap(e,a,t){let i=l(`<main class="estimation-results">
		<article>
			<h4>${await R("evalProperties")}</h4>
		</article>
		<article>
			<h4>${await R("evalBoxplot")}</h4>
			<div></div>
		</article>
		<article>
			<h4>${await R("evalHistogram")}</h4>
			<div></div>
		</article>
	</main>`),n=[e];a&&n.push(t);let[s,r,o]=i.querySelectorAll("article");return[i,Promise.all([au(e,a,t).then(e=>s.append(Y(...e))),eK("boxplot",n,"np_sample",r.lastElementChild),eK("histogram",n,"np_sample",o.lastElementChild)])]}async function am(){let e=l(`<main class="main-content">
		<header>
			<h2>${await R("evalTitle")}</h2>
			<h3>${F.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await R("emptyEval")}</p>
			<img src="images/empty.svg"/>
			<span>${await R("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await X(await R("evalLoading"));e.append(i),i.showModal(),await ap(...t).then(a=>(e.querySelector("main").replaceWith(a[0]),a[1])).catch(async a=>{console.error(a),U(await R("evalError")),e.querySelector("#estimate").disabled=!1}),i.remove()}if(D.value){let a=(await R("estimatedWeightSubtitle")).replace("$name",D.value);e.prepend(K(await R("estimatedWeightTitle"),a))}return e.querySelector(".selectors").replaceWith(await ac(a,D.value)),D.value=!1,e}async function ah(){let e=await ep();return e.querySelector("main").replaceWith(await am()),e}async function aw(e,a,t,i=!1){let n=l(`<label>
		<span>${a}</span>
		<select id="${e}"${i?" disabled":""}>
			<option value="">${await R("uniformWeights")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>Q(e))),n}async function av(e,a,t,i=!1){let n=l(`<label>
		<span>${a}</span>
		<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await R("estimationMethodDescription")}</span></span>
		<select id="${e}"${i?" disabled":""}>
			<option value="">${await R("noMatching")}</option>
		</select>
	</label>`);return t&&n.querySelector("select").append(Q(await R("linearMatching"),"linear"),Q(await R("boostedMatching"),"boosting")),n}async function ab(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function af(e){let a=l(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await R("targetVar")}</span>
				<select id="target-var" required>
					<option value="" hidden>${await R("selectVar")}</option>
				</select>
			</label>
			<label id="weights-var"></label>
			<label id="estimation-method"></label>
		</section>
		<div class="border"></div>
		<section class="row">
			<label>
				<span>${await R("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<label id="compare-method"></label>
			<button id="estimate" class="button compact" disabled>${await R("estimate")}</button>
		</section>
	</section>`),[t,i,n,s,r,o,c]=["target-var","weights-var","compare-var","estimation-method","compare-method","compare","estimate"].map(e=>a.querySelector("#"+e)),d=await eS.variables(),u=d.filter(e=>e.isNpNumeric).map(e=>e.name);t.append(...d.map(e=>Q(e.name))),i=await ab(i,aw("weights-var",await R("weightsVar"),u)),n=await ab(n,aw("compare-var",await R("compareVar"),u,!0));let p=d.some(e=>e.isHarmonized&&e.selected.value);function m(){c.disabled=!t.value}for(let e of(s=await ab(s,av("estimation-method",await R("estimationMethod"),p)),r=await ab(r,av("compare-method",await R("compareMethod"),p,!0)),o.onchange=()=>{n.disabled=!o.checked,r.disabled=!o.checked},[t,i,n,s,r,o]))e.addEventListener("change",m);return c.onclick=()=>{c.disabled=!0,e(t.value,i.value,s.value,o.checked,n.value,r.value)},a}async function ag(e,a,t){let i="data"in a,n=[[e]],s=t?2:1,l=!!t;if(t){let e=["",await R("mainEstimation"),await R("altEstimation")];i&&e.unshift(""),n.push(e)}let r=i?"percentageEstimation":"numericEstimation",o=i?"pertentageInterval":"numericInterval";[r,o]=await Promise.all([r,o].map(R));let c=i?B:I;if(i){function d(e){return[c.format(e[0]),""]}function u(e){return[e[1],e[2]].map(e=>c.format(e))}for(let e=0;e<a.index.length;e++){let i=[a.index[e],r];i.push(...d(a.data[e]));let s=["",o];if(s.push(...u(a.data[e])),t){let n=t.index.indexOf(a.index[e]);i.push(...d(t.data[n])),s.push(...u(t.data[n]))}n.push(i,s)}}else{let e=[r,c.format(a.estimation),""];t&&e.push(c.format(t.estimation),"");let i=[o,c.format(a.interval_lower),c.format(a.interval_upper)];t&&i.push(c.format(t.interval_lower),c.format(t.interval_upper)),n.push(e,i)}return[n,s,i?2:1,l]}async function ay(a,t,i,n,s,r){let o,c,d;(i||r)&&(d=(await eS.filtered(e=>e.isHarmonized&&e.selected.value)).map(e=>e.name)),o=e7(a,t,i,"np_sample",eS.areDual&&"p_sample",d,e),n&&(c=e7(a,s,r,"np_sample",eS.areDual&&"p_sample",d,e)),[o,c]=await Promise.all([o,c]);let u=l(`<main class="estimation-results">
		<article>
			<h4>${await R(n?"comparedHeader":"estimationHeader")}</h4>
		</article>
		<article>
			<h4>${await R(n?"comparedChartHeader":"estimationChartHeader")}</h4>
			<div></div>
		</article>
	</main>`),[p,m]=u.querySelectorAll("article");p.append(Y(...await ag(a,o,c)));let h=await R("mainEstimation");return n&&(h=[h,await R("altEstimation")]),n?eX(a,h,o,c,m.lastElementChild):eU(a,h,o,m.lastElementChild),u}async function a$(){let e=l(`<main class="main-content">
		<header>
			<h2>${await R("estimationTitle")}</h2>
			<h3>${F.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await R("emptyEstimation")}</p>
			<img src="images/empty.svg"/>
			<span>${await R("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await X(await R("estimationLoading"));e.append(i),i.showModal(),await ay(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),U(await R("estimationError")),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await af(a)),e}async function aS(){let e=await ep();return e.querySelector("main").replaceWith(await a$()),e}async function aE(){let e;scrollTo(0,0);let a=t=n();if("load"==z.value)e=eb();else if("data"==z.value)e=eV();else if("bias"==z.value)e=e4();else if("weight"==z.value)e=al();else if("eval"==z.value)e=ah();else if("estimation"==z.value)e=aS();else throw Error(`Invalid screen: ${z.value}`);e=await e,a==t&&document.querySelector(".main-container > main").replaceWith(e)}z.addGlobalListener(aE),aE();