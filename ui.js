import { addFavorite, removeFavorite, getFavorites, isDark } from "./storage.js";

// Abv part of speech
const POS_SHORT = {
    noun: "n",
    verb: "v",
    adjective: "adj",
    adverb: "adv",
    pronoun: "pron",
    preposition: "prep",
    conjunction: "conj",
    interjection: "interj",
    article: "art",
    determiner: "det"
};

/**
 * Displays an error message in the UI.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    const errorDiv = document.getElementById("error-message");
    if (!errorDiv) return;
    errorDiv.textContent = message;
    errorDiv.classList.remove("d-none");
}

/**
 * Clears all UI elements related to the word display.
 * Resets titles, definitions, synonyms, audio, and hides error/results sections.
 */
function clearUI() {
    const resultsCard = document.getElementById("results");
    const wordTitle = document.getElementById("word-title");
    const phonetic = document.getElementById("phonetic");
    const definitionsDiv = document.getElementById("definitions");
    const synonymsDiv = document.getElementById("synonyms");
    const audioContainer = document.getElementById("audio-container");
    const errorDiv = document.getElementById("error-message");

    if (!resultsCard || !wordTitle || !phonetic || !definitionsDiv || !synonymsDiv || !audioContainer || !errorDiv) return;

    errorDiv.classList.add("d-none");
    resultsCard.classList.remove("show"); // hide content
    wordTitle.textContent = "";
    phonetic.textContent = "";
    definitionsDiv.innerHTML = "";
    synonymsDiv.innerHTML = "";
    audioContainer.innerHTML = "";
}

/**
 * Renders a pronunciation audio button if audio data exists.
 * @param {Array<Object>} phoneticsArray - Array of phonetic objects with audio URLs.
 */
function renderAudio(phoneticsArray) {
    const audioContainer = document.getElementById("audio-container");
    if (!audioContainer) return;
    const audioData = phoneticsArray.find(p => p.audio);
    if (!audioData) return;
    const audio = new Audio(audioData.audio);
    const btn = document.createElement("button");
    audioContainer.innerHTML = "";
    btn.id = "btnAudio";
    btn.className = isDark ? "btn btn-primary":"btn btn-outline-secondary";
    btn.textContent = "Play Pronunciation";
    btn.addEventListener("click", () => audio.play());
    audioContainer.appendChild(btn);
}

/**
 * Renders word details in the UI including definitions, synonyms, and audio.
 * @param {Object} data - The word data object from the dictionary API.
 * @param {string} data.word - The word itself.
 * @param {string} [data.phonetic] - The phonetic representation of the word.
 * @param {Array<Object>} data.phonetics - Array of phonetic objects with audio URLs.
 * @param {Array<Object>} data.meanings - Array of meaning objects, each containing definitions and synonyms.
 */
function renderWord(data) {
    const wordTitle = document.getElementById("word-title");
    const phonetic = document.getElementById("phonetic");
    const definitionsDiv = document.getElementById("definitions");
    const synonymsDiv = document.getElementById("synonyms");
    const resultsCard = document.getElementById("results");

    if (!wordTitle || !phonetic || !definitionsDiv || !synonymsDiv || !resultsCard) return;

    wordTitle.textContent = data.word;
    phonetic.textContent = data.phonetic || "";
    renderAudio(data.phonetics);
    definitionsDiv.innerHTML = "<h5>Definitions</h5>";
    
    //Get all definitions and output the top 5
    const allDefinitions = data.meanings.flatMap(meaning =>
        meaning.definitions.map(def => ({
            pos: POS_SHORT[meaning.partOfSpeech.toLowerCase()] || meaning.partOfSpeech,
            definition: def.definition,
            example: def.example
        }))
    );
    allDefinitions.slice(0, 5).forEach(defObj => {
        const p = document.createElement("p");
        p.innerHTML = `<strong>${defObj.pos}</strong>: ${defObj.definition}`;
        if (defObj.example) p.innerHTML += `<br><em>Example:</em> ${defObj.example}`;
        definitionsDiv.appendChild(p);
    });

    // Build a synonyms list and output 3
    const synonyms = data.meanings.flatMap(m => m.synonyms).filter(Boolean); //“Take all synonyms flatten to single array, remove empty values.”
    if (synonyms.length > 0) {
        const synonymsShortList = [...new Set(synonyms)].slice(0, 3).join(", "); // get unique top 3 synonyms 
        synonymsDiv.innerHTML = `<strong>Synonyms:</strong> ${synonymsShortList}`;
    }
    resultsCard.classList.add("show");    // show content
    resultsCard.classList.add("highlight");
    setTimeout(() => resultsCard.classList.remove("highlight"), 1500);
}

/**
 * Renders the list of favorite words in the UI.
 * Adds a remove button for each favorite that updates the list when clicked.
 */
function renderFavorites() {
    const savedWordsList = document.getElementById("saved-words");
    if (!savedWordsList) return;

    savedWordsList.innerHTML = "";
    getFavorites().forEach(word => {
        const li = document.createElement("li");
        const removeBtn = document.createElement("button");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = word;
        removeBtn.className = "btn btn-sm btn-danger";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
            removeFavorite(word);
            renderFavorites();
        });
        li.appendChild(removeBtn);
        savedWordsList.appendChild(li);
    });
}

export { showError, clearUI, renderWord, renderFavorites, renderAudio };
