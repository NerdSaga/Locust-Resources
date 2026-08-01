# Locust v2 Sacramento Volunteer Help Center

A dependency-free FAQ site for GitHub Pages, built with HTML, CSS, and JavaScript.

## Add or edit FAQs

Edit `data/faqs.json`. Each FAQ can include a question, answer, keyword list, guide URL, link label, `importance`, and `order`. Importance uses a 1–5 scale, with 5 shown first. The `order` number breaks ties between FAQs with the same importance. Keywords can be short terms or phrases that a volunteer is likely to search.

## Configure contact support

Support contact details and daily operating hours are stored in `data/contact_persons.json`. The configured Google Voice number is `(916) 545-5875`; the email is stored as numeric HTML entities and decoded by the site scripts when creating email links.

The published site loads this JSON file. Direct `file://` previews use `data/contact-persons-fallback.js` because browsers block local JSON requests, so update that fallback too when testing real contact information without a local web server.

## Add the videos

Place the MP4 files listed in `videos/README.md` inside the `videos` folder. The homepage and FAQ guide pages already point to those filenames.

## Preview locally

Open `index.html` directly or run any simple static file server from this folder. A small JavaScript fallback supports direct `file://` previews; the published site loads the full FAQ index from JSON.

## Publish on GitHub Pages

Push the folder to a GitHub repository, then open **Settings → Pages** and publish from the repository branch containing `index.html`.

## Before publishing

- Replace the starter instruction text with the confirmed app workflow.
- Add your real support contact to `faq/contact-support.html`.
- Confirm the App Store and Google Play listing links in the homepage download card.
- Add the Locust web app link to `faq/use-locust-on-web.html`.
- Test every video with captions. Add a `<track kind="captions">` file for each video when captions are ready.
- Confirm the app and organization names throughout the site.
