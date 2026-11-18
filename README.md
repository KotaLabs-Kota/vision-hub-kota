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

## Add the store video to the pull request

1. Commit the video on the PR branch at **`public/reels/vision-hub-kota.mp4`**. A GitHub PR comment attachment alone will not add the file to the site.
2. Use a compressed H.264 MP4 (AAC if it has audio), preferably vertical 9:16. Keep the file small enough to upload to GitHub and serve to mobile visitors.
3. Optionally add **`public/reels/vision-hub-kota.vtt`** for English captions. Rebuild the site to include the new media.

Before a clip is added, the reel cover links directly to [@visionhub.kota](https://www.instagram.com/visionhub.kota/reels/). Once the file is present, the same section renders a native player with controls, muted by default. Additional `.mp4` or `.webm` files in `public/reels/` get numbered selection controls and are sorted by filename after the featured clip. Use descriptive filenames and an optional `.vtt` file with the same basename for each clip.

## Business information and imagery

- [Yappe](https://yappe.in/rajasthan/kota/vision-hub-best-optical-store-in-kota/1393564) and [Top-Rated](https://www.top-rated.online/cities/Kota/place/p/8948063/VISION+HUB-+Best+optical+store+in+kota) list the Talwandi location, phone number and eyewear services. The linked review excerpts are from the Yappe listing.
- [Justdial](https://www.justdial.com/Kota-Rajasthan/Vision-Hub-Talwandi/9999PX744-X744-190517174002-V8L9_BZDET) lists Opera Road and the displayed 4.8 rating. Published opening hours differ across sources, so the site asks visitors to call instead of showing a fixed schedule.
- The campaign, frame, eye-care and reel-cover images are generated illustrations. They are not photos of the store, its staff, or current stock. The location illustration is not to scale and opens Google Maps directions.
