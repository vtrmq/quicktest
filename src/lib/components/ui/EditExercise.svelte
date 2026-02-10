<script lang="ts">
import { FOLDER_IMAGES, FOLDER_AUDIOS, R2_DOMAIN, ALFABETO, corregirIEnFrase, FOLDER_FILES } from '$lib/utils';
import menu from '$lib/assets/svg/menu.svg?raw';
import colocarPalabra from '$lib/assets/images/colocar-palabra.png';
import colocarPartes from '$lib/assets/images/colocar-partes.png';
import audioText from '$lib/assets/images/audio-text.png';
import morfosintaxis from '$lib/assets/images/morfosintaxis.png';
import checklist from '$lib/assets/images/checklist.png';
import list from '$lib/assets/images/online-exam.png';
import seleccionarPalabra from '$lib/assets/images/seleccionar-palabra.png';
import relacionar from '$lib/assets/images/relacion.png';
import refresh from '$lib/assets/svg/refresh-cw.svg?raw';
//import arrowDownUp from '$lib/assets/svg/arrow-down-up.svg?raw';
//import rectangleEllipsis from '$lib/assets/svg/rectangle-ellipsis.svg?raw';
//import baseLine from '$lib/assets/svg/baseline.svg?raw';
//import pointer from '$lib/assets/svg/pointer.svg?raw';
import pencil from '$lib/assets/svg/pencil.svg?raw';
import image from '$lib/assets/svg/image.svg?raw';
import circleX from '$lib/assets/svg/circle-x.svg?raw';
import trash from '$lib/assets/svg/trash.svg?raw';
import { Button, Toast, TextArea, Input, Album, Audios, OptionSelect, Dialog, AudioRecorder, FilesPDF } from '$lib/components';
import { activityLocalstore } from '$lib/store/activity';
import { barajarArray, typeExerc } from '$lib/utils/';
import { goto } from '$app/navigation';

type AnswersTest = {
  resp: string;
  image: string;
  rst: boolean;
  rss: boolean;
  value: number;
  success: boolean;
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
  audio: string;
  answersFS: Words[];
  words: Words[];
  value: number;
};
type Option = {
  id: string;
  option: string;
};

let { params, items, handleActivity, topic, activity } = $props();
const root = `${R2_DOMAIN}/${FOLDER_IMAGES}`;
const root_file = `${R2_DOMAIN}/${FOLDER_FILES}`;
const root_audio = `${R2_DOMAIN}/${FOLDER_AUDIOS}`;
let dialog = $state<Dialog | null>(null);
let viewBox = $state(true); // false
let sheet = $state('ejercises'); // type
let selectType = $state('');
let toast = $state<Toast>();

console.log(items)

let album = $state<Album | null>(null);
let audio = $state<Audios | null>(null);
let stateDelete = $state(''); // itemExercise, itemTest, itemAudio
let stateExercise = $state('new'); // Si la actividad es nuevo (new) o si se está actualizando (update)
let posImage = 'none';
let posItem = -1;
let question = $state('');
let imagePointOut = $state('');
let content = $state('');
//let optionSuboptions = $state([{option: ''}]);
let optionSuboptions: Option[] = $state([]);
let leftWords = $state([{word: ''}]);
let rightWords = $state([{word: ''}]);
let arrayQuestionsTest: questionsTest[] = $state([]);
let fileExam: string = '';
let fileName: string = $state('');
let filePDF = $state<FilesPDF | null>(null);
let typeExercise = $state('normal');
let timeLecture = $state(60);

type pointTestPDF = {
  points: { char: string, rst: boolean, rss: boolean }[];
  value: number;
  success: boolean;
};
let arrayQuestionsTestPDF: pointTestPDF[] = $state([]);

//let answersTest: AnswersTest[] = $state([{resp: '', image: '', rst: false, rss: false, value: 0 }]);
let questionTest: questionsTest = $state({ question: '', images: [], answers: [], value: 1 })
let indexExercise = -1;
let posItemPoint = $state(-1);
let itemResaltado = $state(-1);
let itemDelete = -1;
//let selection_options = $state('');

let arrayQuestionsTestFS: questionsTestFS[] = $state([]);
let questionTestFS: questionsTestFS = $state( { text: '', image: '', audio: '', answersFS: [], words: [], value: 0 })
const chars = ['A', 'B', 'C', 'D', 'E'];

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
  timeLecture = 60;
  typeExercise = 'normal';
  stateDelete = '';
  posItemPoint = -1;
  indexExercise = -1;
  stateExercise = 'new';
  posImage = 'none';
  posItem = -1;
  selectType = '';
  question = '';
  content = '';
  optionSuboptions = [];
  leftWords = [{word: ''}];
  rightWords = [{word: ''}];
  //answersTest = [{resp: '', image: '', rst: false, rss: false, value: 0 }];
  questionTestFS = { text: '', image: '', audio: '', answersFS: [], words: [], value: 0 };
  arrayQuestionsTestPDF = [];
  arrayQuestionsTestFS = [];
  //optionSuboptions = [{option: ''}];
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

function handleIntro(ty: string) {

  selectType = ty;
  stateDelete = '';
  posItemPoint = -1;
  indexExercise = -1;
  stateExercise = 'new';
  posImage = 'none';
  posItem = -1;
  question = '';
  content = '';

  optionSuboptions = [];
  leftWords = [{word: ''}];
  rightWords = [{word: ''}];
  //answersTest = [{resp: '', image: '', rst: false, rss: false, value: 1 }];
  questionTestFS = { text: '', image: '', audio: '', answersFS: [], words: [], value: 0 };

  stateExercise = 'new';
  arrayQuestionsTest = [];
  sheet = selectType;
}

function handlePlusOption() {
  optionSuboptions = [...optionSuboptions, {id: crypto.randomUUID(), option: ''}];
  /*
  if (optionSuboptions.length < 5) {
    optionSuboptions = [...optionSuboptions, {id: crypto.randomUUID(), option: ''}];
  } else {
    toast?.view({
      type: 'fail',
      message: 'Las palabras alcanzaron el límite',
      time: 4000
      });
  }
  */
}

/*
function handleCancel() {
  sheet = 'type';
  reset();
}
*/

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
    mode: typeExercise,
    typeExercise,
    visible: true,
    time: timeLecture
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
    mode: typeExercise,
    typeExercise,
    visible: true,
    time: timeLecture
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

    if (stateExercise === 'new') {
      items.push(exercise);
    } else if (stateExercise === 'update') {
      items[indexExercise].exercise = exercise.exercise;
    }
    
  // POINT-OUT
  // ==================================================
  } else if (sheet === 'point-out') {

    if (question.trim().length === 0) {
      toast?.view({
        type: 'fail',
        message: 'Escribe la pregunta',
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
    }

    const activity = {
      value: 0,
      exercise: {
        question, 
        imagePointOut,
        optionSuboptions,
        lines: [],
        placedOptions: []
      },
      type: 'point-out',
      mode: typeExercise,
      typeExercise,
      visible: true,
      time: timeLecture
    }

    console.log(indexExercise, stateExercise)
    console.log(activity)

    if (stateExercise === 'new') {
      items.push(activity);
    } else if (stateExercise === 'update') {
      items[indexExercise].exercise = activity.exercise;
    }

  // MATCH
  // ==================================================
  } else if (sheet === 'match' && (leftWords.length !== 0 && rightWords.length !== 0)) {

    const activity = {
      value: 0,
      exercise: {
        question, 
        content,
        leftWords, 
        rightWords,
        wordConnections: [],
        wordConnectionsStudent: [],
        wordConnectionsErrors: [],
      },
      type: 'match',
      mode: typeExercise,
      typeExercise,
      visible: true,
      time: timeLecture
    }
    //console.log(stateExercise, indexExercise)
    //console.log(exercise)

    if (stateExercise === 'new') {
      items.push(activity);
    } else if (stateExercise === 'update') {
      items[indexExercise].time = timeLecture;
      items[indexExercise].visible = true;
      items[indexExercise].exercise = activity.exercise;
    }

  // TEST
  // ==================================================
  } else if (sheet === 'test' && arrayQuestionsTest.length !== 0) {

    const activity = {
      type:'test', 
      exercise: {
        question,
        content, 
        points: arrayQuestionsTest 
      }, 
      value: 0, 
      mode: typeExercise, 
      typeExercise,
      visible: true, 
      time: timeLecture
    }

    if (stateExercise === 'new') {
      // ========================================
      // Cambio aquí
      items.push(activity);
      // ========================================
    } else if (stateExercise === 'update') {// Se agregó un nuevo punto al examen
      items[indexExercise].time = timeLecture;
      items[indexExercise].visible = true;
      items[indexExercise].exercise = activity.exercise;
    }

  // TESTPDF
  // ==================================================
  } else if (sheet === 'test-pdf') {

    if (stateExercise === 'new') {
      const exercise = {
        content,
        name: fileName,
        file: fileExam, 
        points: arrayQuestionsTestPDF
      }
      items.push({
        type:'test-pdf', 
        exercise, 
        value: 0, 
        mode: typeExercise, 
        typeExercise, 
        visible: true, 
        time: timeLecture
      });
    } else if (stateExercise === 'update') {// Se agregó un nuevo punto al examen
      items[indexExercise].exercise.content = content;
      items[indexExercise].exercise.name = fileName;
      items[indexExercise].exercise.file = fileExam;
      items[indexExercise].exercise.points = arrayQuestionsTestPDF;
    }

  // TEST-FS
  // ==================================================
  } else if (sheet === 'test-fs' && arrayQuestionsTestFS.length !== 0) {

    if (stateExercise === 'new') {
      items.push({
        type:'test-fs', 
        exercise: {content, points: arrayQuestionsTestFS}, 
        value: 0, 
        mode: typeExercise, 
        typeExercise, 
        visible: true, 
        time: timeLecture
      });
    } else if (stateExercise === 'update') {// Se agregó un nuevo punto al examen
      items[indexExercise].exercise.content = content;
      items[indexExercise].exercise.points = arrayQuestionsTestFS;
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
      items[indexExercise].time = timeLecture;
      items[indexExercise].visible = true;
      items[indexExercise].exercise = exercise.exercise;
    }

  // MORPHOSYNTAX
  // ==================================================
  } else if (sheet === 'morphosyntax') {
    const exercise = {
      value: 0,
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
      items.push({type:'morphosyntax', exercise, mode: typeExercise, typeExercise, value: 0, visible: true, time: timeLecture }); 
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
  //answersTest = [{resp: '', image: '', rst: false, rss: false, value: 1 }];
  questionTest = { question: '', images: [], answers: [{resp: '', image: '', rst: false, rss: false, value: 0, success: false }], value: 1 };
  posItemPoint = -1;
}

function handleDonePoint() {
  if ((indexExercise === -1 || indexExercise !== -1) && posItemPoint === -1) {
    arrayQuestionsTest.push(questionTest);
  } else if (indexExercise !== -1 && posItemPoint !== -1) {
    arrayQuestionsTest[posItemPoint] = questionTest;
  }
  //console.log($state.snapshot(arrayQuestionsTest))
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
  } else if (posImage === 'image-point-out') {
    imagePointOut = localText;
  }
}

async function handleFileSelect(file_name: string, file_pdf: string) {
  fileName = file_name;
  fileExam = `${root_file}/${file_pdf}`;
  console.log(fileName)
  console.log(fileExam)
  //questionTest.images.push(localText);
}

function handleRemoveImageQuestion(index: number) {
  questionTest.images.splice(index, 1);
}

function handleRemoveImageItem(index: number) {
  questionTest.answers[index].image = '';
}

function handleAddItem() {
  questionTest.answers.push({resp: '', image: '', rst: false, rss: false, value: 0, success: false });
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

  console.log(type)
  console.log($state.snapshot(items))

  if (type === 'select') {
    question = items[index].exercise.question;
    content = items[index].exercise.content;
    optionSuboptions = items[index].exercise.optionSuboptions;
    sheet = 'select';
  } else if (type === 'point-out') {
    question = items[index].exercise.question;
    optionSuboptions = items[index].exercise.optionSuboptions;
    imagePointOut = items[index].exercise.imagePointOut;
    sheet = 'point-out';
  } else if (type === 'character') {
    question = items[index].exercise.question;
    content = items[index].exercise.content;
    typeExercise = items[index].typeExercise;
    timeLecture = items[index].time;
    sheet = 'character';
  } else if (type === 'test') {
    question = items[index].exercise.question;
    content = items[index].exercise.content;
    arrayQuestionsTest = items[index].exercise.points;
    typeExercise = items[index].mode;
    timeLecture = items[index].time;
    sheet = 'test';
  } else if (type === 'match') { // <<========================== FALTA EL MATCH
    content = items[index].exercise.content;
    question = items[index].exercise.question;
    leftWords = items[index].exercise.leftWords;
    rightWords = items[index].exercise.rightWords;
    typeExercise = items[index].typeExercise;
    timeLecture = items[index].time;
    sheet = 'match';
  } else if (type === 'test-pdf') {
    content = items[index].exercise.content;
    fileExam = items[index].exercise.file;
    fileName = items[index].exercise.name;
    arrayQuestionsTestPDF = items[index].exercise.points;
    sheet = 'test-pdf';
  } else if (type === 'test-fs') {
    content = items[index].exercise.content;
    arrayQuestionsTestFS = items[index].exercise.points;
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
  console.log($state.snapshot(questionTest))
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
  questionTestFS = { text: '', image: '', audio: '', answersFS: [], words: [], value: 0 };
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
    arrayQuestionsTestFS.push(questionTestFS);
  } else if (indexExercise !== -1 && posItemPoint !== -1) {
    arrayQuestionsTestFS[posItemPoint] = questionTestFS;
  }
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

async function handleAudioSelect(_audio: string) {
  let localAudio: string = `${root_audio}/${_audio}`;
  questionTestFS.audio = localAudio;
}

function handleUploadAudio() {
  audio?.handleShowAudios();
}

function handleRemoveAudioQuestionFS() {
  questionTestFS.audio = '';
}

function handleUploadPointOut() {
  posImage = 'image-point-out';
  album?.handleShowAlbum();
}

let swSave = $state(false);
async function handleSaveActivities() {
  const formData = new FormData();
  const items = activityLocalstore.get();
  formData.append('items', JSON.stringify(items));
  formData.append('topicId', params.topicId);
  formData.append('activityId', params.activityId);

  swSave = !swSave;
  const response = await fetch('/api/teacher/save-activity', {
    method: 'POST',
    body: formData
  });
  const result = await response.json();
  if (result.success === false) {
    goto('/');
  }
  swSave = !swSave;
}

function handleAddPointTestPDF() { 
  let points = [];
  for (let i = 0; i < chars.length; i++) {
    points.push({ char: chars[i], rst: false, rss: false });
  }
  arrayQuestionsTestPDF.push({
    points,
    value: 1,
    success: false
  });
  //console.log($state.snapshot(arrayQuestionsTestPDF))
}

function calculateValue() {
  //console.log($state.snapshot(arrayQuestionsTestPDF))
  let sum = 0;
  if (arrayQuestionsTestPDF.length !== 0) {
    for (let i = 0; i < arrayQuestionsTestPDF.length; i++) {
      sum = sum + arrayQuestionsTestPDF[i].value;
    }
  }
  return sum;
}

function handleUploadFilePDF() {
  posImage = 'file-pdf';
  filePDF?.handleShowAlbum();
}

function handleChangeCountPoint(e: Event, index: number) {
  const value = parseInt((e.target as HTMLSelectElement).value);
  let points = [];
  for (let i = 0; i < value; i++) {
    points.push({ char: chars[i], rst: false, rss: false });
  }
  arrayQuestionsTestPDF[index].points = points;
}

let totalValuesPoint = $derived.by(calculateValue);
$effect(()=>{
  console.log(totalValuesPoint)
});

/*
let totalValuesPoint = $state(0);
$effect(()=>{
  if (arrayQuestionsTestPDF.length !== 0) {
    let sum = 0;
    for (let i = 0; i < arrayQuestionsTestPDF.length; i++) {
      sum = sum + arrayQuestionsTestPDF[i].value;
    }
    totalValuesPoint = sum;
  }
  console.log($state.snapshot(totalValuesPoint))
});
*/

</script>

<Toast bind:this={toast} />
<FilesPDF bind:this={filePDF} onSelectFile={handleFileSelect} />
<Album bind:this={album} onSelectImage={handleImageSelect} />
<Audios bind:this={audio} onSelectAudio={handleAudioSelect} />
<Dialog bind:this={dialog} action={handleActionDelete} />

<button class="btn-view-close" onclick={handleViewBoxExercise}>{@html menu}</button>
<div class="container-edit-exercise" class:view-box={viewBox}>
  <div class="header-box-exercise">
    {#if sheet === 'ejercises'}
      <div class="wr-btns-actions">
        <button class="btn-save-exercise" onclick={handleSaveActivities}>
          {#if !swSave}
            Guardar
          {:else}
            {@html refresh}
          {/if}
        </button>
        <button class="btn-new" onclick={handleNewExercise}>Nuevo ejercicio</button>
      </div>
    {:else if sheet === 'type'}
      <div class="wr-btns-actions">
        <button class="btn-new" onclick={handleCancelUpdate}>Ejercicios</button>
        <button class="btn-new" onclick={()=> typeExercise = typeExercise === 'normal' ? 'lecture' : 'normal'}>
          {#if typeExercise === 'normal'}
            Comprensión de lectura
          {:else}
            Todos los ejercicios
          {/if}
        </button>
      </div>
    {:else if  sheet === 'select' || sheet === 'character' || sheet === 'match'}
      <div class="wr-btns-actions">
        <button class="btn-new" onclick={handleDone}>Listo</button>
        {#if stateExercise === 'new'}
          <button class="btn-new" onclick={handleCancelUpdate}>Cancelar</button>
        {:else if stateExercise === 'update'}
          <button class="btn-new" onclick={handleCancelUpdate}>Ejercicios</button>
        {/if}
      </div>
    {:else if  sheet === 'point-out'}
      <div class="wr-btns-actions">
        <button class="btn-new" onclick={handleDone}>Listo</button>
        {#if stateExercise === 'new'}
          <button class="btn-new" onclick={handleCancelUpdate}>Cancelar</button>
        {:else if stateExercise === 'update'}
          <button class="btn-new" onclick={handleCancelUpdate}>Ejercicios</button>
        {/if}
      </div>
    {:else if sheet === 'morphosyntax'}
      <div class="wr-btns-actions">
        <button class="btn-new" onclick={handleDone}>Listo</button>
        {#if stateExercise === 'new'}
          <button class="btn-new" onclick={handleCancelUpdate}>Cancelar</button>
        {:else if stateExercise === 'update'}
          <button class="btn-new" onclick={handleCancelUpdate}>Ejercicios</button>
        {/if}
      </div>
    {:else if sheet === 'test'}
      <div class="wr-btns-actions">
        <button class="btn-new" onclick={handleAddPoint}>Nuevo punto</button>
        <button class="btn-new" onclick={handleDone}>Listo</button>
        {#if stateExercise === 'new'}
          <button class="btn-new" onclick={handleCancelUpdate}>Cancelar</button>
        {:else if stateExercise === 'update'}
          <button class="btn-new" onclick={handleCancelUpdate}>Ejercicios</button>
        {/if}
      </div>
    {:else if sheet === 'test-pdf'}
      <div class="wr-btns-actions">
        <button class="btn-new" onclick={handleDone}>Listo</button>
        <button class="add-point-test" onclick={handleAddPointTestPDF}>Punto</button>
        <button class="add-point-test" onclick={handleUploadFilePDF}>Archivo</button>
        {#if stateExercise === 'new'}
          <button class="btn-new" onclick={handleCancelUpdate}>Cancelar</button>
        {:else if stateExercise === 'update'}
          <button class="btn-new" onclick={handleCancelUpdate}>Ejercicios</button>
        {/if}
      </div>
    {:else if sheet === 'test-fs'}
      <div class="wr-btns-actions">
        <button class="btn-new" onclick={handleAddPointFS}>Nuevo punto</button>
        <button class="btn-new" onclick={handleDone}>Listo</button>
        {#if stateExercise === 'new'}
          <button class="btn-new" onclick={handleCancelUpdate}>Cancelar</button>
        {:else if stateExercise === 'update'}
          <button class="btn-new" onclick={handleCancelUpdate}>Ejercicios</button>
        {/if}
      </div>
    {:else if sheet === 'new-point'}
      <div class="wr-btns-actions">
        <button class="btn-new" onclick={handleBackTest}>Volver</button>
        <button class="btn-new" onclick={handleAddItem}>Adicionar item</button>
        <button class="btn-new" onclick={handleDonePoint}>Listo</button>
      </div>
    {:else if sheet === 'new-point-fs'}
      <div class="wr-btns-actions">
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
      <!-- ================================================== -->
      <!-- ================================================== -->
      <!-- ================================================== -->

      <div class="container-info">
        <h1 class="topic">{topic}</h1>
        <h2 class="activity">{activity}</h2>
      </div>
      <div class="row-items">
        {#each items as item, index}
          <div class="row-link-activity" class:resaltar={itemResaltado === index}>
            <button class="link-activity" onclick={()=>handleSelectActivity(index)}>
              <div class="box-item-link">{index + 1}</div> 
              <div class="container-info-exerc">
                <span class="label-activity-exercise" class:resaltar={itemResaltado === index}>{typeExerc(item.type)}</span>
                {#if item.type === 'morphosyntax' || item.type === 'test-pdf' || item.type === 'test-fs'}
                  <div class="text-left">{item.exercise.content}</div>
                {:else}
                  <div class="text-left">{item.exercise.question}</div>
                {/if}
              </div>
            </button>
            <OptionSelect>
              <button onclick={()=>handleEditActivity(index)}>{@html pencil} <span>Editar</span></button>
              <button onclick={()=>handleActionShowWin(index)}>{@html trash} <span>Eliminar</span></button>
            </OptionSelect>
          </div>
        {/each}
      </div>

    {:else if sheet === 'type'}

      <div class="sheet-type">

        {#if typeExercise === 'normal'}
          <div class="wr-figure">
            <div class="wr-w-figure">
              <span class="span-baseline"><img src={seleccionarPalabra} alt="" /></span>
            </div>
            <div class="label-figure">Seleccionar palabras</div>
            <button class="btn-create" onclick={()=>handleIntro("select")}>Crear</button>
          </div>
        {/if}

        <div class="wr-figure">
          <div class="wr-w-figure">
            <span class="span-baseline"><img src={colocarPalabra} alt="" /></span>
          </div>
          <div class="label-figure">Completar espacios</div>
          <button class="btn-create" onclick={()=>handleIntro("character")}>Crear</button>
        </div>

        <div class="wr-figure">
          <div class="wr-w-figure">
            <span class="span-baseline"><img src={relacionar} alt="" /></span>
          </div>
          <div class="label-figure">Relacionar conceptos</div>
          <button class="btn-create" onclick={()=>handleIntro("match")}>Crear</button>
        </div>

        {#if typeExercise === 'normal'}
          <div class="wr-figure">
            <div class="wr-w-figure">
              <span class="span-baseline"><img src={colocarPartes} alt="" /></span>
            </div>
            <div class="label-figure">Señalar partes</div>
            <button class="btn-create" onclick={()=>handleIntro("point-out")}>Crear</button>
          </div>
        {/if}
        
        <div class="wr-figure">
          <div class="wr-w-figure">
            <span class="span-baseline"><img src={list} alt="" /></span>
          </div>
          <div class="label-figure">
            {#if typeExercise === 'normal'}
              Examen
            {:else}
              Preguntas
            {/if}
          </div>
          <button class="btn-create" onclick={()=>handleIntro("test")}>Crear</button>
        </div>

        {#if typeExercise === 'normal'}
          <div class="wr-figure">
            <div class="wr-w-figure">
              <span class="span-baseline"><img src={checklist} alt="" /></span>
            </div>
            <div class="label-figure">Examen PDF</div>
            <button class="btn-create" onclick={()=>handleIntro("test-pdf")}>Crear</button>
          </div>

          <div class="wr-figure">
            <div class="wr-w-figure">
              <span class="span-baseline"><img src={audioText} alt="" /></span>
            </div>
            <div class="label-figure">Escuchar audio y formar frase</div>
            <button class="btn-create" onclick={()=>handleIntro("test-fs")}>Crear</button>
          </div>

          <div class="wr-figure">
            <div class="wr-w-figure">
              <span class="span-baseline"><img src={morfosintaxis} alt="" /></span>
            </div>
            <div class="label-figure">Morfosintaxis</div>
            <button class="btn-create" onclick={()=>handleIntro("morphosyntax")}>Crear</button>
          </div>
        {/if}

      </div>

    {:else if sheet === 'select'}

      <p class="label-type">Seleccionar palabras</p>
      <div class="wr-space">
        <TextArea name="def" label="Descripción" bind:value={question} --height-text-area="80px" isError={false} />
        <TextArea name="ghi" label="Texto de la actividad" bind:value={content} --height-text-area="150px" isError={false} />
      </div>
      <div class="container-inputs pd-1-0">
        <div class="wr-space">
          {#each optionSuboptions as op, i}
            <Input 
              type="text" 
              label="Palabra {i + 1}" bind:value={op.option} requested={false} isError={false} />
          {/each}
        </div>
      </div>
      <div class="wr-btn-add">
        <Button onclick={handlePlusOption}>Adicionar palabra</Button>
      </div>

    {:else if sheet === 'point-out'}

      <p class="label-type">Señalar partes</p>
      <div class="wr-space">
        <TextArea name="def" label="Descripción" bind:value={question} --height-text-area="60px" isError={false} />
        {#if imagePointOut.length !== 0}
          <div>
            <div class="wr-image-question">
              <img class="image-question" src={imagePointOut} alt="" />
              <button class="btn-remove-image-test" onclick={handleUploadPointOut}>{@html image}</button>
            </div>
          </div>
        {:else if imagePointOut.length === 0}
          <div class="wr-btn-point-out">
            <button class="btn-point-out" onclick={handleUploadPointOut}>Imagen</button>
          </div>
        {/if}
      </div>


      <div class="container-inputs pd-1-0">
        <div class="wr-space">
          {#each optionSuboptions as op, i}
            <Input 
              type="text" 
              label="Palabra {i + 1}" bind:value={op.option} requested={false} isError={false} />
          {/each}
        </div>
      </div>
      <div class="wr-btn-add">
        <Button onclick={handlePlusOption}>Adicionar palabra</Button>
      </div>

    {:else if sheet === 'character'}

      <p class="label-type">
        {#if typeExercise === 'lecture'}
          Comprensión de lectura (Cloze Test):<br>
        {/if}
        Completar espacios
      </p>
      <div class="wr-space">
        <TextArea 
          name="def" 
          label={typeExercise === 'normal' ? 'Descripción' : 'Título de la lectura'} 
          bind:value={question} --height-text-area={typeExercise === 'normal' ? '80px' : '36px'} isError={false} />
        <TextArea name="ghi" label={typeExercise === 'normal' ? 'Texto de la actividad' : 'Lectura'} bind:value={content} --height-text-area="150px" isError={false} />
        {#if typeExercise === 'lecture'}
          <div>
            <Input type="number" name="abc" label="Tiempo de lectura (En segundos)" bind:value={timeLecture} />
          </div>
        {/if}
      </div>

    {:else if sheet === 'match'}

      <p class="label-type">
        {#if typeExercise === 'lecture'}
          Comprensión de lectura:<br>
        {/if}
        Relacionar conceptos
      </p>

      <div class="grid-fx">
        <TextArea 
          name="def" 
          label={typeExercise === 'normal' ? 'Descripción' : 'Título de la lectura'} 
          bind:value={question} 
          --height-text-area={typeExercise === 'normal' ? '60px' : '36px'} 
          isError={false} />

        {#if typeExercise === 'lecture'}
          <TextArea name="ghi" label='Lectura' bind:value={content} --height-text-area="150px" isError={false} />
          <div>
            <Input type="number" name="abc" label="Tiempo de lectura (En segundos)" bind:value={timeLecture} />
          </div>
        {/if}

      </div>

      <div class="wr-words-match">
      <div class="header-match">
        <h1 class="title-wd">Palabras del lado izquierdo</h1>
        <button class="add-word" onclick={()=>handlePlusMatchWords('left')}>Adicionar</button>
      </div>
      <div class="wr-space">
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
        <div class="wr-space">
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

      {#if typeExercise === 'normal'}
        <TextArea name="ghi" label='Descripción del test' bind:value={question} --height-text-area="60px" isError={false} />
      {:else if typeExercise === 'lecture'}
        <div class="grid-fx">
          <TextArea name="ghix" label='Título de la lectura' bind:value={question} --height-text-area="60px" isError={false} />
          <TextArea name="ghi" label='Lectura' bind:value={content} --height-text-area="150px" isError={false} />
          <Input type="number" name="abc" label="Tiempo de lectura (En segundos)" bind:value={timeLecture} />
        </div>
      {/if}

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

          <div class="wr-value-point">Valor: {qs.value}</div>
          <div class="question">{qs.question}</div>

          {#if qs.images.length !== 0}
            <div class="container-images-question">
              {#each qs.images as img, i}
                <div>
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
        <div class="wr-select-value">
          Valor: 
          <select class="select-value" bind:value={questionTest.value} disabled={typeExercise === 'lecture'}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        </div>
        {#if typeExercise === 'normal'}
          <button class="btn-view-album" onclick={handleUpload}>Imagen</button>
        {/if}
      </div>

      <TextArea name="def" label="Pregunta" bind:value={questionTest.question} --height-text-area="80px" isError={false} />

      {#if questionTest.images.length !== 0}
        <div class="container-images-question">
          {#each questionTest.images as image, index}
            <div>
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

      <br>
      
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
              {#if typeExercise === 'normal'}
                <button class="btn-view-item" onclick={()=>handleUploadImageItem(index)}>Imagen</button>
              {/if}
              <button class="btn-remove-item" onclick={()=>handleRemoveItem(index)}>Quitar</button>
            </div>
            
          </div>
        {/each}
      </div>

    {:else if sheet === 'test-pdf'}

      <!-- =========================================================== -->
      <div class="wr-container-btn-file-pdf">
        <p class="label-type-test-pdf">Test PDF</p>
        <TextArea name="def" label="Descripción" bind:value={content} --height-text-area="60px" isError={false} />
      </div>

      <div class="wr-file-name">{fileName}</div>

      <div class="wr-label-response">
        <h1 class="label-response">Respuestas</h1>
        <div>
          <span>Punto</span>
          <span>|</span>
          <span>Valor</span>
        </div>
      </div>

      <div class="container-items-answer-test">
        {#each arrayQuestionsTestPDF as answer, index}
          {@const count = answer.points.length}
          <div class="container-answer-point-test">
            <button class="label-item" onclick={()=>{ arrayQuestionsTestPDF = arrayQuestionsTestPDF.filter((_, i) => i !== index)}}>{index + 1}</button>

            <div class="wr-row-point-test">
              {#each answer.points as row}
                <button class="btn-point-test" onclick={()=>{row.rst = !row.rst}} class:rst-point={row.rst}>{row.char}</button>
              {/each}
            </div>
            
            <div class="wr-bx-selects">
              <select class="select-value-test" value={count} 
                onchange={(e)=>handleChangeCountPoint(e, index)}>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
              <select class="select-value-test" 
                bind:value={answer.value} onchange={(e)=>{answer.value = Number((e.target as HTMLSelectElement).value)}}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
              </select>
            </div>
          </div>
        {/each}
      </div>

      <div class="wr-value-total">Valor total: {totalValuesPoint}</div>

    {:else if sheet === 'test-fs'}

      <div class="wr-container-btn-file-pdf">
        <p class="label-type-test-pdf">Test FS</p>
        <TextArea name="def" label="Descripción" bind:value={content} --height-text-area="60px" isError={false} />
      </div>

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
              <div>
                <div class="wr-image-question">
                  <img class="image-question" src={qs.image} alt="" />
                </div>
              </div>
            {/if}

            {#if qs.audio.length !== 0}
              <div class="wr-audio-edit">
                <audio class="audio" src={qs.audio} controls></audio>
              </div>
            {/if}

            {#if qs.words.length !== 0}
              <div class="container-answer-fs">
                {#each qs.words as word}
                  <button class="answer-fs">{corregirIEnFrase(word.word)}</button>
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
          <div>
            <div class="wr-image-question">
              <img class="image-question" src={questionTestFS.image} alt="" />
              <button class="btn-remove-image-test" onclick={handleRemoveImageQuestionFS}>{@html trash}</button>
            </div>
          </div>
        </div>
      {/if}

      <!--- ================================================ -->
      {#if questionTestFS.audio.length !== 0}
        <div class="wr-audio-edit">
          <audio class="audio" src={questionTestFS.audio} controls></audio>
          <button class="btn-remove-audio-fs" onclick={handleRemoveAudioQuestionFS}>{@html trash}</button>
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
  .span-baseline > svg {
    width: 120px;
  }
  .span-pointer > svg {
    width: 50px;
  }
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
  .btn-remove-audio-fs > svg {
    width: 18px;
    color: #fff;
    stroke-width: 3px;
  }
  .btn-save-exercise > svg {
    width: 18px;
    color: #414141;
    stroke-width: 3px;
    animation: girar 1.5s linear infinite;
  }
}

.container-info-exerc {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.text-left {
  text-align: left;
  font-size: 1.05em;
}
.grid-fx {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.wr-bx-selects {
  display: flex;
  gap: 0.5em;
}
.wr-file-name {
  font-family: var(--font-normal);
  margin-bottom: 1em;
  border-top: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
  padding: 10px 0;
}
.wr-container-btn-file-pdf {
  display: flex;
  margin-bottom: 1em;
  gap: 1em;
  flex-direction: column;
}
.label-figure {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  font-family: var(--font-normal);
  text-align: center;
}
.btn-create {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-normal);
  background: #2196F3;
  color: #fff;
  font-weight: 800;
  transition: var(--transition);
}
.btn-create:hover {
  background: #0375cf;
}
.span-baseline img {
  width: 60%;
  height: 85%;
  object-fit: contain;
}
.span-baseline {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wr-figure {
  height: 200px;
  width: 100%;
  display: grid;
  grid-template-rows: 120px 45px 35px;
  box-shadow: rgb(99 99 99 / 51%) 0px 2px 8px 0px;
  border-radius: 6px;
  overflow: hidden;
}
.wr-w-figure {
  position: relative;
}
.wr-value-total {
  font-family: var(--font-normal);
  display: flex;
  justify-content: right;
}
.btn-point-test.rst-point {
  background: #11d511;
  color: #fff;
}
.wr-label-response {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-normal);
}
.select-value-test {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
  /* Opcional: para IE y Edge */
  width: 30px;
  height: 26px;
  background: #fff;
  border-radius: 5px;
  text-align: center;
  font-family: var(--font-normal);
  &::-ms-expand {
    display: none;
  }
}
.wr-row-point-test {
  display: flex;
  gap: 0.5em; 
  width: 100%;
  justify-content: center;
}
.container-items-answer-test {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.label-item {
  font-family: var(--font-normal);
  font-weight: 900;
  font-size: 1.2em;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ff6060;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}
.btn-point-test {
  font-family: var(--font-normal);
  width: 36px;
  height: 36px;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #ffffff;
  font-weight: 900;
  font-size: 1.1em;
}
.container-answer-point-test {
  display: flex;
  background: var(--border-item);
  padding: 8px;
  border-radius: var(--border-radius);
  position: relative;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: rgb(161 178 225) 0px 3px 0px 0px;
  justify-content: space-between;
  align-items: center;
}
.add-point-test {
  font-family: var(--font-normal);
  border-radius: 4px;
  cursor: pointer;
  background: bisque;
  font-size: 1em;
  transition: var(--transition);
  height: 32px;
  padding: 0.4em;
}
@keyframes girar {
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
}
.wr-btns-actions {
  display: flex;
  gap: 1em;
}
.wr-btn-point-out {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em 0 0;
}
.btn-point-out {
  padding: 0.6em 1em;
  border-radius: 6px;
  background: var(--bg-blue);
  cursor: pointer;
  color: #fff;
  font-family: var(--font-normal);
  transition: var(--transition);
}
.btn-point-out:hover {
  background: var(--bg-blue-hover);
}
.pd-1-0 {
  padding: 1em 0;
}
.wr-space {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.wr-value-point {
  font-family: var(--font-normal);
  display: flex;
  justify-content: right;
  font-weight: 600;
  font-size: 0.9em;
}
.row-items {
  display: flex;
  flex-direction: column;
  gap: 0.7em;
}
.wr-select-value {
  display: flex;
  align-items: center;
  gap: 0.4em;
  font-family: var(--font-normal);
}
.select-value {
  font-family: var(--font-normal);
  background: #fff;
  border-radius: 4px;
}
.audio {
  height: 40px;
}
.wr-audio-edit {
  display: flex;
  align-items: center;
  gap: 1em;
  justify-content: center;
}
.btn-remove-audio-fs {
  width: 40px;
  height: 40px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #ff7d7d;
  transition: var(--transition);
}
.btn-remove-audio-fs:hover {
  background: #f75c5c;
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
  font-weight: 600;
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
  height: 90px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #94ebe8;
  font-family: var(--font-normal);
  font-weight: 900;
  font-size: 2em;
}
.link-activity {
  display: grid;
  grid-template-columns: 50px 1fr;
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
  margin-bottom: 2em;
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
  padding-bottom: 1em;
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
  background: #88d4f5;
  font-family: var(--font-normal);
}
.btn-remove-item {
  padding: 0.2em 0.5em;
  border-radius: 4px;
  cursor: pointer;
  background: #f1baa9;
  font-family: var(--font-normal);
}
.container-items-answer {
  margin: 1em 0;
  display: flex;
  flex-direction: column;
  gap: 2.6em;
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
  padding: 0.2em 0.5em;
  border-radius: 4px;
  cursor: pointer;
  background: #c4dcc4;
  font-family: var(--font-normal);
}
.wr-hd {
  display: flex;
  justify-content: right;
  position: relative;
  top: 15px;
  gap: 1em;
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
  padding: 1em 0 1em;
}
.wr-image-question {
  width: 100%;
  /*height: 300px;*/
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid #b5c7fb;
  background: #fff;
}
.image-question {
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
}
.wr-words-match {
  margin: 2em 0 1em;
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
.label-type-test-pdf {
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
  margin-bottom: 1em;
}
.btn-save-exercise {
  font-family: var(--font-normal);
  padding: 0.4em;
  border-radius: 4px;
  cursor: pointer;
  background: bisque;
  font-size: 1em;
  transition: var(--transition);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 32px;
}
.btn-new {
  font-family: var(--font-normal);
  border-radius: 4px;
  cursor: pointer;
  background: bisque;
  font-size: 1em;
  transition: var(--transition);
  height: 32px;
  padding: 0.4em;
}
.sheet-type {
  margin: 2em 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
}
/*
.wr-cancel-intro {
  display: flex;
  gap: 2em;
}
*/
.body-box-exercise {
  background: #fff;
  height: calc(100% - var(--height-header));
  overflow-y: auto;
  padding: 1em 1em 2em;
  display: flex;
  flex-direction: column;
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
@media (min-width: 425px) {
  .wr-row-point-test {
    justify-content: left;
    padding-left: 1em;
    gap: 1em;
  }
}
@media (min-width: 500px) {
  .btn-new, .btn-save-exercise {
    font-size: 0.85em;
  }
  .btn-new:hover {
    background: #f9d6ad;
  }
}
</style>
