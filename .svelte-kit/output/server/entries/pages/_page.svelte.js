import { c as create_ssr_component, e as escape, d as add_attribute, f as each, v as validate_component } from "../../chunks/ssr.js";
import "bootstrap";
const hash = (val) => crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(val)).then((h) => {
  let hexes = [], view = new DataView(h);
  for (let i = 0; i < view.byteLength; i += 4)
    hexes.push(("00000000" + view.getUint32(i).toString(16)).slice(-8));
  return hexes.join("");
});
const css$1 = {
  code: ".card-header.svelte-rb12wf>button.svelte-rb12wf{padding:0.3rem;line-height:0}.input-group.svelte-rb12wf.svelte-rb12wf{transition:0.3s}.header-input.svelte-rb12wf.svelte-rb12wf{border-radius:0.5rem;transition:0.3s}.highlighted.svelte-rb12wf.svelte-rb12wf{box-shadow:2px 2px 7px 3px #009fff}.blockValid.svelte-rb12wf.svelte-rb12wf{background-color:rgba(200, 255, 200, 0.7)}.blockInvalid.svelte-rb12wf.svelte-rb12wf{background-color:rgba(255, 200, 200, 0.7)}.card-body.svelte-rb12wf.svelte-rb12wf{flex:0 0;display:block}.card.svelte-rb12wf.svelte-rb12wf{width:400px;min-width:400px;margin-left:1rem;margin-right:1rem}.transactionRow.svelte-rb12wf>div.svelte-rb12wf{margin-top:0.3rem;margin-bottom:0.3rem}.row.svelte-rb12wf.svelte-rb12wf{transition:0.3s}.transactionRow.svelte-rb12wf.svelte-rb12wf{margin-top:0.5rem;border-radius:0.5rem;background-color:rgb(200, 231, 241, 0.7)}.block-header.svelte-rb12wf.svelte-rb12wf{background-color:rgba(194, 194, 194, 0.4);box-shadow:3px 3px 35px 4px rgba(201, 201, 201, 0.578);transition:all 0.3s;padding:0.5rem 1rem;border-radius:0.5rem;border:1px solid rgb(163, 163, 163)}.block-header.svelte-rb12wf.svelte-rb12wf:hover{box-shadow:3px 3px 15px 7px rgba(175, 175, 175, 0.578)}",
  map: `{"version":3,"file":"Block.svelte","sources":["Block.svelte"],"sourcesContent":["<script>\\n  import { slide } from \\"svelte/transition\\";\\n  import { onMount } from \\"svelte\\";\\n  import { hash } from \\"./hash.js\\";\\n\\n  export const prerender = false;\\n\\n  export let parentDeleteBlock;\\n  export let blockData = {\\n    id: \\"?\\",\\n    previousHash: \\"\\",\\n    transactionHash: \\"\\",\\n    nonce: \\"\\",\\n    headerHash: \\"\\",\\n    transactions: [{ amount: \\"\\", from: \\"\\", to: \\"\\" }],\\n    blockValid: false,\\n  };\\n\\n  export let hintText = \\"\\";\\n\\n  export let highlightedPreviousHash = \\"\\";\\n  let highlighted = \\"\\";\\n\\n  export let activateMining = false;\\n  let isMining = false;\\n  let elapsedTime = 0;\\n  let timer;\\n\\n  let worker;\\n\\n  function createWorker() {\\n    return new Worker(new URL(\\"./minerWorker.js\\", import.meta.url));\\n  }\\n\\n  function terminateWorker() {\\n    if (worker) {\\n      worker.terminate();\\n      worker = null;\\n      isMining = false;\\n      clearInterval(timer);\\n    }\\n  }\\n\\n  function restartWorker() {\\n    terminateWorker();\\n    worker = createWorker();\\n    worker.onmessage = function (e) {\\n      const nonce = e.data;\\n      blockData.nonce = Number(nonce);\\n      isMining = false;\\n      clearInterval(timer);\\n    };\\n  }\\n\\n  onMount(() => {\\n    restartWorker();\\n  });\\n\\n  async function updateTransactionHash(transactions) {\\n    let s = transactions.map((t) => \`\${t.from}\${t.to}\${t.amount}\`).join(\\"\\");\\n    hash(s).then((h) => {\\n      if (blockData.transactionHash !== h) blockData.transactionHash = h;\\n    });\\n  }\\n\\n  async function updateBlockHash(previousHash, transactionHash, nonce) {\\n    let s = \`\${nonce}\${previousHash}\${transactionHash}\`;\\n    hash(s).then((h) => {\\n      if (blockData.headerHash !== h) blockData.headerHash = h;\\n    });\\n  }\\n\\n  $: updateTransactionHash(blockData.transactions);\\n  $: updateBlockHash(\\n    blockData.previousHash,\\n    blockData.transactionHash,\\n    blockData.nonce\\n  );\\n\\n  function addTransaction() {\\n    blockData.transactions = [\\n      ...blockData.transactions,\\n      { amount: \\"\\", from: \\"\\", to: \\"\\" },\\n    ];\\n  }\\n\\n  function hintNonce() {\\n    hintText =\\n      \\"<ul><li>Die Nonce ('number used once') wird nur für das <b>Block-Mining</b> (siehe unterer Knopf) benötigt.</li><li>Sie ist eine <em>'zufällige/willkürliche'</em> natürliche Zahl, die in die Berechnung des Header-Hashs einfließt. Der Mining-Computer probiert der Reihe nach alle natürlichen Zahlen durch, bis der <b>Hash des Headers</b> mit einer bestimmten Anzahl an Nullen beginnt.</li></ul>\\";\\n  }\\n\\n  function hintPreviousHash() {\\n    hintText =\\n      \\"<ul><li>Der <b>Hash des Headers</b> des <u>vorherigen</u> Blocks muss im aktuellen Block gespeichert werden. Nur, wenn beide Hashes <b>übereinstimmen</b>, ist der vorherige Block gültig.</li><li>Der erste Block hat keinen Vorgänger und trägt daher an dieser Stelle eine 0er-Folge.</li></ul>\\";\\n    highlightedPreviousHash = blockData.id;\\n  }\\n\\n  function hintTransactionHash() {\\n    hintText =\\n      \\"Dieser SHA-256 Hash wird aus allen Transaktionen berechnet.<br><ul><li>In Echt kommt dabei der <a target='_blank' href='https://de.wikipedia.org/wiki/Hash-Baum'>Merkle-Tree</a> zum Einsatz.</li><li>In dieser Demo wird aus allen Transaktionen einfach ein langer String gebaut (<code>Von0Zu0Betrag0Von1Zu1Betrag1...</code>), der dann gehasht wird.</li></ul>\\";\\n    highlighted = \\"transactions\\";\\n  }\\n\\n  function hintHeader() {\\n    hintText =\\n      \\"Der SHA-256 Hash des Headers wird aus \\" +\\n      (activateMining ? \\"der <u>Nonce</u>, \\" : \\"\\") +\\n      \\"dem <u>Hash des vorherigen Headers</u> und dem <u>Transaktionshash</u> berechnet.\\";\\n    highlighted = \\"header\\";\\n  }\\n\\n  function hintMining() {\\n    hintText =\\n      \\"<ul><li>Beim Mining wird die <b>Nonce</b> so lange verändert, bis der Hash des Headers mit einer bestimmten Anzahl an Nullen beginnt (hier 4).</li><li>Sobald jemand diesen Wert gefunden hat, wird der Block als <b>gemined</b> betrachtet und an die Blockchain angehängt. Im Durchschnitt findet nur <b>ein PC</b> weltweit <b>alle 10 Minuten</b> die passende Nonce für einen solchen Hash.</li><li>Damit die nötige Zeit zum Block-Minen trotz steigender Rechenleistung bei etwa 10 Minuten bleibt, wird regelmäßig die Schwierigkeit angepasst. Dazu wird die Anzahl der Nullen, mit denen der Hash beginnen muss, erhöht oder verringert.</li><li>Warum man das extrem energieverschwendende Mining überhaupt benötigt, kannst du im Wiki nachlesen.</li></ul>\\";\\n  }\\n\\n  function removeHighlight() {\\n    highlighted = \\"\\";\\n    highlightedPreviousHash = \\"\\";\\n  }\\n\\n  function startMining() {\\n    if (isMining) {\\n      restartWorker();\\n      return;\\n    }\\n    isMining = true;\\n\\n    elapsedTime = 0;\\n    timer = setInterval(() => {\\n      elapsedTime++;\\n    }, 1000);\\n\\n    worker.postMessage({\\n      previousHash: blockData.previousHash,\\n      transactionHash: blockData.transactionHash,\\n    });\\n  }\\n\\n  function deleteBlock(id) {\\n    return () => {\\n      terminateWorker();\\n      parentDeleteBlock(id);\\n    };\\n  }\\n<\/script>\\n\\n<div class=\\"card mb-3 {blockData.blockValid ? 'blockValid' : 'blockInvalid'}\\">\\n  <div class=\\"card-header d-flex justify-content-between\\">\\n    Block #{blockData.id}\\n    <button\\n      type=\\"button\\"\\n      class=\\"btn btn-outline-danger\\"\\n      on:click={deleteBlock(blockData.id)}\\n    >\\n      <svg\\n        width=\\"1em\\"\\n        height=\\"0.9em\\"\\n        xmlns=\\"http://www.w3.org/2000/svg\\"\\n        viewBox=\\"0 0 448 512\\"\\n        ><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path\\n          d=\\"M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z\\"\\n        /></svg\\n      >\\n    </button>\\n  </div>\\n  <div class=\\"card-body\\">\\n    <div class=\\"block-header\\">\\n      <h5 class=\\"card-title mb-3\\">Header</h5>\\n      <div class=\\"header-input {highlighted === 'header' ? 'highlighted' : ''}\\">\\n        {#if activateMining}\\n          <div class=\\"row g-2 align-items-center\\" transition:slide|global>\\n            <div\\n              class=\\"input-group mb-2\\"\\n              on:mouseover={hintNonce}\\n              on:focus={hintNonce}\\n              on:mouseleave={removeHighlight}\\n              role=\\"paragraph\\"\\n            >\\n              <span class=\\"input-group-text\\" id=\\"nonce\\">Nonce</span>\\n              <input\\n                type=\\"number\\"\\n                class=\\"form-control\\"\\n                placeholder=\\"\\"\\n                bind:value={blockData.nonce}\\n              />\\n            </div>\\n          </div>\\n        {/if}\\n        <div class=\\"row g-2 align-items-center\\">\\n          <div\\n            class=\\"input-group mb-2 {highlightedPreviousHash === blockData.id\\n              ? 'highlighted'\\n              : ''}\\"\\n            on:mouseover={hintPreviousHash}\\n            on:focus={hintPreviousHash}\\n            on:mouseleave={removeHighlight}\\n            role=\\"paragraph\\"\\n          >\\n            <span class=\\"input-group-text\\" id=\\"basic-addon1\\"\\n              >Vorheriger Hash</span\\n            >\\n            <input\\n              type=\\"text\\"\\n              class=\\"form-control\\"\\n              bind:value={blockData.previousHash}\\n            />\\n          </div>\\n        </div>\\n        <div class=\\"row g-2 align-items-center\\" id=\\"transactionHash\\">\\n          <div\\n            class=\\"input-group mb-2\\"\\n            on:mouseover={hintTransactionHash}\\n            on:focus={hintTransactionHash}\\n            on:mouseleave={removeHighlight}\\n            role=\\"paragraph\\"\\n          >\\n            <span class=\\"input-group-text\\" id=\\"basic-addon1\\"\\n              >Transaktionshash</span\\n            >\\n            <input\\n              type=\\"text\\"\\n              class=\\"form-control\\"\\n              disabled\\n              bind:value={blockData.transactionHash}\\n            />\\n          </div>\\n        </div>\\n      </div>\\n      <hr />\\n      <div class=\\"row g-2 align-items-center\\">\\n        <div\\n          class=\\"input-group mb-2 {highlightedPreviousHash === blockData.id + 1\\n            ? 'highlighted'\\n            : ''}\\"\\n          on:mouseover={hintHeader}\\n          on:focus={hintHeader}\\n          on:mouseleave={removeHighlight}\\n          role=\\"paragraph\\"\\n        >\\n          <span class=\\"input-group-text\\" id=\\"basic-addon1\\"\\n            >Hash des Headers</span\\n          >\\n          <input\\n            type=\\"text\\"\\n            class=\\"form-control\\"\\n            disabled\\n            bind:value={blockData.headerHash}\\n          />\\n        </div>\\n      </div>\\n      {#if activateMining}\\n        <div class=\\"row g-2 d-flex\\" transition:slide|global>\\n          <button\\n            type=\\"button\\"\\n            class=\\"btn {isMining ? 'btn-danger' : 'btn-primary'} ms-auto\\"\\n            on:mouseover={hintMining}\\n            on:focus={hintMining}\\n            on:mouseleave={removeHighlight}\\n            on:click={startMining}\\n          >\\n            {#if isMining}\\n              <div class=\\"spinner-border spinner-border-sm\\" role=\\"status\\">\\n                <span class=\\"visually-hidden\\">Loading...</span>\\n              </div>\\n              Laufzeit: {elapsedTime}s - Klicken zum Stoppen!\\n            {:else}\\n              Block minen\\n            {/if}\\n          </button>\\n        </div>\\n      {/if}\\n    </div>\\n  </div>\\n  <div class=\\"card-body\\">\\n    <h5 class=\\"card-title\\">Transaktionen</h5>\\n    {#each blockData.transactions as transaction, i (i)}\\n      <div\\n        class=\\"row g-3 align-items-center mb-2 transactionRow {highlighted ===\\n        'transactions'\\n          ? 'highlighted'\\n          : ''}\\"\\n        id=\\"transaction{i}\\"\\n      >\\n        <div class=\\"col\\">\\n          <div class=\\"form-floating\\">\\n            <input\\n              type=\\"text\\"\\n              class=\\"form-control\\"\\n              id=\\"transactionFrom\\"\\n              placeholder=\\"Absender\\"\\n              bind:value={transaction.from}\\n            />\\n            <label for=\\"transactionFrom\\">Von</label>\\n          </div>\\n        </div>\\n        <div class=\\"col\\">\\n          <div class=\\"form-floating\\">\\n            <input\\n              type=\\"text\\"\\n              class=\\"form-control\\"\\n              id=\\"transactionTo\\"\\n              placeholder=\\"Empfänger\\"\\n              bind:value={transaction.to}\\n            />\\n            <label for=\\"transactionTo\\">Zu</label>\\n          </div>\\n        </div>\\n        <div class=\\"col\\">\\n          <div class=\\"form-floating\\">\\n            <input\\n              type=\\"number\\"\\n              class=\\"form-control\\"\\n              id=\\"transactionAmount\\"\\n              placeholder=\\"Betrag\\"\\n              bind:value={transaction.amount}\\n            />\\n            <label for=\\"transactionAmount\\">Betrag</label>\\n          </div>\\n        </div>\\n        <div class=\\"col-2\\">\\n          <button\\n            type=\\"button\\"\\n            class=\\"btn btn-outline-danger\\"\\n            on:click={() => {\\n              blockData.transactions = blockData.transactions.filter(\\n                (t, j) => j !== i\\n              );\\n            }}\\n          >\\n            <svg\\n              width=\\"1em\\"\\n              height=\\"1.5em\\"\\n              xmlns=\\"http://www.w3.org/2000/svg\\"\\n              viewBox=\\"0 0 448 512\\"\\n              ><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path\\n                d=\\"M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z\\"\\n              /></svg\\n            >\\n          </button>\\n        </div>\\n      </div>\\n    {/each}\\n    <div class=\\"d-flex justify-content-center\\">\\n      <button\\n        type=\\"button\\"\\n        class=\\"btn btn-outline-primary\\"\\n        on:click={addTransaction}><b>+</b></button\\n      >\\n    </div>\\n    {#if !blockData.blockValid}\\n      <div class=\\"alert alert-danger mt-3\\" role=\\"alert\\">\\n        <h5>Block ist ungültig!</h5>\\n        Der&nbsp;<em>Hash des Headers</em> stimmt nicht mit dem Hash überein,\\n        der im nächsten Block gespeichet ist.<br />\\n        Das bedeuted, dass der Block <strong>nachträglich</strong> manipuliert wurde.\\n      </div>\\n    {/if}\\n  </div>\\n</div>\\n\\n<style>\\n  .card-header > button {\\n    padding: 0.3rem;\\n    line-height: 0;\\n  }\\n\\n  .input-group {\\n    transition: 0.3s;\\n  }\\n\\n  .header-input {\\n    border-radius: 0.5rem;\\n    transition: 0.3s;\\n  }\\n\\n  .highlighted {\\n    box-shadow: 2px 2px 7px 3px #009fff;\\n  }\\n\\n  .blockValid {\\n    background-color: rgba(200, 255, 200, 0.7);\\n  }\\n\\n  .blockInvalid {\\n    background-color: rgba(255, 200, 200, 0.7);\\n  }\\n\\n  .card-body {\\n    flex: 0 0;\\n    display: block;\\n  }\\n\\n  .card {\\n    width: 400px;\\n    min-width: 400px;\\n    margin-left: 1rem;\\n    margin-right: 1rem;\\n  }\\n\\n  .transactionRow > div {\\n    margin-top: 0.3rem;\\n    margin-bottom: 0.3rem;\\n  }\\n\\n  .row {\\n    transition: 0.3s;\\n  }\\n\\n  .transactionRow {\\n    margin-top: 0.5rem;\\n    border-radius: 0.5rem;\\n    background-color: rgb(200, 231, 241, 0.7);\\n  }\\n\\n  .block-header {\\n    background-color: rgba(194, 194, 194, 0.4);\\n    box-shadow: 3px 3px 35px 4px rgba(201, 201, 201, 0.578);\\n    transition: all 0.3s;\\n    padding: 0.5rem 1rem;\\n    border-radius: 0.5rem;\\n    border: 1px solid rgb(163, 163, 163);\\n  }\\n\\n  .block-header:hover {\\n    box-shadow: 3px 3px 15px 7px rgba(175, 175, 175, 0.578);\\n  }\\n</style>\\n"],"names":[],"mappings":"AA0WE,0BAAY,CAAG,oBAAO,CACpB,OAAO,CAAE,MAAM,CACf,WAAW,CAAE,CACf,CAEA,wCAAa,CACX,UAAU,CAAE,IACd,CAEA,yCAAc,CACZ,aAAa,CAAE,MAAM,CACrB,UAAU,CAAE,IACd,CAEA,wCAAa,CACX,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,OAC9B,CAEA,uCAAY,CACV,gBAAgB,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAC3C,CAEA,yCAAc,CACZ,gBAAgB,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAC3C,CAEA,sCAAW,CACT,IAAI,CAAE,CAAC,CAAC,CAAC,CACT,OAAO,CAAE,KACX,CAEA,iCAAM,CACJ,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAChB,CAEA,6BAAe,CAAG,iBAAI,CACpB,UAAU,CAAE,MAAM,CAClB,aAAa,CAAE,MACjB,CAEA,gCAAK,CACH,UAAU,CAAE,IACd,CAEA,2CAAgB,CACd,UAAU,CAAE,MAAM,CAClB,aAAa,CAAE,MAAM,CACrB,gBAAgB,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAC1C,CAEA,yCAAc,CACZ,gBAAgB,CAAE,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAC1C,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,KAAK,CAAC,CACvD,UAAU,CAAE,GAAG,CAAC,IAAI,CACpB,OAAO,CAAE,MAAM,CAAC,IAAI,CACpB,aAAa,CAAE,MAAM,CACrB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CACrC,CAEA,yCAAa,MAAO,CAClB,UAAU,CAAE,GAAG,CAAC,GAAG,CAAC,IAAI,CAAC,GAAG,CAAC,KAAK,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,KAAK,CACxD"}`
};
const Block = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const prerender = false;
  let { parentDeleteBlock } = $$props;
  let { blockData = {
    id: "?",
    previousHash: "",
    transactionHash: "",
    nonce: "",
    headerHash: "",
    transactions: [{ amount: "", from: "", to: "" }],
    blockValid: false
  } } = $$props;
  let { hintText = "" } = $$props;
  let { highlightedPreviousHash = "" } = $$props;
  let { activateMining = false } = $$props;
  async function updateTransactionHash(transactions) {
    let s = transactions.map((t) => `${t.from}${t.to}${t.amount}`).join("");
    hash(s).then((h) => {
      if (blockData.transactionHash !== h) blockData.transactionHash = h;
    });
  }
  async function updateBlockHash(previousHash, transactionHash, nonce) {
    let s = `${nonce}${previousHash}${transactionHash}`;
    hash(s).then((h) => {
      if (blockData.headerHash !== h) blockData.headerHash = h;
    });
  }
  if ($$props.prerender === void 0 && $$bindings.prerender && prerender !== void 0) $$bindings.prerender(prerender);
  if ($$props.parentDeleteBlock === void 0 && $$bindings.parentDeleteBlock && parentDeleteBlock !== void 0) $$bindings.parentDeleteBlock(parentDeleteBlock);
  if ($$props.blockData === void 0 && $$bindings.blockData && blockData !== void 0) $$bindings.blockData(blockData);
  if ($$props.hintText === void 0 && $$bindings.hintText && hintText !== void 0) $$bindings.hintText(hintText);
  if ($$props.highlightedPreviousHash === void 0 && $$bindings.highlightedPreviousHash && highlightedPreviousHash !== void 0) $$bindings.highlightedPreviousHash(highlightedPreviousHash);
  if ($$props.activateMining === void 0 && $$bindings.activateMining && activateMining !== void 0) $$bindings.activateMining(activateMining);
  $$result.css.add(css$1);
  {
    updateTransactionHash(blockData.transactions);
  }
  {
    updateBlockHash(blockData.previousHash, blockData.transactionHash, blockData.nonce);
  }
  return `<div class="${"card mb-3 " + escape(blockData.blockValid ? "blockValid" : "blockInvalid", true) + " svelte-rb12wf"}"><div class="card-header d-flex justify-content-between svelte-rb12wf">Block #${escape(blockData.id)} <button type="button" class="btn btn-outline-danger svelte-rb12wf" data-svelte-h="svelte-jais02"><svg width="1em" height="0.9em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg></button></div> <div class="card-body svelte-rb12wf"><div class="block-header svelte-rb12wf"><h5 class="card-title mb-3" data-svelte-h="svelte-oywi7q">Header</h5> <div class="${"header-input " + escape("", true) + " svelte-rb12wf"}">${activateMining ? `<div class="row g-2 align-items-center svelte-rb12wf"><div class="input-group mb-2 svelte-rb12wf" role="paragraph"><span class="input-group-text" id="nonce" data-svelte-h="svelte-dceilt">Nonce</span> <input type="number" class="form-control" placeholder=""${add_attribute("value", blockData.nonce, 0)}></div></div>` : ``} <div class="row g-2 align-items-center svelte-rb12wf"><div class="${"input-group mb-2 " + escape(
    highlightedPreviousHash === blockData.id ? "highlighted" : "",
    true
  ) + " svelte-rb12wf"}" role="paragraph"><span class="input-group-text" id="basic-addon1" data-svelte-h="svelte-1dutna4">Vorheriger Hash</span> <input type="text" class="form-control"${add_attribute("value", blockData.previousHash, 0)}></div></div> <div class="row g-2 align-items-center svelte-rb12wf" id="transactionHash"><div class="input-group mb-2 svelte-rb12wf" role="paragraph"><span class="input-group-text" id="basic-addon1" data-svelte-h="svelte-q31pp8">Transaktionshash</span> <input type="text" class="form-control" disabled${add_attribute("value", blockData.transactionHash, 0)}></div></div></div> <hr> <div class="row g-2 align-items-center svelte-rb12wf"><div class="${"input-group mb-2 " + escape(
    highlightedPreviousHash === blockData.id + 1 ? "highlighted" : "",
    true
  ) + " svelte-rb12wf"}" role="paragraph"><span class="input-group-text" id="basic-addon1" data-svelte-h="svelte-1vk4tb3">Hash des Headers</span> <input type="text" class="form-control" disabled${add_attribute("value", blockData.headerHash, 0)}></div></div> ${activateMining ? `<div class="row g-2 d-flex svelte-rb12wf"><button type="button" class="${"btn " + escape("btn-primary", true) + " ms-auto"}">${`Block minen`}</button></div>` : ``}</div></div> <div class="card-body svelte-rb12wf"><h5 class="card-title" data-svelte-h="svelte-1jdthwf">Transaktionen</h5> ${each(blockData.transactions, (transaction, i) => {
    return `<div class="${"row g-3 align-items-center mb-2 transactionRow " + escape("", true) + " svelte-rb12wf"}" id="${"transaction" + escape(i, true)}"><div class="col svelte-rb12wf"><div class="form-floating"><input type="text" class="form-control" id="transactionFrom" placeholder="Absender"${add_attribute("value", transaction.from, 0)}> <label for="transactionFrom" data-svelte-h="svelte-9osgot">Von</label> </div></div> <div class="col svelte-rb12wf"><div class="form-floating"><input type="text" class="form-control" id="transactionTo" placeholder="Empfänger"${add_attribute("value", transaction.to, 0)}> <label for="transactionTo" data-svelte-h="svelte-1n2eacq">Zu</label> </div></div> <div class="col svelte-rb12wf"><div class="form-floating"><input type="number" class="form-control" id="transactionAmount" placeholder="Betrag"${add_attribute("value", transaction.amount, 0)}> <label for="transactionAmount" data-svelte-h="svelte-106gf2n">Betrag</label> </div></div> <div class="col-2 svelte-rb12wf"><button type="button" class="btn btn-outline-danger" data-svelte-h="svelte-kw0aal"><svg width="1em" height="1.5em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg> </button></div> </div>`;
  })} <div class="d-flex justify-content-center"><button type="button" class="btn btn-outline-primary" data-svelte-h="svelte-1ju61e9"><b>+</b></button></div> ${!blockData.blockValid ? `<div class="alert alert-danger mt-3" role="alert" data-svelte-h="svelte-1nha3hy"><h5>Block ist ungültig!</h5>
        Der <em>Hash des Headers</em> stimmt nicht mit dem Hash überein,
        der im nächsten Block gespeichet ist.<br>
        Das bedeuted, dass der Block <strong>nachträglich</strong> manipuliert wurde.</div>` : ``}</div> </div>`;
});
const css = {
  code: ".infoBtn.svelte-zyi2fw{position:absolute;top:10px !important;right:10px !important}.activateMiningToggle.svelte-zyi2fw{position:absolute;top:10px !important;left:10px !important}#activateMining.svelte-zyi2fw{font-size:1.3rem}.block-scroll.svelte-zyi2fw{display:flex;flex-direction:row;overflow-x:auto}.hintBox.svelte-zyi2fw{font-size:1.15rem;border:1px dashed rgb(185, 110, 110);width:70vw;min-width:300px;border-radius:1rem}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n  import \\"bootstrap/dist/css/bootstrap.min.css\\";\\n  import Block from \\"./Block.svelte\\";\\n  import { fade } from \\"svelte/transition\\";\\n  import { Popover } from \\"bootstrap\\";\\n  import { onMount } from \\"svelte\\";\\n\\n  let blocks = [\\n    {\\n      id: 1,\\n      previousHash:\\n        \\"0000000000000000000000000000000000000000000000000000000000000000\\",\\n      transactionHash: \\"\\",\\n      nonce: \\"836\\",\\n      headerHash: \\"\\",\\n      transactions: [\\n        { amount: \\"50.1\\", from: \\"Alice\\", to: \\"Bob\\" },\\n        { amount: \\"10.1\\", from: \\"Charlie\\", to: \\"David\\" },\\n      ],\\n      blockValid: true,\\n    },\\n    {\\n      id: 2,\\n      previousHash:\\n        \\"f285383302105629e68514103234cd90e6bf55743d463153493d41bc6ede7fca\\",\\n      transactionHash: \\"\\",\\n      nonce: \\"22871\\",\\n      headerHash: \\"\\",\\n      transactions: [\\n        { amount: \\"42.21\\", from: \\"Elisabeth\\", to: \\"Florian\\" },\\n        { amount: \\"0.8\\", from: \\"Gustav\\", to: \\"Hans\\" },\\n        { amount: \\"720.1\\", from: \\"Ingrid\\", to: \\"Johannes\\" },\\n      ],\\n      blockValid: true,\\n    },\\n    {\\n      id: 3,\\n      previousHash:\\n        \\"f833754b017d09c793d884c43ce6815954b02aaf1b2b6853427760c482865351\\",\\n      transactionHash: \\"\\",\\n      nonce: \\"2839\\",\\n      headerHash: \\"\\",\\n      transactions: [{ amount: \\"3.0\\", from: \\"Konstantin\\", to: \\"Lily\\" }],\\n      blockValid: true,\\n    },\\n  ];\\n\\n  $: {\\n    for (let i = 0; i < blocks.length - 1; i++) {\\n      if (blocks[i].headerHash === blocks[i + 1].previousHash)\\n        blocks[i].blockValid = true;\\n      else blocks[i].blockValid = false;\\n    }\\n  }\\n\\n  onMount(() => {\\n    const popoverTriggerList = document.querySelectorAll(\\n      '[data-bs-toggle=\\"popover\\"]'\\n    );\\n    const popoverList = [...popoverTriggerList].map(\\n      (popoverTriggerEl) =>\\n        new Popover(popoverTriggerEl, {\\n          html: true,\\n          sanitize: false,\\n          trigger: \\"focus\\",\\n        })\\n    );\\n  });\\n\\n  function addBlock() {\\n    let newBlock = {\\n      id: blocks.length + 1,\\n      previousHash: blocks[blocks.length - 1].headerHash,\\n      transactionHash: \\"\\",\\n      nonce: Math.floor(Math.random() * 10000),\\n      headerHash: \\"\\",\\n      transactions: [{ amount: \\"\\", from: \\"\\", to: \\"\\" }],\\n      blockValid: true,\\n    };\\n    blocks = [...blocks, newBlock];\\n  }\\n\\n  let hintText =\\n    \\"<em>Fahre über ein Element, um eine Erklärung zu erhalten.</em>\\";\\n  let highlightedPreviousHash = \\"\\";\\n  let activateMining = false;\\n\\n  const parentDeleteBlock = (id) => {\\n    if (blocks.length === 1) return;\\n\\n    blocks = blocks.filter((block) => block.id !== id);\\n    // update ids\\n    blocks = blocks.map((block, index) => {\\n      block.id = index + 1;\\n      return block;\\n    });\\n  };\\n<\/script>\\n\\n<svelte:head>\\n  <title>Blockchain Demo</title>\\n  <meta name=\\"description\\" content=\\"Blockchain Demo\\" />\\n</svelte:head>\\n\\n<h1>Blockchain Demo</h1>\\n\\n<button\\n  type=\\"button\\"\\n  class=\\"infoBtn btn btn-outline-dark btn-sm\\"\\n  data-bs-container=\\"body\\"\\n  data-bs-toggle=\\"popover\\"\\n  data-bs-placement=\\"bottom\\"\\n  data-bs-content=\\"Quellcode auf <a href='https://github.com/tools-info-bw-de/blockchain-demo' target='_blank'>github</a>!<br>Lizenz: MIT<br>Marco Kümmel\\"\\n  >info</button\\n>\\n\\n<div\\n  class=\\"form-check form-switch d-flex justify-content-end align-items-center mt-2 ms-4 activateMiningToggle\\"\\n>\\n  <input\\n    class=\\"form-check-input me-2\\"\\n    type=\\"checkbox\\"\\n    role=\\"switch\\"\\n    id=\\"activateMining\\"\\n    bind:checked={activateMining}\\n  />\\n  <label class=\\"form-check-label\\" for=\\"activateMining\\"\\n    >Aktiviere das Block-Mining<br /><em\\n      >Erst aktivieren, wenn du die Basics verstanden hast.</em\\n    ></label\\n  >\\n</div>\\n\\n<div class=\\"block-scroll mt-5\\">\\n  {#each blocks as blockData}\\n    <Block\\n      bind:blockData\\n      bind:hintText\\n      bind:highlightedPreviousHash\\n      bind:activateMining\\n      {parentDeleteBlock}\\n    />\\n  {/each}\\n  <div class=\\"d-flex align-items-center me-3\\">\\n    <button class=\\"btn btn-outline-primary\\" on:click={addBlock}\\n      >Weiteren Block hinzufügen</button\\n    >\\n  </div>\\n</div>\\n\\n<div class=\\"d-flex justify-content-center mt-4 mb-3\\">\\n  {#key hintText}\\n    <div class=\\"hintBox p-4\\">\\n      <div in:fade={{ delay: 105, duration: 100 }}>{@html hintText}</div>\\n    </div>\\n  {/key}\\n</div>\\n\\n<style>\\n  .infoBtn {\\n    position: absolute;\\n    top: 10px !important;\\n    right: 10px !important;\\n  }\\n\\n  .activateMiningToggle {\\n    position: absolute;\\n    top: 10px !important;\\n    left: 10px !important;\\n  }\\n\\n  #activateMining {\\n    font-size: 1.3rem;\\n  }\\n\\n  .block-scroll {\\n    display: flex;\\n    flex-direction: row;\\n    overflow-x: auto;\\n  }\\n\\n  .hintBox {\\n    font-size: 1.15rem;\\n    border: 1px dashed rgb(185, 110, 110);\\n    width: 70vw;\\n    min-width: 300px;\\n    border-radius: 1rem;\\n  }\\n</style>\\n"],"names":[],"mappings":"AA+JE,sBAAS,CACP,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,IAAI,CAAC,UAAU,CACpB,KAAK,CAAE,IAAI,CAAC,UACd,CAEA,mCAAsB,CACpB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,IAAI,CAAC,UAAU,CACpB,IAAI,CAAE,IAAI,CAAC,UACb,CAEA,6BAAgB,CACd,SAAS,CAAE,MACb,CAEA,2BAAc,CACZ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,UAAU,CAAE,IACd,CAEA,sBAAS,CACP,SAAS,CAAE,OAAO,CAClB,MAAM,CAAE,GAAG,CAAC,MAAM,CAAC,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CACrC,KAAK,CAAE,IAAI,CACX,SAAS,CAAE,KAAK,CAChB,aAAa,CAAE,IACjB"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let blocks = [
    {
      id: 1,
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      transactionHash: "",
      nonce: "836",
      headerHash: "",
      transactions: [
        { amount: "50.1", from: "Alice", to: "Bob" },
        {
          amount: "10.1",
          from: "Charlie",
          to: "David"
        }
      ],
      blockValid: true
    },
    {
      id: 2,
      previousHash: "f285383302105629e68514103234cd90e6bf55743d463153493d41bc6ede7fca",
      transactionHash: "",
      nonce: "22871",
      headerHash: "",
      transactions: [
        {
          amount: "42.21",
          from: "Elisabeth",
          to: "Florian"
        },
        {
          amount: "0.8",
          from: "Gustav",
          to: "Hans"
        },
        {
          amount: "720.1",
          from: "Ingrid",
          to: "Johannes"
        }
      ],
      blockValid: true
    },
    {
      id: 3,
      previousHash: "f833754b017d09c793d884c43ce6815954b02aaf1b2b6853427760c482865351",
      transactionHash: "",
      nonce: "2839",
      headerHash: "",
      transactions: [
        {
          amount: "3.0",
          from: "Konstantin",
          to: "Lily"
        }
      ],
      blockValid: true
    }
  ];
  let hintText = "<em>Fahre über ein Element, um eine Erklärung zu erhalten.</em>";
  let highlightedPreviousHash = "";
  let activateMining = false;
  const parentDeleteBlock = (id) => {
    if (blocks.length === 1) return;
    blocks = blocks.filter((block) => block.id !== id);
    blocks = blocks.map((block, index) => {
      block.id = index + 1;
      return block;
    });
  };
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      {
        for (let i = 0; i < blocks.length - 1; i++) {
          if (blocks[i].headerHash === blocks[i + 1].previousHash) blocks[i].blockValid = true;
          else blocks[i].blockValid = false;
        }
      }
    }
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-oz6per_START -->${$$result.title = `<title>Blockchain Demo</title>`, ""}<meta name="description" content="Blockchain Demo"><!-- HEAD_svelte-oz6per_END -->`, ""} <h1 data-svelte-h="svelte-1hsvdjh">Blockchain Demo</h1> <button type="button" class="infoBtn btn btn-outline-dark btn-sm svelte-zyi2fw" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content="Quellcode auf &lt;a href='https://github.com/tools-info-bw-de/blockchain-demo' target='_blank'>github&lt;/a>!&lt;br>Lizenz: MIT&lt;br>Marco Kümmel" data-svelte-h="svelte-o240k5">info</button> <div class="form-check form-switch d-flex justify-content-end align-items-center mt-2 ms-4 activateMiningToggle svelte-zyi2fw"><input class="form-check-input me-2 svelte-zyi2fw" type="checkbox" role="switch" id="activateMining"${add_attribute("checked", activateMining, 1)}> <label class="form-check-label" for="activateMining" data-svelte-h="svelte-fqaupc">Aktiviere das Block-Mining<br><em>Erst aktivieren, wenn du die Basics verstanden hast.</em></label></div> <div class="block-scroll mt-5 svelte-zyi2fw">${each(blocks, (blockData) => {
      return `${validate_component(Block, "Block").$$render(
        $$result,
        {
          parentDeleteBlock,
          blockData,
          hintText,
          highlightedPreviousHash,
          activateMining
        },
        {
          blockData: ($$value) => {
            blockData = $$value;
            $$settled = false;
          },
          hintText: ($$value) => {
            hintText = $$value;
            $$settled = false;
          },
          highlightedPreviousHash: ($$value) => {
            highlightedPreviousHash = $$value;
            $$settled = false;
          },
          activateMining: ($$value) => {
            activateMining = $$value;
            $$settled = false;
          }
        },
        {}
      )}`;
    })} <div class="d-flex align-items-center me-3"><button class="btn btn-outline-primary" data-svelte-h="svelte-1eh1bxb">Weiteren Block hinzufügen</button></div></div> <div class="d-flex justify-content-center mt-4 mb-3"><div class="hintBox p-4 svelte-zyi2fw"><div><!-- HTML_TAG_START -->${hintText}<!-- HTML_TAG_END --></div></div> </div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
