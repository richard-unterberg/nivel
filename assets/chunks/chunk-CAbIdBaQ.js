import{a as p,b as S,r as q,u as b,j as t,c as H,d as u,k as L,e as P,L as M,n as C,f as z,h as $}from"./chunk-Bkgk428z.js";import{c as f,t as h,f as E,g as A,S as T,M as O,e as D,L as F}from"./chunk-D_4GLj-x.js";/**
 * @license lucide-react v0.443.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=f("Bug",[["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M9 7.13v-1a3.003 3.003 0 1 1 6 0v1",key:"d7y7pr"}],["path",{d:"M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",key:"xs1cw7"}],["path",{d:"M12 20v-9",key:"1qisl0"}],["path",{d:"M6.53 9C4.6 8.8 3 7.1 3 5",key:"32zzws"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"M3 21c0-2.1 1.7-3.9 3.8-4",key:"4p0ekp"}],["path",{d:"M20.97 5c0 2.1-1.6 3.8-3.5 4",key:"18gb23"}],["path",{d:"M22 13h-4",key:"1jl80f"}],["path",{d:"M17.2 17c2.1.1 3.8 1.9 3.8 4",key:"k3fwyw"}]]);/**
 * @license lucide-react v0.443.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=f("Compass",[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.443.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=f("Pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);/**
 * @license lucide-react v0.443.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=f("Sprout",[["path",{d:"M7 20h10",key:"e6iznv"}],["path",{d:"M10 20c5.5-2.5.8-6.4 3-10",key:"161w41"}],["path",{d:"M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z",key:"9gtqwd"}],["path",{d:"M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z",key:"bkxnd2"}]]);/**
 * @license lucide-react v0.443.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=f("TableOfContents",[["path",{d:"M16 12H3",key:"1a2rj7"}],["path",{d:"M16 18H3",key:"12xzn7"}],["path",{d:"M16 6H3",key:"1wxfjs"}],["path",{d:"M21 12h.01",key:"msek7k"}],["path",{d:"M21 18h.01",key:"1e8rq1"}],["path",{d:"M21 6h.01",key:"1koanj"}]]),G=async e=>{const s=p(e),o=(e.routeParams.slug?.replace(/^\/+|\/+$/g,"")??"")||s.defaultSlug;if(!S(o,e.locale,s)?.Page)throw q(404)},fe=Object.freeze(Object.defineProperty({__proto__:null,default:G},Symbol.toStringTag,{value:"Module"})),U=()=>{const{locale:e}=b();return t.jsxs("footer",{className:"mb-8 mt-12 text-sm border-t border-base-muted-light pt-10",children:[t.jsxs("div",{className:"mb-16 flex items-center gap-2",children:[t.jsxs("a",{href:"edit",className:"btn btn-sm btn-primary btn-soft",children:[t.jsx(K,{className:"w-3 h-3"})," ",h(e,"docs","edit")]}),t.jsxs("a",{href:"edit",className:"btn btn-sm btn-primary btn-soft",children:[t.jsx(I,{className:"w-3 h-3"})," ",h(e,"docs","reportIssue")]})]}),t.jsxs("div",{className:"flex justify-between items-center",children:[t.jsx(E,{}),t.jsxs("div",{className:"flex gap-2 items-center",children:[t.jsx(A,{}),t.jsx("p",{children:t.jsx("a",{href:"unterberg.dev",className:"text-base-content",children:t.jsx(T,{className:"w-7 h-7"})})})]})]})]})},Y=(e,s)=>{const a=r=>{const i=H(r);return i==="/"?"/":i.replace(/\/+$/g,"")},n=a(e),o=a(s);return o==="/"?n===o:n===o||n.startsWith(`${o}/`)},J=(e,s)=>{let a=null,n=-1;for(const o of e)for(const r of o.links??[]){if(!Y(s,r.href))continue;const i=H(r.href).length;i>n&&(a=r.href,n=i)}return a},N=e=>typeof e!="string"?e:e.split(/(`[^`]+`)/g).map((s,a)=>s.startsWith("`")&&s.endsWith("`")?t.jsx("code",{className:"text-sm!",children:s.slice(1,-1)},a):t.jsx(u.Fragment,{children:s},a)),x=(e,s)=>`${e.href}::${s}`,k=e=>t.jsx("li",{children:t.jsx("a",{href:e.href,className:L("text-base-muted hover:text-base-content justify-start hover:bg-base-200",e.activeHref===e.href&&"text-primary! font-semibold bg-base-200"),children:N(e.title)})}),y=e=>{const s=e.icon;return t.jsxs(t.Fragment,{children:[s&&t.jsx(s,{className:"inline w-3 h-3"}),t.jsx("span",{className:"text-base-content font-semibold",children:N(e.title)})]})},Q=e=>{const s=e.collapsible!==!1&&e.collapsible!==void 0,a=typeof e.collapsible=="object"?e.collapsible.isDefaultOpen??!0:!1,n=(e.links??[]).some(d=>d.href===e.activeHref),o=u.useRef(null),r=u.useRef(!1),i=u.useRef(n);return u.useEffect(()=>{if(!(!s||!o.current)){if(!r.current){r.current=!0,(a||n)&&(o.current.open=!0),i.current=n;return}n&&!i.current&&(o.current.open=!0),i.current=n}},[n,s,a]),t.jsxs("li",{className:"pb-4",children:[s?t.jsxs("details",{ref:o,children:[t.jsx("summary",{children:t.jsx(y,{icon:e.icon,title:e.title})}),t.jsx("ul",{children:e.links?.map((d,c)=>t.jsx(k,{...d,activeHref:e.activeHref},x(d,c)))})]}):t.jsxs(t.Fragment,{children:[t.jsx("span",{className:"pointer-events-none",children:t.jsx(y,{icon:e.icon,title:e.title})}),t.jsx("ul",{children:e.links?.map((d,c)=>t.jsx(k,{...d,activeHref:e.activeHref},x(d,c)))})]}),e.showSeparator&&t.jsx("span",{className:"pointer-events-none absolute -bottom-1 border-b border-base-muted-light block rounded-none w-full mx-auto mb-3"})]})},V=e=>{const s=J(e.groups,e.currentPathname);return t.jsx("ul",{className:"menu w-full px-0 py-5 li:last-child:border-0",children:e.groups.map((a,n)=>t.jsx(Q,{...a,activeHref:s,showSeparator:n!==e.groups.length-1},`sidebar-group-${a.id}`))})},X=[{id:"get-started",icon:B,groupKey:"getStarted",links:["getStarted","designSystem"],collapsible:{isDefaultOpen:!0}},{id:"components",icon:R,groupKey:"components",links:["components","alert"],collapsible:!0},{id:"guides",icon:O,groupKey:"guides",links:["tailwind","daisyUiTestRange"]}],Z=e=>X.map(s=>({id:s.id,icon:s.icon,title:h(e,"sidebar",s.groupKey),collapsible:s.collapsible,links:s.links.map(a=>P(a,e))})),ee=()=>{const{locale:e,urlPathnameLocalized:s,urlPathname:a}=b(),n=Z(e);return t.jsx(V,{groups:n,currentPathname:s??a})},te=()=>t.jsxs("div",{className:"-ml-3 sticky top-16",children:[t.jsx("div",{className:"absolute h-full w-px right-0 top-0 bg-linear-to-t to-base-muted-light  via-base-muted-light  pointer-events-none z-1"}),t.jsx("div",{className:"pr-4 h-[calc(100svh-16*var(--spacing))] overflow-y-scroll overflow-x-hidden  relative z-10",children:t.jsx(ee,{})})]}),se=M.a`
  block
  border-l
  border-base-muted-light
  py-1.5
  text-sm
  text-base-muted
  transition-colors
  hover:border-primary-muted
  hover:text-base-content
  ${e=>e.$isNested?"pl-6":"pl-4"}
  ${e=>e.$isActive?"border-l-2 border-primary text-base-content font-semibold":""}
`,ne=()=>{try{return decodeURIComponent(window.location.hash)}catch{return window.location.hash}},ae=()=>{const e=document.querySelector("[data-doc-content]");return e instanceof HTMLElement?Array.from(e.querySelectorAll("h2, h3, h4")).filter(s=>s instanceof HTMLHeadingElement):[]},v=e=>{const s=document.querySelector("[data-doc-content]");if(!(s instanceof HTMLElement))return;const a=z(),n=Array.from(s.querySelectorAll("h2, h3, h4")).map(o=>{const r=C(o.textContent??"");if(!r)return null;const i=o.id||a(r);return o.id||(o.id=i),{depth:Number(o.tagName.slice(1)),id:i,title:r}}).filter(o=>o!==null);e(n)},j=e=>{const s=ae();if(s.length===0)return;const a=144;let n=s[0]?.id??"";for(const r of s)if(r.id){if(r.getBoundingClientRect().top<=a){n=r.id;continue}break}const o=s.at(-1);o?.id&&window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-8&&(n=o.id),e(n)},oe=({headings:e})=>{const{locale:s}=b(),[a,n]=u.useState(""),[o,r]=u.useState(e),i=o.length>0?o:e,d=i.length>0;return u.useEffect(()=>{let c=0;const l=()=>{c||(c=window.requestAnimationFrame(()=>{c=0,j(n)}))},m=()=>{const g=ne().replace(/^#/,"");if(g!==""){n(g);return}l()};return m(),queueMicrotask(()=>{v(r),l()}),window.addEventListener("hashchange",m),window.addEventListener("scroll",l,{passive:!0}),window.addEventListener("resize",l),()=>{c&&window.cancelAnimationFrame(c),window.removeEventListener("hashchange",m),window.removeEventListener("scroll",l),window.removeEventListener("resize",l)}},[]),u.useEffect(()=>{typeof window>"u"||(r(e),n(""),queueMicrotask(()=>{v(r),j(n)}))},[e]),t.jsx("aside",{className:"hidden xl:block w-64 shrink-0",children:d&&t.jsxs("div",{className:"sticky top-16 pt-10 max-h-[calc(100svh-7rem)] overflow-y-auto pb-8",children:[t.jsxs("p",{className:"mb-4 text-xs font-semibold tracking-widest text-base-muted uppercase flex gap-2 items-center",children:[t.jsx(W,{className:"w-3 h-3"}),h(s,"docs","onThisPage")]}),t.jsx("nav",{"aria-label":h(s,"docs","onThisPage"),children:t.jsx("ul",{children:i.map((c,l)=>t.jsx("li",{children:t.jsx(se,{href:`#${c.id}`,$isNested:c.depth>2,$isActive:a?a===c.id:l===0,"aria-current":a===c.id?"location":void 0,onClick:()=>n(c.id),children:c.title})},c.id))})})]})})},re=M.section`
  min-h-[calc(100svh-92*var(--spacing))]
  prose 
  prose-neutral
  max-w-none
  dark:prose-invert
  prose-a:text-primary

  prose-pre:bg-base-200!

  prose-code:rounded!
  prose-code:dark:inset-shadow-2xs

  prose-code:bg-primary/5!
  prose-code:border-primary/15!

  prose-code:dark:bg-primary/10!
  prose-code:dark:border-primary/20!

  prose-p:after:content-none
  prose-p:before:content-none
  prose-blockquote:not-italic
  prose-li:my-1
  [&_blockquote_p]:mt-0
  [&_blockquote_p]:mb-2
  [&_blockquote_ul]:pl-4
  [&_blockquote_ul]:mt-2
  [&_blockquote_li]:mt-2
  [&_blockquote_blockquote]:mt-2
  [&_blockquote_blockquote]:mb-0
  [&_blockquote_blockquote]:bg-base-300/40
  [&_blockquote_blockquote]:pt-2
  [&_blockquote_blockquote]:pb-1
`,ce=({children:e})=>{const s=b(),{locale:a,pageId:n,is404:o,errorWhileRendering:r}=s,i=p(s),c=(s.routeParams.slug??"").replace(/^\/+|\/+$/g,"")||i.defaultSlug,l=o||r,m=l?null:S(c,a,i),g=!l&&(m?.config.tableOfContents??!0),_=`${n}:${c}:${a}`;return t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"absolute w-full h-full top-0 left-0 overflow-hidden",children:t.jsx("div",{className:"w-500 h-200 absolute top-16 -right-100 z-0 opacity-40 dark:opacity-70",children:t.jsx("img",{src:`${D}decorators/dot.png`,alt:"",width:400,height:400,className:"w-full h-full object-fill absolute inset-0"})})}),t.jsx(F,{children:t.jsxs("div",{className:"lg:flex mx-auto gap-10 xl:gap-14",children:[t.jsx("div",{className:"basis-80 shrink-0 relative hidden lg:block",children:t.jsx(te,{})}),t.jsxs("div",{className:"mt-10 flex-1 min-w-0 relative basis-auto shrink",children:[t.jsx(re,{className:"flex-1 z-1 relative","data-doc-content":!0,children:e}),t.jsx(U,{})]}),g&&t.jsx(oe,{headings:m?.headings??[]},_)]})})]})},ge=Object.freeze(Object.defineProperty({__proto__:null,default:ce},Symbol.toStringTag,{value:"Module"})),w={title:"mdex",description:"mdex docs starter kit"},ie=e=>e.replace(/^\/+|\/+$/g,""),le=()=>({title:w.title,description:w.description}),de=e=>{const s=e,a=p(s),o=ie(s.routeParams?.slug??"")||a.defaultSlug;return $(o,s.locale)??le()};function ue(e){return`${de(e)?.title??""} | mdex`}const be=Object.freeze(Object.defineProperty({__proto__:null,default:ue},Symbol.toStringTag,{value:"Module"}));export{ge as a,fe as b,be as i};
