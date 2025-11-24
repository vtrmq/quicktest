<script lang="ts">
import { Title, NoneData, Dialog, Toast, PaymentSettingTeacher } from '$lib/components';
import type { PaymentSetting } from '$lib/types';
import { MONTH } from '$lib/utils';

let { data } = $props();
let dialog = $state<Dialog | null>(null);
//let posTeacher: number = -1;
let toast = $state<Toast>();

type TeacherPayment = {
  teacher: {
    id: number;
    name: string;
    surnames: string;
    email: string;
    phone: string;
    school: string;
    created_at: string;
  };
  payment_setting: PaymentSetting;
};

let teachers: TeacherPayment[] = $state(data.teachers ?? []);

console.log($state.snapshot(teachers))

function handleActionWin() {
}

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


</script>

<Dialog bind:this={dialog} action={handleActionWin} />
<Toast bind:this={toast} />

<div class="container-teachers-registrations">

  <div>
    <div class="wr-title">
      <Title>Docentes registrados</Title>
      <p class="desc">Configura el precio y el día de pago para cada docente</p>
    </div>
  </div>

  {#if teachers.length !== 0}
    <div class="wrapper">
      {#each teachers as row, i}
        {@const values: ValuesPay | null = handlePay(i)}
        <div>
          <div class="row-teacher">
            <div class="box-point">
              <button class="point">
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
                <div class="box-b" class:border-left={i !== 0 && i + 1 === teachers.length}>&nbsp;</div>
                <div class="box-b" class:border-left={i + 1 < teachers.length}>&nbsp;</div>
              </div>
            </div>
            <div>
              <div><PaymentSettingTeacher {values} setting={row} valuesSetting={handleValuesSetting} index={i} /></div>
              <p class="name">{row.teacher.name} {row.teacher.surnames}</p>
              <div class="email-phone">
                <p>{row.teacher.email}</p>
                <p>{row.teacher.phone}</p>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

</div>

{#if teachers.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay docentes registrados</NoneData>
  </div>
{/if}

<style>
.circle-green {
  background: #1bf51b;
  width: 24px;
  height: 24px;
  border-radius: 60px;
  box-shadow: rgb(17 17 26 / 63%) 0px 4px 15px, rgb(17 17 26 / 42%) 0px 0px 6px;
}
.circle-gray {
  background: #ff5fbe;
  width: 24px;
  height: 24px;
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
.row-teacher {
  display: grid;
  align-items: center;
  gap: 1em;
  grid-template-columns: 70px 1fr;
}
.desc {
  font-size: 1.4em;
  font-family: var(--font-normal);
}
.name {
  font-size: 1.6em;
  font-weight: 600;
  font-family: var(--font-normal);
}
.email-phone {
  font-size: 1.4em;
  font-family: var(--font-normal);
  color: #777777;
  text-transform: lowercase;
}
.container-teachers-registrations {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1em;
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
  margin: 2em 0;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0px 4px 16px rgb(155 155 155 / 25%);
}
@media(min-width: 700px) {
  .container-teachers-registrations {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 3em;
  }
}
</style>
