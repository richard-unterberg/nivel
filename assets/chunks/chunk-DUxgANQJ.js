const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/entries/pages_-docs-_-config-_error.C65BMIi0.js","assets/chunks/chunk-jfLPL1ED.js","assets/chunks/chunk-DaK6MVVs.js","assets/static/components_css_tailwind-80b22bf9.CsdiHR3I.css","assets/chunks/chunk-KaasFFQQ.js","assets/entries/pages_index.CuQE8lDh.js","assets/entries/pages_-docs-_-config-.64phMcjP.js"])))=>i.map(i=>d[i]);
import{t as v,j as h,a as n,b as r,E as P,F as u,h as _,z as H,q as C,G as ie,H as ae,I as re,J as se,K as oe,M as le,N as de,l as F,O as ce,P as he,Q as pe,S as ue,s as G,A as $,T as W,U as ge,W as X,X as ke,Y as fe,Z as me,_ as L,$ as ye,a0 as be,a1 as ve,a2 as Be,a3 as Ee,a4 as we,a5 as Ae,a6 as Ce,a7 as Se}from"./chunk-DaK6MVVs.js";const m=({type:t="info",heading:e,children:i})=>h.jsxs(xe,{$variant:t,children:[e&&h.jsx(Fe,{children:e}),i]}),xe=v.section.variants({base:`
    p-4
    mb-5
    border
    rounded-lg
    prose-p:leading-7
    prose-p:last:mb-0
    prose-p:first:mt-0
    prose-headings:first:mt-0
    prose-headings:last:mb-0
    prose-ul:first:mt-0
    prose-ul:last:mb-0
    prose-div:my-0!
    text-sm
  `,variants:{$variant:{info:"bg-info/5 border-info/30",warning:"bg-warning/5 border-warning/30",error:"bg-error/5 border-error/25",success:"bg-success/5 border-success/35"}},defaultVariants:{$variant:"info"}}),Fe=v.header`
  mt-1
  font-bold
  text-base
  mb-5
`;v.div.variants({base:`
    p-4 py-0 mb-6
    rounded-box border 
  `,variants:{$elevated:{true:`
        shadow
        shadow-base-muted-superlight
        dark:shadow-black
        border-base-muted-light
      `,false:`
        inset-shadow-sm
        inset-shadow-base-muted-light
        dark:inset-shadow-black 
        border-base-muted-light
      `}}});const b=({size:t="md",data:e})=>h.jsxs(Te,{$size:t,children:[h.jsx("thead",{className:"bg-base-200 rounded-t-box overflow-hidden",children:h.jsx("tr",{children:e.headers.map((i,a)=>h.jsx("th",{children:i},a))})}),h.jsx("tbody",{children:e.rows.map((i,a)=>h.jsx("tr",{children:i.map((s,o)=>h.jsx("td",{children:s},o))},a))})]}),Te=v.table.variants({base:`
    not-prose
    table
    w-full
    table-zebra
    mb-6
  `,variants:{$size:{sm:"table-sm",md:"table-md",lg:"table-lg"}},defaultVariants:{$size:"md"}});function z(t){const e={code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...t.components};return r(h.Fragment,{children:[n(e.h1,{id:"telefunc-docs-maintainer-guide",className:"scroll-mt-24",children:"Telefunc docs maintainer guide"}),`
`,n(m,{type:"warning",heading:"Content-only workflow",children:r(e.p,{children:["Work in the MDX content files under ",n(e.code,{children:"pages/(docs)/(content)/**"}),". Reuse the components exported from ",n(e.code,{children:"@/components/index"})," and avoid changing TSX, layout, routing, or theme files unless a developer explicitly asks for it."]})}),`
`,n(e.h2,{id:"where-to-edit",className:"scroll-mt-24",children:"Where to edit"}),`
`,n(b,{data:{headers:["Path","Purpose","Maintainer action"],rows:[["pages/(docs)/(content)/<slug>/content.en.mdx","English source for one doc route","Write and update content"],["pages/(docs)/(content)/<slug>/content.zh.mdx","Chinese translation for the same route","Keep localized content aligned when needed"],["pages/(docs)/(content)/<slug>/content.config.ts","Shared per-document options such as tableOfContents","Only touch when the doc needs a TOC change"],["lib/headings.ts","Doc metadata registry keyed by heading ids","Update titles, navTitle, excerpt, and docPath mappings"],["lib/navigation/menuNavigation.ts","Sidebar groups and link order","Add, remove, or reorder links under the existing groups"],["components/index.tsx","Whitelisted MDX component exports","Import only from here"],["pages/+telefunc.ts","Global docs runtime settings","Read for context, but treat as developer-owned"],["pages/(docs)/(config) and components/**","Rendered layout, routing, and shared UI","Do not edit for normal documentation work"]]}}),`
`,n(m,{type:"info",heading:"Rule of thumb",children:n(e.p,{children:"If the change is prose, examples, headings, links, screenshots, callouts, or tables, it belongs in MDX. If it changes routing, layout, styling, navigation wiring, or React code, hand it back to a developer."})}),`
`,n(e.h2,{id:"working-rules",className:"scroll-mt-24",children:"Working rules"}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:["Every doc route lives in its own folder under ",n(e.code,{children:"pages/(docs)/(content)"}),"."]}),`
`,r(e.li,{children:["The route slug comes from the folder path, so ",n(e.code,{children:"pages/(docs)/(content)/get-started/content.en.mdx"})," becomes ",n(e.code,{children:'<Link href="/get-started">/get-started</Link>'}),"."]}),`
`,r(e.li,{children:["English is the default locale. Non-default locale URLs are prefixed, for example ",n(e.code,{children:"/zh/get-started"}),"."]}),`
`,r(e.li,{children:["Shared per-document settings belong in ",n(e.code,{children:"content.config.ts"})," or ",n(e.code,{children:"content.config.js"}),"; do not create Vike ",n(e.code,{children:"+config.ts"})," files next to MDX content."]}),`
`,r(e.li,{children:["Search and table-of-contents data are extracted from raw MDX, so keep the top ",n(e.code,{children:"#"})," heading, section headings, and link text accurate."]}),`
`]}),`
`,n(e.h2,{id:"navigation-and-page-metadata",className:"scroll-mt-24",children:"Navigation and page metadata"}),`
`,r(e.p,{children:["Use ",n(e.code,{children:"lib/headings.ts"})," when a doc needs metadata or label changes, and use ",n(e.code,{children:"lib/navigation/menuNavigation.ts"})," when a doc needs to move within the sidebar."]}),`
`,n(b,{data:{headers:["Field","Meaning","When to edit it"],rows:[["docPath","The route slug for the document, for example `get-started` or `telefunc-url`","Set it to the doc folder path that the metadata entry belongs to"],["title","The main page title for the document","Edit when the document title itself should change"],["navTitle","An optional shorter or alternate label used in the sidebar instead of `title`","Edit when the full page title is too long or too technical for navigation"],["excerpt","The short page description used for page metadata and doc summaries","Edit when the page description shown in metadata should change"]]}}),`
`,n(m,{type:"info",heading:"How `navTitle` works",children:r(e.p,{children:["If ",n(e.code,{children:"navTitle"})," is omitted, the navigation uses ",n(e.code,{children:"title"}),". Only add ",n(e.code,{children:"navTitle"})," when the sidebar label should differ from the page heading."]})}),`
`,n(e.pre,{className:"shiki shiki-themes github-light one-dark-pro",style:{backgroundColor:"#fff","--shiki-dark-bg":"#282c34",color:"#24292e","--shiki-dark":"#abb2bf"},tabIndex:"0",className:"shiki shiki-themes github-light one-dark-pro doc-code-pre","data-language":"ts","data-language-label":"ts",children:r(e.code,{children:[r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"quickStart"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": {"})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"  docPath"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": "}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"'get-started'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"  title"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": {"})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"    en"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": "}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"'Getting Started with Telefunc'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"  },"})}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"  navTitle"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": {"})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"    en"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": "}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"'Get Started'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"  },"})}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"  excerpt"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": {"})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"    en"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": "}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"'Setup, repo orientation, and the writing rules for this documentation.'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"  },"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"}"})}),`
`,n(e.span,{className:"line"})]})}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:["Edit ",n(e.code,{children:"lib/headings.ts"})," when the document name, short nav label, or description needs to change."]}),`
`,r(e.li,{children:["Edit ",n(e.code,{children:"lib/navigation/menuNavigation.ts"})," when a link should move to another section, appear in a different order, or be removed from the sidebar."]}),`
`,r(e.li,{children:["Keep the keys aligned: the sidebar uses heading keys such as ",n(e.code,{children:"quickStart"}),", which must exist in ",n(e.code,{children:"lib/headings.ts"}),"."]}),`
`]}),`
`,n(e.h2,{id:"how-the-menu-builder-works",className:"scroll-mt-24",children:"How the menu builder works"}),`
`,r(e.p,{children:[n(e.code,{children:"lib/navigation/menuNavigation.ts"})," defines the sidebar as data. The important part is the ",n(e.code,{children:"menuGroups"})," array: each object becomes one sidebar section, and each item in its ",n(e.code,{children:"links"})," array becomes either a doc link or a divider label."]}),`
`,n(b,{data:{headers:["Part","Meaning","What the maintainer can change"],rows:[["id","Stable id for the sidebar section","Usually leave it as-is unless a developer asks for a structural rename"],["icon","Lucide icon shown for the section","Usually leave it alone"],["groupKey","Translation key for the section title","Usually leave it alone unless the section title system changes"],["links","Ordered list of heading keys and divider objects","This is the main place to edit the menu"],["heading key","A string like `quickStart` or `apiTelefunc` that maps to `lib/headings.ts`","Add, remove, or reorder these to control doc links"],["dividerText","A plain label inserted between link groups","Edit when you need sub-sections inside one sidebar group"]]}}),`
`,r(P,{children:[n(e.pre,{className:"shiki shiki-themes github-light one-dark-pro",style:{backgroundColor:"#fff","--shiki-dark-bg":"#282c34",color:"#24292e","--shiki-dark":"#abb2bf"},tabIndex:"0",className:"shiki shiki-themes github-light one-dark-pro doc-code-pre","data-language":"ts","data-language-label":"ts",children:r(e.code,{children:[r(e.span,{className:"line",children:[n(e.span,{style:{color:"#D73A49","--shiki-dark":"#C678DD"},children:"const"}),n(e.span,{style:{color:"#005CC5","--shiki-dark":"#E5C07B"},children:" menuGroups"}),n(e.span,{style:{color:"#D73A49","--shiki-dark":"#56B6C2"},children:" ="}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:" ["})]}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"  {"})}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"    id"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": "}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"'get-started'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"    icon"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": "}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"Sprout"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"    groupKey"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": "}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"'getStarted'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"    links"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": ["})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"      'quickStart'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"      'concepts'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"      { "}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"dividerText"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": "}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"'Guides'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:" },"})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"      'serverIntegration'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"    ],"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"  },"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"]"})}),`
`,n(e.span,{className:"line"})]})}),n(e.pre,{className:"shiki shiki-themes github-light one-dark-pro",style:{backgroundColor:"#fff","--shiki-dark-bg":"#282c34",color:"#24292e","--shiki-dark":"#abb2bf"},tabIndex:"0",className:"shiki shiki-themes github-light one-dark-pro doc-code-pre","data-language":"ts","data-language-label":"ts",children:r(e.code,{children:[r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"quickStart"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": {"})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"  docPath"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": "}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"'get-started'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"  title"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": {"})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#6F42C1","--shiki-dark":"#E06C75"},children:"    en"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:": "}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:"'Quick Start'"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:","})]}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"  },"})}),`
`,n(e.span,{className:"line",children:n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"}"})}),`
`,n(e.span,{className:"line"})]})})]}),`
`,n(m,{type:"info",heading:"How a link is built",children:r(e.p,{children:["A string in ",n(e.code,{children:"links"})," is not the URL itself. It is a heading key. The builder passes that key to ",n(e.code,{children:"getHeadingData()"}),", which reads ",n(e.code,{children:"lib/headings.ts"})," and turns it into the localized sidebar label and href."]})}),`
`,n(m,{type:"info",heading:"Safe editing pattern",children:r(e.p,{children:["First create or update the metadata entry in ",n("code",{children:"lib/headings.ts"}),", then add that key to the right ",n("code",{children:"links"})," array in ",n("code",{children:"lib/navigation/menuNavigation.ts"}),"."]})}),`
`,r(e.ul,{children:[`
`,r(e.li,{children:["To reorder the sidebar, move items up or down within a ",n(e.code,{children:"links"})," array."]}),`
`,r(e.li,{children:["To remove a doc from the sidebar, remove its heading key from ",n(e.code,{children:"links"}),"."]}),`
`,r(e.li,{children:["To add a divider, insert ",n(e.code,{children:"{ dividerText: 'Your label' }"})," where the break should appear."]}),`
`,r(e.li,{children:["To add a new doc link, add the matching heading key after confirming that key exists in ",n(e.code,{children:"lib/headings.ts"}),"."]}),`
`,r(e.li,{children:["Do not put raw URLs into ",n(e.code,{children:"links"}),"; always use heading keys so labels and localized paths stay in sync."]}),`
`]}),`
`,n(e.h2,{id:"approved-mdx-components",className:"scroll-mt-24",children:"Approved MDX components"}),`
`,n(e.p,{children:"Use this import at the top of a doc:"}),`
`,n(e.pre,{className:"shiki shiki-themes github-light one-dark-pro",style:{backgroundColor:"#fff","--shiki-dark-bg":"#282c34",color:"#24292e","--shiki-dark":"#abb2bf"},tabIndex:"0",className:"shiki shiki-themes github-light one-dark-pro doc-code-pre","data-language":"mdx","data-language-label":"mdx",children:r(e.code,{children:[r(e.span,{className:"line",children:[n(e.span,{style:{color:"#D73A49","--shiki-dark":"#C678DD"},children:"import"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:" { "}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"Alert"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:", "}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"CodeGroup"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:", "}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"Link"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:", "}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"Table"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:" } "}),n(e.span,{style:{color:"#D73A49","--shiki-dark":"#C678DD"},children:"from"}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:" '@/components/index'"})]}),`
`,n(e.span,{className:"line"})]})}),`
`,n(b,{data:{headers:["Component","Use it for","Example"],rows:[["Alert","Notes, warnings, and important guidance",'<Alert type="warning" heading="Heads up">...</Alert>'],["CodeGroup","Showing alternative snippets in one framed block","<CodeGroup>{multiple fenced code blocks}</CodeGroup>"],["Link","Internal or external links; internal links keep locale prefixes correct",'<Link href="/intro">Intro</Link>'],["Table","Structured reference tables with headers and rows","<Table data={{ headers: [...], rows: [...] }} />"]]}}),`
`,n(e.h2,{id:"starter-snippets",className:"scroll-mt-24",children:"Starter snippets"}),`
`,r(P,{children:[n(e.pre,{className:"shiki shiki-themes github-light one-dark-pro",style:{backgroundColor:"#fff","--shiki-dark-bg":"#282c34",color:"#24292e","--shiki-dark":"#abb2bf"},tabIndex:"0",className:"shiki shiki-themes github-light one-dark-pro doc-code-pre","data-language":"mdx","data-language-label":"mdx",children:r(e.code,{children:[r(e.span,{className:"line",children:[n(e.span,{style:{color:"#D73A49","--shiki-dark":"#C678DD"},children:"import"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:" { "}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"Alert"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:", "}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"CodeGroup"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:", "}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"Link"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:", "}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#E06C75"},children:"Table"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:" } "}),n(e.span,{style:{color:"#D73A49","--shiki-dark":"#C678DD"},children:"from"}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:" '@/components/index'"})]}),`
`,n(e.span,{className:"line"})]})}),n(e.pre,{className:"shiki shiki-themes github-light one-dark-pro",style:{backgroundColor:"#fff","--shiki-dark-bg":"#282c34",color:"#24292e","--shiki-dark":"#abb2bf"},tabIndex:"0",className:"shiki shiki-themes github-light one-dark-pro doc-code-pre","data-language":"mdx","data-language-label":"mdx",children:r(e.code,{children:[r(e.span,{className:"line",children:[n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"<"}),n(e.span,{style:{color:"#005CC5","--shiki-dark":"#E5C07B"},children:"Alert"}),n(e.span,{style:{color:"#6F42C1","--shiki-light-font-style":"inherit","--shiki-dark":"#D19A66","--shiki-dark-font-style":"italic"},children:" type"}),n(e.span,{style:{color:"#D73A49","--shiki-dark":"#56B6C2"},children:"="}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:'"info"'}),n(e.span,{style:{color:"#6F42C1","--shiki-light-font-style":"inherit","--shiki-dark":"#D19A66","--shiki-dark-font-style":"italic"},children:" heading"}),n(e.span,{style:{color:"#D73A49","--shiki-dark":"#56B6C2"},children:"="}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:'"Internal links"'}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:">"})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"  Use <"}),n(e.span,{style:{color:"#005CC5","--shiki-dark":"#E5C07B"},children:"Link"}),n(e.span,{style:{color:"#6F42C1","--shiki-light-font-style":"inherit","--shiki-dark":"#D19A66","--shiki-dark-font-style":"italic"},children:" href"}),n(e.span,{style:{color:"#D73A49","--shiki-dark":"#56B6C2"},children:"="}),n(e.span,{style:{color:"#032F62","--shiki-dark":"#98C379"},children:'"/intro"'}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:">Link</"}),n(e.span,{style:{color:"#005CC5","--shiki-dark":"#E5C07B"},children:"Link"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"> for links to docs pages so locale prefixes stay correct."})]}),`
`,r(e.span,{className:"line",children:[n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:"</"}),n(e.span,{style:{color:"#005CC5","--shiki-dark":"#E5C07B"},children:"Alert"}),n(e.span,{style:{color:"#24292E","--shiki-dark":"#ABB2BF"},children:">"})]}),`
`,n(e.span,{className:"line"})]})})]}),`
`,n(m,{type:"info",heading:"When to ask a developer",children:r(e.p,{children:["Ask for developer help if you need a new route, a sidebar or navigation change, a new MDX component, a layout tweak, or any change inside ",n(e.code,{children:"components"}),", ",n(e.code,{children:"pages/(docs)/(config)"}),", ",n(e.code,{children:"lib"}),", or the theme files."]})})]})}function De(t={}){const{wrapper:e}=t.components||{};return e?n(e,{...t,children:n(z,{...t})}):z(t)}const Ne=Object.freeze(Object.defineProperty({__proto__:null,default:De},Symbol.toStringTag,{value:"Module"})),Pe=`import { Alert, CodeGroup, Link, Table } from '@/components/index'

# Telefunc docs maintainer guide

<Alert type="warning" heading="Content-only workflow">
  Work in the MDX content files under \`pages/(docs)/(content)/**\`. Reuse the components exported from \`@/components/index\` and avoid changing TSX, layout, routing, or theme files unless a developer explicitly asks for it.
</Alert>

## Where to edit

<Table data={{
  headers: ['Path', 'Purpose', 'Maintainer action'],
  rows: [
    ['pages/(docs)/(content)/<slug>/content.en.mdx', 'English source for one doc route', 'Write and update content'],
    ['pages/(docs)/(content)/<slug>/content.zh.mdx', 'Chinese translation for the same route', 'Keep localized content aligned when needed'],
    ['pages/(docs)/(content)/<slug>/content.config.ts', 'Shared per-document options such as tableOfContents', 'Only touch when the doc needs a TOC change'],
    ['lib/headings.ts', 'Doc metadata registry keyed by heading ids', 'Update titles, navTitle, excerpt, and docPath mappings'],
    ['lib/navigation/menuNavigation.ts', 'Sidebar groups and link order', 'Add, remove, or reorder links under the existing groups'],
    ['components/index.tsx', 'Whitelisted MDX component exports', 'Import only from here'],
    ['pages/+telefunc.ts', 'Global docs runtime settings', 'Read for context, but treat as developer-owned'],
    ['pages/(docs)/(config) and components/**', 'Rendered layout, routing, and shared UI', 'Do not edit for normal documentation work'],
  ]
}} />

<Alert type="info" heading="Rule of thumb">
  If the change is prose, examples, headings, links, screenshots, callouts, or tables, it belongs in MDX. If it changes routing, layout, styling, navigation wiring, or React code, hand it back to a developer.
</Alert>

## Working rules

- Every doc route lives in its own folder under \`pages/(docs)/(content)\`.
- The route slug comes from the folder path, so \`pages/(docs)/(content)/get-started/content.en.mdx\` becomes \`<Link href="/get-started">/get-started</Link>\`.
- English is the default locale. Non-default locale URLs are prefixed, for example \`/zh/get-started\`.
- Shared per-document settings belong in \`content.config.ts\` or \`content.config.js\`; do not create Vike \`+config.ts\` files next to MDX content.
- Search and table-of-contents data are extracted from raw MDX, so keep the top \`#\` heading, section headings, and link text accurate.

## Navigation and page metadata

Use \`lib/headings.ts\` when a doc needs metadata or label changes, and use \`lib/navigation/menuNavigation.ts\` when a doc needs to move within the sidebar.

<Table data={{
  headers: ['Field', 'Meaning', 'When to edit it'],
  rows: [
    ['docPath', 'The route slug for the document, for example \`get-started\` or \`telefunc-url\`', 'Set it to the doc folder path that the metadata entry belongs to'],
    ['title', 'The main page title for the document', 'Edit when the document title itself should change'],
    ['navTitle', 'An optional shorter or alternate label used in the sidebar instead of \`title\`', 'Edit when the full page title is too long or too technical for navigation'],
    ['excerpt', 'The short page description used for page metadata and doc summaries', 'Edit when the page description shown in metadata should change'],
  ]
}} />

<Alert type="info" heading="How \`navTitle\` works">
  If \`navTitle\` is omitted, the navigation uses \`title\`. Only add \`navTitle\` when the sidebar label should differ from the page heading.
</Alert>

\`\`\`ts
quickStart: {
  docPath: 'get-started',
  title: {
    en: 'Getting Started with Telefunc',
  },
  navTitle: {
    en: 'Get Started',
  },
  excerpt: {
    en: 'Setup, repo orientation, and the writing rules for this documentation.',
  },
}
\`\`\`

- Edit \`lib/headings.ts\` when the document name, short nav label, or description needs to change.
- Edit \`lib/navigation/menuNavigation.ts\` when a link should move to another section, appear in a different order, or be removed from the sidebar.
- Keep the keys aligned: the sidebar uses heading keys such as \`quickStart\`, which must exist in \`lib/headings.ts\`.

## How the menu builder works

\`lib/navigation/menuNavigation.ts\` defines the sidebar as data. The important part is the \`menuGroups\` array: each object becomes one sidebar section, and each item in its \`links\` array becomes either a doc link or a divider label.

<Table data={{
  headers: ['Part', 'Meaning', 'What the maintainer can change'],
  rows: [
    ['id', 'Stable id for the sidebar section', 'Usually leave it as-is unless a developer asks for a structural rename'],
    ['icon', 'Lucide icon shown for the section', 'Usually leave it alone'],
    ['groupKey', 'Translation key for the section title', 'Usually leave it alone unless the section title system changes'],
    ['links', 'Ordered list of heading keys and divider objects', 'This is the main place to edit the menu'],
    ['heading key', 'A string like \`quickStart\` or \`apiTelefunc\` that maps to \`lib/headings.ts\`', 'Add, remove, or reorder these to control doc links'],
    ['dividerText', 'A plain label inserted between link groups', 'Edit when you need sub-sections inside one sidebar group'],
  ]
}} />

<CodeGroup>
\`\`\`ts
const menuGroups = [
  {
    id: 'get-started',
    icon: Sprout,
    groupKey: 'getStarted',
    links: [
      'quickStart',
      'concepts',
      { dividerText: 'Guides' },
      'serverIntegration',
    ],
  },
]
\`\`\`

\`\`\`ts
quickStart: {
  docPath: 'get-started',
  title: {
    en: 'Quick Start',
  },
}
\`\`\`
</CodeGroup>

<Alert type="info" heading="How a link is built">
  A string in \`links\` is not the URL itself. It is a heading key. The builder passes that key to \`getHeadingData()\`, which reads \`lib/headings.ts\` and turns it into the localized sidebar label and href.
</Alert>

<Alert type="info" heading="Safe editing pattern">
  First create or update the metadata entry in <code>lib/headings.ts</code>, then add that key to the right <code>links</code> array in <code>lib/navigation/menuNavigation.ts</code>.
</Alert>

- To reorder the sidebar, move items up or down within a \`links\` array.
- To remove a doc from the sidebar, remove its heading key from \`links\`.
- To add a divider, insert \`{ dividerText: 'Your label' }\` where the break should appear.
- To add a new doc link, add the matching heading key after confirming that key exists in \`lib/headings.ts\`.
- Do not put raw URLs into \`links\`; always use heading keys so labels and localized paths stay in sync.

## Approved MDX components

Use this import at the top of a doc:

\`\`\`mdx
import { Alert, CodeGroup, Link, Table } from '@/components/index'
\`\`\`

<Table data={{
  headers: ['Component', 'Use it for', 'Example'],
  rows: [
    ['Alert', 'Notes, warnings, and important guidance', '<Alert type="warning" heading="Heads up">...</Alert>'],
    ['CodeGroup', 'Showing alternative snippets in one framed block', '<CodeGroup>{multiple fenced code blocks}</CodeGroup>'],
    ['Link', 'Internal or external links; internal links keep locale prefixes correct', '<Link href="/intro">Intro</Link>'],
    ['Table', 'Structured reference tables with headers and rows', '<Table data={{ headers: [...], rows: [...] }} />'],
  ]
}} />

## Starter snippets

<CodeGroup>
\`\`\`mdx
import { Alert, CodeGroup, Link, Table } from '@/components/index'
\`\`\`

\`\`\`mdx
<Alert type="info" heading="Internal links">
  Use <Link href="/intro">Link</Link> for links to docs pages so locale prefixes stay correct.
</Alert>
\`\`\`
</CodeGroup>

<Alert type="info" heading="When to ask a developer">
  Ask for developer help if you need a new route, a sidebar or navigation change, a new MDX component, a layout tweak, or any change inside \`components\`, \`pages/(docs)/(config)\`, \`lib\`, or the theme files.
</Alert>
`;function Le(t){return n(h.Fragment,{})}function ze(t={}){return n(Pe,{...t,children:n(Le,{...t})})}const T=t=>t.replace(/\s+/g," ").trim(),je=t=>T(t).normalize("NFKD").toLowerCase().replace(/['"]/g,"").replace(/[^\p{Letter}\p{Number}\s-]/gu," ").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"")||"section",Oe=()=>{const t=new Map;return e=>{const i=je(e),a=t.get(i)??0;return t.set(i,a+1),a===0?i:`${i}-${a}`}},Ie=t=>T(t.replace(/!\[([^\]]*)\]\([^)]+\)/g,"$1").replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/`([^`]+)`/g,"$1").replace(/<[^>]+>/g," ").replace(/\\([\\`*_[\]{}()#+\-.!])/g,"$1").replace(/[*_~]/g,"").replace(/\{[^}]+\}/g," ")),Ue=t=>t.match(/^\s{0,3}(`{3,}|~{3,})/)?.[1]?.[0]??null,Re=(t,e=2,i=3)=>{const a=Oe(),s=[];let o=null;for(const l of t.split(`
`)){const c=Ue(l);if(o){c===o&&(o=null);continue}if(c){o=c;continue}const y=l.match(/^\s{0,3}(#{1,6})\s+(.*?)(?:\s+#+\s*)?$/);if(!y)continue;const d=y[1].length,p=Ie(y[2]??"");if(!p)continue;const f=a(p);d<e||d>i||s.push({depth:d,id:f,title:p})}return s},On=t=>T(t),S=t=>t.replace(/^\/+|\/+$/g,""),V=t=>_[t],Me=t=>{const e=S(t);return Object.values(_).find(i=>S(i.docPath)===e)},_e=(t,e)=>ie(V(t).docPath,e),He=(t,e=u,i)=>{const a=H(e),s=V(t);return{docPath:S(s.docPath),title:s.navTitle?.[a]??s.title[a],href:C(_e(t,i),a),description:s.excerpt?.[a]??null}},In=(t,e=u,i)=>{const{title:a,href:s}=He(t,e,i);return{title:a,href:s}},Un=(t,e=u)=>{const i=Me(t);if(!i)return null;const a=H(e);return{title:i.title[a],description:i.excerpt?.[a]??null}},K=Object.assign({"../../pages/(docs)/(content)/get-started/content.en.mdx":Ne}),Ge=Object.assign({"../../pages/(docs)/(content)/get-started/content.en.mdx":ze}),$e=Object.assign({}),We=t=>typeof t=="string"?t:typeof t?.default=="string"?t.default:"",q=t=>t.filter(e=>e!==""&&!(e.startsWith("(")&&e.endsWith(")"))),D=t=>{const e=t.match(/\/pages\/(.+)$/);if(!e)return null;const i=e[1].split("/").filter(Boolean),a=i.at(-1);return a?{segments:i.slice(0,-1),filename:a}:null},Q=t=>{const e=t.indexOf("(content)");return e<0?null:q(t.slice(e+1)).join("/")},Xe=()=>{const t=Object.keys(K)[0],e=t?D(t):null;if(!e)return[];const i=e.segments.indexOf("(content)");return i<0?[]:e.segments.slice(0,i)},E=Xe(),Y=t=>{const e=D(t);if(!e)return null;const i=e.filename.match(/^content\.([^.]+)\.mdx$/);if(!i)return null;const[,a]=i;if(!ae(a))return null;const s=Q(e.segments);return s===null?null:{locale:a,routeId:s}},Ve=t=>{const e=D(t);if(!e||!/^content\.config\.[^.]+$/.test(e.filename))return null;const i=Q(e.segments);return i!==null?i:E.length===0||!E.every((s,o)=>e.segments[o]===s)?null:q(e.segments.slice(E.length)).join("/")},Ke=t=>{const e=t.split("/").filter(Boolean),i=[""];for(let a=0;a<e.length;a+=1)i.push(e.slice(0,a+1).join("/"));return i},g={},x=new Map;for(const[t,e]of Object.entries(K)){const i=Y(t);if(!i)continue;g[i.routeId]??={},g[i.routeId][i.locale]??={};const a=g[i.routeId][i.locale];a&&(a.Page=e.default,a.config=e.docConfig)}for(const[t,e]of Object.entries(Ge)){const i=Y(t);if(!i)continue;g[i.routeId]??={},g[i.routeId][i.locale]??={};const a=g[i.routeId][i.locale];if(a){const s=We(e);a.headings=Re(s),a.source=s}}for(const[t,e]of Object.entries($e)){const i=Ve(t);if(i!==null){if(x.has(i))throw new Error(`Duplicate content.config for logical route "${i||"/"}". Keep only one config file for that docs path.`);x.set(i,e.default??{})}}const qe=t=>Ke(t).reduce((e,i)=>({...e,...x.get(i)??{}}),{}),Rn=(t,e,i)=>{const a=g[t];if(!a)return null;const s=a[e]??a[u];if(!s?.Page)return null;const l={...re(i??se).defaultDocConfig,...qe(t),...a[u]?.config??{},...a[e]?.config??{}};return{Page:s.Page,headings:s.headings??[],config:l,resolvedLocale:a[e]?e:u}},J=t=>Qe().includes(t.replace(/^\/+|\/+$/g,"")),j=(t,e)=>{const i=t.replace(/^\/+|\/+$/g,"");return!!g[i]?.[e]?.Page},Qe=()=>Object.keys(g).sort((t,e)=>t.localeCompare(e));function Ye(){window.addEventListener("popstate",Je)}async function Je(){oe("onPopState()");const t=le();if(t.skip)return;const{previous:e,current:i}=t;await Ze(e,i)}async function Ze(t,e){const i=e.state.vike.scrollPosition||void 0;if(O(e.url)===O(t.url)&&e.url!==t.url){de(i);return}const o=e.state.vike.triggeredBy==="user"||t.state.vike.triggeredBy==="user",l=!e.state.vike.timestamp||!t.state.vike.timestamp?null:e.state.vike.timestamp<t.state.vike.timestamp;await F({scrollTarget:i,isBackwardNavigation:l,doNotRenderIfSamePage:o,isHistoryNavigation:!0})}function O(t){return t.split("#")[0]}function en(){document.addEventListener("click",nn)}async function nn(t){if(!tn(t))return;const e=an(t.target);if(!e)return;const i=e.getAttribute("href");if(i===null||ce(e))return;if(i.includes("#")&&he(i)){t.preventDefault(),pe(i.split("#")[1]);return}if(ue(e))return;t.preventDefault();let a;{const s=e.getAttribute("keep-scroll-position");s!==null&&(a={preserveScroll:s!=="false"})}await F({scrollTarget:a,urlOriginal:i})}function tn(t){return t.button===0&&!t.ctrlKey&&!t.shiftKey&&!t.altKey&&!t.metaKey}function an(t){for(;t.tagName!=="A";){const{parentNode:e}=t;if(!e)return null;t=e}return t}const rn="modulepreload",sn=function(t){return"/vike-docpress/"+t},I={},w=function(e,i,a){let s=Promise.resolve();if(i&&i.length>0){let y=function(d){return Promise.all(d.map(p=>Promise.resolve(p).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=l?.nonce||l?.getAttribute("nonce");s=y(i.map(d=>{if(d=sn(d),d in I)return;I[d]=!0;const p=d.endsWith(".css"),f=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${f}`))return;const k=document.createElement("link");if(k.rel=p?"stylesheet":rn,p||(k.as="script"),k.crossOrigin="",k.href=d,c&&k.setAttribute("nonce",c),document.head.appendChild(k),p)return new Promise((ne,te)=>{k.addEventListener("load",ne),k.addEventListener("error",()=>te(new Error(`Unable to preload CSS for ${d}`)))})}))}function o(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return s.then(l=>{for(const c of l||[])c.status==="rejected"&&o(c.reason);return e().catch(o)})},on=t=>{const e=G(t.urlPathname).pathname,i=$(e);return i===null||!J(i)?!1:{routeParams:{slug:i}}},U=Object.freeze(Object.defineProperty({__proto__:null,default:on},Symbol.toStringTag,{value:"Module"}));function R(t,e){return Object.fromEntries(Object.entries(t).filter(e))}function ln(t,e){const i=W(t,"/"),a=e.pathname??i.pathnameOriginal;ge(a,"modify.pathname");let s=e.search===null?"":e.search?dn(i,e.search):i.searchOriginal;s==="?"&&(s="");let o;return e.hash===null?o="":e.hash===void 0?o=i.hashOriginal??"":(o=e.hash,o.startsWith("#")||(o="#"+o)),X(i.origin,a,s,o)}function dn(t,e){let i;if(e instanceof URLSearchParams)i=e;else{const a=R({...t.search,...R(e,cn)},ke);i=new URLSearchParams(a)}return"?"+i.toString()}function cn(t){return t[1]!==void 0}function A(t,e){t=ln(t,e);const i=W(t,"/"),a=[e.protocol??i.protocol??"",e.hostname??i.hostname??""],s=e.port??i.port;(s||s===0)&&a.push(`:${s}`);const o=a.join("");return X(o,i.pathname,i.searchOriginal,i.hashOriginal)}const hn=t=>{const e=$(t);return e!==null&&J(e)?e:null},pn=t=>{const e=t.urlParsed.pathname,i=fe(e),{locale:a,pathname:s}=G(e),o=hn(s),l=i?null:me();if(i&&a!==u&&o&&!j(o,a))throw L(A(t.urlOriginal,{pathname:C(s,u)}));if(typeof window<"u"&&!i&&l&&l!==u&&(!o||j(o,l)))throw L(A(t.urlOriginal,{pathname:C(s,l)}));return{pageContext:{locale:a,urlPathnameLocalized:e,urlLogical:A(t.urlOriginal,{pathname:s})}}},un=Object.freeze(Object.defineProperty({__proto__:null,default:pn},Symbol.toStringTag,{value:"Module"})),N={},Z={},gn={},B={},kn=[],ee={},fn=[{pageId:"/pages/(docs)/(config)/_error",isErrorPage:!0,routeFilesystem:void 0,loadVirtualFilePageEntry:()=>({moduleId:"virtual:vike:page-entry:client:/pages/(docs)/(config)/_error",moduleExportsPromise:w(()=>import("../entries/pages_-docs-_-config-_error.C65BMIi0.js"),__vite__mapDeps([0,1,2,3,4]))}),configValuesSerialized:{hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{client:!0,server:!0}}},route:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/(docs)/(config)/+route.ts",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:U}},clientRouting:{type:"standard",definedAtData:{filePathToShowToUser:"vike-react/config",fileExportPathToShowToUser:["default","clientRouting"]},valueSerialized:{type:"js-serialized",value:!0}}}},{pageId:"/pages/index",isErrorPage:void 0,routeFilesystem:{routeString:"/",definedAtLocation:"/pages/index/"},loadVirtualFilePageEntry:()=>({moduleId:"virtual:vike:page-entry:client:/pages/index",moduleExportsPromise:w(()=>import("../entries/pages_index.CuQE8lDh.js"),__vite__mapDeps([5,1,2,3]))}),configValuesSerialized:{hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},clientRouting:{type:"standard",definedAtData:{filePathToShowToUser:"vike-react/config",fileExportPathToShowToUser:["default","clientRouting"]},valueSerialized:{type:"js-serialized",value:!0}}}},{pageId:"/pages/(docs)/(config)",isErrorPage:void 0,routeFilesystem:{routeString:"/",definedAtLocation:"/pages/(docs)/(config)/"},loadVirtualFilePageEntry:()=>({moduleId:"virtual:vike:page-entry:client:/pages/(docs)/(config)",moduleExportsPromise:w(()=>import("../entries/pages_-docs-_-config-.64phMcjP.js"),__vite__mapDeps([6,1,2,3,4]))}),configValuesSerialized:{hasServerOnlyHook:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!1}},isClientRuntimeLoaded:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:!0}},onBeforeRenderEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},dataEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:null}},guardEnv:{type:"computed",definedAtData:null,valueSerialized:{type:"js-serialized",value:{client:!0,server:!0}}},route:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/(docs)/(config)/+route.ts",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:U}},clientRouting:{type:"standard",definedAtData:{filePathToShowToUser:"vike-react/config",fileExportPathToShowToUser:["default","clientRouting"]},valueSerialized:{type:"js-serialized",value:!0}}}}],mn={configValuesSerialized:{onBeforeRoute:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+onBeforeRoute.ts",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:un}},telefunc:{type:"standard",definedAtData:{filePathToShowToUser:"/pages/+telefunc.ts",fileExportPathToShowToUser:[]},valueSerialized:{type:"plus-file",exportValues:ye}}}},yn=Object.assign({}),bn={...yn};N[".page"]=bn;const vn=Object.assign({}),Bn={...vn};B[".page"]=Bn;const En=Object.assign({}),wn={...En};B[".page.server"]=wn;const An=Object.assign({}),Cn={...An};Z[".page.route"]=Cn;const Sn=Object.assign({}),xn={...Sn};N[".page.client"]=xn;const Fn=Object.assign({}),Tn={...Fn};B[".page.client"]=Tn;const Dn=Object.assign({}),Nn={...Dn};ee[".page.server"]=Nn;const Pn=Object.freeze(Object.defineProperty({__proto__:null,neverLoaded:ee,pageConfigGlobalSerialized:mn,pageConfigsSerialized:fn,pageFilesEager:Z,pageFilesExportNamesEager:B,pageFilesExportNamesLazy:gn,pageFilesLazy:N,pageFilesList:kn},Symbol.toStringTag,{value:"Module"})),M=Be("initClientRouter.ts",{});function Mn(){be(Pn),!M.done&&(M.done=!0,zn(),Ln(),en(),ve())}function Ln(){Ce(Se()===0),F({scrollTarget:{preserveScroll:!0},isClientSideNavigation:!1})}function zn(){Ee(),we(),Ae(),Ye()}export{He as a,In as b,Oe as c,Un as d,Rn as g,Mn as i,On as n};
