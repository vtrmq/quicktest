<script lang="ts">
import { deserialize } from '$app/forms';
import plus from '$lib/assets/svg/plus.svg?raw';
import pencil from '$lib/assets/svg/pencil.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw'
import { truncateNumber } from '$lib/utils';
import { Title, NoneData, LinkBtn, OptionSelect, Toast, Dialog } from '$lib/components';

let { data } = $props();
let dialog = $state<Dialog | null>(null);
let toast = $state<Toast>();
let posScale: number = 0;

type Scale = {
  scale_id: number;
  scale: string;
  min_value: number;
  max_value: number;
};

let scales: Scale[] = $state(data.scales);

function handleActionShowWin(index: number) {
  const scale = scales[index].scale;
  posScale = index;
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar la escala: ${scale}?`,
  });
}

async function handleActionDelete(e: string) {
  if (e === 'accept') {
    const scaleId = scales[posScale].scale_id.toString();
    const formData = new FormData();
    formData.append('scale_id', scaleId);

    const response = await fetch('?/delete', {
      method: 'POST',
      body: formData
    });

    const responseText = await response.text();
    const result = deserialize(responseText);

    if (result.type === 'success' || result.type === 'failure') {
      if (result.type === 'success') {
        scales = scales.filter((_, i) => i !== posScale);
      }
      const responseData = result.data; 
      toast?.view({
        type: result.type,
        message: responseData?.message,
        time: 3000
      });
    }

  }
}

</script>

<Dialog bind:this={dialog} action={handleActionDelete} />
<Toast bind:this={toast} />

<div class="container-teachers-registrations">

  <div class="wr-title">
    <Title>Escala valorativa</Title>
    <p class="desc">Crea la escala valorativa que utilizarás en las pruebas</p>
    <div class="wr-links">
      <LinkBtn href="/teacher/scale/new" --max-width-link-btn="230px">{@html plus} Escala valorativa</LinkBtn>
    </div>
  </div>

  {#if scales.length !== 0}
    <div class="wrapper">
      
      {#each scales as row, i}
        <div>
          <div class="row-teacher">
            <div class="box-point" class:border-top-left={i === 0} class:border-bottom-left={i + 1 === scales.length}>
              <div class="point">
                <div class="circle-green">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb">&nbsp;</div>
                <div class="box-b">&nbsp;</div>
              </div>
              <div class="box-a">
                <div class="box-bb" class:border-left={i !== 0 && i + 1 <= scales.length}>&nbsp;</div>
                <div class="box-b" class:border-left={i + 1 < scales.length}>&nbsp;</div>
              </div>
            </div>
            <div class="box-course">
              <div class="info-course"><p class="scale">{row.scale}</p></div>
              <div class="info-pay">
                <div class="box-values">
                  <p>Min: {truncateNumber(row.min_value)} - Max: {truncateNumber(row.max_value)}</p>
                </div>
              </div>
              <div class="box-select">
                <OptionSelect>
                  <a href="/teacher/scale/edit?scaleId={row.scale_id}">{@html pencil} <span>Editar</span></a>
                  <button onclick={()=>handleActionShowWin(i)}>{@html trash} <span>Eliminar curso</span></button>
                </OptionSelect>
              </div>
            </div>
          </div>
        </div>
      {/each}

    </div>
  {/if}

</div>

{#if scales.length === 0}
  <div class="wr-none-data">
    <NoneData>No hay escala valorativa</NoneData>
  </div>
{/if}

<style>
.wr-links {
  display: flex;
  gap: 1em;
}
.box-select {
  display: inline-flex;
  position: absolute;
  top: 10px;
  right: 10px;
}
:global {
  .svg-subject > svg {
    width: 14px;
    color: #fff;
    stroke-width: 3px;
  }
}
.box-values {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0 1em 0.5em 0;
  color: brown;
  font-weight: 600;
}
.box-course {
  padding: 1em 0;
  position: relative;
}
.info-course {
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  margin-bottom: 0.3em;
}
.circle-green {
  background: #a5fbcf;
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
  top: 20px;
}
.box-a {
  height: 100%;
  width: 50%;
}
.box-bb {
  height: 30%;
}
.box-b {
  height: 70%;
}
.box-point {
  display: flex;
  background: #a0e7e7;
  width: 60px;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: relative;
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
  grid-template-columns: 60px 1fr;
}
.desc {
  font-size: 1.1em;
  font-family: var(--font-normal);
  line-height: 23px;
}
.scale {
  font-size: 1.3em;
  font-weight: 800;
  font-family: var(--font-normal);
  margin: 4px 0;
  color: #353535;
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
  .desc {
    font-size: 1em;
  }
  .wr-title {
    position: sticky;
    top: 100px;
    height: fit-content;
    margin-top: 10px;
  }
}
</style>
