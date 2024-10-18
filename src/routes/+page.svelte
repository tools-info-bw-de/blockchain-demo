<script>
  import "bootstrap/dist/css/bootstrap.min.css";
  import Block from "./Block.svelte";

  let blocks = [
    {
      id: 1,
      previousHash:
        "0000000000000000000000000000000000000000000000000000000000000000",
      transactionHash: "",
      nonce: "836",
      headerHash: "",
      transactions: [
        { amount: "50.2", from: "Alice", to: "Bob" },
        { amount: "10.1", from: "Charlie", to: "David" },
      ],
      blockValid: true,
    },
    {
      id: 2,
      previousHash:
        "88b15cff07ac16932ed6b61ed7ffce8a6e30793171124ab828b3331a526d07b0",
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
        "1d6f8bcf7105afae69841b36476587a1f1ad12ae94e4cee36ec6a22cd8e7a87c",
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

  let hintText = "";
</script>

<svelte:head>
  <title>Blockchain Demo</title>
  <meta name="description" content="Blockchain Demo" />
</svelte:head>

<h1>Blockchain</h1>
<div class="block-scroll">
  {#each blocks as blockData}
    <Block bind:blockData bind:hintText />
  {/each}

  {hintText}
</div>

<style>
  .block-scroll {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
  }
</style>
