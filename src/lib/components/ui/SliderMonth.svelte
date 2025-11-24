<script lang="ts">
import minus from '$lib/assets/svg/minus.svg?raw'
import plus from '$lib/assets/svg/plus.svg?raw'
import { MONTH } from '$lib/utils';

type Props = {
  nextPaymentMonth: number | null;
  changemount: (e: number) => void;
}
let { nextPaymentMonth, changemount }: Props = $props();

const info: any = MONTH;
const today = new Date();
const monthCurrent = today.getMonth() + 1;
let posMonth = nextPaymentMonth === null ? monthCurrent : nextPaymentMonth;
let month = $state(nextPaymentMonth === null ? info[monthCurrent] : info[nextPaymentMonth]);

function handleClickSlider(move: string) {
  if (move === 'left') {
    posMonth = posMonth - 1;
    if (posMonth === 0) {
      posMonth = 1;
      return;
    }
    month = info[posMonth]
  } else if (move === 'right') {
    posMonth = posMonth + 1;
    if (posMonth === 13) {
      posMonth = 12;
      return;
    }
    month = info[posMonth]
  }
  changemount(posMonth);
}
</script>

<div class="container-slider">
  <div class="wr-box-slider">
    <div class="bx-btn ">
      <button type="button" class="btn-slider border-left-bottom" onclick={()=>handleClickSlider('left')}>{@html minus}</button>
    </div>
    <div class="wr-display">
      <p class="label">Mes de incio</p>
      <p class="display-month">{month}</p>
    </div>
    <div class="bx-btn">
      <button type="button" class="btn-slider border-right-bottom pos-right" onclick={()=>handleClickSlider('right')}>{@html plus}</button>
    </div>
  </div>
</div>

<style>
:global(.btn-slider > svg) {
  width: 16px;
  color: #ffffff;
}
.pos-right {
  position: relative;
  right: 4px;
}
.border-left-bottom {
  border-top-left-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
}
.border-right-bottom {
  border-top-right-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
.bx-btn {
  padding: 2px;
  height: 100%;
}
.wr-display {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fff;
  align-items: center;
  width: 98%;
  height: 100%;
}
.label {
  font-family: var(--font-normal);
  font-weight: 600;
  font-size: 1.3em;
  color: var(--color-label-input);
  text-align: center;
  display: none;
}
.container-slider {
  display: flex;
  align-items: center;
  gap: 1em;
  height: 43.63px;
}
.wr-box-slider {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  border: 1px solid var(--color-border-input);
  border-radius: var(--border-radius);
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.btn-slider {
  width: 40px;
  height: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #add8e6 0%, #4a889b 100%);
}
.display-month {
  font-family: var(--font-normal);
  font-size: var(--font-size);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
}
@media (min-width: 700px) {
  .wr-display {
    height: 95%;
  }
  .label {
    font-size: 1.1em;
    display: block;
  }
}
</style>
