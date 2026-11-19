let flashcards = [];
let missedCards = [];
let currentIndex = 0;
let showingFront = true;
let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = "";
const cardText =
document.getElementById("cardText");
async function loadDeck(deckName) {
    const response =
        await fetch(`decks/${deckName}.csv`);
    const csv =
        await response.text();
    flashcards = [];
    const rows =
        csv.trim().split("\n");
    rows.forEach(row => {
        const parts =
            row.split(",");
        flashcards.push({
            question:
                parts[0].trim(),
            answer:
                parts[1].trim()
        });
    });
    currentIndex = 0;
    showingFront = true;
    displayCard();
    document
        .getElementById("deckName")
        .textContent =
        deckName;
}
function displayCard() {
    if (flashcards.length === 0)
        return;
    cardText.textContent =
        showingFront
        ? flashcards[currentIndex].question
        : flashcards[currentIndex].answer;
}
function flipCard() {
    showingFront =
        !showingFront;
    displayCard();
}
document
.getElementById("card")
.addEventListener(
    "click",
    flipCard
);
function nextCard() {
    currentIndex++;
    if (
        currentIndex >= flashcards.length
    ) {
        currentIndex = 0;
    }
    showingFront = true;
    displayCard();
}
function prevCard() {
    currentIndex--;
    if (
        currentIndex < 0
    ) {
        currentIndex =
            flashcards.length - 1;
    }
    showingFront = true;
    displayCard();
}
function startQuiz() {
    if (
        flashcards.length === 0
    ) {
        alert(
            "Please select a deck first."
        );
        return;
    }
    score = 0;
    missedCards = [];
    currentQuestion = 0;
    quizQuestions =
        [...flashcards]
        .sort(() => Math.random() - 0.5)
        .slice(
            0,
            Math.min(
                50,
                flashcards.length
            )
        );
    showQuestion();
}
function showQuestion() {
    let card =
        quizQuestions[currentQuestion];
    let choices =
        flashcards
        .filter(
            f =>
            f.answer !== card.answer
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(
            f => f.answer
        );
    choices.push(card.answer);
    choices.sort(
        () => Math.random() - 0.5
    );
    let html = `
    <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        gap:15px;
        flex-wrap:wrap;
    ">
        <h2>
        Question ${currentQuestion + 1}
        of ${quizQuestions.length}
        </h2>
        <button
        onclick="submitAnswer()">
        Submit Answer
        </button>
    </div>
    <h3>
        ${card.question}
    </h3>
    `;
    choices.forEach((choice,index) => {
        html += `
        <button
            id="answer-${index}"
            class="answerButton"
            onclick="selectAnswer(
                this,
                '${choice.replace(/'/g,"\\'")}'
            )">
            ${choice}
        </button>
        `;
    });
    document
        .getElementById(
            "quizSection"
        )
        .innerHTML = html;
}
function selectAnswer(
    button,
    answer
){
    selectedAnswer = answer;
    const buttons =
        document.querySelectorAll(
            ".answerButton"
        );
    buttons.forEach(btn => {
        btn.classList.remove(
            "selectedAnswer"
        );
    });
    button.classList.add(
        "selectedAnswer"
    );
}
function submitAnswer() {
    if(!selectedAnswer){
        alert(
            "Please select an answer."
        );
        return;
    }
    let card =
        quizQuestions[currentQuestion];
    const buttons =
        document.querySelectorAll(
            ".answerButton"
        );
    buttons.forEach(button => {
        const answerText =
            button.textContent.trim();
        if(
            answerText ===
            card.answer
        ){
            button.classList.add(
                "correctAnswer"
            );
        }
        if(
            answerText ===
            selectedAnswer &&
            selectedAnswer !==
            card.answer
        ){
            button.classList.add(
                "wrongAnswer"
            );
        }
        button.disabled = true;
    });
    if(
        selectedAnswer ===
        card.answer
    ){
        score++;
    }
    else{
        missedCards.push(
            card
        );
    }
    setTimeout(() => {
        currentQuestion++;
        selectedAnswer = "";
        if(
            currentQuestion >=
            quizQuestions.length
        ){
            showResults();
            return;
        }
        showQuestion();
    }, 1500);
}
function showResults() {
    document
        .getElementById(
            "quizSection"
        )
        .innerHTML = "";
    document
        .getElementById(
            "results"
        )
        .innerHTML = `
    <h2>
        Quiz Complete
    </h2>
    <h3>
        Score:
        ${score}
        /
        ${quizQuestions.length}
    </h3>
    <p>
        Missed:
        ${missedCards.length}
    </p>
    <button
    onclick="studyMissedCards()">
    Study Missed Cards
    </button>
    `;
}
function studyMissedCards() {
    if (
        missedCards.length === 0
    ) {
        alert(
            "Perfect Score!"
        );
        return;
    }
    flashcards =
        [...missedCards];
    currentIndex = 0;
    showingFront = true;
    displayCard();
}
