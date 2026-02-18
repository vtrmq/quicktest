<script>
import { onMount } from "svelte";
import { activityLocalstore } from '$lib/store/activity_student';

let minute = $state("");
let second = $state("");
let idTimer;
let is_timer = $state(true);
let time = $state({});

export function finished() {
  is_timer = false;
  clearInterval(idTimer);
}

function terminate() {
  clearInterval(idTimer);
  is_timer = false;
  let _time = {min: 0, seg: 0};
  activityLocalstore.timeActivity(_time);
}

function conteo(time) {
  if (is_timer === false) {
    clearInterval(idTimer);
    return;
  }

  idTimer = setInterval(() => {

    if (time.min >= 10) { 
      minute = time.min.toString(); 
    } else if (time.min < 0) { 
      terminate();
      return;
    } else if (time.min <= 9) { 
      minute = `${time.min}`; 
    }

    if (parseInt(time.seg) > 10) {

      time.seg = time.seg - 1;
      second = time.seg;
      activityLocalstore.timeActivity(time);

    } else if (parseInt(time.seg) !== 0) {

      time.seg = time.seg - 1;
      second = `${time.seg}`;
      activityLocalstore.timeActivity(time);

    } else if (parseInt(time.seg) === 0) {

      time.seg = 59;
      second = `59`;
      if (time.min > 10) {
        time.min = time.min - 1;
        minute = time.min.toString();
        activityLocalstore.timeActivity(time);
      } else if (parseInt(time.min) !== 0) {
        time.min = time.min - 1;
        minute = `${time.min}`;
        activityLocalstore.timeActivity(time);
      } else if (parseInt(time.min) === 0) {
        minute = "0";
        second = "0";
        terminate();
        return;
      }

    }

  }, 1000);
}


onMount(() => {

  clearInterval(idTimer);
  time = activityLocalstore.getTime();
  if (time === null) {
    if (min <= 9) {
      minute = `${min}`;
    } else {
      minute = min;
    }

  } if (time !== null) {
    if (time.min === 0 && time.seg === 0) {
      minute = "0";
      second = "0";
      terminate();
      return;
    } else {
      if (time.min >= 10) {
        minute = time.min.toString();
      } else if (time.min <= 9) {
        minute = `${time.min}`;
      }
      if (parseInt(time.seg) >= 10) {
        second = time.seg;
      } else if (parseInt(time.seg) !== 0) {
        second = `${time.seg}`;
      }
    }

    minute = time.min;
    second = time.seg;
  }
  conteo(time);
});

  /*
  onDestroy(()=> {
    //clearInterval(idTimer);
    //localStorage.removeItem("time");
  });
  */

</script>

<div class="container-chromometer">
  <div class="timer">
    {parseInt(minute) < 10 ? '0' : ''}{minute}:{parseInt(second) < 10 ? '0' : ''}{second}
  </div>
</div>

<style>
  .container-chromometer {
    position: fixed;
    top: 0;
    z-index: 5;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: left;
    height: 0px;
  }
  .timer {
    background: #0d7dd5;
    color: #fff;
    border-radius: 10px;
    font-size: 1.2em;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin-top: 8px;
    height: 38px;
    padding: 0 0.5em;
    border: 2px solid #0cbcff;
    box-shadow: 0px 4px 0px 0px #0ba6e1;
    margin-left: 10px;
    font-family: var(--font-bold);
  }
</style>
