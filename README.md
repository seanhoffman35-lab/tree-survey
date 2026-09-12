# Tree Survey

One-tap tree tagging for iPhone. Tap a species button and the tree's GPS position and time are recorded. Exports CSV, KML, and GeoJSON through the iOS share sheet. Everything stays on the phone until you export it.

This folder is the whole app. Put these files on any HTTPS host and open the URL in Safari.

| File | Purpose |
|---|---|
| `index.html` | The app: screens, storage, GPS, exports |
| `sw.js` | Service worker so the app opens with no signal |
| `manifest.webmanifest` | Home-screen name, icon, full-screen mode |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Icons |

## Put it online with GitHub Pages (free, about ten minutes)

Location access in a browser only works over HTTPS, so the app must be hosted. No survey data is ever in the repository; the repository only holds the app files.

1. Sign in at github.com (create a free account if needed).
2. Top right, **+** then **New repository**. Name it `tree-survey`, leave it **Public**, click **Create repository**.
3. On the empty repository page click **uploading an existing file**. Drag in all six files from this folder (not the folder itself). Click **Commit changes**.
4. Open **Settings** (repository tab) then **Pages** in the left menu. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main** and folder **/ (root)**. Click **Save**.
5. Wait a minute, then reload the Pages settings page. The URL appears at the top, in the form `https://YOUR-NAME.github.io/tree-survey/`.

## Install it on the iPhone

1. Open the URL in **Safari** (not Chrome). When asked, allow location access. Choose **Allow While Using App** and keep **Precise** on.
2. Tap the **Share** button (the square with the arrow), then **Add to Home Screen**, then **Add**.
3. Open Tree Survey from the home screen. It may ask for location once more; allow it. From now on it runs full screen and works without signal.

If location is ever blocked: iPhone **Settings → Privacy & Security → Location Services**, make sure it is on, then find **Safari Websites** (or the Tree Survey entry) and set it to **While Using** with **Precise Location** on.

## First use

1. Tap **+ Add species** at the bottom of the Record screen. Type the name, and optionally the scientific name. The code for tree labels fills in from the name (White Oak becomes WO, so trees are WO-001, WO-002, and so on).
2. Tap the **star** on a species card to pin it to the top of the list. Star your three main species.
3. Tap a species card to record a tree. The bar at the bottom shows what was recorded and the accuracy. **Undo** removes it for ten seconds. **Note** opens the note sheet, where any extra fields you have defined also appear.
4. On the **Species** tab, switch a species off to hide its button while you are not looking for it. Hidden species keep their trees and still export.
5. Under the gear icon (**Settings**), set your accuracy standard (default 10 m), turn on **Keep screen awake** for a long session, and add fields such as DBH, vigour, or crown class. Every field becomes a column in every export.

## Getting the data out

Open the **Export** tab, choose a scope, and tap a format. The share sheet opens.

- **CSV** for Google Sheets, Excel, QGIS (Layer → Add Layer → Add Delimited Text Layer), and Google My Maps import. Every row has a Google Maps link and an Apple Maps link.
- **KML** for Google Earth on a phone or computer. Pins are colored by species and grouped in folders. Each pin's balloon has a **Navigate (Google Maps)** link.
- **GeoJSON** for QGIS. Drag the file onto the map canvas.
- **Save backup** writes everything (species, fields, trees) to a JSON file. **Restore backup** loads one back. Save a backup at the end of every field day; the phone is the only copy until you do.

To hand trees to someone with only a phone: import the CSV or KML into Google My Maps on a computer, share the map link, and it shows up in their Google Maps app under **Saved → Maps**. Tapping a pin gives them directions. Google Earth on iPhone opens the KML directly from AirDrop or Messages.

## Updating the app

Edit `index.html`, then upload it again to the repository (open the file on github.com, click the pencil, or drag the new file over the old one and commit). The phone picks up the new version the next time the app is opened, or the time after that. No version number needs changing.

## Accuracy notes

An iPhone gives about 3 to 8 m under open sky and 10 to 30 m under closed canopy. Every tree stores the accuracy the phone reported. Points worse than your standard are flagged amber in the log. Open a tree in the Log and tap **Re-fix location** to replace its position with a fresh fix once you are standing at the trunk.
