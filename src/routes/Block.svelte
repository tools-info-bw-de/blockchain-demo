<script>
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";
  import { hash } from "./hash.js";

  export const prerender = false;

  export let parentDeleteBlock;
  export let blockData = {
    id: "?",
    previousHash: "",
    transactionHash: "",
    nonce: "",
    headerHash: "",
    transactions: [{ amount: "", from: "", to: "" }],
    blockValid: false,
  };

  export let hintText = "";

  export let highlightedPreviousHash = "";
  let highlighted = "";

  export let activateMining = false;
  let isMining = false;
  let elapsedTime = 0;
  let timer;

  let worker;

  function createWorker() {
    return new Worker(new URL("./minerWorker.js", import.meta.url));
  }

  function terminateWorker() {
    if (worker) {
      worker.terminate();
      worker = null;
      isMining = false;
      clearInterval(timer);
    }
  }

  function restartWorker() {
    terminateWorker();
    worker = createWorker();
    worker.onmessage = function (e) {
      const nonce = e.data;
      blockData.nonce = Number(nonce);
      isMining = false;
      clearInterval(timer);
    };
  }

  onMount(() => {
    restartWorker();
  });

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

  $: updateTransactionHash(blockData.transactions);
  $: updateBlockHash(
    blockData.previousHash,
    blockData.transactionHash,
    blockData.nonce
  );

  function addTransaction() {
    blockData.transactions = [
      ...blockData.transactions,
      { amount: "", from: "", to: "" },
    ];
  }

  function hintNonce() {
    hintText =
      "<ul><li>Die Nonce ('number used once') wird nur für das <b>Block-Mining</b> (siehe unterer Knopf) benötigt.</li><li>Sie ist eine <em>'zufällige/willkürliche'</em> natürliche Zahl, die in die Berechnung des Header-Hashs einfließt. Der Mining-Computer probiert der Reihe nach alle natürlichen Zahlen durch, bis der <b>Hash des Headers</b> mit einer bestimmten Anzahl an Nullen beginnt.</li></ul>";
  }

  function hintPreviousHash() {
    hintText =
      "<ul><li>Der <b>Hash des Headers</b> des <u>vorherigen</u> Blocks muss im aktuellen Block gespeichert werden. Nur, wenn beide Hashes <b>übereinstimmen</b>, ist der vorherige Block gültig.</li><li>Der erste Block hat keinen Vorgänger und trägt daher an dieser Stelle eine 0er-Folge.</li></ul>";
    highlightedPreviousHash = blockData.id;
  }

  function hintTransactionHash() {
    hintText =
      "Dieser SHA-256 Hash wird aus allen Transaktionen berechnet.<br><ul><li>In Echt kommt dabei der <a target='_blank' href='https://de.wikipedia.org/wiki/Hash-Baum'>Merkle-Tree</a> zum Einsatz.</li><li>In dieser Demo wird aus allen Transaktionen einfach ein langer String gebaut (<code>Von0Zu0Betrag0Von1Zu1Betrag1...</code>), der dann gehasht wird.</li></ul>";
    highlighted = "transactions";
  }

  function hintHeader() {
    hintText =
      "Der SHA-256 Hash des Headers wird aus " +
      (activateMining ? "der <u>Nonce</u>, " : "") +
      "dem <u>Hash des vorherigen Headers</u> und dem <u>Transaktionshash</u> berechnet.";
    highlighted = "header";
  }

  function hintMining() {
    hintText =
      "<ul><li>Beim Mining wird die <b>Nonce</b> so lange verändert, bis der Hash des Headers mit einer bestimmten Anzahl an Nullen beginnt (hier 4).</li><li>Sobald jemand diesen Wert gefunden hat, wird der Block als <b>gemined</b> betrachtet und an die Blockchain angehängt. Im Durchschnitt findet nur <b>ein PC</b> weltweit <b>alle 10 Minuten</b> die passende Nonce für einen solchen Hash.</li><li>Damit die nötige Zeit zum Block-Minen trotz steigender Rechenleistung bei etwa 10 Minuten bleibt, wird regelmäßig die Schwierigkeit angepasst. Dazu wird die Anzahl der Nullen, mit denen der Hash beginnen muss, erhöht oder verringert.</li><li>Warum man das extrem energieverschwendende Mining überhaupt benötigt, kannst du im Wiki nachlesen.</li></ul>";
  }

  function removeHighlight() {
    highlighted = "";
    highlightedPreviousHash = "";
  }

  function startMining() {
    if (isMining) {
      restartWorker();
      return;
    }
    isMining = true;

    elapsedTime = 0;
    timer = setInterval(() => {
      elapsedTime++;
    }, 1000);

    worker.postMessage({
      previousHash: blockData.previousHash,
      transactionHash: blockData.transactionHash,
    });
  }

  function deleteBlock(id) {
    return () => {
      terminateWorker();
      parentDeleteBlock(id);
    };
  }
</script>

<div class="card mb-3 {blockData.blockValid ? 'blockValid' : 'blockInvalid'}">
  <div class="card-header d-flex justify-content-between">
    Block #{blockData.id}
    <button
      type="button"
      class="btn btn-outline-danger"
      on:click={deleteBlock(blockData.id)}
    >
      <svg
        width="1em"
        height="0.9em"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        ><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
          d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
        /></svg
      >
    </button>
  </div>
  <div class="card-body">
    <div class="block-header">
      <h5 class="card-title mb-3">Header</h5>
      <div class="header-input {highlighted === 'header' ? 'highlighted' : ''}">
        {#if activateMining}
          <div class="row g-2 align-items-center" transition:slide|global>
            <div
              class="input-group mb-2"
              on:mouseover={hintNonce}
              on:focus={hintNonce}
              on:mouseleave={removeHighlight}
              role="paragraph"
            >
              <span class="input-group-text" id="nonce">Nonce</span>
              <input
                type="number"
                class="form-control"
                placeholder=""
                bind:value={blockData.nonce}
              />
            </div>
          </div>
        {/if}
        <div class="row g-2 align-items-center">
          <div
            class="input-group mb-2 {highlightedPreviousHash === blockData.id
              ? 'highlighted'
              : ''}"
            on:mouseover={hintPreviousHash}
            on:focus={hintPreviousHash}
            on:mouseleave={removeHighlight}
            role="paragraph"
          >
            <span class="input-group-text" id="basic-addon1"
              >Vorheriger Hash</span
            >
            <input
              type="text"
              class="form-control"
              bind:value={blockData.previousHash}
            />
          </div>
        </div>
        <div class="row g-2 align-items-center" id="transactionHash">
          <div
            class="input-group mb-2"
            on:mouseover={hintTransactionHash}
            on:focus={hintTransactionHash}
            on:mouseleave={removeHighlight}
            role="paragraph"
          >
            <span class="input-group-text" id="basic-addon1"
              >Transaktionshash</span
            >
            <input
              type="text"
              class="form-control"
              disabled
              bind:value={blockData.transactionHash}
            />
          </div>
        </div>
      </div>
      <hr />
      <div class="row g-2 align-items-center">
        <div
          class="input-group mb-2 {highlightedPreviousHash === blockData.id + 1
            ? 'highlighted'
            : ''}"
          on:mouseover={hintHeader}
          on:focus={hintHeader}
          on:mouseleave={removeHighlight}
          role="paragraph"
        >
          <span class="input-group-text" id="basic-addon1"
            >Hash des Headers</span
          >
          <input
            type="text"
            class="form-control"
            disabled
            bind:value={blockData.headerHash}
          />
        </div>
      </div>
      {#if activateMining}
        <div class="row g-2 d-flex" transition:slide|global>
          <button
            type="button"
            class="btn {isMining ? 'btn-danger' : 'btn-primary'} ms-auto"
            on:mouseover={hintMining}
            on:focus={hintMining}
            on:mouseleave={removeHighlight}
            on:click={startMining}
          >
            {#if isMining}
              <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              Laufzeit: {elapsedTime}s - Klicken zum Stoppen!
            {:else}
              Block minen
            {/if}
          </button>
        </div>
      {/if}
    </div>
  </div>
  <div class="card-body">
    <h5 class="card-title">Transaktionen</h5>
    {#each blockData.transactions as transaction, i (i)}
      <div
        class="row g-3 align-items-center mb-2 transactionRow {highlighted ===
        'transactions'
          ? 'highlighted'
          : ''}"
        id="transaction{i}"
      >
        <div class="col">
          <div class="form-floating">
            <input
              type="text"
              class="form-control"
              id="transactionFrom"
              placeholder="Absender"
              bind:value={transaction.from}
            />
            <label for="transactionFrom">Von</label>
          </div>
        </div>
        <div class="col">
          <div class="form-floating">
            <input
              type="text"
              class="form-control"
              id="transactionTo"
              placeholder="Empfänger"
              bind:value={transaction.to}
            />
            <label for="transactionTo">Zu</label>
          </div>
        </div>
        <div class="col">
          <div class="form-floating">
            <input
              type="number"
              class="form-control"
              id="transactionAmount"
              placeholder="Betrag"
              bind:value={transaction.amount}
            />
            <label for="transactionAmount">Betrag</label>
          </div>
        </div>
        <div class="col-2">
          <button
            type="button"
            class="btn btn-outline-danger"
            on:click={() => {
              blockData.transactions = blockData.transactions.filter(
                (t, j) => j !== i
              );
            }}
          >
            <svg
              width="1em"
              height="1.5em"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              ><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
              /></svg
            >
          </button>
        </div>
      </div>
    {/each}
    <div class="d-flex justify-content-center">
      <button
        type="button"
        class="btn btn-outline-primary"
        on:click={addTransaction}><b>+</b></button
      >
    </div>
    {#if !blockData.blockValid}
      <div class="alert alert-danger mt-3" role="alert">
        <h5>Block ist ungültig!</h5>
        Der&nbsp;<em>Hash des Headers</em> stimmt nicht mit dem Hash überein,
        der im nächsten Block gespeichet ist.<br />
        Das bedeuted, dass der Block <strong>nachträglich</strong> manipuliert wurde.
      </div>
    {/if}
  </div>
</div>

<style>
  .card-header > button {
    padding: 0.3rem;
    line-height: 0;
  }

  .input-group {
    transition: 0.3s;
  }

  .header-input {
    border-radius: 0.5rem;
    transition: 0.3s;
  }

  .highlighted {
    box-shadow: 2px 2px 7px 3px #009fff;
  }

  .blockValid {
    background-color: rgba(200, 255, 200, 0.7);
  }

  .blockInvalid {
    background-color: rgba(255, 200, 200, 0.7);
  }

  .card-body {
    flex: 0 0;
    display: block;
  }

  .card {
    width: 400px;
    min-width: 400px;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .transactionRow > div {
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
  }

  .row {
    transition: 0.3s;
  }

  .transactionRow {
    margin-top: 0.5rem;
    border-radius: 0.5rem;
    background-color: rgb(200, 231, 241, 0.7);
  }

  .block-header {
    background-color: rgba(194, 194, 194, 0.4);
    box-shadow: 3px 3px 35px 4px rgba(201, 201, 201, 0.578);
    transition: all 0.3s;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid rgb(163, 163, 163);
  }

  .block-header:hover {
    box-shadow: 3px 3px 15px 7px rgba(175, 175, 175, 0.578);
  }
</style>
