# MedRemind website

Seven standalone HTML pages based on the seven desktop screens on Page 1 of the supplied [Figma file](https://www.figma.com/design/MZWAhIyj5thvsIraM8q6nQ/Untitled?node-id=69-7501).

## Folder structure

```text
medremind-website/
├── index.html                         Main page: Today
├── global.css                         Styles shared across all pages
├── global.js                          Optional demonstration interactions
├── README.md
├── 01-today/
│   ├── style.css                      CSS for the root index.html
│   └── assets/                        Local SVG illustrations
├── 02-my-medicines/
│   ├── index.html
│   └── style.css
├── 03-add-medicine/
│   ├── index.html
│   └── style.css
├── 04-appointments/
│   ├── index.html
│   └── style.css
├── 05-health-history/
│   ├── index.html
│   └── style.css
├── 06-profile-accessibility/
│   ├── index.html
│   └── style.css
└── 07-emergency-help/
    ├── index.html
    └── style.css
```

There are seven HTML pages in total. The first page's HTML is in the root, so `01-today` contains its CSS and shared image assets. The other six folders each contain their own HTML and CSS.

## Open the site

Open `index.html` in a browser. All pages, links, styles and images use relative paths. No framework, installation, build step or internet connection is required.

To use a local server, run this command inside `medremind-website`:

```bash
python3 -m http.server 8787
```

Then open `http://localhost:8787`.

## CSS organization

Every page loads `global.css` first, then its own `style.css`. The root page loads `01-today/style.css`; nested pages load `../global.css` and their local `style.css`.

Change shared colors, typography, navigation, cards, buttons, inputs, focus styles and print styles in `global.css`. Change a page's grid, spacing and responsive layout in that page's `style.css`. The base palette is dark. Print styles use a light background.

## Demonstration controls

`global.js` adds dose progress, medicine form validation and saving, report preview dialogs, accessibility preferences, and a downloadable medicine list. Saved records and preferences stay in this browser's local storage. The pages remain readable and navigable without JavaScript.

Reminder controls save preferences only. They do not schedule notifications or sounds. Report previews contain demonstration text. Telephone links use the numbers displayed in Figma; Anna Brooks's number is fictional. There is no backend or account service. Added medicine records appear in My medicines and the emergency medicine list; Today's three sample doses stay fixed to match the design.

To reset this demonstration, remove only the `medremind-website-demo-v1` local storage entry through your browser's developer tools and reload.

## Design references and limitations

The seven screens were inspected directly in the Figma editor. The HTML preserves their content, navigation, dark navy and mint palette, card arrangement, and desktop proportions. Smaller-screen layouts are an adaptation because the requested Page 1 contains desktop screens.

The Figma connector reported that the account's Starter tool allowance was exhausted. Structured design context, exact font specifications, and original asset exports could not be retrieved. The local SVG illustrations and line icons are recreated approximations, not Figma exports. Typography uses Arial with system fallbacks. This implementation is therefore not an exact pixel-for-pixel export.

## Validation

All seven pages were inspected in the browser at a 1440px desktop width. Layout and image-loading checks passed for all seven at 390px, with additional 320px checks on Today, Add medicine, Profile and Emergency help. The emergency medicine table scrolls inside its own container on small screens.

Dose progress, required form fields, medicine saving and navigation, persisted text size and contrast, and report dialog opening, Escape dismissal and focus return were checked. All local file references exist, every page has one main heading, and page IDs are unique. JavaScript syntax validation passed.
