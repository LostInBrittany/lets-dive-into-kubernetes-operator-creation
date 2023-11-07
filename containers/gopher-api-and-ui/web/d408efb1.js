/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=window,j=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,k=Symbol(),Z=new WeakMap;class J{constructor(t,e,i){if(this._$cssResult$=!0,i!==k)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(j&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Z.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Z.set(e,t))}return t}toString(){return this.cssText}}const xt=s=>new J(typeof s=="string"?s:s+"",void 0,k),K=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((i,n,o)=>i+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+s[o+1],s[0]);return new J(e,s,k)},Et=(s,t)=>{j?s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):t.forEach(e=>{const i=document.createElement("style"),n=H.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=e.cssText,s.appendChild(i)})},F=j?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return xt(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var M;const O=window,Q=O.trustedTypes,St=Q?Q.emptyScript:"",X=O.reactiveElementPolyfillSupport,L={toAttribute(s,t){switch(t){case Boolean:s=s?St:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch(i){e=null}}return e}},Y=(s,t)=>t!==s&&(t==t||s==s),z={attribute:!0,type:String,converter:L,reflect:!1,hasChanged:Y},D="finalized";class m extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),((e=this.h)!==null&&e!==void 0?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const n=this._$Ep(i,e);n!==void 0&&(this._$Ev.set(n,i),t.push(n))}),t}static createProperty(t,e=z){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i=typeof t=="symbol"?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,e);n!==void 0&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(n){const o=this[t];this[e]=n,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||z}static finalize(){if(this.hasOwnProperty(D))return!1;this[D]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,i=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const n of i)this.createProperty(n,e[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const n of i)e.unshift(F(n))}else t!==void 0&&e.push(F(t));return e}static _$Ep(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(e=>e(this))}addController(t){var e,i;((e=this._$ES)!==null&&e!==void 0?e:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((i=t.hostConnected)===null||i===void 0||i.call(t))}removeController(t){var e;(e=this._$ES)===null||e===void 0||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Et(e,this.constructor.elementStyles),e}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(e=>{var i;return(i=e.hostConnected)===null||i===void 0?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(e=>{var i;return(i=e.hostDisconnected)===null||i===void 0?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=z){var n;const o=this.constructor._$Ep(t,i);if(o!==void 0&&i.reflect===!0){const r=(((n=i.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?i.converter:L).toAttribute(e,i.type);this._$El=t,r==null?this.removeAttribute(o):this.setAttribute(o,r),this._$El=null}}_$AK(t,e){var i;const n=this.constructor,o=n._$Ev.get(t);if(o!==void 0&&this._$El!==o){const r=n.getPropertyOptions(o),h=typeof r.converter=="function"?{fromAttribute:r.converter}:((i=r.converter)===null||i===void 0?void 0:i.fromAttribute)!==void 0?r.converter:L;this._$El=o,this[o]=h.fromAttribute(e,r.type),this._$El=null}}requestUpdate(t,e,i){let n=!0;t!==void 0&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||Y)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,i))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((n,o)=>this[o]=n),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$ES)===null||t===void 0||t.forEach(n=>{var o;return(o=n.hostUpdate)===null||o===void 0?void 0:o.call(n)}),this.update(i)):this._$Ek()}catch(n){throw e=!1,this._$Ek(),n}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$ES)===null||e===void 0||e.forEach(i=>{var n;return(n=i.hostUpdated)===null||n===void 0?void 0:n.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((e,i)=>this._$EO(i,this[i],e)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}m[D]=!0,m.elementProperties=new Map,m.elementStyles=[],m.shadowRootOptions={mode:"open"},X==null||X({ReactiveElement:m}),((M=O.reactiveElementVersions)!==null&&M!==void 0?M:O.reactiveElementVersions=[]).push("1.6.3");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var B;const R=window,y=R.trustedTypes,tt=y?y.createPolicy("lit-html",{createHTML:s=>s}):void 0,I="$lit$",v="lit$".concat((Math.random()+"").slice(9),"$"),et="?"+v,Ct="<".concat(et,">"),g=document,x=()=>g.createComment(""),E=s=>s===null||typeof s!="object"&&typeof s!="function",it=Array.isArray,Ut=s=>it(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",V="[ 	\n\f\r]",S=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,nt=/-->/g,st=/>/g,f=RegExp(">|".concat(V,"(?:([^\\s\"'>=/]+)(").concat(V,"*=").concat(V,"*(?:[^ 	\n\f\r\"'`<>=]|(\"|')|))|$)"),"g"),rt=/'/g,ot=/"/g,lt=/^(?:script|style|textarea|title)$/i,Pt=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),N=Pt(1),A=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),at=new WeakMap,_=g.createTreeWalker(g,129,null,!1);function ht(s,t){if(!Array.isArray(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return tt!==void 0?tt.createHTML(t):t}const Ht=(s,t)=>{const e=s.length-1,i=[];let n,o=t===2?"<svg>":"",r=S;for(let h=0;h<e;h++){const l=s[h];let a,c,d=-1,u=0;for(;u<l.length&&(r.lastIndex=u,c=r.exec(l),c!==null);)u=r.lastIndex,r===S?c[1]==="!--"?r=nt:c[1]!==void 0?r=st:c[2]!==void 0?(lt.test(c[2])&&(n=RegExp("</"+c[2],"g")),r=f):c[3]!==void 0&&(r=f):r===f?c[0]===">"?(r=n!=null?n:S,d=-1):c[1]===void 0?d=-2:(d=r.lastIndex-c[2].length,a=c[1],r=c[3]===void 0?f:c[3]==='"'?ot:rt):r===ot||r===rt?r=f:r===nt||r===st?r=S:(r=f,n=void 0);const $=r===f&&s[h+1].startsWith("/>")?" ":"";o+=r===S?l+Ct:d>=0?(i.push(a),l.slice(0,d)+I+l.slice(d)+v+$):l+v+(d===-2?(i.push(void 0),h):$)}return[ht(s,o+(s[e]||"<?>")+(t===2?"</svg>":"")),i]};class C{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let o=0,r=0;const h=t.length-1,l=this.parts,[a,c]=Ht(t,e);if(this.el=C.createElement(a,i),_.currentNode=this.el.content,e===2){const d=this.el.content,u=d.firstChild;u.remove(),d.append(...u.childNodes)}for(;(n=_.nextNode())!==null&&l.length<h;){if(n.nodeType===1){if(n.hasAttributes()){const d=[];for(const u of n.getAttributeNames())if(u.endsWith(I)||u.startsWith(v)){const $=c[r++];if(d.push(u),$!==void 0){const bt=n.getAttribute($.toLowerCase()+I).split(v),P=/([.?@])?(.*)/.exec($);l.push({type:1,index:o,name:P[2],strings:bt,ctor:P[1]==="."?Rt:P[1]==="?"?Tt:P[1]==="@"?jt:T})}else l.push({type:6,index:o})}for(const u of d)n.removeAttribute(u)}if(lt.test(n.tagName)){const d=n.textContent.split(v),u=d.length-1;if(u>0){n.textContent=y?y.emptyScript:"";for(let $=0;$<u;$++)n.append(d[$],x()),_.nextNode(),l.push({type:2,index:++o});n.append(d[u],x())}}}else if(n.nodeType===8)if(n.data===et)l.push({type:2,index:o});else{let d=-1;for(;(d=n.data.indexOf(v,d+1))!==-1;)l.push({type:7,index:o}),d+=v.length-1}o++}}static createElement(t,e){const i=g.createElement("template");return i.innerHTML=t,i}}function w(s,t,e=s,i){var n,o,r,h;if(t===A)return t;let l=i!==void 0?(n=e._$Co)===null||n===void 0?void 0:n[i]:e._$Cl;const a=E(t)?void 0:t._$litDirective$;return(l==null?void 0:l.constructor)!==a&&((o=l==null?void 0:l._$AO)===null||o===void 0||o.call(l,!1),a===void 0?l=void 0:(l=new a(s),l._$AT(s,e,i)),i!==void 0?((r=(h=e)._$Co)!==null&&r!==void 0?r:h._$Co=[])[i]=l:e._$Cl=l),l!==void 0&&(t=w(s,l._$AS(s,t.values),l,i)),t}class Ot{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:n}=this._$AD,o=((e=t==null?void 0:t.creationScope)!==null&&e!==void 0?e:g).importNode(i,!0);_.currentNode=o;let r=_.nextNode(),h=0,l=0,a=n[0];for(;a!==void 0;){if(h===a.index){let c;a.type===2?c=new U(r,r.nextSibling,this,t):a.type===1?c=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(c=new kt(r,this,t)),this._$AV.push(c),a=n[++l]}h!==(a==null?void 0:a.index)&&(r=_.nextNode(),h++)}return _.currentNode=g,o}v(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class U{constructor(t,e,i,n){var o;this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cp=(o=n==null?void 0:n.isConnected)===null||o===void 0||o}get _$AU(){var t,e;return(e=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&e!==void 0?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=w(this,t,e),E(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==A&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):Ut(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==p&&E(this._$AH)?this._$AA.nextSibling.data=t:this.$(g.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:n}=t,o=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=C.createElement(ht(n.h,n.h[0]),this.options)),n);if(((e=this._$AH)===null||e===void 0?void 0:e._$AD)===o)this._$AH.v(i);else{const r=new Ot(o,this),h=r.u(this.options);r.v(i),this.$(h),this._$AH=r}}_$AC(t){let e=at.get(t.strings);return e===void 0&&at.set(t.strings,e=new C(t)),e}T(t){it(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const o of t)n===e.length?e.push(i=new U(this.k(x()),this.k(x()),this,this.options)):i=e[n],i._$AI(o),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)===null||i===void 0||i.call(this,!1,!0,e);t&&t!==this._$AB;){const n=t.nextSibling;t.remove(),t=n}}setConnected(t){var e;this._$AM===void 0&&(this._$Cp=t,(e=this._$AP)===null||e===void 0||e.call(this,t))}}class T{constructor(t,e,i,n,o){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=p}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,n){const o=this.strings;let r=!1;if(o===void 0)t=w(this,t,e,0),r=!E(t)||t!==this._$AH&&t!==A,r&&(this._$AH=t);else{const h=t;let l,a;for(t=o[0],l=0;l<o.length-1;l++)a=w(this,h[i+l],e,l),a===A&&(a=this._$AH[l]),r||(r=!E(a)||a!==this._$AH[l]),a===p?t=p:t!==p&&(t+=(a!=null?a:"")+o[l+1]),this._$AH[l]=a}r&&!n&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}}class Rt extends T{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}}const Nt=y?y.emptyScript:"";class Tt extends T{constructor(){super(...arguments),this.type=4}j(t){t&&t!==p?this.element.setAttribute(this.name,Nt):this.element.removeAttribute(this.name)}}class jt extends T{constructor(t,e,i,n,o){super(t,e,i,n,o),this.type=5}_$AI(t,e=this){var i;if((t=(i=w(this,t,e,0))!==null&&i!==void 0?i:p)===A)return;const n=this._$AH,o=t===p&&n!==p||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==p&&(n===p||o);o&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;typeof this._$AH=="function"?this._$AH.call((i=(e=this.options)===null||e===void 0?void 0:e.host)!==null&&i!==void 0?i:this.element,t):this._$AH.handleEvent(t)}}class kt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){w(this,t)}}const ct=R.litHtmlPolyfillSupport;ct==null||ct(C,U),((B=R.litHtmlVersions)!==null&&B!==void 0?B:R.litHtmlVersions=[]).push("2.8.0");const dt=(s,t,e)=>{var i,n;const o=(i=e==null?void 0:e.renderBefore)!==null&&i!==void 0?i:t;let r=o._$litPart$;if(r===void 0){const h=(n=e==null?void 0:e.renderBefore)!==null&&n!==void 0?n:null;o._$litPart$=r=new U(t.insertBefore(x(),h),h,void 0,e!=null?e:{})}return r._$AI(s),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var W,q;class b extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return(t=(e=this.renderOptions).renderBefore)!==null&&t!==void 0||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=dt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return A}}b.finalized=!0,b._$litElement$=!0,(W=globalThis.litElementHydrateSupport)===null||W===void 0||W.call(globalThis,{LitElement:b});const pt=globalThis.litElementPolyfillSupport;pt==null||pt({LitElement:b}),((q=globalThis.litElementVersions)!==null&&q!==void 0?q:globalThis.litElementVersions=[]).push("3.3.3");var ut=Object.freeze,Mt=Object.defineProperty,G=(s,t)=>ut(Mt(s,"raw",{value:ut(t||s.slice())})),$t,vt,gt;const Lt="http://localhost:8080",zt=new URL(new URL("0d203be8.png",import.meta.url).href,import.meta.url).href;function Dt(s){return new Promise(t=>setTimeout(t,s))}class Bt extends b{static get styles(){return K($t||($t=G(["\n      :host {\n        display: flex;\n        flex-flow: column nowrap;\n        justify-content: begin;\n        align-items: center;\n        padding: 25px;\n        max-width: 1280px;\n\n        margin: 0 auto;\n        color: var(--gophers-api-watcher-text-color, #000);\n      }\n      .title {\n        font-family: sans-serif;\n        color: #404040;\n        max-width:100%;\n      }\n      .title img {\n        max-width:100%;\n      }\n      .gophers-gallery {\n        display: flex;\n        flex-flow: row wrap;\n        justify-content: space-around;\n        align-content: begin;\n      }\n\n\n    "])))}static get properties(){return{api:{type:String},gophers:{type:Array}}}constructor(){super()}connectedCallback(){super.connectedCallback(),this.api=this.api||Lt,this._getData()}render(){return N(gt||(gt=G(['\n      <h1 class="title"><img src=',' alt="Gopher API Watcher"></h1>\n      <div class="gophers-gallery">\n        ',"\n      </div>\n    "])),zt,this.gophers?this.gophers.map(t=>N(vt||(vt=G(["\n            <gophers-api-watcher-gopher\n              name=","\n              url=","\n            ></gophers-api-watcher-gopher>"])),t.displayname,t.url)):"")}async _getData(){try{const t=await fetch("".concat(this.api,"/gophers"));this.gophers=await t.json(),await Dt(5e3),this._getData()}catch(t){console.log("fetch failed",t)}}}var ft=Object.freeze,It=Object.defineProperty,_t=(s,t)=>ft(It(s,"raw",{value:ft(t||s.slice())})),mt,yt;const Vt=new URL(new URL("c35801e7.png",import.meta.url).href,import.meta.url).href,Wt=new URL(new URL("eb812375.png",import.meta.url).href,import.meta.url).href;class qt extends b{static get styles(){return K(mt||(mt=_t(["\n      :host {\n        display: block;\n        width: 250px;\n        height: 400px;\n        color: var(--gophers-api-watcher-text-color, #000);\n        border: 1px solid #404040;\n        margin: 10px;\n        padding-top: 0;\n        padding-left: 5px;\n        padding-right: 5px;\n        border-radius: 5px;\n        background-color: #ffe415;\n      }\n      .gopher {\n        width: 100%;\n        height: 100%;\n        display: flex;\n        flex-flow: column nowrap;\n        justify-content: space-between;\n        align-items: center;\n      }\n      .gopher .header {\n        width: 100%;\n        display: flex;\n        flex-flow: row nowrap;\n        justify-content: center;\n        align-items: center;\n      }\n\n      .header .title {\n        width: calc(100% - 10px);\n      }\n\n      .title img {\n        width: 100%;\n      }\n\n      .gopher .name {\n        font-family: sans-serif;\n        font-size: 16pt;\n        width: 100%;\n        display: flex;\n        flex-flow: row nowrap;\n        justify-content: center;\n        align-items: center;\n      }\n\n      .gopher .image {\n        width: calc(100% - 20px);\n        height: calc(100% - 60px);\n        display: flex;\n        flex-flow: column nowrap;\n        justify-content: space-around;\n        align-items: center;\n        background-color: white;\n        margin-left: 10px;\n        margin-right: 10px;\n        border: solid 1px #404040;\n        border-radius: 4px;\n      }\n\n      .gopher .image img {\n        max-width:calc(100% - 20px);\n        max-height:calc(100% - 20px);\n      }\n\n      .watcher img {\n        width: 50px;\n      }\n\n      .gopher .footer {\n        height: 50px;\n        width: 100%;\n        display:flex;\n        flex-flow: row;\n        justify-content: begin;\n        align-items: center;\n      }\n\n      .name .tag {\n        margin: 3px;\n        padding-left: 5px;\n        padding-right: 5px;\n        padding-top: 5px;\n        padding-bottom: 5px;\n        border: solid 1px #404040;\n        border-radius: 4px;\n        background-color: white;\n        width: calc(100% - 30px);\n        display:flex;\n        flex-flow: row;\n        justify-content: center;\n        align-items: center;\n      }\n    "])))}static get properties(){return{name:{type:String},url:{type:String}}}constructor(){super()}render(){return N(yt||(yt=_t(['\n      <div class="gopher">\n        <div class="header">\n          <div class="title"> <img src=',' /> </div>\n        </div>\n        <div class="image">\n          <img src='," alt=",' />\n        </div>\n        <div class="name"> \n          <div class="tag"> ',' </div>\n        </div>\n        <div class="footer">\n          <div class="watcher"> <img src='," /> </div>\n        </div>\n      </div>\n    "])),Vt,this.url,this.name,this.name,Wt)}}window.customElements.define("gophers-api-watcher",Bt),window.customElements.define("gophers-api-watcher-gopher",qt);var At=Object.freeze,Gt=Object.defineProperty,Zt=(s,t)=>At(Gt(s,"raw",{value:At(t||s.slice())})),wt;const Jt="http://localhost:8080";dt(N(wt||(wt=Zt(["\n        <gophers-api-watcher .api=","></gophers-api-watcher>\n      "])),Jt),document.querySelector("#container"));