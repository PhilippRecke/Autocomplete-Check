(()=>{"use strict";var e={667:function(e,t,n){var a=this&&this.__awaiter||function(e,t,n,a){return new(n||(n=Promise))((function(o,i){function c(e){try{r(a.next(e))}catch(e){i(e)}}function l(e){try{r(a.throw(e))}catch(e){i(e)}}function r(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,l)}r((a=a.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.removeFloatingInfoTable=t.generateFloatingInfoTable=t.generateAutocompleteBadge=void 0;const i=o(n(969));t.generateAutocompleteBadge=(e,t,n,o,s)=>a(void 0,void 0,void 0,(function*(){const a=e.hasAttribute("autocomplete");let u=e.getAttribute("autocomplete");null===u&&(u="value missing");const m=i.default.values.includes(u),h=document.createElement("div");h.className="acc-badge",h.id=s,void 0!==e.id&&""!==e.id&&h.setAttribute("data-id-of-input",e.id);const g=(yield chrome.storage.local.get("acc.fontSize"))["acc.fontSize"];h.style.fontSize=g;const y=(yield chrome.storage.local.get("acc.hoverColor"))["acc.hoverColor"];(yield chrome.storage.local.get("acc.highlightHover"))["acc.highlightHover"]&&(h.addEventListener("mouseover",(()=>{h.classList.add("acc-tmp-hover"),e.style.boxShadow=`0 0 12px ${y}80`})),h.addEventListener("mouseout",(()=>{h.classList.remove("acc-tmp-hover"),e.style.boxShadow=""})));const b=(yield chrome.storage.local.get("acc.classThreshold"))["acc.classThreshold"],v=Number(b);c(h,t[0],u,v,a);let x=!1;console.log(n.label),null!==n.label&&""!==n.label||(l(h),x=!0),"hidden"===n.inputType&&(r(h),x=!0);const w=document.createElement("div"),T=document.createElement("div");switch(console.log(`getting acstatus: ${n.id}`),console.log(`acval: ${u}`),console.log(`acfound: ${a}`),console.log(`warningFlag: ${x}`),p(a,m,u,t[0],v,x)){case"✔ AC OK":w.innerHTML="✔",T.innerHTML=`autocomplete: ${u}`,w.className="acc-icon acc-correct",T.className="acc-text acc-correct";break;case"✔ NO AC NEEDED":w.innerHTML="✔",T.innerHTML="No autocomplete needed",w.className="acc-icon acc-correct",T.className="acc-text acc-correct";break;case"❕ AC WRONG":case"❕ AC FOUND":w.innerHTML="❕",T.innerHTML=`autocomplete: ${u}`,w.className="acc-icon acc-info",T.className="acc-text acc-info";break;case"❕ NO AC FOUND":w.innerHTML="❕",T.innerHTML="No autocomplete needed",w.className="acc-icon acc-info",T.className="acc-text acc-info";break;case"❌ AC WRONG":w.innerHTML="❌",T.innerHTML=`autocomplete: ${u}`,w.className="acc-icon acc-false",T.className="acc-text acc-false"}if(h.insertBefore(T,h.firstChild),h.insertBefore(w,h.firstChild),d(h,t),(yield chrome.storage.local.get(["acc.devMode"]))["acc.devMode"]){const t=f(e,o,n);h.appendChild(t)}return h}));const c=(e,t,n,a,o)=>{let i;i=t.acValue===n?`${t.confidenceScore.toFixed(1)}`:t.confidenceScore<=a&&!o?`${(1-t.confidenceScore).toFixed(1)}`:`${t.acValue}: ${t.confidenceScore.toFixed(1)}`;const c=document.createElement("div");c.classList.add("acc-classificationLabel","acc-text"),c.innerHTML=i,e.appendChild(c)},l=e=>{const t=document.createElement("div");t.innerHTML="⚠ No label was found!",t.classList.add("acc-text"),t.classList.add("acc-warning"),e.appendChild(t)},r=e=>{const t=document.createElement("div");t.innerHTML="⚠ Hidden Input",t.classList.add("acc-text"),t.classList.add("acc-warning"),e.appendChild(t)},d=(e,t)=>{const n=document.createElement("button");n.type="button",n.innerHTML="ℹ",n.title="click to toggle detailed prediction results",n.classList.add("acc-info-button"),n.addEventListener("click",(n=>{const a=e.getBoundingClientRect();u(a.left+window.scrollX,a.bottom+window.scrollY,t)})),e.appendChild(n)};t.generateFloatingInfoTable=()=>a(void 0,void 0,void 0,(function*(){const e=document.createElement("div");e.id="acc-floating-info",e.style.display="none";const t=(yield chrome.storage.local.get("acc.fontSize"))["acc.fontSize"];e.style.fontSize=t,document.addEventListener("keydown",(e=>{"Escape"!==e.key&&"Esc"!==e.key||s()})),document.body.appendChild(e)})),t.removeFloatingInfoTable=()=>{const e=document.getElementById("acc-floating-info");null==e||e.remove()};const s=()=>{const e=document.getElementById("acc-floating-info");null!==e?e.style.display="none":console.log("Floating table div not found, aborting!")},u=(e,t,n)=>{const a=document.getElementById("acc-floating-info");null!==a?"none"===a.style.display?(m(a,n),a.style.left=`${e+4}px`,a.style.top=`${t+2}px`,a.style.display="block"):s():console.log("Floating table div not found, aborting!")},m=(e,t)=>{for(;e.firstChild;)e.removeChild(e.firstChild);const n=document.createElement("table"),a=document.createElement("tr"),o=document.createElement("th"),i=document.createElement("th");o.textContent="Value",i.textContent="Confidence (%)",a.appendChild(o),a.appendChild(i),n.appendChild(a);for(const e of t){const t=document.createElement("tr"),a=document.createElement("td"),o=document.createElement("td");a.textContent=e.acValue,o.textContent=e.confidenceScore.toFixed(3).toString(),t.appendChild(a),t.appendChild(o),n.appendChild(t)}e.appendChild(n)},p=(e,t,n,a,o,i)=>a.confidenceScore>=o?e?h(n).includes(a.acValue)?"✔ AC OK":"❕ AC WRONG":"❌ AC WRONG":e?"❕ AC FOUND":i?"❕ NO AC FOUND":"✔ NO AC NEEDED",h=e=>e.split(" ").length>=2?e.split(" "):[e],f=(e,t,n)=>{const a=document.createElement("div"),o=document.createElement("table"),c=document.createElement("tr"),l=document.createElement("td"),r=document.createElement("p");r.innerHTML="add todb:",r.className="acc.devModeText",r.style.padding="4px",l.appendChild(r);const d=document.createElement("td"),s=document.createElement("input");s.type="checkbox",s.className="acc.devModeInput",s.style.padding="4px",s.onchange=a=>{const o=t.find((t=>t.id===e.id));if(void 0===o){const o={id:e.id,item:n,addToDB:a.target.checked,acNeeded:void 0,valCorrect:void 0,actualVal:void 0};t.push(o)}else o.addToDB=a.target.checked},d.appendChild(s),c.appendChild(l),c.appendChild(d),o.appendChild(c);const u=document.createElement("tr"),m=document.createElement("td"),p=document.createElement("p");p.innerHTML="ac needed:",p.className="acc.devModeText",p.style.padding="4px",m.appendChild(p);const h=document.createElement("td"),f=document.createElement("input");f.type="checkbox",f.className="acc.devModeInput",f.style.padding="4px",f.onchange=a=>{const o=t.find((t=>t.id===e.id));if(void 0===o){const o={id:e.id,item:n,addToDB:void 0,acNeeded:a.target.checked,valCorrect:void 0,actualVal:void 0};t.push(o)}else o.acNeeded=a.target.checked},h.appendChild(f),u.appendChild(m),u.appendChild(h),o.appendChild(u);const g=document.createElement("tr"),y=document.createElement("td"),b=document.createElement("p");b.innerHTML="website value correct:",b.className="acc.devModeText",b.style.padding="4px",y.appendChild(b);const v=document.createElement("td"),x=document.createElement("input");x.type="checkbox",x.className="acc.devModeInput",x.style.padding="4px",x.onchange=a=>{const o=t.find((t=>t.id===e.id));if(void 0===o){const o={id:e.id,item:n,addToDB:void 0,acNeeded:void 0,valCorrect:a.target.checked,actualVal:void 0};t.push(o)}else o.valCorrect=a.target.checked},v.appendChild(x),g.appendChild(y),g.appendChild(v),o.appendChild(g);const w=document.createElement("tr"),T=document.createElement("td"),E=document.createElement("p");E.innerHTML="actual value:",E.className="acc.devModeText",E.style.padding="4px",T.appendChild(E);const C=document.createElement("td"),S=document.createElement("select");S.className="acc.devModeInput";for(const e of i.default.values){const t=document.createElement("option");t.value=e,t.text=e,S.appendChild(t)}return S.onchange=a=>{const o=t.find((t=>t.id===e.id));if(void 0===o){const o={id:e.id,item:n,addToDB:void 0,acNeeded:void 0,valCorrect:void 0,actualVal:a.target.value};t.push(o)}else o.actualVal=a.target.value},C.appendChild(S),w.appendChild(T),w.appendChild(C),o.appendChild(w),a.appendChild(o),a.style.padding="4px",a}},265:function(e,t,n){var a=this&&this.__awaiter||function(e,t,n,a){return new(n||(n=Promise))((function(o,i){function c(e){try{r(a.next(e))}catch(e){i(e)}}function l(e){try{r(a.throw(e))}catch(e){i(e)}}function r(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,l)}r((a=a.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const o=n(667),i=n(574),c=n(667),l=[],r=()=>a(void 0,void 0,void 0,(function*(){var e,t;const n=(yield chrome.storage.local.get(["acc.highlight"]))["acc.highlight"],a=[...document.getElementsByTagName("input"),...document.getElementsByTagName("textarea"),...document.getElementsByTagName("select")];if(n){console.log("acc-extension: add highlights"),(0,c.generateFloatingInfoTable)(),m(),yield chrome.storage.local.set({"acc.badgeDataList":[]});const t=(yield chrome.storage.local.get(["acc.onlyTestForms"]))["acc.onlyTestForms"],n=(yield chrome.storage.local.get(["acc.showHidden"]))["acc.showHidden"],r=(yield chrome.storage.local.get(["acc.showDisabled"]))["acc.showDisabled"];for(const[c,u]of a.entries()){if("acc.devModeInput"===u.className)continue;if(!n&&"hidden"===u.type)continue;if(!r&&!0===u.disabled)continue;const a=s(u);if(t&&void 0!==a)continue;const m=(0,i.generateMatchingItem)(u,document,c,null==a?void 0:a.id,-1),p=(yield chrome.runtime.sendMessage({msg:"acc.classifyField",data:m})).data,h=yield d(),f=yield(0,o.generateAutocompleteBadge)(u,p,m,l,h);if((yield chrome.storage.local.get(["acc.floatBadge"]))["acc.floatBadge"]){f.classList.add("float");const e=u.getBoundingClientRect();f.style.left=`${e.left+window.scrollX}px`,f.style.top=`${e.bottom+window.scrollY}px`,document.body.appendChild(f)}else f.classList.add("inline"),null===(e=u.parentNode)||void 0===e||e.insertBefore(f,u.nextSibling);const g=(yield chrome.storage.local.get(["acc.badgeDataList"]))["acc.badgeDataList"],y={badgeId:h,matchingTable:p,oldAriaDescBy:u.getAttribute("aria-describedby")};g.push(y),yield chrome.storage.local.set({"acc.badgeDataList":g}),u.setAttribute("aria-describedby",h)}}else{console.log("acc-extension: highlights off"),(0,c.removeFloatingInfoTable)();const e=document.getElementsByClassName("acc-badge");for(var r=e.length-1;r>=0;--r)e[r].remove();p();const n=(yield chrome.storage.local.get(["acc.badgeDataList"]))["acc.badgeDataList"];for(const e of a)if(null===(t=e.getAttribute("aria-describedby"))||void 0===t?void 0:t.includes("acc-badgeNo")){const t=n.find((t=>t.badgeId===e.getAttribute("aria-describedby")));void 0!==t&&null!==t.oldAriaDescBy?e.setAttribute("aria-describedby",t.oldAriaDescBy):e.removeAttribute("aria-describedby")}}})),d=()=>a(void 0,void 0,void 0,(function*(){const e=(yield chrome.storage.local.get(["acc.badgeDataList"]))["acc.badgeDataList"];return 0===e.length?"acc-badgeNo1":`acc-badgeNo${e.map((e=>Number(e.badgeId.replace("acc-badgeNo","")))).sort(((e,t)=>t-e))[0]+1}`})),s=e=>{const t=document.getElementsByTagName("form");for(const n of t)if(n.contains(e))return{id:n.id,name:n.name};let n=e.getAttribute("form");if(null!==n){const e=document.getElementById(n);if(null!==e)return{id:e.id,name:e.name}}},u=()=>a(void 0,void 0,void 0,(function*(){const e=l.filter((e=>e.addToDB));for(const t of e)void 0===t.acNeeded&&(t.acNeeded=!1),void 0===t.valCorrect&&(t.acNeeded=!1);const t=e.map((e=>{const t=e.item;return t.correctAutocomplete=e.valCorrect?e.item.autocomplete:e.actualVal?e.actualVal:null,e.acNeeded||(e.item.autocomplete=null),t})),n={dataVersion:1,url:window.location.href,date:(new Date).toJSON(),hostname:window.location.hostname,htmlLanguage:document.documentElement.lang,htmlTitle:document.title,dom:document.documentElement.outerHTML,fields:t,numOfLabeledFields:t.length},a=yield chrome.runtime.sendMessage({msg:"acc.addFormToDB",data:n});switch(console.log(`acc-extension: ${a}`),a.status){case"Created":alert("Added new database Entry.");break;case"Unauthorized":alert("Error: Unauthorized!")}}));chrome.runtime.onMessage.addListener(((e,t,n)=>{"acc.toggleHighlightContent"===e.msg&&(r(),n({status:!0}))})),console.log("acc-extension: started"),r();const m=()=>{chrome.storage.local.get(["acc.devMode"],(e=>{if(e["acc.devMode"]){const e=document.createElement("button");e.id="acc-dbSendButton",e.innerHTML="Add to DB",e.style.position="absolute",e.style.top="12px",e.style.padding="8px",e.style.zIndex="9999",e.onclick=u,document.body.appendChild(e)}}))},p=()=>{const e=document.getElementById("acc-dbSendButton");null!==e&&e.remove()}},574:function(e,t,n){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.getIdOfAcName=t.getNameOfAcId=t.analyzeField=t.analyzeForm=t.generateMatchingItem=void 0;const o=a(n(37)),i=n(579),c=a(n(643));t.generateMatchingItem=(e,t,n,a,o)=>{var i,c,l;const r=[...t.getElementsByTagName("label")].filter((t=>t.htmlFor==e.id)),d=e instanceof HTMLSelectElement?e.options:null;let u=null;const m=[];if(null!==d){for(const e of d)m.push(e.value);u=m}return{id:e.id,formId:a||null,positionInForm:o||null,formHeadings:s(t,a),positionInFields:n,label:null!==(l=null===(c=null===(i=r[0])||void 0===i?void 0:i.textContent)||void 0===c?void 0:c.trim())&&void 0!==l?l:null,name:e.name,value:e.value,checked:e instanceof HTMLInputElement?e.checked:null,selectValues:u,ariaLabel:e.getAttribute("aria-label"),ariaDisabled:e.ariaDisabled,ariaHidden:e.getAttribute("aria-hidden"),inputType:e.type,fieldType:e.tagName.toLowerCase(),isInTable:e.getAttribute("disabled"),autocomplete:e.getAttribute("autocomplete"),correctAutocomplete:null,placeholder:e.getAttribute("placeholder"),maxLength:null===e.getAttribute("maxLength")?null:Number(e.getAttribute("maxLength")),disabled:e.getAttribute("disabled"),required:e.required,pattern:e.getAttribute("pattern")}},t.analyzeForm=e=>{},t.analyzeField=e=>{const t=l(),n=(0,i.matchByLabel)(e);r(t,n,c.default.matchBy.Label,c.default.testType.Label);const a=(0,i.matchByPlaceholder)(e);r(t,a,c.default.matchBy.Placeholder,c.default.testType.Placeholder);const o=(0,i.matchByFieldType)(e);r(t,o,c.default.matchBy.FieldType,c.default.testType.FieldType);const s=(0,i.matchByInputType)(e);r(t,s,c.default.matchBy.InputType,c.default.testType.InputType);const u=(0,i.matchByFormType)(e);r(t,u,c.default.matchBy.FormType,c.default.testType.FormType);const m=(0,i.matchByName)(e);r(t,m,c.default.matchBy.Name,c.default.testType.Name);const p=(0,i.matchById)(e);r(t,p,c.default.matchBy.Id,c.default.testType.Id);return d(t).sort(((e,t)=>t.confidenceScore-e.confidenceScore))},t.getNameOfAcId=e=>-1===Object.keys(o.default.byId).indexOf(e)?"!ERROR!":o.default.byId[e],t.getIdOfAcName=e=>{const t=Object.entries(o.default.byId).map((([e,t])=>t)).indexOf(e);return-1===t?"!ERROR!":Object.keys(o.default.byId)[t]};const l=()=>{const e=[];for(const t of Object.keys(o.default.byId))e.push({classId:t,resultsAndWeights:[]});return e},r=(e,t,n,a)=>{const i=[...t];if("inclusive"===a)for(const e of Object.keys(o.default.byId))t.find((t=>t.id===e))||i.push({id:e,confidence:0});for(const t of i){const a=e.findIndex((e=>e.classId==t.id)),o={result:t.confidence,weight:n};-1===a?e.push({classId:t.id,resultsAndWeights:[o]}):e[a].resultsAndWeights.push(o)}},d=e=>{const n=[],a=e.reduce(((e,t)=>Math.max(e,t.resultsAndWeights.length)),0);for(const o of e){const e=o.resultsAndWeights.length/a,i=o.resultsAndWeights.reduce(((e,t)=>e+t.result*t.weight),0)/o.resultsAndWeights.reduce(((e,t)=>e+t.weight),0),l=i-(1-e)/a*(1-i)*c.default.lengthPenaltyMultiplier;n.push({acValue:(0,t.getNameOfAcId)(o.classId),acId:o.classId,confidenceScore:l})}return n},s=(e,t)=>{const n=[];if(void 0===t)return n;const a=e.getElementById(t);if(null===a)return n;const o=["h1","h2","h3","h4","h5","h6"];for(const e of o){const t=a.getElementsByTagName(e);for(const e of t)""!==e.innerHTML&&n.push(e.innerHTML)}return n}},579:function(e,t,n){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.substringSearch=t.matchById=t.matchByName=t.matchByFormType=t.matchByInputType=t.matchByFieldType=t.matchByPlaceholder=t.matchByLabel=void 0;const o=n(574),i=a(n(37)),c=a(n(643));t.matchByLabel=e=>{const n=[];if(null===e.label)return n;const a=i.default.byLabel_EN;for(const o of Object.keys(a)){const i=(0,t.substringSearch)(a[o],e.label);["full","partial","reverse-partial"].includes(i)&&n.push({id:o,confidence:1*c.default.labelSubstringSearch[i]})}const o=i.default.byLabel_DE;for(const a of Object.keys(o)){const i=(0,t.substringSearch)(o[a],e.label);if(["full","partial","reverse-partial"].includes(i)){const e=n.findIndex((e=>e.id==a));-1===e?n.push({id:a,confidence:1*c.default.labelSubstringSearch[i]}):n[e].confidence===c.default.labelSubstringSearch.full||(n[e].confidence="full"===i?c.default.labelSubstringSearch[i]:(n[e].confidence+1*c.default.labelSubstringSearch[i])/2)}}return l(n)},t.matchByPlaceholder=e=>{const n=[];if(null===e.placeholder)return n;const a=i.default.byLabel_EN;for(const o of Object.keys(a)){const i=(0,t.substringSearch)(a[o],e.placeholder);["full","partial","reverse-partial"].includes(i)&&n.push({id:o,confidence:1*c.default.labelSubstringSearch[i]})}const o=i.default.byLabel_DE;for(const a of Object.keys(o)){const i=(0,t.substringSearch)(o[a],e.placeholder);if(["full","partial","reverse-partial"].includes(i)){const e=n.findIndex((e=>e.id==a));-1===e?n.push({id:a,confidence:1*c.default.labelSubstringSearch[i]}):n[e].confidence=(n[e].confidence+1*c.default.labelSubstringSearch[i])/2}}return l(n)},t.matchByFieldType=e=>{const t=[];if(null===e.fieldType)return t;const n=i.default.byFieldType;if(Object.keys(n).includes(e.fieldType))for(const a of n[e.fieldType]){let o=.75;n[e.fieldType].length<30&&(o=1),t.push({id:`${a}`,confidence:o})}return l(t)},t.matchByInputType=e=>{const t=[];if("input"!==e.fieldType||null===e.inputType)return t;const n=i.default.byInputType;if(Object.keys(n).includes(e.inputType))for(const a of n[e.inputType]){let o=.5;n[e.inputType].length<5?o=1:n[e.inputType].length>30&&(o=.75),t.push({id:`${a}`,confidence:o})}return l(t)},t.matchByFormType=e=>{const n=[];if(void 0===e.formId)return n;if(null===e.formHeadings||0===e.formHeadings.length)return n;const a={login:{full:0,partial:0,"reverse-partial":0,none:0},signup:{full:0,partial:0,"reverse-partial":0,none:0}};for(const n of e.formHeadings){const e=i.default.byFormType_EN;for(const o of Object.keys(e)){const i=(0,t.substringSearch)(e[o],n);"login"===o&&(a.login[i]=a.login[i]+1),"signup"===o&&(a.signup[i]=a.signup[i]+1)}const o=i.default.byFormType_DE;for(const e of Object.keys(o)){const i=(0,t.substringSearch)(o[e],n);"login"===e&&(a.login[i]=a.login[i]+1),"signup"===e&&(a.signup[i]=a.signup[i]+1)}}const c=2*a.login.full+a.login.partial,r=2*a.signup.full+a.signup.partial,d=(0,o.getIdOfAcName)("new-password"),s=(0,o.getIdOfAcName)("current-password");return c<r?(n.push({id:`${d}`,confidence:1}),n.push({id:`${s}`,confidence:.5})):(n.push({id:`${d}`,confidence:.5}),n.push({id:`${s}`,confidence:1})),l(n)},t.matchByName=e=>{const n=[];if(null===e.name)return n;const a=i.default.byLabel_EN;for(const o of Object.keys(a)){const i=(0,t.substringSearch)(a[o],e.name);["full","partial","reverse-partial"].includes(i)&&n.push({id:o,confidence:1*c.default.labelSubstringSearch[i]})}const o=i.default.byLabel_DE;for(const a of Object.keys(o)){const i=(0,t.substringSearch)(o[a],e.name);if(["full","partial","reverse-partial"].includes(i)){const e=n.findIndex((e=>e.id==a));-1===e?n.push({id:a,confidence:1*c.default.labelSubstringSearch[i]}):n[e].confidence===c.default.labelSubstringSearch.full||(n[e].confidence="full"===i?c.default.labelSubstringSearch[i]:(n[e].confidence+1*c.default.labelSubstringSearch[i])/2)}}return l(n)},t.matchById=e=>{const n=[];if(null===e.id)return n;const a=i.default.byLabel_EN;for(const o of Object.keys(a)){const i=(0,t.substringSearch)(a[o],e.id);["full","partial","reverse-partial"].includes(i)&&n.push({id:o,confidence:1*c.default.labelSubstringSearch[i]})}const o=i.default.byLabel_DE;for(const a of Object.keys(o)){const i=(0,t.substringSearch)(o[a],e.id);if(["full","partial","reverse-partial"].includes(i)){const e=n.findIndex((e=>e.id==a));-1===e?n.push({id:a,confidence:1*c.default.labelSubstringSearch[i]}):n[e].confidence===c.default.labelSubstringSearch.full||(n[e].confidence="full"===i?c.default.labelSubstringSearch[i]:(n[e].confidence+1*c.default.labelSubstringSearch[i])/2)}}return l(n)};const l=e=>{const t=e.reduce(((e,t)=>e+t.confidence),0)/e.length;return e.map((e=>({id:e.id,confidence:e.confidence*t}))),e};t.substringSearch=(e,t)=>{if(e.map((e=>r(e))).includes(r(t)))return"full";const n=t.split(/\s+/).filter(Boolean);let a=!1,o=!1;for(const t of n){const n=r(t);""!==n&&(n.length<3||(e.some((e=>-1!==r(e).indexOf(n)))&&(a=!0),e.some((e=>-1!==n.indexOf(r(e))))&&(o=!0)))}return a?"partial":o?"reverse-partial":"none"};const r=e=>e.replace(" ","").replace(/\W/g,"").toLowerCase()},37:e=>{e.exports=JSON.parse('{"byId":{"1":"name","2":"honorific-prefix","3":"given-name","4":"additional-name","5":"family-name","6":"honorific-suffix","7":"nickname","8":"organization-title","9":"username","10":"new-password","11":"current-password","12":"organization","13":"street-address","14":"address-line1","15":"address-line2","16":"address-line3","17":"address-level4","18":"address-level3","19":"address-level2","20":"address-level1","21":"country","22":"country-name","23":"postal-code","24":"cc-name","25":"cc-given-name","26":"cc-additional-name","27":"cc-family-name","28":"cc-number","29":"cc-exp","30":"cc-exp-month","31":"cc-exp-year","32":"cc-csc","33":"cc-type","34":"transaction-currency","35":"transaction-amount","36":"language","37":"bday","38":"bday-day","39":"bday-month","40":"bday-year","41":"sex","42":"url","43":"photo","44":"tel","45":"tel-country-code","46":"tel-national","47":"tel-area-code","48":"tel-local","49":"tel-local-prefix","50":"tel-local-suffix","51":"tel-extension","52":"email","53":"impp"},"byInputType":{"button":[],"checkbox":[2,6,33,34,36,41,45],"color":[],"date":[37],"datetime-local":[],"email":[9,52],"file":[],"hidden":[],"image":[],"month":[29],"number":[23,28,29,30,31,32,35,38,39,40,44,45,46,47,48,49,50,51],"password":[10,11],"radio":[],"range":[35],"reset":[],"search":[],"submit":[],"tel":[44],"text":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53],"time":[],"url":[42,43,53],"week":[],"datetime":[]},"byFieldType":{"input":[1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53],"textarea":[13,42,43,44],"select":[2,6,8,21,22,33,34,36,38,39,40,41,45]},"byLabel_EN":{"1":["name","fullname"],"2":["honorificprefix","honorific","prefix"],"3":["givenname","firstname","forename","callname"],"4":["additionalname","middlename"],"5":["familyname","lastname","surname"],"6":["honorificsuffix","honorific","suffix"],"7":["nickname","nick","screenname","alias"],"8":["organizationtitle","jobtitle","title"],"9":["username"],"10":["newpassword"],"11":["currentpassword","password"],"12":["organization","company","companyname"],"13":["streetaddress","address"],"14":["streetaddress","address","line1"],"15":["streetaddress","address","line2"],"16":["streetaddress","address","line3"],"17":["level4","address","town","city"],"18":["level3","address","district"],"19":["level2","address","town","city"],"20":["level1","address","state","town","province, prefecture"],"21":["country","countrycode"],"22":["country","countryname"],"23":["postalcode","zip","zipcode","postcode","cedex"],"24":["ccname","creditcardname","cardholder","cardowner","nameoncard"],"25":["ccgivenname","creditcardgivenname","creditcardfirstname","creditcardforename","creditcardcallname"],"26":["ccadditionalname","ccmiddlename","creditcardadditionbalname","creditcardmiddlename"],"27":["ccfamilyname","cclastname","ccsurname","creditcardfamilyname","creditcardlastname","creditcardsurname"],"28":["ccnumber","creditcardnumber","cardnumber","cardno"],"29":["expirationdate","expires","expiration"],"30":["expirationmonth","expiresmonth"],"31":["expirationyear","expiresyear"],"32":["securitycode","security","csc","cardsecuritycode","cvc","cardvalidationcode","cvv","cardverificationvalue","spc","signaturepanelcode","ccid","creditcardid"],"33":["payment","paymentprovider","provider","visa","mastercard","paypal"],"34":["transactioncurrency","currency","eur","usd","gbp","chf"],"35":["transactionamount","amount"],"36":["language"],"37":["birthday","bday"],"38":["birthdayday, bdayday","day"],"39":["birthdaymonth","bdaymonth","birthmonth","month"],"40":["birthyear","bdayyear","birthdayyear"],"41":["sex","gender","genderidentity","identity","male","female","transgender","trans","queer","other"],"42":["url","link","homepage","webpage","site","website"],"43":["photo","photograph","icon","image"],"44":["tel","telephone","telephonenumber","mobile","mobilephone","mobilenumber","mobileno"],"45":["countrycode","isd","countrycallingcode"],"46":["telnational"],"47":["telareacode","areacode","area"],"48":["tellocal","local"],"49":["tellocalprefix","localprefix"],"50":["tellocalsuffix","localsuffix"],"51":["telextension","internalextension","extension","internal"],"52":["email","emil","emailaddress"],"53":["impp","instantmessagingprotocol","instantmessagingprotocolendpoint"]},"byLabel_DE":{"1":["name","vorundnachname"],"2":["anrede","titel","prefix"],"3":["vorname","rufname"],"4":["zweitname","zwischenname","mittelname"],"5":["nachname","familienname"],"6":["namenszusatz","zusatz","suffix"],"7":["alias","künstlername","spitzname"],"8":["beruf","titel","jobbezeichnung"],"9":["benutzername"],"10":["neuespasswort"],"11":["aktuellespasswort","passwort"],"12":["organisation","firma","betrieb","konzern","geschäft"],"13":["adresse","straßehausnummer"],"14":["adresszeile1","zeile1","straße","hausnummer","hausnr"],"15":["adresszeile2","zeile2","hausnummer","hausnr","appartment"],"16":["adresszeile3","zeile3"],"17":["level4"],"18":["level3","stadtteil","bezirk","ortsteil"],"19":["level2","stadt","dorf","ort"],"20":["level1","bundesland","kanton"],"21":["ländercode","code"],"22":["ländername","landname","land"],"23":["postleitzahl","plz"],"24":["kreditkartenname","namedeskarteninhabers","karteninhaber","kartenbesitzer","kontoinhaber"],"25":["kreditkartenvorname"],"26":["kreditkartenzweitname","kreditkartenzwischenname","kreditkartenmittelname"],"27":["kreditkartennachname"],"28":["kreditkartennummer","iban","kartennummer"],"29":["verfallsdatum","läuftab","gültig","gültigbis"],"30":["ablaufmonat","gültigbismonat","bismonat"],"31":["ablaufjahr","gültigbisjahr","bisjahr"],"32":["sicherheitscode","prüfziffer","csc","cvc","cvv","spc","ccid"],"33":["zahlungsmethode","zahlungsanbieter","anbieter","visa","mastercard","paypal"],"34":["währung","transaktionswährung","eur","usd","gbp","chf"],"35":["transaktionsbetrag","betrag"],"36":["sprache"],"37":["geburtstag","geburtsdatum"],"38":["geburtstagtag","tag"],"39":["geburtstagmonat","monat"],"40":["geburtsjahr"],"41":["geschlecht","gender","geschlechtsidentität","identität","mann","frau","divers","transgender","trans","queer","other"],"42":["url","link","homepage","webseite","seite"],"43":["foto","bild","icon"],"44":["tel","telefon","telefonnummer","handy","mobiltelefon","mobilnummer","mobilfunknummer","mobil"],"45":["ländervorwahl","vorwahldeslandes","vorwahldeslands","internationalevorwahl"],"46":["nationaletelefonnummer"],"47":["vorwahl"],"48":[],"49":[],"50":[],"51":["durchwahl","internenummer","intern"],"52":["email","emil","emailadresse"],"53":["impp","instantmessagingprotocol","instantmessagingprotocolendpoint"]},"byFormType_EN":{"login":["login","signin"],"signup":["create","signup","register","registration","new","newaccount"]},"byFormType_DE":{"login":["login","anmelden","einloggen"],"signup":["erstellen","neuanmelden","neu","registrieren","registrierung"]}}')},969:e=>{e.exports=JSON.parse('{"values":["name","honorific-prefix","given-name","additional-name","family-name","honorific-suffix","nickname","organization-title","username","new-password","current-password","organization","street-address","address-line1","address-line2","address-line3","address-level4","address-level3","address-level2","address-level1","country","country-name","postal-code","cc-name","cc-given-name","cc-additional-name","cc-family-name","cc-number","cc-exp","cc-exp-month","cc-exp-year","cc-csc","cc-type","transaction-currency","transaction-amount","language","bday","bday-day","bday-month","bday-year","sex","url","photo","tel","tel-country-code","tel-national","tel-area-code","tel-local","tel-local-prefix","tel-local-suffix","tel-extension","email","impp"],"descriptions":{"name":"Full name","honorific-prefix":"Prefix or title (e.g., \'Mr.\', \'Ms.\', \'Dr.\', \'Mlle\')","given-name":"Given name (in some Western cultures, also known as the first name)","additional-name":"Additional names (in some Western cultures, also known as middle names, forenames other than the first name)","family-name":"Family name (in some Western cultures, also known as the last name or surname)","honorific-suffix":"Suffix (e.g., \'Jr.\', \'B.Sc.\', \'MBASW\', \'II\')","nickname":"Nickname, screen name, handle: a typically short name used instead of the full name","organization-title":"Job title (e.g., \'Software Engineer\', \'Senior Vice President\', \'Deputy Managing Director\')","username":"A username","new-password":"A new password (e.g., when creating an account or changing a password)","current-password":"The current password for the account identified by the username field (e.g., when logging in)","organization":"Company name corresponding to the person, address, or contact information in the other fields associated with this field","street-address":"Street address (multiple lines, newlines preserved)","address-line1":"Street address (one line per field, line 1)","address-line2":"Street address (one line per field, line 2)","address-line3":"Street address (one line per field, line 3)","address-level4":"The most fine-grained administrative level, in addresses with four administrative levels","address-level3":"The third administrative level, in addresses with three or more administrative levels","address-level2":"The second administrative level, in addresses with two or more administrative levels; in the countries with two administrative levels, this would typically be the city, town, village, or other locality within which the relevant street address is found","address-level1":"The broadest administrative level in the address, i.e., the province within which the locality is found; for example, in the US, this would be the state; in Switzerland it would be the canton; in the UK, the post town","country":"Country code","country-name":"Country name","postal-code":"Postal code, post code, ZIP code, CEDEX code (if CEDEX, append \'CEDEX\', and the dissement, if relevant, to the address-level2 field)","cc-name":"Full name as given on the payment instrument","cc-given-name":"Given name as given on the payment instrument (in some Western cultures, also known as the first name)","cc-additional-name":"Additional names given on the payment instrument (in some Western cultures, also known as middle names, forenames other than the first name)","cc-family-name":"Family name given on the payment instrument (in some Western cultures, also known as the last name or surname)","cc-number":"Code identifying the payment instrument (e.g., the credit card number)","cc-exp":"Expiration date of the payment instrument","cc-exp-month":"Month component of the expiration date of the payment instrument","cc-exp-year":"Year component of the expiration date of the payment instrument","cc-csc":"Security code for the payment instrument (also known as the card security code (CSC), card validation code (CVC), card verification value (CVV), signature panel code (SPC), credit card ID (CCID), etc)","cc-type":"Type of payment instrument","transaction-currency":"The currency that the user would prefer the transaction to use","transaction-amount":"The amount that the user would like for the transaction (e.g., when entering a bid or sale price)","language":"Preferred language","bday":"Birthday","bday-day":"Day component of birthday","bday-month":"Month component of birthday","bday-year":"Year component of birthday","sex":"Gender identity (e.g., Female, Fa’afafine)","url":"Home page or other Web page corresponding to the company, person, address, or contact information in the other fields associated with this field","photo":"Photograph, icon, or other image corresponding to the company, person, address, or contact information in the other fields associated with this field","tel":"Full telephone number, including country code","tel-country-code":"Country code component of the telephone number","tel-national":"Telephone number without the county code component, with a country-internal prefix applied if applicable","tel-area-code":"Area code component of the telephone number, with a country-internal prefix applied if applicable","tel-local":"Telephone number without the country code and area code components","tel-local-prefix":"First part of the component of the telephone number that follows the area code, when that component is split into two components","tel-local-suffix":"Second part of the component of the telephone number that follows the area code, when that component is split into two components","tel-extension":"Telephone number internal extension code","email":"E-mail address","impp":"URL representing an instant messaging protocol endpoint (for example, \'aim:goim?screenname=example\' or \'xmpp:fred@example.net\')"}}')},643:e=>{e.exports=JSON.parse('{"matchBy":{"Label":5,"Placeholder":4,"FieldType":1,"InputType":1,"FormType":1,"Name":2,"Id":2},"testType":{"Label":"inclusive","Placeholder":"exclusive","FieldType":"inclusive","InputType":"inclusive","FormType":"exclusive","Name":"exclusive","Id":"exclusive"},"labelSubstringSearch":{"full":1,"partial":0.8,"reverse-partial":0.55,"none":0},"lengthPenaltyMultiplier":1}')}},t={};!function n(a){var o=t[a];if(void 0!==o)return o.exports;var i=t[a]={exports:{}};return e[a].call(i.exports,i,i.exports,n),i.exports}(265)})();