<script lang="ts">
type Props = {
  name: string;
  checked: boolean;
  onchange: (e: boolean)=>void;
}
let { name, checked, onchange }: Props = $props();
</script>

<label class="container-checkbox">
  <div class="custom-checkbox" class:is-checked={checked}>
    <input type="checkbox" {name} bind:checked onchange={()=>onchange(checked)} />
    <span class="slider"></span>
  </div>
</label>

<style>
  .container-checkbox {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
  }
  .custom-checkbox {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 25px;
    border-radius: 15px;
    cursor: pointer;
    background-color: #dedfdf;
    transition: background-color 0.3s ease;
  }
  .custom-checkbox.is-checked {
    background-color: #469d49;
  }
  .custom-checkbox input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .slider {
    position: absolute;
    top: 3px;
    left: 4px;
    width: 20px;
    height: 19px;
    background-color: #a3a3a3;
    border-radius: 50%;
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  .custom-checkbox input:checked + .slider {
    transform: translateX(22px);
  }
  .custom-checkbox input:checked ~ .slider {
    background-color: #71ef77;
  }
  @media(min-width: 768px) {
    .custom-checkbox {
      width: 46px;
      height: 26px;
    }
    .slider {
      top: 3px;
      left: 5px;
      width: 20px;
      height: 20px;
    }
    .custom-checkbox input:checked + .slider {
      transform: translateX(16px);
    }
  }
</style>
