<script lang="ts">
import { goto, invalidateAll } from "$app/navigation";
import { Title, NoneData, Input, BarChartMonths } from '$lib/components';
let { data } = $props();

type Months = {
    month: number;
    name: string;
    payments: { value: number; date: string }[];
    total: number;
};

type Result = {
  year: number;
  totalYear: number;
  months: Months[];
} | null;

const result: Result = data.result;
let search: number | undefined = $state(result?.year);
let months: Months[] = $state([]);
let totalYear: number = $state(0);
let isSearch: boolean = $state(false);
let msgError: string = $state('');
let inputSearch: string = $state('');

$effect(() => {
  months = data.result?.months ?? [];
  totalYear = data.result?.totalYear ?? 0;
});

async function handleSearch(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const search = formData.get('search');
  msgError = '';
  inputSearch = '';
  if (search) {
    isSearch = true;
    await goto(search ? `/admin/statistics?year=${search}` : '/admin/statistics', {
      replaceState: true, // No añade una nueva entrada al historial
      noScroll: true,    // Evita scroll al inicio
    });
    await invalidateAll();
    isSearch = false;
  } else {
    msgError = 'Escribe el año de búsqueda';
    inputSearch = 'search';
  }
}

</script>

<div class="container-teachers-registrations">

  <div class="wr-title">
    <Title>Estadísticas</Title>
    <p class="desc">Observa el total de pagos registrados y el monto recaudado de cada mes</p>
    <form class="form-search" onsubmit={handleSearch} novalidate>
      <Input 
        isSearch={isSearch} 
        type="search" 
        label="Año de búsqueda" 
        name="search" 
        bind:value={search} 
        error={msgError} 
        input={inputSearch} />
    </form>
    <BarChartMonths {months} width={360} height={200} maxBarWidth={18} />
    <p class="income">Total ingresos: ${totalYear}</p>
  </div>

  {#if months.length !== 0}
    <div class="wrapper">
      
      {#each months as row, i}
        <div>
          <div class="row-teacher">
            <div class="box-point" class:border-top-left={i === 0} class:border-bottom-left={i + 1 === months.length}>
              <div class="point">
                <div class="circle-green">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-b">&nbsp;</div>
                <div class="box-b">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-b" class:border-left={i !== 0 && i + 1 <= months.length}>&nbsp;</div>
                <div class="box-b" class:border-left={i + 1 < months.length}>&nbsp;</div>
              </div>
            </div>
            <div>
              <p class="month">{row.name}</p>
              <div class="info-pay">
                <p>Pagos registrados: {row.payments.length}</p>
                <p>Total: ${row.total}</p>
              </div>
            </div>
          </div>
        </div>
      {/each}

    </div>
  {/if}

</div>

{#if months.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay datos para mostrar</NoneData>
  </div>
{/if}

<style>
.income {
  font-size: 1.1em;
  font-family: var(--font-normal);
}
.form-search {
  margin-top: 0.5em;
}
.circle-green {
  background: #d7f9f9;
  width: 18px;
  height: 18px;
  border-radius: 60px;
  box-shadow: rgb(17 17 26 / 38%) 0px 4px 15px, rgb(17 17 26 / 34%) 0px 0px 6px;
}
.border-left {
  border-left: 1px solid #4ca1a1;
}
.point {
  font-size: 1em;
  font-family: var(--font-bold);
  width: 40px;
  height: 40px;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #7bd5d5 0%, #35a3a3 100%);
  color: #fff;
  box-shadow: 0 6px 12px rgb(103 185 185);
  position: absolute;
  outline: none;
  border: none;
}
.box-a {
  height: 100%;
  width: 50%;
}
.box-b {
  height: 50%;
}
.box-point {
  display: flex;
  background: #a0e7e7;
  width: 70px;
  height: 110px;
  justify-content: center;
  align-items: center;
}
.border-top-left {
  border-top-left-radius: 8px;
}
.border-bottom-left {
  border-bottom-left-radius: 8px;
}
.row-teacher {
  display: grid;
  align-items: center;
  gap: 1em;
  grid-template-columns: 70px 1fr;
}
.desc {
  font-size: 1.1em;
  font-family: var(--font-normal);
  line-height: 23px;
}
.month {
  font-size: 1.3em;
  font-weight: 800;
  font-family: var(--font-normal);
  margin: 4px 0;
  color: #407777;
}
.info-pay {
  font-size: 1.1em;
  font-family: var(--font-normal);
  color: #777777;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.container-teachers-registrations {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1em 0;
}
.wr-none-data {
  padding: 3em 0;
}
.wr-title {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  margin-bottom: 1.5em;
}
.wrapper {
  margin: 1.5em 0;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: #f0ffff8a;
  height: max-content;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
}
@media(min-width: 800px) {
  .container-teachers-registrations {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3em;
  }
  .info-pay {
    font-size: 0.9em;
  }
  .desc, .income {
    font-size: 1em;
  }
  .wr-title {
    position: sticky;
    top: 105px;
    height: fit-content;
    margin-top: 13px;
  }
}
</style>
