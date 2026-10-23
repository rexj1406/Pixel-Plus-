# PixelPulse — Image Explorer

A responsive image-search app built with plain HTML, CSS, and JavaScript. It uses the Wikimedia Commons API and includes loading, empty, and error states.

## Run locally
1. Download or extract the project.
2. Open `index.html` in a browser.
3. Search for a topic such as `cats`, `nature`, or `architecture`.

If your browser restricts requests from local files, run a simple local server from this folder:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

## Features
- Loading indicator while searching
- Friendly empty and error messages
- Result count and animated result cards
- Responsive mobile layout
- Wikimedia Commons source links

## Deploy with GitHub Pages
1. Add these files to your existing public Part 1/2 repository (keep your own project and design where required by the assignment).
2. Commit and push the changes to your assignment branch.
3. In GitHub, open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**, select `main` (or the branch required by your course) and `/ (root)`, then save.
5. Wait for GitHub Pages to publish, then open the live URL shown in Settings → Pages.

## Assignment reminder
For Kalvium Part 3, continue in the same public repository from Parts 1 and 2, use a new branch such as `part-3-polish-deploy`, and open a pull request into `main`. Include both your repository URL and your live URL in the pull request description. Submit the pull request URL to Kalvium.
