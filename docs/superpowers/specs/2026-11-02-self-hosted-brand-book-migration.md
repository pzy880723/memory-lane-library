# Self-hosted brand book migration: investigated design

Status: public domain cut over on 2026-11-02 at 18:15 CST. https://book.boomeroff.com/api/book/health returns backend selfhosted, 39 pages, and X-Book-Backend: 101-selfhosted. Production image is boomer-book:20261102-r2. Final export acceptance is recorded below.

## Verified pre-migration state

- Public domain: https://book.boomeroff.com, Nginx site rooted at /var/www/memory-lane on the existing Tencent host.
- Existing UI: React/TypeScript; content editing, image replacement, PDF/PPTX download. Four-store changes are locally implemented and not yet published; 39 pages.
- Runtime dependencies: Lovable Cloud content_overrides, export_cache, editor-images bucket, exports bucket, render-slide function, Browserless screenshot service.
- Full content JSON has been exported locally (about 4.75MB), with existing edited indices 2,4,7,8,12,15,18,19,20,21,27,31. Seven remote images are currently referenced and one image is embedded in JSON.
- Storage inventory: 8 editor images, 28,310,784 bytes; 5 historical exports, 78,067,806 bytes. All 13 objects have been downloaded into a local archive, reconciled against recorded sizes and re-read to verify SHA-256. Total archived object bytes: 106,378,590. The original formal website is also archived locally (44 tar entries).
- Corrected server inventory: the current Tencent account has two running Shanghai instances, verified through all available CVM regions (20) and Lighthouse regions (16), with no API errors. 150.158.94.248 is Lighthouse lhins-ogmfuc6m, 4 CPU / 8GiB RAM / 180GiB system disk. 101.34.236.101 is CVM ins-80dysqg5, 8 CPU / 32GiB RAM / 100GiB system disk plus a 500GiB CLOUD_HSSD disk, disk-pppt4801.
- The earlier capacity blocker was incorrect for the migration destination: it inspected only the 150 source host. A fresh SSH read on 101 confirms /dev/vdb is mounted read-write as XFS at /srv/boomer-data, 500G total / 145G used / 356G available; root has about 93G available. The cleaning/expansion question is withdrawn. After the user selected journal maintenance separately, 97 rotated journals were archived locally and individually hash-verified before reducing journal retention to 500MiB (483.6MiB measured). No disks were expanded. The book domain alone was subsequently switched to 101.
- The 150 source has Node v22.22.2, Python 3.12.3 and Google Chrome installed. Runtime availability on the 101 destination must be checked separately; do not treat the two hosts as interchangeable.

## Recommended architecture

Use the 101 destination and its independent /srv/boomer-data disk, with a dedicated same-origin backend service under /api/book and dedicated persistent data folders outside release directories. The site continues on book.boomeroff.com through its existing 150 ingress, routing only this project's candidate service to 101 after validation. Nginx serves immutable images and generated files; the backend handles authenticated editing, atomic content writes, export jobs and progress. Verify Chrome on 101 and use destination-local screenshots. Keep current PDF/PPTX packaging libraries and rendering dimensions. Preserve the existing 101 ingress, private recovery-domain access rules and current ERP media dependencies documented in /Users/boomer/Documents/Codex/2026-11-01/task/docs/superpowers/plans/2026-11-02-production-services-to-101.md.

For this single-document application, atomic JSON content storage with version snapshots and deterministic export-cache files is sufficient. A small SQLite database is a valid alternative if the implementation needs transactional revision/job tracking. Do not introduce a full self-hosted Supabase stack solely to preserve two small tables. Decide the smallest reliable persistence implementation after the available disk and service constraints are resolved.

The editor password is verified by the server, with a secure HTTP-only cookie session; no editing password or privileged storage token remains in the public frontend. Preserve the owner's existing access without asking them to publish a password in chat. Public visitors can read the book and download generated files. Only the authenticated editor can change content or upload replacements.

## Migration procedure

1. Finish the read-only local backup: content JSON, both table exports, all 13 storage objects, object paths, MIME metadata and hashes; verify every image reference resolves from the archive.
2. Use the existing 101 data disk; refresh free-space and ingress evidence before deployment. The disk currently has about 356GiB free. Keep separate candidate, rollback, persistent state and export-cache paths; do not delete other projects' backups, recovery environments or logs.
3. Implement an isolated candidate backend and frontend using same-origin /api/book. Preserve current cloud overrides and map legacy remote image URLs to new server-hosted URLs. Externalize the embedded image without altering its pixels.
4. Restore all history and image files into the candidate's persistent data directory. Generate a manifest comparing record counts, reference counts, sizes and SHA-256 before and after restore. Preserve the original backup unchanged.
5. Test public reading, password-gated editing, uploading/replacing/restoring a photo, refresh persistence, failed-save/retry, text editing, edit undo/redo and keyboard navigation.
6. Test local Chrome screenshot readiness, sequential rendering and retry counts. Generate complete 39-page PDF and PPTX, inspect new store pages and verify both page counts; verify a repeat download uses the current cached version.
7. Run candidate with outgoing access to old Lovable/Supabase/Browserless endpoints blocked. Verify the same reading/editing/upload/download flow and absence of old-domain browser requests. Host required rendering fonts locally so screenshot generation does not depend on external font delivery.
8. Back up the current Nginx config and formal site, deploy to a separate release directory, switch only the book domain, and verify the public domain. Keep a tested rollback route and the original archive. Do not remove the old cloud project as part of cutover.

## Acceptance

- [x] Four confirmed stores appear, with accurate photo attribution and owner-controlled replacement.
- [x] Unauthorized write/upload requests are rejected; the owner's existing access works through server verification.
- [x] Save and refresh preserve the same text/image overrides, with visible failure/retry status.
- [x] All existing content and all uploaded images/historical exports are reconciled against the backup.
- [x] Both complete 39-page exports download, with existing render progress and retry feedback.
- [x] Reading, editing, photo upload and new export generation work while old service domains are blocked.
- [x] The public domain uses the new backend; service restart preserves data; rollback has been checked.

## Scope boundaries

The exported PPTX currently contains rendered slide images, not native editable PowerPoint text/image elements. Migration preserves that format. Self-service text and photo editing remains in the website. Adding a native editable PowerPoint authoring engine, modifying ERP/GO/other sites, and deleting historical cloud/server data are outside this migration.


## Production operation and recovery

- Public ingress: 150.158.94.248, `/etc/nginx/sites-available/book.boomeroff.com`. It proxies this domain only to `https://101.34.236.101/book-runtime/`, with TLS certificate verification and SNI `migration-data.boomeroff.top`. DNS and the public certificate remain unchanged.
- Backend and all authoritative state: 101.34.236.101, `/srv/boomer-data/book/state`, on the existing 500GiB data disk. Editor credentials are salted scrypt hashes in private `config.json`; never put that file in Git. HTTP-only secure cookie sessions survive service restarts.
- Production container: `boomer-book-20261102-r2`, image `boomer-book:20261102-r2` (`a826a9b79b9d`), internal-only Docker network `boomer-book-private`, fixed `172.31.3.3:8080`. The existing staging proxy routes only `/book-runtime/` to it. Other staging/media routes and the global ingress allowlist were preserved.
- Container controls: read-only root, persistent data bind, tmpfs `/tmp`, 3GiB memory, 2 CPU, pids limit 1024, restart unless stopped. It has no public outbound network; local fonts/images and destination-local Chromium render successfully without old cloud access.
- Rebuild from repository root: `npm ci && npm run build`, then `docker build -f server/Dockerfile -t boomer-book:<release> .`. Keep persistent state outside the release. For frontend/content layout changes, update the release value in private config so export hashes change. The r2 image changes renderer readiness only, preserving the content release r1.
- The 256 PID limit denied Chromium threads during initial validation. Increasing it removed that constraint. Independently, Chromium could report `body[data-ready=1]` while navigation `networkidle0` never completed. A controlled probe with `domcontentloaded` plus the existing explicit font/image readiness completed in 0.6 seconds. Production now uses that readiness contract. All 39 pages rendered in 28.68 seconds, 27,039,338 JPEG bytes, without external service access.
- Old source watermark rechecked immediately before cutover: `2026-04-29T02:50:53.283487+00:00`, unchanged. All 14 restored objects (109,942,533 bytes) matched the migration manifest; originals and old exports remain preserved.
- UI acceptance: existing editor password works; replacing a photo and refreshing retained the new owned URL; restoring returned the original. Text editing persisted across refresh; test text was restored before cutover. Production login also passed over the public domain.
- Rollback: copy `/etc/nginx/book.boomeroff.com.before-selfhosted-20261102.conf` back to `/etc/nginx/sites-available/book.boomeroff.com`, run `sudo nginx -t`, then `sudo systemctl reload nginx`. This returns the original `/var/www/memory-lane` site. The original site archive remains local. The rollback path was exercised during cutover when the first immediate post-reload request hit an old Nginx worker; a subsequent cutover waited for the new worker and passed. Never overwrite current self-hosted state when rolling back ingress.
- Existing cloud functions/migrations in the source tree are retained as historical source only; production frontend/server do not call them. The old cloud project was not deleted.
- Deployment evidence and private backups live outside Git in `../output/book-upgrade-20261102/`.


## Final export evidence

- Content hash: `c2745c910ae7614e91433fe97c4be41e609daf04d9ded90586557e6b94a67e03`.
- PDF generated by the existing web UI: 39 pages, 27,053,029 bytes, SHA256 `e5f1cb922cf2e1d88f1f93edb6de2df06be15745d2ec52bc213961aaf60b1d53`. Parsed successfully with the installed pdf-lib 1.17.1.
- PPTX cache warmed directly on 101 using the same PptxGenJS 4.0.1, wide layout, metadata and 39 cached JPEGs as the web packer: 39 slides, 39 embedded images, 27,280,137 bytes, SHA256 `713b5517fed28af85f10b4b2ef998218014f9d3c40d305974f481765ef83ba71`. ZIP CRCs passed and all 39 media hashes exactly matched the rendered pages.
- Both files were fully read through the service HTTP download path and matched disk SHA256. Public domain cache lookup and HEAD requests returned HTTP200, correct MIME and `X-Book-Backend: 101-selfhosted` for both files.
- A complete browser PDF generation/upload was observed. The subsequent large browser download was slow on the current inter-host/public link and its temporary validation tab was closed after service-side verification. Do not describe that browser download as completed. No bandwidth setting or other project's network configuration was changed.
- The user's original localhost preview tab was navigated to `https://book.boomeroff.com/?v=20261102#slide-34` and visibly showed the four stores and page 34/39. Old cached HTML initially showed 35 pages until refreshed. The production index now sends Cache-Control: no-store.
- 新天地/美罗城 photos remain explicitly attributed brand-reference photos from the 中信泰富 store until the owner replaces them with their own real photos; no false store-photo claim was introduced.
