!function e(t,n,r){function o(u,s){if(!n[u]){if(!t[u]){var a="function"==typeof require&&require;if(!s&&a)return a(u,!0);if(i)return i(u,!0);var l=new Error("Cannot find module '"+u+"'");throw l.code="MODULE_NOT_FOUND",l}var p=n[u]={exports:{}};t[u][0].call(p.exports,function(e){var n=t[u][1][e];return o(n?n:e)},p,p.exports,e,t,n,r)}return n[u].exports}for(var i="function"==typeof require&&require,u=0;u<r.length;u++)o(r[u]);return o}({1:[function(e,t,n){"use strict";function r(e){if("op"==e.type){for(var t=[],n=0;n<e.args.length;n++)t.push(r(e.args[n]));return{state:f,node:{type:s,op:e.op,argRefs:t}}}if("varIdent"==e.type)return{state:p,ident:e.ident};if("literal"==e.type)return{state:f,node:{type:l,kind:e.kind,value:e.value}};throw new Error("Unexpected node type found in AST")}function o(e,t){function n(e){if(g.hasOwnProperty(e))return o(g[e]),g[e].node;if(y.hasOwnProperty(e))return y[e];var t={type:a,ident:e};return y[e]=t,t}function o(e){if(e.state===f);else{if(e.state===c)throw new Error("Circular binding");if(e.state!==p)throw new Error("Invalid ref state");e.state=c,e.node=n(e.ident),e.state=f}if(e.node.type===s)for(var t=0;t<e.node.argRefs.length;t++)o(e.node.argRefs[t]);else if(e.node.type===a);else if(e.node.type!==l)throw new Error("Invalid node type")}function i(e){if(e.state===x)throw new Error("Cycle in binding/reference graph, can't toposort");if(e.state!==E){if(e.state=x,e.type===s)for(var t=0;t<e.argRefs.length;t++)i(e.argRefs[t].node);else if(e.type===a);else if(e.type!==l)throw new Error("Unexpected node type found during toposort");b.push(e),e.state=E}}function u(e){if(e.type===s||e.type===l)return"$_"+e.topoOrder;if(e.type===a)return"lexEnv."+e.ident;throw new Error("Unexpected node type found in tree")}for(var d,m=0;m<t.length;m++){var h=t[m];if("yield"===h.type){if(d)throw new Error("Multiple yield clauses found in function body");d=h}}if(!d)throw new Error("No yield clause found in function body");for(var v=r(d.expr),g={},m=0;m<t.length;m++){var h=t[m];if("binding"===h.type){if(g.hasOwnProperty(h.ident))throw new Error("Same name bound more than once");g[h.ident]=r(h.expr)}}var y={};o(v);for(var w in g)o(g[w]);var x=1,E=2,b=[];i(v.node);var S=[];S.push("(function(runtime, startTime, argSlots, baseTopoOrder, lexEnv) {\n"),S.push("  if (argSlots.length !== "+e.length+") { throw new Error('called with wrong number of arguments'); }\n");for(var L=[],T=0,m=0;m<b.length;m++){var V=b[m];if(V.type===s){V.topoOrder=T,T++;for(var D=[],R=0;R<V.argRefs.length;R++)D.push(u(V.argRefs[R].node));var C="runtime.opFuncs."+V.op;S.push("  var $_"+V.topoOrder+"act = "+C+"(runtime, startTime, ["+D.join(", ")+"], baseTopoOrder+'"+V.topoOrder+"'); var $_"+V.topoOrder+" = $_"+V.topoOrder+"act.outputSlot\n"),L.push("$_"+V.topoOrder+"act.deactivator()")}else if(V.type===a);else{if(V.type!==l)throw new Error("Unexpected node type found in tree");V.topoOrder=T,T++;var O;if("string"===V.kind)O="'"+V.value+"'";else{if("number"!==V.kind)throw new Error("unexpected literal kind");O=V.value.toString()}S.push("  var $_"+V.topoOrder+" = runtime.createSlot(); runtime.setSlotValue($_"+V.topoOrder+", "+O+", startTime);\n")}}L.reverse();var P=u(b[b.length-1]);S.push("  return {\n"),S.push("    outputSlot: "+P+",\n"),S.push("    deactivator: function() {\n");for(var m=0;m<L.length;m++)S.push("      "+L[m]+";\n");return S.push("    }\n"),S.push("  };\n"),S.push("})"),S.join("")}function i(e){var t=u.parse(e),n=o([],t);return n}var u=e("./parser.js"),s=1,a=2,l=3,p=1,c=2,f=3;t.exports={compile:i}},{"./parser.js":2}],2:[function(e,t,n){t.exports=function(){function e(e,t){function n(){this.constructor=e}n.prototype=t.prototype,e.prototype=new n}function t(e,t,n,r,o,i){this.message=e,this.expected=t,this.found=n,this.offset=r,this.line=o,this.column=i,this.name="SyntaxError"}function n(e){function n(){return e.substring(Je,He)}function r(t){function n(t,n,r){var o,i;for(o=n;r>o;o++)i=e.charAt(o),"\n"===i?(t.seenCR||t.line++,t.column=1,t.seenCR=!1):"\r"===i||"\u2028"===i||"\u2029"===i?(t.line++,t.column=1,t.seenCR=!0):(t.column++,t.seenCR=!1)}return Ge!==t&&(Ge>t&&(Ge=0,Ke={line:1,column:1,seenCR:!1}),n(Ke,Ge,t),Ge=t),Ke}function o(e){We>He||(He>We&&(We=He,Ze=[]),Ze.push(e))}function i(n,o,i){function u(e){var t=1;for(e.sort(function(e,t){return e.description<t.description?-1:e.description>t.description?1:0});t<e.length;)e[t-1]===e[t]?e.splice(t,1):t++}function s(e,t){function n(e){function t(e){return e.charCodeAt(0).toString(16).toUpperCase()}return e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\x08/g,"\\b").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\f/g,"\\f").replace(/\r/g,"\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g,function(e){return"\\x0"+t(e)}).replace(/[\x10-\x1F\x80-\xFF]/g,function(e){return"\\x"+t(e)}).replace(/[\u0180-\u0FFF]/g,function(e){return"\\u0"+t(e)}).replace(/[\u1080-\uFFFF]/g,function(e){return"\\u"+t(e)})}var r,o,i,u=new Array(e.length);for(i=0;i<e.length;i++)u[i]=e[i].description;return r=e.length>1?u.slice(0,-1).join(", ")+" or "+u[e.length-1]:u[0],o=t?'"'+n(t)+'"':"end of input","Expected "+r+" but "+o+" found."}var a=r(i),l=i<e.length?e.charAt(i):null;return null!==o&&u(o),new t(null!==n?n:s(o,l),o,l,i,a.line,a.column)}function u(){var e;return e=T()}function s(){var t;return Y.test(e.charAt(He))?(t=e.charAt(He),He++):(t=j,0===et&&o(Q)),t}function a(){var e,t;for(et++,e=[],t=s();t!==j;)e.push(t),t=s();return et--,e===j&&(t=j,0===et&&o(B)),e}function l(){var t,n;if(t=[],$.test(e.charAt(He))?(n=e.charAt(He),He++):(n=j,0===et&&o(H)),n!==j)for(;n!==j;)t.push(n),$.test(e.charAt(He))?(n=e.charAt(He),He++):(n=j,0===et&&o(H));else t=z;return t}function p(){var t,n,r,i,u,s,p;return t=He,n=a(),n!==j?(45===e.charCodeAt(He)?(r=G,He++):(r=j,0===et&&o(K)),r===j&&(r=J),r!==j?(i=l(),i===j&&(i=J),i!==j?(46===e.charCodeAt(He)?(u=W,He++):(u=j,0===et&&o(Z)),u!==j?(s=l(),s!==j?(p=a(),p!==j?(Je=t,n=ee(),t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z)):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t===j&&(t=He,n=a(),n!==j?(45===e.charCodeAt(He)?(r=G,He++):(r=j,0===et&&o(K)),r===j&&(r=J),r!==j?(i=l(),i!==j?(u=a(),u!==j?(Je=t,n=ee(),t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z)):(He=t,t=z)),t}function c(){var t,n,r,i,u;if(t=He,n=a(),n!==j)if(te.test(e.charAt(He))?(r=e.charAt(He),He++):(r=j,0===et&&o(ne)),r!==j){for(i=[],re.test(e.charAt(He))?(u=e.charAt(He),He++):(u=j,0===et&&o(oe));u!==j;)i.push(u),re.test(e.charAt(He))?(u=e.charAt(He),He++):(u=j,0===et&&o(oe));i!==j?(u=a(),u!==j?(Je=t,n=ie(r,i),t=n):(He=t,t=z)):(He=t,t=z)}else He=t,t=z;else He=t,t=z;return t}function f(){var t,n,r,i;return t=He,n=a(),n!==j?(e.substr(He,5)===ue?(r=ue,He+=5):(r=j,0===et&&o(se)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function d(){var t,n,r,i;return t=He,n=a(),n!==j?(e.substr(He,2)===ae?(r=ae,He+=2):(r=j,0===et&&o(le)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function m(){var t,n,r,i;return t=He,n=a(),n!==j?(e.substr(He,4)===pe?(r=pe,He+=4):(r=j,0===et&&o(ce)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function h(){var t,n,r,i;return t=He,n=a(),n!==j?(e.substr(He,4)===fe?(r=fe,He+=4):(r=j,0===et&&o(de)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function v(){var t,n,r,i;return t=He,n=a(),n!==j?(44===e.charCodeAt(He)?(r=me,He++):(r=j,0===et&&o(he)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function g(){var t,n,r,i;return t=He,n=a(),n!==j?(46===e.charCodeAt(He)?(r=W,He++):(r=j,0===et&&o(Z)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function y(){var t,n,r,i;return t=He,n=a(),n!==j?(61===e.charCodeAt(He)?(r=ve,He++):(r=j,0===et&&o(ge)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function w(){var t,n,r,i;return t=He,n=a(),n!==j?(43===e.charCodeAt(He)?(r=ye,He++):(r=j,0===et&&o(we)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function x(){var t,n,r,i;return t=He,n=a(),n!==j?(45===e.charCodeAt(He)?(r=G,He++):(r=j,0===et&&o(K)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function E(){var t,n,r,i;return t=He,n=a(),n!==j?(42===e.charCodeAt(He)?(r=xe,He++):(r=j,0===et&&o(Ee)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function b(){var t,n,r,i;return t=He,n=a(),n!==j?(47===e.charCodeAt(He)?(r=be,He++):(r=j,0===et&&o(Se)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function S(){var t,n,r,i;return t=He,n=a(),n!==j?(40===e.charCodeAt(He)?(r=Le,He++):(r=j,0===et&&o(Te)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function L(){var t,n,r,i;return t=He,n=a(),n!==j?(41===e.charCodeAt(He)?(r=Ve,He++):(r=j,0===et&&o(De)),r!==j?(i=a(),i!==j?(n=[n,r,i],t=n):(He=t,t=z)):(He=t,t=z)):(He=t,t=z),t}function T(){var e,t;return e=He,t=V(),t!==j&&(Je=e,t=Re(t)),e=t}function V(){var e,t,n;if(e=He,t=[],n=D(),n!==j)for(;n!==j;)t.push(n),n=D();else t=z;return t!==j&&(Je=e,t=Ce(t)),e=t}function D(){var e,t,n,r;return e=He,t=f(),t!==j?(n=I(),n!==j?(Je=e,t=Oe(n),e=t):(He=e,e=z)):(He=e,e=z),e===j&&(e=He,t=c(),t!==j?(n=y(),n!==j?(r=I(),r!==j?(Je=e,t=Pe(t,r),e=t):(He=e,e=z)):(He=e,e=z)):(He=e,e=z)),e}function R(){var e,t,n,r,o,i,u;return e=He,t=S(),t!==j?(n=I(),n!==j?(r=L(),r!==j?(Je=e,t=Ae(n),e=t):(He=e,e=z)):(He=e,e=z)):(He=e,e=z),e===j&&(e=He,t=p(),t!==j&&(Je=e,t=Ie(t)),e=t,e===j&&(e=He,t=d(),t!==j?(n=I(),n!==j?(r=m(),r!==j?(o=I(),o!==j?(i=h(),i!==j?(u=I(),u!==j?(Je=e,t=ke(n,o,u),e=t):(He=e,e=z)):(He=e,e=z)):(He=e,e=z)):(He=e,e=z)):(He=e,e=z)):(He=e,e=z),e===j&&(e=He,t=c(),t!==j&&(Je=e,t=Fe(t)),e=t))),e}function C(){var e,t,n,r,o;if(e=He,t=R(),t!==j){for(n=[],r=He,o=F(),o!==j&&(Je=r,o=Me(o)),r=o,r===j&&(r=He,o=k(),o!==j&&(Je=r,o=Ne(o)),r=o);r!==j;)n.push(r),r=He,o=F(),o!==j&&(Je=r,o=Me(o)),r=o,r===j&&(r=He,o=k(),o!==j&&(Je=r,o=Ne(o)),r=o);n!==j?(Je=e,t=_e(t,n),e=t):(He=e,e=z)}else He=e,e=z;return e}function O(){var e,t;return e=He,t=E(),t!==j&&(Je=e,t=qe()),e=t,e===j&&(e=He,t=b(),t!==j&&(Je=e,t=je()),e=t),e}function P(){var e,t,n,r,o,i;if(e=He,t=C(),t!==j){for(n=[],r=He,o=O(),o!==j?(i=C(),i!==j?(o=[o,i],r=o):(He=r,r=z)):(He=r,r=z);r!==j;)n.push(r),r=He,o=O(),o!==j?(i=C(),i!==j?(o=[o,i],r=o):(He=r,r=z)):(He=r,r=z);n!==j?(Je=e,t=Ue(t,n),e=t):(He=e,e=z)}else He=e,e=z;return e}function A(){var e,t;return e=He,t=w(),t!==j&&(Je=e,t=Xe()),e=t,e===j&&(e=He,t=x(),t!==j&&(Je=e,t=Ye()),e=t),e}function I(){var e,t,n,r,o,i;if(e=He,t=P(),t!==j){for(n=[],r=He,o=A(),o!==j?(i=P(),i!==j?(o=[o,i],r=o):(He=r,r=z)):(He=r,r=z);r!==j;)n.push(r),r=He,o=A(),o!==j?(i=P(),i!==j?(o=[o,i],r=o):(He=r,r=z)):(He=r,r=z);n!==j?(Je=e,t=Ue(t,n),e=t):(He=e,e=z)}else He=e,e=z;return e}function k(){var e,t,n;return e=He,t=g(),t!==j?(n=c(),n!==j?(Je=e,t=Qe(n),e=t):(He=e,e=z)):(He=e,e=z),e}function F(){var e,t,n,r;return e=He,t=S(),t!==j?(n=M(),n!==j?(r=L(),r!==j?(Je=e,t=Be(n),e=t):(He=e,e=z)):(He=e,e=z)):(He=e,e=z),e}function M(){var e,t,n,r;return e=He,t=I(),t!==j?(n=v(),n!==j?(r=M(),r!==j?(Je=e,t=ze(t,r),e=t):(He=e,e=z)):(He=e,e=z)):(He=e,e=z),e===j&&(e=He,t=I(),t!==j&&(Je=e,t=$e(t)),e=t),e}function N(e,t){for(var n=e,r=0;r<t.length;r++)n={type:"op",op:t[r][0],args:[n].concat(t[r][1])};return n}var _,q=arguments.length>1?arguments[1]:{},j={},U={start:u},X=u,Y=/^[ \t\n\r]/,Q={type:"class",value:"[ \\t\\n\\r]",description:"[ \\t\\n\\r]"},B={type:"other",description:"whitespace"},z=j,$=/^[0-9]/,H={type:"class",value:"[0-9]",description:"[0-9]"},J=null,G="-",K={type:"literal",value:"-",description:'"-"'},W=".",Z={type:"literal",value:".",description:'"."'},ee=function(){return parseFloat(n())},te=/^[_a-z]/i,ne={type:"class",value:"[_a-z]i",description:"[_a-z]i"},re=/^[_a-z0-9]/i,oe={type:"class",value:"[_a-z0-9]i",description:"[_a-z0-9]i"},ie=function(e,t){return e+t.join("")},ue="yield",se={type:"literal",value:"yield",description:'"yield"'},ae="if",le={type:"literal",value:"if",description:'"if"'},pe="then",ce={type:"literal",value:"then",description:'"then"'},fe="else",de={type:"literal",value:"else",description:'"else"'},me=",",he={type:"literal",value:",",description:'","'},ve="=",ge={type:"literal",value:"=",description:'"="'},ye="+",we={type:"literal",value:"+",description:'"+"'},xe="*",Ee={type:"literal",value:"*",description:'"*"'},be="/",Se={type:"literal",value:"/",description:'"/"'},Le="(",Te={type:"literal",value:"(",description:'"("'},Ve=")",De={type:"literal",value:")",description:'")"'},Re=function(e){return e},Ce=function(e){return e},Oe=function(e){return{type:"yield",expr:e}},Pe=function(e,t){return{type:"binding",ident:e,expr:t}},Ae=function(e){return e},Ie=function(e){return{type:"literal",kind:"number",value:e}},ke=function(e,t,n){return{type:"op",op:"ifte",args:[e,t,n]}},Fe=function(e){return{type:"varIdent",ident:e}},Me=function(e){return{internal:"app",argList:e}},Ne=function(e){return{internal:"dot",ident:e}},_e=function(e,t){for(var n=e,r=0;r<t.length;r++)if("app"===t[r].internal)n={type:"op",op:"app",args:[n].concat(t[r].argList)};else{if("dot"!==t[r].internal)throw new Error("internal error");n={type:"op",op:"prop",args:[n,{type:"literal",kind:"string",value:t[r].ident}]}}return n},qe=function(){return"mul"},je=function(){return"div"},Ue=function(e,t){return N(e,t)},Xe=function(){return"add"},Ye=function(){return"sub"},Qe=function(e){return e},Be=function(e){return e},ze=function(e,t){return[e].concat(t)},$e=function(e){return[e]},He=0,Je=0,Ge=0,Ke={line:1,column:1,seenCR:!1},We=0,Ze=[],et=0;if("startRule"in q){if(!(q.startRule in U))throw new Error("Can't start parsing from rule \""+q.startRule+'".');X=U[q.startRule]}if(_=X(),_!==j&&He===e.length)return _;throw _!==j&&He<e.length&&o({type:"end",description:"end of input"}),i(null,Ze,We)}return e(t,Error),{SyntaxError:t,parse:n}}()},{}],3:[function(e,t,n){"use strict";function r(e,t,n,r,o){if(1!==n.length)throw new Error("got wrong number of arguments");var i=e.createSlot(),u=n[0],s=[],a=null,l=function(){if(s.length>0&&!a){var t=s[0],n={time:t.time,topoOrder:r,closure:p};e.priorityQueue.insert(n),a=n}},p=function(t){if(0===s.length)throw new Error("no changes to make");var n=s.shift();if(t!==n.time)throw new Error("times do not match");e.setSlotValue(i,n.value,t),a=null,l()},c=function(t){var n=e.getSlotValue(u);s.push({time:t+1,value:n}),l()},f=function(t){e.priorityQueue.insert({time:t,topoOrder:r,closure:c})},d=e.getSlotValue(u);return e.setSlotValue(i,d,t),e.addTrigger(u,f),{outputSlot:i,deactivator:function(){e.removeTrigger(u,f),a&&e.priorityQueue.remove(a)}}}var o=e("./primUtils"),i=o.liftN;t.exports={id:i(function(e){return e},1),Vec2:i(function(e,t){return{x:e,y:t}},2),delay1:r}},{"./primUtils":9}],4:[function(e,t,n){"use strict";var r=e("./pq"),o=function(){this.priorityQueue=new r};o.prototype.createLexEnv=function(e){return this.deriveLexEnv(null,e)},o.prototype.deriveLexEnv=function(e,t){var n={};for(var r in t)t.hasOwnProperty(r)&&(n[r]={value:t[r],writeable:!1,enumerable:!0});return Object.create(e,n)},o.prototype.createSlot=function(){return{currentValue:void 0,triggers:[]}},o.prototype.getSlotValue=function(e){return e.value},o.prototype.setSlotValue=function(e,t,n){e.value=t;for(var r=0;r<e.triggers.length;r++)e.triggers[r](n)},o.prototype.addTrigger=function(e,t){e.triggers.push(t)},o.prototype.removeTrigger=function(e,t){for(var n,r=0;r<e.triggers.length;r++)if(e.triggers[r]===t){if(void 0!==n)throw new Error("found two identical triggers");n=r}if(void 0===n)throw new Error("no matching trigger found");e.triggers.splice(n,1)},o.prototype.runToTime=function(e){for(;;){if(this.priorityQueue.isEmpty())return null;var t=this.priorityQueue.peek();if(t.time>e)return t.time;this.runNextTask()}},o.prototype.runNextTask=function(){var e=this.priorityQueue.pull();e.closure(e.time)},o.prototype.isRunnable=function(){return!this.priorityQueue.isEmpty()},o.prototype.builtins=e("./builtins"),o.prototype.opFuncs=e("./opFuncs"),t.exports=o},{"./builtins":3,"./opFuncs":7,"./pq":8}],5:[function(e,t,n){t.exports=e("./lib/heap")},{"./lib/heap":6}],6:[function(e,t,n){(function(){var e,r,o,i,u,s,a,l,p,c,f,d,m,h,v;o=Math.floor,c=Math.min,r=function(e,t){return t>e?-1:e>t?1:0},p=function(e,t,n,i,u){var s;if(null==n&&(n=0),null==u&&(u=r),0>n)throw new Error("lo must be non-negative");for(null==i&&(i=e.length);i>n;)s=o((n+i)/2),u(t,e[s])<0?i=s:n=s+1;return[].splice.apply(e,[n,n-n].concat(t)),t},s=function(e,t,n){return null==n&&(n=r),e.push(t),h(e,0,e.length-1,n)},u=function(e,t){var n,o;return null==t&&(t=r),n=e.pop(),e.length?(o=e[0],e[0]=n,v(e,0,t)):o=n,o},l=function(e,t,n){var o;return null==n&&(n=r),o=e[0],e[0]=t,v(e,0,n),o},a=function(e,t,n){var o;return null==n&&(n=r),e.length&&n(e[0],t)<0&&(o=[e[0],t],t=o[0],e[0]=o[1],v(e,0,n)),t},i=function(e,t){var n,i,u,s,a,l;for(null==t&&(t=r),s=function(){l=[];for(var t=0,n=o(e.length/2);n>=0?n>t:t>n;n>=0?t++:t--)l.push(t);return l}.apply(this).reverse(),a=[],i=0,u=s.length;u>i;i++)n=s[i],a.push(v(e,n,t));return a},m=function(e,t,n){var o;return null==n&&(n=r),o=e.indexOf(t),-1!==o?(h(e,0,o,n),v(e,o,n)):void 0},f=function(e,t,n){var o,u,s,l,p;if(null==n&&(n=r),u=e.slice(0,t),!u.length)return u;for(i(u,n),p=e.slice(t),s=0,l=p.length;l>s;s++)o=p[s],a(u,o,n);return u.sort(n).reverse()},d=function(e,t,n){var o,s,a,l,f,d,m,h,v,g;if(null==n&&(n=r),10*t<=e.length){if(l=e.slice(0,t).sort(n),!l.length)return l;for(a=l[l.length-1],h=e.slice(t),f=0,m=h.length;m>f;f++)o=h[f],n(o,a)<0&&(p(l,o,0,null,n),l.pop(),a=l[l.length-1]);return l}for(i(e,n),g=[],s=d=0,v=c(t,e.length);v>=0?v>d:d>v;s=v>=0?++d:--d)g.push(u(e,n));return g},h=function(e,t,n,o){var i,u,s;for(null==o&&(o=r),i=e[n];n>t&&(s=n-1>>1,u=e[s],o(i,u)<0);)e[n]=u,n=s;return e[n]=i},v=function(e,t,n){var o,i,u,s,a;for(null==n&&(n=r),i=e.length,a=t,u=e[t],o=2*t+1;i>o;)s=o+1,i>s&&!(n(e[o],e[s])<0)&&(o=s),e[t]=e[o],t=o,o=2*t+1;return e[t]=u,h(e,a,t,n)},e=function(){function e(e){this.cmp=null!=e?e:r,this.nodes=[]}return e.push=s,e.pop=u,e.replace=l,e.pushpop=a,e.heapify=i,e.updateItem=m,e.nlargest=f,e.nsmallest=d,e.prototype.push=function(e){return s(this.nodes,e,this.cmp)},e.prototype.pop=function(){return u(this.nodes,this.cmp)},e.prototype.peek=function(){return this.nodes[0]},e.prototype.contains=function(e){return-1!==this.nodes.indexOf(e)},e.prototype.replace=function(e){return l(this.nodes,e,this.cmp)},e.prototype.pushpop=function(e){return a(this.nodes,e,this.cmp)},e.prototype.heapify=function(){return i(this.nodes,this.cmp)},e.prototype.updateItem=function(e){return m(this.nodes,e,this.cmp)},e.prototype.clear=function(){return this.nodes=[]},e.prototype.empty=function(){return 0===this.nodes.length},e.prototype.size=function(){return this.nodes.length},e.prototype.clone=function(){var t;return t=new e,t.nodes=this.nodes.slice(0),t},e.prototype.toArray=function(){return this.nodes.slice(0)},e.prototype.insert=e.prototype.push,e.prototype.top=e.prototype.peek,e.prototype.front=e.prototype.peek,e.prototype.has=e.prototype.contains,e.prototype.copy=e.prototype.clone,e}(),function(e,r){return"function"==typeof define&&define.amd?define([],r):"object"==typeof n?t.exports=r():e.Heap=r()}(this,function(){return e})}).call(this)},{}],7:[function(e,t,n){"use strict";function r(e,t,n,r,o){function i(t){void 0!==u&&u();var n=e.getSlotValue(a),i=n(e,t,l,r,o);if(void 0===i)throw new Error("activator did not return result");u=i.deactivator,e.setSlotValue(s,e.getSlotValue(i.outputSlot),t),e.addTrigger(i.outputSlot,function(t){e.setSlotValue(s,e.getSlotValue(i.outputSlot),t)})}var u,s=e.createSlot(),a=n[0],l=n.slice(1);return i(t),e.addTrigger(a,i),{outputSlot:s,deactivator:function(){e.removeTrigger(a,i),u()}}}var o=e("./primUtils"),i=o.liftN;t.exports={app:r,prop:i(function(e,t){return e[t]},2),ifte:i(function(e,t,n){return e?t:n},3),add:i(function(e,t){return e+t},2),sub:i(function(e,t){return e-t},2),mul:i(function(e,t){return e*t},2),div:i(function(e,t){return e/t},2)}},{"./primUtils":9}],8:[function(e,t,n){"use strict";var r=e("heap"),o=function(){this.heap=new r(function(e,t){return e.time===t.time?e.topoOrder<t.topoOrder?-1:t.topoOrder>e.topoOrder?1:0:e.time-t.time})};o.prototype.isEmpty=function(){return this.pullRemoved(),this.heap.empty()},o.prototype.insert=function(e){this.heap.push(e)},o.prototype.peek=function(){return this.pullRemoved(),this.heap.peek()},o.prototype.pull=function(){this.pullRemoved();for(var e=this.heap.pop();;){if(this.pullRemoved(),this.heap.empty())break;var t=this.heap.peek();if(t.time!==e.time||t.topoOrder!==e.topoOrder||t.closure!==e.closure)break;this.heap.pop()}return e},o.prototype.remove=function(e){e.removed=!0},o.prototype.pullRemoved=function(){for(;!this.heap.empty();){var e=this.heap.peek();if(!e.removed)break;this.heap.pop()}},t.exports=o},{heap:5}],9:[function(e,t,n){"use strict";function r(e,t){return function(n,r,o,i,u){if(o.length!==t)throw new Error("got wrong number of arguments");var s=n.createSlot(),a=function(r){for(var i=[],u=0;t>u;u++)i.push(n.getSlotValue(o[u]));var a=e.apply(null,i);n.setSlotValue(s,a,r)},l=function(e){n.priorityQueue.insert({time:e,topoOrder:i,closure:a})};a(r);for(var p=0;t>p;p++)n.addTrigger(o[p],l);return{outputSlot:s,deactivator:function(){for(var e=0;t>e;e++)n.removeTrigger(o[e],l)}}}}t.exports={liftN:r}},{}],10:[function(require,module,exports){"use strict";function getMasterTime(){return.001*(Date.now()-initialDateNow)}function tryRunning(){if(runtime.isRunnable()){var e=getMasterTime(),t=runtime.runToTime(e);t&&!timeoutID&&(timeoutID=window.setTimeout(function(){timeoutID=null,updateInternalsDisplay(),tryRunning()},1e3*(t-e)),updateInternalsDisplay())}}function updateInternalsDisplay(){var e=[];e.push("Output changes: "+internals.outputChanges),e.push("JS timeout outstanding: "+!!timeoutID),document.getElementById("internals-notes").innerHTML=e.join("<br>")}function witnessOutput(e){var t=currentResult.outputSlot.value;internals.outputChanges+=1,updateInternalsDisplay();var n=document.getElementById("square");n.style.left=t.x+1+"px",n.style.top=t.y+1+"px"}function startCompiledProgram(e){if(currentResult){if(currentResult.deactivator(),runtime.removeTrigger(currentResult.outputSlot,witnessOutput),timeoutID&&(window.clearTimeout(timeoutID),timeoutID=null,updateInternalsDisplay()),runtime.isRunnable())throw new Error("something went wrong");for(var t in rootLexEnv)if(rootLexEnv[t].triggers.length>0)throw new Error("something went wrong")}runtime=new Runtime,rootLexEnv=runtime.createLexEnv({mouseX:runtime.createSlot(),mouseY:runtime.createSlot(),mousePos:runtime.createSlot(),mouseDown:runtime.createSlot()}),runtime.setSlotValue(rootLexEnv.mouseX,inputValues.mouseX,0),runtime.setSlotValue(rootLexEnv.mouseY,inputValues.mouseY,0),runtime.setSlotValue(rootLexEnv.mousePos,{x:inputValues.mouseX,y:inputValues.mouseY},0),runtime.setSlotValue(rootLexEnv.mouseDown,inputValues.mouseDown,0);for(var t in runtime.builtins)rootLexEnv[t]=runtime.createSlot(),runtime.setSlotValue(rootLexEnv[t],runtime.builtins[t],0);internals={outputChanges:0},updateInternalsDisplay(),currentResult=e(runtime,0,[],"",rootLexEnv),witnessOutput(0),runtime.addTrigger(currentResult.outputSlot,witnessOutput),tryRunning()}function compileAndStartProgram(code){var mainFuncSrc=Compiler.compile(code);console.log("compiled to JS:"),console.log(mainFuncSrc);var mainFunc=eval(mainFuncSrc);startCompiledProgram(mainFunc)}function startDemoProg(e){document.getElementById("code-column-editor").value=e.source,document.getElementById("code-column-commentary").innerHTML=e.commentary||"",compileAndStartProgram(e.source)}function createDemoControls(){for(var e=document.getElementById("demos-list"),t=0;t<demoProgsList.length;t++){var n=demoProgsList[t],r=document.createElement("LI");r.setAttribute("class","demo-choice"),r.appendChild(document.createTextNode(n.title)),e.appendChild(r)}e.firstChild.classList.add("demo-active"),document.addEventListener("click",function(t){if(t.target.classList.contains("demo-choice")){for(var n=0;n<e.childNodes.length;n++)e.childNodes[n].classList.remove("demo-active");t.target.classList.add("demo-active");var r=t.target.textContent,o=demoProgsMap[r];startDemoProg(o)}},!1),document.getElementById("compile-button").addEventListener("click",function(e){compileAndStartProgram(document.getElementById("code-column-editor").value)})}for(var Runtime=require("../runtime"),Compiler=require("../compiler"),demoProgsMap={},demoProgsList=[],demoProgsData='same position\n---\nyield mousePos\n---\n<p>This program simply yields the mouse position unchanged, causing the square to be at the same position as the mouse.</p>\n\n=====\n\ndelayed position\n---\nyield delay1(mousePos)\n---\n<p>This program yields the mouse position delayed by 1 second. Note the behavior of the "JS timeout outstanding" value on the left, as you alternately move the mouse and stop moving it for a bit. If there are "buffered" mouse movements still to be played out, there is a timeout set for those. If the mouse has been still for a least one second, no changes will be buffered and so no timeout will be set.</p><p>Also note, if you quickly move the pointer and click to start this same program again, the square jumps to match the mouse position. This is because the delay1 function relays its initial input as its output for the first second.</p>\n\n=====\n\nswitch on button\n---\nyield if mouseDown then mousePos else delay1(mousePos)\n---\n<p>This program switches between yielding the current mouse position and the delayed mouse position, based on whether the mouse button is down. The if/then/else syntax is an expression (like the ternary operator "?:"), not a statement.</p><p>Note that even if the mouse button is held down, the delayed position is computed. This is necessary to avoid "time leaks", i.e. we don\\\'t know when we\\\'ll need the value when the mouse button is released, so we must keep it up to date.</p>\n\n=====\n\ndynamic application\n---\nyield (if mouseDown then id else delay1)(mousePos)\n---\n<p>This program illustrates a subtle and important detail, when compared to the previous program. In this program, we apply a function to the mouse position, but the value of that function we apply is itself dynamic. It switches from the value "id" (identity function) to the value "delay1". This is similar to the previous program, except when the mouse is released, the square stays at the current mouse position. This is because when id or delay1 are switched into action, they always start "from scratch". Only one is running at a time. And when delay1 starts, it mirrors its input for the first second. In the previous program, delay1 is always running.</p>\n\n=====\n\nprops and ctor\n---\nyield Vec2(mousePos.y, mousePos.x)\n---\n<p>This program demonstrates property access with the dot operator, and calling a "constructor" function which is just a builtin in this case.</p>\n\n=====\n\nbasic math\n---\nyield Vec2(800 - 1.5*mousePos.x, mousePos.y + 50)\n---\n<p>Here we demonstrate basic math operators and precedence of multiplicatives over additives.</p>\n\n\n',demoProgsDataList=demoProgsData.split("\n=====\n"),i=0;i<demoProgsDataList.length;i++){var progFields=demoProgsDataList[i].split("\n---\n");if(3!==progFields.length)throw new Error("Problem loading demo programs");var title=progFields[0].trim(),source=progFields[1].trim(),commentary=progFields[2].trim(),progInfo={title:title,source:source,commentary:commentary};demoProgsMap[title]=progInfo,demoProgsList.push(progInfo)}var initialDateNow=Date.now(),runtime,rootLexEnv,timeoutID,currentResult,inputValues={mouseX:0,mouseY:0,mouseDown:!1},internals;document.addEventListener("mousemove",function(e){var t=getMasterTime();inputValues.mouseX=e.clientX||e.pageX,inputValues.mouseY=e.clientY||e.pageY,runtime.setSlotValue(rootLexEnv.mouseX,inputValues.mouseX,t),runtime.setSlotValue(rootLexEnv.mouseY,inputValues.mouseY,t),runtime.setSlotValue(rootLexEnv.mousePos,{x:inputValues.mouseX,y:inputValues.mouseY},t),tryRunning()},!1),document.addEventListener("mousedown",function(e){if(0===e.button){var t=getMasterTime();inputValues.mouseDown=!0,runtime.setSlotValue(rootLexEnv.mouseDown,inputValues.mouseDown,t),tryRunning()}},!1),document.addEventListener("mouseup",function(e){if(0===e.button){var t=getMasterTime();inputValues.mouseDown=!1,runtime.setSlotValue(rootLexEnv.mouseDown,inputValues.mouseDown,t),tryRunning()}},!1),document.addEventListener("DOMContentLoaded",function(){createDemoControls(),startDemoProg(demoProgsList[0])})},{"../compiler":1,"../runtime":4}]},{},[10]);
