# Four-store brand book implementation plan

> Execute inline in this chat. The user approved the editable Figma layouts and confirmed the four stores on 2026-11-02, then required self-service image replacement.

**Goal:** Present the four confirmed stores and let the owner replace their photos through the existing password-gated editor.

**Architecture:** Keep slides 0–32 unchanged. Replace slide 33 with an overview and insert four individual store pages before the contact page. Reuse the existing editor and storage, add stable opt-in image keys only to the new store photos, and expose the existing password dialog through a visible button. Keep the export progress/retry behavior intact.

**Stack:** React, TypeScript, Tailwind, Vite, Vitest, existing Lovable Cloud storage.

## Tasks

- [ ] Record the approved design and snapshot current cloud overrides; do not write to the production database during local testing.
- [ ] Write and run a failing regression test proving that opt-in photo keys survive changes to captions, alt text, and DOM order; preserve legacy keys for existing slides.
- [ ] Add src/components/slides/StoreSlides.tsx with the confirmed four-store data, a 16:9 overview, four single-store layouts, actual CITIC/Wenzhou photos and accurately attributed reference photos for Xintiandi/Metro City. Reuse the exact brand logo and current SlideShell.
- [ ] Update registry.tsx to append the new store pages after index 33. Confirm the existing cloud-edited slides keep their original indices.
- [ ] Add a visible content-editing button to Index.tsx using the existing password gate; retain the five-click shortcut. Mark store photos with stable edit IDs; use ordinary img elements so the existing editor can select and replace them.
- [ ] Verify the existing asynchronous cloud-save status; correct premature success feedback if necessary. Write a regression test for any behavior fix before changing it.
- [ ] Run npm test, npm run build and targeted lint/type checks. Inspect desktop and phone viewports, navigate all five store pages, open the password dialog and photo panel, upload a replacement in an isolated validation backend, reload and restore the original. Confirm no replacement reaches production during validation.
- [ ] Deliver the working local preview and verified screenshots, plus exact instructions for editing. Treat production release and real cloud upload as separate acceptance surfaces; do not call the formal domain updated unless verified there.

## Accepted design

Figma: https://www.figma.com/design/aEfMid96uy6JzL7RiYXAx6

Existing standard logo, cream background, red rules, Noto Serif SC headings and Noto Sans SC body. A left-aligned store list with attributed photos; a store feature layout with a portrait photo, store name/address and a second image. Keep responsive 16:9 viewing, navigation, sharing, full-screen and exports.

## Content boundaries

The four stores are CITIC Square, Xintiandi, Metro City and Wenzhou Shuomen. Exclude 728space from store descriptions, while retaining the existing business contact address. No invented opening dates, store metrics, floor areas, stock claims, or rankings. Current copy uses factual labels; DeepSeek is unavailable and no DeepSeek call is claimed.
