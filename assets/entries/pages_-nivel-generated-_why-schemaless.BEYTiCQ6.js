import{j as e,D as l,i as o,a as s,b as d,o as c}from"../chunks/chunk-DICrpeDx.js";import{u as i,A as r}from"../chunks/chunk-CHf_Dlk6.js";import"../chunks/chunk-BgmFRYZq.js";/* empty css                      */function n(a){const t={a:"a",blockquote:"blockquote",code:"code",em:"em",h2:"h2",li:"li",ol:"ol",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...i(),...a.components};return e.jsxs(e.Fragment,{children:[e.jsx(t.h2,{id:"schemaless-vs-schema-full",className:"scroll-mt-24",children:"Schemaless vs schema-full"}),`
`,e.jsx(t.p,{children:"Comparing RPC to GraphQL or REST is a bit like comparing apples to oranges. They each make trade-offs to achieve different goals."}),`
`,e.jsxs(t.table,{children:[e.jsx(t.thead,{children:e.jsxs(t.tr,{children:[e.jsx(t.th,{children:"RPC"}),e.jsx(t.th,{children:"REST + GraphQL"})]})}),e.jsxs(t.tbody,{children:[e.jsxs(t.tr,{children:[e.jsx(t.td,{children:"Full-stack: client calls server functions"}),e.jsx(t.td,{children:"Separate front- and back-end"})]}),e.jsxs(t.tr,{children:[e.jsx(t.td,{children:"Request tailored to caller's needs"}),e.jsx(t.td,{children:"Consumer-agnostic"})]})]})]}),`
`,e.jsx(t.p,{children:"REST and GraphQL establish stable (but rigid) long-term data contracts. This makes it easier for third-parties to predictably consume your API, but gets in the way of prototyping, and forces the server to respond generically to clients."}),`
`,e.jsx(r,{children:e.jsxs(t.p,{children:["A schema-full approach works best if you ",e.jsx(t.strong,{children:"must fulfill a maximum number of data requirements"}),", or want to allow other apps to be built on your data."]})}),`
`,e.jsx(t.p,{children:"RPC creates unique data contracts between specific pieces of UI and the server-side logic they call. This  allows components to invoke server-side logic as if it was local."}),`
`,e.jsx(t.h2,{id:"rpc",className:"scroll-mt-24",children:"RPC"}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsxs(t.p,{children:["A ",e.jsx(t.a,{href:"https://en.wikipedia.org/wiki/Remote_procedure_call",children:"remote procedure call"})," (RPC) is when a [...] computer programmer writes essentially the same code whether the subroutine is local to the executing program, or remote."]}),`
`]}),`
`,e.jsx(t.p,{children:"RPC is a pattern for calling a remote function as if it were colocated with the client. No adapters or injection needed."}),`
`,e.jsxs(t.ol,{children:[`
`,e.jsx(t.li,{children:"Create named Telefunctions to call the database or do other backend work."}),`
`,e.jsxs(t.li,{children:["Import and call the function from your frontend, passing any required arguments (e.g., ",e.jsx(t.code,{children:"await onNewTodo(text)"}),")."]}),`
`,e.jsx(t.li,{children:"Telefunc creates a lightweight HTTP client to call your Telefunction, which returns only what the caller needs."}),`
`]}),`
`,e.jsx(r,{children:e.jsxs(t.p,{children:["The term RPC is often used loosely to denote RPC-like approaches, like creating JSON endpoints. ",e.jsx(t.em,{children:"RPC-like describes an API that is schemaless — in contrast to RESTful and GraphQL APIs that always have a schema."})]})}),`
`,e.jsx(t.h2,{id:"rpc-vs-graphql-rest",className:"scroll-mt-24",children:"RPC vs GraphQL/REST"}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsx(t.p,{children:"Premature optimization is the root of all evil."}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:e.jsx(t.em,{children:"Turing Award winner, Donal Knuth"})}),`
`]}),`
`]}),`
`,e.jsx(t.p,{children:"In most cases you can start with RPC, and switch to REST or GraphQL as needed."}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"RPC enables you to stay lean, iterating faster and pivoting more flexibly."}),`
`,e.jsx(t.li,{children:"Many apps will never need a public (or schema-full) API."}),`
`,e.jsx(t.li,{children:"RPC functions are just functions; migrating to REST or GraphQL is fairly straightforward."}),`
`]}),`
`,e.jsx(t.p,{children:"There's a simple litmus test for whether RPC is the right solution:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"If your goal is to enable third party developers to access your data, then you need a generic API and you'll have to use REST or GraphQL"}),`
`,e.jsx(t.li,{children:"If your goal is to seamlessly add data and interactivity to a front-end, then RPC can improve DX and enable security and performance optimizations."}),`
`]})]})}function h(a={}){const{wrapper:t}={...i(),...a.components};return t?e.jsx(t,{...a,children:e.jsx(n,{...a})}):n(a)}const u=()=>e.jsx(l,{Content:h}),p=Object.freeze(Object.defineProperty({__proto__:null,default:u},Symbol.toStringTag,{value:"Module"})),f="Why Schemaless? | telefunc",m=Object.freeze(Object.defineProperty({__proto__:null,default:f},Symbol.toStringTag,{value:"Module"})),v={hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{server:!0}}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},onRenderClient:{type:"standard",definedAtData:{filePathToShowToUser:"vike-react/__internal/integration/onRenderClient",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:c}},Page:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/(nivel-generated)/why-schemaless/+Page.tsx",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:p}},hydrationCanBeAborted:{type:"standard",definedAtData:{filePathToShowToUser:"vike-react/config",fileExportPathToShowToUser:["default","hydrationCanBeAborted"]},valueSerialized:{type:"js-serialized",value:!0}},Layout:{type:"cumulative",definedAtData:[{filePathToShowToUser:"/pages/+Layout.tsx",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"plus-file",exportValues:d}]},title:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/(nivel-generated)/why-schemaless/+title.ts",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:m}},Wrapper:{type:"cumulative",definedAtData:[{filePathToShowToUser:"/pages/+Wrapper.tsx",fileExportPathToShowToUser:[]}],valueSerialized:[{type:"plus-file",exportValues:s}]},Loading:{type:"standard",definedAtData:{filePathToShowToUser:"vike-react/__internal/integration/Loading",fileExportPathToShowToUser:[]},valueSerialized:{type:"pointer-import",value:o}}};export{v as configValuesSerialized};
