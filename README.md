# D + K: Our First Year

A six-stage, Pokemon-style pixel adventure through our first year together.
Walk around each memory, check out everything marked with a sparkle, then head for the exit.

## Play locally
Open `index.html` in a browser. No install or build step needed.
(Photos load from the `images/` folder, so keep the folder next to `index.html`.)

## Edit the story
All the words (dialog, captions, souvenirs, buttons) live in `story.js`. Open it, change the text inside the quotes, save, and refresh. Photo file paths are at the top of that file too.
Maps, characters, and objects for each stage are in `game.js` (functions `nortons()`, `golf()`, `margaritas()`, `birthday()`, `coloring()`, `trunk()`).

## Host on GitHub Pages
1. Create a repository and upload `index.html`, `style.css`, `story.js`, `game.js`, and the `images/` folder to the root.
2. Go to Settings, then Pages.
3. Set Source to "Deploy from a branch", pick `main` and `/ (root)`, and save.
4. In a minute or two it's live at `https://<your-username>.github.io/<repo-name>/`.
