import { c as create_ssr_component } from "../../chunks/ssr.js";
const css = {
  code: ".app.svelte-158whl3{min-height:100vh}main.svelte-158whl3{flex:1;display:flex;flex-direction:column;margin:0 auto;box-sizing:border-box}",
  map: `{"version":3,"file":"+layout.svelte","sources":["+layout.svelte"],"sourcesContent":["<script>\\n  //import Header from './Header.svelte';\\n  import \\"../app.css\\";\\n<\/script>\\n\\n<div class=\\"app\\">\\n  <!-- <Header /> -->\\n\\n  <main>\\n    <slot />\\n  </main>\\n</div>\\n\\n<style>\\n  .app {\\n    min-height: 100vh;\\n  }\\n\\n  main {\\n    flex: 1;\\n    display: flex;\\n    flex-direction: column;\\n    margin: 0 auto;\\n    box-sizing: border-box;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAcE,mBAAK,CACH,UAAU,CAAE,KACd,CAEA,mBAAK,CACH,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,UAAU,CAAE,UACd"}`
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app svelte-158whl3"> <main class="svelte-158whl3">${slots.default ? slots.default({}) : ``}</main> </div>`;
});
export {
  Layout as default
};
