(()=>{"use strict";var e={574:function(e,t,a){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.getSubmitTextOfForm=t.getHeadingsOfForm=t.getIdOfAcName=t.getNameOfAcId=t.analyzeField=t.parseAllForms=t.generateMatchingItem=void 0;const r=n(a(37)),l=a(579),i=n(a(643));t.generateMatchingItem=(e,a,n,r,l)=>{var i,c,o;const s=[...a.getElementsByTagName("label")].filter((t=>t.htmlFor==e.id)),u=e instanceof HTMLSelectElement?e.options:null;let m=null;const f=[];if(null!==u){for(const e of u)f.push(e.value);m=f}return{id:e.id,formId:l||null,positionInForm:r,formHeadings:(0,t.getHeadingsOfForm)(a,l),positionInFields:n,label:null!==(o=null===(c=null===(i=s[0])||void 0===i?void 0:i.textContent)||void 0===c?void 0:c.trim())&&void 0!==o?o:null,name:e.name,value:e.value,checked:e instanceof HTMLInputElement?e.checked:null,selectValues:m,ariaLabel:e.getAttribute("aria-label"),ariaDisabled:e.ariaDisabled,ariaHidden:e.getAttribute("aria-hidden"),inputType:e.type,fieldType:e.tagName.toLowerCase(),isInTable:d(e),autocomplete:e.getAttribute("autocomplete"),correctAutocomplete:null,placeholder:e.getAttribute("placeholder"),maxLength:null===e.getAttribute("maxLength")?null:Number(e.getAttribute("maxLength")),disabled:e.getAttribute("disabled"),required:e.required,pattern:e.getAttribute("pattern")}},t.parseAllForms=e=>{const a=e.getElementsByTagName("form"),n=[];for(let r=0;r<a.length;r++){const l={id:a[r].id,numOfLabeledFields:-1,numOfFields:Array.from(e.querySelectorAll("input, textarea, select")).filter((e=>"acc.devModeInput"!==e.className)).length,positionInForms:r,headingTexts:(0,t.getHeadingsOfForm)(e,a[r].id),submitText:(0,t.getSubmitTextOfForm)(e,a[r].id),autocomplete:a[r].getAttribute("autocomplete"),fields:[]};n.push(l)}return n},t.analyzeField=e=>{const t=c(),a=(0,l.matchByLabel)(e);o(t,a,i.default.matchBy.Label,i.default.testType.Label);const n=(0,l.matchByPlaceholder)(e);o(t,n,i.default.matchBy.Placeholder,i.default.testType.Placeholder);const r=(0,l.matchByFieldType)(e);o(t,r,i.default.matchBy.FieldType,i.default.testType.FieldType);const d=(0,l.matchByInputType)(e);o(t,d,i.default.matchBy.InputType,i.default.testType.InputType);const u=(0,l.matchByFormType)(e);o(t,u,i.default.matchBy.FormType,i.default.testType.FormType);const m=(0,l.matchByName)(e);o(t,m,i.default.matchBy.Name,i.default.testType.Name);const f=(0,l.matchById)(e);o(t,f,i.default.matchBy.Id,i.default.testType.Id);return s(t).sort(((e,t)=>t.confidenceScore-e.confidenceScore))},t.getNameOfAcId=e=>-1===Object.keys(r.default.byId).indexOf(e)?"!ERROR!":r.default.byId[e],t.getIdOfAcName=e=>{const t=Object.entries(r.default.byId).map((([e,t])=>t)).indexOf(e);return-1===t?"!ERROR!":Object.keys(r.default.byId)[t]};const c=()=>{const e=[];for(const t of Object.keys(r.default.byId))e.push({classId:t,resultsAndWeights:[]});return e},o=(e,t,a,n)=>{const l=[...t];if("inclusive"===n)for(const e of Object.keys(r.default.byId))t.find((t=>t.id===e))||l.push({id:e,confidence:0});for(const t of l){const n=e.findIndex((e=>e.classId==t.id)),r={result:t.confidence,weight:a};-1===n?e.push({classId:t.id,resultsAndWeights:[r]}):e[n].resultsAndWeights.push(r)}},s=e=>{const a=[],n=e.reduce(((e,t)=>Math.max(e,t.resultsAndWeights.length)),0);for(const r of e){const e=r.resultsAndWeights.length/n,l=r.resultsAndWeights.reduce(((e,t)=>e+t.result*t.weight),0)/r.resultsAndWeights.reduce(((e,t)=>e+t.weight),0),c=l-(1-e)/n*(1-l)*i.default.lengthPenaltyMultiplier;a.push({acValue:(0,t.getNameOfAcId)(r.classId),acId:r.classId,confidenceScore:c})}return a};t.getHeadingsOfForm=(e,t)=>{const a=[];if(void 0===t)return a;const n=e.getElementById(t);if(null===n)return a;const r=["h1","h2","h3","h4","h5","h6"];for(const e of r){const t=n.getElementsByTagName(e);for(const e of t)""!==e.innerHTML&&a.push(e.innerHTML)}return a},t.getSubmitTextOfForm=(e,t)=>{if(void 0===t)return null;const a=e.getElementById(t);if(null===a)return null;for(const e of["input","button"]){const t=a.getElementsByTagName(e);for(const e of t)if("submit"===e.getAttribute("type"))return null!==e.getAttribute("value")?e.getAttribute("value"):e.innerHTML}return null};const d=e=>{let t=e;for(;t&&"HTML"!==t.tagName;){if("TD"===t.tagName)return!0;t=t.parentNode}return!1}},579:function(e,t,a){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.substringSearch=t.matchById=t.matchByName=t.matchByFormType=t.matchByInputType=t.matchByFieldType=t.matchByPlaceholder=t.matchByLabel=void 0;const r=a(574),l=n(a(37)),i=n(a(643));t.matchByLabel=e=>{const a=[];if(null===e.label)return a;const n=l.default.byLabel_EN;for(const r of Object.keys(n)){const l=(0,t.substringSearch)(n[r],e.label);["full","partial","reverse-partial"].includes(l)&&a.push({id:r,confidence:1*i.default.labelSubstringSearch[l]})}const r=l.default.byLabel_DE;for(const n of Object.keys(r)){const l=(0,t.substringSearch)(r[n],e.label);if(["full","partial","reverse-partial"].includes(l)){const e=a.findIndex((e=>e.id==n));-1===e?a.push({id:n,confidence:1*i.default.labelSubstringSearch[l]}):a[e].confidence===i.default.labelSubstringSearch.full||(a[e].confidence="full"===l?i.default.labelSubstringSearch[l]:(a[e].confidence+1*i.default.labelSubstringSearch[l])/2)}}return c(a)},t.matchByPlaceholder=e=>{const a=[];if(null===e.placeholder)return a;const n=l.default.byLabel_EN;for(const r of Object.keys(n)){const l=(0,t.substringSearch)(n[r],e.placeholder);["full","partial","reverse-partial"].includes(l)&&a.push({id:r,confidence:1*i.default.labelSubstringSearch[l]})}const r=l.default.byLabel_DE;for(const n of Object.keys(r)){const l=(0,t.substringSearch)(r[n],e.placeholder);if(["full","partial","reverse-partial"].includes(l)){const e=a.findIndex((e=>e.id==n));-1===e?a.push({id:n,confidence:1*i.default.labelSubstringSearch[l]}):a[e].confidence=(a[e].confidence+1*i.default.labelSubstringSearch[l])/2}}return c(a)},t.matchByFieldType=e=>{const t=[];if(null===e.fieldType)return t;const a=l.default.byFieldType;if(Object.keys(a).includes(e.fieldType))for(const n of a[e.fieldType]){let r=.75;a[e.fieldType].length<30&&(r=1),t.push({id:`${n}`,confidence:r})}return c(t)},t.matchByInputType=e=>{const t=[];if("input"!==e.fieldType||null===e.inputType)return t;const a=l.default.byInputType;if(Object.keys(a).includes(e.inputType))for(const n of a[e.inputType]){let r=.5;a[e.inputType].length<5?r=1:a[e.inputType].length>30&&(r=.75),t.push({id:`${n}`,confidence:r})}return c(t)},t.matchByFormType=e=>{const a=[];if(void 0===e.formId)return a;if(null===e.formHeadings||0===e.formHeadings.length)return a;const n={login:{full:0,partial:0,"reverse-partial":0,none:0},signup:{full:0,partial:0,"reverse-partial":0,none:0}};for(const a of e.formHeadings){const e=l.default.byFormType_EN;for(const r of Object.keys(e)){const l=(0,t.substringSearch)(e[r],a);"login"===r&&(n.login[l]=n.login[l]+1),"signup"===r&&(n.signup[l]=n.signup[l]+1)}const r=l.default.byFormType_DE;for(const e of Object.keys(r)){const l=(0,t.substringSearch)(r[e],a);"login"===e&&(n.login[l]=n.login[l]+1),"signup"===e&&(n.signup[l]=n.signup[l]+1)}}const i=2*n.login.full+n.login.partial,o=2*n.signup.full+n.signup.partial,s=(0,r.getIdOfAcName)("new-password"),d=(0,r.getIdOfAcName)("current-password");return i<o?(a.push({id:`${s}`,confidence:1}),a.push({id:`${d}`,confidence:.5})):(a.push({id:`${s}`,confidence:.5}),a.push({id:`${d}`,confidence:1})),c(a)},t.matchByName=e=>{const a=[];if(null===e.name)return a;const n=l.default.byLabel_EN;for(const r of Object.keys(n)){const l=(0,t.substringSearch)(n[r],e.name);["full","partial","reverse-partial"].includes(l)&&a.push({id:r,confidence:1*i.default.labelSubstringSearch[l]})}const r=l.default.byLabel_DE;for(const n of Object.keys(r)){const l=(0,t.substringSearch)(r[n],e.name);if(["full","partial","reverse-partial"].includes(l)){const e=a.findIndex((e=>e.id==n));-1===e?a.push({id:n,confidence:1*i.default.labelSubstringSearch[l]}):a[e].confidence===i.default.labelSubstringSearch.full||(a[e].confidence="full"===l?i.default.labelSubstringSearch[l]:(a[e].confidence+1*i.default.labelSubstringSearch[l])/2)}}return c(a)},t.matchById=e=>{const a=[];if(null===e.id)return a;const n=l.default.byLabel_EN;for(const r of Object.keys(n)){const l=(0,t.substringSearch)(n[r],e.id);["full","partial","reverse-partial"].includes(l)&&a.push({id:r,confidence:1*i.default.labelSubstringSearch[l]})}const r=l.default.byLabel_DE;for(const n of Object.keys(r)){const l=(0,t.substringSearch)(r[n],e.id);if(["full","partial","reverse-partial"].includes(l)){const e=a.findIndex((e=>e.id==n));-1===e?a.push({id:n,confidence:1*i.default.labelSubstringSearch[l]}):a[e].confidence===i.default.labelSubstringSearch.full||(a[e].confidence="full"===l?i.default.labelSubstringSearch[l]:(a[e].confidence+1*i.default.labelSubstringSearch[l])/2)}}return c(a)};const c=e=>{const t=e.reduce(((e,t)=>e+t.confidence),0)/e.length;return e.map((e=>({id:e.id,confidence:e.confidence*t}))),e};t.substringSearch=(e,t)=>{if(e.map((e=>o(e))).includes(o(t)))return"full";const a=t.split(/\s+/).filter(Boolean);let n=!1,r=!1;for(const t of a){const a=o(t);""!==a&&(a.length<3||(e.some((e=>-1!==o(e).indexOf(a)))&&(n=!0),e.some((e=>-1!==a.indexOf(o(e))))&&(r=!0)))}return n?"partial":r?"reverse-partial":"none"};const o=e=>e.replace(" ","").replace(/\W/g,"").toLowerCase()},870:function(e,t,a){var n=this&&this.__awaiter||function(e,t,a,n){return new(a||(a=Promise))((function(r,l){function i(e){try{o(n.next(e))}catch(e){l(e)}}function c(e){try{o(n.throw(e))}catch(e){l(e)}}function o(e){var t;e.done?r(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(i,c)}o((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=a(574);chrome.runtime.onInstalled.addListener((()=>n(void 0,void 0,void 0,(function*(){yield chrome.action.setIcon({path:"icon32-d.png"}),yield chrome.storage.local.set({"acc.highlight":!1}),yield chrome.storage.local.set({"acc.showHidden":!0}),yield chrome.storage.local.set({"acc.showDisabled":!0}),yield chrome.storage.local.set({"acc.hoverColor":"#303030"}),yield chrome.storage.local.set({"acc.fontSize":"small"}),yield chrome.storage.local.set({"acc.onlyTestForms":!1}),yield chrome.storage.local.set({"acc.floatBadge":!1}),yield chrome.storage.local.set({"acc.classThreshold":"0.5"}),yield chrome.storage.local.set({"acc.devMode":!1}),yield chrome.storage.local.set({"acc.dbUrlTxt":""}),yield chrome.storage.local.set({"acc.dbUsrTxt":""}),yield chrome.storage.local.set({"acc.dbPwdTxt":""})})))),chrome.runtime.onMessage.addListener((function(e,t,a){switch(e.msg){case"acc.updateBadgeText":(e=>{n(void 0,void 0,void 0,(function*(){const t=(yield chrome.storage.local.get(["acc.highlight"]))["acc.highlight"];chrome.action.setBadgeText({text:t?"ON":"OFF"}),e({status:!0})}))})(a);break;case"acc.addFormToDB":i(e.data,a);break;case"acc.classifyField":a({data:l(e.data)})}return!0}));const l=e=>(0,r.analyzeField)(e),i=(e,t)=>n(void 0,void 0,void 0,(function*(){const a=(yield chrome.storage.local.get("acc.dbUrlTxt"))["acc.dbUrlTxt"],n=(yield chrome.storage.local.get("acc.dbUsrTxt"))["acc.dbUsrTxt"],r=(yield chrome.storage.local.get("acc.dbPwdTxt"))["acc.dbPwdTxt"],l=yield fetch(`${a}/autocompletecheck-db/`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Basic "+btoa(`${n}:${r}`)},body:JSON.stringify(e)});console.log(l.statusText),console.log(l),t({status:l.statusText})}));chrome.action.onClicked.addListener((e=>n(void 0,void 0,void 0,(function*(){(e=>{n(void 0,void 0,void 0,(function*(){const t=(yield chrome.storage.local.get(["acc.highlight"]))["acc.highlight"];if(yield chrome.storage.local.set({"acc.highlight":!t}),yield chrome.action.setIcon({path:t?"icon32-d.png":"icon32-g.png"}),void 0!==e.id)return console.log(`tab-id: ${e.id}`),yield chrome.tabs.sendMessage(e.id,{msg:"acc.toggleHighlightContent"}),!0}))})(e)}))))},37:e=>{e.exports=JSON.parse('{"byId":{"1":"name","2":"honorific-prefix","3":"given-name","4":"additional-name","5":"family-name","6":"honorific-suffix","7":"nickname","8":"organization-title","9":"username","10":"new-password","11":"current-password","12":"organization","13":"street-address","14":"address-line1","15":"address-line2","16":"address-line3","17":"address-level4","18":"address-level3","19":"address-level2","20":"address-level1","21":"country","22":"country-name","23":"postal-code","24":"cc-name","25":"cc-given-name","26":"cc-additional-name","27":"cc-family-name","28":"cc-number","29":"cc-exp","30":"cc-exp-month","31":"cc-exp-year","32":"cc-csc","33":"cc-type","34":"transaction-currency","35":"transaction-amount","36":"language","37":"bday","38":"bday-day","39":"bday-month","40":"bday-year","41":"sex","42":"url","43":"photo","44":"tel","45":"tel-country-code","46":"tel-national","47":"tel-area-code","48":"tel-local","49":"tel-local-prefix","50":"tel-local-suffix","51":"tel-extension","52":"email","53":"impp"},"byInputType":{"button":[],"checkbox":[2,6,33,34,36,41,45],"color":[],"date":[37],"datetime-local":[],"email":[9,52],"file":[],"hidden":[],"image":[],"month":[29],"number":[23,28,29,30,31,32,35,38,39,40,44,45,46,47,48,49,50,51],"password":[10,11],"radio":[],"range":[35],"reset":[],"search":[],"submit":[],"tel":[44],"text":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53],"time":[],"url":[42,43,53],"week":[],"datetime":[]},"byFieldType":{"input":[1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53],"textarea":[13,42,43,44],"select":[2,6,8,21,22,33,34,36,38,39,40,41,45]},"byLabel_EN":{"1":["name","fullname"],"2":["honorificprefix","honorific","prefix"],"3":["givenname","firstname","forename","callname"],"4":["additionalname","middlename"],"5":["familyname","lastname","surname"],"6":["honorificsuffix","honorific","suffix"],"7":["nickname","nick","screenname","alias"],"8":["organizationtitle","jobtitle","title"],"9":["username"],"10":["newpassword"],"11":["currentpassword","password"],"12":["organization","company","companyname"],"13":["streetaddress","address"],"14":["streetaddress","address","line1"],"15":["streetaddress","address","line2"],"16":["streetaddress","address","line3"],"17":["level4","address","town","city"],"18":["level3","address","district"],"19":["level2","address","town","city"],"20":["level1","address","state","town","province, prefecture"],"21":["country","countrycode"],"22":["country","countryname"],"23":["postalcode","zip","zipcode","postcode","cedex"],"24":["ccname","creditcardname","cardholder","cardowner","nameoncard"],"25":["ccgivenname","creditcardgivenname","creditcardfirstname","creditcardforename","creditcardcallname"],"26":["ccadditionalname","ccmiddlename","creditcardadditionbalname","creditcardmiddlename"],"27":["ccfamilyname","cclastname","ccsurname","creditcardfamilyname","creditcardlastname","creditcardsurname"],"28":["ccnumber","creditcardnumber","cardnumber","cardno"],"29":["expirationdate","expires","expiration"],"30":["expirationmonth","expiresmonth"],"31":["expirationyear","expiresyear"],"32":["securitycode","security","csc","cardsecuritycode","cvc","cardvalidationcode","cvv","cardverificationvalue","spc","signaturepanelcode","ccid","creditcardid"],"33":["payment","paymentprovider","provider","visa","mastercard","paypal"],"34":["transactioncurrency","currency","eur","usd","gbp","chf"],"35":["transactionamount","amount"],"36":["language"],"37":["birthday","bday"],"38":["birthdayday, bdayday","day"],"39":["birthdaymonth","bdaymonth","birthmonth","month"],"40":["birthyear","bdayyear","birthdayyear"],"41":["sex","gender","genderidentity","identity","male","female","transgender","trans","queer","other"],"42":["url","link","homepage","webpage","site","website"],"43":["photo","photograph","icon","image"],"44":["tel","telephone","telephonenumber","mobile","mobilephone","mobilenumber","mobileno"],"45":["countrycode","isd","countrycallingcode"],"46":["telnational"],"47":["telareacode","areacode","area"],"48":["tellocal","local"],"49":["tellocalprefix","localprefix"],"50":["tellocalsuffix","localsuffix"],"51":["telextension","internalextension","extension","internal"],"52":["email","emil","emailaddress"],"53":["impp","instantmessagingprotocol","instantmessagingprotocolendpoint"]},"byLabel_DE":{"1":["name","vorundnachname"],"2":["anrede","titel","prefix"],"3":["vorname","rufname"],"4":["zweitname","zwischenname","mittelname"],"5":["nachname","familienname"],"6":["namenszusatz","zusatz","suffix"],"7":["alias","künstlername","spitzname"],"8":["beruf","titel","jobbezeichnung"],"9":["benutzername"],"10":["neuespasswort"],"11":["aktuellespasswort","passwort"],"12":["organisation","firma","betrieb","konzern","geschäft"],"13":["adresse","straßehausnummer"],"14":["adresszeile1","zeile1","straße","hausnummer","hausnr"],"15":["adresszeile2","zeile2","hausnummer","hausnr","appartment"],"16":["adresszeile3","zeile3"],"17":["level4"],"18":["level3","stadtteil","bezirk","ortsteil"],"19":["level2","stadt","dorf","ort"],"20":["level1","bundesland","kanton"],"21":["ländercode","code"],"22":["ländername","landname","land"],"23":["postleitzahl","plz"],"24":["kreditkartenname","namedeskarteninhabers","karteninhaber","kartenbesitzer","kontoinhaber"],"25":["kreditkartenvorname"],"26":["kreditkartenzweitname","kreditkartenzwischenname","kreditkartenmittelname"],"27":["kreditkartennachname"],"28":["kreditkartennummer","iban","kartennummer"],"29":["verfallsdatum","läuftab","gültig","gültigbis"],"30":["ablaufmonat","gültigbismonat","bismonat"],"31":["ablaufjahr","gültigbisjahr","bisjahr"],"32":["sicherheitscode","prüfziffer","csc","cvc","cvv","spc","ccid"],"33":["zahlungsmethode","zahlungsanbieter","anbieter","visa","mastercard","paypal"],"34":["währung","transaktionswährung","eur","usd","gbp","chf"],"35":["transaktionsbetrag","betrag"],"36":["sprache"],"37":["geburtstag","geburtsdatum"],"38":["geburtstagtag","tag"],"39":["geburtstagmonat","monat"],"40":["geburtsjahr"],"41":["geschlecht","gender","geschlechtsidentität","identität","mann","frau","divers","transgender","trans","queer","other"],"42":["url","link","homepage","webseite","seite"],"43":["foto","bild","icon"],"44":["tel","telefon","telefonnummer","handy","mobiltelefon","mobilnummer","mobilfunknummer","mobil"],"45":["ländervorwahl","vorwahldeslandes","vorwahldeslands","internationalevorwahl"],"46":["nationaletelefonnummer"],"47":["vorwahl"],"48":[],"49":[],"50":[],"51":["durchwahl","internenummer","intern"],"52":["email","emil","emailadresse"],"53":["impp","instantmessagingprotocol","instantmessagingprotocolendpoint"]},"byFormType_EN":{"login":["login","signin"],"signup":["create","signup","register","registration","new","newaccount"]},"byFormType_DE":{"login":["login","anmelden","einloggen"],"signup":["erstellen","neuanmelden","neu","registrieren","registrierung"]}}')},643:e=>{e.exports=JSON.parse('{"matchBy":{"Label":5,"Placeholder":4,"FieldType":1,"InputType":1,"FormType":1,"Name":2,"Id":2},"testType":{"Label":"inclusive","Placeholder":"exclusive","FieldType":"inclusive","InputType":"inclusive","FormType":"exclusive","Name":"exclusive","Id":"exclusive"},"labelSubstringSearch":{"full":1,"partial":0.8,"reverse-partial":0.55,"none":0},"lengthPenaltyMultiplier":1}')}},t={};!function a(n){var r=t[n];if(void 0!==r)return r.exports;var l=t[n]={exports:{}};return e[n].call(l.exports,l,l.exports,a),l.exports}(870)})();