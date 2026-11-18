# Vision Hub Kota

A static Astro storefront for the optician in Talwandi, Kota. The site includes a browsable frame edit, a locally saved shortlist, eye-test information, studio directions and an Instagram reel section. There is no checkout or online appointment system; visitors can call the studio to ask about availability.

## Run locally

Use Node.js 24.

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
```

`npm run build` produces `dist/`. The repository can be imported into Vercel with the Astro preset; no environment variables, external APIs or database are needed.

## Upload reels to an open pull request

On the PR's **head branch** in GitHub, open `public/reels/`, choose **Add file → Upload files**, and commit directly to that branch. An attachment in a PR comment alone does not add the clip to the build.

- **One reel:** `public/reels/vision-hub-kota.mp4` will be featured first and titled “Inside Vision Hub”.
- **A playlist:** Add files such as `01-look-inside.mp4`, `02-frame-try-on.mp4`, and `03-frames-up-close.mp4` to the same folder. The numbers determine the order; displayed titles are inferred from the filenames.
- **Format:** A compressed vertical 9:16 H.264 MP4 (AAC if it has audio) is recommended. WebM is also supported. Keep each file under GitHub's 25 MiB browser-upload limit and small enough for mobile visitors.
- **Optional cover and captions:** For `02-frame-try-on.mp4`, upload `02-frame-try-on.webp` (or `.jpg`, `.jpeg`, or `.png`) to use it as the list thumbnail and player poster. Add `02-frame-try-on.vtt` for English captions.
- **Optional label and length:** To show a specific title or a duration before its metadata loads, add `public/reels/reels.json` with entries keyed by exact video filename. For example:

  ```json
  {
    "02-frame-try-on.mp4": { "title": "A frame try-on", "durationSeconds": 29 }
  }
  ```

The next build picks up the files automatically. Selecting a clip in the list plays it muted in the vertical player; visitors can turn on sound with the player controls. Without uploaded clips, the cover and social link open [@visionhub.kota](https://www.instagram.com/visionhub.kota/reels/) instead.

## Business information and imagery

- [Yappe](https://yappe.in/rajasthan/kota/vision-hub-best-optical-store-in-kota/1393564) and [Top-Rated](https://www.top-rated.online/cities/Kota/place/p/8948063/VISION+HUB-+Best+optical+store+in+kota) list the Talwandi location, phone number and eyewear services. The linked review excerpts are from the Yappe listing.
- [Justdial](https://www.justdial.com/Kota-Rajasthan/Vision-Hub-Talwandi/9999PX744-X744-190517174002-V8L9_BZDET) lists Opera Road and the displayed 4.8 rating. Published opening hours differ across sources, so the site asks visitors to call instead of showing a fixed schedule.
- The campaign, frame and eye-care artwork and the Instagram fallback cover are generated illustrations, not photos of the store or current stock. The on-site reel posters are stills from the uploaded shop videos. The location illustration is not to scale and opens Google Maps directions.
