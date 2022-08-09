// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questions = JSON.parse(this.responseText);
      let qCount = questions.length;
      createBullets(qCount);
      addQuestionData(questions[currentIndex], qCount);

      countdown(10, qCount);

      submitButton.onclick = () => {
        let theRightAnswer = questions[currentIndex].right_answer;
        currentIndex++;

        checkAnswer(theRightAnswer, qCount);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questions[currentIndex], qCount);
        handleBullets();

        clearInterval(countdownInterval);
        countdown(10, qCount);
        showResults(qCount);
      };
    }
  };
  myRequest.open("GET", "html-questions.json", true);
  myRequest.send();
}
getQuestions();
function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i == 0) {
      theBullet.classList.add("on");
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}
function handleBullets() {
  let bulletSpans = document.querySelectorAll(".bullets .spans span");
  let spanArray = Array.from(bulletSpans);
  spanArray.forEach((span, index) => {
    if (currentIndex === index) {
      span.classList.add("on");
    }
  });
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj.title);

    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radio = document.createElement("input");
      radio.name = "question";
      radio.type = "radio";
      radio.id = `answer_${i}`;
      radio.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        radio.checked = true;
      }

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;

      let labelText = document.createTextNode(obj[`answer_${i}`]);

      label.appendChild(labelText);

      mainDiv.appendChild(radio);
      mainDiv.appendChild(label);

      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(answer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (answer === theChoosenAnswer) {
    rightAnswers++;
  }
}
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} from ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, ${rightAnswers} from ${count} Is Amazing`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} from ${count}`;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
        setInterval;
      }
    }, 1000);
  }
}
