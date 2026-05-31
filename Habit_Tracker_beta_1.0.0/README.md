# Habit Tracker (Beta)

> Free to use and share, download, open in browser, use `install page as app` from the browser. Done!
> Works in both mobile and pc.

A lightweight, offline, web-based habit tracker designed for speed and simplicity. Open `index.html` in your browser to run the app — no server or internet connection required.

**Characteristics**

- Offline: Runs entirely in the browser and stores data locally.
- Web-based: Single-page app using the included `index.html`, `index.js`, and `index.css` files.
- Fast: Minimal code and assets for quick startup and snappy interactions.
- Open Source: Intended to be released under the MIT license and easy to extend.

**Functionalities (Beta)**

- Create and manage habits: add new habits you want to track.
- Grouping: organize habits into groups for better structure.
- Track completions: mark habits as completed for a day/session.
- Edit and remove: modify or delete habits and groups as needed.
- Export / Import: backup your data (habits, groups, and settings) to a JSON file and restore it later using the header buttons.

**User Guide**

- Open the app: double-click or open [index.html](index.html) in a modern browser (Chrome, Firefox, Edge).
- Add a habit: use the app's "Add" or "+" control to create a new habit. Provide a name and optionally assign it to a group.
- Create groups: use the group controls to add logical categories (e.g., Health, Work, Study).
- Mark completion: click or tap the completion checkbox/button for the habit to mark it as done for the current day or session.
- Edit / Delete: use the habit's action menu or edit controls to rename or remove a habit.
- Backup data: click the "Export" button in the header to download a JSON file containing your habits, groups, and settings.
- Restore data: click the "Import" button and select a previously exported JSON file to restore your data.

**What to Expect (Beta)**

- Minimal UI and features: this release focuses on core tracking and portability.
- No cloud sync: data stays on your device unless you export and move it manually.
- Limited customization and filtering: search, advanced filters, and themes may be added in future releases.
- Small compatibility surface: works best in modern desktop and mobile browsers.

**Planned Improvements**

- Enhanced search and filtering for large habit sets.
- More customization (colors, recurrence rules, notifications).
- Optionally migrate to a modern stack (React + Tailwind) for easier extensions.

**Troubleshooting**

- Nothing shows when opening `index.html`: try a different browser or check the developer console for errors.
- Export/Import fails: ensure the JSON file is the one previously exported by this app and not altered.
- Data disappeared: confirm you are not in a private/incognito window and check browser storage settings.

**Contributing**

- This is a small, open project — pull requests and issue reports are welcome. Please keep changes focused and test in a few browsers.

**License**

MIT. See the project files for the final license text when available.

