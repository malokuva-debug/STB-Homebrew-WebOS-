# STB Player for webOS

Stalker / Ministra portal player for LG webOS (rooted, Homebrew). Needs only a portal URL and MAC address. Includes buffer profiles, live-edge snapping, stall watchdog and device identity settings. Bring your own portal; no content is provided.

## Release
1. Push this repo to GitHub.
2. `git tag v1.0.0 && git push --tags` (or run **Build IPK** from the Actions tab).
3. The release gets the `.ipk` and `com.ny0.stbplayer.manifest.json`.

## Install on a rooted TV
    wget -O /tmp/stb.ipk <release .ipk URL>
    luna-send -f -n 1 luna://com.webos.appInstallService/dev/install '{"id":"com.ny0.stbplayer","ipkUrl":"/tmp/stb.ipk","subscribe":true}'

If the proxy does not auto-start:
    node /media/developer/apps/usr/palm/services/com.ny0.stbplayer.service/service.js --standalone &

## Homebrew Channel listing
Fork `webosbrew/apps-repo`, copy `packages/com.ny0.stbplayer.yml` into its `packages/` folder, replace `OWNER/REPO`, open a pull request. Their rules allow only legal IPTV services.
