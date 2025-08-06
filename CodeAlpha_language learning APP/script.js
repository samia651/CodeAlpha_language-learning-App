const flashcards = [
  { word: "Hola", meaning: "Hello", pronunciation: "OH-lah" },
  { word: "Gracias", meaning: "Thank you", pronunciation: "GRAH-syahs" },
  { word: "Adiós", meaning: "Goodbye", pronunciation: "ah-dee-OHS" },
  { word: "Por favor", meaning: "Please", pronunciation: "por fah-BOHR" },
  { word: "Lo siento", meaning: "I'm sorry", pronunciation: "lo SYEN-toh" },
  { word: "Sí", meaning: "Yes", pronunciation: "see" },
  { word: "No", meaning: "No", pronunciation: "no" },
  { word: "Cómo estás?", meaning: "How are you?", pronunciation: "KOH-moh ess-TAHS" }
];

const grammarLessons = [
  { title: "Ser vs Estar", content: "Use 'ser' for permanent traits and 'estar' for temporary states." },
  { title: "Gender of Nouns", content: "Masculine → '-o' (el libro), Feminine → '-a' (la casa)." },
  { title: "Plural Nouns", content: "Add '-s' or '-es' for plural. casa → casas, mujer → mujeres." },
  { title: "Definite Articles", content: "el/la for singular, los/las for plural nouns." },
  { title: "Present Tense", content: "-ar: hablo, -er: como, -ir: vivo." },
  { title: "Reflexive Verbs", content: "lavarse → me lavo, te lavas, se lava..." }
];

const quizQuestions = [
  { question: "What does 'Hola' mean?", options: ["Goodbye", "Hello", "Please"], answer: "Hello" },
  { question: "How do you say 'Thank you' in Spanish?", options: ["Gracias", "Lo siento", "Por favor"], answer: "Gracias" },
  { question: "What does 'Adiós' mean?", options: ["Hello", "Sorry", "Goodbye"], answer: "Goodbye" },
  { question: "What is 'Please' in Spanish?", options: ["Perdón", "Gracias", "Por favor"], answer: "Por favor" },
  { question: "How do you say 'I'm sorry'?", options: ["Lo siento", "Hola", "Sí"], answer: "Lo siento" },
  { question: "What is the Spanish word for 'Yes'?", options: ["Sí", "No", "Hola"], answer: "Sí" },
  { question: "How do you say 'How are you?'", options: ["Cómo estás?", "Dónde estás?", "Qué hora es?"], answer: "Cómo estás?" }
];

window.onload = () => {
  renderFlashcards();
  renderGrammarLesson();
  renderQuiz();
};

function renderFlashcards() {
  const container = document.getElementById("flashcards");
  container.innerHTML = "";
  flashcards.forEach(card => {
    const key = `fav-${card.word}`;
    const isFav = localStorage.getItem(key) && localStorage.getItem(key) === "true"; // ✅ FIXED

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${card.word}</strong> - ${card.meaning}<br>
      <em>${card.pronunciation}</em><br>
      <button onclick="speak('${card.word}')">🔊 Speak</button>
      <button onclick="copyWord('${card.word}')">📋 Copy</button>
      <button onclick="toggleFavorite('${card.word}')" style="background:${isFav ? '#ffc107' : '#555'};">
        ⭐ ${isFav ? 'Unfavorite' : 'Favorite'}
      </button>
    `;
    container.appendChild(div);
  });
}

function speak(text) {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }, 50);
  } else {
    alert("Speech synthesis not supported on this browser.");
  }
}

function copyWord(word) {
  navigator.clipboard.writeText(word)
    .then(() => alert(`Copied: ${word}`));
}

function toggleFavorite(word) {
  const key = `fav-${word}`;
  const isFav = localStorage.getItem(key) === "true";
  localStorage.setItem(key, (!isFav).toString());
  renderFlashcards(); // re-render to update button
}

function renderGrammarLesson() {
  const lesson = grammarLessons[Math.floor(Math.random() * grammarLessons.length)];
  const container = document.getElementById("grammar-content");
  container.innerHTML = `<h3>${lesson.title}</h3><p>${lesson.content}</p>`;
}

function renderQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";
  quizQuestions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<p>${q.question}</p>` +
      q.options.map(opt => `
        <label>
          <input type="radio" name="q${i}" value="${opt}"> ${opt}
        </label><br>`).join("");
    container.appendChild(div);
  });
}

function submitQuiz() {
  let score = 0;
  quizQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const card = document.querySelectorAll('#quiz-container .card')[i];
    if (selected) {
      if (selected.value === q.answer) {
        score++;
        card.style.borderLeft = "5px solid green";
      } else {
        card.style.borderLeft = "5px solid red";
      }
    }
  });
  document.getElementById("quiz-result").innerText = `✅ Your score: ${score} / ${quizQuestions.length}`;
}

function showSection(sectionId) {
  document.querySelectorAll(".content-section").forEach(s => s.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
}
