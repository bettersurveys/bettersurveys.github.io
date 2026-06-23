let e,a,t,i,n,s=0;async function l(e,a){let t=await fetch(e,a);if(t.ok)return t;throw t}function r(e){let a=document.createElement("template");return a.innerHTML=e.trim(),a.content.firstChild}let o=new Set,c=Symbol();function d(e){try{e()}catch(e){setTimeout(()=>{throw e})}}class u{constructor(){this.listeners=new Set}addListener(e,a){let t=this.listeners;e[c]?e[c].push(a):e[c]=[a];let i=[new WeakRef(e),new WeakRef(a)],n=()=>(function(e,a,t){let[i,n]=a.map(e=>e.deref());i&&n?document.contains(i)?(o.delete(e),d(n)):o.add(e):(o.delete(e),t.delete(e))})(n,i,t);t.add(n)}addGlobalListener(e){this.listeners.add(()=>d(e))}dispatch(){for(let e of[...this.listeners])e()}}class p{constructor(e){this.variable=e,this.event=new u}get value(){return this.variable}set value(e){this.variable=e,this.event.dispatch()}subscribe(e,a){this.event.addListener(e,a)}addGlobalListener(e){this.event.addGlobalListener(e)}}function m(e){let a=!1;return()=>{a||(a=!0,setTimeout(()=>{a=!1,e()}))}}new MutationObserver(m(function(){for(let e of[...o])e()})).observe(document,{subtree:!0,childList:!0});let h=new Worker("assets/webworker.js",{type:"module"}),w=new Map;async function v(){new Promise(e=>setTimeout(e))}async function f(){return new Promise(async e=>{await v(),w.size?h.addEventListener("message",async function a(){await v(),w.size||(h.removeEventListener("message",a),e())}):e()})}async function b(e,a,t){a&&await f();let i=s++;return new Promise((a,n)=>{w.set(i,{onSuccess:a,onError:n}),h.postMessage({python:e,id:i,...t})})}async function g(e,a){return b(`
		import micropip
		micropip.install(${JSON.stringify(e)})
	`,a)}function y(e){return`await (await pyfetch("${e}")).bytes()`}function $(){let e=location.pathname;return e.endsWith("/")?e:e+"/"}async function S(e,a,t){return b(`
		from pyodide.http import pyfetch
		with open("${a}", "wb") as my_file:
			my_file.write(${y(e)})
	`,t)}function E(e,a){let t=document.createElement("a");t.href=e,t.download=a,document.body.append(t),t.click(),URL.revokeObjectURL(e),t.remove()}h.onmessage=function(e){let{id:a,...t}=e.data,{onSuccess:i,onError:n}=w.get(a);w.delete(a),Object.hasOwn(t,"error")?n(t.error):i(t.result)};let L=(async()=>{await S(`${$()}assets/utils.py`,"utils.py"),await b("import utils")})(),q=g("python-calamine");q.then(()=>b("import python_calamine"));let k=g("xlsxwriter",!0),_={csv:async function(e,a){await L,await b(`${a} = utils.read_csv(${y(e)})`)},xlsx:async function(e,a){await q,await L,await b(`${a} = utils.read_excel(${y(e)})`)},parquet:async function(e,a){await L,await b(`${a} = utils.read_parquet(${y(e)})`)}};async function T(e,a){let t=_[e.name.toLowerCase().match(/[^.]\.([^.]+)$/)?.[1]],i=URL.createObjectURL(e),n=t(i,a);return n.finally(()=>URL.revokeObjectURL(i)),n}let x={CSV:async function(e,a){await L,E(await b(`utils.to_csv(${e})`),`${a}.csv`)},Excel:async function(e,a){await k,await L,E(await b(`utils.to_excel(${e})`),`${a}.xlsx`)},Parquet:async function(e,a){await L,E(await b(`utils.to_parquet(${e})`),`${a}.parquet`)}};async function N(e,a,t){return x[t](e,a)}async function P(e,a){return b(`
		${a} = ${e}
		del ${e}
	`)}async function M(e){return b(`del ${e}`)}async function W(e){return b(`${e}.columns.tolist()`)}async function D(e){return await L,b(`utils.num_vars(${e})`)}function z(e,a){return e&&e!=a?`, "${e}"`:""}async function H(e,a,t){return await L,b(`utils.harmonized_variables(${e}, ${a}${z(t)})`)}async function F(e,a,t,i){return await L,b(`utils.${a?"numeric":"categories"}_details("${e}", ${t}${z(i,e)})`)}async function A(e,a,t,i){await L;let n=await b(`utils.${a?"numeric":"categories"}_inferred_totals("${e}", ${t}${z(i)})`);return a?n:new Map(n)}async function O(e,a){return await L,await b(`utils.pop_total(${e}${z(a)})`)}let C=new p("load"),V={value:!1},j=new p,B=new p;class R{constructor(e){this.targetName=e,this.event=new u}subscribe(e,a){this.event.addListener(e,a)}cancel(e){if(this[e]){let a=this[e].id;this[e].loadPromise.then(()=>M(a)),this[e]=null,this.event.dispatch()}}loadTemp(e){this.cancel("temp");let a={id:`temp${s++}`,filename:e.name};return a.loadPromise=T(e,a.id),this.temp=a,this.event.dispatch(),a.loadPromise.then(()=>{a.id==this.temp?.id&&(a.loaded=!0,this.event.dispatch())}).catch(e=>{if(a.id==this.temp?.id)throw console.error(e),this.temp=null,this.event.dispatch(),e})}confirmTemp(){this.cancel("final"),this.final=this.temp,this.temp=null,this.event.dispatch()}confirmFinal(){let a=this.final;return this.final=null,this.event.dispatch(),P(a.id,this.targetName).then(()=>{let t=a.filename.replace(/\.[^.]+$/,"");if("np_sample"==this.targetName)j.value=t;else if("p_sample"==this.targetName)e=a.weights,B.value=t;else throw Error(`Invalid name: ${this.targetName}`)})}}let G=new R("np_sample"),J=new R("p_sample");for(let e of[G,J])C.addGlobalListener(()=>e.cancel("final"));B.addGlobalListener(()=>{a=B.value&&O("p_sample",e)});let I=["en","es"];async function U(e){return l(`texts/${e}/texts.json`).then(e=>e.json())}let K=new p(localStorage.language||navigator.languages.map(e=>e.slice(0,2)).find(e=>I.includes(e))||"en"),Q=U(K.value),X=U("en");async function Y(e){return(await Q)[e]||(await X)[e]}async function Z(){let e=t=s++,[a,i]=await Promise.all([Q,X]);if(e==t)for(let e of document.querySelectorAll("[data-i18n]")){let t=e.getAttribute("data-i18n");e.innerHTML=a[t]||i[t];let n=e.getAttribute("data-i18n-href");n&&(e.href=a[n]||i[n])}}Z(),K.addGlobalListener(()=>{Q=U(K.value),C.value=C.value,Z(),localStorage.language=K.value}),async function(){let e=r(`<a data-i18n="changeLang">${await Y("changeLang")}</a>`);function a(){e.setAttribute("data-lang",I.find(e=>e!=K.value))}a(),e.addEventListener("click",async()=>{e.style.cursor="wait",K.value=e.getAttribute("data-lang"),await Q,a(),e.style.cursor="pointer"}),document.querySelector(".footer-links").prepend(e,r('<div class="header-divider"></div>'))}();let ee={maximumFractionDigits:2,minimumFractionDigits:2,maximumSignificantDigits:3,minimumSignificantDigits:3,roundingPriority:"morePrecision"},ea=Intl.NumberFormat(void 0,ee);ee.style="percent";let et=Intl.NumberFormat(void 0,ee);function ei(e){for(let a of e.querySelectorAll("dialog"))a.querySelector(".close-button").onclick=()=>a.close()}async function en(e){let a=r(`<dialog class="modal error">
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
		<img src="images/error.svg">
		<article>
			<h4>${await Y("error")}</h4>
			<p>${e}</p>
		</article>
		<button class="button" autofocus>${await Y("acceptError")}</button>
	</dialog>`);a.querySelectorAll("button").forEach(e=>e.addEventListener("click",()=>a.close())),a.addEventListener("close",()=>a.remove()),document.body.append(a),a.showModal()}async function es(e){let a=r(`<dialog class="modal loading">
		<img src="images/loading.svg"/>
		<p>${await Y("loading")}</p>
		<p>${e}</p>
	</dialog>`);return a.addEventListener("cancel",e=>e.preventDefault()),a.addEventListener("close",()=>a.showModal()),a}function el(e,a){let t=r(`<article class="feedback">
		<img src="images/check-circle.svg"/>
		<div>
			<h3>${e}</h3>
			<p>${a}</p>
		</div>
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
	</article>`);return t.querySelector(".close-button").addEventListener("click",()=>t.remove()),t}function er(e,a){return r(`<option${a?` value="${a}"`:""}>${e}</option>`)}function eo(e,a,t,i){let n=r(`<section class="estimation-table" style="--columns: ${e[e.length-1].length}"></section>`);for(let s=0;s<e.length;s++){let l=e[s],o=r(`<div class="row${s<a?" titles":""}"></div>`);for(let e=0;e<l.length;e++){let n=r(`<article>${l[e]}</article>`);(s<a||e<t)&&(n.classList.add("title"),i&&s==a-1&&e>=l.length-2&&n.classList.add("expanded")),o.append(n)}n.append(o)}return n}let ec=[G,J];function ed(e,a){let t=r(e[a]?`<article class="uploaded-file">
			<span>${e[a].filename}</span>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
			<progress ${e[a].loaded?'value = "1"':""}></progress>
		</article>`:'<article class="uploaded-file" hidden></article>');return t.querySelector(".close-button")?.addEventListener("click",()=>e.cancel(a)),e.subscribe(t,()=>t.replaceWith(ed(e,a))),t}async function eu(e){let a=r(`<select name="weights-var">
		<option value="">${await Y("noWeights")}</option>
	</select>`);return e?a.append(...e.map(e=>r(`<option>${e}</option>`))):a.disabled=!0,a}async function ep(e){let a=r(`<section class="modal-input">
		<div class="modal-input-top">
			<h4>${await Y("loadFile2Subaction")}</h4>
			<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await Y("loadFile2SubactionHelp")}</span></span>
		</div>
		<select></select>
		<p>${await Y("loadFile2SubactionSubtitle")}</p>
	</section>`);async function t(e){let t=await eu(e);return a.querySelector("select").replaceWith(t),t}return t(),e.subscribe(a,async()=>{let a=e.temp;if(a?.loaded){let i=await D(a.id);if(a.id==e.temp?.id){let e=await t(i);e.addEventListener("change",()=>a.weights=e.value)}}else t()}),a}async function em(e){let a=r(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await Y("loadFile"+e+"Title")}</h3>
				<p>${await Y("loadFile"+e+"Subtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input padded">
			<div class="modal-input-top">
				<h4>${await Y("loadFile"+e+"Action")}</h4>
				<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await Y("loadFile"+e+"ActionHelp")}</span></span>
			</div>
			<label class="button reversed">
				<span class="large icon"><img src="images/upload.svg" data-inline/></span>
				<span>${await Y("fileButton")}</span>
				<input name="file${e}" type="file" accept=".csv,.xlsx,.parquet" autofocus/>
			</label>
			<p>${await Y("fileButtonSubtitle")}</p>
		</section>
		<article class="uploaded-file" hidden></article>
		<section class="buttons-row">
			<button class="button reversed minimal">${await Y("cancel")}</button>
			<button class="button" disabled>${await Y("fileButton")}</button>
		</section>
	</dialog>`),t=ec[e-1];a.querySelector(".button.reversed.minimal").addEventListener("click",()=>a.close());let i=a.querySelector("input[type=file]");i.addEventListener("change",()=>{t.loadTemp(i.files[0]).catch(async e=>en(await Y("loadFileError")))}),i.addEventListener("click",()=>i.value=""),a.querySelector(".uploaded-file").replaceWith(ed(t,"temp"));let n=a.querySelector(".buttons-row > .button:last-of-type");return t.subscribe(n,()=>n.disabled=!t.temp?.loaded),n.addEventListener("click",()=>{t.confirmTemp(),a.close()}),2==e&&a.querySelector(".uploaded-file").after(await ep(t)),a.addEventListener("close",()=>t.cancel("temp")),a}async function eh(e){let a=r(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await Y(`loadOption${e}`)}</h3>
		<p>${await Y(`loadOption${e}Subtitle`)}</p>
		<article class="radio-file">
			<img src="images/empty.svg"/>
			<p>${await Y("fileSelect")}</p>
			<article class="uploaded-file" hidden></article>
			<button class="button small"><span class="icon"><img src="images/upload.svg" data-inline/></span><span>${await Y("fileButton")}</span></button>
		</article>
	</label>`),t=ec[e-1];a.querySelector(".radio-file").append(await em(e)),a.querySelector(".uploaded-file").replaceWith(ed(t,"final"));let i=a.querySelector(".button:has(+ dialog)");i.addEventListener("click",()=>i.nextElementSibling.showModal());let n=new p(t.final?.loaded);return t.subscribe(a,()=>n.value=t.final?.loaded),n.subscribe(i,()=>i.disabled=n.value),[a,n,()=>t.confirmFinal()]}async function ew(e){let a=r(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await Y(`download${e}Title`)}</h3>
				<p>${await Y(`download${e}Subtitle`)}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await Y("downloadFilename")}</h4>
			</div>
			<input name="filename" type="text" autofocus/>
		</section>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await Y("downloadFormat")}</h4>
			</div>
			<select name="format" class="big">
				<option value="" hidden>${await Y("downloadFormatPlaceholder")}</option>
				<option>CSV</option>
				<option>Excel</option>
				<option>Parquet</option>
			</select>
		</section>
		<section class="buttons-row">
			<button class="button reversed minimal">${await Y("cancel")}</button>
			<button class="button" disabled>${await Y("downloadConfirm")}</button>
		</section>
	</dialog>`),t=a.querySelector("input"),i=a.querySelector("select"),[n,s]=a.querySelectorAll(".button");function l(){s.disabled=!(t.value&&i.value)}return t.addEventListener("input",l),i.addEventListener("change",l),n.addEventListener("click",()=>a.close()),s.addEventListener("click",async()=>{let n=await es(await Y("downloadLoading"));a.append(n),n.showModal(),N(1==e?"np_sample":"p_sample",t.value,i.value).then(()=>{a.close()}).catch(async e=>{console.error(e),en(await Y("downloadError"))}).finally(()=>n.remove())}),l(),a}async function ev(a){if("left"==a||"right"==a){let t="left"==a?1:2,i=await Y(`loadFile${t}Title`),n="left"==a?j.value:B.value,s=r(`<header class="dual-header ${a}">
			<h2>${i}</h2>
			<label>
				<span>${await Y("actions")}</span>
				<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
				<input type="checkbox" hidden/>
				<nav class="dropdown from-button">
					<a>${await Y("loadNewData")}</a>
					<a>${await Y("downloadData")}</a>
				</nav>
			</label>
			<p>${n}</p>
			<div class="border"></div>
		</header>`);"right"==a&&s.append(r(`<article>
				<span>${await Y("weightsVar")}</span>
				<span>${e||await Y("noWeights")}</span>
			</article>`));let l=s.querySelectorAll("nav > a"),o=await Promise.all([em(t),ew(t)]),c=ec[t-1];c.subscribe(s,async()=>{if(c.final){let e=await es(await Y("loadFileLoading"));s.append(e),e.showModal(),c.confirmFinal()}});for(let e=0;e<o.length;e++)s.append(o[e]),l[e].addEventListener("click",()=>o[e].showModal());return s}if("single"==a)return r(`<header class="single-header"><h2>${await Y("loadFile1Title")}</h2><p>${j.value}</p></header>`);throw Error(`Invalid type: ${a}`)}async function ef(){let e=[];return B.value?e.push(await ev("left"),r('<div class="border"></div>'),await ev("right")):e.push(await ev("single")),e}let eb=["load","data","bias","weight","eval","estimation"];async function eg(e,a){let t=r('<nav class="tabs"></nav>');t.append(...await Promise.all(eb.map(async e=>r(`<button>${await Y(e+"Tab")}</button>`)))),e=eb.indexOf(e),t.children[e].classList.add("active");for(let i=0;i<t.children.length;i++){let n=t.children[i];n.addEventListener("click",()=>C.value=eb[i]),a||i==e||(n.disabled=!0)}return t}async function ey(e,a,t){let i=r(`<a>${await Y("export"+t)}</a>`),n=await ew(t);e.append(i),a.append(n),i.addEventListener("click",()=>n.showModal())}async function e$(){let e=r(`<article class="main-title-buttons">
		<label class="dropdown-button">
			<span>${await Y("download")}</span>
			<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
			<input type="checkbox" hidden/>
			<nav class="dropdown from-button color"></nav>
		</label>
	</article>`),a=e.querySelector(".dropdown");return j.value&&await ey(a,e,1),B.value&&await ey(a,e,2),ei(e),e}async function eS(){let e=r(`<main class="main-section">
		<nav class="breadcrumb">
			<a><img src="images/home.svg" data-inline/><span>${await Y("home")}</span></a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await Y("projectsTab")}</a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await Y("defaultProject")}</a>
		</nav>
		<section class="main-title">
			<article class="main-title-text">
				<h1>${await Y("defaultProject")}</h1>
				<p>${await Y("defaultProjectDesc")}</p>
			</article>
		</section>
		<nav class="tabs"></nav>
		<main></main>
	</main>`);return e.querySelector(".tabs").replaceWith(await eg(C.value,j.value)),j.value&&e.querySelector(".main-title").append(await e$()),e}async function eE(e){let a=r(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await Y("noFileTitle")}</h3>
		<p>${await Y("noFileSubtitle")}</p>
		<article class="radio-file">
			<img src="images/data.svg"/>
			<p>${await Y("noFileSubSubtitle")}</p>
			<button class="button small adjusted"><span>${await Y("noFileConfirm")}</span><span class="icon"><img src="images/arrow-right.svg" data-inline/></span></button>
		</article>
	</label>`),t=a.querySelector("button");t.addEventListener("click",()=>{t.disabled=!0,e.click()});let i=async()=>{B.value&&(await M("p_sample"),B.value=null)};return[a,new p(!0),i]}let eL=[,,];async function eq(e){return 1==e?`<button class="button" disabled>${await Y("next")}</button>`:`<section class="buttons-row">
			<button class="button reversed minimal">${await Y("back")}</button>
			<button class="button" disabled>${await Y("loadFileConfirm")}</button>
		</section>`}async function ek(e=1){let a=r(`<main class="main-content">
		<header>
			<h2>${await Y("loadTitle")}</h2>
			<p>${await Y("loadSubtitle")}</p>
		</header>
		<main class="data-load-content">
			<article class="stepper">
				<span class="step-icon active">${1==e?1:'<img src="images/check.svg"/>'}</span>
				<span class="step-text active">${await Y("loadStep1")}</span>
				<img src="images/stepper.svg"/>
				<span class="step-icon ${2==e?"active":""}">2</span>
				<span class="step-text ${2==e?"active":""}">${await Y("loadStep2")}</span>
			</article>
			${await eq(e)}
			<label class="radio-label"></label>
			${await eq(e)}
		</main>`),t=a.querySelectorAll(".data-load-content > .button, .data-load-content > .buttons-row > .button:last-of-type"),i=a.querySelector(".radio-label"),n=[eh(e)];for(let[a,l,r]of(2==e&&n.push(eE(t[0])),n=await Promise.all(n),i.after(...n.map(e=>e[0])),n)){let i=a.querySelector("input");for(let a of t){function s(){i.checked&&(a.disabled=!l.value,eL[e-1]=r)}i.addEventListener("change",s),l.subscribe(a,s)}}for(let i of t)i.addEventListener("click",async()=>{if(i.disabled=!0,e<2)a.replaceWith(await ek(e+1));else{let e=await es(await Y("loadFileLoading"));a.append(e),e.showModal(),await Promise.all(eL.map(e=>e())),V.value=!0,C.value="data"}});return a.querySelectorAll(".data-load-content > .buttons-row > .button:first-of-type").forEach(t=>{t.addEventListener("click",async()=>{t.disabled=!0,a.replaceWith(await ek(e-1))})}),i.remove(),ei(a),a}async function e_(){let e=await eS();return e.querySelector("main").replaceWith(await ek()),e}let eT=new class{constructor(){this.cache=new Map}set(e,a){this.cache.set(a.name,e),a.hasTotals.value=!0}delete(e){this.cache.delete(e.name),e.hasTotals.value=!1}async verify(e,a){let t=await a.npDetails();return!t.some(e=>null==e[0])&&(a.isNpNumeric?"number"==typeof e:t.length==e.size&&t.every(a=>e.has(a[0])))}async refresh(e){let a=this.cache;for(let t of(this.cache=new Map,e)){let e=a.get(t.name);e&&await this.verify(e,t)&&this.set(e,t)}}},ex=new class{constructor(){this.cache=new Set}refresh(e){let a=this.cache;for(let t of(this.cache=new Set,e))t.selected.addGlobalListener(()=>{t.selected.value?this.cache.add(t.name):this.cache.delete(t.name)}),t.selected.value=t.selectable.value&&a.has(t.name)}};class eN{static baseProperties=["name","inNp","inP","isNpNumeric","isPNumeric","isHarmonized","harmonReason","pWeights"];constructor(e){for(let a of eN.baseProperties)this[a]=e[a];this.selected=new p(!1),this.expanded=new p(!1),this.hasTotals=new p(!1),this.selectable=new p(this.isHarmonized),this.hasTotals.addGlobalListener(()=>this.selectable.value=this.isHarmonized||this.hasTotals.value),this.selectable.addGlobalListener(()=>{this.selected.value&&!this.selectable.value&&(this.selected.value=!1)})}async npDetails(){return this.npCache||(this.npCache=F(this.name,this.isNpNumeric,"np_sample")),this.npCache}async pDetails(){return this.pCache||(this.pCache=F(this.name,this.isPNumeric,"p_sample",e)),this.pCache}async inferredTotals(){return this.inferredCache||(this.inferredCache=A(this.name,this.isPNumeric,"p_sample",e)),this.inferredCache}getTotals(){return eT.cache.get(this.name)}setTotals(e){eT.set(e,this)}deleteTotals(){eT.delete(this)}}let eP=new class a{constructor(){this.event=new u}subscribe(e,a){this.event.addListener(e,a)}async variables(){return this.cache||(this.cache=this.variablesPromise().then(async e=>(await eT.refresh(e),ex.refresh(e),e))),this.cache}async filtered(e){return(await this.variables()).filter(e)}async harmonized(){return this.filtered(e=>e.isHarmonized)}async common(){return this.filtered(e=>e.inNp&&e.inP)}async npOnly(){return this.filtered(e=>e.inNp&&!e.inP)}async pOnly(){return this.filtered(e=>!e.inNp&&e.inP)}async get(e){return(await this.variables()).find(a=>a.name==e)}static async fromHarmonization(){let a=e,[t,i,n]=await Promise.all([H("np_sample","p_sample",a),D("np_sample"),D("p_sample")]);[i,n]=[i,n].map(e=>new Set(e));let s=[];function l(e){return new eN({pWeights:a,isNpNumeric:i.has(e.name),isPNumeric:n.has(e.name),...e})}s.push(...t.harmonized.map(e=>l({name:e,inNp:!0,inP:!0,isHarmonized:!0}))),s.push(...t.nonharmonized.map(e=>l({name:e.name,inNp:!0,inP:!0,isHarmonized:!1,harmonReason:e.reason})));for(let e=0;e<2;e++)s.push(...t.unrelated[e].map(a=>l({name:a,inNp:0==e,inP:1==e,isHarmonized:!1})));return s}static async fromData(){let[e,a]=[W("np_sample"),D("np_sample")];return a=new Set(await a),(await e).map(e=>new eN({name:e,inNp:!0,inP:!1,isNpNumeric:a.has(e)}))}refresh(){j.value?B.value?(this.areDual=!0,this.variablesPromise=a.fromHarmonization):(this.areDual=!1,this.variablesPromise=a.fromData):(this.areDual=null,this.variablesPromise=null),this.cache=null,this.event.dispatch()}};async function eM(e){return[await Y("missing"),et.format(e[1])]}async function eW(e){return null==e[0]?eM(e):[await Y(e[0]),ea.format(e[1])]}async function eD(e){return null==e[0]?eM(e):[e[0],et.format(e[1])]}async function ez(e,a){return Promise.all(e.map(a?eW:eD))}function eH(e,a,t,i){if(!e.hasDetails&&a.checked){e.hasDetails=!0;let a="right"==i?t.pDetails():t.npDetails(),n="right"==i?t.isPNumeric:t.isNpNumeric,s=r('<section class="details"></section>');a.then(async a=>{a=await ez(a,n),s.append(...a.map(e=>r(`<article><span>${e[0]}</span><span>${e[1]}</span></article>`))),e.append(s)})}}async function eF(e){let a=r('<button class="button reversed"></button>');async function t(){a.innerHTML=e.hasTotals.value?await Y("editTotals"):await Y("insertTotals")}return e.hasTotals.subscribe(a,t),t(),a}function eA(e,a,t){let i=[r(`<span>${e}</span>`),r('<label><input type="number" step="any" required/></label>')],n=i[1].querySelector("input");return a&&(n.valueAsNumber=a),t&&(n.readOnly=!0),i}async function eO(e){let a=await e.npDetails(),t=r(`<section class="totals-container${e.isHarmonized?"":" single"}" style="--items: ${e.isNpNumeric?1:a.length}">
		<article class="totals-article">
			<h4>${await Y("totals1")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>
	</section>`),i=t.querySelector(".totals-items"),n=e.getTotals();if(e.isNpNumeric)i.append(...eA(await Y("total"),n));else for(let[e]of a)i.append(...eA(e,n?.get(e)));if(e.isHarmonized){let n=r(`<article class="totals-article">
			<h4>${await Y("totals2")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>`);t.append(n),n=n.querySelector(".totals-items");let s=await e.inferredTotals();if(e.isPNumeric)n.append(...eA(await Y("total"),s,!0));else for(let[e,a]of s)n.append(...eA(e,a,!0));let l=r(`<button class="button reversed">${await Y("inferTotals")}</button>`);l.addEventListener("click",()=>(function(e,a,t,i){let n=e.querySelectorAll("input");if(i)n[0].valueAsNumber=t;else for(let e=0;e<a.length;e++)n[e].valueAsNumber=t.get(a[e][0])})(i,a,s,e.isPNumeric)),t.querySelector(".totals-article").append(l)}return t}async function eC(e,a,t){let i=[...e.querySelectorAll("input")];if(i.every(e=>!e.value))a.deleteTotals(),t.close();else if(i.every(e=>e.reportValidity())){if(a.isNpNumeric)a.setTotals(i[0].valueAsNumber);else{let e=await a.npDetails();a.setTotals(new Map(e.map((e,a)=>[e[0],i[a].valueAsNumber])))}t.close()}}async function eV(e){let a=r(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await Y("editTotals")}</h3>
				<p>${await Y("editTotalsSubtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="totals-container"></section>
		<section class="buttons-row">
			<button class="button reversed minimal" disabled>${await Y("deleteTotals")}</button>
			<section>
				<button class="button reversed minimal">${await Y("cancel")}</button>
				<button class="button" disabled>${await Y("setTotals")}</button>
			</section>
		</section>
	</dialog>`),[t,i,n]=a.querySelectorAll(".button");return a.addEventListener("open",async()=>{(await e.npDetails()).some(e=>null==e[0])?(en(await Y("missingError")),a.close()):(a.querySelector(".totals-container").replaceWith(await eO(e)),n.disabled=!1,t.disabled=!1)}),i.addEventListener("click",()=>a.close()),n.addEventListener("click",()=>eC(a.querySelector(".totals-items"),e,a)),t.addEventListener("click",()=>{a.querySelector(".totals-items").querySelectorAll("input").forEach(e=>e.value="")}),a}async function ej(e){let a=await eF(e),t=await eV(e);return a.addEventListener("click",()=>{t.showModal(),t.dispatchEvent(new Event("open"))}),[a,t]}async function eB(e){let a=r(`<header class="variable header">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${await Y("variables")}</span>
	</header>`);"single"!=e&&a.classList.add(e),"right"!=e&&a.querySelector(".border").after(r(`<label class="checkbox icon">
			<input type="checkbox" hidden/>
			<img src="images/check.svg"/>
		</label>`));let t=await eP.filtered(a=>a["right"==e?"inP":"inNp"]),[i,n]=a.querySelectorAll("input");i.addEventListener("change",()=>{t.forEach(e=>{e.expanded.value!=i.checked&&(e.expanded.value=i.checked)})}),n?.addEventListener("change",()=>{t.forEach(e=>{e.selectable.value&&e.selected.value!=n.checked&&(e.selected.value=n.checked)})});let s=m(()=>i.checked=t.every(e=>e.expanded.value)),l=m(()=>{let e=t.filter(e=>e.selectable.value);n.checked=e.length&&e.every(e=>e.selected.value)});for(let e of t)e.expanded.subscribe(a,s),n&&(e.selected.subscribe(a,l),e.selectable.subscribe(a,l));return s(),n&&l(),a}async function eR(e){let a=r('<article class="variable-status"></article>');return e.isHarmonized?a.innerHTML='<img width="24" height="24" src="images/check-circle.svg"/>':e.harmonReason?a.innerHTML=`<span class="lead left"><img src="images/lead.svg"/><span class="tooltip">${await Y(e.harmonReason+"Reason")}</span></span><img src="images/check-yellow.svg"/>`:a.innerHTML='<img src="images/block.svg"/>',a}async function eG(e,a){let t,i,n=r(`<article class="variable view ${"single"!=a?a:""} ${e.isHarmonized?"harmonized":""}">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${e.name}</span>
	</article>`),s=n.querySelector("input");return s.checked=e.expanded.value,s.addEventListener("change",()=>e.expanded.value=s.checked),e.expanded.subscribe(n,()=>{s.checked=e.expanded.value,eH(n,s,e,a)}),"right"!=a&&n.querySelector(".border").after(((i=(t=r(`<label class="checkbox icon">
		<input type="checkbox" hidden/>
		<img src="images/check.svg"/>
	</label>`)).querySelector("input")).checked=e.selected.value,i.disabled=!e.selectable.value,i.addEventListener("change",()=>e.selected.value=i.checked),e.selected.subscribe(t,()=>i.checked=e.selected.value),e.selectable.subscribe(t,()=>i.disabled=!e.selectable.value),t)),"right"==a?n.append(await eR(e)):n.append(...await ej(e)),eH(n,s,e,a),n}function eJ(){return r('<div class="border"></div>')}function eI(e,a,t){e.expanded.subscribe(t,()=>{a.expanded.value!=e.expanded.value&&(a.expanded.value=e.expanded.value)})}async function eU(){let e=[];if(eP.areDual){e.push(await eB("left"),eJ(),await eB("right"));let[a,t,i]=await Promise.all([eP.common(),eP.npOnly(),eP.pOnly()]),n=Math.max(t.length,i.length);for(let t of a)e.push(await eG(t,"left"),eJ(),await eG(t,"right"));for(let a=0;a<n;a++){let n,s;t[a]&&(n=await eG(t[a],"left"),e.push(n)),e.push(eJ()),i[a]&&(s=await eG(i[a],"right"),e.push(s)),t[a]&&i[a]&&(eI(t[a],i[a],n),eI(i[a],t[a],s))}}else{e.push(await eB("single"));let a=(await eP.variables()).map(e=>eG(e,"single"));e.push(...await Promise.all(a))}return e}async function eK(){let e;eP.variables().catch(async e=>{console.error(e),en(await Y("loadFileFinalError")),C.value="load"});let a=r('<main class="main-content"></main>');if(eP.areDual){if(e=r('<section class="dual-container"></section>'),V.value){let e=(await Y("loadedFilesSubtitle")).replace("$nVars",(await eP.harmonized()).length);a.append(el(await Y("loadedFilesTitle"),e))}}else e=r('<section class="dual-container single"></section>');return e.append(...await ef()),e.append(...await eU()),a.append(e),ei(a),V.value=!1,eP.subscribe(a,async()=>a.replaceWith(await eK())),a}async function eQ(){let e=await eS();return e.querySelector("main").replaceWith(await eK()),e}async function eX(e){let a=await eP.harmonized(),t=r(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await Y("biasVar")}</span>
				<select id="bias-var" required${a.length?"":" disabled"}>
					<option value="" hidden>${await Y("selectVar")}</option>
				</select>
			</label>
			<button id="estimate" class="button compact" disabled>${await Y("getBias")}</button>
		</section>
	</section>`),i=t.querySelector("#bias-var");i.append(...a.map(e=>er(e.name)));let n=t.querySelector("#estimate");return i.addEventListener("change",()=>{n.disabled=!i.value}),n.onclick=()=>{n.disabled=!0,e(i.value)},t}j.addGlobalListener(()=>eP.refresh()),B.addGlobalListener(()=>eP.refresh()),eP.refresh();let eY=g("altair==6.2.2",!0).then(async()=>{await S(`${$()}assets/charts.py`,"charts.py",!0),await b("import charts",!0)}),eZ=new Promise(e=>{document.head.querySelector("[data-id=vegaEmbed]").onload=()=>e()}),e0=[];async function e1(e,a){await eZ;let t=(await vegaEmbed(e,a,{renderer:"canvas"})).finalize;setTimeout(()=>e0.push([e,t]))}function e2(e){if(document.body.contains(e[0]))return!0;e[1]()}async function e4(e,a,t,i){return await eY,e1(i,JSON.parse(await b(`charts.single${"data"in t?"_categorical":""}("${e}", "${a}", ${JSON.stringify(t)})`)))}async function e3(e,a,t,i,n){return await eY,e1(n,JSON.parse(await b(`charts.compared${"data"in t?"_categorical":""}("${e}", ${JSON.stringify(a)}, ${JSON.stringify(t)}, ${JSON.stringify(i)})`)))}async function e5(e,a,t,i){return await eY,e1(i,JSON.parse(await b(`charts.${e}(${JSON.stringify(a)}, ${t})`)))}async function e8(e,a,t,i){let n=[[e],["",j.value,B.value]];if(i)n.push([await Y("mean"),ea.format(a.get("mean")),ea.format(t.get("mean"))]);else for(let[e,i]of a.entries())n.push([null==e?await Y("missing"):e,et.format(i),et.format(t.get(e))]);return[n,2,1]}async function e6(e,a,t,i){let n,s,l,r=[[e],["",await Y("biasAbsolute"),await Y("biasRelative")]];if(i)n=t.get("mean"),l=(s=a.get("mean")-n)/n,r.push([await Y("mean"),ea.format(s),et.format(l)]);else for(let[e,i]of a.entries())l=(s=i-(n=t.get(e)))/n,r.push([null==e?await Y("missing"):e,ea.format(100*s),et.format(l)]);return[r,2,1]}async function e7(e,a){if(a)return{estimation:e.get("mean")};{let a=await Y("missing");return{index:[...e.keys()].map(e=>null==e?a:e),columns:["estimation"],data:[...e.values()].map(e=>[e])}}}async function e9(e){let a=r(`<main class="estimation-results">
		<article>
			<h4>${await Y("biasTable")}</h4>
		</article>
		<article>
			<h4>${await Y("biasDifference")}</h4>
		</article>
		<article>
			<h4>${await Y("biasChart")}</h4>
			<div></div>
		</article>
	</main>`),[t,i,n]=a.querySelectorAll("article"),s=await eP.get(e),[l,o]=await Promise.all([s.npDetails(),s.pDetails()]).then(e=>e.map(e=>new Map(e))),c=s.isNpNumeric;return t.append(eo(...await e8(e,l,o,c))),i.append(eo(...await e6(e,l,o,c))),e3(e,[j.value,B.value],await e7(l,c),await e7(o,c),n.lastElementChild),a}async function ae(){let e=r(`<main class="main-content">
		<header>
			<h2>${await Y("biasTitle")}</h2>
			<h3>${j.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await Y((await eP.harmonized()).length?"emptyBias":"invalidBias")}</p>
			<img src="images/empty.svg"/>
			<span>${await Y("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await es(await Y("biasLoading"));e.append(i),i.showModal(),await e9(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),en(await Y("biasError")),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await eX(a)),e}async function aa(){let e=await eS();return e.querySelector("main").replaceWith(await ae()),e}setInterval(function(){e0=e0.filter(e2)},1e3);let at=g("inps",!0).then(()=>b("import inps",!0));function ai(e,a){return a?`, ${e} = ${JSON.stringify(a)}`:""}async function an(e,a,t,i,n){await Promise.all([L,at]),await b(`
		from js import my_totals
		temp_sample, temp_totals = utils.prepare_calibration(${a}, my_totals.to_py()${ai("weights_var",i)})
	`,!1,{my_totals:t});let s=`${ai("weights_column",i)}${ai("population_size",n)}`;await b(`${a}["${e}"] = inps.calibration_weights(temp_sample, temp_totals${s})`),await b("del temp_sample, temp_totals")}async function as(e,a,t,i,n,s,l,r){await at;let o=`${ai("weights_column",i)}${ai("population_size",n)}${ai("covariates",s)}`;l&&(o+=", model = inps.boosting_classifier()"),await b(`${a}["${e}"] = inps.${r?"kw":"psa"}_weights(${a}, ${i?`${t}.dropna(subset = "${i}")`:t}${o})${r?"":'["np"]'}`)}async function al(e,a,t,i,n,s,l){await Promise.all([L,at]);let r=`${ai("weights_var",a)}${ai("method",t)}${ai("covariates",s)}${ai("p_weights_var",l)}`;return b(`utils.estimation(${i}, '${e}'${n?", p_sample = "+n:""}${r})`)}class ar{constructor(){this.name=Y("calibration"),this.title=Y("calibrationTitle"),this.description=Y("calibrationDescription"),this.variables=eP.filtered(e=>e.selected.value&&e.hasTotals.value),this.acceptsOrig=!0}async estimate(e,a,t){if(!a&&!t)throw this.errorMsg=Y("calibrationMissing"),Error("Info missing");this.errorMsg=Y("calibrationError");let i=new Map((await this.variables).map(e=>[e.name,e.getTotals()]));await an(e,"np_sample",i,t,a),j.event.dispatch()}}class ao{constructor(e,a){this.boosted=e,this.kernels=a;let t=a?"kw":"psa";e&&(t+="Boost"),this.name=Y(t),this.title=Y(t+"Title"),this.description=Y(t+"Description"),this.errorMsg=Y(t+"Error"),this.variables=eP.filtered(e=>e.selected.value&&e.isHarmonized),this.acceptsOrig=!1}async estimate(a,t,i){let n=(await this.variables).map(e=>e.name);await as(a,"np_sample","p_sample",e,t,n,this.boosted,this.kernels),j.event.dispatch()}}let ac=["psa","calibration"];async function ad(){return r(`<main class="main-content">
		<header>
			<h2>${await Y("weightTitle")}</h2>
			<h3>${j.value}</h3>
		</header>
		<main class="empty-content">
			<p>${await Y("emptyDescription")}</p>
			<img src="images/empty.svg"/>
			<span>${await Y("emptyTitle")}</span>
		</main>
	</main>`)}async function au(e){let a=r(`<section class="vars-table">
		<article>${await Y("activeVars")}</article>
	</section>`);for(let t of e)a.append(r(`<article>${t}</article>`));return a}async function ap(e){let a=new Set([...e.options].map(e=>e.value));for(let t of ac)if(t=await Y(t),a.has(t)){e.value=t;return}}async function am(){let e=r(`<main class="main-content">
		<header>
			<h2>${await Y("weightTitle")}</h2>
			<h3>${j.value}</h3>
		</header>
		<form class="weight-form">
			<section class="inputs">
				<label for="method">
					<span>${await Y("method")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await Y("methodTitle")}</h4>
							<p>${await Y("methodDescription")}</p>
						</span>
					</span>
				</label>
				<select id="method" required>
					<option value="" hidden>${await Y("methodPlaceholder")}</option>
				</select>
				<article class="extra">
					<span>${await Y("methodExplain")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await Y("methodExplainTitle")}</h4>
							<p>${await Y("methodExplainDescription")}</p>
						</span>
					</span>
				</article>
				<label for="orig-weights" hidden>
					<span>${await Y("origWeights")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await Y("origWeightsTitle")}</h4>
							<p>${await Y("origWeightsDescription")}</p>
						</span>
					</span>
				</label>
				<select id="orig-weights" hidden>
					<option value="">${await Y("uniformWeights")}</option>
				</select>
				<label for="pop-size">
					<span>${await Y("popSize")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await Y("popSizeTitle")}</h4>
							<p>${await Y("popSizeDescription")}</p>
						</span>
					</span>
				</label>
				<input id="pop-size" type="number" placeholder="${await Y("popSizePlaceholder")}"/>
			</section>
			<section class="vars-table" hidden></section>
			<a hidden>${await Y("changeVars")}</a>
			<section class="inputs single">
				<label for="new-var-name">${await Y("newVar")}</label>
				<input id="new-var-name" type="text" placeholder="${await Y("newVarPlaceholder")}" required/>
			</section>
			<button class="button" type="button">${await Y("weightButton")}</button>
		</form>
	</main>`);function t(a){return e.querySelector(a)}let[i,n,s]=["#method",".extra h4",".extra p"].map(t),l=["#orig-weights",'[for="orig-weights"]'].map(t),o=["#pop-size",'[for="pop-size"]'].map(t),c=t(".vars-table + a"),d=t("#new-var-name"),u=t("button"),p=await a;for(let a of(l[0].append(...(await eP.filtered(e=>e.isNpNumeric)).map(e=>r(`<option>${e.name}</option>`))),p&&(o[0].placeholder=o[0].placeholder.replace(/\d+/,Math.round(p))),c.addEventListener("click",()=>C.value="data"),u.onclick=()=>i.reportValidity(),[new ar,new ao,new ao(!0),new ao(!1,!0),new ao(!0,!0)])){let t=await a.variables;if(t.length){let[p,m,h]=await Promise.all([a.name,a.title,a.description]);i.append(r(`<option>${p}</option>`)),i.addEventListener("change",async()=>{i.value==p&&(n.innerHTML=m,s.innerHTML=h,function(e,a,t){e.forEach(e=>e.hidden=!t),e[0].onchange=()=>a.forEach(a=>a.hidden=t&&!!e[0].value),e[0].onchange()}(l,o,a.acceptsOrig),e.querySelector(".vars-table").replaceWith(await au(t.map(e=>e.name))),c.hidden=!1,u.onclick=async()=>{if(d.reportValidity()&&(o[0].hidden||o[0].reportValidity())){let t=await es(await Y("weightLoading"));e.append(t),t.showModal(),a.estimate(d.value,o[0].valueAsNumber,l[0].value).then(()=>{V.value=d.value,C.value="eval"}).catch(async e=>{console.error(e),en(await a.errorMsg),t.remove()})}})})}}return await ap(i),i.dispatchEvent(new Event("change")),e}async function ah(){return(await eP.variables()).some(e=>e.selected.value)?am():ad()}async function aw(){let e=await eS();return e.querySelector("main").replaceWith(await ah()),e}async function av(e,a,t,i=!1){let n=r(`<label>
		<span>${a}</span>
		<select id="${e}" ${i?"disabled":"required"}>
			<option value="" hidden>${await Y("selectVar")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>er(e.name))),n}async function af(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function ab(e,a){let t=await eP.filtered(e=>e.isNpNumeric),i=r(`<section class="selectors">
		<section class="row">
			<label id="eval-var"></label>
			<div class="divider"></div>
			<label>
				<span>${await Y("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<button id="estimate" class="button compact" disabled>${await Y("getEval")}</button>
		</section>
	</section>`),[n,s]=["#eval-var","#compare-var"].map(e=>i.querySelector(e));n=await af(n,av("eval-var",await Y("weightsVar"),t)),s=await af(s,av("compare-var",await Y("compareVar"),t,!0));let l=i.querySelector("#compare");l.addEventListener("change",()=>{s.disabled=!l.checked});let o=i.querySelector("#estimate");function c(){o.disabled=!n.value||l.checked&&(!s.value||s.value==n.value)}for(let e of[n,l,s])e.addEventListener("change",c);return o.onclick=()=>{o.disabled=!0,e(n.value,l.checked,s.value)},a&&setTimeout(()=>{n.value=a,e(n.value)}),i}async function ag(e,a){return await L,b(`utils.weights_properties(${e}["${a}"])`)}async function ay(e,a,t){let i,n,s=["",e];a&&s.push(t);let l=[s];i=ag("np_sample",e),a&&(n=ag("np_sample",t)),[i,n]=await Promise.all([i,n]);for(let e=0;e<i.length;e++){let[t,s]=i[e],r=[await Y(t),ea.format(s)];a&&r.push(ea.format(n[e][1])),l.push(r)}return[l,1,1]}async function a$(e,a,t){let i=r(`<main class="estimation-results">
		<article>
			<h4>${await Y("evalProperties")}</h4>
		</article>
		<article>
			<h4>${await Y("evalBoxplot")}</h4>
			<div></div>
		</article>
		<article>
			<h4>${await Y("evalHistogram")}</h4>
			<div></div>
		</article>
	</main>`),n=[e];a&&n.push(t);let[s,l,o]=i.querySelectorAll("article");return[i,Promise.all([ay(e,a,t).then(e=>s.append(eo(...e))),e5("boxplot",n,"np_sample",l.lastElementChild),e5("histogram",n,"np_sample",o.lastElementChild)])]}async function aS(){let e=r(`<main class="main-content">
		<header>
			<h2>${await Y("evalTitle")}</h2>
			<h3>${j.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await Y("emptyEval")}</p>
			<img src="images/empty.svg"/>
			<span>${await Y("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await es(await Y("evalLoading"));e.append(i),i.showModal(),await a$(...t).then(a=>(e.querySelector("main").replaceWith(a[0]),a[1])).catch(async a=>{console.error(a),en(await Y("evalError")),e.querySelector("#estimate").disabled=!1}),i.remove()}if(V.value){let a=(await Y("estimatedWeightSubtitle")).replace("$name",V.value);e.prepend(el(await Y("estimatedWeightTitle"),a))}return e.querySelector(".selectors").replaceWith(await ab(a,V.value)),V.value=!1,e}async function aE(){let e=await eS();return e.querySelector("main").replaceWith(await aS()),e}async function aL(e,a,t,i=!1){let n=r(`<label>
		<span>${a}</span>
		<select id="${e}"${i?" disabled":""}>
			<option value="">${await Y("uniformWeights")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>er(e))),n}let aq=["advancedPsa","advancedPsaBoost","advancedKw","advancedKwBoost","advancedLinearMatching","advancedBoostedMatching","advancedLinearTraining","advancedBoostedTraining"];async function ak(e,a){let t=await Promise.all(aq.map(async e=>er(await Y(e),e)));e.append(...t),a.addEventListener("change",()=>{if(a.value)for(let a of t)e.value==a.value&&(e.value=""),a.hidden=!0;else t.forEach(e=>{e.hidden=!1})})}async function a_(e,a,t,i,n=!1){let s=r(`<label>
		<span>${a}</span>
		<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await Y("estimationMethodDescription")}</span></span>
		<select id="${e}"${n?" disabled":""}>
			<option value="">${await Y("noMatching")}</option>
		</select>
	</label>`);if(t){let e=s.querySelector("select");e.append(er(await Y("linearMatching"),"linear"),er(await Y("boostedMatching"),"boosting")),ak(e,i)}return s}async function aT(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function ax(e){let a=r(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await Y("targetVar")}</span>
				<select id="target-var" required>
					<option value="" hidden>${await Y("selectVar")}</option>
				</select>
			</label>
			<label id="weights-var"></label>
			<label id="estimation-method"></label>
		</section>
		<div class="border"></div>
		<section class="row">
			<label>
				<span>${await Y("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<label id="compare-method"></label>
			<button id="estimate" class="button compact" disabled>${await Y("estimate")}</button>
		</section>
	</section>`),[t,i,n,s,l,o,c]=["target-var","weights-var","compare-var","estimation-method","compare-method","compare","estimate"].map(e=>a.querySelector("#"+e)),d=await eP.variables(),u=d.filter(e=>e.isNpNumeric).map(e=>e.name);t.append(...d.map(e=>er(e.name))),i=await aT(i,aL("weights-var",await Y("weightsVar"),u)),n=await aT(n,aL("compare-var",await Y("compareVar"),u,!0));let p=d.some(e=>e.isHarmonized&&e.selected.value);function m(){c.disabled=!t.value}for(let e of(s=await aT(s,a_("estimation-method",await Y("estimationMethod"),p,i)),l=await aT(l,a_("compare-method",await Y("compareMethod"),p,n,!0)),o.onchange=()=>{n.disabled=!o.checked,l.disabled=!o.checked},[t,i,n,s,l,o]))e.addEventListener("change",m);return c.onclick=()=>{c.disabled=!0,e(t.value,i.value,s.value,o.checked,n.value,l.value)},a}async function aN(e,a,t){let i="data"in a,n=[[e]],s=t?2:1,l=!!t;if(t){let e=["",await Y("mainEstimation"),await Y("altEstimation")];i&&e.unshift(""),n.push(e)}let r=i?"percentageEstimation":"numericEstimation",o=i?"pertentageInterval":"numericInterval";[r,o]=await Promise.all([r,o].map(Y));let c=i?et:ea;if(i){function d(e){return[c.format(e[0]),""]}function u(e){return[e[1],e[2]].map(e=>c.format(e))}for(let e=0;e<a.index.length;e++){let i=[a.index[e],r];i.push(...d(a.data[e]));let s=["",o];if(s.push(...u(a.data[e])),t){let n=t.index.indexOf(a.index[e]);i.push(...d(t.data[n])),s.push(...u(t.data[n]))}n.push(i,s)}}else{let e=[r,c.format(a.estimation),""];t&&e.push(c.format(t.estimation),"");let i=[o,c.format(a.interval_lower),c.format(a.interval_upper)];t&&i.push(c.format(t.interval_lower),c.format(t.interval_upper)),n.push(e,i)}return[n,s,i?2:1,l]}async function aP(a,t,i,n,s,l){let o,c,d;(i||l)&&(d=(await eP.filtered(e=>e.isHarmonized&&e.selected.value)).map(e=>e.name)),o=al(a,t,i,"np_sample",eP.areDual&&"p_sample",d,e),n&&(c=al(a,s,l,"np_sample",eP.areDual&&"p_sample",d,e)),[o,c]=await Promise.all([o,c]);let u=r(`<main class="estimation-results">
		<article>
			<h4>${await Y(n?"comparedHeader":"estimationHeader")}</h4>
		</article>
		<article>
			<h4>${await Y(n?"comparedChartHeader":"estimationChartHeader")}</h4>
			<div></div>
		</article>
	</main>`),[p,m]=u.querySelectorAll("article");p.append(eo(...await aN(a,o,c)));let h=await Y("mainEstimation");return n&&(h=[h,await Y("altEstimation")]),n?e3(a,h,o,c,m.lastElementChild):e4(a,h,o,m.lastElementChild),u}async function aM(e){return e.includes("different number of classes")||e.includes("minimum number of groups")?Y("lowDataError"):Y("estimationError")}async function aW(){let e=r(`<main class="main-content">
		<header>
			<h2>${await Y("estimationTitle")}</h2>
			<h3>${j.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await Y("emptyEstimation")}</p>
			<img src="images/empty.svg"/>
			<span>${await Y("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await es(await Y("estimationLoading"));e.append(i),i.showModal(),await aP(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),en(await aM(a)),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await ax(a)),e}async function aD(){let e=await eS();return e.querySelector("main").replaceWith(await aW()),e}let az=import("https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.min.js").then(e=>e.marked),aH=document.querySelector("section.help-section"),aF=aH.querySelector("article");function aA(){aH.classList.toggle("active")}async function aO(){aF.innerHTML="";let e=i=s++,a=l(`texts/${K.value}/help/${C.value}.md`).then(e=>e.text()).catch(e=>(console.error(e),"# Error")),t='<button class="close-button"><img src="images/close.svg" data-inline/></button>'+(await az).parse(await a);e==i&&(aF.innerHTML=t,aF.querySelector("button").addEventListener("click",aA),aF.querySelectorAll("a").forEach(e=>{e.target="_blank"}))}async function aC(){let e;scrollTo(0,0);let a=n=s++;if("load"==C.value)e=e_();else if("data"==C.value)e=eQ();else if("bias"==C.value)e=aa();else if("weight"==C.value)e=aw();else if("eval"==C.value)e=aE();else if("estimation"==C.value)e=aD();else throw Error(`Invalid screen: ${C.value}`);e=await e,a==n&&document.querySelector(".main-container > main").replaceWith(e)}aH.querySelector("button").addEventListener("click",aA),aH.querySelector(".help-background").addEventListener("click",aA),C.addGlobalListener(aO),aO(),C.addGlobalListener(aC),aC();