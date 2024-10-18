<script>
  export const prerender = false;

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

  const hash = (val) =>
    crypto.subtle
      .digest("SHA-256", new TextEncoder("utf-8").encode(val))
      .then((h) => {
        let hexes = [],
          view = new DataView(h);
        for (let i = 0; i < view.byteLength; i += 4)
          hexes.push(("00000000" + view.getUint32(i).toString(16)).slice(-8));
        return hexes.join("");
      });

  async function updateTransactionHash(transactions) {
    let s = transactions.map((t) => `${t.from}${t.to}${t.amount}`).join("");
    hash(s).then((h) => {
      if (blockData.transactionHash !== h) blockData.transactionHash = h;
    });
  }

  async function updateBlockHash(previousHash, transactionHash, nonce) {
    let s = `${previousHash}${transactionHash}${nonce}`;
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

  function hintNonce() {
    hintText =
      "Nonce ('number used once') ist ein Wert, der so gewählt werden muss, dass der Hash des Headers mit einer bestimmten Anzahl an Nullen beginnt.";
  }

  function hintPreviousHash() {
    hintText =
      "Der <b>Hash des Headers</b> des <u>vorherigen</u> Blocks muss im aktuellen Block gespeichert werden. Nur, wenn beide Hashes <b>übereinstimmen</b>, ist der vorherige Block gültig.";
    highlightedPreviousHash = blockData.id;
  }

  function hintTransactionHash() {
    hintText = "Dieser SHA-256 Hash wird aus allen Transaktionen berechnet.";
    highlighted = "transactions";
  }

  function hintHeader() {
    hintText =
      "Der Hash des Headers wird aus der Nonce, dem Hash des vorherigen Headers und dem Transaktionshash berechnet.";
    highlighted = "header";
  }

  function removeHint() {
    showDefaultHint();
    highlighted = "";
    highlightedPreviousHash = "";
  }

  function showDefaultHint() {
    hintText =
      "<em>Fahre über ein Element, um eine Erklärung zu erhalten.</em>";
  }
</script>

<div class="card mb-3 {blockData.blockValid ? 'blockValid' : 'blockInvalid'}">
  <div class="card-header">Block #{blockData.id}</div>
  <div class="card-body">
    <div class="block-header">
      <h5 class="card-title mb-3">Header</h5>
      <div class="header-input {highlighted === 'header' ? 'highlighted' : ''}">
        <div class="row g-2 align-items-center">
          <div
            class="input-group mb-2"
            on:mouseover={hintNonce}
            on:focus={hintNonce}
            on:mouseleave={removeHint}
            role="paragraph"
          >
            <span class="input-group-text" id="basic-addon1">Nonce</span>
            <input
              type="number"
              class="form-control"
              placeholder="Username"
              bind:value={blockData.nonce}
            />
          </div>
        </div>
        <div class="row g-2 align-items-center">
          <div
            class="input-group mb-2 {highlightedPreviousHash === blockData.id
              ? 'highlighted2'
              : ''}"
            on:mouseover={hintPreviousHash}
            on:focus={hintPreviousHash}
            on:mouseleave={removeHint}
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
        <div class="row g-2 align-items-center">
          <div
            class="input-group mb-2"
            on:mouseover={hintTransactionHash}
            on:focus={hintTransactionHash}
            on:mouseleave={removeHint}
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
            ? 'highlighted2'
            : ''}"
          on:mouseover={hintHeader}
          on:focus={hintHeader}
          on:mouseleave={removeHint}
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
        <div class="col-4">
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
        <div class="col-4">
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
        <div class="col-4">
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
      </div>
    {/each}
    {#if !blockData.blockValid}
      <div class="alert alert-danger mt-3" role="alert">
        <h5>Block ist ungültig!</h5>
        Der<em> Hash des Headers</em> stimmt nicht mit dem Hash überein, der im
        nächsten Block gespeichet ist.<br />
        Das bedeuted, dass der Block <strong>nachträglich</strong> manipuliert wurde.
      </div>
    {/if}
  </div>
</div>

<style>
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

  .highlighted2 {
    box-shadow: 2px 2px 7px 3px #ffc400;
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
