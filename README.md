# Shop Name website

Static site, no build step. Open `index.html` in a browser or upload the folder to any host.

    index.html  range.html  sourcing.html  journey.html
    about.html  enquiry.html  feedback.html  contact.html
    css/styles.css   js/script.js   images/placeholder.svg

## Replace the placeholders

Header, footer and nav are repeated in every page, so use find and replace across the whole folder (VS Code: Ctrl+Shift+H).

| Search for | Replace with |
|---|---|
| `Shop Name` | your shop name |
| `Tagline goes here` | your tagline |
| `19XX`, `YYYY`, `XX years`, `Founder Name`, `City`, `State` | real history and location |
| `+91 98765 43210`, `+919876543210`, `919876543210` | your phone / WhatsApp (wa.me needs country code, no + or spaces) |
| `info@shopname.example`, `enquiry@shopname.example` | your emails (also in `js/script.js`) |
| `Shop No. 00, Market Road` | your address |
| `facebook.com/yourshop`, `instagram.com/yourshop` | your profile URLs |
| `YOUR_FORM_ID`, `YOUR_FORM_LINK` | Google Form ids (see below) |

## Products and images

Products live in the `CATALOG` object at the top of `js/script.js`. Prices are plain numbers (no commas). To use real photos, add a third value per product and put it in the `img src` in `initRange()`, or just edit `images/placeholder.svg`.

## Enquiry form

Default is `mailto:` to `CONFIG.enquiryEmail`. It opens the visitor's mail app with the details filled in, so it fails if they have no mail client set up.

For real delivery to your inbox, make a free form at formspree.io, copy the endpoint URL and paste it into `CONFIG.formspreeUrl` in `js/script.js`. The form then posts in the background and shows a confirmation.

## Feedback form

1. Create a form at forms.google.com.
2. Send, then the embed tab. Copy the `src` value from the iframe code.
3. Paste it over the `src` in `feedback.html`. Put the short share link in the fallback link below it.

## Map

In `contact.html` change `q=Market+Road,+City` to your address with `+` between words. For an exact pin use Google Maps, Share, Embed a map, and paste that `src` instead.

## Deploy

Netlify: drag the folder onto app.netlify.com/drop. GitHub Pages: push to a repo and enable Pages on the main branch.
