// No.登録用
let numList = [];
// 入力データ登録用
let memoList = [];

// Load from Local Storage
let serializedAry = localStorage.getItem("savedataAry");
let serializedAry2 = localStorage.getItem("savedataAry2");

// Deserialize
numList = JSON.parse(serializedAry);
memoList = JSON.parse(serializedAry2);
console.log(numList);
console.log(memoList);

// sound
// Setup the new Howl.
const sound1 = new Howl({
  src: ["./sound/pingpong.mp3"], // OK
});
const sound2 = new Howl({
  src: ["./sound/boo.mp3"], // NG
});

// Change global volume.
// Howler.volume(0.5);

// ローカルデータが無かった時のみ上書きする処理、nullのままだと保存できないのでmust
if (numList === null || numList.length === 0) {
  // console.log("ローカルストレージにデータが無いので100をテストで入れる");
  numList = [];
}
if (memoList === null || memoList.length === 0) {
  // console.log("ローカルストレージにデータが無いので100をテストで入れる");
  memoList = [];
}

/**
 * 計算する
 * @param { object } btn
 * @returns
 */
function get_calc(btn) {
  // console.log(btn);
  // console.log(typeof btn); // object
  // 1文字目が演算子の場合は消す
  // let val = document.calculator.display.value;
  if (
    (btn.value === "=" ||
      btn.value === "×" ||
      btn.value === "*" ||
      btn.value === "÷" ||
      btn.value === "+" ||
      btn.value === "-") &&
    (document.calculator.display.value === "" ||
      document.calculator.display.value === null ||
      document.calculator.display.value === undefined)
  ) {
    // alert("式の先頭が記号は不可");
    return false;
  }

  if (btn.value === "=") {
    document.calculator.display.value = evaluate(
      document.calculator.display.value,
    ).trim();
  } else if (btn.value === "C") {
    document.calculator.display.value = "";

    let colorElemnt = document.getElementsByClassName("display_message")[0];
    colorElemnt.style.setProperty("background-color", "white");

    document.calculator.display_message.value = "";
    document.calculator.display_message_input.value = "";
  } else {
    if (btn.value === "×") {
      btn.value = "*";
    } else if (btn.value === "÷") {
      btn.value = "/";
    }
    document.calculator.display.value += btn.value;
    document.calculator.multi_btn.value = "×";
    document.calculator.div_btn.value = "÷";
  }
}

/**
 * データを登録する
 * @returns
 */
function setData() {
  let setNo = evaluate(document.calculator.display.value).trim();
  let setMemo = document.calculator.display_message_input.value;
  console.log("setMemo: ", setMemo);
  // 数値無し時
  if (setNo === "" || setNo === undefined) {
    alert("番号が入力されていません");
    return false;
  }
  // 再登録可にする為に一時的に停止
  // for (let i = 0; i <= numList.length; i++) {
  //   if (setNo === numList[i]) {
  //     alert("その番号は既に登録済みです");
  //     document.calculator.display.value = "";
  //     return false;
  //   } else {
  //     console.log("登録データ内に無し");
  //   }
  // }
  alert(`${setNo}番を新たに登録しました`);

  document.calculator.display.value = "";
  document.calculator.display_message_input.value = "";
  numList.push(setNo);
  if (setMemo === "" || setMemo === undefined || setMemo === null) {
    setMemo = "データなし";
  }
  memoList.push(setMemo);

  // Serialize
  serializedAry = JSON.stringify(numList);
  serializedAry2 = JSON.stringify(memoList);

  // Save for Local Storage
  localStorage.setItem("savedataAry", serializedAry);
  localStorage.setItem("savedataAry2", serializedAry2);
}

/**
 * （1つの）データを削除する
 * @returns
 */
function deleteData() {
  let deleteNo = evaluate(document.calculator.display.value).trim();

  // 数値無し時
  if (deleteNo === "" || deleteNo === undefined) {
    alert("番号が入力されていません");
    return false;
  }
  for (let i = 0; i <= numList.length; i++) {
    if (deleteNo === numList[i]) {
      alert(`${deleteNo}番を登録から削除します`);
      numList.splice(i, 1);

      // Serialize
      serializedAry = JSON.stringify(numList);
      serializedAry2 = JSON.stringify(memoList);

      // Save for Local Storage
      localStorage.setItem("savedataAry", serializedAry);
      localStorage.setItem("savedataAry2", serializedAry2);

      document.calculator.display.value = "";
      document.calculator.display_message_text.value = "";
      document.calculator.display_message_input.value = "";
      return false;
    } else {
      console.log("登録データ内に無し");
    }
  }
  alert("その番号は登録データ内に見つかりませんでした");
  document.calculator.display.value = "";
  document.calculator.display_message_text.value = "";
  document.calculator.display_message_input.value = "";
}

/**
 * 入力データが登録データ内に有るかチェックする
 * @returns
 */
function checkData() {
  let checkNo = evaluate(document.calculator.display.value).trim();

  // 数値無し時
  if (checkNo === "" || checkNo === undefined) {
    alert("番号が入力されていません");
    return false;
  }
  for (let i = 0; i <= numList.length; i++) {
    if (checkNo === numList[i]) {
      console.log("その番号は禁止リストに有ります！", i, "番目");

      let colorElemnt = document.getElementsByClassName("display_message")[0];
      colorElemnt.style.setProperty("background-color", "red");
      colorElemnt.style.setProperty("color", "white");

      sound1.stop();
      sound2.play();
      document.calculator.display_message.value = "× その番号は禁止です！";

      // Load from Local Storage
      serializedAry2 = localStorage.getItem("savedataAry2");

      // Deserialize
      console.log(memoList);
      memoList = JSON.parse(serializedAry2);

      document.calculator.display_message_input.value = memoList[i];

      return false;
    } else {
      // console.log("禁止リストには無し");
      let colorElemnt = document.getElementsByClassName("display_message")[0];
      colorElemnt.style.setProperty("background-color", "green");
      colorElemnt.style.setProperty("color", "white");

      sound2.stop();
      sound1.play();
      document.calculator.display_message.value = "〇 その番号はOKです！";
    }
  }
}

/**
 * 登録データ一覧を表示する
 */
function displayRegistrationList() {
  alert(numList);
}

/**
 * 登録データを全て削除する
 */
function deleteAllData() {
  // 確認用ダイアログ
  const dialog = window.confirm("登録データを全て削除してよろしいですか？");

  if (dialog) {
    numList = [];
    localStorage.clear();
    alert("全ての登録データを削除しました");
    document.calculator.display.value = "";
    console.log(numList);
  } else {
    event.preventDefault();
    alert("データ削除を中止しました");
  }
}

/**
 * 登録データをソートする（昇順）
 */
function sortData() {
  // 確認用ダイアログ
  const dialog = window.confirm("番号を昇順で並べ変えますか？");

  if (dialog) {
    // 0パディング
    // for (let i = 0; i < numList.length; i++) {
    //   console.log(i);
    //   let result = zeroPadding(numList[i], 4);
    //   numList[i] = result;
    // }

    // ソート
    // let newList = numList.sort((a, b) => (a < b ? -1 : 1));

    // 桁数が異なってもOKなソート
    let newList = numList.sort((a, b) => a - b);
    console.log(newList);
    numList = newList;

    // Serialize
    serializedAry = JSON.stringify(numList);

    // Save for Local Storage
    localStorage.setItem("savedataAry", serializedAry);

    document.calculator.display.value = "";

    alert("登録データを昇順でソートしました");
  } else {
    event.preventDefault();
    alert("ソートを中止しました");
  }
}

/**
 * 数値のゼロ埋め（＝ゼロパディング、桁を揃える）
 * @param {number|string} number 対象の数字
 * @param {number} [digit=0] 桁数
 * @returns {string} ゼロが埋められた数字を返す
 */
const zeroPadding = (number, digit = 0) => {
  const fillNumber = digit - String(number).length;

  return fillNumber > 0 ? "0".repeat(fillNumber) + number : number;
};
