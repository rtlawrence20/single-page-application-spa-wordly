import fs from "fs";
import path from "path";
import { showError, clearUI, renderWord, renderAudio, renderFavorites } from "../ui.js";
import * as storage from "../storage.js";

// Mock storage functions
jest.mock("../storage.js", () => ({
    getFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn()
}));

beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
    document.body.innerHTML = html;
    jest.clearAllMocks();
});

describe("UI functions", () => {

    test("showError displays the error message", () => {
        showError("Test error");
        const errorDiv = document.getElementById("error-message");
        expect(errorDiv).not.toBeNull();
        expect(errorDiv.textContent).toBe("Test error");
        expect(errorDiv.classList.contains("d-none")).toBe(false);
    });

    test("clearUI resets UI elements", () => {
        const resultsCard = document.getElementById("results");
        const wordTitle = document.getElementById("word-title");
        const phonetic = document.getElementById("phonetic");
        const definitionsDiv = document.getElementById("definitions");
        const synonymsDiv = document.getElementById("synonyms");
        const audioContainer = document.getElementById("audio-container");
        const errorDiv = document.getElementById("error-message");

        wordTitle.textContent = "hello";
        phonetic.textContent = "he-lo";
        definitionsDiv.innerHTML = "<p>def</p>";
        synonymsDiv.innerHTML = "<p>syn</p>";
        audioContainer.innerHTML = "<button>play</button>";
        errorDiv.classList.remove("d-none");

        clearUI();

        expect(wordTitle.textContent).toBe("");
        expect(phonetic.textContent).toBe("");
        expect(definitionsDiv.innerHTML).toBe("");
        expect(synonymsDiv.innerHTML).toBe("");
        expect(audioContainer.innerHTML).toBe("");
        expect(errorDiv.classList.contains("d-none")).toBe(true);
    });

    test("renderWord displays word data correctly", () => {
        const wordData = {
            word: "apple",
            phonetic: "ˈæp.əl",
            phonetics: [{ audio: "" }],
            meanings: [
                {
                    partOfSpeech: "noun",
                    definitions: [{ definition: "A fruit", example: "I ate an apple." }],
                    synonyms: ["fruit"]
                }
            ]
        };

        renderWord(wordData);

        const wordTitle = document.getElementById("word-title");
        const phonetic = document.getElementById("phonetic");
        const definitionsDiv = document.getElementById("definitions");
        const synonymsDiv = document.getElementById("synonyms");
        const resultsCard = document.getElementById("results");

        expect(wordTitle.textContent).toBe("apple");
        expect(phonetic.textContent).toBe("ˈæp.əl");
        expect(definitionsDiv.innerHTML).toContain("A fruit");
        expect(definitionsDiv.innerHTML).toContain("I ate an apple.");
        expect(synonymsDiv.innerHTML).toContain("fruit");
        expect(resultsCard.classList.contains("d-none")).toBe(false);
    });

    test("renderAudio adds a play button", () => {
        const audioContainer = document.getElementById("audio-container");
        const phonetics = [{ audio: "https://example.com/audio.mp3" }];

        renderAudio(phonetics);

        const btn = audioContainer.querySelector("button");
        expect(btn).not.toBeNull();
        expect(btn.textContent).toBe("Play Pronunciation");
    });

    test("renderFavorites displays saved words", () => {
        const favoriteWords = ["apple", "banana"];
        storage.getFavorites.mockReturnValue(favoriteWords);

        renderFavorites();

        const container = document.getElementById("saved-words");
        expect(container).not.toBeNull();
        favoriteWords.forEach(word => {
            expect(container.innerHTML).toContain(word);
        });

        const removeButtons = container.querySelectorAll("button");
        expect(removeButtons.length).toBe(favoriteWords.length);
    });
});
