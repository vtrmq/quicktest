<script lang="ts">
import { invalidateAll } from '$app/navigation';
import { page } from '$app/state';
import type { ActionData } from './$types';
import type { SubmitFunction /*, ActionResult*/ } from '@sveltejs/kit';
import { enhance /*, deserialize*/ } from '$app/forms';
import { LinkBack,  Title, Input, DataFrame, Button, Toast, NoneData, Dialog, SliderMonth, Pagination } from '$lib/components';
import { formatDateHour, searchParam } from '$lib/utils';

let btnSave = $state<Button>();
let btnSaveMount = $state<Button>();

let { data, form }: {data: any, form: ActionData } = $props();
let toast = $state<Toast | null>(null);
let paymentId: number = -1;
let dialog = $state<Dialog | null>(null);

const back = searchParam(page.url.search, 'back');
const search = searchParam(page.url.search, 'search');
let href: string = $state(`/admin/${back}`);

(()=>{
  if (search) {
    href = `${href}?search=${search}`;
  }
})();

type Payments = {
  payment_id: number;
  date_at: string;
  amount: number;
}

type Teacher = {
  teacher_id: number,
  payment_id: number;
  name: string,
  surnames: string,
  pay_day: number,
  price: number,
  next_payment_month: number
}

type PaginationResult = {
  limit: number;
  page: number;
  totalAmount: number;
  totalCount: number;
  totalPages: number;
}

const teacher: Teacher = $derived(data.teacher);
let payments: Payments[] = $derived(data.payments);
//const pagination = $derived(data.pagination);
let next_payment_month: number = data.teacher.next_payment_month;
let pagination: PaginationResult = $state({limit: 0, page: 0, totalAmount: 0, totalCount: 0, totalPages: 0});

$effect(() => {
  pagination = data.pagination;
});

/*
let total: number = $derived.by(()=>{
  let _total = 0;
  for (let i = 0; i < payments.length; i++) {
    _total = _total + payments[i].amount;
  }
  return _total;
});
*/

const handleForm: SubmitFunction = () => {
  btnSave?.load(true);
  return async ({ update, result }) => {
    if (result.type === 'failure') {
      btnSave?.load(false);
      const data = result.data;
      if (data?.origin === 'form') {
        await update();
      } else if (data?.origin === 'server') {
        toast?.view({ type: 'success', message: data.message });
      }
    } else {
      toast?.view({ type: 'success', message: 'Pago adicionado', time: 3000 });
      btnSave?.load(false);
      await update();
    }
  };
};

function handleWinDelete(i: number) {
  paymentId = payments[i].payment_id;
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar el pago?`,
  });
}

async function handleActionWin(e: string) {
  if (e === 'accept') {

    const formData = new FormData();
    formData.append('payment_id', paymentId.toString());

    const response = await fetch('?/delete', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      await invalidateAll();
      toast?.view({
        type: 'success',
        message: 'Pago eliminado',
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

function handleChangeMonth(posMonth: number) {
  next_payment_month = posMonth;
}

async function handleSaveMonth() {
  const teacher_id = teacher.teacher_id;
  const payment_id = teacher.payment_id;
  const formData = new FormData();
  formData.append('teacher_id', teacher_id.toString());
  formData.append('payment_id', payment_id.toString());
  formData.append('next_payment_month', next_payment_month.toString());

  btnSaveMount?.load(true);
  const response = await fetch('?/month', {
    method: 'POST',
    body: formData
  });

  btnSaveMount?.load(false);
  if (response.ok) {
    toast?.view({
      type: 'success',
      message: 'Mes de pago actualizado',
    });
  } else {
    const errData = await response.json();
    toast?.view({
      type: 'success',
      message: errData.error.message,
    });
  }
}

</script>

<Dialog bind:this={dialog} action={handleActionWin} />
<Toast bind:this={toast} />

<div class="container-teacher-payments">
  <div class="wrapper-payments">
    <div class="wr-title">
      <LinkBack href={href}>Docentes</LinkBack>
      <Title>Pagos adicionados</Title>
      <p class="desc">Lista de pagos realizados por el docente</p>
    </div>

    <DataFrame width="690px">
      <form class="form" method="POST" action="?/add" use:enhance={handleForm} novalidate>
        <h2 class="name">{teacher.name} {teacher.surnames}</h2>
        <div class="body-form">
          <div class="row-form">
            <Input 
              style="border" type="date" requested label="Fecha de pago" 
              value={form?.field?.date ?? ''} error={form?.msg} input={form?.input ?? ''} 
              name="date" />
            <Input 
              style="border" type="number" requested label="Precio (${teacher.price})" 
              value={form?.field?.price ?? ''} error={form?.msg} input={form?.input ?? ''} 
              name="price" />
            <input type="hidden" name="teacher_id" value={teacher.teacher_id} />
          </div>
          <div class="row-form">
            <Button bind:this={btnSave}>Adicionar pago</Button>
          </div>
        </div> 
      </form>
    </DataFrame>

    <div class="slider-month">
      <div class="label">Mes siguiente a pagar</div>
      <div class="wr-slider">
        <SliderMonth 
          nextPaymentMonth={teacher.next_payment_month} 
          changemount={handleChangeMonth} />
        <Button bind:this={btnSaveMount} onclick={handleSaveMonth}>Guardar</Button>
      </div>
    </div>

    <div class="container-payments">
      {#if payments.length !== 0}
        {#each payments  as payment, i}
          <div class="row-teacher">
            <div class="box-point">
              <button class="point" aria-label="Button" onclick={()=>handleWinDelete(i)}>
                <div class="circle-gray">&nbsp;</div>
              </button>
              <div class="box-a">
                <div class="box-b">&nbsp;</div>
                <div class="box-b">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-b" class:border-left={i !== 0 && i + 1 <= payments.length}>&nbsp;</div>
                <div class="box-b" class:border-left={i + 1 < payments.length}>&nbsp;</div>
              </div>
            </div>
            <div class="date-price">
              <div>{formatDateHour(payment.date_at)}</div>
              <div class="space"></div>
              <div class="price">${payment.amount}</div>
            </div> 
          </div>
        {/each}
        <div>
          {#if pagination.totalPages > 1}
            <Pagination page={pagination.page} totalPages={pagination.totalPages} />
          {/if}
          <div class="r-total">
            <p class="total">${pagination.totalAmount}</p>
            <p class="reg">Reg: {pagination.totalCount}</p>
          </div>
        </div>
      {:else}
        <div class="wr-none-data">
          <NoneData>No hay pagos registrados</NoneData>
        </div>
      {/if}
    </div>
  </div>

</div>

<style>
.form {
  padding: 0.6em 0;
}
.r-total {
  text-align: right;
  font-family: var(--font-normal);
  padding: 0.8em 0.4em;
  margin-top: 1em;
  background: #fff;
  box-shadow: rgb(32 36 39 / 0%) 0px 12px 27px -5px, #353e431c 0px 3px 20px 0px;
  border-radius: var(--border-radius);
}
.total {
  font-weight: 600;
  color: #000;
  font-size: 1.4em;
}
.reg {
  color: #717171;
  font-size: 1em;
}
.wr-slider {
  display: grid;
  width: 100%;
  grid-template-columns: 1.45fr 1fr;
  gap: 1em;
}
.label {
  font-family: var(--font-normal);
  font-weight: 600;
  font-size: 1.1em;
  color: var(--color-label-input);
  width: 100%;
}
.slider-month {
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-template-columns: 84px 2fr 100px;
  background: #ffffff;
  box-shadow: rgb(32 36 39 / 0%) 0px 12px 27px -5px, #353e431c 0px 3px 20px 0px;
  border-radius: var(--border-radius);
  padding: 1em;
  margin-top: 2em;
  gap: 0.3em;
}
.space {
  width: 100%;
  border-bottom: 1px dashed #999999;
  height: 21px;
}
.price {
  font-weight: 500;
  color: brown;
  text-align: right;
}
.date-price {
  font-size: 1em;
  font-family: var(--font-normal);
  display: grid;
  justify-content: space-between;
  padding-right: 0.5em;
  grid-template-columns: 160px 4fr 0.5fr;
  gap: 0.3em;
}
.row-teacher {
  display: grid;
  align-items: center;
  gap: 1em;
  grid-template-columns: 50px 1fr;
}
.circle-gray {
  background: #8157cd;
  width: 18px;
  height: 18px;
  border-radius: 60px;
  box-shadow: rgb(199 199 199 / 63%) 0px 4px 15px, rgb(139 139 139 / 42%) 0px 0px 6px;
}
.border-left {
  border-left: 1px solid #9a8eeb;
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
  background: linear-gradient(135deg, #e9e9e9 0%, #aaa2df 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgb(188 160 239 / 63%);
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
  width: 46px;
  height: 80px;
  justify-content: center;
  align-items: center;
}
.wrapper-payments {
  width: 100%;
  max-width: 690px;
  margin: 0 auto;
}
.container-payments {
  width: 100%;
  max-width: 690px;
  margin: 2em 0;
}
.name {
  font-size: 1.2em;
  margin-bottom: 0.8em;
  font-family: var(--font-normal);
  border-bottom: 1px solid #cbcbcb;
  padding-bottom: 6px;
}
.body-form {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1em;
}
.row-form {
  display: flex;
  gap: 1em;
  width: 100%;
}
.container-teacher-payments {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}
.wr-title {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  margin-top: 1em;
  margin-bottom: 1.5em;
}
.desc {
  font-size: 1em;
  font-family: var(--font-normal);
}
@media(min-width: 700px) {
  .form {
    padding: 0;
  }
  .label {
    font-size: 0.8em;
  }
  .body-form {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
  .slider-month {
    display: grid;
    grid-template-columns: 100px 2fr;
    padding: 1.8em;
    gap: 1em;
  }
}
</style>
