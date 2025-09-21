import { addFavorite, getTheme, setTheme } from "./storage.js";
import { showError, clearUI, renderWord, renderFavorites } from "./ui.js";

const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const saveBtn = document.getElementById("save-word");
const dictAddress = "https://api.dictionaryapi.dev/api/v2/entries/en/"
let currentWord = "";

/**
 * Initializes main application event listeners for the dictionary app.
 * @async
 */
function main() {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const word = input.value.trim();
        if (!word) return;
        clearUI();
        try {
            const result = await fetch(`${dictAddress}${word}`);
            if (!result.ok) throw new Error("Word not found");
            const data = await result.json();
            currentWord = data[0].word;
            renderWord(data[0]);
        } catch (err) {
            showError(err.message);
        }
    });
    saveBtn.addEventListener("click", () => {
        if (!currentWord) return;
        addFavorite(currentWord);
        renderFavorites();
    });
    const toggle = document.getElementById("theme-toggle");
    const resultsDiv = document.getElementById("results");
    toggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-theme", toggle.checked);
        setTheme();
        getTheme();
    });
}

// init
main();
renderFavorites();
getTheme();
