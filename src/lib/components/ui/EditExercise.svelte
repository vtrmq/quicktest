<script lang="ts">
import { FOLDER_IMAGES, FOLDER_AUDIOS, R2_DOMAIN, ALFABETO } from '$lib/utils';
import menu from '$lib/assets/svg/menu.svg?raw';
//import arrowDownUp from '$lib/assets/svg/arrow-down-up.svg?raw';
import pencil from '$lib/assets/svg/pencil.svg?raw';
import circleX from '$lib/assets/svg/circle-x.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw';
import { Select, Button, Toast, TextArea, Input, Album, Audios, OptionSelect, Dialog, AudioRecorder } from '$lib/components';
import { activityLocalstore } from '$lib/store/activity';
import { barajarArray } from '$lib/utils/';

type AnswersTest = {
  resp: string;
  image: string;
  rst: boolean;
  rss: boolean;
};
type questionsTest = {
  question: string;
  images: string[];
  answers: AnswersTest[];
  value: number;
};
type Words = {
  id: number;
  word: string;
};
type questionsTestFS = {
  text: string;
  image: string;
  answersFS: Words[];
  words: Words[];
  value: number;
};
type Option = {
  option: string;
};

let { items, handleActivity, topic, activity } = $props();
const root = `${R2_DOMAIN}/${FOLDER_IMAGES}`;
const root_audio = `${R2_DOMAIN}/${FOLDER_AUDIOS}`;
let dialog = $state<Dialog | null>(null);
let viewBox = $state(true); // false
let sheet = $state('ejercises'); // type
let selectType = $state('');
let toast = $state<Toast>();
let album = $state<Album | null>(null);
let audio = $state<Audios | null>(null);

let stateDelete = $state(''); // itemExercise, itemTest, itemAudio
let stateExercise = $state('new'); // Si la actividad es nuevo (new) o si se está actualizando (update)
let posImage = 'none';
let posItem = -1;
let question = $state('');
let content = $state('');
//let optionSuboptions = $state([{option: ''}]);
let optionSuboptions: Option[] = $state([]);
let leftWords = $state([{word: ''}]);
let rightWords = $state([{word: ''}]);
let arrayQuestionsTest: questionsTest[] = $state([]);
let answersTest: AnswersTest[] = $state([{resp: '', image: '', rst: false, rss: false }]);
let questionTest: questionsTest = $state( { question: '', images: [], answers: [], value: 0 })
let indexExercise = -1;
let posItemPoint = $state(-1);
let itemResaltado = $state(-1);
let itemDelete = -1;
//let selection_options = $state('');

let arrayQuestionsTestFS: questionsTestFS[] = $state([]);
let questionTestFS: questionsTestFS = $state( { text: '', image: '', answersFS: [], words: [], value: 0 })

/*
let questionTest: questionsTest = $state(
  { 
    question: 'En Svelte y SvelteKit, no puedes interpolar directamente una variable dentro de un atributo como href usando {variable} dentro de una cadena de texto como ?{root}, ya que Svelte no lo interpretará correctamente.', 
    images: [], 
    answers: [
      {
        resp: 'Eliminar por valor (usando filter)', 
        image: '', 
        rst: false, 
        rss: false 
      },
      {
        resp: 'Eliminar por índice (usando splice)', 
        image: '', 
        rst: false, 
        rss: false 
      },
      {
        resp: 'Eliminar el último elemento (usando pop)', 
        image: '', 
        rst: false, 
        rss: false 
      },
      {
        resp: 'Eliminar el primero (usando shift)', 
        image: '', 
        rst: false, 
        rss: false 
      },
    ] 
  }
);
*/

//console.log(items)

function reset() {
  stateDelete = '';
  posItemPoint = -1;
  indexExercise = -1;
  stateExercise = 'new';
  posImage = 'none';
  posItem = -1;
  selectType = '';
  question = '';
  content = '';
  //optionSuboptions = [{option: ''}];
  optionSuboptions = [];
  leftWords = [{word: ''}];
  rightWords = [{word: ''}];
  answersTest = [{resp: '', image: '', rst: false, rss: false }];
  questionTestFS = { text: '', image: '', answersFS: [], words: [], value: 0 };
}

function handleViewBoxExercise() {
  viewBox = !viewBox;
  sheet = 'ejercises';
  reset();
}

function handleNewExercise() {
  if (sheet === 'ejercises') {
    sheet = 'type';
  }
}

function handleIntro() {
  if (selectType.length === 0) {
    toast?.view({
      type: 'fail',
      message: 'Selecciona el tipo de ejercicio',
      time: 4000
      });
    return;
  }
  stateExercise = 'new';
  arrayQuestionsTest = [];
  sheet = selectType;
}

function handlePlusOption() {
  if (optionSuboptions.length < 5) {
    optionSuboptions = [...optionSuboptions, {option: ''}];
  } else {
    toast?.view({
      type: 'fail',
      message: 'Las palabras alcanzaron el límite',
      time: 4000
      });
  }
}

function handleCancel() {
  sheet = 'type';
  reset();
}

function handlePlusMatchWords(box: string) {
  if (box === 'left') {
    leftWords = [...leftWords, {word: ''}];
  } else if (box === 'right') {
    rightWords = [...rightWords, {word: ''}];
  }
}


// ==================================================

let arrWords = [];
function word_simple(w: string) {
  arrWords.push({
    word: w, 
    type: "w", 
    resp: false, 
    value: false, 
    color: "", 
    resp_color: "", 
    selection_word: -1, 
    errors: 0,
    sign: 0,
  });
}

function foundStart(charF: string, w: string) {
  arrWords.push({
    word: charF, 
    type: "s", 
    resp: false, 
    value: false, 
    color: "", 
    resp_color: "", 
    selection_word: -1, 
    errors: 0,
  });
  arrWords.push({
    word: w, 
    type: "w", 
    resp: false, 
    value: false, 
    color: "", 
    resp_color: "", 
    selection_word: -1, 
    sign: 1,
    errors: 0,
  });
}

function foundEnd(w: string, char: string) {
  arrWords.push({
    word: w, 
    type: "w", 
    resp: false, 
    value: false, 
    color: "", 
    resp_color: "", 
    selection_word: -1, 
    sign: 2,
    errors: 0,
  });
  arrWords.push({
    word: char, 
    type: "s", 
    resp: false, 
    value: false, 
    color: "", 
    resp_color: "", 
    selection_word: -1, 
    errors: 0,
  });
}

function foundStartChar(charF: string, w: string, sig: string) {
  arrWords.push({
    word: charF, 
    type: "s", 
    resp: false, 
    value: false, 
    color: "", 
    resp_color: "", 
    selection_word: -1, 
    errors: 0,
  });
  arrWords.push({
    word: w, 
    type: "w", 
    resp: false, 
    value: false, 
    color: "", 
    resp_color: "", 
    selection_word: -1, 
    errors: 0,
    sign: 4,
  });
  arrWords.push({
    word: sig, 
    type: "s", 
    resp: false, 
    value: false, 
    color: "", 
    resp_color: "", 
    selection_word: -1, 
    errors: 0,
  });
}

function splitWordsSelect() {
  arrWords = [];
  let chars = [",", ".", ";", ":", "?", "¿", "¡", "!", "(", ")", "[", "]"];
  let pa = content.split("\n");
  for (let j = 0; j < pa.length; j++) {

    let arrWord = pa[j].split(" ");
    for (let i = 0; i < arrWord.length; i++) {

      let char = arrWord[i].slice(-1);
      const found = chars.find(c => c === char);

      let charF = arrWord[i].slice(0, 1);
      const foundF = chars.find(c => c === charF);

      let enter = false;
      if (found !== undefined) {
        let chr = arrWord[i].slice(arrWord[i].length - 2, -1);
        const f = chars.find(c => c === chr);
        if (f !== undefined) {
          enter = true;
        }
      }

      if (enter === false) {
        if (found === undefined && foundF === undefined) {
          word_simple(arrWord[i]);
        } else {
          if (foundF !== undefined) {
            if (foundF === '(' || foundF === '[') {
              let wr = arrWord[i].slice(1, arrWord[i].length);
              wr = wr.slice(0, wr.length - 1)
              let sig = arrWord[i].slice(-1);
              const f = chars.find(c => c === sig);
              if (f === undefined) {
                foundStart(charF, arrWord[i].slice(1, arrWord[i].length));
              } else {
                foundStartChar(charF, wr, sig);
              }
            } else {
              foundStart(charF, arrWord[i].slice(1, arrWord[i].length));
            }
          } else if (found !== undefined) {
            foundEnd(arrWord[i].slice(0, -1), char);
          }
        }
      } else {
        // Si hay dos signos juntos. Ej: porque?.
        let chr = arrWord[i].slice(arrWord[i].length - 2, -1);
        arrWords.push({
          word: arrWord[i].slice(0, -2), 
          type: "w", 
          resp: false, 
          value: false, 
          color: "", 
          resp_color: "", 
          selection_word: -1, 
          sign: 3,
          errors: 0,
        });
        arrWords.push({
          word: chr, 
          type: "s", 
          resp: false, 
          value: false, 
          color: "", 
          resp_color: "", 
          selection_word: -1, 
          errors: 0,
        });
        arrWords.push({
          word: char, 
          type: "s", 
          resp: false, 
          value: false, 
          color: "", 
          resp_color: "", 
          selection_word: -1, 
          errors: 0,
        });
      }

    }
    arrWords.push({word: "\n", type: "x"});
  }

  const act = {
    exercise: {
      words: arrWords,
      question,
      content,
      //selection_options,
      optionSuboptions,
    },
    value: 0,
    type: "select",
  };
  return act;
}

function word_simple_character(w: string) {
  arrWords.push({
    word: w, 
    type: "w", 
    resp: false, 
    value: false, 
    selection_word: "", 
    errors: 0,
    sign: 0,
  });
}

function foundStartCharacter(charF: string, w: string) {
  arrWords.push({
    word: charF, 
    type: "s", 
    resp: false, 
    value: false, 
    selection_word: "", 
    errors: 0,
  });
  arrWords.push({
    word: w, 
    type: "w", 
    resp: false, 
    value: false, 
    selection_word: "", 
    sign: 1,
    errors: 0,
  });
}

function foundEndCharacter(w: string, char: string) {
  arrWords.push({
    word: w, 
    type: "w", 
    resp: false, 
    value: false, 
    selection_word: "", 
    sign: 2,
    errors: 0,
  });
  arrWords.push({
    word: char, 
    type: "s", 
    resp: false, 
    value: false, 
    selection_word: "", 
    errors: 0,
  });
}

function foundStartCharCharacter(charF: string, w: string, sig: string) {
  arrWords.push({
    word: charF, 
    type: "s", 
    resp: false, 
    value: false, 
    selection_word: "", 
    errors: 0,
  });
  arrWords.push({
    word: w, 
    type: "w", 
    resp: false, 
    value: false, 
    selection_word: "", 
    errors: 0,
    sign: 4,
  });
  arrWords.push({
    word: sig, 
    type: "s", 
    resp: false, 
    value: false, 
    selection_word: "", 
    errors: 0,
  });
}

function splitWordsCharacter() {
  arrWords = [];
  let chars = [",", ".", ";", ":", "?", "¿", "¡", "!", "(", ")", "[", "]"];
  let pa = content.split("\n");
  for (let j = 0; j < pa.length; j++) {

    let arrWord = pa[j].split(" ");
    for (let i = 0; i < arrWord.length; i++) {

      let char = arrWord[i].slice(-1);
      const found = chars.find(c => c === char);

      let charF = arrWord[i].slice(0, 1);
      const foundF = chars.find(c => c === charF);

      let enter = false;
      if (found !== undefined) {
        let chr = arrWord[i].slice(arrWord[i].length - 2, -1);
        const f = chars.find(c => c === chr);
        if (f !== undefined) {
          enter = true;
        }
      }

      if (enter === false) {
        if (found === undefined && foundF === undefined) {
          word_simple_character(arrWord[i]);
        } else {
          if (foundF !== undefined) {
            if (foundF === '(' || foundF === '[') {
              let wr = arrWord[i].slice(1, arrWord[i].length);
              wr = wr.slice(0, wr.length - 1)
              let sig = arrWord[i].slice(-1);
              const f = chars.find(c => c === sig);
              if (f === undefined) {
                foundStartCharacter(charF, arrWord[i].slice(1, arrWord[i].length));
              } else {
                foundStartCharCharacter(charF, wr, sig);
              }
            } else {
              foundStartCharacter(charF, arrWord[i].slice(1, arrWord[i].length));
            }
          } else if (found !== undefined) {
            foundEndCharacter(arrWord[i].slice(0, -1), char);
          }
        }
      } else {
        // Si hay dos signos juntos. Ej: porque?.
        let chr = arrWord[i].slice(arrWord[i].length - 2, -1);
        arrWords.push({
          word: arrWord[i].slice(0, -2), 
          type: "w", 
          resp: false, 
          value: false, 
          selection_word: "", 
          sign: 3,
          errors: 0,
        });
        arrWords.push({
          word: chr, 
          type: "s", 
          resp: false, 
          value: false, 
          selection_word: "", 
          errors: 0,
        });
        arrWords.push({
          word: char, 
          type: "s", 
          resp: false, 
          value: false, 
          selection_word: "", 
          errors: 0,
        });
      }

    }
    arrWords.push({word: "\n", type: "x"});
  }

  const act = {
    exercise: {
      words: arrWords,
      question,
      content,
      optionSuboptions,
    },
    value: 0,
    type: "character",
  };
  return act;
}


// ==================================================

function handleDone() {

  // SELECT
  // ==================================================

  if (sheet === 'select') {

    if (question.trim().length === 0) {
      toast?.view({
        type: 'fail',
        message: 'Escribe la pregunta',
        time: 3000
      });
      return;
    }

    if (content.trim().length === 0) {
      toast?.view({
        type: 'fail',
        message: 'Escribe el contenido',
        time: 3000
      });
      return;
    }

    optionSuboptions = optionSuboptions.filter(item => item.option !== "");
    if (optionSuboptions.length === 1) {
      toast?.view({
        type: 'fail',
        message: 'Debes tener más de una opción',
        time: 4000
      });
      return;
    } else if (optionSuboptions.length === 0) {
      //selection_options = '';
      optionSuboptions = [];
    }

    const exercise = splitWordsSelect();
    console.log(exercise)

    if (stateExercise === 'new') {
      items.push(exercise);
    } else if (stateExercise === 'update') {
      items[indexExercise].exercise = exercise.exercise;
    }

  // TEST
  // ==================================================

  } else if (sheet === 'test' && arrayQuestionsTest.length !== 0) {

    if (stateExercise === 'new') {
      items.push({type:'test', points: arrayQuestionsTest});
    } else if (stateExercise === 'update') {// Se agregó un nuevo punto al examen
      items[indexExercise].points = arrayQuestionsTest;
    }

  // TEST-FS
  // ==================================================

  } else if (sheet === 'test-fs' && arrayQuestionsTestFS.length !== 0) {
    if (stateExercise === 'new') {
      items.push({type:'test-fs', points: arrayQuestionsTestFS});
    } else if (stateExercise === 'update') {// Se agregó un nuevo punto al examen
      items[indexExercise].points = arrayQuestionsTestFS;
    }

  // CHARACTER
  // ==================================================

  } else if (sheet === 'character') {

    if (question.trim().length === 0) {
      toast?.view({
        type: 'fail',
        message: 'Escribe la pregunta',
        time: 3000
      });
      return;
    }

    if (content.trim().length === 0) {
      toast?.view({
        type: 'fail',
        message: 'Escribe el contenido',
        time: 3000
      });
      return;
    }

    const exercise = splitWordsCharacter();

    if (stateExercise === 'new') {
      items.push(exercise);
    } else if (stateExercise === 'update') {
      items[indexExercise].exercise = exercise.exercise;
    }

  } else if (sheet === 'morphosyntax') {
    const exercise = {
      content, 
      arrWords: [], 
      syntax: {
        arrWordsBox: [],
        isGrid: false
      }, 
      comment_teacher: [], 
      comment_student: []
    }
    if (stateExercise === 'new') {
      items.push({type:'morphosyntax', exercise});
    } else if (stateExercise === 'update') {
      items[indexExercise].exercise = exercise;
    }
  }

  activityLocalstore.set(items);
  console.log($state.snapshot(items));
  sheet = 'ejercises';
  reset();
}

function handleAddPoint() {
  sheet = 'new-point';
  answersTest = [{resp: '', image: '', rst: false, rss: false }];
  questionTest = { question: '', images: [], answers: [{resp: '', image: '', rst: false, rss: false }], value: 0 };
  posItemPoint = -1;
}

function handleDonePoint() {
  if ((indexExercise === -1 || indexExercise !== -1) && posItemPoint === -1) {
    arrayQuestionsTest.push(questionTest);
  } else if (indexExercise !== -1 && posItemPoint !== -1) {
    arrayQuestionsTest[posItemPoint] = questionTest;
  }
  sheet = 'test';
}

function handleUpload() {
  posImage = 'image-question';
  album?.handleShowAlbum();
}

async function handleImageSelect(image: string) {
  let localText: string = `${root}/${image}`;
  if (posImage === 'image-question') {
    questionTest.images.push(localText);
  } else if (posImage === 'image-item') {
    questionTest.answers[posItem].image = localText;
  } else if (posImage === 'image-question-fs') {
    questionTestFS.image = localText;
  }
}

function handleRemoveImageQuestion(index: number) {
  questionTest.images.splice(index, 1);
}

function handleRemoveImageItem(index: number) {
  questionTest.answers[index].image = '';
}

function handleAddItem() {
  questionTest.answers.push({resp: '', image: '', rst: false, rss: false });
}

function handleUploadImageItem(index: number) {
  posImage = 'image-item';
  posItem = index;
  album?.handleShowAlbum();
}

function handleRemoveItem(index: number) {
  questionTest.answers.splice(index, 1);
}

function handleBackTest() {
  sheet = 'test';
  if (stateExercise === 'new') {
    reset();
  }
}

function handleSelectItem(point: number, index: number) {
  arrayQuestionsTest[point].answers[index].rst = !arrayQuestionsTest[point].answers[index].rst;
}

function handleSelectActivity(index: number) {
  itemResaltado = index;
  viewBox = !viewBox;
  const _items = activityLocalstore.get();
  handleActivity(index, _items);
}

function handleActionShowWin(index: number) {
  itemDelete = index;
  stateDelete = 'itemExercise';
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar el ejercicio ${index + 1}?`,
  });
}

function handleActionShowWinItem(index: number) {
  itemDelete = index;
  stateDelete = 'itemTest';
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar el punto ${index + 1}?`,
  });
}

function handleEditActivity(index: number) {
  items = activityLocalstore.get();
  indexExercise = index;
  const type = items[index].type;
  stateExercise = 'update';
  if (type === 'select') {
    question = items[index].exercise.question;
    content = items[index].exercise.content;
    optionSuboptions = items[index].exercise.optionSuboptions;
    sheet = 'select';
  } else if (type === 'test') {
    arrayQuestionsTest = items[index].points;
    sheet = 'test';
  } else if (type === 'test-fs') {
    arrayQuestionsTestFS = items[index].points;
    sheet = 'test-fs';
  } else if (type === 'morphosyntax') {
    content = items[index].exercise.content;
    sheet = 'morphosyntax';
  }
  handleActivity(-1, items);
}

function handleCancelUpdate() {
  sheet = 'ejercises';
  reset();
}

function handleEditTestPoint(point: number) {
  posItemPoint = point;
  questionTest = arrayQuestionsTest[posItemPoint]
  sheet = 'new-point';
}

async function handleActionDelete(e: string) {
  if (e === 'accept') {
    if (stateDelete === 'itemTest') {
      arrayQuestionsTest.splice(itemDelete, 1);
      if (items[indexExercise]) {
        items[indexExercise].points = arrayQuestionsTest;
      }
    } else if (stateDelete === 'itemTestFS') {
      arrayQuestionsTestFS.splice(itemDelete, 1);
      if (items[indexExercise]) {
        items[indexExercise].points = arrayQuestionsTestFS;
      }
    } else if (stateDelete === 'itemExercise') {
      items = items.filter((_: object, item: number) => item !== itemDelete);
    }
    activityLocalstore.set(items);
    itemDelete = -1;
    itemResaltado = -1;
    handleActivity(-1, items);
  }
}

function handleAddPointFS() {
  sheet = 'new-point-fs';
  questionTestFS = { text: '', image: '', answersFS: [], words: [], value: 0 };
  posItemPoint = -1;
}

function handleUploadImageItemFS() {
  posImage = 'image-question-fs';
  album?.handleShowAlbum();
}

function handleRemoveImageQuestionFS() {
  questionTestFS.image = '';
}

function handleBackTestFS() {
  sheet = 'test-fs';
  if (stateExercise === 'new') {
    reset();
  }
}

function handleDonePointFS() {
  const textoLimpio = questionTestFS.text.replace(/[.,;:]+$/, '').trim();
  questionTestFS.text = textoLimpio;
  const palabras = textoLimpio.split(" ").map((palabra, index) => ({
    id: index,
    word: palabra,
  }));
  const palabrasBarajadas = barajarArray(palabras);
  questionTestFS.words = palabrasBarajadas;
  /*
  const sinDuplicados = palabrasBarajadas.filter((obj, index, self) =>
    index === self.findIndex(o => o.word.toLowerCase() === obj.word.toLowerCase())
  );
  questionTestFS.words = sinDuplicados;
  */

  //console.log('--> 1', indexExercise)
  //console.log('--> 2', posItemPoint)

  if ((indexExercise === -1 || indexExercise !== -1) && posItemPoint === -1) {
    console.log(1)
    arrayQuestionsTestFS.push(questionTestFS);
  } else if (indexExercise !== -1 && posItemPoint !== -1) {
    console.log(2)
    arrayQuestionsTestFS[posItemPoint] = questionTestFS;
  }
  console.log($state.snapshot(arrayQuestionsTestFS));
  sheet = 'test-fs';
}

function handleEditTestPointFS(point: number) {
  posItemPoint = point;
  questionTestFS = arrayQuestionsTestFS[posItemPoint]
  sheet = 'new-point-fs';
}

function handleActionShowWinItemFS(index: number) {
  itemDelete = index;
  stateDelete = 'itemTestFS';
  dialog?.show({
    type: 'delete',
    message: `¿Quieres eliminar el punto ${index + 1}?`,
  });
}

let posAudio = '';
async function handleAudioSelect(_audio: string) {
  let localText: string = `${root_audio}/${_audio}`;
  if (posAudio === 'audio-fs') {
    console.log(localText)
  }
}

function handleUploadAudio() {
  console.log(true)
  posAudio = 'audio-fs';
  audio?.handleShowAudios();
}

</script>

<Toast bind:this={toast} />
<Album bind:this={album} onSelectImage={handleImageSelect} />
<Audios bind:this={audio} onSelectAudio={handleAudioSelect} />
<Dialog bind:this={dialog} action={handleActionDelete} />

<button class="btn-view-close" onclick={handleViewBoxExercise}>{@html menu}</button>
<div class="container-edit-exercise" class:view-box={viewBox}>
  <div class="header-box-exercise">
    {#if sheet === 'ejercises'}
      <div>
        <button class="btn-new" onclick={handleNewExercise}>Guardar</button>
        <button class="btn-new" onclick={handleNewExercise}>Nuevo ejercicio</button>
      </div>
    {:else if  sheet === 'select' || sheet === 'character' || sheet === 'match'}
      <div>
        <button class="btn-new" onclick={handleDone}>Listo</button>
        {#if stateExercise === 'new'}
          <button class="btn-new" onclick={handleCancel}>Cancelar</button>
        {:else if stateExercise === 'update'}
          <button class="btn-new" onclick={handleCancelUpdate}>Ejercicios</button>
        {/if}
      </div>
    {:else if sheet === 'morphosyntax'}
      <div>
        <button class="btn-new" onclick={handleDone}>Listo</button>
        {#if stateExercise === 'new'}
          <button class="btn-new" onclick={handleCancel}>Cancelar</button>
        {:else if stateExercise === 'update'}
          <button class="btn-new" onclick={handleCancelUpdate}>Ejercicios</button>
        {/if}
      </div>
    {:else if sheet === 'test'}
      <div>
        <button class="btn-new" onclick={handleAddPoint}>Nuevo punto</button>
        <button class="btn-new" onclick={handleDone}>Listo</button>
        {#if stateExercise === 'new'}
          <button class="btn-new" onclick={handleCancel}>Cancelar</button>
        {:else if stateExercise === 'update'}
          <button class="btn-new" onclick={handleCancelUpdate}>Ejercicios</button>
        {/if}
      </div>
    {:else if sheet === 'test-fs'}
      <div>
        <button class="btn-new" onclick={handleAddPointFS}>Nuevo punto</button>
        <button class="btn-new" onclick={handleDone}>Listo</button>
        {#if stateExercise === 'new'}
          <button class="btn-new" onclick={handleCancel}>Cancelar</button>
        {:else if stateExercise === 'update'}
          <button class="btn-new" onclick={handleCancelUpdate}>Ejercicios</button>
        {/if}
      </div>
    {:else if sheet === 'new-point'}
      <div>
        <button class="btn-new" onclick={handleBackTest}>Volver</button>
        <button class="btn-new" onclick={handleAddItem}>Adicionar item</button>
        <button class="btn-new" onclick={handleDonePoint}>Listo</button>
      </div>
    {:else if sheet === 'new-point-fs'}
      <div>
        <button class="btn-new" onclick={handleBackTestFS}>Volver</button>
        <button class="btn-new" onclick={handleDonePointFS}>Listo</button>
      </div>
    {:else}
      &nbsp;
    {/if}
    <button class="btn-view-close" onclick={handleViewBoxExercise}>{@html circleX}</button>
  </div>

  <div class="body-box-exercise">

    {#if sheet === 'ejercises' && items}
      <!-- ================================================== -->
      <div class="container-info">
        <h1 class="topic">{topic}</h1>
        <h2 class="activity">{activity}</h2>
      </div>

      {#each items as item, index}
        <div class="row-link-activity" class:resaltar={itemResaltado === index}>
          <button class="link-activity" onclick={()=>handleSelectActivity(index)}>
            <div class="box-item-link">{index + 1}</div> <span class="label-activity-exercise" class:resaltar={itemResaltado === index}>Actividad: {item.type}</span>
          </button>
          <OptionSelect>
            <button onclick={()=>handleEditActivity(index)}>{@html pencil} <span>Editar</span></button>
            <button onclick={()=>handleActionShowWin(index)}>{@html trash} <span>Eliminar</span></button>
          </OptionSelect>
        </div>
      {/each}

    {:else if sheet === 'type'}

      <div class="sheet-type">
        <Select label="Tipos de ejercicios" bind:value={selectType}>
          <option value="">Selecciona ejercicio</option>
          <option value="select">Seleccionar palabras</option>
          <option value="character">Colocar palabras</option>
          <option value="match">Relacionar conceptos</option>
          <option value="point-out">Señalar partes</option>
          <option value="test-fs">Escuchar audio y formar frase</option>
          <option value="morphosyntax">Morfosintaxis</option>
          <option value="test">Examen</option>
          <option value="test">Examen PDF</option>
          <option value="test">Comprensión de lectura</option>
        </Select>
        <div class="wr-cancel-intro">
          <Button bg="gray" onclick={handleCancelUpdate}>Cancelar</Button>
          <Button onclick={handleIntro}>Entrar</Button>
        </div>
      </div>

    {:else if sheet === 'select'}

      <p class="label-type">Seleccionar palabras</p>
      <TextArea name="def" label="Pregunta" bind:value={question} --height-text-area="80px" isError={false} />
      <TextArea name="ghi" label="Texto de la actividad" bind:value={content} --height-text-area="150px" isError={false} />
      <div class="container-inputs">
        {#each optionSuboptions as op, i}
          <Input 
            type="text" 
            label="Palabra {i + 1}" bind:value={op.option} requested={false} isError={false} />
        {/each}
      </div>
      <div class="wr-btn-add">
        <Button onclick={handlePlusOption}>Adicionar palabra</Button>
      </div>

    {:else if sheet === 'character'}

      <p class="label-type">Colocar palabras</p>
      <TextArea name="def" label="Pregunta" bind:value={question} --height-text-area="80px" isError={false} />
      <TextArea name="ghi" label="Texto de la actividad" bind:value={content} --height-text-area="150px" isError={false} />

    {:else if sheet === 'match'}

      <p class="label-type">Relacionar conceptos</p>
      <TextArea name="def" label="Pregunta" bind:value={question} --height-text-area="80px" isError={false} />
      <div class="wr-words-match">
        <div class="header-match">
          <h1 class="title-wd">Palabras del lado izquierdo</h1>
          <button class="add-word" onclick={()=>handlePlusMatchWords('left')}>Adicionar</button>
        </div>
        <div>
          {#each leftWords as ws}
            <Input type="text" label="Escribe una palabra o frase" bind:value={ws.word} isError={false} />
          {/each}
        </div>
      </div>
      <div class="wr-words-match">
        <div class="header-match">
          <h1 class="title-wd">Palabras del lado derecho</h1>
          <button class="add-word" onclick={()=>handlePlusMatchWords('right')}>Adicionar</button>
        </div>
        <div>
          {#each rightWords as ws}
            <Input type="text" label="Escribe una palabra o frase" bind:value={ws.word} isError={false} />
          {/each}
        </div>
      </div>

    {:else if sheet === 'morphosyntax'}

      <p class="label-type">Morfosintaxis</p>
      <TextArea name="def" label="Escribe una oración" bind:value={content} --height-text-area="80px" isError={false} />

    {:else if sheet === 'test'}

      <p class="label-type">Test</p>

      {#each arrayQuestionsTest as qs, point}

        <div class="container-question">
          <div class="wr-point-number">
            <div class="point-number">{point + 1}</div>
            <div class="wr-opt-select">
              <OptionSelect>
                <button onclick={()=>handleEditTestPoint(point)}>{@html pencil} <span>Editar</span></button>
                <button onclick={()=>handleActionShowWinItem(point)}>{@html trash} <span>Eliminar</span></button>
              </OptionSelect>
            </div>
          </div>

          <div class="question">{qs.question}</div>

          {#if qs.images.length !== 0}
            <div class="container-images-question">
              {#each qs.images as img, i}
                <div class="box-image-question">
                  <div class="wr-image-question">
                    <img class="image-question" src={img} alt="" />
                  </div>
                  {#if qs.images.length > 1}
                    <div class="label-image">Imagen {ALFABETO(i + 1)}</div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}

          <div class="container-items-answer">
            {#each qs.answers as answer, index}

              <div class="container-answer" onclick={()=>handleSelectItem(point, index)} onkeyup={()=>{}} role="button" tabindex="0" class:rst-point={answer.rst}>
                <div class="wr-label-point"><div class="label-resp" class:rst-point={answer.rst}>Respuesta {index + 1}</div></div>
                {#if answer.image.length !== 0}
                  <div class="wr-image-question">
                    <img class="image-question" src={answer.image} alt="" />
                  </div>
                {/if}
                <div class="wr-input-item">
                  <div class="answer-item">{answer.resp}</div>
                </div>
              </div>
            {/each}
          </div>
        </div>

      {/each}

    {:else if sheet === 'new-point'}
      
      {#if (stateExercise === 'new' || stateExercise === 'update') && posItemPoint === -1}
        <p class="label-type">Nuevo punto</p>
      {:else if stateExercise === 'update' && posItemPoint !== -1}
        <p class="label-type">Actualizar punto</p>
      {/if}

      <div class="wr-hd">
        <button class="btn-view-album" onclick={handleUpload}>Imagen</button>
      </div>

      <TextArea name="def" label="Pregunta" bind:value={questionTest.question} --height-text-area="80px" isError={false} />

      {#if questionTest.images.length !== 0}
        <div class="container-images-question">
          {#each questionTest.images as image, index}
            <div class="box-image-question">
              <div class="wr-image-question">
                <img class="image-question" src={image} alt="" />
                <button class="btn-remove-image-test" onclick={()=>handleRemoveImageQuestion(index)}>{@html trash}</button>
              </div>
              {#if questionTest.images.length > 1}
                <div class="label-image">Imagen {ALFABETO(index + 1)}</div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
      
      <h1 class="label-response">Respuestas</h1>

      <div class="container-items-answer">
        {#each questionTest.answers as answer, index}
          <div class="container-answer">
            {#if answer.image.length !== 0}
              <div class="wr-image-question">
                <img class="image-question" src={answer.image} alt="" />
                <button class="btn-remove-image-test" onclick={()=>handleRemoveImageItem(index)}>{@html trash}</button>
              </div>
            {/if}

            <div class="wr-input-item">
              <textarea class="textarea-item" bind:value={answer.resp}></textarea>
            </div>

            <div class="wr-btn-img-item">
              <button class="btn-view-item" onclick={()=>handleUploadImageItem(index)}>Imagen</button>
              <button class="btn-remove-item" onclick={()=>handleRemoveItem(index)}>Quitar</button>
            </div>
            
          </div>
        {/each}
      </div>

    {:else if sheet === 'test-fs'}

      <p class="label-type">Test FS</p>

      {#each arrayQuestionsTestFS as qs, point}

        <div class="container-question">
          <div class="wr-point-number">
            <div class="point-number">{point + 1}</div>
            <div class="wr-opt-select">
              <OptionSelect>
                <button onclick={()=>handleEditTestPointFS(point)}>{@html pencil} <span>Editar</span></button>
                <button onclick={()=>handleActionShowWinItemFS(point)}>{@html trash} <span>Eliminar</span></button>
              </OptionSelect>
            </div>
          </div>

          <div class="wr-container-box-fs">
            {#if qs.image.length !== 0}
              <div class="box-image-question">
                <div class="wr-image-question">
                  <img class="image-question" src={qs.image} alt="" />
                </div>
              </div>
            {/if}

            {#if qs.words.length !== 0}
              <div class="container-answer-fs">
                {#each qs.words as word}
                  <button class="answer-fs">{word.word}</button>
                {/each}
              </div>
            {/if}
          </div>
          
        </div>

      {/each}

    {:else if sheet === 'new-point-fs'}
      
      {#if (stateExercise === 'new' || stateExercise === 'update') && posItemPoint === -1}
        <p class="label-type">Nuevo punto</p>
      {:else if stateExercise === 'update' && posItemPoint !== -1}
        <p class="label-type">Actualizar punto</p>
      {/if}

      {#if questionTestFS.image.length !== 0}
        <div class="container-images-question">
          <div class="box-image-question">
            <div class="wr-image-question">
              <img class="image-question" src={questionTestFS.image} alt="" />
              <button class="btn-remove-image-test" onclick={handleRemoveImageQuestionFS}>{@html trash}</button>
            </div>
          </div>
        </div>
      {/if}

      <div class="wr-hd">
        <button class="btn-view-album right-btn" onclick={handleUploadAudio}>Audio</button>
        <button class="btn-view-album" onclick={handleUploadImageItemFS}>Imagen</button>
      </div>

      <TextArea name="def" label="Texto" bind:value={questionTestFS.text} --height-text-area="80px" isError={false} />
      <AudioRecorder />

    {/if}
  </div>
</div>

<style>
:global {
  .btn-remove-image-test > svg {
    width: 18px;
    color: #fff;
    stroke-width: 3px;
  }
  .btn-view-close > svg {
    width: 18px;
    color: #fff;
    stroke-width: 3px;
  }
}
.right-btn {
  right: 70px;
}
.container-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
}
.wr-btn-add {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em 0;
}
.wr-container-box-fs {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.container-answer-fs {
  display: flex;
  gap: 0.8em;
  justify-content: center;
  padding: 1em 0.5em 1em;
  background: var(--border-item);
  box-shadow: rgb(161 178 225) 0px 7px 0px 0px;
  border-radius: var(--border-radius);
  flex-wrap: wrap;
}
.answer-fs {
  cursor: pointer;
  font-family: var(--font-normal);
  font-size: 1.6em;
  background: #ffffff;
  box-shadow: rgb(155 161 177) 0px 7px 0px 0px;
  padding: 0 0.2em;
  border-radius: 6px;
  color: #4e5b69;
  font-weight: 800;
}
.container-info {
  padding: 0 0 1em;
}
.topic {
  font-size: 1.4em;
  font-family: var(--font-bold);
  margin-bottom: 0.3em;
}
.activity {
  font-family: var(--font-normal);
  font-size: 1.1em;
  font-weight: 500;
}
.label-activity-exercise {
  font-family: var(--font-normal);
  font-size: 1.3em;
}
.label-activity-exercise.resaltar {
  font-weight: 900;
  font-style: italic;
  font-size: 1.5em;
}
.wr-opt-select {
  right: 0;
  position: absolute;
}
.row-link-activity {
  display: flex;
  width: 100%;
  background: #e1f1f9;
  align-items: center;
  padding-right: 0.3em;
  /*box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;*/
  border-radius: 6px;
  transition: var(--transition);
}
.row-link-activity:hover {
  background: #cee8f5;
}
.row-link-activity.resaltar {
  background: #56d3ce;
}
.box-item-link {
  height: 52px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #94ebe8;
  font-family: var(--font-normal);
  font-weight: 900;
  font-size: 2em;
}
.link-activity {
  display: flex;
  font-family: var(--font-normal);
  cursor: pointer;
  border-radius: 6px;
  align-items: center;
  gap: 1em;
  overflow: hidden;
  width: 100%;
  background: transparent;
}
.wr-label-point {
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  top: -22px;
  left: 0;
}
.label-resp {
  background: var(--border-item);
  font-family: var(--font-normal);
  font-size: 0.88em;
  padding: 5px 10px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  transition: var(--transition);
}
.label-resp.rst-point {
  background: #11d511;
}
.container-question {
  padding: 0.5em 0;
}
.wr-point-number {
  display: flex;
  justify-content: center;
  background: #93deff;
  height: 1px;
  align-items: center;
  margin: 1em 0 2em;
  position: relative;
}
.point-number {
  background: #93deff;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
  font-family: var(--font-normal);
  font-weight: 600;
}
.answer-item {
  width: 100%;
  resize: none;
  background: transparent;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  padding: 0.4em 0.5em;
  border-radius: var(--border-radius);
  line-height: 28px;
}
.question {
  font-family: var(--font-normal);
  padding-bottom: 2em;
  line-height: 28px;
  font-size: var(--font-size);
}
.container-answer {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  background: var(--border-item);
  padding: 8px;
  border-radius: var(--border-radius);
  position: relative;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: rgb(161 178 225) 0px 7px 0px 0px;
}
.container-answer.rst-point {
  background: #11d511;
  box-shadow: rgb(0 167 0) 0px 7px 0px 0px;
}
.label-response {
  font-family: var(--font-normal);
  font-weight: 900;
  font-size: 1em;
}
.wr-btn-img-item {
  display: flex;
  justify-content: center;
  gap: 1em;
}
.btn-view-item {
  padding: 0.2em 0.5em;
  border-radius: 4px;
  cursor: pointer;
  background: #9de1ff;
  font-family: var(--font-normal);
}
.btn-remove-item {
  padding: 0.2em 0.5em;
  border-radius: 4px;
  cursor: pointer;
  background: #ffd8cc;
  font-family: var(--font-normal);
}
.container-items-answer {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  gap: 2.3em;
}
.wr-input-item {
  position: relative;
  display: flex;
  align-items: center;
  /*border: 1px solid var(--color-border-input);*/
  border-radius: var(--border-radius);
  padding: 2px 3px 2px 0;
  transition: var(--transition);
  background: #fff;
  border: 1px solid #fff;
}
.wr-input-item:focus-within {
  border: 1px solid #6049eb;
  box-shadow: 0px 0px 0px 4px rgba(119, 112, 255, 0.2);
}
.textarea-item {
  resize: none;
  width: 100%;
  resize: none;
  background: transparent;
  height: 65px;
  font-family: var(--font-normal);
  font-size: var(--font-size);
  padding: 0.4em 0.5em;
  border-radius: var(--border-radius);
  line-height: 23px;
}
.btn-view-album {
  position: absolute;
  padding: 0.2em 0.5em;
  border-radius: 4px;
  cursor: pointer;
  background: #c4dcc4;
  top: 10px;
  font-family: var(--font-normal);
}
.wr-hd {
  display: flex;
  justify-content: right;
  position: relative;
}
.box-image-question {
  /*border: 2px solid #333;*/
}
.label-image {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3em;
  font-family: var(--font-normal);
  font-weight: 600;
}
.btn-remove-image-test {
  position: absolute;
  top: 0;
  right: 0;
  background: black;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container-images-question {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding-bottom: 2em;
}
.wr-image-question {
  width: 100%;
  height: 300px;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid #b5c7fb;
}
.image-question {
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
}
.wr-words-match {
  margin-bottom: 2em;
}
.add-word {
  font-family: var(--font-normal);
  font-size: 1em;
  color: var(--color-label-input);
  background: transparent;
  cursor: pointer;
}
.header-match {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}
.title-wd {
  font-family: var(--font-normal);
  font-weight: 600;
  font-size: 1em;
  color: #000000;
}
.label-type {
  font-family: var(--font-normal);
  font-weight: 600;
  font-size: 1em;
  color: #000000;
}
.btn-new {
  font-family: var(--font-normal);
  padding: 0.4em;
  border-radius: 4px;
  cursor: pointer;
  background: bisque;
  font-size: 1em;
  transition: var(--transition);
}
.sheet-type {
  margin: 2em 0;
}
.wr-cancel-intro {
  display: flex;
  gap: 2em;
}
.body-box-exercise {
  background: #fff;
  height: calc(100% - var(--height-header));
  overflow-y: auto;
  padding: 1em 1em 2em;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.btn-view-close {
  width: 36px;
  height: 35px;
  cursor: pointer;
  outline: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 60px;
  background: #d98507;
}
.header-box-exercise {
  height: var(--height-header);
  width: 100%;
  background: #ff9800;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5em 0 1em;
}
.container-edit-exercise {
  width: 100%;
  max-width: 500px;
  height: 100%;
  background: azure;
  position: fixed;
  top: 0;
  right: -530px;
  transition: 0.4s;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
.container-edit-exercise.view-box {
  right: 0;
}
@media (min-width: 500px) {
  .btn-new {
    font-size: 0.85em;
  }
  .btn-new:hover {
    background: #f9d6ad;
  }
}
</style>
