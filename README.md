# فارسیار — FarsiYar v2

A Kurdish Sorani (ckb, RTL) first, Iranian Persian language-learning web app. Mobile-first, no dependencies, no paid AI provider. Built from the original FarsiYar project source, upgraded October 2026.

## What changed in v2

- **23 sequential lessons and 247 vocabulary/phrase entries** covering introductions, numbers, food, time, home, work, travel, taxi, markets, currency exchange, feelings, health, past and future tense and more.
- **18 formal-to-short colloquial pairs**, with Persian spelling, approximated Sorani-script reading and Sorani meaning on both variants. See **قسەی کورت** in the navigation.
- **80% mastery gate**: the next lesson is inaccessible until the current lesson's quiz achieves >=80%. Locking is enforced in lesson views, practice/quiz handlers and direct hash navigation, and restored from local storage.
- **Mistake notebook**: words answered incorrectly are collected for revision; correctly answering them in a later quiz removes them.
- Incorrect answers have feedback, quizzes may be retried without limit; learning progress persists across reloads and old v1 quiz scores migrate safely.
- Persists settings, known vocabulary, learning days, mistakes, highest scores and passed lessons in localStorage. Optional JSON backup and restore are on Progress.
- Kurdish reading hints are toggleable. Persian speech plays only if the device/browser has a fa language voice. Fully functional offline lessons after the service worker precaches assets on HTTPS/localhost.

## Run locally

No install is necessary:

```bash
cd FarsiYar
python3 -m http.server 8080 --directory public
```

Open http://localhost:8080/ in a browser. Service worker requires HTTPS or localhost.

## Run tests

```bash
npm run check
npm test
```

The Node standard-library tests validate data, migration, quiz pass/lock, direct deep link locks, duplicate answer protections, offline cache and pages. In this delivery **13 tests pass**. Browser-level visual testing has not been completed in this environment.

## Deploy on Cloudflare Pages (free)

Option A: Upload `FarsiYar-Cloudflare-Pages-v2.zip` via Cloudflare Pages direct upload (or drag-and-drop its extracted contents). Its root has `index.html`, CSS, JavaScript, assets and `sw.js`.

Option B: Import this entire project in a repository; configure Cloudflare Pages build command **none** and output directory `public`.

**Important:** The zip is not an automatic update to a separately hosted ChatGPT Site at `farsiyar.windyocean5.chatgpt.site`. That Site must be edited/redeployed using the Site/Work editor if you want to retain its URL. Hosting via Cloudflare Pages produces a separate URL until you connect a custom domain.

## Honest limits

There is no AI conversation backend, automatic speech scoring, or freeform Persian correction. Browser-based speechSynthesis might not offer a Persian voice, including on some iOS versions, and may require network resources. Sorani-script pronunciations are approximate aids, not accurate IPA transcription. Lesson unlocking is client-side and therefore educational rather than tamperproof/exam-grade.
