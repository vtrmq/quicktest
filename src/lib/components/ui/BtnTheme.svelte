<script lang="ts">
  function changeTheme() {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", 'true');
      const elementHTML = document.querySelector<HTMLInputElement>("html");
      if (elementHTML) {
        elementHTML.classList.add('dark');
      }
    } else {
      localStorage.removeItem("theme");
      const elementHTML = document.querySelector<HTMLInputElement>("html");
      if (elementHTML) {
        elementHTML.removeAttribute('class');
      }
    }
  }
</script>

<button onclick={changeTheme} aria-label="button">
  <svg class="sun" stroke-width="1.3" viewBox="0 0 24 24" fill="none"><path d="M12 18a6 6 0 100-12 6 6 0 000 12zM22 12h1M12 2V1M12 23v-1M20 20l-1-1M20 4l-1 1M4 20l1-1M4 4l1 1M1 12h1" stroke="currentcolor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  <svg class="moon" stroke-width="1.3" viewBox="0 0 24 24" fill="none"><path d="M3 11.507a9.493 9.493 0 0018 4.219c-8.507 0-12.726-4.22-12.726-12.726A9.494 9.494 0 003 11.507z" stroke="currentcolor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
</button>

<style>
  :global(:root) {
    --eye-sun: block;
    --eye-moon: none;
    --color-theme: #9b9b9b;
    --bg-btn-theme: #2a4156;
	}
  :global(html.dark) {
    --eye-sun: none;
    --eye-moon: block;
    --color-theme: #b4b4b4;
    --bg-btn-theme: #edf1f8;
	}
  .sun {
    display: var(--eye-sun);
  }
  .moon {
    display: var(--eye-moon);
  }
  button {
    border: none;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background: transparent;
    width: 30px;
    height: 30px;
    border-radius: 50px;
  }
  svg {
    width: 23px;
    position: absolute;
    color: var(--color-theme);
  }
</style>
