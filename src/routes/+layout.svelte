<script>
  //import Header from './Header.svelte';
  import "../app.css";
</script>

<div class="app">
  <!-- <Header /> -->

  <main>
    <slot />
  </main>
</div>

<style>
  .app {
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
