<script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import Block from "./Block.svelte";
  import { fade } from "svelte/transition";
  import { Popover } from "bootstrap";
  import { onMount } from "svelte";

  let blocks = [
    {
      id: 1,
      previousHash:
        "0000000000000000000000000000000000000000000000000000000000000000",
      transactionHash: "",
      nonce: "836",
      headerHash: "",
      transactions: [
        { amount: "50.1", from: "Alice", to: "Bob" },
        { amount: "10.1", from: "Charlie", to: "David" },
      ],
      blockValid: true,
    },
    {
      id: 2,
      previousHash:
        "f285383302105629e68514103234cd90e6bf55743d463153493d41bc6ede7fca",
      transactionHash: "",
      nonce: "22871",
      headerHash: "",
      transactions: [
        { amount: "42.21", from: "Elisabeth", to: "Florian" },
        { amount: "0.8", from: "Gustav", to: "Hans" },
        { amount: "720.1", from: "Ingrid", to: "Johannes" },
      ],
      blockValid: true,
    },
    {
      id: 3,
      previousHash:
        "f833754b017d09c793d884c43ce6815954b02aaf1b2b6853427760c482865351",
      transactionHash: "",
      nonce: "2839",
      headerHash: "",
      transactions: [{ amount: "3.0", from: "Konstantin", to: "Lily" }],
      blockValid: true,
    },
  ];

  $: {
    for (let i = 0; i < blocks.length - 1; i++) {
      if (blocks[i].headerHash === blocks[i + 1].previousHash)
        blocks[i].blockValid = true;
      else blocks[i].blockValid = false;
    }
  }

  onMount(() => {
    const popoverTriggerList = document.querySelectorAll(
      '[data-bs-toggle="popover"]'
    );
    const popoverList = [...popoverTriggerList].map(
      (popoverTriggerEl) =>
        new Popover(popoverTriggerEl, {
          html: true,
          sanitize: false,
          trigger: "focus",
        })
    );
  });

  function addBlock() {
    let newBlock = {
      id: blocks.length + 1,
      previousHash: blocks[blocks.length - 1].headerHash,
      transactionHash: "",
      nonce: Math.floor(Math.random() * 10000),
      headerHash: "",
      transactions: [{ amount: "", from: "", to: "" }],
      blockValid: true,
    };
    blocks = [...blocks, newBlock];
  }

  let hintText =
    "<em>Fahre über ein Element, um eine Erklärung zu erhalten.</em>";
  let highlightedPreviousHash = "";
  let activateMining = false;

  const parentDeleteBlock = (id) => {
    if (blocks.length === 1) return;

    blocks = blocks.filter((block) => block.id !== id);
    // update ids
    blocks = blocks.map((block, index) => {
      block.id = index + 1;
      return block;
    });
  };
</script>

<svelte:head>
  <title>Blockchain Demo</title>
  <meta name="description" content="Blockchain Demo" />
</svelte:head>

<h1>Blockchain Demo</h1>

<button
  type="button"
  class="infoBtn btn btn-outline-dark btn-sm"
  data-bs-container="body"
  data-bs-toggle="popover"
  data-bs-placement="bottom"
  data-bs-content="Quellcode auf <a href='https://github.com/tools-info-bw-de/blockchain-demo' target='_blank'>github</a>!<br>Lizenz: MIT<br>Marco Kümmel"
  >info</button
>

<div
  class="form-check form-switch d-flex justify-content-end align-items-center mt-2 ms-4 activateMiningToggle"
>
  <input
    class="form-check-input me-2"
    type="checkbox"
    role="switch"
    id="activateMining"
    bind:checked={activateMining}
  />
  <label class="form-check-label" for="activateMining"
    >Aktiviere das Block-Mining<br /><em
      >Erst aktivieren, wenn du die Basics verstanden hast.</em
    ></label
  >
</div>

<div class="block-scroll mt-5">
  {#each blocks as blockData}
    <Block
      bind:blockData
      bind:hintText
      bind:highlightedPreviousHash
      bind:activateMining
      {parentDeleteBlock}
    />
  {/each}
  <div class="d-flex align-items-center me-3">
    <button class="btn btn-outline-primary" on:click={addBlock}
      >Weiteren Block hinzufügen</button
    >
  </div>
</div>

<div class="d-flex justify-content-center mt-4 mb-3">
  {#key hintText}
    <div class="hintBox p-4">
      <div in:fade={{ delay: 105, duration: 100 }}>{@html hintText}</div>
    </div>
  {/key}
</div>

<style>
  .infoBtn {
    position: absolute;
    top: 10px !important;
    right: 10px !important;
  }

  .activateMiningToggle {
    position: absolute;
    top: 10px !important;
    left: 10px !important;
  }

  #activateMining {
    font-size: 1.3rem;
  }

  .block-scroll {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
  }

  .hintBox {
    font-size: 1.15rem;
    border: 1px dashed rgb(185, 110, 110);
    width: 70vw;
    min-width: 300px;
    border-radius: 1rem;
  }
</style>
