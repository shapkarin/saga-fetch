module.exports=function(e){var t={};function n(r){if(t[r])return t[r].exports;var a=t[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(r,a,function(t){return e[t]}.bind(null,a));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var r=function(e){return"@@redux-saga/"+e},a=r("IO");var o=function(e){return null==e},u=function(e){return"function"==typeof e},c=function(e){return"string"==typeof e},i=Array.isArray;"function"==typeof Symbol&&Symbol.asyncIterator&&Symbol.asyncIterator;var f="PUT",s="CALL",l="CANCELLED",p=function(e,t){var n;return(n={})[a]=!0,n.combinator=!1,n.type=e,n.payload=t,n};function y(e,t){return o(t)&&(t=e,e=void 0),p(f,{channel:e,action:t})}function d(e,t){var n,r=null;return u(e)?n=e:(i(e)?(r=e[0],n=e[1]):(r=e.context,n=e.fn),r&&c(n)&&u(r[n])&&(n=r[n])),{context:r,fn:n,args:t}}function x(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return p(s,d(e,n))}var b=regeneratorRuntime.mark(v);function v(e){var t,n,r,a,o,u,c,i,f,s;return regeneratorRuntime.wrap(function(d){for(;;)switch(d.prev=d.next){case 0:return t=e.action,n=e.method,r=e.start,a=e.success,o=e.error,u=e.fulfill,d.prev=1,d.next=4,y(r());case 4:return d.next=6,x(n,t);case 6:return c=d.sent,d.next=9,void 0===c.data;case 9:if(!d.sent){d.next=15;break}return d.next=12,c.json();case 12:i=d.sent,d.next=18;break;case 15:return d.next=17,c.data;case 17:i=d.sent;case 18:return d.next=20,y(a(i));case 20:d.next=26;break;case 22:return d.prev=22,d.t0=d.catch(1),d.next=26,y(o(d.t0));case 26:return d.prev=26,f=t.type,d.next=30,p(l,{});case 30:if(!d.sent){d.next=35;break}return d.next=33,y({type:"".concat(f,"/CANCELED")});case 33:d.next=38;break;case 35:return s=u||function(){return{type:"".concat(f,"/FULFILL"),payload:t.payload}},d.next=38,y(s(t.payload));case 38:return d.finish(26);case 39:case"end":return d.stop()}},b,null,[[1,22,26,39]])}t.default=v}]);