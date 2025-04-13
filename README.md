# NoteFlow

This is a NextJS starter in Firebase Studio, configured as a Chrome extension.

To get started:

1.  Run `npm install` to install dependencies.
2.  Run `npm run build` to build the Next.js application.
3.  Run `npm run build:extension` to build the Chrome extension. This will:
    *   Build the Next.js app into the `out` directory.
    *   Copy static assets (like icons) from the `public` directory to the `out` directory.
    *   Create a `noteflow.zip` file containing the necessary extension files.
4.  In Chrome, go to `chrome://extensions/`.
5.  Enable "Developer mode" in the top right corner.
6.  Click "Load unpacked" and select the `out` directory in your project.

Now the extension should be installed and active in your Chrome browser.
