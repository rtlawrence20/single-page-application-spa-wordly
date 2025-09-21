const STORAGE_KEY = "wordly_favorites";
let favorites = [];
const toggle = document.getElementById("theme-toggle");

/**
 * Loads the favorites array from localStorage.
 * If no favorites exist, initializes an empty array.
 * @returns {string[]} - favorites array.
 */
function loadFavorites() {
    favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return [...favorites];
}

/**
 * Saves the current favorites array to localStorage.
 */
function saveFavorites() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * Retrieves a copy of the current favorites array.
 * @returns {string[]} - the favorites array.
 */
function getFavorites() {
    return [...favorites];
}

/**
 * Adds word to the favorites array if not already included.
 * Automatically saves the updated array to localStorage.
 * @param {string} word - The word to add to favorites.
 */
function addFavorite(word) {
    if (!favorites.includes(word)) {
        favorites.push(word);
        saveFavorites();
    }
}

/**
 * Removes word from favorites array.
 * Saves update to localStorage.
 * @param {string} word - The word to remove
 */
function removeFavorite(word) {
    favorites = favorites.filter(w => w !== word);
    saveFavorites();
}
loadFavorites();

function setTheme() {
    localStorage.setItem("theme", toggle.checked ? "dark" : "light");
}

/**
 * Gets state of theme and sets all relevant variables to theme
 */
function getTheme() {
    const resultsDiv = document.getElementById("results");
    const btn = document.getElementById("btnAudio");

    document.body.classList.toggle("dark-theme", isDark());
    if (resultsDiv) resultsDiv.classList.toggle("dark-theme", isDark());
    toggle.checked = isDark();

    // Update button class dynamically for Bootstrap dark/light
    if (btn) {
        btn.classList.remove("btn-outline-secondary", "btn-primary"); // Remove old classes
        btn.classList.add(isDark() ? "btn-primary" : "btn-outline-secondary"); // Add the appropriate class
    }
}

/**
 * Helper to grab current theme from local storage
 * @returns 
 */
function isDark() {
    return localStorage.getItem("theme") === "dark";
}

export { getFavorites, addFavorite, removeFavorite, loadFavorites, setTheme, getTheme, isDark };
