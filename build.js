let e,a,t,i,n=0;function s(){return n=(n+1)%Number.MAX_SAFE_INTEGER}async function l(e,a){let t=await fetch(e,a);if(t.ok)return t;throw t}function r(e){let a=document.createElement("template");return a.innerHTML=e.trim(),a.content.firstChild}class o{constructor(){this.event=new EventTarget,this.aux=new Event("e")}addListener(e,a){let t=this.event;e.myCallbacks?e.myCallbacks.push(a):e.myCallbacks=[a];let i=[new WeakRef(e),new WeakRef(a)];t.addEventListener("e",function e(){let[a,n]=i.map(e=>e.deref());a&&n&&(document.contains(a)?n():t.removeEventListener("e",e))})}addGlobalListener(e){this.event.addEventListener("e",e)}dispatch(){this.event.dispatchEvent(this.aux)}}class c{constructor(e){this.variable=e,this.event=new o}get value(){return this.variable}set value(e){this.variable=e,this.event.dispatch()}subscribe(e,a){this.event.addListener(e,a)}addGlobalListener(e){this.event.addGlobalListener(e)}}const d=new Worker("assets/webworker.js",{type:"module"}),u=new Map;async function p(){new Promise(e=>setTimeout(e))}async function m(){return new Promise(async e=>{await p(),u.size?d.addEventListener("message",async function a(){await p(),u.size||(d.removeEventListener("message",a),e())}):e()})}async function h(e,a,t){a&&await m();let i=s();return new Promise((a,n)=>{u.set(i,{onSuccess:a,onError:n}),d.postMessage({python:e,id:i,...t})})}async function w(e,a){return h(`
		import micropip
		micropip.install(${JSON.stringify(e)})
	`,a)}function v(e){return`await (await pyfetch("${e}")).memoryview()`}function b(){let e=location.pathname;return e.endsWith("/")?e:e+"/"}async function f(e,a,t){return h(`
		from pyodide.http import pyfetch
		with open("${a}", "wb") as my_file:
			my_file.write(${v(e)})
	`,t)}d.onmessage=function(e){let{id:a,...t}=e.data,{onSuccess:i,onError:n}=u.get(a);u.delete(a),Object.hasOwn(t,"error")?n(t.error):i(t.result)};const g=(async()=>{await f(`${b()}assets/utils.py`,"utils.py"),await h("import utils")})(),y=w("openpyxl");async function $(e,a){await y,await h(`
		from pyodide.http import pyfetch
		from io import BytesIO
		import pandas as pd
		${a} = pd.read_excel(BytesIO(${v(e)}), engine = "openpyxl")
	`)}async function S(e,a){let t=URL.createObjectURL(e);await $(t,a),URL.revokeObjectURL(t)}async function E(e,a){var t,i;let n;await y,await g,t=await h(`utils.to_excel(${e})`),i=`${a}.xlsx`,(n=document.createElement("a")).href=t,n.download=i,document.body.append(n),n.click(),URL.revokeObjectURL(t),n.remove()}async function L(e,a){return S(e,a)}async function k(e,a,t){if("Excel"==t)return E(e,a);throw Error(`Invalid extension: ${t}`)}async function q(e,a){return h(`
		${a} = ${e}
		del ${e}
	`)}async function T(e){return h(`del ${e}`)}async function _(e){return h(`${e}.columns.tolist()`)}async function x(e){return await g,h(`utils.num_vars(${e})`)}function N(e,a){return e&&e!=a?`, "${e}"`:""}async function P(e,a,t){return await g,h(`utils.harmonized_variables(${e}, ${a}${N(t)})`)}async function M(e,a,t,i){return await g,h(`utils.${a?"numeric":"categories"}_details("${e}", ${t}${N(i,e)})`)}async function W(e,a,t,i){await g;let n=await h(`utils.${a?"numeric":"categories"}_inferred_totals("${e}", ${t}${N(i)})`);return a?n:new Map(n)}async function z(e,a){return await g,await h(`utils.pop_total(${e}${N(a)})`)}y.then(()=>h("import openpyxl"));const D=new c("load"),F={value:!1},H=new c,O=new c;class A{constructor(e){this.targetName=e,this.event=new o}subscribe(e,a){this.event.addListener(e,a)}cancel(e){if(this[e]){let a=this[e].id;this[e].loadPromise.then(()=>T(a)),this[e]=null,this.event.dispatch()}}loadTemp(e){this.cancel("temp");let a={id:`temp${s()}`,filename:e.name};return a.loadPromise=L(e,a.id),this.temp=a,this.event.dispatch(),a.loadPromise.then(()=>{a.id==this.temp?.id&&(a.loaded=!0,this.event.dispatch())}).catch(e=>{if(a.id==this.temp?.id)throw console.error(e),this.temp=null,this.event.dispatch(),e})}confirmTemp(){this.cancel("final"),this.final=this.temp,this.temp=null,this.event.dispatch()}confirmFinal(){let a=this.final;return this.final=null,this.event.dispatch(),q(a.id,this.targetName).then(()=>{let t=a.filename.replace(/\.[^.]+$/,"");if("np_sample"==this.targetName)H.value=t;else if("p_sample"==this.targetName)e=a.weights,O.value=t;else throw Error(`Invalid name: ${this.targetName}`)})}}const C=new A("np_sample"),V=new A("p_sample");for(let e of[C,V])D.addGlobalListener(()=>e.cancel("final"));O.addGlobalListener(()=>{a=O.value&&z("p_sample",e)});const B=l("assets/texts.json").then(e=>e.json());async function j(e){return B.then(a=>a[e])}const R={maximumFractionDigits:2,minimumFractionDigits:2,maximumSignificantDigits:1,minimumSignificantDigits:1,roundingPriority:"morePrecision"},G=Intl.NumberFormat(void 0,R);R.style="percent";const I=Intl.NumberFormat(void 0,R);function J(e){let a=!1;return()=>{a||(a=!0,setTimeout(()=>{a=!1,e()}))}}function U(e){for(let a of e.querySelectorAll("dialog"))a.querySelector(".close-button").onclick=()=>a.close()}async function K(e){let a=r(`<dialog class="modal error">
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
		<img src="images/error.svg">
		<article>
			<h4>${await j("error")}</h4>
			<p>${e}</p>
		</article>
		<button class="button" autofocus>${await j("acceptError")}</button>
	</dialog>`);a.querySelectorAll("button").forEach(e=>e.addEventListener("click",()=>a.close())),a.addEventListener("close",()=>a.remove()),document.body.append(a),a.showModal()}async function X(e){let a=r(`<dialog class="modal loading">
		<img src="images/loading.svg"/>
		<p>${await j("loading")}</p>
		<p>${e}</p>
	</dialog>`);return a.addEventListener("cancel",e=>e.preventDefault()),a.addEventListener("close",()=>a.showModal()),a}function Q(e,a){let t=r(`<article class="feedback">
		<img src="images/check-circle.svg"/>
		<div>
			<h3>${e}</h3>
			<p>${a}</p>
		</div>
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
	</article>`);return t.querySelector(".close-button").addEventListener("click",()=>t.remove()),t}function Y(e,a){return r(`<option${a?` value="${a}"`:""}>${e}</option>`)}function Z(e,a,t,i){let n=r(`<section class="estimation-table" style="--columns: ${e[e.length-1].length}"></section>`);for(let s=0;s<e.length;s++){let l=e[s],o=r(`<div class="row${s<a?" titles":""}"></div>`);for(let e=0;e<l.length;e++){let n=r(`<article>${l[e]}</article>`);(s<a||e<t)&&(n.classList.add("title"),i&&s==a-1&&e>=l.length-2&&n.classList.add("expanded")),o.append(n)}n.append(o)}return n}const ee=[C,V];function ea(e,a){let t,i=r(e[a]?`<article class="uploaded-file">
			<span>${e[a].filename}</span>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
			<progress ${e[a].loaded?'value = "1"':""}></progress>
		</article>`:'<article class="uploaded-file" hidden></article>');return i.querySelector(".close-button")?.addEventListener("click",()=>e.cancel(a)),e.subscribe(i,()=>i.replaceWith(ea(e,a))),i}async function et(e){let a=r(`<select name="weights-var">
		<option value="">${await j("noWeights")}</option>
	</select>`);return e?a.append(...e.map(e=>r(`<option>${e}</option>`))):a.disabled=!0,a}async function ei(e){let a=r(`<section class="modal-input">
		<div class="modal-input-top">
			<h4>${await j("loadFile2Subaction")}</h4>
			<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await j("loadFile2SubactionHelp")}</span></span>
		</div>
		<select></select>
		<p>${await j("loadFile2SubactionSubtitle")}</p>
	</section>`);async function t(e){let t=await et(e);return a.querySelector("select").replaceWith(t),t}return t(),e.subscribe(a,async()=>{let a=e.temp;if(a?.loaded){let i=await x(a.id);if(a.id==e.temp?.id){let e=await t(i);e.addEventListener("change",()=>a.weights=e.value)}}else t()}),a}async function en(e){let a=r(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await j("loadFile"+e+"Title")}</h3>
				<p>${await j("loadFile"+e+"Subtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input padded">
			<div class="modal-input-top">
				<h4>${await j("loadFile"+e+"Action")}</h4>
				<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await j("loadFile"+e+"ActionHelp")}</span></span>
			</div>
			<label class="button reversed">
				<span class="large icon"><img src="images/upload.svg" data-inline/></span>
				<span>${await j("fileButton")}</span>
				<input name="file${e}" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" autofocus/>
			</label>
			<p>${await j("fileButtonSubtitle")}</p>
		</section>
		<article class="uploaded-file" hidden></article>
		<section class="buttons-row">
			<button class="button reversed minimal">${await j("cancel")}</button>
			<button class="button" disabled>${await j("fileButton")}</button>
		</section>
	</dialog>`),t=ee[e-1];a.querySelector(".button.reversed.minimal").addEventListener("click",()=>a.close());let i=a.querySelector("input[type=file]");i.addEventListener("change",()=>{t.loadTemp(i.files[0]).catch(async e=>K(await j("loadFileError")))}),i.addEventListener("click",()=>i.value=""),a.querySelector(".uploaded-file").replaceWith(ea(t,"temp"));let n=a.querySelector(".buttons-row > .button:last-of-type");return t.subscribe(n,()=>n.disabled=!t.temp?.loaded),n.addEventListener("click",()=>{t.confirmTemp(),a.close()}),2==e&&a.querySelector(".uploaded-file").after(await ei(t)),a.addEventListener("close",()=>t.cancel("temp")),a}async function es(e){let a=r(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await j(`loadOption${e}`)}</h3>
		<p>${await j(`loadOption${e}Subtitle`)}</p>
		<article class="radio-file">
			<img src="images/empty.svg"/>
			<p>${await j("fileSelect")}</p>
			<article class="uploaded-file" hidden></article>
			<button class="button small"><span class="icon"><img src="images/upload.svg" data-inline/></span><span>${await j("fileButton")}</span></button>
		</article>
	</label>`),t=ee[e-1];a.querySelector(".radio-file").append(await en(e)),a.querySelector(".uploaded-file").replaceWith(ea(t,"final"));let i=a.querySelector(".button:has(+ dialog)");i.addEventListener("click",()=>i.nextElementSibling.showModal());let n=new c(t.final?.loaded);return t.subscribe(a,()=>n.value=t.final?.loaded),n.subscribe(i,()=>i.disabled=n.value),[a,n,()=>t.confirmFinal()]}async function el(e){let a=r(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await j(`download${e}Title`)}</h3>
				<p>${await j(`download${e}Subtitle`)}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await j("downloadFilename")}</h4>
			</div>
			<input name="filename" type="text" autofocus/>
		</section>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await j("downloadFormat")}</h4>
			</div>
			<select name="format" class="big">
				<option value="" hidden>${await j("downloadFormatPlaceholder")}</option>
				<option>Excel</option>
			</select>
		</section>
		<section class="buttons-row">
			<button class="button reversed minimal">${await j("cancel")}</button>
			<button class="button" disabled>${await j("downloadConfirm")}</button>
		</section>
	</dialog>`),t=a.querySelector("input"),i=a.querySelector("select"),[n,s]=a.querySelectorAll(".button");function l(){s.disabled=!(t.value&&i.value)}return t.addEventListener("input",l),i.addEventListener("change",l),n.addEventListener("click",()=>a.close()),s.addEventListener("click",async()=>{let n=await X(await j("downloadLoading"));a.append(n),n.showModal(),k(1==e?"np_sample":"p_sample",t.value,i.value).then(()=>{a.close()}).catch(async e=>{console.error(e),K(await j("downloadError"))}).finally(()=>n.remove())}),l(),a}async function er(a){if("left"==a||"right"==a){let t="left"==a?1:2,i=await j(`loadFile${t}Title`),n="left"==a?H.value:O.value,s=r(`<header class="dual-header ${a}">
			<h2>${i}</h2>
			<label>
				<span>${await j("actions")}</span>
				<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
				<input type="checkbox" hidden/>
				<nav class="dropdown from-button">
					<a>${await j("loadNewData")}</a>
					<a>${await j("downloadData")}</a>
				</nav>
			</label>
			<p>${n}</p>
			<div class="border"></div>
		</header>`);"right"==a&&s.append(r(`<article>
				<span>${await j("weightsVar")}</span>
				<span>${e||await j("noWeights")}</span>
			</article>`));let l=s.querySelectorAll("nav > a"),o=await Promise.all([en(t),el(t)]),c=ee[t-1];c.subscribe(s,async()=>{if(c.final){let e=await X(await j("loadFileLoading"));s.append(e),e.showModal(),c.confirmFinal()}});for(let e=0;e<o.length;e++)s.append(o[e]),l[e].addEventListener("click",()=>o[e].showModal());return s}if("single"==a)return r(`<header class="single-header"><h2>${await j("loadFile1Title")}</h2><p>${H.value}</p></header>`);throw Error(`Invalid type: ${a}`)}async function eo(){let e=[];return O.value?e.push(await er("left"),r('<div class="border"></div>'),await er("right")):e.push(await er("single")),e}const ec=["load","data","bias","weight","eval","estimation"];async function ed(e,a){let t=r('<nav class="tabs"></nav>');t.append(...await Promise.all(ec.map(async e=>r(`<button>${await j(e+"Tab")}</button>`)))),e=ec.indexOf(e),t.children[e].classList.add("active");for(let i=0;i<t.children.length;i++){let n=t.children[i];n.addEventListener("click",()=>D.value=ec[i]),a||i==e||(n.disabled=!0)}return t}async function eu(e,a,t){let i=r(`<a>${await j("export"+t)}</a>`),n=await el(t);e.append(i),a.append(n),i.addEventListener("click",()=>n.showModal())}async function ep(){let e=r(`<article class="main-title-buttons">
		<label class="dropdown-button">
			<span>${await j("download")}</span>
			<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
			<input type="checkbox" hidden/>
			<nav class="dropdown from-button color"></nav>
		</label>
	</article>`),a=e.querySelector(".dropdown");return H.value&&await eu(a,e,1),O.value&&await eu(a,e,2),U(e),e}async function em(){let e=r(`<main class="main-section">
		<nav class="breadcrumb">
			<a><img src="images/home.svg" data-inline/><span>${await j("home")}</span></a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await j("projectsTab")}</a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await j("defaultProject")}</a>
		</nav>
		<section class="main-title">
			<article class="main-title-text">
				<h1>${await j("defaultProject")}</h1>
				<p>${await j("defaultProjectDesc")}</p>
			</article>
		</section>
		<nav class="tabs"></nav>
		<main></main>
	</main>`);return e.querySelector(".tabs").replaceWith(await ed(D.value,H.value)),H.value&&e.querySelector(".main-title").append(await ep()),e}async function eh(e){let a=r(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await j("noFileTitle")}</h3>
		<p>${await j("noFileSubtitle")}</p>
		<article class="radio-file">
			<img src="images/data.svg"/>
			<p>${await j("noFileSubSubtitle")}</p>
			<button class="button small adjusted"><span>${await j("noFileConfirm")}</span><span class="icon"><img src="images/arrow-right.svg" data-inline/></span></button>
		</article>
	</label>`),t=a.querySelector("button");t.addEventListener("click",()=>{t.disabled=!0,e.click()});let i=async()=>{O.value&&(await T("p_sample"),O.value=null)};return[a,new c(!0),i]}const ew=[,,];async function ev(e){return 1==e?`<button class="button" disabled>${await j("next")}</button>`:`<section class="buttons-row">
			<button class="button reversed minimal">${await j("back")}</button>
			<button class="button" disabled>${await j("loadFileConfirm")}</button>
		</section>`}async function eb(e=1){let a=r(`<main class="main-content">
		<header>
			<h2>${await j("loadTitle")}</h2>
			<p>${await j("loadSubtitle")}</p>
		</header>
		<main class="data-load-content">
			<article class="stepper">
				<span class="step-icon active">${1==e?1:'<img src="images/check.svg"/>'}</span>
				<span class="step-text active">${await j("loadStep1")}</span>
				<img src="images/stepper.svg"/>
				<span class="step-icon ${2==e?"active":""}">2</span>
				<span class="step-text ${2==e?"active":""}">${await j("loadStep2")}</span>
			</article>
			${await ev(e)}
			<label class="radio-label"></label>
			${await ev(e)}
		</main>`),t=a.querySelectorAll(".data-load-content > .button, .data-load-content > .buttons-row > .button:last-of-type"),i=a.querySelector(".radio-label"),n=[es(e)];for(let[a,l,r]of(2==e&&n.push(eh(t[0])),n=await Promise.all(n),i.after(...n.map(e=>e[0])),n)){let i=a.querySelector("input");for(let a of t){function s(){i.checked&&(a.disabled=!l.value,ew[e-1]=r)}i.addEventListener("change",s),l.subscribe(a,s)}}for(let i of t)i.addEventListener("click",async()=>{if(i.disabled=!0,e<2)a.replaceWith(await eb(e+1));else{let e=await X(await j("loadFileLoading"));a.append(e),e.showModal(),await Promise.all(ew.map(e=>e())),F.value=!0,D.value="data"}});return a.querySelectorAll(".data-load-content > .buttons-row > .button:first-of-type").forEach(t=>{t.addEventListener("click",async()=>{t.disabled=!0,a.replaceWith(await eb(e-1))})}),i.remove(),U(a),a}async function ef(){let e=await em();return e.querySelector("main").replaceWith(await eb()),e}let eg=new class{constructor(){this.cache=new Map}set(e,a){this.cache.set(a.name,e),a.hasTotals.value=!0}delete(e){this.cache.delete(e.name),e.hasTotals.value=!1}async verify(e,a){let t=await a.npDetails();return!t.some(e=>null==e[0])&&(a.isNpNumeric?"number"==typeof e:t.length==e.size&&t.every(a=>e.has(a[0])))}async refresh(e){let a=this.cache;for(let t of(this.cache=new Map,e)){let e=a.get(t.name);e&&await this.verify(e,t)&&this.set(e,t)}}},ey=new class{constructor(){this.cache=new Set}refresh(e){let a=this.cache;for(let t of(this.cache=new Set,e))t.selected.addGlobalListener(()=>{t.selected.value?this.cache.add(t.name):this.cache.delete(t.name)}),t.selected.value=t.selectable.value&&a.has(t.name)}};class e${static baseProperties=["name","inNp","inP","isNpNumeric","isPNumeric","isHarmonized","harmonReason","pWeights"];constructor(e){for(let a of e$.baseProperties)this[a]=e[a];this.selected=new c(!1),this.expanded=new c(!1),this.hasTotals=new c(!1),this.selectable=new c(this.isHarmonized),this.hasTotals.addGlobalListener(()=>this.selectable.value=this.isHarmonized||this.hasTotals.value),this.selectable.addGlobalListener(()=>{this.selected.value&&!this.selectable.value&&(this.selected.value=!1)})}async npDetails(){return this.npCache||(this.npCache=M(this.name,this.isNpNumeric,"np_sample")),this.npCache}async pDetails(){return this.pCache||(this.pCache=M(this.name,this.isPNumeric,"p_sample",e)),this.pCache}async inferredTotals(){return this.inferredCache||(this.inferredCache=W(this.name,this.isPNumeric,"p_sample",e)),this.inferredCache}getTotals(){return eg.cache.get(this.name)}setTotals(e){eg.set(e,this)}deleteTotals(){eg.delete(this)}}class eS{constructor(){this.event=new o}subscribe(e,a){this.event.addListener(e,a)}async variables(){return this.cache||(this.cache=this.variablesPromise().then(async e=>(await eg.refresh(e),ey.refresh(e),e))),this.cache}async filtered(e){return(await this.variables()).filter(e)}async harmonized(){return this.filtered(e=>e.isHarmonized)}async common(){return this.filtered(e=>e.inNp&&e.inP)}async npOnly(){return this.filtered(e=>e.inNp&&!e.inP)}async pOnly(){return this.filtered(e=>!e.inNp&&e.inP)}async get(e){return(await this.variables()).find(a=>a.name==e)}static async fromHarmonization(){let a=e,[t,i,n]=await Promise.all([P("np_sample","p_sample",a),x("np_sample"),x("p_sample")]);[i,n]=[i,n].map(e=>new Set(e));let s=[];function l(e){return new e$({pWeights:a,isNpNumeric:i.has(e.name),isPNumeric:n.has(e.name),...e})}s.push(...t.harmonized.map(e=>l({name:e,inNp:!0,inP:!0,isHarmonized:!0}))),s.push(...t.nonharmonized.map(e=>l({name:e.name,inNp:!0,inP:!0,isHarmonized:!1,harmonReason:e.reason})));for(let e=0;e<2;e++)s.push(...t.unrelated[e].map(a=>l({name:a,inNp:0==e,inP:1==e,isHarmonized:!1})));return s}static async fromData(){let[e,a]=[_("np_sample"),x("np_sample")];return a=new Set(await a),(await e).map(e=>new e$({name:e,inNp:!0,inP:!1,isNpNumeric:a.has(e)}))}refresh(){H.value?O.value?(this.areDual=!0,this.variablesPromise=eS.fromHarmonization):(this.areDual=!1,this.variablesPromise=eS.fromData):(this.areDual=null,this.variablesPromise=null),this.cache=null,this.event.dispatch()}}const eE=new eS;async function eL(e){return[await j("missing"),I.format(e[1])]}async function ek(e){return null==e[0]?eL(e):[await j(e[0]),G.format(e[1])]}async function eq(e){return null==e[0]?eL(e):[e[0],I.format(e[1])]}async function eT(e,a){return Promise.all(e.map(a?ek:eq))}function e_(e,a,t,i){if(!e.hasDetails&&a.checked){e.hasDetails=!0;let a="right"==i?t.pDetails():t.npDetails(),n="right"==i?t.isPNumeric:t.isNpNumeric,s=r('<section class="details"></section>');a.then(async a=>{a=await eT(a,n),s.append(...a.map(e=>r(`<article><span>${e[0]}</span><span>${e[1]}</span></article>`))),e.append(s)})}}async function ex(e){let a=r('<button class="button reversed"></button>');async function t(){a.innerHTML=e.hasTotals.value?await j("editTotals"):await j("insertTotals")}return e.hasTotals.subscribe(a,t),t(),a}function eN(e,a,t){let i=[r(`<span>${e}</span>`),r('<label><input type="number" step="any" required/></label>')],n=i[1].querySelector("input");return a&&(n.valueAsNumber=a),t&&(n.readOnly=!0),i}async function eP(e){let a=await e.npDetails(),t=r(`<section class="totals-container${e.isHarmonized?"":" single"}" style="--items: ${e.isNpNumeric?1:a.length}">
		<article class="totals-article">
			<h4>${await j("totals1")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>
	</section>`),i=t.querySelector(".totals-items"),n=e.getTotals();if(e.isNpNumeric)i.append(...eN(await j("total"),n));else for(let[e]of a)i.append(...eN(e,n?.get(e)));if(e.isHarmonized){let n=r(`<article class="totals-article">
			<h4>${await j("totals2")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>`);t.append(n),n=n.querySelector(".totals-items");let s=await e.inferredTotals();if(e.isPNumeric)n.append(...eN(await j("total"),s,!0));else for(let[e,a]of s)n.append(...eN(e,a,!0));let l=r(`<button class="button reversed">${await j("inferTotals")}</button>`);l.addEventListener("click",()=>(function(e,a,t,i){let n=e.querySelectorAll("input");if(i)n[0].valueAsNumber=t;else for(let e=0;e<a.length;e++)n[e].valueAsNumber=t.get(a[e][0])})(i,a,s,e.isPNumeric)),t.querySelector(".totals-article").append(l)}return t}async function eM(e,a,t){let i=[...e.querySelectorAll("input")];if(i.every(e=>!e.value))a.deleteTotals(),t.close();else if(i.every(e=>e.reportValidity())){if(a.isNpNumeric)a.setTotals(i[0].valueAsNumber);else{let e=await a.npDetails();a.setTotals(new Map(e.map((e,a)=>[e[0],i[a].valueAsNumber])))}t.close()}}async function eW(e){let a=r(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await j("editTotals")}</h3>
				<p>${await j("editTotalsSubtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="totals-container"></section>
		<section class="buttons-row">
			<button class="button reversed minimal" disabled>${await j("deleteTotals")}</button>
			<section>
				<button class="button reversed minimal">${await j("cancel")}</button>
				<button class="button" disabled>${await j("setTotals")}</button>
			</section>
		</section>
	</dialog>`),[t,i,n]=a.querySelectorAll(".button");return a.addEventListener("open",async()=>{(await e.npDetails()).some(e=>null==e[0])?(K(await j("missingError")),a.close()):(a.querySelector(".totals-container").replaceWith(await eP(e)),n.disabled=!1,t.disabled=!1)}),i.addEventListener("click",()=>a.close()),n.addEventListener("click",()=>eM(a.querySelector(".totals-items"),e,a)),t.addEventListener("click",()=>{a.querySelector(".totals-items").querySelectorAll("input").forEach(e=>e.value="")}),a}async function ez(e){let a=await ex(e),t=await eW(e);return a.addEventListener("click",()=>{t.showModal(),t.dispatchEvent(new Event("open"))}),[a,t]}async function eD(e){let a=r(`<header class="variable header">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${await j("variables")}</span>
	</header>`);"single"!=e&&a.classList.add(e),"right"!=e&&a.querySelector(".border").after(r(`<label class="checkbox icon">
			<input type="checkbox" hidden/>
			<img src="images/check.svg"/>
		</label>`));let t=await eE.filtered(a=>a["right"==e?"inP":"inNp"]),[i,n]=a.querySelectorAll("input");i.addEventListener("change",()=>{t.forEach(e=>{e.expanded.value!=i.checked&&(e.expanded.value=i.checked)})}),n?.addEventListener("change",()=>{t.forEach(e=>{e.selectable.value&&e.selected.value!=n.checked&&(e.selected.value=n.checked)})});let s=J(()=>i.checked=t.every(e=>e.expanded.value)),l=J(()=>{let e=t.filter(e=>e.selectable.value);n.checked=e.length&&e.every(e=>e.selected.value)});for(let e of t)e.expanded.subscribe(a,s),n&&(e.selected.subscribe(a,l),e.selectable.subscribe(a,l));return s(),n&&l(),a}async function eF(e){let a=r('<article class="variable-status"></article>');return e.isHarmonized?a.innerHTML='<img width="24" height="24" src="images/check-circle.svg"/>':e.harmonReason?a.innerHTML=`<span class="lead left"><img src="images/lead.svg"/><span class="tooltip">${await j(e.harmonReason+"Reason")}</span></span><img src="images/check-yellow.svg"/>`:a.innerHTML='<img src="images/block.svg"/>',a}async function eH(e,a){let t=r(`<article class="variable view ${"single"!=a?a:""} ${e.isHarmonized?"harmonized":""}">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${e.name}</span>
	</article>`),i=t.querySelector("input");if(i.checked=e.expanded.value,i.addEventListener("change",()=>e.expanded.value=i.checked),e.expanded.subscribe(t,()=>{i.checked=e.expanded.value,e_(t,i,e,a)}),"right"!=a){let a,i;t.querySelector(".border").after(((i=(a=r(`<label class="checkbox icon">
		<input type="checkbox" hidden/>
		<img src="images/check.svg"/>
	</label>`)).querySelector("input")).checked=e.selected.value,i.disabled=!e.selectable.value,i.addEventListener("change",()=>e.selected.value=i.checked),e.selected.subscribe(a,()=>i.checked=e.selected.value),e.selectable.subscribe(a,()=>i.disabled=!e.selectable.value),a))}return"right"==a?t.append(await eF(e)):t.append(...await ez(e)),e_(t,i,e,a),t}function eO(){return r('<div class="border"></div>')}function eA(e,a,t){e.expanded.subscribe(t,()=>{a.expanded.value!=e.expanded.value&&(a.expanded.value=e.expanded.value)})}async function eC(){let e=[];if(eE.areDual){e.push(await eD("left"),eO(),await eD("right"));let[a,t,i]=await Promise.all([eE.common(),eE.npOnly(),eE.pOnly()]),n=Math.max(t.length,i.length);for(let t of a)e.push(await eH(t,"left"),eO(),await eH(t,"right"));for(let a=0;a<n;a++){let n,s;t[a]&&(n=await eH(t[a],"left"),e.push(n)),e.push(eO()),i[a]&&(s=await eH(i[a],"right"),e.push(s)),t[a]&&i[a]&&(eA(t[a],i[a],n),eA(i[a],t[a],s))}}else{e.push(await eD("single"));let a=(await eE.variables()).map(e=>eH(e,"single"));e.push(...await Promise.all(a))}return e}async function eV(){let e;eE.variables().catch(async e=>{console.error(e),K(await j("loadFileFinalError")),D.value="load"});let a=r('<main class="main-content"></main>');if(eE.areDual){if(e=r('<section class="dual-container"></section>'),F.value){let e=(await j("loadedFilesSubtitle")).replace("$nVars",(await eE.harmonized()).length);a.append(Q(await j("loadedFilesTitle"),e))}}else e=r('<section class="dual-container single"></section>');return e.append(...await eo()),e.append(...await eC()),a.append(e),U(a),F.value=!1,eE.subscribe(a,async()=>a.replaceWith(await eV())),a}async function eB(){let e=await em();return e.querySelector("main").replaceWith(await eV()),e}async function ej(e){let a=await eE.harmonized(),t=r(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await j("biasVar")}</span>
				<select id="bias-var" required${a.length?"":" disabled"}>
					<option value="" hidden>${await j("selectVar")}</option>
				</select>
			</label>
			<button id="estimate" class="button compact" disabled>${await j("getBias")}</button>
		</section>
	</section>`),i=t.querySelector("#bias-var");i.append(...a.map(e=>Y(e.name)));let n=t.querySelector("#estimate");return i.addEventListener("change",()=>{n.disabled=!i.value}),n.onclick=()=>{n.disabled=!0,e(i.value)},t}H.addGlobalListener(()=>eE.refresh()),O.addGlobalListener(()=>eE.refresh()),eE.refresh();const eR=w("altair==5.5.0",!0).then(async()=>{await f(`${b()}assets/charts.py`,"charts.py",!0),await h("import charts",!0)}),eG=new Promise(e=>{document.head.querySelector("[data-id=vegaEmbed]").onload=()=>e()});let eI=[];async function eJ(e,a){await eG;let t=(await vegaEmbed(e,a,{renderer:"canvas"})).finalize;setTimeout(()=>eI.push([e,t]))}function eU(e){if(document.body.contains(e[0]))return!0;e[1]()}async function eK(e,a,t,i){return await eR,eJ(i,JSON.parse(await h(`charts.single${"data"in t?"_categorical":""}("${e}", "${a}", ${JSON.stringify(t)})`)))}async function eX(e,a,t,i,n){return await eR,eJ(n,JSON.parse(await h(`charts.compared${"data"in t?"_categorical":""}("${e}", ${JSON.stringify(a)}, ${JSON.stringify(t)}, ${JSON.stringify(i)})`)))}async function eQ(e,a,t,i){return await eR,eJ(i,JSON.parse(await h(`charts.${e}(${JSON.stringify(a)}, ${t})`)))}async function eY(e,a,t,i){let n=[[e],["",H.value,O.value]];if(i)n.push([await j("mean"),G.format(a.get("mean")),G.format(t.get("mean"))]);else for(let[e,i]of a.entries())n.push([null==e?await j("missing"):e,I.format(i),I.format(t.get(e))]);return[n,2,1]}async function eZ(e,a,t,i){let n,s,l,r=[[e],["",await j("biasAbsolute"),await j("biasRelative")]];if(i)n=t.get("mean"),l=(s=a.get("mean")-n)/n,r.push([await j("mean"),G.format(s),I.format(l)]);else for(let[e,i]of a.entries())l=(s=i-(n=t.get(e)))/n,r.push([null==e?await j("missing"):e,G.format(100*s),I.format(l)]);return[r,2,1]}async function e0(e,a){if(a)return{estimation:e.get("mean")};{let a=await j("missing");return{index:[...e.keys()].map(e=>null==e?a:e),columns:["estimation"],data:[...e.values()].map(e=>[e])}}}async function e1(e){let a=r(`<main class="estimation-results">
		<article>
			<h4>${await j("biasTable")}</h4>
		</article>
		<article>
			<h4>${await j("biasDifference")}</h4>
		</article>
		<article>
			<h4>${await j("biasChart")}</h4>
			<div></div>
		</article>
	</main>`),[t,i,n]=a.querySelectorAll("article"),s=await eE.get(e),[l,o]=await Promise.all([s.npDetails(),s.pDetails()]).then(e=>e.map(e=>new Map(e))),c=s.isNpNumeric;return t.append(Z(...await eY(e,l,o,c))),i.append(Z(...await eZ(e,l,o,c))),eX(e,[H.value,O.value],await e0(l,c),await e0(o,c),n.lastElementChild),a}async function e4(){let e=r(`<main class="main-content">
		<header>
			<h2>${await j("biasTitle")}</h2>
			<h3>${H.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await j((await eE.harmonized()).length?"emptyBias":"invalidBias")}</p>
			<img src="images/empty.svg"/>
			<span>${await j("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await X(await j("biasLoading"));e.append(i),i.showModal(),await e1(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),K(await j("biasError")),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await ej(a)),e}async function e2(){let e=await em();return e.querySelector("main").replaceWith(await e4()),e}setInterval(function(){eI=eI.filter(eU)},1e3);const e3=w("inps",!0).then(()=>h("import inps",!0));function e5(e,a){return a?`, ${e} = ${JSON.stringify(a)}`:""}async function e6(e,a,t,i,n){await Promise.all([g,e3]),await h(`
		from js import my_totals
		temp_sample, temp_totals = utils.prepare_calibration(${a}, my_totals.to_py()${e5("weights_var",i)})
	`,!1,{my_totals:t});let s=`${e5("weights_column",i)}${e5("population_size",n)}`;await h(`${a}["${e}"] = inps.calibration_weights(temp_sample, temp_totals${s})`),await h("del temp_sample, temp_totals")}async function e7(e,a,t,i,n,s,l,r){await e3;let o=`${e5("weights_column",i)}${e5("population_size",n)}${e5("covariates",s)}`;l&&(o+=", model = inps.boosting_classifier()"),await h(`${a}["${e}"] = inps.${r?"kw":"psa"}_weights(${a}, ${i?`${t}.dropna(subset = "${i}")`:t}${o})${r?"":'["np"]'}`)}async function e8(e,a,t,i,n,s,l){await Promise.all([g,e3]);let r=`${e5("weights_var",a)}${e5("method",t)}${e5("covariates",s)}${e5("p_weights_var",l)}`;return h(`utils.estimation(${i}, '${e}'${n?", p_sample = "+n:""}${r})`)}class e9{constructor(){this.name=j("calibration"),this.title=j("calibrationTitle"),this.description=j("calibrationDescription"),this.variables=eE.filtered(e=>e.selected.value&&e.hasTotals.value),this.acceptsOrig=!0}async estimate(e,a,t){if(!a&&!t)throw this.errorMsg=j("calibrationMissing"),Error("Info missing");this.errorMsg=j("calibrationError");let i=new Map((await this.variables).map(e=>[e.name,e.getTotals()]));await e6(e,"np_sample",i,t,a),H.event.dispatch()}}class ae{constructor(e,a){this.boosted=e,this.kernels=a;let t=a?"kw":"psa";e&&(t+="Boost"),this.name=j(t),this.title=j(t+"Title"),this.description=j(t+"Description"),this.errorMsg=j(t+"Error"),this.variables=eE.filtered(e=>e.selected.value&&e.isHarmonized),this.acceptsOrig=!1}async estimate(a,t,i){let n=(await this.variables).map(e=>e.name);await e7(a,"np_sample","p_sample",e,t,n,this.boosted,this.kernels),H.event.dispatch()}}const aa=["psa","calibration"];async function at(){return r(`<main class="main-content">
		<header>
			<h2>${await j("weightTitle")}</h2>
			<h3>${H.value}</h3>
		</header>
		<main class="empty-content">
			<p>${await j("emptyDescription")}</p>
			<img src="images/empty.svg"/>
			<span>${await j("emptyTitle")}</span>
		</main>
	</main>`)}async function ai(e){let a=r(`<section class="vars-table">
		<article>${await j("activeVars")}</article>
	</section>`);for(let t of e)a.append(r(`<article>${t}</article>`));return a}async function an(e){let a=new Set([...e.options].map(e=>e.value));for(let t of aa)if(t=await j(t),a.has(t)){e.value=t;return}}async function as(){let e=r(`<main class="main-content">
		<header>
			<h2>${await j("weightTitle")}</h2>
			<h3>${H.value}</h3>
		</header>
		<form class="weight-form">
			<section class="inputs">
				<label for="method">
					<span>${await j("method")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await j("methodTitle")}</h4>
							<p>${await j("methodDescription")}</p>
						</span>
					</span>
				</label>
				<select id="method" required>
					<option value="" hidden>${await j("methodPlaceholder")}</option>
				</select>
				<article class="extra">
					<span>${await j("methodExplain")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await j("methodExplainTitle")}</h4>
							<p>${await j("methodExplainDescription")}</p>
						</span>
					</span>
				</article>
				<label for="orig-weights" hidden>
					<span>${await j("origWeights")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await j("origWeightsTitle")}</h4>
							<p>${await j("origWeightsDescription")}</p>
						</span>
					</span>
				</label>
				<select id="orig-weights" hidden>
					<option value="">${await j("uniformWeights")}</option>
				</select>
				<label for="pop-size">
					<span>${await j("popSize")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await j("popSizeTitle")}</h4>
							<p>${await j("popSizeDescription")}</p>
						</span>
					</span>
				</label>
				<input id="pop-size" type="number" placeholder="${await j("popSizePlaceholder")}"/>
			</section>
			<section class="vars-table" hidden></section>
			<a hidden>${await j("changeVars")}</a>
			<section class="inputs single">
				<label for="new-var-name">${await j("newVar")}</label>
				<input id="new-var-name" type="text" placeholder="${await j("newVarPlaceholder")}" required/>
			</section>
			<button class="button" type="button">${await j("weightButton")}</button>
		</form>
	</main>`);function t(a){return e.querySelector(a)}let[i,n,s]=["#method",".extra h4",".extra p"].map(t),l=["#orig-weights",'[for="orig-weights"]'].map(t),o=["#pop-size",'[for="pop-size"]'].map(t),c=t(".vars-table + a"),d=t("#new-var-name"),u=t("button"),p=await a;for(let a of(l[0].append(...(await eE.filtered(e=>e.isNpNumeric)).map(e=>r(`<option>${e.name}</option>`))),p&&(o[0].valueAsNumber=p),c.addEventListener("click",()=>D.value="data"),u.onclick=()=>i.reportValidity(),[new e9,new ae,new ae(!0),new ae(!1,!0),new ae(!0,!0)])){let t=await a.variables;if(t.length){let[p,m,h]=await Promise.all([a.name,a.title,a.description]);i.append(r(`<option>${p}</option>`)),i.addEventListener("change",async()=>{i.value==p&&(n.innerHTML=m,s.innerHTML=h,function(e,a,t){e.forEach(e=>e.hidden=!t),e[0].onchange=()=>a.forEach(a=>a.hidden=t&&!!e[0].value),e[0].onchange()}(l,o,a.acceptsOrig),e.querySelector(".vars-table").replaceWith(await ai(t.map(e=>e.name))),c.hidden=!1,u.onclick=async()=>{if(d.reportValidity()&&(o[0].hidden||o[0].reportValidity())){let t=await X(await j("weightLoading"));e.append(t),t.showModal(),a.estimate(d.value,o[0].valueAsNumber,l[0].value).then(()=>{F.value=d.value,D.value="eval"}).catch(async e=>{console.error(e),K(await a.errorMsg),t.remove()})}})})}}return await an(i),i.dispatchEvent(new Event("change")),e}async function al(){return(await eE.variables()).some(e=>e.selected.value)?as():at()}async function ar(){let e=await em();return e.querySelector("main").replaceWith(await al()),e}async function ao(e,a,t,i=!1){let n=r(`<label>
		<span>${a}</span>
		<select id="${e}" ${i?"disabled":"required"}>
			<option value="" hidden>${await j("selectVar")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>Y(e.name))),n}async function ac(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function ad(e,a){let t=await eE.filtered(e=>e.isNpNumeric),i=r(`<section class="selectors">
		<section class="row">
			<label id="eval-var"></label>
			<div class="divider"></div>
			<label>
				<span>${await j("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<button id="estimate" class="button compact" disabled>${await j("getEval")}</button>
		</section>
	</section>`),[n,s]=["#eval-var","#compare-var"].map(e=>i.querySelector(e));n=await ac(n,ao("eval-var",await j("weightsVar"),t)),s=await ac(s,ao("compare-var",await j("compareVar"),t,!0));let l=i.querySelector("#compare");l.addEventListener("change",()=>{s.disabled=!l.checked});let o=i.querySelector("#estimate");function c(){o.disabled=!n.value||l.checked&&(!s.value||s.value==n.value)}for(let e of[n,l,s])e.addEventListener("change",c);return o.onclick=()=>{o.disabled=!0,e(n.value,l.checked,s.value)},a&&setTimeout(()=>{n.value=a,e(n.value)}),i}async function au(e,a){return await g,h(`utils.weights_properties(${e}["${a}"])`)}async function ap(e,a,t){let i,n,s=["",e];a&&s.push(t);let l=[s];i=au("np_sample",e),a&&(n=au("np_sample",t)),[i,n]=await Promise.all([i,n]);for(let e=0;e<i.length;e++){let[t,s]=i[e],r=[await j(t),G.format(s)];a&&r.push(G.format(n[e][1])),l.push(r)}return[l,1,1]}async function am(e,a,t){let i=r(`<main class="estimation-results">
		<article>
			<h4>${await j("evalProperties")}</h4>
		</article>
		<article>
			<h4>${await j("evalBoxplot")}</h4>
			<div></div>
		</article>
		<article>
			<h4>${await j("evalHistogram")}</h4>
			<div></div>
		</article>
	</main>`),n=[e];a&&n.push(t);let[s,l,o]=i.querySelectorAll("article");return[i,Promise.all([ap(e,a,t).then(e=>s.append(Z(...e))),eQ("boxplot",n,"np_sample",l.lastElementChild),eQ("histogram",n,"np_sample",o.lastElementChild)])]}async function ah(){let e=r(`<main class="main-content">
		<header>
			<h2>${await j("evalTitle")}</h2>
			<h3>${H.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await j("emptyEval")}</p>
			<img src="images/empty.svg"/>
			<span>${await j("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await X(await j("evalLoading"));e.append(i),i.showModal(),await am(...t).then(a=>(e.querySelector("main").replaceWith(a[0]),a[1])).catch(async a=>{console.error(a),K(await j("evalError")),e.querySelector("#estimate").disabled=!1}),i.remove()}if(F.value){let a=(await j("estimatedWeightSubtitle")).replace("$name",F.value);e.prepend(Q(await j("estimatedWeightTitle"),a))}return e.querySelector(".selectors").replaceWith(await ad(a,F.value)),F.value=!1,e}async function aw(){let e=await em();return e.querySelector("main").replaceWith(await ah()),e}async function av(e,a,t,i=!1){let n=r(`<label>
		<span>${a}</span>
		<select id="${e}"${i?" disabled":""}>
			<option value="">${await j("uniformWeights")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>Y(e))),n}const ab=["advancedPsa","advancedPsaBoost","advancedKw","advancedKwBoost","advancedLinearMatching","advancedBoostedMatching","advancedLinearTraining","advancedBoostedTraining"];async function af(e,a){let t=await Promise.all(ab.map(async e=>Y(await j(e),e)));e.append(...t),a.addEventListener("change",()=>{if(a.value)for(let a of t)e.value==a.value&&(e.value=""),a.hidden=!0;else t.forEach(e=>{e.hidden=!1})})}async function ag(e,a,t,i,n=!1){let s=r(`<label>
		<span>${a}</span>
		<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await j("estimationMethodDescription")}</span></span>
		<select id="${e}"${n?" disabled":""}>
			<option value="">${await j("noMatching")}</option>
		</select>
	</label>`);if(t){let e=s.querySelector("select");e.append(Y(await j("linearMatching"),"linear"),Y(await j("boostedMatching"),"boosting")),af(e,i)}return s}async function ay(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function a$(e){let a=r(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await j("targetVar")}</span>
				<select id="target-var" required>
					<option value="" hidden>${await j("selectVar")}</option>
				</select>
			</label>
			<label id="weights-var"></label>
			<label id="estimation-method"></label>
		</section>
		<div class="border"></div>
		<section class="row">
			<label>
				<span>${await j("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<label id="compare-method"></label>
			<button id="estimate" class="button compact" disabled>${await j("estimate")}</button>
		</section>
	</section>`),[t,i,n,s,l,o,c]=["target-var","weights-var","compare-var","estimation-method","compare-method","compare","estimate"].map(e=>a.querySelector("#"+e)),d=await eE.variables(),u=d.filter(e=>e.isNpNumeric).map(e=>e.name);t.append(...d.map(e=>Y(e.name))),i=await ay(i,av("weights-var",await j("weightsVar"),u)),n=await ay(n,av("compare-var",await j("compareVar"),u,!0));let p=d.some(e=>e.isHarmonized&&e.selected.value);function m(){c.disabled=!t.value}for(let e of(s=await ay(s,ag("estimation-method",await j("estimationMethod"),p,i)),l=await ay(l,ag("compare-method",await j("compareMethod"),p,n,!0)),o.onchange=()=>{n.disabled=!o.checked,l.disabled=!o.checked},[t,i,n,s,l,o]))e.addEventListener("change",m);return c.onclick=()=>{c.disabled=!0,e(t.value,i.value,s.value,o.checked,n.value,l.value)},a}async function aS(e,a,t){let i="data"in a,n=[[e]],s=t?2:1,l=!!t;if(t){let e=["",await j("mainEstimation"),await j("altEstimation")];i&&e.unshift(""),n.push(e)}let r=i?"percentageEstimation":"numericEstimation",o=i?"pertentageInterval":"numericInterval";[r,o]=await Promise.all([r,o].map(j));let c=i?I:G;if(i){function d(e){return[c.format(e[0]),""]}function u(e){return[e[1],e[2]].map(e=>c.format(e))}for(let e=0;e<a.index.length;e++){let i=[a.index[e],r];i.push(...d(a.data[e]));let s=["",o];if(s.push(...u(a.data[e])),t){let n=t.index.indexOf(a.index[e]);i.push(...d(t.data[n])),s.push(...u(t.data[n]))}n.push(i,s)}}else{let e=[r,c.format(a.estimation),""];t&&e.push(c.format(t.estimation),"");let i=[o,c.format(a.interval_lower),c.format(a.interval_upper)];t&&i.push(c.format(t.interval_lower),c.format(t.interval_upper)),n.push(e,i)}return[n,s,i?2:1,l]}async function aE(a,t,i,n,s,l){let o,c,d;(i||l)&&(d=(await eE.filtered(e=>e.isHarmonized&&e.selected.value)).map(e=>e.name)),o=e8(a,t,i,"np_sample",eE.areDual&&"p_sample",d,e),n&&(c=e8(a,s,l,"np_sample",eE.areDual&&"p_sample",d,e)),[o,c]=await Promise.all([o,c]);let u=r(`<main class="estimation-results">
		<article>
			<h4>${await j(n?"comparedHeader":"estimationHeader")}</h4>
		</article>
		<article>
			<h4>${await j(n?"comparedChartHeader":"estimationChartHeader")}</h4>
			<div></div>
		</article>
	</main>`),[p,m]=u.querySelectorAll("article");p.append(Z(...await aS(a,o,c)));let h=await j("mainEstimation");return n&&(h=[h,await j("altEstimation")]),n?eX(a,h,o,c,m.lastElementChild):eK(a,h,o,m.lastElementChild),u}async function aL(){let e=r(`<main class="main-content">
		<header>
			<h2>${await j("estimationTitle")}</h2>
			<h3>${H.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await j("emptyEstimation")}</p>
			<img src="images/empty.svg"/>
			<span>${await j("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await X(await j("estimationLoading"));e.append(i),i.showModal(),await aE(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),K(await j("estimationError")),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await a$(a)),e}async function ak(){let e=await em();return e.querySelector("main").replaceWith(await aL()),e}const aq=import("https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.min.js").then(e=>e.marked),aT=document.querySelector("section.help-section"),a_=aT.querySelector("article");function ax(){aT.classList.toggle("active")}async function aN(){a_.innerHTML="";let e=t=s(),a=l(`help/${D.value}.md`).then(e=>e.text()).catch(e=>(console.error(e),"# Error")),i='<button class="close-button"><img src="images/close.svg" data-inline/></button>'+(await aq).parse(await a);e==t&&(a_.innerHTML=i,a_.querySelector("button").addEventListener("click",ax),a_.querySelectorAll("a").forEach(e=>{e.target="_blank",e.rel="noopener"}))}async function aP(){let e;scrollTo(0,0);let a=i=s();if("load"==D.value)e=ef();else if("data"==D.value)e=eB();else if("bias"==D.value)e=e2();else if("weight"==D.value)e=ar();else if("eval"==D.value)e=aw();else if("estimation"==D.value)e=ak();else throw Error(`Invalid screen: ${D.value}`);e=await e,a==i&&document.querySelector(".main-container > main").replaceWith(e)}aT.querySelector("button").addEventListener("click",ax),aT.querySelector(".help-background").addEventListener("click",ax),D.addGlobalListener(aN),aN(),D.addGlobalListener(aP),aP();