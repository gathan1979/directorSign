/*! @license DOMPurify 3.0.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.0.0/LICENSE */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).DOMPurify=t()}(this,(function(){"use strict";function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,n){return t=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},t(e,n)}function n(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function r(e,o,a){return r=n()?Reflect.construct:function(e,n,r){var o=[null];o.push.apply(o,n);var a=new(Function.bind.apply(e,o));return r&&t(a,r.prototype),a},r.apply(null,arguments)}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==n)return;var r,o,a=[],i=!0,l=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(a.push(r.value),!t||a.length!==t);i=!0);}catch(e){l=!0,o=e}finally{try{i||null==n.return||n.return()}finally{if(l)throw o}}return a}(e,t)||i(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(e){return function(e){if(Array.isArray(e))return l(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||i(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(e,t){if(e){if("string"==typeof e)return l(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(e,t):void 0}}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var c=Object.entries,u=Object.setPrototypeOf,s=Object.isFrozen,f=Object.getPrototypeOf,m=Object.getOwnPropertyDescriptor,p=Object.freeze,d=Object.seal,h=Object.create,y="undefined"!=typeof Reflect&&Reflect,g=y.apply,b=y.construct;g||(g=function(e,t,n){return e.apply(t,n)}),p||(p=function(e){return e}),d||(d=function(e){return e}),b||(b=function(e,t){return r(e,a(t))});var v,T=R(Array.prototype.forEach),N=R(Array.prototype.pop),A=R(Array.prototype.push),E=R(String.prototype.toLowerCase),w=R(String.prototype.toString),S=R(String.prototype.match),x=R(String.prototype.replace),_=R(String.prototype.indexOf),k=R(String.prototype.trim),D=R(RegExp.prototype.test),O=(v=TypeError,function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return b(v,t)});function R(e){return function(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];return g(e,t,r)}}function C(e,t,n){n=n||E,u&&u(e,null);for(var r=t.length;r--;){var o=t[r];if("string"==typeof o){var a=n(o);a!==o&&(s(t)||(t[r]=a),o=a)}e[o]=!0}return e}function L(e){var t,n=h(null),r=function(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=i(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,o=function(){};return{s:o,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,l=!0,c=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return l=e.done,e},e:function(e){c=!0,a=e},f:function(){try{l||null==n.return||n.return()}finally{if(c)throw a}}}}(c(e));try{for(r.s();!(t=r.n()).done;){var a=o(t.value,2),l=a[0],u=a[1];n[l]=u}}catch(e){r.e(e)}finally{r.f()}return n}function M(e,t){for(;null!==e;){var n=m(e,t);if(n){if(n.get)return R(n.get);if("function"==typeof n.value)return R(n.value)}e=f(e)}return function(e){return console.warn("fallback value for",e),null}}var I=p(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),U=p(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),F=p(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),z=p(["animate","color-profile","cursor","discard","fedropshadow","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),H=p(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),j=p(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),P=p(["#text"]),B=p(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns","slot"]),G=p(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),W=p(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),q=p(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),Y=d(/\{\{[\w\W]*|[\w\W]*\}\}/gm),$=d(/<%[\w\W]*|[\w\W]*%>/gm),K=d(/\${[\w\W]*}/gm),V=d(/^data-[\-\w.\u00B7-\uFFFF]/),X=d(/^aria-[\-\w]+$/),Z=d(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),J=d(/^(?:\w+script|data):/i),Q=d(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),ee=d(/^html$/i),te=function(){return"undefined"==typeof window?null:window},ne=function(t,n){if("object"!==e(t)||"function"!=typeof t.createPolicy)return null;var r=null,o="data-tt-policy-suffix";n.currentScript&&n.currentScript.hasAttribute(o)&&(r=n.currentScript.getAttribute(o));var a="dompurify"+(r?"#"+r:"");try{return t.createPolicy(a,{createHTML:function(e){return e},createScriptURL:function(e){return e}})}catch(e){return console.warn("TrustedTypes policy "+a+" could not be created."),null}};var re=function t(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:te(),r=function(e){return t(e)};if(r.version="3.0.0",r.removed=[],!n||!n.document||9!==n.document.nodeType)return r.isSupported=!1,r;var o=n.document,i=n.document,l=n.DocumentFragment,u=n.HTMLTemplateElement,s=n.Node,f=n.Element,m=n.NodeFilter,d=n.NamedNodeMap,h=void 0===d?n.NamedNodeMap||n.MozNamedAttrMap:d,y=n.HTMLFormElement,g=n.DOMParser,b=n.trustedTypes,v=f.prototype,R=M(v,"cloneNode"),re=M(v,"nextSibling"),oe=M(v,"childNodes"),ae=M(v,"parentNode");if("function"==typeof u){var ie=i.createElement("template");ie.content&&ie.content.ownerDocument&&(i=ie.content.ownerDocument)}var le=ne(b,o),ce=le?le.createHTML(""):"",ue=i,se=ue.implementation,fe=ue.createNodeIterator,me=ue.createDocumentFragment,pe=ue.getElementsByTagName,de=o.importNode,he={};r.isSupported="function"==typeof c&&"function"==typeof ae&&se&&void 0!==se.createHTMLDocument;var ye,ge,be=Y,ve=$,Te=K,Ne=V,Ae=X,Ee=J,we=Q,Se=Z,xe=null,_e=C({},[].concat(a(I),a(U),a(F),a(H),a(P))),ke=null,De=C({},[].concat(a(B),a(G),a(W),a(q))),Oe=Object.seal(Object.create(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Re=null,Ce=null,Le=!0,Me=!0,Ie=!1,Ue=!1,Fe=!1,ze=!1,He=!1,je=!1,Pe=!1,Be=!1,Ge=!0,We=!1,qe="user-content-",Ye=!0,$e=!1,Ke={},Ve=null,Xe=C({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),Ze=null,Je=C({},["audio","video","img","source","image","track"]),Qe=null,et=C({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),tt="http://www.w3.org/1998/Math/MathML",nt="http://www.w3.org/2000/svg",rt="http://www.w3.org/1999/xhtml",ot=rt,at=!1,it=null,lt=C({},[tt,nt,rt],w),ct=["application/xhtml+xml","text/html"],ut="text/html",st=null,ft=i.createElement("form"),mt=function(e){return e instanceof RegExp||e instanceof Function},pt=function(t){st&&st===t||(t&&"object"===e(t)||(t={}),t=L(t),ye=ye=-1===ct.indexOf(t.PARSER_MEDIA_TYPE)?ut:t.PARSER_MEDIA_TYPE,ge="application/xhtml+xml"===ye?w:E,xe="ALLOWED_TAGS"in t?C({},t.ALLOWED_TAGS,ge):_e,ke="ALLOWED_ATTR"in t?C({},t.ALLOWED_ATTR,ge):De,it="ALLOWED_NAMESPACES"in t?C({},t.ALLOWED_NAMESPACES,w):lt,Qe="ADD_URI_SAFE_ATTR"in t?C(L(et),t.ADD_URI_SAFE_ATTR,ge):et,Ze="ADD_DATA_URI_TAGS"in t?C(L(Je),t.ADD_DATA_URI_TAGS,ge):Je,Ve="FORBID_CONTENTS"in t?C({},t.FORBID_CONTENTS,ge):Xe,Re="FORBID_TAGS"in t?C({},t.FORBID_TAGS,ge):{},Ce="FORBID_ATTR"in t?C({},t.FORBID_ATTR,ge):{},Ke="USE_PROFILES"in t&&t.USE_PROFILES,Le=!1!==t.ALLOW_ARIA_ATTR,Me=!1!==t.ALLOW_DATA_ATTR,Ie=t.ALLOW_UNKNOWN_PROTOCOLS||!1,Ue=t.SAFE_FOR_TEMPLATES||!1,Fe=t.WHOLE_DOCUMENT||!1,je=t.RETURN_DOM||!1,Pe=t.RETURN_DOM_FRAGMENT||!1,Be=t.RETURN_TRUSTED_TYPE||!1,He=t.FORCE_BODY||!1,Ge=!1!==t.SANITIZE_DOM,We=t.SANITIZE_NAMED_PROPS||!1,Ye=!1!==t.KEEP_CONTENT,$e=t.IN_PLACE||!1,Se=t.ALLOWED_URI_REGEXP||Se,ot=t.NAMESPACE||rt,t.CUSTOM_ELEMENT_HANDLING&&mt(t.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(Oe.tagNameCheck=t.CUSTOM_ELEMENT_HANDLING.tagNameCheck),t.CUSTOM_ELEMENT_HANDLING&&mt(t.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(Oe.attributeNameCheck=t.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),t.CUSTOM_ELEMENT_HANDLING&&"boolean"==typeof t.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements&&(Oe.allowCustomizedBuiltInElements=t.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Ue&&(Me=!1),Pe&&(je=!0),Ke&&(xe=C({},a(P)),ke=[],!0===Ke.html&&(C(xe,I),C(ke,B)),!0===Ke.svg&&(C(xe,U),C(ke,G),C(ke,q)),!0===Ke.svgFilters&&(C(xe,F),C(ke,G),C(ke,q)),!0===Ke.mathMl&&(C(xe,H),C(ke,W),C(ke,q))),t.ADD_TAGS&&(xe===_e&&(xe=L(xe)),C(xe,t.ADD_TAGS,ge)),t.ADD_ATTR&&(ke===De&&(ke=L(ke)),C(ke,t.ADD_ATTR,ge)),t.ADD_URI_SAFE_ATTR&&C(Qe,t.ADD_URI_SAFE_ATTR,ge),t.FORBID_CONTENTS&&(Ve===Xe&&(Ve=L(Ve)),C(Ve,t.FORBID_CONTENTS,ge)),Ye&&(xe["#text"]=!0),Fe&&C(xe,["html","head","body"]),xe.table&&(C(xe,["tbody"]),delete Re.tbody),p&&p(t),st=t)},dt=C({},["mi","mo","mn","ms","mtext"]),ht=C({},["foreignobject","desc","title","annotation-xml"]),yt=C({},["title","style","font","a","script"]),gt=C({},U);C(gt,F),C(gt,z);var bt=C({},H);C(bt,j);var vt=function(e){var t=ae(e);t&&t.tagName||(t={namespaceURI:ot,tagName:"template"});var n=E(e.tagName),r=E(t.tagName);return!!it[e.namespaceURI]&&(e.namespaceURI===nt?t.namespaceURI===rt?"svg"===n:t.namespaceURI===tt?"svg"===n&&("annotation-xml"===r||dt[r]):Boolean(gt[n]):e.namespaceURI===tt?t.namespaceURI===rt?"math"===n:t.namespaceURI===nt?"math"===n&&ht[r]:Boolean(bt[n]):e.namespaceURI===rt?!(t.namespaceURI===nt&&!ht[r])&&(!(t.namespaceURI===tt&&!dt[r])&&(!bt[n]&&(yt[n]||!gt[n]))):!("application/xhtml+xml"!==ye||!it[e.namespaceURI]))},Tt=function(e){A(r.removed,{element:e});try{e.parentNode.removeChild(e)}catch(t){e.remove()}},Nt=function(e,t){try{A(r.removed,{attribute:t.getAttributeNode(e),from:t})}catch(e){A(r.removed,{attribute:null,from:t})}if(t.removeAttribute(e),"is"===e&&!ke[e])if(je||Pe)try{Tt(t)}catch(e){}else try{t.setAttribute(e,"")}catch(e){}},At=function(e){var t,n;if(He)e="<remove></remove>"+e;else{var r=S(e,/^[\r\n\t ]+/);n=r&&r[0]}"application/xhtml+xml"===ye&&ot===rt&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");var o=le?le.createHTML(e):e;if(ot===rt)try{t=(new g).parseFromString(o,ye)}catch(e){}if(!t||!t.documentElement){t=se.createDocument(ot,"template",null);try{t.documentElement.innerHTML=at?ce:o}catch(e){}}var a=t.body||t.documentElement;return e&&n&&a.insertBefore(i.createTextNode(n),a.childNodes[0]||null),ot===rt?pe.call(t,Fe?"html":"body")[0]:Fe?t.documentElement:a},Et=function(e){return fe.call(e.ownerDocument||e,e,m.SHOW_ELEMENT|m.SHOW_COMMENT|m.SHOW_TEXT,null,!1)},wt=function(e){return e instanceof y&&("string"!=typeof e.nodeName||"string"!=typeof e.textContent||"function"!=typeof e.removeChild||!(e.attributes instanceof h)||"function"!=typeof e.removeAttribute||"function"!=typeof e.setAttribute||"string"!=typeof e.namespaceURI||"function"!=typeof e.insertBefore||"function"!=typeof e.hasChildNodes)},St=function(t){return"object"===e(s)?t instanceof s:t&&"object"===e(t)&&"number"==typeof t.nodeType&&"string"==typeof t.nodeName},xt=function(e,t,n){he[e]&&T(he[e],(function(e){e.call(r,t,n,st)}))},_t=function(e){var t;if(xt("beforeSanitizeElements",e,null),wt(e))return Tt(e),!0;var n=ge(e.nodeName);if(xt("uponSanitizeElement",e,{tagName:n,allowedTags:xe}),e.hasChildNodes()&&!St(e.firstElementChild)&&(!St(e.content)||!St(e.content.firstElementChild))&&D(/<[/\w]/g,e.innerHTML)&&D(/<[/\w]/g,e.textContent))return Tt(e),!0;if(!xe[n]||Re[n]){if(!Re[n]&&Dt(n)){if(Oe.tagNameCheck instanceof RegExp&&D(Oe.tagNameCheck,n))return!1;if(Oe.tagNameCheck instanceof Function&&Oe.tagNameCheck(n))return!1}if(Ye&&!Ve[n]){var o=ae(e)||e.parentNode,a=oe(e)||e.childNodes;if(a&&o)for(var i=a.length-1;i>=0;--i)o.insertBefore(R(a[i],!0),re(e))}return Tt(e),!0}return e instanceof f&&!vt(e)?(Tt(e),!0):"noscript"!==n&&"noembed"!==n||!D(/<\/no(script|embed)/i,e.innerHTML)?(Ue&&3===e.nodeType&&(t=e.textContent,t=x(t,be," "),t=x(t,ve," "),t=x(t,Te," "),e.textContent!==t&&(A(r.removed,{element:e.cloneNode()}),e.textContent=t)),xt("afterSanitizeElements",e,null),!1):(Tt(e),!0)},kt=function(e,t,n){if(Ge&&("id"===t||"name"===t)&&(n in i||n in ft))return!1;if(Me&&!Ce[t]&&D(Ne,t));else if(Le&&D(Ae,t));else if(!ke[t]||Ce[t]){if(!(Dt(e)&&(Oe.tagNameCheck instanceof RegExp&&D(Oe.tagNameCheck,e)||Oe.tagNameCheck instanceof Function&&Oe.tagNameCheck(e))&&(Oe.attributeNameCheck instanceof RegExp&&D(Oe.attributeNameCheck,t)||Oe.attributeNameCheck instanceof Function&&Oe.attributeNameCheck(t))||"is"===t&&Oe.allowCustomizedBuiltInElements&&(Oe.tagNameCheck instanceof RegExp&&D(Oe.tagNameCheck,n)||Oe.tagNameCheck instanceof Function&&Oe.tagNameCheck(n))))return!1}else if(Qe[t]);else if(D(Se,x(n,we,"")));else if("src"!==t&&"xlink:href"!==t&&"href"!==t||"script"===e||0!==_(n,"data:")||!Ze[e]){if(Ie&&!D(Ee,x(n,we,"")));else if(n)return!1}else;return!0},Dt=function(e){return e.indexOf("-")>0},Ot=function(t){var n,o,a,i;xt("beforeSanitizeAttributes",t,null);var l=t.attributes;if(l){var c={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:ke};for(i=l.length;i--;){var u=n=l[i],s=u.name,f=u.namespaceURI;if(o="value"===s?n.value:k(n.value),a=ge(s),c.attrName=a,c.attrValue=o,c.keepAttr=!0,c.forceKeepAttr=void 0,xt("uponSanitizeAttribute",t,c),o=c.attrValue,!c.forceKeepAttr&&(Nt(s,t),c.keepAttr))if(D(/\/>/i,o))Nt(s,t);else{Ue&&(o=x(o,be," "),o=x(o,ve," "),o=x(o,Te," "));var m=ge(t.nodeName);if(kt(m,a,o)){if(!We||"id"!==a&&"name"!==a||(Nt(s,t),o=qe+o),le&&"object"===e(b)&&"function"==typeof b.getAttributeType)if(f);else switch(b.getAttributeType(m,a)){case"TrustedHTML":o=le.createHTML(o);break;case"TrustedScriptURL":o=le.createScriptURL(o)}try{f?t.setAttributeNS(f,s,o):t.setAttribute(s,o),N(r.removed)}catch(e){}}}}xt("afterSanitizeAttributes",t,null)}},Rt=function e(t){var n,r=Et(t);for(xt("beforeSanitizeShadowDOM",t,null);n=r.nextNode();)xt("uponSanitizeShadowNode",n,null),_t(n)||(n.content instanceof l&&e(n.content),Ot(n));xt("afterSanitizeShadowDOM",t,null)};return r.sanitize=function(e){var t,n,a,i,c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if((at=!e)&&(e="\x3c!--\x3e"),"string"!=typeof e&&!St(e)){if("function"!=typeof e.toString)throw O("toString is not a function");if("string"!=typeof(e=e.toString()))throw O("dirty is not a string, aborting")}if(!r.isSupported)return e;if(ze||pt(c),r.removed=[],"string"==typeof e&&($e=!1),$e){if(e.nodeName){var u=ge(e.nodeName);if(!xe[u]||Re[u])throw O("root node is forbidden and cannot be sanitized in-place")}}else if(e instanceof s)1===(n=(t=At("\x3c!----\x3e")).ownerDocument.importNode(e,!0)).nodeType&&"BODY"===n.nodeName||"HTML"===n.nodeName?t=n:t.appendChild(n);else{if(!je&&!Ue&&!Fe&&-1===e.indexOf("<"))return le&&Be?le.createHTML(e):e;if(!(t=At(e)))return je?null:Be?ce:""}t&&He&&Tt(t.firstChild);for(var f=Et($e?e:t);a=f.nextNode();)_t(a)||(a.content instanceof l&&Rt(a.content),Ot(a));if($e)return e;if(je){if(Pe)for(i=me.call(t.ownerDocument);t.firstChild;)i.appendChild(t.firstChild);else i=t;return ke.shadowroot&&(i=de.call(o,i,!0)),i}var m=Fe?t.outerHTML:t.innerHTML;return Fe&&xe["!doctype"]&&t.ownerDocument&&t.ownerDocument.doctype&&t.ownerDocument.doctype.name&&D(ee,t.ownerDocument.doctype.name)&&(m="<!DOCTYPE "+t.ownerDocument.doctype.name+">\n"+m),Ue&&(m=x(m,be," "),m=x(m,ve," "),m=x(m,Te," ")),le&&Be?le.createHTML(m):m},r.setConfig=function(e){pt(e),ze=!0},r.clearConfig=function(){st=null,ze=!1},r.isValidAttribute=function(e,t,n){st||pt({});var r=ge(e),o=ge(t);return kt(r,o,n)},r.addHook=function(e,t){"function"==typeof t&&(he[e]=he[e]||[],A(he[e],t))},r.removeHook=function(e){if(he[e])return N(he[e])},r.removeHooks=function(e){he[e]&&(he[e]=[])},r.removeAllHooks=function(){he={}},r}();return re}));
//# sourceMappingURL=purify.min.js.map