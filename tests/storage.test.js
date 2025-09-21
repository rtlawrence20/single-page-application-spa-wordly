import { addFavorite, getFavorites, removeFavorite, loadFavorites } from "../storage.js";

beforeEach(() => {
    localStorage.clear();
    loadFavorites(); // reset state
});

test("adds a word to favorites", () => {
    addFavorite("testword");
    expect(getFavorites()).toContain("testword");
});

test("removes a word from favorites", () => {
    addFavorite("hello");
    removeFavorite("hello");
    expect(getFavorites()).not.toContain("hello");
});

test("does not add duplicates", () => {
    addFavorite("repeat");
    addFavorite("repeat");
    expect(getFavorites()).toEqual(["repeat"]);
});
