let e,a,t,i,n,s=0;async function l(e,a){let t=await fetch(e,a);if(t.ok)return t;throw t}function r(e){let a=document.createElement("template");return a.innerHTML=e.trim(),a.content.firstChild}let o=new Map,c=Symbol();function d(e,a,t){let[i,n]=a.map(e=>e.deref());if(i&&n)if(document.contains(i)){o.delete(e);try{n()}catch(e){reportError(e)}}else o.set(e,{references:a,event:t});else o.delete(e),t.removeEventListener("e",e)}class u{constructor(){this.event=new EventTarget,this.aux=new Event("e")}addListener(e,a){let t=this.event;e[c]?e[c].push(a):e[c]=[a];let i=[new WeakRef(e),new WeakRef(a)];t.addEventListener("e",function e(){d(e,i,t)})}addGlobalListener(e){this.event.addEventListener("e",e)}dispatch(){this.event.dispatchEvent(this.aux)}}class p{constructor(e){this.variable=e,this.event=new u}get value(){return this.variable}set value(e){this.variable=e,this.event.dispatch()}subscribe(e,a){this.event.addListener(e,a)}addGlobalListener(e){this.event.addGlobalListener(e)}}function m(e){let a=!1;return()=>{a||(a=!0,setTimeout(()=>{a=!1,e()}))}}new MutationObserver(m(function(){for(let[e,{references:a,event:t}]of o)d(e,a,t)})).observe(document,{subtree:!0,childList:!0});let h=new Worker("assets/webworker.js",{type:"module"}),w=new Map;async function v(){new Promise(e=>setTimeout(e))}async function f(){return new Promise(async e=>{await v(),w.size?h.addEventListener("message",async function a(){await v(),w.size||(h.removeEventListener("message",a),e())}):e()})}async function b(e,a,t){a&&await f();let i=s++;return new Promise((a,n)=>{w.set(i,{onSuccess:a,onError:n}),h.postMessage({python:e,id:i,...t})})}async function g(e,a){return b(`
		import micropip
		micropip.install(${JSON.stringify(e)})
	`,a)}function y(e){return`await (await pyfetch("${e}")).bytes()`}function $(){let e=location.pathname;return e.endsWith("/")?e:e+"/"}async function S(e,a,t){return b(`
		from pyodide.http import pyfetch
		with open("${a}", "wb") as my_file:
			my_file.write(${y(e)})
	`,t)}function E(e,a){let t=document.createElement("a");t.href=e,t.download=a,document.body.append(t),t.click(),URL.revokeObjectURL(e),t.remove()}h.onmessage=function(e){let{id:a,...t}=e.data,{onSuccess:i,onError:n}=w.get(a);w.delete(a),Object.hasOwn(t,"error")?n(t.error):i(t.result)};let L=(async()=>{await S(`${$()}assets/utils.py`,"utils.py"),await b("import utils")})(),q=g("python-calamine");q.then(()=>b("import python_calamine"));let k=g("fastparquet");k.then(()=>b("import fastparquet"));let _=g("xlsxwriter",!0),T={csv:async function(e,a){await L,await b(`${a} = utils.read_csv(${y(e)})`)},xlsx:async function(e,a){await q,await L,await b(`${a} = utils.read_excel(${y(e)})`)},parquet:async function(e,a){await k,await L,await b(`${a} = utils.read_parquet(${y(e)})`)}};async function x(e,a){let t=T[e.name.toLowerCase().match(/[^.]\.([^.]+)$/)?.[1]],i=URL.createObjectURL(e),n=t(i,a);return n.finally(()=>URL.revokeObjectURL(i)),n}let N={CSV:async function(e,a){await L,E(await b(`utils.to_csv(${e})`),`${a}.csv`)},Excel:async function(e,a){await _,await L,E(await b(`utils.to_excel(${e})`),`${a}.xlsx`)},Parquet:async function(e,a){await k,await L,E(await b(`utils.to_parquet(${e})`),`${a}.parquet`)}};async function P(e,a,t){return N[t](e,a)}async function M(e,a){return b(`
		${a} = ${e}
		del ${e}
	`)}async function W(e){return b(`del ${e}`)}async function D(e){return b(`${e}.columns.tolist()`)}async function z(e){return await L,b(`utils.num_vars(${e})`)}function H(e,a){return e&&e!=a?`, "${e}"`:""}async function F(e,a,t){return await L,b(`utils.harmonized_variables(${e}, ${a}${H(t)})`)}async function A(e,a,t,i){return await L,b(`utils.${a?"numeric":"categories"}_details("${e}", ${t}${H(i,e)})`)}async function O(e,a,t,i){await L;let n=await b(`utils.${a?"numeric":"categories"}_inferred_totals("${e}", ${t}${H(i)})`);return a?n:new Map(n)}async function C(e,a){return await L,await b(`utils.pop_total(${e}${H(a)})`)}let V=new p("load"),j={value:!1},B=new p,R=new p;class G{constructor(e){this.targetName=e,this.event=new u}subscribe(e,a){this.event.addListener(e,a)}cancel(e){if(this[e]){let a=this[e].id;this[e].loadPromise.then(()=>W(a)),this[e]=null,this.event.dispatch()}}loadTemp(e){this.cancel("temp");let a={id:`temp${s++}`,filename:e.name};return a.loadPromise=x(e,a.id),this.temp=a,this.event.dispatch(),a.loadPromise.then(()=>{a.id==this.temp?.id&&(a.loaded=!0,this.event.dispatch())}).catch(e=>{if(a.id==this.temp?.id)throw console.error(e),this.temp=null,this.event.dispatch(),e})}confirmTemp(){this.cancel("final"),this.final=this.temp,this.temp=null,this.event.dispatch()}confirmFinal(){let a=this.final;return this.final=null,this.event.dispatch(),M(a.id,this.targetName).then(()=>{let t=a.filename.replace(/\.[^.]+$/,"");if("np_sample"==this.targetName)B.value=t;else if("p_sample"==this.targetName)e=a.weights,R.value=t;else throw Error(`Invalid name: ${this.targetName}`)})}}let J=new G("np_sample"),I=new G("p_sample");for(let e of[J,I])V.addGlobalListener(()=>e.cancel("final"));R.addGlobalListener(()=>{a=R.value&&C("p_sample",e)});let U=["en","es"];async function K(e){return l(`texts/${e}/texts.json`).then(e=>e.json())}let Q=new p(localStorage.language||navigator.languages.map(e=>e.slice(0,2)).find(e=>U.includes(e))||"en"),X=K(Q.value),Y=K("en");async function Z(e){return(await X)[e]||(await Y)[e]}async function ee(){let e=t=s++,[a,i]=await Promise.all([X,Y]);if(e==t)for(let e of document.querySelectorAll("[data-i18n]")){let t=e.getAttribute("data-i18n");e.innerHTML=a[t]||i[t];let n=e.getAttribute("data-i18n-href");n&&(e.href=a[n]||i[n])}}ee(),Q.addGlobalListener(()=>{X=K(Q.value),V.value=V.value,ee(),localStorage.language=Q.value}),async function(){let e=r(`<a data-i18n="changeLang">${await Z("changeLang")}</a>`);function a(){e.setAttribute("data-lang",U.find(e=>e!=Q.value))}a(),e.addEventListener("click",async()=>{e.style.cursor="wait",Q.value=e.getAttribute("data-lang"),await X,a(),e.style.cursor="pointer"}),document.querySelector(".footer-links").prepend(e,r('<div class="header-divider"></div>'))}();let ea={maximumFractionDigits:2,minimumFractionDigits:2,maximumSignificantDigits:3,minimumSignificantDigits:3,roundingPriority:"morePrecision"},et=Intl.NumberFormat(void 0,ea);ea.style="percent";let ei=Intl.NumberFormat(void 0,ea);function en(e){for(let a of e.querySelectorAll("dialog"))a.querySelector(".close-button").onclick=()=>a.close()}async function es(e){let a=r(`<dialog class="modal error">
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
		<img src="images/error.svg">
		<article>
			<h4>${await Z("error")}</h4>
			<p>${e}</p>
		</article>
		<button class="button" autofocus>${await Z("acceptError")}</button>
	</dialog>`);a.querySelectorAll("button").forEach(e=>e.addEventListener("click",()=>a.close())),a.addEventListener("close",()=>a.remove()),document.body.append(a),a.showModal()}async function el(e){let a=r(`<dialog class="modal loading">
		<img src="images/loading.svg"/>
		<p>${await Z("loading")}</p>
		<p>${e}</p>
	</dialog>`);return a.addEventListener("cancel",e=>e.preventDefault()),a.addEventListener("close",()=>a.showModal()),a}function er(e,a){let t=r(`<article class="feedback">
		<img src="images/check-circle.svg"/>
		<div>
			<h3>${e}</h3>
			<p>${a}</p>
		</div>
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
	</article>`);return t.querySelector(".close-button").addEventListener("click",()=>t.remove()),t}function eo(e,a){return r(`<option${a?` value="${a}"`:""}>${e}</option>`)}function ec(e,a,t,i){let n=r(`<section class="estimation-table" style="--columns: ${e[e.length-1].length}"></section>`);for(let s=0;s<e.length;s++){let l=e[s],o=r(`<div class="row${s<a?" titles":""}"></div>`);for(let e=0;e<l.length;e++){let n=r(`<article>${l[e]}</article>`);(s<a||e<t)&&(n.classList.add("title"),i&&s==a-1&&e>=l.length-2&&n.classList.add("expanded")),o.append(n)}n.append(o)}return n}let ed=[J,I];function eu(e,a){let t=r(e[a]?`<article class="uploaded-file">
			<span>${e[a].filename}</span>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
			<progress ${e[a].loaded?'value = "1"':""}></progress>
		</article>`:'<article class="uploaded-file" hidden></article>');return t.querySelector(".close-button")?.addEventListener("click",()=>e.cancel(a)),e.subscribe(t,()=>t.replaceWith(eu(e,a))),t}async function ep(e){let a=r(`<select name="weights-var">
		<option value="">${await Z("noWeights")}</option>
	</select>`);return e?a.append(...e.map(e=>r(`<option>${e}</option>`))):a.disabled=!0,a}async function em(e){let a=r(`<section class="modal-input">
		<div class="modal-input-top">
			<h4>${await Z("loadFile2Subaction")}</h4>
			<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await Z("loadFile2SubactionHelp")}</span></span>
		</div>
		<select></select>
		<p>${await Z("loadFile2SubactionSubtitle")}</p>
	</section>`);async function t(e){let t=await ep(e);return a.querySelector("select").replaceWith(t),t}return t(),e.subscribe(a,async()=>{let a=e.temp;if(a?.loaded){let i=await z(a.id);if(a.id==e.temp?.id){let e=await t(i);e.addEventListener("change",()=>a.weights=e.value)}}else t()}),a}async function eh(e){let a=r(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await Z("loadFile"+e+"Title")}</h3>
				<p>${await Z("loadFile"+e+"Subtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input padded">
			<div class="modal-input-top">
				<h4>${await Z("loadFile"+e+"Action")}</h4>
				<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await Z("loadFile"+e+"ActionHelp")}</span></span>
			</div>
			<label class="button reversed">
				<span class="large icon"><img src="images/upload.svg" data-inline/></span>
				<span>${await Z("fileButton")}</span>
				<input name="file${e}" type="file" accept=".csv,.xlsx,.parquet" autofocus/>
			</label>
			<p>${await Z("fileButtonSubtitle")}</p>
		</section>
		<article class="uploaded-file" hidden></article>
		<section class="buttons-row">
			<button class="button reversed minimal">${await Z("cancel")}</button>
			<button class="button" disabled>${await Z("fileButton")}</button>
		</section>
	</dialog>`),t=ed[e-1];a.querySelector(".button.reversed.minimal").addEventListener("click",()=>a.close());let i=a.querySelector("input[type=file]");i.addEventListener("change",()=>{t.loadTemp(i.files[0]).catch(async e=>es(await Z("loadFileError")))}),i.addEventListener("click",()=>i.value=""),a.querySelector(".uploaded-file").replaceWith(eu(t,"temp"));let n=a.querySelector(".buttons-row > .button:last-of-type");return t.subscribe(n,()=>n.disabled=!t.temp?.loaded),n.addEventListener("click",()=>{t.confirmTemp(),a.close()}),2==e&&a.querySelector(".uploaded-file").after(await em(t)),a.addEventListener("close",()=>t.cancel("temp")),a}async function ew(e){let a=r(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await Z(`loadOption${e}`)}</h3>
		<p>${await Z(`loadOption${e}Subtitle`)}</p>
		<article class="radio-file">
			<img src="images/empty.svg"/>
			<p>${await Z("fileSelect")}</p>
			<article class="uploaded-file" hidden></article>
			<button class="button small"><span class="icon"><img src="images/upload.svg" data-inline/></span><span>${await Z("fileButton")}</span></button>
		</article>
	</label>`),t=ed[e-1];a.querySelector(".radio-file").append(await eh(e)),a.querySelector(".uploaded-file").replaceWith(eu(t,"final"));let i=a.querySelector(".button:has(+ dialog)");i.addEventListener("click",()=>i.nextElementSibling.showModal());let n=new p(t.final?.loaded);return t.subscribe(a,()=>n.value=t.final?.loaded),n.subscribe(i,()=>i.disabled=n.value),[a,n,()=>t.confirmFinal()]}async function ev(e){let a=r(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await Z(`download${e}Title`)}</h3>
				<p>${await Z(`download${e}Subtitle`)}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await Z("downloadFilename")}</h4>
			</div>
			<input name="filename" type="text" autofocus/>
		</section>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await Z("downloadFormat")}</h4>
			</div>
			<select name="format" class="big">
				<option value="" hidden>${await Z("downloadFormatPlaceholder")}</option>
				<option>CSV</option>
				<option>Excel</option>
				<option>Parquet</option>
			</select>
		</section>
		<section class="buttons-row">
			<button class="button reversed minimal">${await Z("cancel")}</button>
			<button class="button" disabled>${await Z("downloadConfirm")}</button>
		</section>
	</dialog>`),t=a.querySelector("input"),i=a.querySelector("select"),[n,s]=a.querySelectorAll(".button");function l(){s.disabled=!(t.value&&i.value)}return t.addEventListener("input",l),i.addEventListener("change",l),n.addEventListener("click",()=>a.close()),s.addEventListener("click",async()=>{let n=await el(await Z("downloadLoading"));a.append(n),n.showModal(),P(1==e?"np_sample":"p_sample",t.value,i.value).then(()=>{a.close()}).catch(async e=>{console.error(e),es(await Z("downloadError"))}).finally(()=>n.remove())}),l(),a}async function ef(a){if("left"==a||"right"==a){let t="left"==a?1:2,i=await Z(`loadFile${t}Title`),n="left"==a?B.value:R.value,s=r(`<header class="dual-header ${a}">
			<h2>${i}</h2>
			<label>
				<span>${await Z("actions")}</span>
				<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
				<input type="checkbox" hidden/>
				<nav class="dropdown from-button">
					<a>${await Z("loadNewData")}</a>
					<a>${await Z("downloadData")}</a>
				</nav>
			</label>
			<p>${n}</p>
			<div class="border"></div>
		</header>`);"right"==a&&s.append(r(`<article>
				<span>${await Z("weightsVar")}</span>
				<span>${e||await Z("noWeights")}</span>
			</article>`));let l=s.querySelectorAll("nav > a"),o=await Promise.all([eh(t),ev(t)]),c=ed[t-1];c.subscribe(s,async()=>{if(c.final){let e=await el(await Z("loadFileLoading"));s.append(e),e.showModal(),c.confirmFinal()}});for(let e=0;e<o.length;e++)s.append(o[e]),l[e].addEventListener("click",()=>o[e].showModal());return s}if("single"==a)return r(`<header class="single-header"><h2>${await Z("loadFile1Title")}</h2><p>${B.value}</p></header>`);throw Error(`Invalid type: ${a}`)}async function eb(){let e=[];return R.value?e.push(await ef("left"),r('<div class="border"></div>'),await ef("right")):e.push(await ef("single")),e}let eg=["load","data","bias","weight","eval","estimation"];async function ey(e,a){let t=r('<nav class="tabs"></nav>');t.append(...await Promise.all(eg.map(async e=>r(`<button>${await Z(e+"Tab")}</button>`)))),e=eg.indexOf(e),t.children[e].classList.add("active");for(let i=0;i<t.children.length;i++){let n=t.children[i];n.addEventListener("click",()=>V.value=eg[i]),a||i==e||(n.disabled=!0)}return t}async function e$(e,a,t){let i=r(`<a>${await Z("export"+t)}</a>`),n=await ev(t);e.append(i),a.append(n),i.addEventListener("click",()=>n.showModal())}async function eS(){let e=r(`<article class="main-title-buttons">
		<label class="dropdown-button">
			<span>${await Z("download")}</span>
			<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
			<input type="checkbox" hidden/>
			<nav class="dropdown from-button color"></nav>
		</label>
	</article>`),a=e.querySelector(".dropdown");return B.value&&await e$(a,e,1),R.value&&await e$(a,e,2),en(e),e}async function eE(){let e=r(`<main class="main-section">
		<nav class="breadcrumb">
			<a><img src="images/home.svg" data-inline/><span>${await Z("home")}</span></a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await Z("projectsTab")}</a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await Z("defaultProject")}</a>
		</nav>
		<section class="main-title">
			<article class="main-title-text">
				<h1>${await Z("defaultProject")}</h1>
				<p>${await Z("defaultProjectDesc")}</p>
			</article>
		</section>
		<nav class="tabs"></nav>
		<main></main>
	</main>`);return e.querySelector(".tabs").replaceWith(await ey(V.value,B.value)),B.value&&e.querySelector(".main-title").append(await eS()),e}async function eL(e){let a=r(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await Z("noFileTitle")}</h3>
		<p>${await Z("noFileSubtitle")}</p>
		<article class="radio-file">
			<img src="images/data.svg"/>
			<p>${await Z("noFileSubSubtitle")}</p>
			<button class="button small adjusted"><span>${await Z("noFileConfirm")}</span><span class="icon"><img src="images/arrow-right.svg" data-inline/></span></button>
		</article>
	</label>`),t=a.querySelector("button");t.addEventListener("click",()=>{t.disabled=!0,e.click()});let i=async()=>{R.value&&(await W("p_sample"),R.value=null)};return[a,new p(!0),i]}let eq=[,,];async function ek(e){return 1==e?`<button class="button" disabled>${await Z("next")}</button>`:`<section class="buttons-row">
			<button class="button reversed minimal">${await Z("back")}</button>
			<button class="button" disabled>${await Z("loadFileConfirm")}</button>
		</section>`}async function e_(e=1){let a=r(`<main class="main-content">
		<header>
			<h2>${await Z("loadTitle")}</h2>
			<p>${await Z("loadSubtitle")}</p>
		</header>
		<main class="data-load-content">
			<article class="stepper">
				<span class="step-icon active">${1==e?1:'<img src="images/check.svg"/>'}</span>
				<span class="step-text active">${await Z("loadStep1")}</span>
				<img src="images/stepper.svg"/>
				<span class="step-icon ${2==e?"active":""}">2</span>
				<span class="step-text ${2==e?"active":""}">${await Z("loadStep2")}</span>
			</article>
			${await ek(e)}
			<label class="radio-label"></label>
			${await ek(e)}
		</main>`),t=a.querySelectorAll(".data-load-content > .button, .data-load-content > .buttons-row > .button:last-of-type"),i=a.querySelector(".radio-label"),n=[ew(e)];for(let[a,l,r]of(2==e&&n.push(eL(t[0])),n=await Promise.all(n),i.after(...n.map(e=>e[0])),n)){let i=a.querySelector("input");for(let a of t){function s(){i.checked&&(a.disabled=!l.value,eq[e-1]=r)}i.addEventListener("change",s),l.subscribe(a,s)}}for(let i of t)i.addEventListener("click",async()=>{if(i.disabled=!0,e<2)a.replaceWith(await e_(e+1));else{let e=await el(await Z("loadFileLoading"));a.append(e),e.showModal(),await Promise.all(eq.map(e=>e())),j.value=!0,V.value="data"}});return a.querySelectorAll(".data-load-content > .buttons-row > .button:first-of-type").forEach(t=>{t.addEventListener("click",async()=>{t.disabled=!0,a.replaceWith(await e_(e-1))})}),i.remove(),en(a),a}async function eT(){let e=await eE();return e.querySelector("main").replaceWith(await e_()),e}let ex=new class{constructor(){this.cache=new Map}set(e,a){this.cache.set(a.name,e),a.hasTotals.value=!0}delete(e){this.cache.delete(e.name),e.hasTotals.value=!1}async verify(e,a){let t=await a.npDetails();return!t.some(e=>null==e[0])&&(a.isNpNumeric?"number"==typeof e:t.length==e.size&&t.every(a=>e.has(a[0])))}async refresh(e){let a=this.cache;for(let t of(this.cache=new Map,e)){let e=a.get(t.name);e&&await this.verify(e,t)&&this.set(e,t)}}},eN=new class{constructor(){this.cache=new Set}refresh(e){let a=this.cache;for(let t of(this.cache=new Set,e))t.selected.addGlobalListener(()=>{t.selected.value?this.cache.add(t.name):this.cache.delete(t.name)}),t.selected.value=t.selectable.value&&a.has(t.name)}};class eP{static baseProperties=["name","inNp","inP","isNpNumeric","isPNumeric","isHarmonized","harmonReason","pWeights"];constructor(e){for(let a of eP.baseProperties)this[a]=e[a];this.selected=new p(!1),this.expanded=new p(!1),this.hasTotals=new p(!1),this.selectable=new p(this.isHarmonized),this.hasTotals.addGlobalListener(()=>this.selectable.value=this.isHarmonized||this.hasTotals.value),this.selectable.addGlobalListener(()=>{this.selected.value&&!this.selectable.value&&(this.selected.value=!1)})}async npDetails(){return this.npCache||(this.npCache=A(this.name,this.isNpNumeric,"np_sample")),this.npCache}async pDetails(){return this.pCache||(this.pCache=A(this.name,this.isPNumeric,"p_sample",e)),this.pCache}async inferredTotals(){return this.inferredCache||(this.inferredCache=O(this.name,this.isPNumeric,"p_sample",e)),this.inferredCache}getTotals(){return ex.cache.get(this.name)}setTotals(e){ex.set(e,this)}deleteTotals(){ex.delete(this)}}class eM{constructor(){this.event=new u}subscribe(e,a){this.event.addListener(e,a)}async variables(){return this.cache||(this.cache=this.variablesPromise().then(async e=>(await ex.refresh(e),eN.refresh(e),e))),this.cache}async filtered(e){return(await this.variables()).filter(e)}async harmonized(){return this.filtered(e=>e.isHarmonized)}async common(){return this.filtered(e=>e.inNp&&e.inP)}async npOnly(){return this.filtered(e=>e.inNp&&!e.inP)}async pOnly(){return this.filtered(e=>!e.inNp&&e.inP)}async get(e){return(await this.variables()).find(a=>a.name==e)}static async fromHarmonization(){let a=e,[t,i,n]=await Promise.all([F("np_sample","p_sample",a),z("np_sample"),z("p_sample")]);[i,n]=[i,n].map(e=>new Set(e));let s=[];function l(e){return new eP({pWeights:a,isNpNumeric:i.has(e.name),isPNumeric:n.has(e.name),...e})}s.push(...t.harmonized.map(e=>l({name:e,inNp:!0,inP:!0,isHarmonized:!0}))),s.push(...t.nonharmonized.map(e=>l({name:e.name,inNp:!0,inP:!0,isHarmonized:!1,harmonReason:e.reason})));for(let e=0;e<2;e++)s.push(...t.unrelated[e].map(a=>l({name:a,inNp:0==e,inP:1==e,isHarmonized:!1})));return s}static async fromData(){let[e,a]=[D("np_sample"),z("np_sample")];return a=new Set(await a),(await e).map(e=>new eP({name:e,inNp:!0,inP:!1,isNpNumeric:a.has(e)}))}refresh(){B.value?R.value?(this.areDual=!0,this.variablesPromise=eM.fromHarmonization):(this.areDual=!1,this.variablesPromise=eM.fromData):(this.areDual=null,this.variablesPromise=null),this.cache=null,this.event.dispatch()}}let eW=new eM;async function eD(e){return[await Z("missing"),ei.format(e[1])]}async function ez(e){return null==e[0]?eD(e):[await Z(e[0]),et.format(e[1])]}async function eH(e){return null==e[0]?eD(e):[e[0],ei.format(e[1])]}async function eF(e,a){return Promise.all(e.map(a?ez:eH))}function eA(e,a,t,i){if(!e.hasDetails&&a.checked){e.hasDetails=!0;let a="right"==i?t.pDetails():t.npDetails(),n="right"==i?t.isPNumeric:t.isNpNumeric,s=r('<section class="details"></section>');a.then(async a=>{a=await eF(a,n),s.append(...a.map(e=>r(`<article><span>${e[0]}</span><span>${e[1]}</span></article>`))),e.append(s)})}}async function eO(e){let a=r('<button class="button reversed"></button>');async function t(){a.innerHTML=e.hasTotals.value?await Z("editTotals"):await Z("insertTotals")}return e.hasTotals.subscribe(a,t),t(),a}function eC(e,a,t){let i=[r(`<span>${e}</span>`),r('<label><input type="number" step="any" required/></label>')],n=i[1].querySelector("input");return a&&(n.valueAsNumber=a),t&&(n.readOnly=!0),i}async function eV(e){let a=await e.npDetails(),t=r(`<section class="totals-container${e.isHarmonized?"":" single"}" style="--items: ${e.isNpNumeric?1:a.length}">
		<article class="totals-article">
			<h4>${await Z("totals1")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>
	</section>`),i=t.querySelector(".totals-items"),n=e.getTotals();if(e.isNpNumeric)i.append(...eC(await Z("total"),n));else for(let[e]of a)i.append(...eC(e,n?.get(e)));if(e.isHarmonized){let n=r(`<article class="totals-article">
			<h4>${await Z("totals2")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>`);t.append(n),n=n.querySelector(".totals-items");let s=await e.inferredTotals();if(e.isPNumeric)n.append(...eC(await Z("total"),s,!0));else for(let[e,a]of s)n.append(...eC(e,a,!0));let l=r(`<button class="button reversed">${await Z("inferTotals")}</button>`);l.addEventListener("click",()=>(function(e,a,t,i){let n=e.querySelectorAll("input");if(i)n[0].valueAsNumber=t;else for(let e=0;e<a.length;e++)n[e].valueAsNumber=t.get(a[e][0])})(i,a,s,e.isPNumeric)),t.querySelector(".totals-article").append(l)}return t}async function ej(e,a,t){let i=[...e.querySelectorAll("input")];if(i.every(e=>!e.value))a.deleteTotals(),t.close();else if(i.every(e=>e.reportValidity())){if(a.isNpNumeric)a.setTotals(i[0].valueAsNumber);else{let e=await a.npDetails();a.setTotals(new Map(e.map((e,a)=>[e[0],i[a].valueAsNumber])))}t.close()}}async function eB(e){let a=r(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await Z("editTotals")}</h3>
				<p>${await Z("editTotalsSubtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="totals-container"></section>
		<section class="buttons-row">
			<button class="button reversed minimal" disabled>${await Z("deleteTotals")}</button>
			<section>
				<button class="button reversed minimal">${await Z("cancel")}</button>
				<button class="button" disabled>${await Z("setTotals")}</button>
			</section>
		</section>
	</dialog>`),[t,i,n]=a.querySelectorAll(".button");return a.addEventListener("open",async()=>{(await e.npDetails()).some(e=>null==e[0])?(es(await Z("missingError")),a.close()):(a.querySelector(".totals-container").replaceWith(await eV(e)),n.disabled=!1,t.disabled=!1)}),i.addEventListener("click",()=>a.close()),n.addEventListener("click",()=>ej(a.querySelector(".totals-items"),e,a)),t.addEventListener("click",()=>{a.querySelector(".totals-items").querySelectorAll("input").forEach(e=>e.value="")}),a}async function eR(e){let a=await eO(e),t=await eB(e);return a.addEventListener("click",()=>{t.showModal(),t.dispatchEvent(new Event("open"))}),[a,t]}async function eG(e){let a=r(`<header class="variable header">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${await Z("variables")}</span>
	</header>`);"single"!=e&&a.classList.add(e),"right"!=e&&a.querySelector(".border").after(r(`<label class="checkbox icon">
			<input type="checkbox" hidden/>
			<img src="images/check.svg"/>
		</label>`));let t=await eW.filtered(a=>a["right"==e?"inP":"inNp"]),[i,n]=a.querySelectorAll("input");i.addEventListener("change",()=>{t.forEach(e=>{e.expanded.value!=i.checked&&(e.expanded.value=i.checked)})}),n?.addEventListener("change",()=>{t.forEach(e=>{e.selectable.value&&e.selected.value!=n.checked&&(e.selected.value=n.checked)})});let s=m(()=>i.checked=t.every(e=>e.expanded.value)),l=m(()=>{let e=t.filter(e=>e.selectable.value);n.checked=e.length&&e.every(e=>e.selected.value)});for(let e of t)e.expanded.subscribe(a,s),n&&(e.selected.subscribe(a,l),e.selectable.subscribe(a,l));return s(),n&&l(),a}async function eJ(e){let a=r('<article class="variable-status"></article>');return e.isHarmonized?a.innerHTML='<img width="24" height="24" src="images/check-circle.svg"/>':e.harmonReason?a.innerHTML=`<span class="lead left"><img src="images/lead.svg"/><span class="tooltip">${await Z(e.harmonReason+"Reason")}</span></span><img src="images/check-yellow.svg"/>`:a.innerHTML='<img src="images/block.svg"/>',a}async function eI(e,a){let t,i,n=r(`<article class="variable view ${"single"!=a?a:""} ${e.isHarmonized?"harmonized":""}">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${e.name}</span>
	</article>`),s=n.querySelector("input");return s.checked=e.expanded.value,s.addEventListener("change",()=>e.expanded.value=s.checked),e.expanded.subscribe(n,()=>{s.checked=e.expanded.value,eA(n,s,e,a)}),"right"!=a&&n.querySelector(".border").after(((i=(t=r(`<label class="checkbox icon">
		<input type="checkbox" hidden/>
		<img src="images/check.svg"/>
	</label>`)).querySelector("input")).checked=e.selected.value,i.disabled=!e.selectable.value,i.addEventListener("change",()=>e.selected.value=i.checked),e.selected.subscribe(t,()=>i.checked=e.selected.value),e.selectable.subscribe(t,()=>i.disabled=!e.selectable.value),t)),"right"==a?n.append(await eJ(e)):n.append(...await eR(e)),eA(n,s,e,a),n}function eU(){return r('<div class="border"></div>')}function eK(e,a,t){e.expanded.subscribe(t,()=>{a.expanded.value!=e.expanded.value&&(a.expanded.value=e.expanded.value)})}async function eQ(){let e=[];if(eW.areDual){e.push(await eG("left"),eU(),await eG("right"));let[a,t,i]=await Promise.all([eW.common(),eW.npOnly(),eW.pOnly()]),n=Math.max(t.length,i.length);for(let t of a)e.push(await eI(t,"left"),eU(),await eI(t,"right"));for(let a=0;a<n;a++){let n,s;t[a]&&(n=await eI(t[a],"left"),e.push(n)),e.push(eU()),i[a]&&(s=await eI(i[a],"right"),e.push(s)),t[a]&&i[a]&&(eK(t[a],i[a],n),eK(i[a],t[a],s))}}else{e.push(await eG("single"));let a=(await eW.variables()).map(e=>eI(e,"single"));e.push(...await Promise.all(a))}return e}async function eX(){let e;eW.variables().catch(async e=>{console.error(e),es(await Z("loadFileFinalError")),V.value="load"});let a=r('<main class="main-content"></main>');if(eW.areDual){if(e=r('<section class="dual-container"></section>'),j.value){let e=(await Z("loadedFilesSubtitle")).replace("$nVars",(await eW.harmonized()).length);a.append(er(await Z("loadedFilesTitle"),e))}}else e=r('<section class="dual-container single"></section>');return e.append(...await eb()),e.append(...await eQ()),a.append(e),en(a),j.value=!1,eW.subscribe(a,async()=>a.replaceWith(await eX())),a}async function eY(){let e=await eE();return e.querySelector("main").replaceWith(await eX()),e}async function eZ(e){let a=await eW.harmonized(),t=r(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await Z("biasVar")}</span>
				<select id="bias-var" required${a.length?"":" disabled"}>
					<option value="" hidden>${await Z("selectVar")}</option>
				</select>
			</label>
			<button id="estimate" class="button compact" disabled>${await Z("getBias")}</button>
		</section>
	</section>`),i=t.querySelector("#bias-var");i.append(...a.map(e=>eo(e.name)));let n=t.querySelector("#estimate");return i.addEventListener("change",()=>{n.disabled=!i.value}),n.onclick=()=>{n.disabled=!0,e(i.value)},t}B.addGlobalListener(()=>eW.refresh()),R.addGlobalListener(()=>eW.refresh()),eW.refresh();let e0=g("altair==6.1.0",!0).then(async()=>{await S(`${$()}assets/charts.py`,"charts.py",!0),await b("import charts",!0)}),e1=new Promise(e=>{document.head.querySelector("[data-id=vegaEmbed]").onload=()=>e()}),e2=[];async function e4(e,a){await e1;let t=(await vegaEmbed(e,a,{renderer:"canvas"})).finalize;setTimeout(()=>e2.push([e,t]))}function e3(e){if(document.body.contains(e[0]))return!0;e[1]()}async function e5(e,a,t,i){return await e0,e4(i,JSON.parse(await b(`charts.single${"data"in t?"_categorical":""}("${e}", "${a}", ${JSON.stringify(t)})`)))}async function e8(e,a,t,i,n){return await e0,e4(n,JSON.parse(await b(`charts.compared${"data"in t?"_categorical":""}("${e}", ${JSON.stringify(a)}, ${JSON.stringify(t)}, ${JSON.stringify(i)})`)))}async function e6(e,a,t,i){return await e0,e4(i,JSON.parse(await b(`charts.${e}(${JSON.stringify(a)}, ${t})`)))}async function e7(e,a,t,i){let n=[[e],["",B.value,R.value]];if(i)n.push([await Z("mean"),et.format(a.get("mean")),et.format(t.get("mean"))]);else for(let[e,i]of a.entries())n.push([null==e?await Z("missing"):e,ei.format(i),ei.format(t.get(e))]);return[n,2,1]}async function e9(e,a,t,i){let n,s,l,r=[[e],["",await Z("biasAbsolute"),await Z("biasRelative")]];if(i)n=t.get("mean"),l=(s=a.get("mean")-n)/n,r.push([await Z("mean"),et.format(s),ei.format(l)]);else for(let[e,i]of a.entries())l=(s=i-(n=t.get(e)))/n,r.push([null==e?await Z("missing"):e,et.format(100*s),ei.format(l)]);return[r,2,1]}async function ae(e,a){if(a)return{estimation:e.get("mean")};{let a=await Z("missing");return{index:[...e.keys()].map(e=>null==e?a:e),columns:["estimation"],data:[...e.values()].map(e=>[e])}}}async function aa(e){let a=r(`<main class="estimation-results">
		<article>
			<h4>${await Z("biasTable")}</h4>
		</article>
		<article>
			<h4>${await Z("biasDifference")}</h4>
		</article>
		<article>
			<h4>${await Z("biasChart")}</h4>
			<div></div>
		</article>
	</main>`),[t,i,n]=a.querySelectorAll("article"),s=await eW.get(e),[l,o]=await Promise.all([s.npDetails(),s.pDetails()]).then(e=>e.map(e=>new Map(e))),c=s.isNpNumeric;return t.append(ec(...await e7(e,l,o,c))),i.append(ec(...await e9(e,l,o,c))),e8(e,[B.value,R.value],await ae(l,c),await ae(o,c),n.lastElementChild),a}async function at(){let e=r(`<main class="main-content">
		<header>
			<h2>${await Z("biasTitle")}</h2>
			<h3>${B.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await Z((await eW.harmonized()).length?"emptyBias":"invalidBias")}</p>
			<img src="images/empty.svg"/>
			<span>${await Z("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await el(await Z("biasLoading"));e.append(i),i.showModal(),await aa(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),es(await Z("biasError")),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await eZ(a)),e}async function ai(){let e=await eE();return e.querySelector("main").replaceWith(await at()),e}setInterval(function(){e2=e2.filter(e3)},1e3);let an=g("inps",!0).then(()=>b("import inps",!0));function as(e,a){return a?`, ${e} = ${JSON.stringify(a)}`:""}async function al(e,a,t,i,n){await Promise.all([L,an]),await b(`
		from js import my_totals
		temp_sample, temp_totals = utils.prepare_calibration(${a}, my_totals.to_py()${as("weights_var",i)})
	`,!1,{my_totals:t});let s=`${as("weights_column",i)}${as("population_size",n)}`;await b(`${a}["${e}"] = inps.calibration_weights(temp_sample, temp_totals${s})`),await b("del temp_sample, temp_totals")}async function ar(e,a,t,i,n,s,l,r){await an;let o=`${as("weights_column",i)}${as("population_size",n)}${as("covariates",s)}`;l&&(o+=", model = inps.boosting_classifier()"),await b(`${a}["${e}"] = inps.${r?"kw":"psa"}_weights(${a}, ${i?`${t}.dropna(subset = "${i}")`:t}${o})${r?"":'["np"]'}`)}async function ao(e,a,t,i,n,s,l){await Promise.all([L,an]);let r=`${as("weights_var",a)}${as("method",t)}${as("covariates",s)}${as("p_weights_var",l)}`;return b(`utils.estimation(${i}, '${e}'${n?", p_sample = "+n:""}${r})`)}class ac{constructor(){this.name=Z("calibration"),this.title=Z("calibrationTitle"),this.description=Z("calibrationDescription"),this.variables=eW.filtered(e=>e.selected.value&&e.hasTotals.value),this.acceptsOrig=!0}async estimate(e,a,t){if(!a&&!t)throw this.errorMsg=Z("calibrationMissing"),Error("Info missing");this.errorMsg=Z("calibrationError");let i=new Map((await this.variables).map(e=>[e.name,e.getTotals()]));await al(e,"np_sample",i,t,a),B.event.dispatch()}}class ad{constructor(e,a){this.boosted=e,this.kernels=a;let t=a?"kw":"psa";e&&(t+="Boost"),this.name=Z(t),this.title=Z(t+"Title"),this.description=Z(t+"Description"),this.errorMsg=Z(t+"Error"),this.variables=eW.filtered(e=>e.selected.value&&e.isHarmonized),this.acceptsOrig=!1}async estimate(a,t,i){let n=(await this.variables).map(e=>e.name);await ar(a,"np_sample","p_sample",e,t,n,this.boosted,this.kernels),B.event.dispatch()}}let au=["psa","calibration"];async function ap(){return r(`<main class="main-content">
		<header>
			<h2>${await Z("weightTitle")}</h2>
			<h3>${B.value}</h3>
		</header>
		<main class="empty-content">
			<p>${await Z("emptyDescription")}</p>
			<img src="images/empty.svg"/>
			<span>${await Z("emptyTitle")}</span>
		</main>
	</main>`)}async function am(e){let a=r(`<section class="vars-table">
		<article>${await Z("activeVars")}</article>
	</section>`);for(let t of e)a.append(r(`<article>${t}</article>`));return a}async function ah(e){let a=new Set([...e.options].map(e=>e.value));for(let t of au)if(t=await Z(t),a.has(t)){e.value=t;return}}async function aw(){let e=r(`<main class="main-content">
		<header>
			<h2>${await Z("weightTitle")}</h2>
			<h3>${B.value}</h3>
		</header>
		<form class="weight-form">
			<section class="inputs">
				<label for="method">
					<span>${await Z("method")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await Z("methodTitle")}</h4>
							<p>${await Z("methodDescription")}</p>
						</span>
					</span>
				</label>
				<select id="method" required>
					<option value="" hidden>${await Z("methodPlaceholder")}</option>
				</select>
				<article class="extra">
					<span>${await Z("methodExplain")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await Z("methodExplainTitle")}</h4>
							<p>${await Z("methodExplainDescription")}</p>
						</span>
					</span>
				</article>
				<label for="orig-weights" hidden>
					<span>${await Z("origWeights")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await Z("origWeightsTitle")}</h4>
							<p>${await Z("origWeightsDescription")}</p>
						</span>
					</span>
				</label>
				<select id="orig-weights" hidden>
					<option value="">${await Z("uniformWeights")}</option>
				</select>
				<label for="pop-size">
					<span>${await Z("popSize")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await Z("popSizeTitle")}</h4>
							<p>${await Z("popSizeDescription")}</p>
						</span>
					</span>
				</label>
				<input id="pop-size" type="number" placeholder="${await Z("popSizePlaceholder")}"/>
			</section>
			<section class="vars-table" hidden></section>
			<a hidden>${await Z("changeVars")}</a>
			<section class="inputs single">
				<label for="new-var-name">${await Z("newVar")}</label>
				<input id="new-var-name" type="text" placeholder="${await Z("newVarPlaceholder")}" required/>
			</section>
			<button class="button" type="button">${await Z("weightButton")}</button>
		</form>
	</main>`);function t(a){return e.querySelector(a)}let[i,n,s]=["#method",".extra h4",".extra p"].map(t),l=["#orig-weights",'[for="orig-weights"]'].map(t),o=["#pop-size",'[for="pop-size"]'].map(t),c=t(".vars-table + a"),d=t("#new-var-name"),u=t("button"),p=await a;for(let a of(l[0].append(...(await eW.filtered(e=>e.isNpNumeric)).map(e=>r(`<option>${e.name}</option>`))),p&&(o[0].placeholder=o[0].placeholder.replace(/\d+/,Math.round(p))),c.addEventListener("click",()=>V.value="data"),u.onclick=()=>i.reportValidity(),[new ac,new ad,new ad(!0),new ad(!1,!0),new ad(!0,!0)])){let t=await a.variables;if(t.length){let[p,m,h]=await Promise.all([a.name,a.title,a.description]);i.append(r(`<option>${p}</option>`)),i.addEventListener("change",async()=>{i.value==p&&(n.innerHTML=m,s.innerHTML=h,function(e,a,t){e.forEach(e=>e.hidden=!t),e[0].onchange=()=>a.forEach(a=>a.hidden=t&&!!e[0].value),e[0].onchange()}(l,o,a.acceptsOrig),e.querySelector(".vars-table").replaceWith(await am(t.map(e=>e.name))),c.hidden=!1,u.onclick=async()=>{if(d.reportValidity()&&(o[0].hidden||o[0].reportValidity())){let t=await el(await Z("weightLoading"));e.append(t),t.showModal(),a.estimate(d.value,o[0].valueAsNumber,l[0].value).then(()=>{j.value=d.value,V.value="eval"}).catch(async e=>{console.error(e),es(await a.errorMsg),t.remove()})}})})}}return await ah(i),i.dispatchEvent(new Event("change")),e}async function av(){return(await eW.variables()).some(e=>e.selected.value)?aw():ap()}async function af(){let e=await eE();return e.querySelector("main").replaceWith(await av()),e}async function ab(e,a,t,i=!1){let n=r(`<label>
		<span>${a}</span>
		<select id="${e}" ${i?"disabled":"required"}>
			<option value="" hidden>${await Z("selectVar")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>eo(e.name))),n}async function ag(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function ay(e,a){let t=await eW.filtered(e=>e.isNpNumeric),i=r(`<section class="selectors">
		<section class="row">
			<label id="eval-var"></label>
			<div class="divider"></div>
			<label>
				<span>${await Z("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<button id="estimate" class="button compact" disabled>${await Z("getEval")}</button>
		</section>
	</section>`),[n,s]=["#eval-var","#compare-var"].map(e=>i.querySelector(e));n=await ag(n,ab("eval-var",await Z("weightsVar"),t)),s=await ag(s,ab("compare-var",await Z("compareVar"),t,!0));let l=i.querySelector("#compare");l.addEventListener("change",()=>{s.disabled=!l.checked});let o=i.querySelector("#estimate");function c(){o.disabled=!n.value||l.checked&&(!s.value||s.value==n.value)}for(let e of[n,l,s])e.addEventListener("change",c);return o.onclick=()=>{o.disabled=!0,e(n.value,l.checked,s.value)},a&&setTimeout(()=>{n.value=a,e(n.value)}),i}async function a$(e,a){return await L,b(`utils.weights_properties(${e}["${a}"])`)}async function aS(e,a,t){let i,n,s=["",e];a&&s.push(t);let l=[s];i=a$("np_sample",e),a&&(n=a$("np_sample",t)),[i,n]=await Promise.all([i,n]);for(let e=0;e<i.length;e++){let[t,s]=i[e],r=[await Z(t),et.format(s)];a&&r.push(et.format(n[e][1])),l.push(r)}return[l,1,1]}async function aE(e,a,t){let i=r(`<main class="estimation-results">
		<article>
			<h4>${await Z("evalProperties")}</h4>
		</article>
		<article>
			<h4>${await Z("evalBoxplot")}</h4>
			<div></div>
		</article>
		<article>
			<h4>${await Z("evalHistogram")}</h4>
			<div></div>
		</article>
	</main>`),n=[e];a&&n.push(t);let[s,l,o]=i.querySelectorAll("article");return[i,Promise.all([aS(e,a,t).then(e=>s.append(ec(...e))),e6("boxplot",n,"np_sample",l.lastElementChild),e6("histogram",n,"np_sample",o.lastElementChild)])]}async function aL(){let e=r(`<main class="main-content">
		<header>
			<h2>${await Z("evalTitle")}</h2>
			<h3>${B.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await Z("emptyEval")}</p>
			<img src="images/empty.svg"/>
			<span>${await Z("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await el(await Z("evalLoading"));e.append(i),i.showModal(),await aE(...t).then(a=>(e.querySelector("main").replaceWith(a[0]),a[1])).catch(async a=>{console.error(a),es(await Z("evalError")),e.querySelector("#estimate").disabled=!1}),i.remove()}if(j.value){let a=(await Z("estimatedWeightSubtitle")).replace("$name",j.value);e.prepend(er(await Z("estimatedWeightTitle"),a))}return e.querySelector(".selectors").replaceWith(await ay(a,j.value)),j.value=!1,e}async function aq(){let e=await eE();return e.querySelector("main").replaceWith(await aL()),e}async function ak(e,a,t,i=!1){let n=r(`<label>
		<span>${a}</span>
		<select id="${e}"${i?" disabled":""}>
			<option value="">${await Z("uniformWeights")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>eo(e))),n}let a_=["advancedPsa","advancedPsaBoost","advancedKw","advancedKwBoost","advancedLinearMatching","advancedBoostedMatching","advancedLinearTraining","advancedBoostedTraining"];async function aT(e,a){let t=await Promise.all(a_.map(async e=>eo(await Z(e),e)));e.append(...t),a.addEventListener("change",()=>{if(a.value)for(let a of t)e.value==a.value&&(e.value=""),a.hidden=!0;else t.forEach(e=>{e.hidden=!1})})}async function ax(e,a,t,i,n=!1){let s=r(`<label>
		<span>${a}</span>
		<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await Z("estimationMethodDescription")}</span></span>
		<select id="${e}"${n?" disabled":""}>
			<option value="">${await Z("noMatching")}</option>
		</select>
	</label>`);if(t){let e=s.querySelector("select");e.append(eo(await Z("linearMatching"),"linear"),eo(await Z("boostedMatching"),"boosting")),aT(e,i)}return s}async function aN(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function aP(e){let a=r(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await Z("targetVar")}</span>
				<select id="target-var" required>
					<option value="" hidden>${await Z("selectVar")}</option>
				</select>
			</label>
			<label id="weights-var"></label>
			<label id="estimation-method"></label>
		</section>
		<div class="border"></div>
		<section class="row">
			<label>
				<span>${await Z("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<label id="compare-method"></label>
			<button id="estimate" class="button compact" disabled>${await Z("estimate")}</button>
		</section>
	</section>`),[t,i,n,s,l,o,c]=["target-var","weights-var","compare-var","estimation-method","compare-method","compare","estimate"].map(e=>a.querySelector("#"+e)),d=await eW.variables(),u=d.filter(e=>e.isNpNumeric).map(e=>e.name);t.append(...d.map(e=>eo(e.name))),i=await aN(i,ak("weights-var",await Z("weightsVar"),u)),n=await aN(n,ak("compare-var",await Z("compareVar"),u,!0));let p=d.some(e=>e.isHarmonized&&e.selected.value);function m(){c.disabled=!t.value}for(let e of(s=await aN(s,ax("estimation-method",await Z("estimationMethod"),p,i)),l=await aN(l,ax("compare-method",await Z("compareMethod"),p,n,!0)),o.onchange=()=>{n.disabled=!o.checked,l.disabled=!o.checked},[t,i,n,s,l,o]))e.addEventListener("change",m);return c.onclick=()=>{c.disabled=!0,e(t.value,i.value,s.value,o.checked,n.value,l.value)},a}async function aM(e,a,t){let i="data"in a,n=[[e]],s=t?2:1,l=!!t;if(t){let e=["",await Z("mainEstimation"),await Z("altEstimation")];i&&e.unshift(""),n.push(e)}let r=i?"percentageEstimation":"numericEstimation",o=i?"pertentageInterval":"numericInterval";[r,o]=await Promise.all([r,o].map(Z));let c=i?ei:et;if(i){function d(e){return[c.format(e[0]),""]}function u(e){return[e[1],e[2]].map(e=>c.format(e))}for(let e=0;e<a.index.length;e++){let i=[a.index[e],r];i.push(...d(a.data[e]));let s=["",o];if(s.push(...u(a.data[e])),t){let n=t.index.indexOf(a.index[e]);i.push(...d(t.data[n])),s.push(...u(t.data[n]))}n.push(i,s)}}else{let e=[r,c.format(a.estimation),""];t&&e.push(c.format(t.estimation),"");let i=[o,c.format(a.interval_lower),c.format(a.interval_upper)];t&&i.push(c.format(t.interval_lower),c.format(t.interval_upper)),n.push(e,i)}return[n,s,i?2:1,l]}async function aW(a,t,i,n,s,l){let o,c,d;(i||l)&&(d=(await eW.filtered(e=>e.isHarmonized&&e.selected.value)).map(e=>e.name)),o=ao(a,t,i,"np_sample",eW.areDual&&"p_sample",d,e),n&&(c=ao(a,s,l,"np_sample",eW.areDual&&"p_sample",d,e)),[o,c]=await Promise.all([o,c]);let u=r(`<main class="estimation-results">
		<article>
			<h4>${await Z(n?"comparedHeader":"estimationHeader")}</h4>
		</article>
		<article>
			<h4>${await Z(n?"comparedChartHeader":"estimationChartHeader")}</h4>
			<div></div>
		</article>
	</main>`),[p,m]=u.querySelectorAll("article");p.append(ec(...await aM(a,o,c)));let h=await Z("mainEstimation");return n&&(h=[h,await Z("altEstimation")]),n?e8(a,h,o,c,m.lastElementChild):e5(a,h,o,m.lastElementChild),u}async function aD(e){return e.includes("different number of classes")||e.includes("minimum number of groups")?Z("lowDataError"):Z("estimationError")}async function az(){let e=r(`<main class="main-content">
		<header>
			<h2>${await Z("estimationTitle")}</h2>
			<h3>${B.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await Z("emptyEstimation")}</p>
			<img src="images/empty.svg"/>
			<span>${await Z("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await el(await Z("estimationLoading"));e.append(i),i.showModal(),await aW(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),es(await aD(a)),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await aP(a)),e}async function aH(){let e=await eE();return e.querySelector("main").replaceWith(await az()),e}let aF=import("https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.min.js").then(e=>e.marked),aA=document.querySelector("section.help-section"),aO=aA.querySelector("article");function aC(){aA.classList.toggle("active")}async function aV(){aO.innerHTML="";let e=i=s++,a=l(`texts/${Q.value}/help/${V.value}.md`).then(e=>e.text()).catch(e=>(console.error(e),"# Error")),t='<button class="close-button"><img src="images/close.svg" data-inline/></button>'+(await aF).parse(await a);e==i&&(aO.innerHTML=t,aO.querySelector("button").addEventListener("click",aC),aO.querySelectorAll("a").forEach(e=>{e.target="_blank"}))}async function aj(){let e;scrollTo(0,0);let a=n=s++;if("load"==V.value)e=eT();else if("data"==V.value)e=eY();else if("bias"==V.value)e=ai();else if("weight"==V.value)e=af();else if("eval"==V.value)e=aq();else if("estimation"==V.value)e=aH();else throw Error(`Invalid screen: ${V.value}`);e=await e,a==n&&document.querySelector(".main-container > main").replaceWith(e)}aA.querySelector("button").addEventListener("click",aC),aA.querySelector(".help-background").addEventListener("click",aC),V.addGlobalListener(aV),aV(),V.addGlobalListener(aj),aj();