<script lang="ts">
import { goto, invalidateAll } from "$app/navigation";
import { Title, NoneData, Dialog, Toast, PaymentSettingTeacher, Input, OptionSelect, Pagination } from '$lib/components';
import type { PaymentSetting } from '$lib/types';
import { MONTH } from '$lib/utils';
import trash from '$lib/assets/svg/trash.svg?raw'
import shieldCheck from '$lib/assets/svg/shield-check.svg?raw'
import shieldAlert from '$lib/assets/svg/shield-alert.svg?raw'

let { data } = $props();
let dialog = $state<Dialog | null>(null);
let toast = $state<Toast>();
let posTeacher: number = 0;
let isSearch: boolean = $state(false);

type TeacherPayment = {
  teacher: {
    id: number;
    name: string;
    surnames: string;
    email: string;
    phone: string;
    school: string;
    created_at: string;
    blocked: string;
  };
  payment_setting: PaymentSetting;
};

type PaginationResult = {
  limit: number;
  page: number;
  totalCount: number;
  totalPages: number;
}

let search: string = $state(data.search ?? '');
let teachers: TeacherPayment[] = $state([]);
let pagination: PaginationResult = $state({limit: 0, page: 0, totalCount: 0, totalPages: 0});

$effect(() => {
  teachers = data.teachers;
  pagination = data.pagination;
});

// Definimos un tipo para asegurar que solo se pasen números de mes válidos (del 1 al 12)
type NumberOfMonth = keyof typeof MONTH;
type ValuesPay = {literalMonth?: string, month?: number, pay_day: number, price: number, paid: boolean};

function handlePay(index: number): ValuesPay | null {
  const pay_day = teachers[index].payment_setting.pay_day;
  if (pay_day === null) {
    return null;
  }
  const today = new Date();
  const yearCurrent = today.getFullYear();
  const monthCurrent = today.getMonth() + 1;
  const dayCurrent = today.getDate();
  const payment_setting = teachers[index].payment_setting;
  const lastPaymentMonth = payment_setting.next_payment_month;
  const year = payment_setting.year;
  const price = payment_setting.price;

  // Cambio de año
  if (yearCurrent !== year) {
    const literalMonth = MONTH[lastPaymentMonth as NumberOfMonth];
    return {literalMonth, pay_day, price, paid: false}
  }

  const literalMonth = MONTH[lastPaymentMonth as NumberOfMonth];

  // El mes actual es menor que el mes de pago (Está dentro de la fecha)
  // El mes actual es igual que el mes de pago pero el día actual es menor que el día de pago (Está dentro de la fecha)
  //if (monthCurrent < lastPaymentMonth || (monthCurrent === lastPaymentMonth && dayCurrent < pay_day)) {
  //  return {literalMonth, pay_day, paid: true}
  //}

  // El mes actual es igual que el mes de pago pero el día actual es igual o mayor que el día de pago (Está fuera de la fecha)
  // EL mes actual es mayor que el mes de pago (Está fuera de fecha)
  if ((monthCurrent === lastPaymentMonth && dayCurrent >= pay_day) || monthCurrent > lastPaymentMonth) {
    return {literalMonth, pay_day, price, paid: false}
  }

  // Está dentro de la fecha
  return {literalMonth, pay_day, price, paid: true}
}

function handleValuesSetting(index: number, values: PaymentSetting) {
  teachers[index].payment_setting = values;
}

function handlePayments(index: number) {
  const id = teachers[index].payment_setting.id;
  if (!id) {
    toast?.view({
      type: 'success',
      message: 'El docente no tiene día de pago ni precio asignado',
      time: 5000
    });
    return;
  }
  const teacherId = teachers[index].teacher.id;
  if (search.length === 0) {
    goto(`/admin/payments?teacherId=${teacherId}&back=teachers`);
  } else {
    goto(`/admin/payments?teacherId=${teacherId}&search=${search}&back=teachers`);
  }
}

async function handleSearch(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const search = formData.get('search');
  isSearch = true;
  await goto(search ? `/admin/teachers?search=${search}` : '/admin/teachers', {
    replaceState: true, // No añade una nueva entrada al historial
    noScroll: true,    // Evita scroll al inicio
  });
  await invalidateAll();
  isSearch = false;
}

async function handleEnableDisabled(index: number) {
  const blocked = teachers[index].teacher.blocked === 'N' ? 'S' : 'N';
  teachers[index].teacher.blocked = blocked;
  const teacherId = teachers[index].teacher.id.toString();

  const formData = new FormData();
  formData.append('teacher_id', teacherId);
  formData.append('blocked', blocked);

  const response = await fetch('?/blocked', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    toast?.view({
      type: 'success',
      message: blocked === 'N' ? 'Docente habilitado' : 'Docente bloqueado',
      time: 3000
    });
  } else {
    const errData = await response.json();
    toast?.view({
      type: 'success',
      message: errData.error.message,
    });
  }
}

function handleActionShowWin(index: number) {
  const teacher = teachers[index].teacher;
  posTeacher = index;
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar a ${teacher?.name} ${teacher?.surnames}?`,
  });
}

async function handleActionDelete(e: string) {
  if (e === 'accept') {
    const teacherId = teachers[posTeacher].teacher.id.toString();
    teachers = teachers.filter((_, i) => i !== posTeacher);

    const formData = new FormData();
    formData.append('teacher_id', teacherId);

    const response = await fetch('?/visible', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      toast?.view({
        type: 'success',
        message: 'Docente eliminado',
        time: 3000
      });
    } else {
      const errData = await response.json();
      toast?.view({
        type: 'success',
        message: errData.error.message,
      });
    }

  }
}

</script>

<Dialog bind:this={dialog} action={handleActionDelete} />
<Toast bind:this={toast} />

<div class="container-teachers-registrations">

  <div class="wr-title">
    <Title>Docentes registrados</Title>
    <p class="desc">Configura el precio y el día de pago para cada docente</p>
    <form class="form-search" onsubmit={handleSearch} novalidate>
      <Input 
        isSearch={isSearch} 
        type="search" 
        label="Buscar docente / Día de pago" 
        name="search" 
        bind:value={search} />
    </form>
  </div>

  {#if teachers.length !== 0}
    <div>
      <div class="wrapper">
        {#each teachers as row, i}
          {@const values: ValuesPay | null = handlePay(i)}
          <div>
            <div class="row-teacher">
              <div class="box-point" class:border-top-left={i === 0} class:border-bottom-left={i + 1 === teachers.length}>
                <button class="point" onclick={()=>handlePayments(i)}>
                  {#if values && values.paid === true}
                    <div class="circle-green">&nbsp;</div>
                  {:else if values && values.paid === false}
                    <div class="circle-gray">&nbsp;</div>
                  {/if}
                </button>
                <div class="box-a">
                  <div class="box-b">&nbsp;</div>
                  <div class="box-b">&nbsp;</div>
                </div>
                <div class="box-a">
                  <div class="box-b" class:border-left={i !== 0 && i + 1 <= teachers.length}>&nbsp;</div>
                  <div class="box-b" class:border-left={i + 1 < teachers.length}>&nbsp;</div>
                </div>
              </div>
              <div>
                <div class="wr-pay-select">
                  <PaymentSettingTeacher {values} setting={row} valuesSetting={handleValuesSetting} index={i} />
                  <OptionSelect>
                    <button onclick={()=>handleEnableDisabled(i)}>
                      {#if row.teacher.blocked === 'N'}
                        {@html shieldCheck} 
                        <span>Habilitado</span>
                      {:else}
                        {@html shieldAlert} 
                        <span>Bloqueado</span>
                      {/if}
                    </button>
                    <button onclick={()=>handleActionShowWin(i)}>{@html trash} <span>Eliminar docente</span></button>
                  </OptionSelect>
                </div>
                <div><p class="name" class:blocked={row.teacher.blocked === 'S'}>{row.teacher.name} {row.teacher.surnames}</p></div>
                <div class="email-phone">
                  <p>{row.teacher.email}</p>
                  <p>{row.teacher.phone}</p>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
      {#if pagination.totalPages > 1} 
        <Pagination page={pagination.page} totalPages={pagination.totalPages} />
      {/if}
    </div>
  {/if}

</div>

{#if teachers.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay docentes registrados</NoneData>
  </div>
{/if}

<style>
.form-search {
  margin-top: 0.5em;
}
.blocked {
  background: #d30475;
  color: #fff;
}
.wr-pay-select {
  display: flex;
  justify-content: space-between;
  padding-right: 1em;
  align-items: center;
}
.circle-green {
  background: #1bf51b;
  width: 18px;
  height: 18px;
  border-radius: 60px;
  box-shadow: rgb(17 17 26 / 63%) 0px 4px 15px, rgb(17 17 26 / 42%) 0px 0px 6px;
}
.circle-gray {
  background: #ff5fbe;
  width: 18px;
  height: 18px;
  border-radius: 60px;
  box-shadow: rgb(17 17 26 / 63%) 0px 4px 15px, rgb(17 17 26 / 42%) 0px 0px 6px;
}
.border-left {
  border-left: 1px solid #6049eb;
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
  background: linear-gradient(135deg, #9382fd 0%, #6049EB 100%);
  color: #fff;
  box-shadow: 0 6px 12px rgb(188 160 239 / 74%);
  position: absolute;
  cursor: pointer;
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
  height: 150px;
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
  font-size: 1em;
  font-family: var(--font-normal);
  line-height: 23px;
}
.name {
  font-size: 1.1em;
  font-weight: 600;
  font-family: var(--font-normal);
  margin: 4px 0;
  display: inline-block;
}
.email-phone {
  font-size: 1em;
  font-family: var(--font-normal);
  color: #777777;
  text-transform: lowercase;
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
  margin-top: 1em;
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
  .desc {
    font-size: 1em;
  }
  .desc {
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
