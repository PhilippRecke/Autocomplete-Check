(()=>{"use strict";var e={265:function(e,t,n){var a=this&&this.__awaiter||function(e,t,n,a){return new(n||(n=Promise))((function(o,i){function c(e){try{d(a.next(e))}catch(e){i(e)}}function r(e){try{d(a.throw(e))}catch(e){i(e)}}function d(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(c,r)}d((a=a.apply(e,t||[])).next())}))},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=n(574),c=o(n(969)),r=[],d=()=>a(void 0,void 0,void 0,(function*(){var e;const t=(yield chrome.storage.local.get(["acc.highlight"]))["acc.highlight"];if(yield chrome.runtime.sendMessage({msg:"acc.updateBadgeText"}),t){console.log("add highlights");const t=[...document.getElementsByTagName("input"),...document.getElementsByTagName("textarea"),...document.getElementsByTagName("select")];console.log(t);for(const n of t)if("acc.devModeInput"!==n.className&&"hidden"!==n.type){const t=(0,i.generateMatchingItem)(n,document),a=(yield chrome.runtime.sendMessage({msg:"acc.classifyField",data:t})).data,o=void 0!==n.autocomplete&&""!==n.autocomplete,d=o?n.autocomplete:"value missing",l=document.createElement("div");l.className="acc-badge";const s=document.createElement("div");console.log(""===n.autocomplete),s.className=o?"acc-icon acc-correct":"acc-icon acc-false",s.innerHTML=o?"✔":"❌";const m=document.createElement("div");let u;m.className=o?"acc-text acc-correct":"acc-text acc-false",m.innerHTML=`autocomplete: ${d}`,l.appendChild(s),l.appendChild(m),u=a[0].acValue===d?`${a[0].confidenceScore.toFixed(1)}`:`${a[0].acValue}: ${a[0].confidenceScore.toFixed(1)}`;const p=document.createElement("div");if(p.className="acc-classificationLabel",p.innerHTML=u,l.appendChild(p),(yield chrome.storage.local.get(["acc.devMode"]))["acc.devMode"]){const e=document.createElement("p");e.innerHTML="add todb:",e.className="acc.devModeText",e.style.padding="4px";const a=document.createElement("input");a.type="checkbox",a.className="acc.devModeInput",a.style.padding="4px",a.onchange=e=>{const a=r.find((e=>e.id===n.id));if(void 0===a){const a={id:n.id,item:t,addToDB:e.target.checked,acNeeded:void 0,valCorrect:void 0,actualVal:void 0};r.push(a)}else a.addToDB=e.target.checked};const o=document.createElement("p");o.innerHTML="ac needed:",o.className="acc.devModeText",o.style.padding="4px";const i=document.createElement("input");i.type="checkbox",i.className="acc.devModeInput",i.style.padding="4px",i.onchange=e=>{const a=r.find((e=>e.id===n.id));if(void 0===a){const a={id:n.id,item:t,addToDB:void 0,acNeeded:e.target.checked,valCorrect:void 0,actualVal:void 0};r.push(a)}else a.acNeeded=e.target.checked};const d=document.createElement("p");d.innerHTML="value correct:",d.className="acc.devModeText",d.style.padding="4px";const s=document.createElement("input");s.type="checkbox",s.className="acc.devModeInput",s.style.padding="4px",s.onchange=e=>{const a=r.find((e=>e.id===n.id));if(void 0===a){const a={id:n.id,item:t,addToDB:void 0,acNeeded:void 0,valCorrect:e.target.checked,actualVal:void 0};r.push(a)}else a.valCorrect=e.target.checked};const m=document.createElement("select");m.className="acc.devModeInput";for(const e of c.default.values){const t=document.createElement("option");t.value=e,t.text=e,m.appendChild(t)}m.onchange=e=>{const a=r.find((e=>e.id===n.id));if(void 0===a){const a={id:n.id,item:t,addToDB:void 0,acNeeded:void 0,valCorrect:void 0,actualVal:e.target.value};r.push(a)}else a.actualVal=e.target.value},l.appendChild(e),l.appendChild(a),l.appendChild(o),l.appendChild(i),l.appendChild(d),l.appendChild(s),l.appendChild(m)}null===(e=n.parentNode)||void 0===e||e.insertBefore(l,n.nextSibling)}}else{console.log("highlight off");const e=document.getElementsByClassName("acc-badge");console.log(e),console.log(e.length);for(var n=e.length-1;n>=0;--n)e[n].remove()}})),l=()=>a(void 0,void 0,void 0,(function*(){const e=r.filter((e=>e.addToDB));for(const t of e)void 0===t.acNeeded&&(t.acNeeded=!1),void 0===t.valCorrect&&(t.acNeeded=!1);yield chrome.runtime.sendMessage({msg:"acc.addFormToDB",data:e,url:window.location.href})}));chrome.runtime.onMessage.addListener(((e,t,n)=>{"acc.toggleHighlightContent"===e.msg&&(d(),n({status:!0}))})),console.log("contentscript injected!"),d(),chrome.storage.local.get(["acc.devMode"],(e=>{if(e["acc.devMode"]){const e=document.createElement("button");e.innerHTML="Add to DB",e.style.position="absolute",e.style.top="12px",e.style.padding="8px",e.style.zIndex="9999",e.onclick=l,document.body.appendChild(e)}}))},574:function(e,t,n){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.analyzeField=t.analyzeForm=t.generateMatchingItem=void 0;const o=a(n(37)),i=n(579);t.generateMatchingItem=(e,t)=>{const n={};n.inputType=e.type,n.inputName=e.name,n.fieldType=e.tagName.toLowerCase();const a=[...t.getElementsByTagName("label")].filter((t=>t.htmlFor==e.id)).map((e=>e.innerText));return n.labelText=a[0],e instanceof HTMLSelectElement||(n.inputPlaceholder=""==e.placeholder?void 0:e.placeholder),n.inputRequired=e.required,n},t.analyzeForm=e=>{},t.analyzeField=e=>{const t=(0,i.matchByLabel)(e),n=(0,i.matchByFieldType)(e),a=(0,i.matchByInputType)(e);return c({labelResult:t,fieldTypeResult:n,inputTypeResult:a}).sort(((e,t)=>t.confidenceScore-e.confidenceScore))};const c=e=>{const t=[];for(const n of e.labelResult)r(t,n);for(const n of e.fieldTypeResult)r(t,n);for(const n of e.inputTypeResult)r(t,n);return t},r=(e,t)=>{const n=e.findIndex((e=>e.acId==t.id));var a;-1===n?e.push({acValue:(a=t.id,-1===Object.keys(o.default.byId).indexOf(a)?"!ERROR!":o.default.byId[a]),acId:t.id,confidenceScore:t.confidence}):e[n].confidenceScore=e[n].confidenceScore+t.confidence}},579:function(e,t,n){var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.matchByInputType=t.matchByFieldType=t.matchByLabel=void 0;const o=a(n(37)),i=a(n(643));t.matchByLabel=e=>{const t=[];if(void 0===e.labelText)return t;const n=e.labelText.replace(" ","").replace(/\W/g,"").toLowerCase(),a=o.default.byLabel_EN;for(const e of Object.keys(a))a[e].includes(n)&&t.push({id:e,confidence:1*i.default.matchByLabel});const r=o.default.byLabel_DE;for(const e of Object.keys(r))if(r[e].includes(n)){const n=t.findIndex((t=>t.id==e));-1===n?t.push({id:e,confidence:1*i.default.matchByLabel}):t[n].confidence=t[n].confidence+1*i.default.matchByLabel}return c(t)},t.matchByFieldType=e=>{const t=[];if(void 0===e.fieldType)return t;const n=o.default.byFieldType;if(Object.keys(n).includes(e.fieldType))for(const a of n[e.fieldType]){let o=1*i.default.matchByFieldType;n[e.fieldType].lenght<30&&(o=1.5*i.default.matchByFieldType),t.push({id:`${a}`,confidence:o})}return c(t)},t.matchByInputType=e=>{const t=[];if("input"!==e.fieldType||void 0===e.inputType)return t;const n=o.default.byInputType;if(Object.keys(n).includes(e.inputType))for(const a of n[e.inputType]){let o=1*i.default.matchByInputType;n[e.inputType].lenght<5?o=2*i.default.matchByInputType:n[e.inputType].lenght>30&&(o=1.5*i.default.matchByInputType),t.push({id:`${a}`,confidence:o})}return c(t)};const c=e=>{const t=e.reduce(((e,t)=>e+t.confidence),0)/e.length;return e.map((e=>({id:e.id,confidence:e.confidence*t})))}},37:e=>{e.exports=JSON.parse('{"byId":{"1":"name","2":"honorific-prefix","3":"given-name","4":"additional-name","5":"family-name","6":"honorific-suffix","7":"nickname","8":"organization-title","9":"username","10":"new-password","11":"current-password","12":"organization","13":"street-address","14":"address-line1","15":"address-line2","16":"address-line3","17":"address-level4","18":"address-level3","19":"address-level2","20":"address-level1","21":"country","22":"country-name","23":"postal-code","24":"cc-name","25":"cc-given-name","26":"cc-additional-name","27":"cc-family-name","28":"cc-number","29":"cc-exp","30":"cc-exp-month","31":"cc-exp-year","32":"cc-csc","33":"cc-type","34":"transaction-currency","35":"transaction-amount","36":"language","37":"bday","38":"bday-day","39":"bday-month","40":"bday-year","41":"sex","42":"url","43":"photo","44":"tel","45":"tel-country-code","46":"tel-national","47":"tel-area-code","48":"tel-local","49":"tel-local-prefix","50":"tel-local-suffix","51":"tel-extension","52":"email","53":"impp"},"byInputType":{"button":[],"checkbox":[2,6,33,34,36,41,45],"color":[],"date":[37],"datetime-local":[],"email":[9,52],"file":[],"hidden":[],"image":[],"month":[29],"number":[23,28,29,30,31,32,35,38,39,40,44,45,46,47,48,49,50,51],"password":[10,11],"radio":[],"range":[35],"reset":[],"search":[],"submit":[],"tel":[44],"text":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53],"time":[],"url":[42,43,53],"week":[],"datetime":[]},"byFieldType":{"input":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53],"textarea":[13,42,43,44],"select":[2,6,8,21,22,33,34,36,38,39,40,41,45]},"byLabel_EN":{"1":["name"],"2":["honorificprefix","honorific","prefix"],"3":["givenname","firstname","forename","callname"],"4":["additionalname","middlename"],"5":["familyname","lastname","surname"],"6":["honorificsuffix","honorific","suffix"],"7":["nickname","nick","screenname","alias"],"8":["organizationtitle","jobtitle","title"],"9":["username"],"10":["newpassword"],"11":["currentpassword","password"],"12":["organization","company","companyname"],"13":["streetaddress","address"],"14":["streetaddress","address","line1"],"15":["streetaddress","address","line2"],"16":["streetaddress","address","line3"],"17":["level4","address","town","city"],"18":["level3","address","district"],"19":["level2","address","town","city"],"20":["level1","address","state","town","province, prefecture"],"21":["country","countrycode"],"22":["country","countryname"],"23":["postalcode","zip","zipcode","postcode","cedex"],"24":["ccname","creditcardname","name"],"25":["ccgivenname","creditcardgivenname","givenname","creditcardfirstname","creditcardforename","creditcardcallname","firstname","forename","callname"],"26":["ccadditionalname","ccmiddlename","creditcardadditionbalname","creditcardmiddlename"],"27":["ccfamilyname","cclastname","ccsurname","creditcardfamilyname","creditcardlastname","creditcardsurname"],"28":["ccnumber","creditcardnumber","cardnumber"],"29":["expirationdate","expires","expiration"],"30":["expirationmonth","expiresmonth"],"31":["expirationyear","expiresyear"],"32":["securitycode","security","csc","cardsecuritycode","cvc","cardvalidationcode","cvv","cardverificationvalue","spc","signaturepanelcode","ccid","creditcardid"],"33":["payment","paymentprovider","visa","mastercard","paypal"],"34":["transactioncurrency","currency","eur","usd","gbp","chf"],"35":["transactionamount","amount"],"36":["language"],"37":["birthday","bday"],"38":["birthdayday, bdayday","day"],"39":["birthdaymonth","bdaymonth","birthmonth","month"],"40":["birthyear","bdayyear","birthdayyear"],"41":["sex","gender","genderidentity","identity","male","female","transgender","trans","queer","other"],"42":["url","link","homepage","webpage","site","website"],"43":["photo","photograph","icon","image"],"44":["tel","telephone","telephonenumber","mobile","mobilephone"],"45":["countrycode"],"46":["telnational"],"47":["telareacode","areacode","area"],"48":["tellocal","local"],"49":["tellocalprefix","localprefix"],"50":["tellocalsuffix","localsuffix"],"51":["telextension","internalextension","extension","internal"],"52":["email","emil","emailaddress"],"53":["impp","instantmessagingprotocol","instantmessagingprotocolendpoint"]},"byLabel_DE":{"1":["name"],"2":["anrede","titel","prefix"],"3":["vorname","rufname"],"4":["zweitname","zwischenname","mittelname"],"5":["nachname","familienname"],"6":["namenszusatz","zusatz","suffix"],"7":["alias","künstlername","spitzname"],"8":["beruf","titel","jobbezeichnung"],"9":["benutzername"],"10":["neuespasswort"],"11":["aktuellespasswort","passwort"],"12":["organisation","firma","betrieb","konzern","geschäft"],"13":["adresse"],"14":["adresszeile1","zeile1"],"15":["adresszeile2","zeile2"],"16":["adresszeile3","zeile3"],"17":["level4"],"18":["level3","stadtteil"],"19":["level2","stadt","dorf"],"20":["level1","bundesland","kanton"],"21":["ländercode","code"],"22":["ländername","landname","land"],"23":["postleitzahl","plz"],"24":["kreditkartenname","name"],"25":["kreditkartenvorname","vorname"],"26":["kreditkartenzweitname","kreditkartenzwischenname","kreditkartenmittelname","zweitname","zwischenname","mittelname"],"27":["kreditkartennachname"],"28":["kreditkartennummer","iban","kartennummer"],"29":["verfallsdatum","läuftab","gültig"],"30":["ablaufmonat"],"31":["ablaufjahr"],"32":["sicherheitscode","csc","cvc","cvv","spc","ccid"],"33":["zahlungsmethode","zahlungsanbieter","anbieter","visa","mastercard","paypal"],"34":["währung","transaktionswährung","eur","usd","gbp","chf"],"35":["transaktionsbetrag","betrag"],"36":["sprache"],"37":["geburtstag"],"38":["geburtstagtag","tag"],"39":["geburtstagmonat","monat"],"40":["geburtsjahr"],"41":["geschlecht","gender","geschlechtsidentität","identität","mann","frau","divers","transgender","trans","queer","other"],"42":["url","link","homepage","webseite","seite"],"43":["foto","bild","icon"],"44":["tel","telefon","telefonnummer","handy","mobiltelefon","mobilnummer"],"45":["ländervorwahl","vorwahldeslandes","vorwahldeslands"],"46":["nationaletelefonnummer"],"47":["vorwahl"],"48":[],"49":[],"50":[],"51":["durchwahl","internenummer","intern"],"52":["email","emil","emailadresse"],"53":["impp","instantmessagingprotocol","instantmessagingprotocolendpoint"]}}')},969:e=>{e.exports=JSON.parse('{"values":["name","honorific-prefix","given-name","additional-name","family-name","honorific-suffix","nickname","organization-title","username","new-password","current-password","organization","street-address","address-line1","address-line2","address-line3","address-level4","address-level3","address-level2","address-level1","country","country-name","postal-code","cc-name","cc-given-name","cc-additional-name","cc-family-name","cc-number","cc-exp","cc-exp-month","cc-exp-year","cc-csc","cc-type","transaction-currency","transaction-amount","language","bday","bday-day","bday-month","bday-year","sex","url","photo","tel","tel-country-code","tel-national","tel-area-code","tel-local","tel-local-prefix","tel-local-suffix","tel-extension","email","impp"],"descriptions":{"name":"Full name","honorific-prefix":"Prefix or title (e.g., \'Mr.\', \'Ms.\', \'Dr.\', \'Mlle\')","given-name":"Given name (in some Western cultures, also known as the first name)","additional-name":"Additional names (in some Western cultures, also known as middle names, forenames other than the first name)","family-name":"Family name (in some Western cultures, also known as the last name or surname)","honorific-suffix":"Suffix (e.g., \'Jr.\', \'B.Sc.\', \'MBASW\', \'II\')","nickname":"Nickname, screen name, handle: a typically short name used instead of the full name","organization-title":"Job title (e.g., \'Software Engineer\', \'Senior Vice President\', \'Deputy Managing Director\')","username":"A username","new-password":"A new password (e.g., when creating an account or changing a password)","current-password":"The current password for the account identified by the username field (e.g., when logging in)","organization":"Company name corresponding to the person, address, or contact information in the other fields associated with this field","street-address":"Street address (multiple lines, newlines preserved)","address-line1":"Street address (one line per field, line 1)","address-line2":"Street address (one line per field, line 2)","address-line3":"Street address (one line per field, line 3)","address-level4":"The most fine-grained administrative level, in addresses with four administrative levels","address-level3":"The third administrative level, in addresses with three or more administrative levels","address-level2":"The second administrative level, in addresses with two or more administrative levels; in the countries with two administrative levels, this would typically be the city, town, village, or other locality within which the relevant street address is found","address-level1":"The broadest administrative level in the address, i.e., the province within which the locality is found; for example, in the US, this would be the state; in Switzerland it would be the canton; in the UK, the post town","country":"Country code","country-name":"Country name","postal-code":"Postal code, post code, ZIP code, CEDEX code (if CEDEX, append \'CEDEX\', and the dissement, if relevant, to the address-level2 field)","cc-name":"Full name as given on the payment instrument","cc-given-name":"Given name as given on the payment instrument (in some Western cultures, also known as the first name)","cc-additional-name":"Additional names given on the payment instrument (in some Western cultures, also known as middle names, forenames other than the first name)","cc-family-name":"Family name given on the payment instrument (in some Western cultures, also known as the last name or surname)","cc-number":"Code identifying the payment instrument (e.g., the credit card number)","cc-exp":"Expiration date of the payment instrument","cc-exp-month":"Month component of the expiration date of the payment instrument","cc-exp-year":"Year component of the expiration date of the payment instrument","cc-csc":"Security code for the payment instrument (also known as the card security code (CSC), card validation code (CVC), card verification value (CVV), signature panel code (SPC), credit card ID (CCID), etc)","cc-type":"Type of payment instrument","transaction-currency":"The currency that the user would prefer the transaction to use","transaction-amount":"The amount that the user would like for the transaction (e.g., when entering a bid or sale price)","language":"Preferred language","bday":"Birthday","bday-day":"Day component of birthday","bday-month":"Month component of birthday","bday-year":"Year component of birthday","sex":"Gender identity (e.g., Female, Fa’afafine)","url":"Home page or other Web page corresponding to the company, person, address, or contact information in the other fields associated with this field","photo":"Photograph, icon, or other image corresponding to the company, person, address, or contact information in the other fields associated with this field","tel":"Full telephone number, including country code","tel-country-code":"Country code component of the telephone number","tel-national":"Telephone number without the county code component, with a country-internal prefix applied if applicable","tel-area-code":"Area code component of the telephone number, with a country-internal prefix applied if applicable","tel-local":"Telephone number without the country code and area code components","tel-local-prefix":"First part of the component of the telephone number that follows the area code, when that component is split into two components","tel-local-suffix":"Second part of the component of the telephone number that follows the area code, when that component is split into two components","tel-extension":"Telephone number internal extension code","email":"E-mail address","impp":"URL representing an instant messaging protocol endpoint (for example, \'aim:goim?screenname=example\' or \'xmpp:fred@example.net\')"}}')},643:e=>{e.exports=JSON.parse('{"matchByLabel":1,"matchByFieldType":0.3,"matchByInputType":0.3}')}},t={};!function n(a){var o=t[a];if(void 0!==o)return o.exports;var i=t[a]={exports:{}};return e[a].call(i.exports,i,i.exports,n),i.exports}(265)})();