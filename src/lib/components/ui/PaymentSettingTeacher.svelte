<script lang="ts">
import { fade } from 'svelte/transition';
import { Title, Button, BtnX, Select, Input, SliderMonth } from '$lib/components';
import type { PaymentSetting } from '$lib/types';

type TeacherPayment = {
  teacher: {
    id: number;
    name: string;
    surnames: string;
  };
  payment_setting: PaymentSetting;
};

type ValuesPay = {literalMonth?: string, pay_day: number, price: number, paid: boolean};
type Props = { setting: TeacherPayment, valuesSetting: (i: number, e: PaymentSetting) => void, index: number, values: ValuesPay | null }

let { setting, valuesSetting, index, values }: Props  = $props();
let isDisplay = $state(false);
let btnSave = $state<Button>();
let input = $state('');
let error = $state('');
let year: number;
let next_payment_month: number = $state(setting.payment_setting.next_payment_month);
let copy_next_payment_month: number;
let isSave: boolean = $state(false);

function handleShow() {
  const today = new Date();
  year = today.getFullYear();
  next_payment_month = !next_payment_month ? today.getMonth() + 1 : next_payment_month;
  copy_next_payment_month = next_payment_month;
  isDisplay = !isDisplay;
  isSave = false;
}

function close() {
  if (isSave === false) {
    next_payment_month = copy_next_payment_month;
  }
  isDisplay = !isDisplay;
}

function handleKeyShow(e:KeyboardEvent) {
  if (isDisplay && e.key === 'Escape') {
    close();
  }
}

async function handleSave(e: SubmitEvent) {
  e.preventDefault();
  input = '';
  error = '';
  const form = e.currentTarget as HTMLFormElement;
  const formData = new FormData(form);
  const price = formData.get('price')?.toString();
  const pay_day = formData.get('pay_day')?.toString();

  if (!pay_day) {
    input = 'pay_day';
    error = 'Selecciona el día';
    return;
  }
  if (!price) {
    input = 'price';
    error = 'Escribe un precio';
    return;
  }

  let paymentSettingId: string = setting.payment_setting.id ? String(setting.payment_setting.id) : '';
  const teacher_id = setting.teacher.id.toString();

  formData.append('teacher_id', teacher_id);
  formData.append('paymentSettingId', paymentSettingId);
  formData.append('pay_day', pay_day);
  formData.append('price', price);
  formData.append('year', year.toString());
  formData.append('next_payment_month', next_payment_month.toString());

  btnSave?.load(true);

  const response = await fetch('/api/admin/save-day-price', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  btnSave?.load(false);
  isSave = true;

  const payment_setting = {
    id: result.lastResultId,
    next_payment_month: next_payment_month,
    pay_day: parseInt(pay_day),
    price: parseInt(price),
    year: year
  }

  valuesSetting(index, payment_setting);
  close();

}

function handleChangeMonth(posMonth: number) {
  next_payment_month = posMonth;
}

</script>

<svelte:window onkeydown={handleKeyShow} />

<button class="btn-setting" onclick={handleShow}>
  {#if setting.payment_setting.pay_day === null}
    <p class="label">Establece día de pago y precio</p>
  {:else if values}
    <div><span class="label">{values.literalMonth} {values.pay_day}</span>&nbsp;&nbsp;<span class="price">${values.price}</span></div>
  {/if}
</button>


{#if isDisplay}
  <div transition:fade={{ duration: 200 }} class="frame-setting" onclick={close} onkeyup={()=>{}} role="button" tabindex="0">

    <div class="win-setting" onclick={(e)=>e.stopPropagation()} onkeyup={()=>{}} role="button" tabindex="0">
      <BtnX onclick={close} />

      <form method="POST" novalidate onsubmit={handleSave}>
        <Title --color-title="#fff">{setting.teacher.name} {setting.teacher.surnames}</Title>
        <div class="wr-data">
          <div class="container-slider-month">
            <p class="label-msg">Mes de inicio del proceso de cobro</p>
            <SliderMonth 
              nextPaymentMonth={next_payment_month} 
              changemount={handleChangeMonth} />
          </div>
          <div class="container-info">
            <Select label="Día de pago" name="pay_day" value={setting.payment_setting.pay_day} error={error} input={input}>
              <option value=''></option>
              {#each Array(31) as _, i}
                <option value={i + 1}>{i + 1}</option>
              {/each}
            </Select>
            <Input 
              style="border" type="number" requested label="Precio" 
              value={setting.payment_setting.price ?? ''} error={error} input={input} 
              name="price" />
          </div>
          <div class="container-btns-actions">
            <Button type="button" bg="gray" onclick={close}>Cancelar</Button>
            <Button bind:this={btnSave} bg="green" type="submit">Guardar</Button>
          </div>
        </div>
      </form>

    </div>

  </div>
{/if}

<style>
.price {
  font-size: 1.1em;
  font-family: var(--font-normal);
  color: #426475;
}
.label-msg {
  font-family: var(--font-normal);
  font-weight: 600;
  font-size: 1em;
  color: var(--color-label-input);
}
.container-slider-month {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 0.3em;
  padding: 0 1em 0;
  margin-bottom: 1em;
}
.container-info {
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  gap: 1em;
  padding: 0 1em 0;
}
.container-btns-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
  gap: 1em;
}
.wr-data {
  background: #ffffff;
  border-radius: 8px;
  margin: 1em 0 0;
  padding: 2em 0 1em;
}
.frame-setting {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-screen);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  padding: 1em;
}
.btn-setting {
  background: transparent;
  cursor: pointer;
  margin-bottom: 0.4em;
}
.label {
  font-size: 1.1em;
  font-family: var(--font-normal);
  color: red;
  text-decoration: underline;
  text-underline-offset: 6px;
  text-decoration-thickness: 1px;
}
.win-setting {
  background: var(--bg-win-action);
  padding: 2em 1em;
  border-radius: 8px;
  box-shadow: var(--box-shadow-action);
  width: 100%;
  max-width: 460px;
  max-height: 500px;
  position: relative;
}
@media(min-width: 700px) {
  .label-msg {
    font-size: 0.8em;
  }
  .container-slider-month {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1em;
  }
}
</style>
