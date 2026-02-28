<script lang="ts">
  import { enhance } from '$app/forms';
  import { DASHBOARDS } from "$lib/utils";
  let { data } = $props();
  const root = data.user?.profile;
</script>

<div class="container">
  <div class="wrapper">
    <a class="link" href="{root === undefined ? '/' : DASHBOARDS[root]}">Volver</a>
    <h1 class="logout">Logout</h1>
    <div>
      <p class="name">{data.user?.name} {data.user?.surnames}</p>
      <form method="POST" use:enhance>
        <button class="btn-logout">Cerrar sesión</button>
      </form>
    </div>
  </div>
</div>

<style>
.link {
  font-family: var(--font-normal);
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
  color: brown;
}
.logout {
  font-family: var(--font-normal);
  padding: 0.5em 0;
}
.name {
  font-family: var(--font-normal);
  padding: 0 0 2em;
}
.btn-logout {
  font-family: var(--font-normal);
  padding: 0.8em 1.5em;
  cursor: pointer;
  color: #fff;
  font-size: 1em;
  text-decoration: none;
  background: #65c15d;
  width: 100%;
  height: 50px;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  transition: var(--transition);
}
.btn-logout:hover {
  background: #62b15c;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3em;
  padding: 1em;
}
.wrapper {
  padding: 2em 1em;
  width: 100%;
  max-width: 350px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  border-radius: 6px;
}
</style>
