<script lang="ts">
  const year: number = new Date().getFullYear();
</script>

<footer class="footer">
  <div class="wr-footer">
    <p class="text-footer">© {year} LocalSchool</p>
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
    color: #c8bfff;
    font-family: var(--font-normal);
    font-size: 0.9em;
    text-transform: uppercase;
  }
  .footer {
    background: var(--bg-footer-main);
    padding: 3em 1em;


    /*
    background-image: linear-gradient(rgb(255 255 255 / 76%), rgb(255 255 255 / 86%)), url('https://seesaw.com/wp-content/uploads/2024/01/holding-shape-pattern.svg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    */
  }
</style>
