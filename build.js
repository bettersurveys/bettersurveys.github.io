let e,a,t,i,n,s=0;function l(){return s=(s+1)%Number.MAX_SAFE_INTEGER}async function r(e,a){let t=await fetch(e,a);if(t.ok)return t;throw t}function c(e){let a=document.createElement("template");return a.innerHTML=e.trim(),a.content.firstChild}class o{constructor(){this.event=new EventTarget,this.aux=new Event("e")}addListener(e,a){let t=this.event;e.myCallbacks?e.myCallbacks.push(a):e.myCallbacks=[a];let i=[new WeakRef(e),new WeakRef(a)];t.addEventListener("e",function e(){let[a,n]=i.map(e=>e.deref());a&&n&&(document.contains(a)?n():t.removeEventListener("e",e))})}addGlobalListener(e){this.event.addEventListener("e",e)}dispatch(){this.event.dispatchEvent(this.aux)}}class d{constructor(e){this.variable=e,this.event=new o}get value(){return this.variable}set value(e){this.variable=e,this.event.dispatch()}subscribe(e,a){this.event.addListener(e,a)}addGlobalListener(e){this.event.addGlobalListener(e)}}const u=new Worker("assets/webworker.js",{type:"module"}),p=new Map;async function m(){new Promise(e=>setTimeout(e))}async function h(){return new Promise(async e=>{await m(),p.size?u.addEventListener("message",async function a(){await m(),p.size||(u.removeEventListener("message",a),e())}):e()})}async function w(e,a,t){a&&await h();let i=l();return new Promise((a,n)=>{p.set(i,{onSuccess:a,onError:n}),u.postMessage({python:e,id:i,...t})})}async function v(e,a){return w(`
		import micropip
		micropip.install(${JSON.stringify(e)})
	`,a)}function f(e){return`await (await pyfetch("${e}")).bytes()`}function b(){let e=location.pathname;return e.endsWith("/")?e:e+"/"}async function g(e,a,t){return w(`
		from pyodide.http import pyfetch
		with open("${a}", "wb") as my_file:
			my_file.write(${f(e)})
	`,t)}function y(e,a){let t=document.createElement("a");t.href=e,t.download=a,document.body.append(t),t.click(),URL.revokeObjectURL(e),t.remove()}u.onmessage=function(e){let{id:a,...t}=e.data,{onSuccess:i,onError:n}=p.get(a);p.delete(a),Object.hasOwn(t,"error")?n(t.error):i(t.result)};const $=(async()=>{await g(`${b()}assets/utils.py`,"utils.py"),await w("import utils")})(),S=v("openpyxl");S.then(()=>w("import openpyxl"));const E=v("fastparquet");E.then(()=>w("import fastparquet"));const L={csv:async function(e,a){await $,await w(`${a} = utils.read_csv(${f(e)})`)},xlsx:async function(e,a){await S,await $,await w(`${a} = utils.read_excel(${f(e)})`)},parquet:async function(e,a){await E,await $,await w(`${a} = utils.read_parquet(${f(e)})`)}};async function q(e,a){let t=L[e.name.toLowerCase().match(/[^.]\.([^.]+)$/)?.[1]],i=URL.createObjectURL(e),n=t(i,a);return n.finally(()=>URL.revokeObjectURL(i)),n}const k={CSV:async function(e,a){await $,y(await w(`utils.to_csv(${e})`),`${a}.csv`)},Excel:async function(e,a){await S,await $,y(await w(`utils.to_excel(${e})`),`${a}.xlsx`)},Parquet:async function(e,a){await E,await $,y(await w(`utils.to_parquet(${e})`),`${a}.parquet`)}};async function _(e,a,t){return k[t](e,a)}async function T(e,a){return w(`
		${a} = ${e}
		del ${e}
	`)}async function x(e){return w(`del ${e}`)}async function N(e){return w(`${e}.columns.tolist()`)}async function P(e){return await $,w(`utils.num_vars(${e})`)}function M(e,a){return e&&e!=a?`, "${e}"`:""}async function W(e,a,t){return await $,w(`utils.harmonized_variables(${e}, ${a}${M(t)})`)}async function D(e,a,t,i){return await $,w(`utils.${a?"numeric":"categories"}_details("${e}", ${t}${M(i,e)})`)}async function z(e,a,t,i){await $;let n=await w(`utils.${a?"numeric":"categories"}_inferred_totals("${e}", ${t}${M(i)})`);return a?n:new Map(n)}async function H(e,a){return await $,await w(`utils.pop_total(${e}${M(a)})`)}const F=new d("load"),A={value:!1},C=new d,O=new d;class V{constructor(e){this.targetName=e,this.event=new o}subscribe(e,a){this.event.addListener(e,a)}cancel(e){if(this[e]){let a=this[e].id;this[e].loadPromise.then(()=>x(a)),this[e]=null,this.event.dispatch()}}loadTemp(e){this.cancel("temp");let a={id:`temp${l()}`,filename:e.name};return a.loadPromise=q(e,a.id),this.temp=a,this.event.dispatch(),a.loadPromise.then(()=>{a.id==this.temp?.id&&(a.loaded=!0,this.event.dispatch())}).catch(e=>{if(a.id==this.temp?.id)throw console.error(e),this.temp=null,this.event.dispatch(),e})}confirmTemp(){this.cancel("final"),this.final=this.temp,this.temp=null,this.event.dispatch()}confirmFinal(){let a=this.final;return this.final=null,this.event.dispatch(),T(a.id,this.targetName).then(()=>{let t=a.filename.replace(/\.[^.]+$/,"");if("np_sample"==this.targetName)C.value=t;else if("p_sample"==this.targetName)e=a.weights,O.value=t;else throw Error(`Invalid name: ${this.targetName}`)})}}const j=new V("np_sample"),R=new V("p_sample");for(let e of[j,R])F.addGlobalListener(()=>e.cancel("final"));O.addGlobalListener(()=>{a=O.value&&H("p_sample",e)});const B=["en","es"];async function G(e){return r(`texts/${e}/texts.json`).then(e=>e.json())}const I=new d(localStorage.language||navigator.languages.map(e=>e.slice(0,2)).find(e=>B.includes(e))||"en");let J=G(I.value);const U=G("en");async function K(e){return(await J)[e]||(await U)[e]}async function X(){let e=t=l(),[a,i]=await Promise.all([J,U]);if(e==t)for(let e of document.querySelectorAll("[data-i18n]")){let t=e.getAttribute("data-i18n");e.innerHTML=a[t]||i[t];let n=e.getAttribute("data-i18n-href");n&&(e.href=a[n]||i[n])}}X(),I.addGlobalListener(()=>{J=G(I.value),F.value=F.value,X(),localStorage.language=I.value}),async function(){let e=c(`<a data-i18n="changeLang">${await K("changeLang")}</a>`);function a(){e.setAttribute("data-lang",B.find(e=>e!=I.value))}a(),e.addEventListener("click",async()=>{e.style.cursor="wait",I.value=e.getAttribute("data-lang"),await J,a(),e.style.cursor="pointer"}),document.querySelector(".footer-links").prepend(e,c('<div class="header-divider"></div>'))}();const Q={maximumFractionDigits:2,minimumFractionDigits:2,maximumSignificantDigits:3,minimumSignificantDigits:3,roundingPriority:"morePrecision"},Y=Intl.NumberFormat(void 0,Q);Q.style="percent";const Z=Intl.NumberFormat(void 0,Q);function ee(e){let a=!1;return()=>{a||(a=!0,setTimeout(()=>{a=!1,e()}))}}function ea(e){for(let a of e.querySelectorAll("dialog"))a.querySelector(".close-button").onclick=()=>a.close()}async function et(e){let a=c(`<dialog class="modal error">
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
		<img src="images/error.svg">
		<article>
			<h4>${await K("error")}</h4>
			<p>${e}</p>
		</article>
		<button class="button" autofocus>${await K("acceptError")}</button>
	</dialog>`);a.querySelectorAll("button").forEach(e=>e.addEventListener("click",()=>a.close())),a.addEventListener("close",()=>a.remove()),document.body.append(a),a.showModal()}async function ei(e){let a=c(`<dialog class="modal loading">
		<img src="images/loading.svg"/>
		<p>${await K("loading")}</p>
		<p>${e}</p>
	</dialog>`);return a.addEventListener("cancel",e=>e.preventDefault()),a.addEventListener("close",()=>a.showModal()),a}function en(e,a){let t=c(`<article class="feedback">
		<img src="images/check-circle.svg"/>
		<div>
			<h3>${e}</h3>
			<p>${a}</p>
		</div>
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
	</article>`);return t.querySelector(".close-button").addEventListener("click",()=>t.remove()),t}function es(e,a){return c(`<option${a?` value="${a}"`:""}>${e}</option>`)}function el(e,a,t,i){let n=c(`<section class="estimation-table" style="--columns: ${e[e.length-1].length}"></section>`);for(let s=0;s<e.length;s++){let l=e[s],r=c(`<div class="row${s<a?" titles":""}"></div>`);for(let e=0;e<l.length;e++){let n=c(`<article>${l[e]}</article>`);(s<a||e<t)&&(n.classList.add("title"),i&&s==a-1&&e>=l.length-2&&n.classList.add("expanded")),r.append(n)}n.append(r)}return n}const er=[j,R];function ec(e,a){let t=c(e[a]?`<article class="uploaded-file">
			<span>${e[a].filename}</span>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
			<progress ${e[a].loaded?'value = "1"':""}></progress>
		</article>`:'<article class="uploaded-file" hidden></article>');return t.querySelector(".close-button")?.addEventListener("click",()=>e.cancel(a)),e.subscribe(t,()=>t.replaceWith(ec(e,a))),t}async function eo(e){let a=c(`<select name="weights-var">
		<option value="">${await K("noWeights")}</option>
	</select>`);return e?a.append(...e.map(e=>c(`<option>${e}</option>`))):a.disabled=!0,a}async function ed(e){let a=c(`<section class="modal-input">
		<div class="modal-input-top">
			<h4>${await K("loadFile2Subaction")}</h4>
			<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await K("loadFile2SubactionHelp")}</span></span>
		</div>
		<select></select>
		<p>${await K("loadFile2SubactionSubtitle")}</p>
	</section>`);async function t(e){let t=await eo(e);return a.querySelector("select").replaceWith(t),t}return t(),e.subscribe(a,async()=>{let a=e.temp;if(a?.loaded){let i=await P(a.id);if(a.id==e.temp?.id){let e=await t(i);e.addEventListener("change",()=>a.weights=e.value)}}else t()}),a}async function eu(e){let a=c(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await K("loadFile"+e+"Title")}</h3>
				<p>${await K("loadFile"+e+"Subtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input padded">
			<div class="modal-input-top">
				<h4>${await K("loadFile"+e+"Action")}</h4>
				<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await K("loadFile"+e+"ActionHelp")}</span></span>
			</div>
			<label class="button reversed">
				<span class="large icon"><img src="images/upload.svg" data-inline/></span>
				<span>${await K("fileButton")}</span>
				<input name="file${e}" type="file" accept=".csv,.xlsx,.parquet" autofocus/>
			</label>
			<p>${await K("fileButtonSubtitle")}</p>
		</section>
		<article class="uploaded-file" hidden></article>
		<section class="buttons-row">
			<button class="button reversed minimal">${await K("cancel")}</button>
			<button class="button" disabled>${await K("fileButton")}</button>
		</section>
	</dialog>`),t=er[e-1];a.querySelector(".button.reversed.minimal").addEventListener("click",()=>a.close());let i=a.querySelector("input[type=file]");i.addEventListener("change",()=>{t.loadTemp(i.files[0]).catch(async e=>et(await K("loadFileError")))}),i.addEventListener("click",()=>i.value=""),a.querySelector(".uploaded-file").replaceWith(ec(t,"temp"));let n=a.querySelector(".buttons-row > .button:last-of-type");return t.subscribe(n,()=>n.disabled=!t.temp?.loaded),n.addEventListener("click",()=>{t.confirmTemp(),a.close()}),2==e&&a.querySelector(".uploaded-file").after(await ed(t)),a.addEventListener("close",()=>t.cancel("temp")),a}async function ep(e){let a=c(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await K(`loadOption${e}`)}</h3>
		<p>${await K(`loadOption${e}Subtitle`)}</p>
		<article class="radio-file">
			<img src="images/empty.svg"/>
			<p>${await K("fileSelect")}</p>
			<article class="uploaded-file" hidden></article>
			<button class="button small"><span class="icon"><img src="images/upload.svg" data-inline/></span><span>${await K("fileButton")}</span></button>
		</article>
	</label>`),t=er[e-1];a.querySelector(".radio-file").append(await eu(e)),a.querySelector(".uploaded-file").replaceWith(ec(t,"final"));let i=a.querySelector(".button:has(+ dialog)");i.addEventListener("click",()=>i.nextElementSibling.showModal());let n=new d(t.final?.loaded);return t.subscribe(a,()=>n.value=t.final?.loaded),n.subscribe(i,()=>i.disabled=n.value),[a,n,()=>t.confirmFinal()]}async function em(e){let a=c(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await K(`download${e}Title`)}</h3>
				<p>${await K(`download${e}Subtitle`)}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await K("downloadFilename")}</h4>
			</div>
			<input name="filename" type="text" autofocus/>
		</section>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await K("downloadFormat")}</h4>
			</div>
			<select name="format" class="big">
				<option value="" hidden>${await K("downloadFormatPlaceholder")}</option>
				<option>CSV</option>
				<option>Excel</option>
				<option>Parquet</option>
			</select>
		</section>
		<section class="buttons-row">
			<button class="button reversed minimal">${await K("cancel")}</button>
			<button class="button" disabled>${await K("downloadConfirm")}</button>
		</section>
	</dialog>`),t=a.querySelector("input"),i=a.querySelector("select"),[n,s]=a.querySelectorAll(".button");function l(){s.disabled=!(t.value&&i.value)}return t.addEventListener("input",l),i.addEventListener("change",l),n.addEventListener("click",()=>a.close()),s.addEventListener("click",async()=>{let n=await ei(await K("downloadLoading"));a.append(n),n.showModal(),_(1==e?"np_sample":"p_sample",t.value,i.value).then(()=>{a.close()}).catch(async e=>{console.error(e),et(await K("downloadError"))}).finally(()=>n.remove())}),l(),a}async function eh(a){if("left"==a||"right"==a){let t="left"==a?1:2,i=await K(`loadFile${t}Title`),n="left"==a?C.value:O.value,s=c(`<header class="dual-header ${a}">
			<h2>${i}</h2>
			<label>
				<span>${await K("actions")}</span>
				<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
				<input type="checkbox" hidden/>
				<nav class="dropdown from-button">
					<a>${await K("loadNewData")}</a>
					<a>${await K("downloadData")}</a>
				</nav>
			</label>
			<p>${n}</p>
			<div class="border"></div>
		</header>`);"right"==a&&s.append(c(`<article>
				<span>${await K("weightsVar")}</span>
				<span>${e||await K("noWeights")}</span>
			</article>`));let l=s.querySelectorAll("nav > a"),r=await Promise.all([eu(t),em(t)]),o=er[t-1];o.subscribe(s,async()=>{if(o.final){let e=await ei(await K("loadFileLoading"));s.append(e),e.showModal(),o.confirmFinal()}});for(let e=0;e<r.length;e++)s.append(r[e]),l[e].addEventListener("click",()=>r[e].showModal());return s}if("single"==a)return c(`<header class="single-header"><h2>${await K("loadFile1Title")}</h2><p>${C.value}</p></header>`);throw Error(`Invalid type: ${a}`)}async function ew(){let e=[];return O.value?e.push(await eh("left"),c('<div class="border"></div>'),await eh("right")):e.push(await eh("single")),e}const ev=["load","data","bias","weight","eval","estimation"];async function ef(e,a){let t=c('<nav class="tabs"></nav>');t.append(...await Promise.all(ev.map(async e=>c(`<button>${await K(e+"Tab")}</button>`)))),e=ev.indexOf(e),t.children[e].classList.add("active");for(let i=0;i<t.children.length;i++){let n=t.children[i];n.addEventListener("click",()=>F.value=ev[i]),a||i==e||(n.disabled=!0)}return t}async function eb(e,a,t){let i=c(`<a>${await K("export"+t)}</a>`),n=await em(t);e.append(i),a.append(n),i.addEventListener("click",()=>n.showModal())}async function eg(){let e=c(`<article class="main-title-buttons">
		<label class="dropdown-button">
			<span>${await K("download")}</span>
			<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
			<input type="checkbox" hidden/>
			<nav class="dropdown from-button color"></nav>
		</label>
	</article>`),a=e.querySelector(".dropdown");return C.value&&await eb(a,e,1),O.value&&await eb(a,e,2),ea(e),e}async function ey(){let e=c(`<main class="main-section">
		<nav class="breadcrumb">
			<a><img src="images/home.svg" data-inline/><span>${await K("home")}</span></a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await K("projectsTab")}</a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await K("defaultProject")}</a>
		</nav>
		<section class="main-title">
			<article class="main-title-text">
				<h1>${await K("defaultProject")}</h1>
				<p>${await K("defaultProjectDesc")}</p>
			</article>
		</section>
		<nav class="tabs"></nav>
		<main></main>
	</main>`);return e.querySelector(".tabs").replaceWith(await ef(F.value,C.value)),C.value&&e.querySelector(".main-title").append(await eg()),e}async function e$(e){let a=c(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await K("noFileTitle")}</h3>
		<p>${await K("noFileSubtitle")}</p>
		<article class="radio-file">
			<img src="images/data.svg"/>
			<p>${await K("noFileSubSubtitle")}</p>
			<button class="button small adjusted"><span>${await K("noFileConfirm")}</span><span class="icon"><img src="images/arrow-right.svg" data-inline/></span></button>
		</article>
	</label>`),t=a.querySelector("button");t.addEventListener("click",()=>{t.disabled=!0,e.click()});let i=async()=>{O.value&&(await x("p_sample"),O.value=null)};return[a,new d(!0),i]}const eS=[,,];async function eE(e){return 1==e?`<button class="button" disabled>${await K("next")}</button>`:`<section class="buttons-row">
			<button class="button reversed minimal">${await K("back")}</button>
			<button class="button" disabled>${await K("loadFileConfirm")}</button>
		</section>`}async function eL(e=1){let a=c(`<main class="main-content">
		<header>
			<h2>${await K("loadTitle")}</h2>
			<p>${await K("loadSubtitle")}</p>
		</header>
		<main class="data-load-content">
			<article class="stepper">
				<span class="step-icon active">${1==e?1:'<img src="images/check.svg"/>'}</span>
				<span class="step-text active">${await K("loadStep1")}</span>
				<img src="images/stepper.svg"/>
				<span class="step-icon ${2==e?"active":""}">2</span>
				<span class="step-text ${2==e?"active":""}">${await K("loadStep2")}</span>
			</article>
			${await eE(e)}
			<label class="radio-label"></label>
			${await eE(e)}
		</main>`),t=a.querySelectorAll(".data-load-content > .button, .data-load-content > .buttons-row > .button:last-of-type"),i=a.querySelector(".radio-label"),n=[ep(e)];for(let[a,l,r]of(2==e&&n.push(e$(t[0])),n=await Promise.all(n),i.after(...n.map(e=>e[0])),n)){let i=a.querySelector("input");for(let a of t){function s(){i.checked&&(a.disabled=!l.value,eS[e-1]=r)}i.addEventListener("change",s),l.subscribe(a,s)}}for(let i of t)i.addEventListener("click",async()=>{if(i.disabled=!0,e<2)a.replaceWith(await eL(e+1));else{let e=await ei(await K("loadFileLoading"));a.append(e),e.showModal(),await Promise.all(eS.map(e=>e())),A.value=!0,F.value="data"}});return a.querySelectorAll(".data-load-content > .buttons-row > .button:first-of-type").forEach(t=>{t.addEventListener("click",async()=>{t.disabled=!0,a.replaceWith(await eL(e-1))})}),i.remove(),ea(a),a}async function eq(){let e=await ey();return e.querySelector("main").replaceWith(await eL()),e}let ek=new class{constructor(){this.cache=new Map}set(e,a){this.cache.set(a.name,e),a.hasTotals.value=!0}delete(e){this.cache.delete(e.name),e.hasTotals.value=!1}async verify(e,a){let t=await a.npDetails();return!t.some(e=>null==e[0])&&(a.isNpNumeric?"number"==typeof e:t.length==e.size&&t.every(a=>e.has(a[0])))}async refresh(e){let a=this.cache;for(let t of(this.cache=new Map,e)){let e=a.get(t.name);e&&await this.verify(e,t)&&this.set(e,t)}}},e_=new class{constructor(){this.cache=new Set}refresh(e){let a=this.cache;for(let t of(this.cache=new Set,e))t.selected.addGlobalListener(()=>{t.selected.value?this.cache.add(t.name):this.cache.delete(t.name)}),t.selected.value=t.selectable.value&&a.has(t.name)}};class eT{static baseProperties=["name","inNp","inP","isNpNumeric","isPNumeric","isHarmonized","harmonReason","pWeights"];constructor(e){for(let a of eT.baseProperties)this[a]=e[a];this.selected=new d(!1),this.expanded=new d(!1),this.hasTotals=new d(!1),this.selectable=new d(this.isHarmonized),this.hasTotals.addGlobalListener(()=>this.selectable.value=this.isHarmonized||this.hasTotals.value),this.selectable.addGlobalListener(()=>{this.selected.value&&!this.selectable.value&&(this.selected.value=!1)})}async npDetails(){return this.npCache||(this.npCache=D(this.name,this.isNpNumeric,"np_sample")),this.npCache}async pDetails(){return this.pCache||(this.pCache=D(this.name,this.isPNumeric,"p_sample",e)),this.pCache}async inferredTotals(){return this.inferredCache||(this.inferredCache=z(this.name,this.isPNumeric,"p_sample",e)),this.inferredCache}getTotals(){return ek.cache.get(this.name)}setTotals(e){ek.set(e,this)}deleteTotals(){ek.delete(this)}}class ex{constructor(){this.event=new o}subscribe(e,a){this.event.addListener(e,a)}async variables(){return this.cache||(this.cache=this.variablesPromise().then(async e=>(await ek.refresh(e),e_.refresh(e),e))),this.cache}async filtered(e){return(await this.variables()).filter(e)}async harmonized(){return this.filtered(e=>e.isHarmonized)}async common(){return this.filtered(e=>e.inNp&&e.inP)}async npOnly(){return this.filtered(e=>e.inNp&&!e.inP)}async pOnly(){return this.filtered(e=>!e.inNp&&e.inP)}async get(e){return(await this.variables()).find(a=>a.name==e)}static async fromHarmonization(){let a=e,[t,i,n]=await Promise.all([W("np_sample","p_sample",a),P("np_sample"),P("p_sample")]);[i,n]=[i,n].map(e=>new Set(e));let s=[];function l(e){return new eT({pWeights:a,isNpNumeric:i.has(e.name),isPNumeric:n.has(e.name),...e})}s.push(...t.harmonized.map(e=>l({name:e,inNp:!0,inP:!0,isHarmonized:!0}))),s.push(...t.nonharmonized.map(e=>l({name:e.name,inNp:!0,inP:!0,isHarmonized:!1,harmonReason:e.reason})));for(let e=0;e<2;e++)s.push(...t.unrelated[e].map(a=>l({name:a,inNp:0==e,inP:1==e,isHarmonized:!1})));return s}static async fromData(){let[e,a]=[N("np_sample"),P("np_sample")];return a=new Set(await a),(await e).map(e=>new eT({name:e,inNp:!0,inP:!1,isNpNumeric:a.has(e)}))}refresh(){C.value?O.value?(this.areDual=!0,this.variablesPromise=ex.fromHarmonization):(this.areDual=!1,this.variablesPromise=ex.fromData):(this.areDual=null,this.variablesPromise=null),this.cache=null,this.event.dispatch()}}const eN=new ex;async function eP(e){return[await K("missing"),Z.format(e[1])]}async function eM(e){return null==e[0]?eP(e):[await K(e[0]),Y.format(e[1])]}async function eW(e){return null==e[0]?eP(e):[e[0],Z.format(e[1])]}async function eD(e,a){return Promise.all(e.map(a?eM:eW))}function ez(e,a,t,i){if(!e.hasDetails&&a.checked){e.hasDetails=!0;let a="right"==i?t.pDetails():t.npDetails(),n="right"==i?t.isPNumeric:t.isNpNumeric,s=c('<section class="details"></section>');a.then(async a=>{a=await eD(a,n),s.append(...a.map(e=>c(`<article><span>${e[0]}</span><span>${e[1]}</span></article>`))),e.append(s)})}}async function eH(e){let a=c('<button class="button reversed"></button>');async function t(){a.innerHTML=e.hasTotals.value?await K("editTotals"):await K("insertTotals")}return e.hasTotals.subscribe(a,t),t(),a}function eF(e,a,t){let i=[c(`<span>${e}</span>`),c('<label><input type="number" step="any" required/></label>')],n=i[1].querySelector("input");return a&&(n.valueAsNumber=a),t&&(n.readOnly=!0),i}async function eA(e){let a=await e.npDetails(),t=c(`<section class="totals-container${e.isHarmonized?"":" single"}" style="--items: ${e.isNpNumeric?1:a.length}">
		<article class="totals-article">
			<h4>${await K("totals1")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>
	</section>`),i=t.querySelector(".totals-items"),n=e.getTotals();if(e.isNpNumeric)i.append(...eF(await K("total"),n));else for(let[e]of a)i.append(...eF(e,n?.get(e)));if(e.isHarmonized){let n=c(`<article class="totals-article">
			<h4>${await K("totals2")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>`);t.append(n),n=n.querySelector(".totals-items");let s=await e.inferredTotals();if(e.isPNumeric)n.append(...eF(await K("total"),s,!0));else for(let[e,a]of s)n.append(...eF(e,a,!0));let l=c(`<button class="button reversed">${await K("inferTotals")}</button>`);l.addEventListener("click",()=>(function(e,a,t,i){let n=e.querySelectorAll("input");if(i)n[0].valueAsNumber=t;else for(let e=0;e<a.length;e++)n[e].valueAsNumber=t.get(a[e][0])})(i,a,s,e.isPNumeric)),t.querySelector(".totals-article").append(l)}return t}async function eC(e,a,t){let i=[...e.querySelectorAll("input")];if(i.every(e=>!e.value))a.deleteTotals(),t.close();else if(i.every(e=>e.reportValidity())){if(a.isNpNumeric)a.setTotals(i[0].valueAsNumber);else{let e=await a.npDetails();a.setTotals(new Map(e.map((e,a)=>[e[0],i[a].valueAsNumber])))}t.close()}}async function eO(e){let a=c(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await K("editTotals")}</h3>
				<p>${await K("editTotalsSubtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="totals-container"></section>
		<section class="buttons-row">
			<button class="button reversed minimal" disabled>${await K("deleteTotals")}</button>
			<section>
				<button class="button reversed minimal">${await K("cancel")}</button>
				<button class="button" disabled>${await K("setTotals")}</button>
			</section>
		</section>
	</dialog>`),[t,i,n]=a.querySelectorAll(".button");return a.addEventListener("open",async()=>{(await e.npDetails()).some(e=>null==e[0])?(et(await K("missingError")),a.close()):(a.querySelector(".totals-container").replaceWith(await eA(e)),n.disabled=!1,t.disabled=!1)}),i.addEventListener("click",()=>a.close()),n.addEventListener("click",()=>eC(a.querySelector(".totals-items"),e,a)),t.addEventListener("click",()=>{a.querySelector(".totals-items").querySelectorAll("input").forEach(e=>e.value="")}),a}async function eV(e){let a=await eH(e),t=await eO(e);return a.addEventListener("click",()=>{t.showModal(),t.dispatchEvent(new Event("open"))}),[a,t]}async function ej(e){let a=c(`<header class="variable header">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${await K("variables")}</span>
	</header>`);"single"!=e&&a.classList.add(e),"right"!=e&&a.querySelector(".border").after(c(`<label class="checkbox icon">
			<input type="checkbox" hidden/>
			<img src="images/check.svg"/>
		</label>`));let t=await eN.filtered(a=>a["right"==e?"inP":"inNp"]),[i,n]=a.querySelectorAll("input");i.addEventListener("change",()=>{t.forEach(e=>{e.expanded.value!=i.checked&&(e.expanded.value=i.checked)})}),n?.addEventListener("change",()=>{t.forEach(e=>{e.selectable.value&&e.selected.value!=n.checked&&(e.selected.value=n.checked)})});let s=ee(()=>i.checked=t.every(e=>e.expanded.value)),l=ee(()=>{let e=t.filter(e=>e.selectable.value);n.checked=e.length&&e.every(e=>e.selected.value)});for(let e of t)e.expanded.subscribe(a,s),n&&(e.selected.subscribe(a,l),e.selectable.subscribe(a,l));return s(),n&&l(),a}async function eR(e){let a=c('<article class="variable-status"></article>');return e.isHarmonized?a.innerHTML='<img width="24" height="24" src="images/check-circle.svg"/>':e.harmonReason?a.innerHTML=`<span class="lead left"><img src="images/lead.svg"/><span class="tooltip">${await K(e.harmonReason+"Reason")}</span></span><img src="images/check-yellow.svg"/>`:a.innerHTML='<img src="images/block.svg"/>',a}async function eB(e,a){let t,i,n=c(`<article class="variable view ${"single"!=a?a:""} ${e.isHarmonized?"harmonized":""}">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${e.name}</span>
	</article>`),s=n.querySelector("input");return s.checked=e.expanded.value,s.addEventListener("change",()=>e.expanded.value=s.checked),e.expanded.subscribe(n,()=>{s.checked=e.expanded.value,ez(n,s,e,a)}),"right"!=a&&n.querySelector(".border").after(((i=(t=c(`<label class="checkbox icon">
		<input type="checkbox" hidden/>
		<img src="images/check.svg"/>
	</label>`)).querySelector("input")).checked=e.selected.value,i.disabled=!e.selectable.value,i.addEventListener("change",()=>e.selected.value=i.checked),e.selected.subscribe(t,()=>i.checked=e.selected.value),e.selectable.subscribe(t,()=>i.disabled=!e.selectable.value),t)),"right"==a?n.append(await eR(e)):n.append(...await eV(e)),ez(n,s,e,a),n}function eG(){return c('<div class="border"></div>')}function eI(e,a,t){e.expanded.subscribe(t,()=>{a.expanded.value!=e.expanded.value&&(a.expanded.value=e.expanded.value)})}async function eJ(){let e=[];if(eN.areDual){e.push(await ej("left"),eG(),await ej("right"));let[a,t,i]=await Promise.all([eN.common(),eN.npOnly(),eN.pOnly()]),n=Math.max(t.length,i.length);for(let t of a)e.push(await eB(t,"left"),eG(),await eB(t,"right"));for(let a=0;a<n;a++){let n,s;t[a]&&(n=await eB(t[a],"left"),e.push(n)),e.push(eG()),i[a]&&(s=await eB(i[a],"right"),e.push(s)),t[a]&&i[a]&&(eI(t[a],i[a],n),eI(i[a],t[a],s))}}else{e.push(await ej("single"));let a=(await eN.variables()).map(e=>eB(e,"single"));e.push(...await Promise.all(a))}return e}async function eU(){let e;eN.variables().catch(async e=>{console.error(e),et(await K("loadFileFinalError")),F.value="load"});let a=c('<main class="main-content"></main>');if(eN.areDual){if(e=c('<section class="dual-container"></section>'),A.value){let e=(await K("loadedFilesSubtitle")).replace("$nVars",(await eN.harmonized()).length);a.append(en(await K("loadedFilesTitle"),e))}}else e=c('<section class="dual-container single"></section>');return e.append(...await ew()),e.append(...await eJ()),a.append(e),ea(a),A.value=!1,eN.subscribe(a,async()=>a.replaceWith(await eU())),a}async function eK(){let e=await ey();return e.querySelector("main").replaceWith(await eU()),e}async function eX(e){let a=await eN.harmonized(),t=c(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await K("biasVar")}</span>
				<select id="bias-var" required${a.length?"":" disabled"}>
					<option value="" hidden>${await K("selectVar")}</option>
				</select>
			</label>
			<button id="estimate" class="button compact" disabled>${await K("getBias")}</button>
		</section>
	</section>`),i=t.querySelector("#bias-var");i.append(...a.map(e=>es(e.name)));let n=t.querySelector("#estimate");return i.addEventListener("change",()=>{n.disabled=!i.value}),n.onclick=()=>{n.disabled=!0,e(i.value)},t}C.addGlobalListener(()=>eN.refresh()),O.addGlobalListener(()=>eN.refresh()),eN.refresh();const eQ=v("altair==5.5.0",!0).then(async()=>{await g(`${b()}assets/charts.py`,"charts.py",!0),await w("import charts",!0)}),eY=new Promise(e=>{document.head.querySelector("[data-id=vegaEmbed]").onload=()=>e()});let eZ=[];async function e0(e,a){await eY;let t=(await vegaEmbed(e,a,{renderer:"canvas"})).finalize;setTimeout(()=>eZ.push([e,t]))}function e1(e){if(document.body.contains(e[0]))return!0;e[1]()}async function e2(e,a,t,i){return await eQ,e0(i,JSON.parse(await w(`charts.single${"data"in t?"_categorical":""}("${e}", "${a}", ${JSON.stringify(t)})`)))}async function e4(e,a,t,i,n){return await eQ,e0(n,JSON.parse(await w(`charts.compared${"data"in t?"_categorical":""}("${e}", ${JSON.stringify(a)}, ${JSON.stringify(t)}, ${JSON.stringify(i)})`)))}async function e3(e,a,t,i){return await eQ,e0(i,JSON.parse(await w(`charts.${e}(${JSON.stringify(a)}, ${t})`)))}async function e5(e,a,t,i){let n=[[e],["",C.value,O.value]];if(i)n.push([await K("mean"),Y.format(a.get("mean")),Y.format(t.get("mean"))]);else for(let[e,i]of a.entries())n.push([null==e?await K("missing"):e,Z.format(i),Z.format(t.get(e))]);return[n,2,1]}async function e8(e,a,t,i){let n,s,l,r=[[e],["",await K("biasAbsolute"),await K("biasRelative")]];if(i)n=t.get("mean"),l=(s=a.get("mean")-n)/n,r.push([await K("mean"),Y.format(s),Z.format(l)]);else for(let[e,i]of a.entries())l=(s=i-(n=t.get(e)))/n,r.push([null==e?await K("missing"):e,Y.format(100*s),Z.format(l)]);return[r,2,1]}async function e6(e,a){if(a)return{estimation:e.get("mean")};{let a=await K("missing");return{index:[...e.keys()].map(e=>null==e?a:e),columns:["estimation"],data:[...e.values()].map(e=>[e])}}}async function e7(e){let a=c(`<main class="estimation-results">
		<article>
			<h4>${await K("biasTable")}</h4>
		</article>
		<article>
			<h4>${await K("biasDifference")}</h4>
		</article>
		<article>
			<h4>${await K("biasChart")}</h4>
			<div></div>
		</article>
	</main>`),[t,i,n]=a.querySelectorAll("article"),s=await eN.get(e),[l,r]=await Promise.all([s.npDetails(),s.pDetails()]).then(e=>e.map(e=>new Map(e))),o=s.isNpNumeric;return t.append(el(...await e5(e,l,r,o))),i.append(el(...await e8(e,l,r,o))),e4(e,[C.value,O.value],await e6(l,o),await e6(r,o),n.lastElementChild),a}async function e9(){let e=c(`<main class="main-content">
		<header>
			<h2>${await K("biasTitle")}</h2>
			<h3>${C.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await K((await eN.harmonized()).length?"emptyBias":"invalidBias")}</p>
			<img src="images/empty.svg"/>
			<span>${await K("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await ei(await K("biasLoading"));e.append(i),i.showModal(),await e7(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),et(await K("biasError")),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await eX(a)),e}async function ae(){let e=await ey();return e.querySelector("main").replaceWith(await e9()),e}setInterval(function(){eZ=eZ.filter(e1)},1e3);const aa=v("inps",!0).then(()=>w("import inps",!0));function at(e,a){return a?`, ${e} = ${JSON.stringify(a)}`:""}async function ai(e,a,t,i,n){await Promise.all([$,aa]),await w(`
		from js import my_totals
		temp_sample, temp_totals = utils.prepare_calibration(${a}, my_totals.to_py()${at("weights_var",i)})
	`,!1,{my_totals:t});let s=`${at("weights_column",i)}${at("population_size",n)}`;await w(`${a}["${e}"] = inps.calibration_weights(temp_sample, temp_totals${s})`),await w("del temp_sample, temp_totals")}async function an(e,a,t,i,n,s,l,r){await aa;let c=`${at("weights_column",i)}${at("population_size",n)}${at("covariates",s)}`;l&&(c+=", model = inps.boosting_classifier()"),await w(`${a}["${e}"] = inps.${r?"kw":"psa"}_weights(${a}, ${i?`${t}.dropna(subset = "${i}")`:t}${c})${r?"":'["np"]'}`)}async function as(e,a,t,i,n,s,l){await Promise.all([$,aa]);let r=`${at("weights_var",a)}${at("method",t)}${at("covariates",s)}${at("p_weights_var",l)}`;return w(`utils.estimation(${i}, '${e}'${n?", p_sample = "+n:""}${r})`)}class al{constructor(){this.name=K("calibration"),this.title=K("calibrationTitle"),this.description=K("calibrationDescription"),this.variables=eN.filtered(e=>e.selected.value&&e.hasTotals.value),this.acceptsOrig=!0}async estimate(e,a,t){if(!a&&!t)throw this.errorMsg=K("calibrationMissing"),Error("Info missing");this.errorMsg=K("calibrationError");let i=new Map((await this.variables).map(e=>[e.name,e.getTotals()]));await ai(e,"np_sample",i,t,a),C.event.dispatch()}}class ar{constructor(e,a){this.boosted=e,this.kernels=a;let t=a?"kw":"psa";e&&(t+="Boost"),this.name=K(t),this.title=K(t+"Title"),this.description=K(t+"Description"),this.errorMsg=K(t+"Error"),this.variables=eN.filtered(e=>e.selected.value&&e.isHarmonized),this.acceptsOrig=!1}async estimate(a,t,i){let n=(await this.variables).map(e=>e.name);await an(a,"np_sample","p_sample",e,t,n,this.boosted,this.kernels),C.event.dispatch()}}const ac=["psa","calibration"];async function ao(){return c(`<main class="main-content">
		<header>
			<h2>${await K("weightTitle")}</h2>
			<h3>${C.value}</h3>
		</header>
		<main class="empty-content">
			<p>${await K("emptyDescription")}</p>
			<img src="images/empty.svg"/>
			<span>${await K("emptyTitle")}</span>
		</main>
	</main>`)}async function ad(e){let a=c(`<section class="vars-table">
		<article>${await K("activeVars")}</article>
	</section>`);for(let t of e)a.append(c(`<article>${t}</article>`));return a}async function au(e){let a=new Set([...e.options].map(e=>e.value));for(let t of ac)if(t=await K(t),a.has(t)){e.value=t;return}}async function ap(){let e=c(`<main class="main-content">
		<header>
			<h2>${await K("weightTitle")}</h2>
			<h3>${C.value}</h3>
		</header>
		<form class="weight-form">
			<section class="inputs">
				<label for="method">
					<span>${await K("method")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await K("methodTitle")}</h4>
							<p>${await K("methodDescription")}</p>
						</span>
					</span>
				</label>
				<select id="method" required>
					<option value="" hidden>${await K("methodPlaceholder")}</option>
				</select>
				<article class="extra">
					<span>${await K("methodExplain")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await K("methodExplainTitle")}</h4>
							<p>${await K("methodExplainDescription")}</p>
						</span>
					</span>
				</article>
				<label for="orig-weights" hidden>
					<span>${await K("origWeights")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await K("origWeightsTitle")}</h4>
							<p>${await K("origWeightsDescription")}</p>
						</span>
					</span>
				</label>
				<select id="orig-weights" hidden>
					<option value="">${await K("uniformWeights")}</option>
				</select>
				<label for="pop-size">
					<span>${await K("popSize")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await K("popSizeTitle")}</h4>
							<p>${await K("popSizeDescription")}</p>
						</span>
					</span>
				</label>
				<input id="pop-size" type="number" placeholder="${await K("popSizePlaceholder")}"/>
			</section>
			<section class="vars-table" hidden></section>
			<a hidden>${await K("changeVars")}</a>
			<section class="inputs single">
				<label for="new-var-name">${await K("newVar")}</label>
				<input id="new-var-name" type="text" placeholder="${await K("newVarPlaceholder")}" required/>
			</section>
			<button class="button" type="button">${await K("weightButton")}</button>
		</form>
	</main>`);function t(a){return e.querySelector(a)}let[i,n,s]=["#method",".extra h4",".extra p"].map(t),l=["#orig-weights",'[for="orig-weights"]'].map(t),r=["#pop-size",'[for="pop-size"]'].map(t),o=t(".vars-table + a"),d=t("#new-var-name"),u=t("button"),p=await a;for(let a of(l[0].append(...(await eN.filtered(e=>e.isNpNumeric)).map(e=>c(`<option>${e.name}</option>`))),p&&(r[0].placeholder=r[0].placeholder.replace(/\d+/,Math.round(p))),o.addEventListener("click",()=>F.value="data"),u.onclick=()=>i.reportValidity(),[new al,new ar,new ar(!0),new ar(!1,!0),new ar(!0,!0)])){let t=await a.variables;if(t.length){let[p,m,h]=await Promise.all([a.name,a.title,a.description]);i.append(c(`<option>${p}</option>`)),i.addEventListener("change",async()=>{i.value==p&&(n.innerHTML=m,s.innerHTML=h,function(e,a,t){e.forEach(e=>e.hidden=!t),e[0].onchange=()=>a.forEach(a=>a.hidden=t&&!!e[0].value),e[0].onchange()}(l,r,a.acceptsOrig),e.querySelector(".vars-table").replaceWith(await ad(t.map(e=>e.name))),o.hidden=!1,u.onclick=async()=>{if(d.reportValidity()&&(r[0].hidden||r[0].reportValidity())){let t=await ei(await K("weightLoading"));e.append(t),t.showModal(),a.estimate(d.value,r[0].valueAsNumber,l[0].value).then(()=>{A.value=d.value,F.value="eval"}).catch(async e=>{console.error(e),et(await a.errorMsg),t.remove()})}})})}}return await au(i),i.dispatchEvent(new Event("change")),e}async function am(){return(await eN.variables()).some(e=>e.selected.value)?ap():ao()}async function ah(){let e=await ey();return e.querySelector("main").replaceWith(await am()),e}async function aw(e,a,t,i=!1){let n=c(`<label>
		<span>${a}</span>
		<select id="${e}" ${i?"disabled":"required"}>
			<option value="" hidden>${await K("selectVar")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>es(e.name))),n}async function av(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function af(e,a){let t=await eN.filtered(e=>e.isNpNumeric),i=c(`<section class="selectors">
		<section class="row">
			<label id="eval-var"></label>
			<div class="divider"></div>
			<label>
				<span>${await K("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<button id="estimate" class="button compact" disabled>${await K("getEval")}</button>
		</section>
	</section>`),[n,s]=["#eval-var","#compare-var"].map(e=>i.querySelector(e));n=await av(n,aw("eval-var",await K("weightsVar"),t)),s=await av(s,aw("compare-var",await K("compareVar"),t,!0));let l=i.querySelector("#compare");l.addEventListener("change",()=>{s.disabled=!l.checked});let r=i.querySelector("#estimate");function o(){r.disabled=!n.value||l.checked&&(!s.value||s.value==n.value)}for(let e of[n,l,s])e.addEventListener("change",o);return r.onclick=()=>{r.disabled=!0,e(n.value,l.checked,s.value)},a&&setTimeout(()=>{n.value=a,e(n.value)}),i}async function ab(e,a){return await $,w(`utils.weights_properties(${e}["${a}"])`)}async function ag(e,a,t){let i,n,s=["",e];a&&s.push(t);let l=[s];i=ab("np_sample",e),a&&(n=ab("np_sample",t)),[i,n]=await Promise.all([i,n]);for(let e=0;e<i.length;e++){let[t,s]=i[e],r=[await K(t),Y.format(s)];a&&r.push(Y.format(n[e][1])),l.push(r)}return[l,1,1]}async function ay(e,a,t){let i=c(`<main class="estimation-results">
		<article>
			<h4>${await K("evalProperties")}</h4>
		</article>
		<article>
			<h4>${await K("evalBoxplot")}</h4>
			<div></div>
		</article>
		<article>
			<h4>${await K("evalHistogram")}</h4>
			<div></div>
		</article>
	</main>`),n=[e];a&&n.push(t);let[s,l,r]=i.querySelectorAll("article");return[i,Promise.all([ag(e,a,t).then(e=>s.append(el(...e))),e3("boxplot",n,"np_sample",l.lastElementChild),e3("histogram",n,"np_sample",r.lastElementChild)])]}async function a$(){let e=c(`<main class="main-content">
		<header>
			<h2>${await K("evalTitle")}</h2>
			<h3>${C.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await K("emptyEval")}</p>
			<img src="images/empty.svg"/>
			<span>${await K("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await ei(await K("evalLoading"));e.append(i),i.showModal(),await ay(...t).then(a=>(e.querySelector("main").replaceWith(a[0]),a[1])).catch(async a=>{console.error(a),et(await K("evalError")),e.querySelector("#estimate").disabled=!1}),i.remove()}if(A.value){let a=(await K("estimatedWeightSubtitle")).replace("$name",A.value);e.prepend(en(await K("estimatedWeightTitle"),a))}return e.querySelector(".selectors").replaceWith(await af(a,A.value)),A.value=!1,e}async function aS(){let e=await ey();return e.querySelector("main").replaceWith(await a$()),e}async function aE(e,a,t,i=!1){let n=c(`<label>
		<span>${a}</span>
		<select id="${e}"${i?" disabled":""}>
			<option value="">${await K("uniformWeights")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>es(e))),n}const aL=["advancedPsa","advancedPsaBoost","advancedKw","advancedKwBoost","advancedLinearMatching","advancedBoostedMatching","advancedLinearTraining","advancedBoostedTraining"];async function aq(e,a){let t=await Promise.all(aL.map(async e=>es(await K(e),e)));e.append(...t),a.addEventListener("change",()=>{if(a.value)for(let a of t)e.value==a.value&&(e.value=""),a.hidden=!0;else t.forEach(e=>{e.hidden=!1})})}async function ak(e,a,t,i,n=!1){let s=c(`<label>
		<span>${a}</span>
		<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await K("estimationMethodDescription")}</span></span>
		<select id="${e}"${n?" disabled":""}>
			<option value="">${await K("noMatching")}</option>
		</select>
	</label>`);if(t){let e=s.querySelector("select");e.append(es(await K("linearMatching"),"linear"),es(await K("boostedMatching"),"boosting")),aq(e,i)}return s}async function a_(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function aT(e){let a=c(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await K("targetVar")}</span>
				<select id="target-var" required>
					<option value="" hidden>${await K("selectVar")}</option>
				</select>
			</label>
			<label id="weights-var"></label>
			<label id="estimation-method"></label>
		</section>
		<div class="border"></div>
		<section class="row">
			<label>
				<span>${await K("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<label id="compare-method"></label>
			<button id="estimate" class="button compact" disabled>${await K("estimate")}</button>
		</section>
	</section>`),[t,i,n,s,l,r,o]=["target-var","weights-var","compare-var","estimation-method","compare-method","compare","estimate"].map(e=>a.querySelector("#"+e)),d=await eN.variables(),u=d.filter(e=>e.isNpNumeric).map(e=>e.name);t.append(...d.map(e=>es(e.name))),i=await a_(i,aE("weights-var",await K("weightsVar"),u)),n=await a_(n,aE("compare-var",await K("compareVar"),u,!0));let p=d.some(e=>e.isHarmonized&&e.selected.value);function m(){o.disabled=!t.value}for(let e of(s=await a_(s,ak("estimation-method",await K("estimationMethod"),p,i)),l=await a_(l,ak("compare-method",await K("compareMethod"),p,n,!0)),r.onchange=()=>{n.disabled=!r.checked,l.disabled=!r.checked},[t,i,n,s,l,r]))e.addEventListener("change",m);return o.onclick=()=>{o.disabled=!0,e(t.value,i.value,s.value,r.checked,n.value,l.value)},a}async function ax(e,a,t){let i="data"in a,n=[[e]],s=t?2:1,l=!!t;if(t){let e=["",await K("mainEstimation"),await K("altEstimation")];i&&e.unshift(""),n.push(e)}let r=i?"percentageEstimation":"numericEstimation",c=i?"pertentageInterval":"numericInterval";[r,c]=await Promise.all([r,c].map(K));let o=i?Z:Y;if(i){function d(e){return[o.format(e[0]),""]}function u(e){return[e[1],e[2]].map(e=>o.format(e))}for(let e=0;e<a.index.length;e++){let i=[a.index[e],r];i.push(...d(a.data[e]));let s=["",c];if(s.push(...u(a.data[e])),t){let n=t.index.indexOf(a.index[e]);i.push(...d(t.data[n])),s.push(...u(t.data[n]))}n.push(i,s)}}else{let e=[r,o.format(a.estimation),""];t&&e.push(o.format(t.estimation),"");let i=[c,o.format(a.interval_lower),o.format(a.interval_upper)];t&&i.push(o.format(t.interval_lower),o.format(t.interval_upper)),n.push(e,i)}return[n,s,i?2:1,l]}async function aN(a,t,i,n,s,l){let r,o,d;(i||l)&&(d=(await eN.filtered(e=>e.isHarmonized&&e.selected.value)).map(e=>e.name)),r=as(a,t,i,"np_sample",eN.areDual&&"p_sample",d,e),n&&(o=as(a,s,l,"np_sample",eN.areDual&&"p_sample",d,e)),[r,o]=await Promise.all([r,o]);let u=c(`<main class="estimation-results">
		<article>
			<h4>${await K(n?"comparedHeader":"estimationHeader")}</h4>
		</article>
		<article>
			<h4>${await K(n?"comparedChartHeader":"estimationChartHeader")}</h4>
			<div></div>
		</article>
	</main>`),[p,m]=u.querySelectorAll("article");p.append(el(...await ax(a,r,o)));let h=await K("mainEstimation");return n&&(h=[h,await K("altEstimation")]),n?e4(a,h,r,o,m.lastElementChild):e2(a,h,r,m.lastElementChild),u}async function aP(e){return e.includes("different number of classes")||e.includes("minimum number of groups")?K("lowDataError"):K("estimationError")}async function aM(){let e=c(`<main class="main-content">
		<header>
			<h2>${await K("estimationTitle")}</h2>
			<h3>${C.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await K("emptyEstimation")}</p>
			<img src="images/empty.svg"/>
			<span>${await K("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await ei(await K("estimationLoading"));e.append(i),i.showModal(),await aN(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),et(await aP(a)),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await aT(a)),e}async function aW(){let e=await ey();return e.querySelector("main").replaceWith(await aM()),e}const aD=import("https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.min.js").then(e=>e.marked),az=document.querySelector("section.help-section"),aH=az.querySelector("article");function aF(){az.classList.toggle("active")}async function aA(){aH.innerHTML="";let e=i=l(),a=r(`texts/${I.value}/help/${F.value}.md`).then(e=>e.text()).catch(e=>(console.error(e),"# Error")),t='<button class="close-button"><img src="images/close.svg" data-inline/></button>'+(await aD).parse(await a);e==i&&(aH.innerHTML=t,aH.querySelector("button").addEventListener("click",aF),aH.querySelectorAll("a").forEach(e=>{e.target="_blank"}))}async function aC(){let e;scrollTo(0,0);let a=n=l();if("load"==F.value)e=eq();else if("data"==F.value)e=eK();else if("bias"==F.value)e=ae();else if("weight"==F.value)e=ah();else if("eval"==F.value)e=aS();else if("estimation"==F.value)e=aW();else throw Error(`Invalid screen: ${F.value}`);e=await e,a==n&&document.querySelector(".main-container > main").replaceWith(e)}az.querySelector("button").addEventListener("click",aF),az.querySelector(".help-background").addEventListener("click",aF),F.addGlobalListener(aA),aA(),F.addGlobalListener(aC),aC();