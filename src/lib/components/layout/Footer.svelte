<script lang="ts">
  const year: number = new Date().getFullYear();
</script>

<footer class="footer">
  <div class="wr-footer">
    <p class="text-footer">© {year} quicktest</p>
    <p class="text-footer">Colombia - Bogotá</p>
  </div>
</footer>

<style>
  :global(:root) {
    --bg-footer-main: #6049EB;
  }
  :global(.dark) {
    --bg-footer-main: #3b4698;
  }
  .wr-footer {
    max-width: 700px;
    margin: 0 auto;
  }
  .text-footer {
    color: #fff;
    font-family: var(--font-normal);
    font-size: 1.1em;
    text-transform: uppercase;
  }
  .footer {
    background: var(--bg-footer-main);
    padding: 2em 1em 2em;
  }
</style>
