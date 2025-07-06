let e,a,t,i,n,s=0;function l(){return s=(s+1)%Number.MAX_SAFE_INTEGER}async function r(e,a){let t=await fetch(e,a);if(t.ok)return t;throw t}function o(e){let a=document.createElement("template");return a.innerHTML=e.trim(),a.content.firstChild}class c{constructor(){this.event=new EventTarget,this.aux=new Event("e")}addListener(e,a){let t=this.event;e.myCallbacks?e.myCallbacks.push(a):e.myCallbacks=[a];let i=[new WeakRef(e),new WeakRef(a)];t.addEventListener("e",function e(){let[a,n]=i.map(e=>e.deref());a&&n&&(document.contains(a)?n():t.removeEventListener("e",e))})}addGlobalListener(e){this.event.addEventListener("e",e)}dispatch(){this.event.dispatchEvent(this.aux)}}class d{constructor(e){this.variable=e,this.event=new c}get value(){return this.variable}set value(e){this.variable=e,this.event.dispatch()}subscribe(e,a){this.event.addListener(e,a)}addGlobalListener(e){this.event.addGlobalListener(e)}}const u=new Worker("assets/webworker.js",{type:"module"}),p=new Map;async function m(){new Promise(e=>setTimeout(e))}async function h(){return new Promise(async e=>{await m(),p.size?u.addEventListener("message",async function a(){await m(),p.size||(u.removeEventListener("message",a),e())}):e()})}async function w(e,a,t){a&&await h();let i=l();return new Promise((a,n)=>{p.set(i,{onSuccess:a,onError:n}),u.postMessage({python:e,id:i,...t})})}async function v(e,a){return w(`
		import micropip
		micropip.install(${JSON.stringify(e)})
	`,a)}function f(e){return`await (await pyfetch("${e}")).memoryview()`}function b(){let e=location.pathname;return e.endsWith("/")?e:e+"/"}async function g(e,a,t){return w(`
		from pyodide.http import pyfetch
		with open("${a}", "wb") as my_file:
			my_file.write(${f(e)})
	`,t)}u.onmessage=function(e){let{id:a,...t}=e.data,{onSuccess:i,onError:n}=p.get(a);p.delete(a),Object.hasOwn(t,"error")?n(t.error):i(t.result)};const y=(async()=>{await g(`${b()}assets/utils.py`,"utils.py"),await w("import utils")})(),$=v("openpyxl");async function S(e,a){await $,await w(`
		from pyodide.http import pyfetch
		from io import BytesIO
		import pandas as pd
		${a} = pd.read_excel(BytesIO(${f(e)}), engine = "openpyxl")
	`)}async function E(e,a){let t=URL.createObjectURL(e);await S(t,a),URL.revokeObjectURL(t)}async function L(e,a){var t,i;let n;await $,await y,t=await w(`utils.to_excel(${e})`),i=`${a}.xlsx`,(n=document.createElement("a")).href=t,n.download=i,document.body.append(n),n.click(),URL.revokeObjectURL(t),n.remove()}async function k(e,a){return E(e,a)}async function q(e,a,t){if("Excel"==t)return L(e,a);throw Error(`Invalid extension: ${t}`)}async function T(e,a){return w(`
		${a} = ${e}
		del ${e}
	`)}async function x(e){return w(`del ${e}`)}async function _(e){return w(`${e}.columns.tolist()`)}async function N(e){return await y,w(`utils.num_vars(${e})`)}function P(e,a){return e&&e!=a?`, "${e}"`:""}async function M(e,a,t){return await y,w(`utils.harmonized_variables(${e}, ${a}${P(t)})`)}async function W(e,a,t,i){return await y,w(`utils.${a?"numeric":"categories"}_details("${e}", ${t}${P(i,e)})`)}async function D(e,a,t,i){await y;let n=await w(`utils.${a?"numeric":"categories"}_inferred_totals("${e}", ${t}${P(i)})`);return a?n:new Map(n)}async function z(e,a){return await y,await w(`utils.pop_total(${e}${P(a)})`)}$.then(()=>w("import openpyxl"));const H=new d("load"),F={value:!1},A=new d,O=new d;class C{constructor(e){this.targetName=e,this.event=new c}subscribe(e,a){this.event.addListener(e,a)}cancel(e){if(this[e]){let a=this[e].id;this[e].loadPromise.then(()=>x(a)),this[e]=null,this.event.dispatch()}}loadTemp(e){this.cancel("temp");let a={id:`temp${l()}`,filename:e.name};return a.loadPromise=k(e,a.id),this.temp=a,this.event.dispatch(),a.loadPromise.then(()=>{a.id==this.temp?.id&&(a.loaded=!0,this.event.dispatch())}).catch(e=>{if(a.id==this.temp?.id)throw console.error(e),this.temp=null,this.event.dispatch(),e})}confirmTemp(){this.cancel("final"),this.final=this.temp,this.temp=null,this.event.dispatch()}confirmFinal(){let a=this.final;return this.final=null,this.event.dispatch(),T(a.id,this.targetName).then(()=>{let t=a.filename.replace(/\.[^.]+$/,"");if("np_sample"==this.targetName)A.value=t;else if("p_sample"==this.targetName)e=a.weights,O.value=t;else throw Error(`Invalid name: ${this.targetName}`)})}}const V=new C("np_sample"),B=new C("p_sample");for(let e of[V,B])H.addGlobalListener(()=>e.cancel("final"));O.addGlobalListener(()=>{a=O.value&&z("p_sample",e)});const j=["en","es"];async function R(e){return r(`texts/${e}/texts.json`).then(e=>e.json())}const G=new d(localStorage.language||navigator.languages.map(e=>e.slice(0,2)).find(e=>j.includes(e))||"en");let I=R(G.value);const J=R("en");async function U(e){return(await I)[e]||(await J)[e]}async function K(){let e=t=l(),[a,i]=await Promise.all([I,J]);if(e==t)for(let e of document.querySelectorAll("[data-i18n]")){let t=e.getAttribute("data-i18n");e.innerHTML=a[t]||i[t];let n=e.getAttribute("data-i18n-href");n&&(e.href=a[n]||i[n])}}K(),G.addGlobalListener(()=>{I=R(G.value),H.value=H.value,K(),localStorage.language=G.value}),async function(){let e=o(`<a data-i18n="changeLang">${await U("changeLang")}</a>`);function a(){e.setAttribute("data-lang",j.find(e=>e!=G.value))}a(),e.addEventListener("click",async()=>{e.style.cursor="wait",G.value=e.getAttribute("data-lang"),await I,a(),e.style.cursor="pointer"}),document.querySelector(".footer-links").prepend(e,o('<div class="header-divider"></div>'))}();const X={maximumFractionDigits:2,minimumFractionDigits:2,maximumSignificantDigits:3,minimumSignificantDigits:3,roundingPriority:"morePrecision"},Q=Intl.NumberFormat(void 0,X);X.style="percent";const Y=Intl.NumberFormat(void 0,X);function Z(e){let a=!1;return()=>{a||(a=!0,setTimeout(()=>{a=!1,e()}))}}function ee(e){for(let a of e.querySelectorAll("dialog"))a.querySelector(".close-button").onclick=()=>a.close()}async function ea(e){let a=o(`<dialog class="modal error">
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
		<img src="images/error.svg">
		<article>
			<h4>${await U("error")}</h4>
			<p>${e}</p>
		</article>
		<button class="button" autofocus>${await U("acceptError")}</button>
	</dialog>`);a.querySelectorAll("button").forEach(e=>e.addEventListener("click",()=>a.close())),a.addEventListener("close",()=>a.remove()),document.body.append(a),a.showModal()}async function et(e){let a=o(`<dialog class="modal loading">
		<img src="images/loading.svg"/>
		<p>${await U("loading")}</p>
		<p>${e}</p>
	</dialog>`);return a.addEventListener("cancel",e=>e.preventDefault()),a.addEventListener("close",()=>a.showModal()),a}function ei(e,a){let t=o(`<article class="feedback">
		<img src="images/check-circle.svg"/>
		<div>
			<h3>${e}</h3>
			<p>${a}</p>
		</div>
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
	</article>`);return t.querySelector(".close-button").addEventListener("click",()=>t.remove()),t}function en(e,a){return o(`<option${a?` value="${a}"`:""}>${e}</option>`)}function es(e,a,t,i){let n=o(`<section class="estimation-table" style="--columns: ${e[e.length-1].length}"></section>`);for(let s=0;s<e.length;s++){let l=e[s],r=o(`<div class="row${s<a?" titles":""}"></div>`);for(let e=0;e<l.length;e++){let n=o(`<article>${l[e]}</article>`);(s<a||e<t)&&(n.classList.add("title"),i&&s==a-1&&e>=l.length-2&&n.classList.add("expanded")),r.append(n)}n.append(r)}return n}const el=[V,B];function er(e,a){let t=o(e[a]?`<article class="uploaded-file">
			<span>${e[a].filename}</span>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
			<progress ${e[a].loaded?'value = "1"':""}></progress>
		</article>`:'<article class="uploaded-file" hidden></article>');return t.querySelector(".close-button")?.addEventListener("click",()=>e.cancel(a)),e.subscribe(t,()=>t.replaceWith(er(e,a))),t}async function eo(e){let a=o(`<select name="weights-var">
		<option value="">${await U("noWeights")}</option>
	</select>`);return e?a.append(...e.map(e=>o(`<option>${e}</option>`))):a.disabled=!0,a}async function ec(e){let a=o(`<section class="modal-input">
		<div class="modal-input-top">
			<h4>${await U("loadFile2Subaction")}</h4>
			<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await U("loadFile2SubactionHelp")}</span></span>
		</div>
		<select></select>
		<p>${await U("loadFile2SubactionSubtitle")}</p>
	</section>`);async function t(e){let t=await eo(e);return a.querySelector("select").replaceWith(t),t}return t(),e.subscribe(a,async()=>{let a=e.temp;if(a?.loaded){let i=await N(a.id);if(a.id==e.temp?.id){let e=await t(i);e.addEventListener("change",()=>a.weights=e.value)}}else t()}),a}async function ed(e){let a=o(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await U("loadFile"+e+"Title")}</h3>
				<p>${await U("loadFile"+e+"Subtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input padded">
			<div class="modal-input-top">
				<h4>${await U("loadFile"+e+"Action")}</h4>
				<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await U("loadFile"+e+"ActionHelp")}</span></span>
			</div>
			<label class="button reversed">
				<span class="large icon"><img src="images/upload.svg" data-inline/></span>
				<span>${await U("fileButton")}</span>
				<input name="file${e}" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" autofocus/>
			</label>
			<p>${await U("fileButtonSubtitle")}</p>
		</section>
		<article class="uploaded-file" hidden></article>
		<section class="buttons-row">
			<button class="button reversed minimal">${await U("cancel")}</button>
			<button class="button" disabled>${await U("fileButton")}</button>
		</section>
	</dialog>`),t=el[e-1];a.querySelector(".button.reversed.minimal").addEventListener("click",()=>a.close());let i=a.querySelector("input[type=file]");i.addEventListener("change",()=>{t.loadTemp(i.files[0]).catch(async e=>ea(await U("loadFileError")))}),i.addEventListener("click",()=>i.value=""),a.querySelector(".uploaded-file").replaceWith(er(t,"temp"));let n=a.querySelector(".buttons-row > .button:last-of-type");return t.subscribe(n,()=>n.disabled=!t.temp?.loaded),n.addEventListener("click",()=>{t.confirmTemp(),a.close()}),2==e&&a.querySelector(".uploaded-file").after(await ec(t)),a.addEventListener("close",()=>t.cancel("temp")),a}async function eu(e){let a=o(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await U(`loadOption${e}`)}</h3>
		<p>${await U(`loadOption${e}Subtitle`)}</p>
		<article class="radio-file">
			<img src="images/empty.svg"/>
			<p>${await U("fileSelect")}</p>
			<article class="uploaded-file" hidden></article>
			<button class="button small"><span class="icon"><img src="images/upload.svg" data-inline/></span><span>${await U("fileButton")}</span></button>
		</article>
	</label>`),t=el[e-1];a.querySelector(".radio-file").append(await ed(e)),a.querySelector(".uploaded-file").replaceWith(er(t,"final"));let i=a.querySelector(".button:has(+ dialog)");i.addEventListener("click",()=>i.nextElementSibling.showModal());let n=new d(t.final?.loaded);return t.subscribe(a,()=>n.value=t.final?.loaded),n.subscribe(i,()=>i.disabled=n.value),[a,n,()=>t.confirmFinal()]}async function ep(e){let a=o(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await U(`download${e}Title`)}</h3>
				<p>${await U(`download${e}Subtitle`)}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await U("downloadFilename")}</h4>
			</div>
			<input name="filename" type="text" autofocus/>
		</section>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await U("downloadFormat")}</h4>
			</div>
			<select name="format" class="big">
				<option value="" hidden>${await U("downloadFormatPlaceholder")}</option>
				<option>Excel</option>
			</select>
		</section>
		<section class="buttons-row">
			<button class="button reversed minimal">${await U("cancel")}</button>
			<button class="button" disabled>${await U("downloadConfirm")}</button>
		</section>
	</dialog>`),t=a.querySelector("input"),i=a.querySelector("select"),[n,s]=a.querySelectorAll(".button");function l(){s.disabled=!(t.value&&i.value)}return t.addEventListener("input",l),i.addEventListener("change",l),n.addEventListener("click",()=>a.close()),s.addEventListener("click",async()=>{let n=await et(await U("downloadLoading"));a.append(n),n.showModal(),q(1==e?"np_sample":"p_sample",t.value,i.value).then(()=>{a.close()}).catch(async e=>{console.error(e),ea(await U("downloadError"))}).finally(()=>n.remove())}),l(),a}async function em(a){if("left"==a||"right"==a){let t="left"==a?1:2,i=await U(`loadFile${t}Title`),n="left"==a?A.value:O.value,s=o(`<header class="dual-header ${a}">
			<h2>${i}</h2>
			<label>
				<span>${await U("actions")}</span>
				<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
				<input type="checkbox" hidden/>
				<nav class="dropdown from-button">
					<a>${await U("loadNewData")}</a>
					<a>${await U("downloadData")}</a>
				</nav>
			</label>
			<p>${n}</p>
			<div class="border"></div>
		</header>`);"right"==a&&s.append(o(`<article>
				<span>${await U("weightsVar")}</span>
				<span>${e||await U("noWeights")}</span>
			</article>`));let l=s.querySelectorAll("nav > a"),r=await Promise.all([ed(t),ep(t)]),c=el[t-1];c.subscribe(s,async()=>{if(c.final){let e=await et(await U("loadFileLoading"));s.append(e),e.showModal(),c.confirmFinal()}});for(let e=0;e<r.length;e++)s.append(r[e]),l[e].addEventListener("click",()=>r[e].showModal());return s}if("single"==a)return o(`<header class="single-header"><h2>${await U("loadFile1Title")}</h2><p>${A.value}</p></header>`);throw Error(`Invalid type: ${a}`)}async function eh(){let e=[];return O.value?e.push(await em("left"),o('<div class="border"></div>'),await em("right")):e.push(await em("single")),e}const ew=["load","data","bias","weight","eval","estimation"];async function ev(e,a){let t=o('<nav class="tabs"></nav>');t.append(...await Promise.all(ew.map(async e=>o(`<button>${await U(e+"Tab")}</button>`)))),e=ew.indexOf(e),t.children[e].classList.add("active");for(let i=0;i<t.children.length;i++){let n=t.children[i];n.addEventListener("click",()=>H.value=ew[i]),a||i==e||(n.disabled=!0)}return t}async function ef(e,a,t){let i=o(`<a>${await U("export"+t)}</a>`),n=await ep(t);e.append(i),a.append(n),i.addEventListener("click",()=>n.showModal())}async function eb(){let e=o(`<article class="main-title-buttons">
		<label class="dropdown-button">
			<span>${await U("download")}</span>
			<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
			<input type="checkbox" hidden/>
			<nav class="dropdown from-button color"></nav>
		</label>
	</article>`),a=e.querySelector(".dropdown");return A.value&&await ef(a,e,1),O.value&&await ef(a,e,2),ee(e),e}async function eg(){let e=o(`<main class="main-section">
		<nav class="breadcrumb">
			<a><img src="images/home.svg" data-inline/><span>${await U("home")}</span></a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await U("projectsTab")}</a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await U("defaultProject")}</a>
		</nav>
		<section class="main-title">
			<article class="main-title-text">
				<h1>${await U("defaultProject")}</h1>
				<p>${await U("defaultProjectDesc")}</p>
			</article>
		</section>
		<nav class="tabs"></nav>
		<main></main>
	</main>`);return e.querySelector(".tabs").replaceWith(await ev(H.value,A.value)),A.value&&e.querySelector(".main-title").append(await eb()),e}async function ey(e){let a=o(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await U("noFileTitle")}</h3>
		<p>${await U("noFileSubtitle")}</p>
		<article class="radio-file">
			<img src="images/data.svg"/>
			<p>${await U("noFileSubSubtitle")}</p>
			<button class="button small adjusted"><span>${await U("noFileConfirm")}</span><span class="icon"><img src="images/arrow-right.svg" data-inline/></span></button>
		</article>
	</label>`),t=a.querySelector("button");t.addEventListener("click",()=>{t.disabled=!0,e.click()});let i=async()=>{O.value&&(await x("p_sample"),O.value=null)};return[a,new d(!0),i]}const e$=[,,];async function eS(e){return 1==e?`<button class="button" disabled>${await U("next")}</button>`:`<section class="buttons-row">
			<button class="button reversed minimal">${await U("back")}</button>
			<button class="button" disabled>${await U("loadFileConfirm")}</button>
		</section>`}async function eE(e=1){let a=o(`<main class="main-content">
		<header>
			<h2>${await U("loadTitle")}</h2>
			<p>${await U("loadSubtitle")}</p>
		</header>
		<main class="data-load-content">
			<article class="stepper">
				<span class="step-icon active">${1==e?1:'<img src="images/check.svg"/>'}</span>
				<span class="step-text active">${await U("loadStep1")}</span>
				<img src="images/stepper.svg"/>
				<span class="step-icon ${2==e?"active":""}">2</span>
				<span class="step-text ${2==e?"active":""}">${await U("loadStep2")}</span>
			</article>
			${await eS(e)}
			<label class="radio-label"></label>
			${await eS(e)}
		</main>`),t=a.querySelectorAll(".data-load-content > .button, .data-load-content > .buttons-row > .button:last-of-type"),i=a.querySelector(".radio-label"),n=[eu(e)];for(let[a,l,r]of(2==e&&n.push(ey(t[0])),n=await Promise.all(n),i.after(...n.map(e=>e[0])),n)){let i=a.querySelector("input");for(let a of t){function s(){i.checked&&(a.disabled=!l.value,e$[e-1]=r)}i.addEventListener("change",s),l.subscribe(a,s)}}for(let i of t)i.addEventListener("click",async()=>{if(i.disabled=!0,e<2)a.replaceWith(await eE(e+1));else{let e=await et(await U("loadFileLoading"));a.append(e),e.showModal(),await Promise.all(e$.map(e=>e())),F.value=!0,H.value="data"}});return a.querySelectorAll(".data-load-content > .buttons-row > .button:first-of-type").forEach(t=>{t.addEventListener("click",async()=>{t.disabled=!0,a.replaceWith(await eE(e-1))})}),i.remove(),ee(a),a}async function eL(){let e=await eg();return e.querySelector("main").replaceWith(await eE()),e}let ek=new class{constructor(){this.cache=new Map}set(e,a){this.cache.set(a.name,e),a.hasTotals.value=!0}delete(e){this.cache.delete(e.name),e.hasTotals.value=!1}async verify(e,a){let t=await a.npDetails();return!t.some(e=>null==e[0])&&(a.isNpNumeric?"number"==typeof e:t.length==e.size&&t.every(a=>e.has(a[0])))}async refresh(e){let a=this.cache;for(let t of(this.cache=new Map,e)){let e=a.get(t.name);e&&await this.verify(e,t)&&this.set(e,t)}}},eq=new class{constructor(){this.cache=new Set}refresh(e){let a=this.cache;for(let t of(this.cache=new Set,e))t.selected.addGlobalListener(()=>{t.selected.value?this.cache.add(t.name):this.cache.delete(t.name)}),t.selected.value=t.selectable.value&&a.has(t.name)}};class eT{static baseProperties=["name","inNp","inP","isNpNumeric","isPNumeric","isHarmonized","harmonReason","pWeights"];constructor(e){for(let a of eT.baseProperties)this[a]=e[a];this.selected=new d(!1),this.expanded=new d(!1),this.hasTotals=new d(!1),this.selectable=new d(this.isHarmonized),this.hasTotals.addGlobalListener(()=>this.selectable.value=this.isHarmonized||this.hasTotals.value),this.selectable.addGlobalListener(()=>{this.selected.value&&!this.selectable.value&&(this.selected.value=!1)})}async npDetails(){return this.npCache||(this.npCache=W(this.name,this.isNpNumeric,"np_sample")),this.npCache}async pDetails(){return this.pCache||(this.pCache=W(this.name,this.isPNumeric,"p_sample",e)),this.pCache}async inferredTotals(){return this.inferredCache||(this.inferredCache=D(this.name,this.isPNumeric,"p_sample",e)),this.inferredCache}getTotals(){return ek.cache.get(this.name)}setTotals(e){ek.set(e,this)}deleteTotals(){ek.delete(this)}}class ex{constructor(){this.event=new c}subscribe(e,a){this.event.addListener(e,a)}async variables(){return this.cache||(this.cache=this.variablesPromise().then(async e=>(await ek.refresh(e),eq.refresh(e),e))),this.cache}async filtered(e){return(await this.variables()).filter(e)}async harmonized(){return this.filtered(e=>e.isHarmonized)}async common(){return this.filtered(e=>e.inNp&&e.inP)}async npOnly(){return this.filtered(e=>e.inNp&&!e.inP)}async pOnly(){return this.filtered(e=>!e.inNp&&e.inP)}async get(e){return(await this.variables()).find(a=>a.name==e)}static async fromHarmonization(){let a=e,[t,i,n]=await Promise.all([M("np_sample","p_sample",a),N("np_sample"),N("p_sample")]);[i,n]=[i,n].map(e=>new Set(e));let s=[];function l(e){return new eT({pWeights:a,isNpNumeric:i.has(e.name),isPNumeric:n.has(e.name),...e})}s.push(...t.harmonized.map(e=>l({name:e,inNp:!0,inP:!0,isHarmonized:!0}))),s.push(...t.nonharmonized.map(e=>l({name:e.name,inNp:!0,inP:!0,isHarmonized:!1,harmonReason:e.reason})));for(let e=0;e<2;e++)s.push(...t.unrelated[e].map(a=>l({name:a,inNp:0==e,inP:1==e,isHarmonized:!1})));return s}static async fromData(){let[e,a]=[_("np_sample"),N("np_sample")];return a=new Set(await a),(await e).map(e=>new eT({name:e,inNp:!0,inP:!1,isNpNumeric:a.has(e)}))}refresh(){A.value?O.value?(this.areDual=!0,this.variablesPromise=ex.fromHarmonization):(this.areDual=!1,this.variablesPromise=ex.fromData):(this.areDual=null,this.variablesPromise=null),this.cache=null,this.event.dispatch()}}const e_=new ex;async function eN(e){return[await U("missing"),Y.format(e[1])]}async function eP(e){return null==e[0]?eN(e):[await U(e[0]),Q.format(e[1])]}async function eM(e){return null==e[0]?eN(e):[e[0],Y.format(e[1])]}async function eW(e,a){return Promise.all(e.map(a?eP:eM))}function eD(e,a,t,i){if(!e.hasDetails&&a.checked){e.hasDetails=!0;let a="right"==i?t.pDetails():t.npDetails(),n="right"==i?t.isPNumeric:t.isNpNumeric,s=o('<section class="details"></section>');a.then(async a=>{a=await eW(a,n),s.append(...a.map(e=>o(`<article><span>${e[0]}</span><span>${e[1]}</span></article>`))),e.append(s)})}}async function ez(e){let a=o('<button class="button reversed"></button>');async function t(){a.innerHTML=e.hasTotals.value?await U("editTotals"):await U("insertTotals")}return e.hasTotals.subscribe(a,t),t(),a}function eH(e,a,t){let i=[o(`<span>${e}</span>`),o('<label><input type="number" step="any" required/></label>')],n=i[1].querySelector("input");return a&&(n.valueAsNumber=a),t&&(n.readOnly=!0),i}async function eF(e){let a=await e.npDetails(),t=o(`<section class="totals-container${e.isHarmonized?"":" single"}" style="--items: ${e.isNpNumeric?1:a.length}">
		<article class="totals-article">
			<h4>${await U("totals1")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>
	</section>`),i=t.querySelector(".totals-items"),n=e.getTotals();if(e.isNpNumeric)i.append(...eH(await U("total"),n));else for(let[e]of a)i.append(...eH(e,n?.get(e)));if(e.isHarmonized){let n=o(`<article class="totals-article">
			<h4>${await U("totals2")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>`);t.append(n),n=n.querySelector(".totals-items");let s=await e.inferredTotals();if(e.isPNumeric)n.append(...eH(await U("total"),s,!0));else for(let[e,a]of s)n.append(...eH(e,a,!0));let l=o(`<button class="button reversed">${await U("inferTotals")}</button>`);l.addEventListener("click",()=>(function(e,a,t,i){let n=e.querySelectorAll("input");if(i)n[0].valueAsNumber=t;else for(let e=0;e<a.length;e++)n[e].valueAsNumber=t.get(a[e][0])})(i,a,s,e.isPNumeric)),t.querySelector(".totals-article").append(l)}return t}async function eA(e,a,t){let i=[...e.querySelectorAll("input")];if(i.every(e=>!e.value))a.deleteTotals(),t.close();else if(i.every(e=>e.reportValidity())){if(a.isNpNumeric)a.setTotals(i[0].valueAsNumber);else{let e=await a.npDetails();a.setTotals(new Map(e.map((e,a)=>[e[0],i[a].valueAsNumber])))}t.close()}}async function eO(e){let a=o(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await U("editTotals")}</h3>
				<p>${await U("editTotalsSubtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="totals-container"></section>
		<section class="buttons-row">
			<button class="button reversed minimal" disabled>${await U("deleteTotals")}</button>
			<section>
				<button class="button reversed minimal">${await U("cancel")}</button>
				<button class="button" disabled>${await U("setTotals")}</button>
			</section>
		</section>
	</dialog>`),[t,i,n]=a.querySelectorAll(".button");return a.addEventListener("open",async()=>{(await e.npDetails()).some(e=>null==e[0])?(ea(await U("missingError")),a.close()):(a.querySelector(".totals-container").replaceWith(await eF(e)),n.disabled=!1,t.disabled=!1)}),i.addEventListener("click",()=>a.close()),n.addEventListener("click",()=>eA(a.querySelector(".totals-items"),e,a)),t.addEventListener("click",()=>{a.querySelector(".totals-items").querySelectorAll("input").forEach(e=>e.value="")}),a}async function eC(e){let a=await ez(e),t=await eO(e);return a.addEventListener("click",()=>{t.showModal(),t.dispatchEvent(new Event("open"))}),[a,t]}async function eV(e){let a=o(`<header class="variable header">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${await U("variables")}</span>
	</header>`);"single"!=e&&a.classList.add(e),"right"!=e&&a.querySelector(".border").after(o(`<label class="checkbox icon">
			<input type="checkbox" hidden/>
			<img src="images/check.svg"/>
		</label>`));let t=await e_.filtered(a=>a["right"==e?"inP":"inNp"]),[i,n]=a.querySelectorAll("input");i.addEventListener("change",()=>{t.forEach(e=>{e.expanded.value!=i.checked&&(e.expanded.value=i.checked)})}),n?.addEventListener("change",()=>{t.forEach(e=>{e.selectable.value&&e.selected.value!=n.checked&&(e.selected.value=n.checked)})});let s=Z(()=>i.checked=t.every(e=>e.expanded.value)),l=Z(()=>{let e=t.filter(e=>e.selectable.value);n.checked=e.length&&e.every(e=>e.selected.value)});for(let e of t)e.expanded.subscribe(a,s),n&&(e.selected.subscribe(a,l),e.selectable.subscribe(a,l));return s(),n&&l(),a}async function eB(e){let a=o('<article class="variable-status"></article>');return e.isHarmonized?a.innerHTML='<img width="24" height="24" src="images/check-circle.svg"/>':e.harmonReason?a.innerHTML=`<span class="lead left"><img src="images/lead.svg"/><span class="tooltip">${await U(e.harmonReason+"Reason")}</span></span><img src="images/check-yellow.svg"/>`:a.innerHTML='<img src="images/block.svg"/>',a}async function ej(e,a){let t,i,n=o(`<article class="variable view ${"single"!=a?a:""} ${e.isHarmonized?"harmonized":""}">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${e.name}</span>
	</article>`),s=n.querySelector("input");return s.checked=e.expanded.value,s.addEventListener("change",()=>e.expanded.value=s.checked),e.expanded.subscribe(n,()=>{s.checked=e.expanded.value,eD(n,s,e,a)}),"right"!=a&&n.querySelector(".border").after(((i=(t=o(`<label class="checkbox icon">
		<input type="checkbox" hidden/>
		<img src="images/check.svg"/>
	</label>`)).querySelector("input")).checked=e.selected.value,i.disabled=!e.selectable.value,i.addEventListener("change",()=>e.selected.value=i.checked),e.selected.subscribe(t,()=>i.checked=e.selected.value),e.selectable.subscribe(t,()=>i.disabled=!e.selectable.value),t)),"right"==a?n.append(await eB(e)):n.append(...await eC(e)),eD(n,s,e,a),n}function eR(){return o('<div class="border"></div>')}function eG(e,a,t){e.expanded.subscribe(t,()=>{a.expanded.value!=e.expanded.value&&(a.expanded.value=e.expanded.value)})}async function eI(){let e=[];if(e_.areDual){e.push(await eV("left"),eR(),await eV("right"));let[a,t,i]=await Promise.all([e_.common(),e_.npOnly(),e_.pOnly()]),n=Math.max(t.length,i.length);for(let t of a)e.push(await ej(t,"left"),eR(),await ej(t,"right"));for(let a=0;a<n;a++){let n,s;t[a]&&(n=await ej(t[a],"left"),e.push(n)),e.push(eR()),i[a]&&(s=await ej(i[a],"right"),e.push(s)),t[a]&&i[a]&&(eG(t[a],i[a],n),eG(i[a],t[a],s))}}else{e.push(await eV("single"));let a=(await e_.variables()).map(e=>ej(e,"single"));e.push(...await Promise.all(a))}return e}async function eJ(){let e;e_.variables().catch(async e=>{console.error(e),ea(await U("loadFileFinalError")),H.value="load"});let a=o('<main class="main-content"></main>');if(e_.areDual){if(e=o('<section class="dual-container"></section>'),F.value){let e=(await U("loadedFilesSubtitle")).replace("$nVars",(await e_.harmonized()).length);a.append(ei(await U("loadedFilesTitle"),e))}}else e=o('<section class="dual-container single"></section>');return e.append(...await eh()),e.append(...await eI()),a.append(e),ee(a),F.value=!1,e_.subscribe(a,async()=>a.replaceWith(await eJ())),a}async function eU(){let e=await eg();return e.querySelector("main").replaceWith(await eJ()),e}async function eK(e){let a=await e_.harmonized(),t=o(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await U("biasVar")}</span>
				<select id="bias-var" required${a.length?"":" disabled"}>
					<option value="" hidden>${await U("selectVar")}</option>
				</select>
			</label>
			<button id="estimate" class="button compact" disabled>${await U("getBias")}</button>
		</section>
	</section>`),i=t.querySelector("#bias-var");i.append(...a.map(e=>en(e.name)));let n=t.querySelector("#estimate");return i.addEventListener("change",()=>{n.disabled=!i.value}),n.onclick=()=>{n.disabled=!0,e(i.value)},t}A.addGlobalListener(()=>e_.refresh()),O.addGlobalListener(()=>e_.refresh()),e_.refresh();const eX=v("altair==5.5.0",!0).then(async()=>{await g(`${b()}assets/charts.py`,"charts.py",!0),await w("import charts",!0)}),eQ=new Promise(e=>{document.head.querySelector("[data-id=vegaEmbed]").onload=()=>e()});let eY=[];async function eZ(e,a){await eQ;let t=(await vegaEmbed(e,a,{renderer:"canvas"})).finalize;setTimeout(()=>eY.push([e,t]))}function e0(e){if(document.body.contains(e[0]))return!0;e[1]()}async function e1(e,a,t,i){return await eX,eZ(i,JSON.parse(await w(`charts.single${"data"in t?"_categorical":""}("${e}", "${a}", ${JSON.stringify(t)})`)))}async function e2(e,a,t,i,n){return await eX,eZ(n,JSON.parse(await w(`charts.compared${"data"in t?"_categorical":""}("${e}", ${JSON.stringify(a)}, ${JSON.stringify(t)}, ${JSON.stringify(i)})`)))}async function e4(e,a,t,i){return await eX,eZ(i,JSON.parse(await w(`charts.${e}(${JSON.stringify(a)}, ${t})`)))}async function e3(e,a,t,i){let n=[[e],["",A.value,O.value]];if(i)n.push([await U("mean"),Q.format(a.get("mean")),Q.format(t.get("mean"))]);else for(let[e,i]of a.entries())n.push([null==e?await U("missing"):e,Y.format(i),Y.format(t.get(e))]);return[n,2,1]}async function e5(e,a,t,i){let n,s,l,r=[[e],["",await U("biasAbsolute"),await U("biasRelative")]];if(i)n=t.get("mean"),l=(s=a.get("mean")-n)/n,r.push([await U("mean"),Q.format(s),Y.format(l)]);else for(let[e,i]of a.entries())l=(s=i-(n=t.get(e)))/n,r.push([null==e?await U("missing"):e,Q.format(100*s),Y.format(l)]);return[r,2,1]}async function e8(e,a){if(a)return{estimation:e.get("mean")};{let a=await U("missing");return{index:[...e.keys()].map(e=>null==e?a:e),columns:["estimation"],data:[...e.values()].map(e=>[e])}}}async function e6(e){let a=o(`<main class="estimation-results">
		<article>
			<h4>${await U("biasTable")}</h4>
		</article>
		<article>
			<h4>${await U("biasDifference")}</h4>
		</article>
		<article>
			<h4>${await U("biasChart")}</h4>
			<div></div>
		</article>
	</main>`),[t,i,n]=a.querySelectorAll("article"),s=await e_.get(e),[l,r]=await Promise.all([s.npDetails(),s.pDetails()]).then(e=>e.map(e=>new Map(e))),c=s.isNpNumeric;return t.append(es(...await e3(e,l,r,c))),i.append(es(...await e5(e,l,r,c))),e2(e,[A.value,O.value],await e8(l,c),await e8(r,c),n.lastElementChild),a}async function e7(){let e=o(`<main class="main-content">
		<header>
			<h2>${await U("biasTitle")}</h2>
			<h3>${A.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await U((await e_.harmonized()).length?"emptyBias":"invalidBias")}</p>
			<img src="images/empty.svg"/>
			<span>${await U("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await et(await U("biasLoading"));e.append(i),i.showModal(),await e6(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),ea(await U("biasError")),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await eK(a)),e}async function e9(){let e=await eg();return e.querySelector("main").replaceWith(await e7()),e}setInterval(function(){eY=eY.filter(e0)},1e3);const ae=v("inps",!0).then(()=>w("import inps",!0));function aa(e,a){return a?`, ${e} = ${JSON.stringify(a)}`:""}async function at(e,a,t,i,n){await Promise.all([y,ae]),await w(`
		from js import my_totals
		temp_sample, temp_totals = utils.prepare_calibration(${a}, my_totals.to_py()${aa("weights_var",i)})
	`,!1,{my_totals:t});let s=`${aa("weights_column",i)}${aa("population_size",n)}`;await w(`${a}["${e}"] = inps.calibration_weights(temp_sample, temp_totals${s})`),await w("del temp_sample, temp_totals")}async function ai(e,a,t,i,n,s,l,r){await ae;let o=`${aa("weights_column",i)}${aa("population_size",n)}${aa("covariates",s)}`;l&&(o+=", model = inps.boosting_classifier()"),await w(`${a}["${e}"] = inps.${r?"kw":"psa"}_weights(${a}, ${i?`${t}.dropna(subset = "${i}")`:t}${o})${r?"":'["np"]'}`)}async function an(e,a,t,i,n,s,l){await Promise.all([y,ae]);let r=`${aa("weights_var",a)}${aa("method",t)}${aa("covariates",s)}${aa("p_weights_var",l)}`;return w(`utils.estimation(${i}, '${e}'${n?", p_sample = "+n:""}${r})`)}class as{constructor(){this.name=U("calibration"),this.title=U("calibrationTitle"),this.description=U("calibrationDescription"),this.variables=e_.filtered(e=>e.selected.value&&e.hasTotals.value),this.acceptsOrig=!0}async estimate(e,a,t){if(!a&&!t)throw this.errorMsg=U("calibrationMissing"),Error("Info missing");this.errorMsg=U("calibrationError");let i=new Map((await this.variables).map(e=>[e.name,e.getTotals()]));await at(e,"np_sample",i,t,a),A.event.dispatch()}}class al{constructor(e,a){this.boosted=e,this.kernels=a;let t=a?"kw":"psa";e&&(t+="Boost"),this.name=U(t),this.title=U(t+"Title"),this.description=U(t+"Description"),this.errorMsg=U(t+"Error"),this.variables=e_.filtered(e=>e.selected.value&&e.isHarmonized),this.acceptsOrig=!1}async estimate(a,t,i){let n=(await this.variables).map(e=>e.name);await ai(a,"np_sample","p_sample",e,t,n,this.boosted,this.kernels),A.event.dispatch()}}const ar=["psa","calibration"];async function ao(){return o(`<main class="main-content">
		<header>
			<h2>${await U("weightTitle")}</h2>
			<h3>${A.value}</h3>
		</header>
		<main class="empty-content">
			<p>${await U("emptyDescription")}</p>
			<img src="images/empty.svg"/>
			<span>${await U("emptyTitle")}</span>
		</main>
	</main>`)}async function ac(e){let a=o(`<section class="vars-table">
		<article>${await U("activeVars")}</article>
	</section>`);for(let t of e)a.append(o(`<article>${t}</article>`));return a}async function ad(e){let a=new Set([...e.options].map(e=>e.value));for(let t of ar)if(t=await U(t),a.has(t)){e.value=t;return}}async function au(){let e=o(`<main class="main-content">
		<header>
			<h2>${await U("weightTitle")}</h2>
			<h3>${A.value}</h3>
		</header>
		<form class="weight-form">
			<section class="inputs">
				<label for="method">
					<span>${await U("method")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await U("methodTitle")}</h4>
							<p>${await U("methodDescription")}</p>
						</span>
					</span>
				</label>
				<select id="method" required>
					<option value="" hidden>${await U("methodPlaceholder")}</option>
				</select>
				<article class="extra">
					<span>${await U("methodExplain")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await U("methodExplainTitle")}</h4>
							<p>${await U("methodExplainDescription")}</p>
						</span>
					</span>
				</article>
				<label for="orig-weights" hidden>
					<span>${await U("origWeights")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await U("origWeightsTitle")}</h4>
							<p>${await U("origWeightsDescription")}</p>
						</span>
					</span>
				</label>
				<select id="orig-weights" hidden>
					<option value="">${await U("uniformWeights")}</option>
				</select>
				<label for="pop-size">
					<span>${await U("popSize")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await U("popSizeTitle")}</h4>
							<p>${await U("popSizeDescription")}</p>
						</span>
					</span>
				</label>
				<input id="pop-size" type="number" placeholder="${await U("popSizePlaceholder")}"/>
			</section>
			<section class="vars-table" hidden></section>
			<a hidden>${await U("changeVars")}</a>
			<section class="inputs single">
				<label for="new-var-name">${await U("newVar")}</label>
				<input id="new-var-name" type="text" placeholder="${await U("newVarPlaceholder")}" required/>
			</section>
			<button class="button" type="button">${await U("weightButton")}</button>
		</form>
	</main>`);function t(a){return e.querySelector(a)}let[i,n,s]=["#method",".extra h4",".extra p"].map(t),l=["#orig-weights",'[for="orig-weights"]'].map(t),r=["#pop-size",'[for="pop-size"]'].map(t),c=t(".vars-table + a"),d=t("#new-var-name"),u=t("button"),p=await a;for(let a of(l[0].append(...(await e_.filtered(e=>e.isNpNumeric)).map(e=>o(`<option>${e.name}</option>`))),p&&(r[0].placeholder=r[0].placeholder.replace(/\d+/,Math.round(p))),c.addEventListener("click",()=>H.value="data"),u.onclick=()=>i.reportValidity(),[new as,new al,new al(!0),new al(!1,!0),new al(!0,!0)])){let t=await a.variables;if(t.length){let[p,m,h]=await Promise.all([a.name,a.title,a.description]);i.append(o(`<option>${p}</option>`)),i.addEventListener("change",async()=>{i.value==p&&(n.innerHTML=m,s.innerHTML=h,function(e,a,t){e.forEach(e=>e.hidden=!t),e[0].onchange=()=>a.forEach(a=>a.hidden=t&&!!e[0].value),e[0].onchange()}(l,r,a.acceptsOrig),e.querySelector(".vars-table").replaceWith(await ac(t.map(e=>e.name))),c.hidden=!1,u.onclick=async()=>{if(d.reportValidity()&&(r[0].hidden||r[0].reportValidity())){let t=await et(await U("weightLoading"));e.append(t),t.showModal(),a.estimate(d.value,r[0].valueAsNumber,l[0].value).then(()=>{F.value=d.value,H.value="eval"}).catch(async e=>{console.error(e),ea(await a.errorMsg),t.remove()})}})})}}return await ad(i),i.dispatchEvent(new Event("change")),e}async function ap(){return(await e_.variables()).some(e=>e.selected.value)?au():ao()}async function am(){let e=await eg();return e.querySelector("main").replaceWith(await ap()),e}async function ah(e,a,t,i=!1){let n=o(`<label>
		<span>${a}</span>
		<select id="${e}" ${i?"disabled":"required"}>
			<option value="" hidden>${await U("selectVar")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>en(e.name))),n}async function aw(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function av(e,a){let t=await e_.filtered(e=>e.isNpNumeric),i=o(`<section class="selectors">
		<section class="row">
			<label id="eval-var"></label>
			<div class="divider"></div>
			<label>
				<span>${await U("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<button id="estimate" class="button compact" disabled>${await U("getEval")}</button>
		</section>
	</section>`),[n,s]=["#eval-var","#compare-var"].map(e=>i.querySelector(e));n=await aw(n,ah("eval-var",await U("weightsVar"),t)),s=await aw(s,ah("compare-var",await U("compareVar"),t,!0));let l=i.querySelector("#compare");l.addEventListener("change",()=>{s.disabled=!l.checked});let r=i.querySelector("#estimate");function c(){r.disabled=!n.value||l.checked&&(!s.value||s.value==n.value)}for(let e of[n,l,s])e.addEventListener("change",c);return r.onclick=()=>{r.disabled=!0,e(n.value,l.checked,s.value)},a&&setTimeout(()=>{n.value=a,e(n.value)}),i}async function af(e,a){return await y,w(`utils.weights_properties(${e}["${a}"])`)}async function ab(e,a,t){let i,n,s=["",e];a&&s.push(t);let l=[s];i=af("np_sample",e),a&&(n=af("np_sample",t)),[i,n]=await Promise.all([i,n]);for(let e=0;e<i.length;e++){let[t,s]=i[e],r=[await U(t),Q.format(s)];a&&r.push(Q.format(n[e][1])),l.push(r)}return[l,1,1]}async function ag(e,a,t){let i=o(`<main class="estimation-results">
		<article>
			<h4>${await U("evalProperties")}</h4>
		</article>
		<article>
			<h4>${await U("evalBoxplot")}</h4>
			<div></div>
		</article>
		<article>
			<h4>${await U("evalHistogram")}</h4>
			<div></div>
		</article>
	</main>`),n=[e];a&&n.push(t);let[s,l,r]=i.querySelectorAll("article");return[i,Promise.all([ab(e,a,t).then(e=>s.append(es(...e))),e4("boxplot",n,"np_sample",l.lastElementChild),e4("histogram",n,"np_sample",r.lastElementChild)])]}async function ay(){let e=o(`<main class="main-content">
		<header>
			<h2>${await U("evalTitle")}</h2>
			<h3>${A.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await U("emptyEval")}</p>
			<img src="images/empty.svg"/>
			<span>${await U("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await et(await U("evalLoading"));e.append(i),i.showModal(),await ag(...t).then(a=>(e.querySelector("main").replaceWith(a[0]),a[1])).catch(async a=>{console.error(a),ea(await U("evalError")),e.querySelector("#estimate").disabled=!1}),i.remove()}if(F.value){let a=(await U("estimatedWeightSubtitle")).replace("$name",F.value);e.prepend(ei(await U("estimatedWeightTitle"),a))}return e.querySelector(".selectors").replaceWith(await av(a,F.value)),F.value=!1,e}async function a$(){let e=await eg();return e.querySelector("main").replaceWith(await ay()),e}async function aS(e,a,t,i=!1){let n=o(`<label>
		<span>${a}</span>
		<select id="${e}"${i?" disabled":""}>
			<option value="">${await U("uniformWeights")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>en(e))),n}const aE=["advancedPsa","advancedPsaBoost","advancedKw","advancedKwBoost","advancedLinearMatching","advancedBoostedMatching","advancedLinearTraining","advancedBoostedTraining"];async function aL(e,a){let t=await Promise.all(aE.map(async e=>en(await U(e),e)));e.append(...t),a.addEventListener("change",()=>{if(a.value)for(let a of t)e.value==a.value&&(e.value=""),a.hidden=!0;else t.forEach(e=>{e.hidden=!1})})}async function ak(e,a,t,i,n=!1){let s=o(`<label>
		<span>${a}</span>
		<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await U("estimationMethodDescription")}</span></span>
		<select id="${e}"${n?" disabled":""}>
			<option value="">${await U("noMatching")}</option>
		</select>
	</label>`);if(t){let e=s.querySelector("select");e.append(en(await U("linearMatching"),"linear"),en(await U("boostedMatching"),"boosting")),aL(e,i)}return s}async function aq(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function aT(e){let a=o(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await U("targetVar")}</span>
				<select id="target-var" required>
					<option value="" hidden>${await U("selectVar")}</option>
				</select>
			</label>
			<label id="weights-var"></label>
			<label id="estimation-method"></label>
		</section>
		<div class="border"></div>
		<section class="row">
			<label>
				<span>${await U("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<label id="compare-method"></label>
			<button id="estimate" class="button compact" disabled>${await U("estimate")}</button>
		</section>
	</section>`),[t,i,n,s,l,r,c]=["target-var","weights-var","compare-var","estimation-method","compare-method","compare","estimate"].map(e=>a.querySelector("#"+e)),d=await e_.variables(),u=d.filter(e=>e.isNpNumeric).map(e=>e.name);t.append(...d.map(e=>en(e.name))),i=await aq(i,aS("weights-var",await U("weightsVar"),u)),n=await aq(n,aS("compare-var",await U("compareVar"),u,!0));let p=d.some(e=>e.isHarmonized&&e.selected.value);function m(){c.disabled=!t.value}for(let e of(s=await aq(s,ak("estimation-method",await U("estimationMethod"),p,i)),l=await aq(l,ak("compare-method",await U("compareMethod"),p,n,!0)),r.onchange=()=>{n.disabled=!r.checked,l.disabled=!r.checked},[t,i,n,s,l,r]))e.addEventListener("change",m);return c.onclick=()=>{c.disabled=!0,e(t.value,i.value,s.value,r.checked,n.value,l.value)},a}async function ax(e,a,t){let i="data"in a,n=[[e]],s=t?2:1,l=!!t;if(t){let e=["",await U("mainEstimation"),await U("altEstimation")];i&&e.unshift(""),n.push(e)}let r=i?"percentageEstimation":"numericEstimation",o=i?"pertentageInterval":"numericInterval";[r,o]=await Promise.all([r,o].map(U));let c=i?Y:Q;if(i){function d(e){return[c.format(e[0]),""]}function u(e){return[e[1],e[2]].map(e=>c.format(e))}for(let e=0;e<a.index.length;e++){let i=[a.index[e],r];i.push(...d(a.data[e]));let s=["",o];if(s.push(...u(a.data[e])),t){let n=t.index.indexOf(a.index[e]);i.push(...d(t.data[n])),s.push(...u(t.data[n]))}n.push(i,s)}}else{let e=[r,c.format(a.estimation),""];t&&e.push(c.format(t.estimation),"");let i=[o,c.format(a.interval_lower),c.format(a.interval_upper)];t&&i.push(c.format(t.interval_lower),c.format(t.interval_upper)),n.push(e,i)}return[n,s,i?2:1,l]}async function a_(a,t,i,n,s,l){let r,c,d;(i||l)&&(d=(await e_.filtered(e=>e.isHarmonized&&e.selected.value)).map(e=>e.name)),r=an(a,t,i,"np_sample",e_.areDual&&"p_sample",d,e),n&&(c=an(a,s,l,"np_sample",e_.areDual&&"p_sample",d,e)),[r,c]=await Promise.all([r,c]);let u=o(`<main class="estimation-results">
		<article>
			<h4>${await U(n?"comparedHeader":"estimationHeader")}</h4>
		</article>
		<article>
			<h4>${await U(n?"comparedChartHeader":"estimationChartHeader")}</h4>
			<div></div>
		</article>
	</main>`),[p,m]=u.querySelectorAll("article");p.append(es(...await ax(a,r,c)));let h=await U("mainEstimation");return n&&(h=[h,await U("altEstimation")]),n?e2(a,h,r,c,m.lastElementChild):e1(a,h,r,m.lastElementChild),u}async function aN(e){return e.includes("different number of classes")||e.includes("minimum number of groups")?U("lowDataError"):U("estimationError")}async function aP(){let e=o(`<main class="main-content">
		<header>
			<h2>${await U("estimationTitle")}</h2>
			<h3>${A.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await U("emptyEstimation")}</p>
			<img src="images/empty.svg"/>
			<span>${await U("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await et(await U("estimationLoading"));e.append(i),i.showModal(),await a_(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),ea(await aN(a)),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await aT(a)),e}async function aM(){let e=await eg();return e.querySelector("main").replaceWith(await aP()),e}const aW=import("https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.min.js").then(e=>e.marked),aD=document.querySelector("section.help-section"),az=aD.querySelector("article");function aH(){aD.classList.toggle("active")}async function aF(){az.innerHTML="";let e=i=l(),a=r(`texts/${G.value}/help/${H.value}.md`).then(e=>e.text()).catch(e=>(console.error(e),"# Error")),t='<button class="close-button"><img src="images/close.svg" data-inline/></button>'+(await aW).parse(await a);e==i&&(az.innerHTML=t,az.querySelector("button").addEventListener("click",aH),az.querySelectorAll("a").forEach(e=>{e.target="_blank",e.rel="noopener"}))}async function aA(){let e;scrollTo(0,0);let a=n=l();if("load"==H.value)e=eL();else if("data"==H.value)e=eU();else if("bias"==H.value)e=e9();else if("weight"==H.value)e=am();else if("eval"==H.value)e=a$();else if("estimation"==H.value)e=aM();else throw Error(`Invalid screen: ${H.value}`);e=await e,a==n&&document.querySelector(".main-container > main").replaceWith(e)}aD.querySelector("button").addEventListener("click",aH),aD.querySelector(".help-background").addEventListener("click",aH),H.addGlobalListener(aF),aF(),H.addGlobalListener(aA),aA();