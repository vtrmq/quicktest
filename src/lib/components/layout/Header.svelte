<script>
  let { children, bg = false, fixed = false } = $props()
</script>
<header class="header" class:fixed={fixed} class:bg={bg}>
  {@render children()} 
</header>

<style>
:global {
  .link-logo {
    display: flex;
    margin-left: 14px;
  }
  .link-logo > img {
    display: flex;
    width: 120px;
  }
}
.fixed {
  position: fixed;
  width: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--height-header);
  z-index: 50;
}
.header.bg {
  background: var(--bg-header);
}
@media(min-width: 700px) {
  :global {
    .link-logo {
      margin-left: 18px;
    }
  }
}
</style>
