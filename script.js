// 🎯 Select all letter boxes and set constants
const letters = document.querySelectorAll('.row div');
console.log(letters)
const ANSWER_LENGTH = 5;

// 🚀 Start the game logic
async function init() {
  let currentRow = 0;
  let currentGuess = '';
  //add a variable
  let won = false

  // 🧩 1. Get the word of the day from API
  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split("");

  console.log("Word of the day:", word);

  // 🅰️ 2. Add letter when user types
  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      currentGuess += letter;
      letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter;
    }
  }

  // ⬅️ 3. Handle backspace
  function backspace() {
    if (currentGuess.length > 0) {
      letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = '';
      currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    }
  }

  // ✅ 4. Handle when user presses Enter
  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) return;

    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts); // track letter frequency

    // 🏆 If player guessed right
    if (currentGuess === word) {
      document.getElementById("message").textContent = "🎉 You win!";
      won = true
    } else {
      document.getElementById("message").textContent = "❌ Not the word!";
    }

    // 🟩 5. First pass — mark correct letters (green)
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--; // reduce count for used letters
      }
    }

    // 🟨 6. Second pass — mark close / wrong
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        // already handled as correct
        continue;
      } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close"); // yellow
        map[guessParts[i]]--;
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong"); // gray
      }
    }

    // Move to next row
    currentRow++;
    currentGuess = '';
  }

  // 🔤 7. Helper: check if key is a letter
  function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }

  // 🧮 8. Helper: make a letter frequency map
  function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
      const letter = array[i];
      if (obj[letter]) {
        obj[letter]++;
      } else {
        obj[letter] = 1;
      }
    }
    return obj;
  }

  // ⌨️ 9. Listen to keyboard events
  document.addEventListener("keydown", function (event) {
    if (won){ return }
    //console.log (event);
    const action = event.key.toLowerCase();

    if (action === "enter") {
      commit();
    } else if (action === "backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    }
  });
}

// 🔁 Start game
init();
