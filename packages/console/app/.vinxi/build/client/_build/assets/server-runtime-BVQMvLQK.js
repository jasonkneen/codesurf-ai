import { T as createResource, U as catchError, s as sharedConfig, u as untrack } from './web-B4FMlVCr.js';

/**
 * This is mock of the eventual Solid 2.0 primitive. It is not fully featured.
 */
function createAsync(fn, options) {
  let resource;
  let prev = () => !resource || resource.state === "unresolved" ? undefined : resource.latest;
  [resource] = createResource(() => subFetch(fn, catchError(() => untrack(prev), () => undefined)), v => v);
  const resultAccessor = () => resource();
  Object.defineProperty(resultAccessor, "latest", {
    get() {
      return resource.latest;
    }
  });
  return resultAccessor;
}
// mock promise while hydrating to prevent fetching
class MockPromise {
  static all() {
    return new MockPromise();
  }
  static allSettled() {
    return new MockPromise();
  }
  static any() {
    return new MockPromise();
  }
  static race() {
    return new MockPromise();
  }
  static reject() {
    return new MockPromise();
  }
  static resolve() {
    return new MockPromise();
  }
  catch() {
    return new MockPromise();
  }
  then() {
    return new MockPromise();
  }
  finally() {
    return new MockPromise();
  }
}
function subFetch(fn, prev) {
  if (!sharedConfig.context) return fn(prev);
  const ogFetch = fetch;
  const ogPromise = Promise;
  try {
    window.fetch = () => new MockPromise();
    Promise = MockPromise;
    return fn(prev);
  } finally {
    window.fetch = ogFetch;
    Promise = ogPromise;
  }
}

var R=(a=>(a[a.AggregateError=1]="AggregateError",a[a.ArrowFunction=2]="ArrowFunction",a[a.ErrorPrototypeStack=4]="ErrorPrototypeStack",a[a.ObjectAssign=8]="ObjectAssign",a[a.BigIntTypedArray=16]="BigIntTypedArray",a))(R||{});function Nr(o){switch(o){case '"':return '\\"';case "\\":return "\\\\";case `
`:return "\\n";case "\r":return "\\r";case "\b":return "\\b";case "	":return "\\t";case "\f":return "\\f";case "<":return "\\x3C";case "\u2028":return "\\u2028";case "\u2029":return "\\u2029";default:return}}function d(o){let e="",r=0,t;for(let n=0,a=o.length;n<a;n++)t=Nr(o[n]),t&&(e+=o.slice(r,n)+t,r=n+1);return r===0?e=o:e+=o.slice(r),e}var O="__SEROVAL_REFS__";function f$1(o,e){if(!o)throw e}var Be=new Map,C=new Map;function je(o){return Be.has(o)}function Ke(o){return f$1(je(o),new ie$1(o)),Be.get(o)}typeof globalThis!="undefined"?Object.defineProperty(globalThis,O,{value:C,configurable:true,writable:false,enumerable:false}):typeof window!="undefined"?Object.defineProperty(window,O,{value:C,configurable:true,writable:false,enumerable:false}):typeof self!="undefined"?Object.defineProperty(self,O,{value:C,configurable:true,writable:false,enumerable:false}):typeof global!="undefined"&&Object.defineProperty(global,O,{value:C,configurable:true,writable:false,enumerable:false});function Hr(o){return o}function Ye(o,e){for(let r=0,t=e.length;r<t;r++){let n=e[r];o.has(n)||(o.add(n),n.extends&&Ye(o,n.extends));}}function m$1(o){if(o){let e=new Set;return Ye(e,o),[...e]}}var ce={[Symbol.asyncIterator]:0,[Symbol.hasInstance]:1,[Symbol.isConcatSpreadable]:2,[Symbol.iterator]:3,[Symbol.match]:4,[Symbol.matchAll]:5,[Symbol.replace]:6,[Symbol.search]:7,[Symbol.species]:8,[Symbol.split]:9,[Symbol.toPrimitive]:10,[Symbol.toStringTag]:11,[Symbol.unscopables]:12};var ue$1={0:"Error",1:"EvalError",2:"RangeError",3:"ReferenceError",4:"SyntaxError",5:"TypeError",6:"URIError"},s=void 0;function u$1(o,e,r,t,n,a,i,l,c,p,h,X){return {t:o,i:e,s:r,l:t,c:n,m:a,p:i,e:l,a:c,f:p,b:h,o:X}}function x(o){return u$1(2,s,o,s,s,s,s,s,s,s,s,s)}var I=x(2),A=x(3),pe$1=x(1),de=x(0),Xe=x(4),Qe=x(5),er=x(6),rr=x(7);function me$1(o){return o instanceof EvalError?1:o instanceof RangeError?2:o instanceof ReferenceError?3:o instanceof SyntaxError?4:o instanceof TypeError?5:o instanceof URIError?6:0}function wr(o){let e=ue$1[me$1(o)];return o.name!==e?{name:o.name}:o.constructor.name!==e?{name:o.constructor.name}:{}}function j$1(o,e){let r=wr(o),t=Object.getOwnPropertyNames(o);for(let n=0,a=t.length,i;n<a;n++)i=t[n],i!=="name"&&i!=="message"&&(i==="stack"?e&4&&(r=r||{},r[i]=o[i]):(r=r||{},r[i]=o[i]));return r}function fe$1(o){return Object.isFrozen(o)?3:Object.isSealed(o)?2:Object.isExtensible(o)?0:1}function ge(o){switch(o){case Number.POSITIVE_INFINITY:return Qe;case Number.NEGATIVE_INFINITY:return er}return o!==o?rr:Object.is(o,-0)?Xe:u$1(0,s,o,s,s,s,s,s,s,s,s,s)}function w(o){return u$1(1,s,d(o),s,s,s,s,s,s,s,s,s)}function Se(o){return u$1(3,s,""+o,s,s,s,s,s,s,s,s,s)}function sr(o){return u$1(4,o,s,s,s,s,s,s,s,s,s,s)}function he(o,e){let r=e.valueOf();return u$1(5,o,r!==r?"":e.toISOString(),s,s,s,s,s,s,s,s,s)}function ye(o,e){return u$1(6,o,s,s,d(e.source),e.flags,s,s,s,s,s,s)}function ve(o,e){let r=new Uint8Array(e),t=r.length,n=new Array(t);for(let a=0;a<t;a++)n[a]=r[a];return u$1(19,o,n,s,s,s,s,s,s,s,s,s)}function or(o,e){return u$1(17,o,ce[e],s,s,s,s,s,s,s,s,s)}function nr(o,e){return u$1(18,o,d(Ke(e)),s,s,s,s,s,s,s,s,s)}function _$1(o,e,r){return u$1(25,o,r,s,d(e),s,s,s,s,s,s,s)}function Ne(o,e,r){return u$1(9,o,s,e.length,s,s,s,s,r,s,s,fe$1(e))}function be(o,e){return u$1(21,o,s,s,s,s,s,s,s,e,s,s)}function xe(o,e,r){return u$1(15,o,s,e.length,e.constructor.name,s,s,s,s,r,e.byteOffset,s)}function Ie(o,e,r){return u$1(16,o,s,e.length,e.constructor.name,s,s,s,s,r,e.byteOffset,s)}function Ae(o,e,r){return u$1(20,o,s,e.byteLength,s,s,s,s,s,r,e.byteOffset,s)}function we(o,e,r){return u$1(13,o,me$1(e),s,s,d(e.message),r,s,s,s,s,s)}function Ee(o,e,r){return u$1(14,o,me$1(e),s,s,d(e.message),r,s,s,s,s,s)}function Pe(o,e,r){return u$1(7,o,s,e,s,s,s,s,r,s,s,s)}function M(o,e){return u$1(28,s,s,s,s,s,s,s,[o,e],s,s,s)}function U(o,e){return u$1(30,s,s,s,s,s,s,s,[o,e],s,s,s)}function L(o,e,r){return u$1(31,o,s,s,s,s,s,s,r,e,s,s)}function Re(o,e){return u$1(32,o,s,s,s,s,s,s,s,e,s,s)}function Oe(o,e){return u$1(33,o,s,s,s,s,s,s,s,e,s,s)}function Ce(o,e){return u$1(34,o,s,s,s,s,s,s,s,e,s,s)}var{toString:_e}=Object.prototype;function Er(o,e){return e instanceof Error?`Seroval caught an error during the ${o} process.
  
${e.name}
${e.message}

- For more information, please check the "cause" property of this error.
- If you believe this is an error in Seroval, please submit an issue at https://github.com/lxsmnsyc/seroval/issues/new`:`Seroval caught an error during the ${o} process.

"${_e.call(e)}"

For more information, please check the "cause" property of this error.`}var ee$1=class ee extends Error{constructor(r,t){super(Er(r,t));this.cause=t;}},E=class extends ee$1{constructor(e){super("parsing",e);}},g$1=class g extends Error{constructor(r){super(`The value ${_e.call(r)} of type "${typeof r}" cannot be parsed/serialized.
      
There are few workarounds for this problem:
- Transform the value in a way that it can be serialized.
- If the reference is present on multiple runtimes (isomorphic), you can use the Reference API to map the references.`);this.value=r;}},ie$1=class ie extends Error{constructor(r){super('Missing reference for the value "'+_e.call(r)+'" of type "'+typeof r+'"');this.value=r;}};var T$1=class T{constructor(e,r){this.value=e;this.replacement=r;}};var ar={},ir={};var lr={0:{},1:{},2:{},3:{},4:{}};function Fe(o){return "__SEROVAL_STREAM__"in o}function K$1(){let o=new Set,e=[],r=true,t=true;function n(l){for(let c of o.keys())c.next(l);}function a(l){for(let c of o.keys())c.throw(l);}function i(l){for(let c of o.keys())c.return(l);}return {__SEROVAL_STREAM__:true,on(l){r&&o.add(l);for(let c=0,p=e.length;c<p;c++){let h=e[c];c===p-1&&!r?t?l.return(h):l.throw(h):l.next(h);}return ()=>{r&&o.delete(l);}},next(l){r&&(e.push(l),n(l));},throw(l){r&&(e.push(l),a(l),r=false,t=false,o.clear());},return(l){r&&(e.push(l),i(l),r=false,t=true,o.clear());}}}function Ve(o){let e=K$1(),r=o[Symbol.asyncIterator]();async function t(){try{let n=await r.next();n.done?e.return(n.value):(e.next(n.value),await t());}catch(n){e.throw(n);}}return t().catch(()=>{}),e}function J$1(o){let e=[],r=-1,t=-1,n=o[Symbol.iterator]();for(;;)try{let a=n.next();if(e.push(a.value),a.done){t=e.length-1;break}}catch(a){r=e.length,e.push(a);}return {v:e,t:r,d:t}}async function Me(o){try{return [1,await o]}catch(e){return [0,e]}}var Y$1=class Y{constructor(e){this.marked=new Set;this.plugins=e.plugins,this.features=31^(e.disabledFeatures||0),this.refs=e.refs||new Map;}markRef(e){this.marked.add(e);}isMarked(e){return this.marked.has(e)}createIndex(e){let r=this.refs.size;return this.refs.set(e,r),r}getIndexedValue(e){let r=this.refs.get(e);return r!=null?(this.markRef(r),{type:1,value:sr(r)}):{type:0,value:this.createIndex(e)}}getReference(e){let r=this.getIndexedValue(e);return r.type===1?r:je(e)?{type:2,value:nr(r.value,e)}:r}parseWellKnownSymbol(e){let r=this.getReference(e);return r.type!==0?r.value:(f$1(e in ce,new g$1(e)),or(r.value,e))}parseSpecialReference(e){let r=this.getIndexedValue(lr[e]);return r.type===1?r.value:u$1(26,r.value,e,s,s,s,s,s,s,s,s,s)}parseIteratorFactory(){let e=this.getIndexedValue(ar);return e.type===1?e.value:u$1(27,e.value,s,s,s,s,s,s,s,this.parseWellKnownSymbol(Symbol.iterator),s,s)}parseAsyncIteratorFactory(){let e=this.getIndexedValue(ir);return e.type===1?e.value:u$1(29,e.value,s,s,s,s,s,s,[this.parseSpecialReference(1),this.parseWellKnownSymbol(Symbol.asyncIterator)],s,s,s)}createObjectNode(e,r,t,n){return u$1(t?11:10,e,s,s,s,s,n,s,s,s,s,fe$1(r))}createMapNode(e,r,t,n){return u$1(8,e,s,s,s,s,s,{k:r,v:t,s:n},s,this.parseSpecialReference(0),s,s)}createPromiseConstructorNode(e,r){return u$1(22,e,r,s,s,s,s,s,s,this.parseSpecialReference(1),s,s)}};var k=class extends Y$1{async parseItems(e){let r=[];for(let t=0,n=e.length;t<n;t++)t in e&&(r[t]=await this.parse(e[t]));return r}async parseArray(e,r){return Ne(e,r,await this.parseItems(r))}async parseProperties(e){let r=Object.entries(e),t=[],n=[];for(let i=0,l=r.length;i<l;i++)t.push(d(r[i][0])),n.push(await this.parse(r[i][1]));let a=Symbol.iterator;return a in e&&(t.push(this.parseWellKnownSymbol(a)),n.push(M(this.parseIteratorFactory(),await this.parse(J$1(e))))),a=Symbol.asyncIterator,a in e&&(t.push(this.parseWellKnownSymbol(a)),n.push(U(this.parseAsyncIteratorFactory(),await this.parse(Ve(e))))),a=Symbol.toStringTag,a in e&&(t.push(this.parseWellKnownSymbol(a)),n.push(w(e[a]))),a=Symbol.isConcatSpreadable,a in e&&(t.push(this.parseWellKnownSymbol(a)),n.push(e[a]?I:A)),{k:t,v:n,s:t.length}}async parsePlainObject(e,r,t){return this.createObjectNode(e,r,t,await this.parseProperties(r))}async parseBoxed(e,r){return be(e,await this.parse(r.valueOf()))}async parseTypedArray(e,r){return xe(e,r,await this.parse(r.buffer))}async parseBigIntTypedArray(e,r){return Ie(e,r,await this.parse(r.buffer))}async parseDataView(e,r){return Ae(e,r,await this.parse(r.buffer))}async parseError(e,r){let t=j$1(r,this.features);return we(e,r,t?await this.parseProperties(t):s)}async parseAggregateError(e,r){let t=j$1(r,this.features);return Ee(e,r,t?await this.parseProperties(t):s)}async parseMap(e,r){let t=[],n=[];for(let[a,i]of r.entries())t.push(await this.parse(a)),n.push(await this.parse(i));return this.createMapNode(e,t,n,r.size)}async parseSet(e,r){let t=[];for(let n of r.keys())t.push(await this.parse(n));return Pe(e,r.size,t)}async parsePromise(e,r){let[t,n]=await Me(r);return u$1(12,e,t,s,s,s,s,s,s,await this.parse(n),s,s)}async parsePlugin(e,r){let t=this.plugins;if(t)for(let n=0,a=t.length;n<a;n++){let i=t[n];if(i.parse.async&&i.test(r))return _$1(e,i.tag,await i.parse.async(r,this,{id:e}))}return s}async parseStream(e,r){return L(e,this.parseSpecialReference(4),await new Promise((t,n)=>{let a=[],i=r.on({next:l=>{this.markRef(e),this.parse(l).then(c=>{a.push(Re(e,c));},c=>{n(c),i();});},throw:l=>{this.markRef(e),this.parse(l).then(c=>{a.push(Oe(e,c)),t(a),i();},c=>{n(c),i();});},return:l=>{this.markRef(e),this.parse(l).then(c=>{a.push(Ce(e,c)),t(a),i();},c=>{n(c),i();});}});}))}async parseObject(e,r){if(Array.isArray(r))return this.parseArray(e,r);if(Fe(r))return this.parseStream(e,r);let t=r.constructor;if(t===T$1)return this.parse(r.replacement);let n=await this.parsePlugin(e,r);if(n)return n;switch(t){case Object:return this.parsePlainObject(e,r,false);case s:return this.parsePlainObject(e,r,true);case Date:return he(e,r);case RegExp:return ye(e,r);case Error:case EvalError:case RangeError:case ReferenceError:case SyntaxError:case TypeError:case URIError:return this.parseError(e,r);case Number:case Boolean:case String:case BigInt:return this.parseBoxed(e,r);case ArrayBuffer:return ve(e,r);case Int8Array:case Int16Array:case Int32Array:case Uint8Array:case Uint16Array:case Uint32Array:case Uint8ClampedArray:case Float32Array:case Float64Array:return this.parseTypedArray(e,r);case DataView:return this.parseDataView(e,r);case Map:return this.parseMap(e,r);case Set:return this.parseSet(e,r);}if(t===Promise||r instanceof Promise)return this.parsePromise(e,r);let a=this.features;if(a&16)switch(t){case BigInt64Array:case BigUint64Array:return this.parseBigIntTypedArray(e,r);}if(a&1&&typeof AggregateError!="undefined"&&(t===AggregateError||r instanceof AggregateError))return this.parseAggregateError(e,r);if(r instanceof Error)return this.parseError(e,r);if(Symbol.iterator in r||Symbol.asyncIterator in r)return this.parsePlainObject(e,r,!!t);throw new g$1(r)}async parseFunction(e){let r=this.getReference(e);if(r.type!==0)return r.value;let t=await this.parsePlugin(r.value,e);if(t)return t;throw new g$1(e)}async parse(e){switch(typeof e){case "boolean":return e?I:A;case "undefined":return pe$1;case "string":return w(e);case "number":return ge(e);case "bigint":return Se(e);case "object":{if(e){let r=this.getReference(e);return r.type===0?await this.parseObject(r.value,e):r.value}return de}case "symbol":return this.parseWellKnownSymbol(e);case "function":return this.parseFunction(e);default:throw new g$1(e)}}async parseTop(e){try{return await this.parse(e)}catch(r){throw r instanceof E?r:new E(r)}}};var H$1=class H extends k{constructor(){super(...arguments);this.mode="vanilla";}};function jo(o){return (0, eval)(o)}async function Mo(o,e={}){let r=m$1(e.plugins),t=new H$1({plugins:r,disabledFeatures:e.disabledFeatures});return {t:await t.parseTop(o),f:t.features,m:Array.from(t.marked)}}

function f(e){return {detail:e.detail,bubbles:e.bubbles,cancelable:e.cancelable,composed:e.composed}}var q=Hr({tag:"seroval-plugins/web/CustomEvent",test(e){return typeof CustomEvent=="undefined"?false:e instanceof CustomEvent},parse:{sync(e,r){return {type:r.parse(e.type),options:r.parse(f(e))}},async async(e,r){return {type:await r.parse(e.type),options:await r.parse(f(e))}},stream(e,r){return {type:r.parse(e.type),options:r.parse(f(e))}}},serialize(e,r){return "new CustomEvent("+r.serialize(e.type)+","+r.serialize(e.options)+")"},deserialize(e,r){return new CustomEvent(r.deserialize(e.type),r.deserialize(e.options))}}),H=q;var T=Hr({tag:"seroval-plugins/web/DOMException",test(e){return typeof DOMException=="undefined"?false:e instanceof DOMException},parse:{sync(e,r){return {name:r.parse(e.name),message:r.parse(e.message)}},async async(e,r){return {name:await r.parse(e.name),message:await r.parse(e.message)}},stream(e,r){return {name:r.parse(e.name),message:r.parse(e.message)}}},serialize(e,r){return "new DOMException("+r.serialize(e.message)+","+r.serialize(e.name)+")"},deserialize(e,r){return new DOMException(r.deserialize(e.message),r.deserialize(e.name))}}),_=T;function m(e){return {bubbles:e.bubbles,cancelable:e.cancelable,composed:e.composed}}var j=Hr({tag:"seroval-plugins/web/Event",test(e){return typeof Event=="undefined"?false:e instanceof Event},parse:{sync(e,r){return {type:r.parse(e.type),options:r.parse(m(e))}},async async(e,r){return {type:await r.parse(e.type),options:await r.parse(m(e))}},stream(e,r){return {type:r.parse(e.type),options:r.parse(m(e))}}},serialize(e,r){return "new Event("+r.serialize(e.type)+","+r.serialize(e.options)+")"},deserialize(e,r){return new Event(r.deserialize(e.type),r.deserialize(e.options))}}),Y=j;var W=Hr({tag:"seroval-plugins/web/File",test(e){return typeof File=="undefined"?false:e instanceof File},parse:{async async(e,r){return {name:await r.parse(e.name),options:await r.parse({type:e.type,lastModified:e.lastModified}),buffer:await r.parse(await e.arrayBuffer())}}},serialize(e,r){return "new File(["+r.serialize(e.buffer)+"],"+r.serialize(e.name)+","+r.serialize(e.options)+")"},deserialize(e,r){return new File([r.deserialize(e.buffer)],r.deserialize(e.name),r.deserialize(e.options))}}),c=W;function g(e){let r=[];return e.forEach((a,t)=>{r.push([t,a]);}),r}var i={},G=Hr({tag:"seroval-plugins/web/FormDataFactory",test(e){return e===i},parse:{sync(){},async async(){return await Promise.resolve(void 0)},stream(){}},serialize(e,r){return r.createEffectfulFunction(["e","f","i","s","t"],"f=new FormData;for(i=0,s=e.length;i<s;i++)f.append((t=e[i])[0],t[1]);return f")},deserialize(){return i}}),J=Hr({tag:"seroval-plugins/web/FormData",extends:[c,G],test(e){return typeof FormData=="undefined"?false:e instanceof FormData},parse:{sync(e,r){return {factory:r.parse(i),entries:r.parse(g(e))}},async async(e,r){return {factory:await r.parse(i),entries:await r.parse(g(e))}},stream(e,r){return {factory:r.parse(i),entries:r.parse(g(e))}}},serialize(e,r){return "("+r.serialize(e.factory)+")("+r.serialize(e.entries)+")"},deserialize(e,r){let a=new FormData,t=r.deserialize(e.entries);for(let n=0,b=t.length;n<b;n++){let S=t[n];a.append(S[0],S[1]);}return a}}),K=J;function y(e){let r=[];return e.forEach((a,t)=>{r.push([t,a]);}),r}var X=Hr({tag:"seroval-plugins/web/Headers",test(e){return typeof Headers=="undefined"?false:e instanceof Headers},parse:{sync(e,r){return r.parse(y(e))},async async(e,r){return await r.parse(y(e))},stream(e,r){return r.parse(y(e))}},serialize(e,r){return "new Headers("+r.serialize(e)+")"},deserialize(e,r){return new Headers(r.deserialize(e))}}),l=X;var p={},ee=Hr({tag:"seroval-plugins/web/ReadableStreamFactory",test(e){return e===p},parse:{sync(){},async async(){return await Promise.resolve(void 0)},stream(){}},serialize(e,r){return r.createFunction(["d"],"new ReadableStream({start:"+r.createEffectfulFunction(["c"],"d.on({next:"+r.createEffectfulFunction(["v"],"try{c.enqueue(v)}catch{}")+",throw:"+r.createEffectfulFunction(["v"],"c.error(v)")+",return:"+r.createEffectfulFunction([],"try{c.close()}catch{}")+"})")+"})")},deserialize(){return p}});function z(e){let r=K$1(),a=e.getReader();async function t(){try{let n=await a.read();n.done?r.return(n.value):(r.next(n.value),await t());}catch(n){r.throw(n);}}return t().catch(()=>{}),r}var re=Hr({tag:"seroval/plugins/web/ReadableStream",extends:[ee],test(e){return typeof ReadableStream=="undefined"?false:e instanceof ReadableStream},parse:{sync(e,r){return {factory:r.parse(p),stream:r.parse(K$1())}},async async(e,r){return {factory:await r.parse(p),stream:await r.parse(z(e))}},stream(e,r){return {factory:r.parse(p),stream:r.parse(z(e))}}},serialize(e,r){return "("+r.serialize(e.factory)+")("+r.serialize(e.stream)+")"},deserialize(e,r){let a=r.deserialize(e.stream);return new ReadableStream({start(t){a.on({next(n){try{t.enqueue(n);}catch(b){}},throw(n){t.error(n);},return(){try{t.close();}catch(n){}}});}})}}),u=re;function h(e,r){return {body:r,cache:e.cache,credentials:e.credentials,headers:e.headers,integrity:e.integrity,keepalive:e.keepalive,method:e.method,mode:e.mode,redirect:e.redirect,referrer:e.referrer,referrerPolicy:e.referrerPolicy}}var te=Hr({tag:"seroval-plugins/web/Request",extends:[u,l],test(e){return typeof Request=="undefined"?false:e instanceof Request},parse:{async async(e,r){return {url:await r.parse(e.url),options:await r.parse(h(e,e.body?await e.clone().arrayBuffer():null))}},stream(e,r){return {url:r.parse(e.url),options:r.parse(h(e,e.clone().body))}}},serialize(e,r){return "new Request("+r.serialize(e.url)+","+r.serialize(e.options)+")"},deserialize(e,r){return new Request(r.deserialize(e.url),r.deserialize(e.options))}}),ne=te;function N(e){return {headers:e.headers,status:e.status,statusText:e.statusText}}var se=Hr({tag:"seroval-plugins/web/Response",extends:[u,l],test(e){return typeof Response=="undefined"?false:e instanceof Response},parse:{async async(e,r){return {body:await r.parse(e.body?await e.clone().arrayBuffer():null),options:await r.parse(N(e))}},stream(e,r){return {body:r.parse(e.clone().body),options:r.parse(N(e))}}},serialize(e,r){return "new Response("+r.serialize(e.body)+","+r.serialize(e.options)+")"},deserialize(e,r){return new Response(r.deserialize(e.body),r.deserialize(e.options))}}),ie=se;var pe=Hr({tag:"seroval-plugins/web/URL",test(e){return typeof URL=="undefined"?false:e instanceof URL},parse:{sync(e,r){return r.parse(e.href)},async async(e,r){return await r.parse(e.href)},stream(e,r){return r.parse(e.href)}},serialize(e,r){return "new URL("+r.serialize(e)+")"},deserialize(e,r){return new URL(r.deserialize(e))}}),ue=pe;var fe=Hr({tag:"seroval-plugins/web/URLSearchParams",test(e){return typeof URLSearchParams=="undefined"?false:e instanceof URLSearchParams},parse:{sync(e,r){return r.parse(e.toString())},async async(e,r){return await r.parse(e.toString())},stream(e,r){return r.parse(e.toString())}},serialize(e,r){return "new URLSearchParams("+r.serialize(e)+")"},deserialize(e,r){return new URLSearchParams(r.deserialize(e))}}),me=fe;

class SerovalChunkReader {
  reader;
  buffer;
  done;
  constructor(stream) {
    this.reader = stream.getReader();
    this.buffer = new Uint8Array(0);
    this.done = false;
  }
  async readChunk() {
    const chunk = await this.reader.read();
    if (!chunk.done) {
      let newBuffer = new Uint8Array(this.buffer.length + chunk.value.length);
      newBuffer.set(this.buffer);
      newBuffer.set(chunk.value, this.buffer.length);
      this.buffer = newBuffer;
    } else {
      this.done = true;
    }
  }
  async next() {
    if (this.buffer.length === 0) {
      if (this.done) {
        return {
          done: true,
          value: void 0
        };
      }
      await this.readChunk();
      return await this.next();
    }
    const head = new TextDecoder().decode(this.buffer.subarray(1, 11));
    const bytes = Number.parseInt(head, 16);
    if (Number.isNaN(bytes)) {
      throw new Error(`Malformed server function stream header: ${head}`);
    }
    while (bytes > this.buffer.length - 12) {
      if (this.done) {
        throw new Error("Malformed server function stream.");
      }
      await this.readChunk();
    }
    const partial = new TextDecoder().decode(this.buffer.subarray(12, 12 + bytes));
    this.buffer = this.buffer.subarray(12 + bytes);
    return {
      done: false,
      value: jo(partial)
    };
  }
  async drain() {
    while (true) {
      const result = await this.next();
      if (result.done) {
        break;
      }
    }
  }
}
async function deserializeStream(id, response) {
  if (!response.body) {
    throw new Error("missing body");
  }
  const reader = new SerovalChunkReader(response.body);
  const result = await reader.next();
  if (!result.done) {
    reader.drain().then(() => {
      delete $R[id];
    }, () => {
    });
  }
  return result.value;
}
let INSTANCE = 0;
function createRequest(base, id, instance, options) {
  return fetch(base, {
    method: "POST",
    ...options,
    headers: {
      ...options.headers,
      "X-Server-Id": id,
      "X-Server-Instance": instance
    }
  });
}
const plugins = [H, _, Y, K, l, u, ne, ie, me, ue];
async function fetchServerFunction(base, id, options, args) {
  const instance = `server-fn:${INSTANCE++}`;
  const response = await (args.length === 0 ? createRequest(base, id, instance, options) : args.length === 1 && args[0] instanceof FormData ? createRequest(base, id, instance, {
    ...options,
    body: args[0]
  }) : args.length === 1 && args[0] instanceof URLSearchParams ? createRequest(base, id, instance, {
    ...options,
    body: args[0],
    headers: {
      ...options.headers,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }) : createRequest(base, id, instance, {
    ...options,
    body: JSON.stringify(await Promise.resolve(Mo(args, {
      plugins
    }))),
    headers: {
      ...options.headers,
      "Content-Type": "application/json"
    }
  }));
  if (response.headers.has("Location") || response.headers.has("X-Revalidate") || response.headers.has("X-Single-Flight")) {
    if (response.body) {
      response.customBody = () => {
        return deserializeStream(instance, response);
      };
    }
    return response;
  }
  const contentType = response.headers.get("Content-Type");
  let result;
  if (contentType && contentType.startsWith("text/plain")) {
    result = await response.text();
  } else if (contentType && contentType.startsWith("application/json")) {
    result = await response.json();
  } else {
    result = await deserializeStream(instance, response);
  }
  if (response.headers.has("X-Error")) {
    throw result;
  }
  return result;
}
function createServerReference(fn, id, name) {
  const baseURL = "";
  return new Proxy(fn, {
    get(target, prop, receiver) {
      if (prop === "url") {
        return `${baseURL}/_server?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}`;
      }
      if (prop === "GET") {
        return receiver.withOptions({
          method: "GET"
        });
      }
      if (prop === "withOptions") {
        const url = `${baseURL}/_server/?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}`;
        return (options) => {
          const fn2 = async (...args) => {
            const encodeArgs = options.method && options.method.toUpperCase() === "GET";
            return fetchServerFunction(encodeArgs ? url + (args.length ? `&args=${encodeURIComponent(JSON.stringify(await Promise.resolve(Mo(args, {
              plugins
            }))))}` : "") : `${baseURL}/_server`, `${id}#${name}`, options, encodeArgs ? [] : args);
          };
          fn2.url = url;
          return fn2;
        };
      }
      return target[prop];
    },
    apply(target, thisArg, args) {
      return fetchServerFunction(`${baseURL}/_server`, `${id}#${name}`, {}, args);
    }
  });
}

export { createServerReference as a, createAsync as c };
