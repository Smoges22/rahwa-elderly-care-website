# Rahwa Elderly Care Website

Static premium AFH website for Rahwa Elderly Care in Auburn, Washington.

## Pages

- Home
- About
- Services
- Gallery
- Schedule Tour
- Contact
- Privacy Policy
- Terms

## Local Preview

Run a simple static server from this folder:

```powershell
node local-server.cjs
```

Then open the local URL printed in the terminal.

## Google Sheet Form Endpoint

Form submissions are configured in `assets/js/site.js`.

```js
const GOOGLE_SCRIPT_URL = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

Replace that placeholder with the deployed Google Apps Script Web App URL when the Google Sheet lead capture endpoint is ready. Until then, forms show a local preview success message.

## Deployment Notes

- Production domain is `rahwaelderlycare.com`, so canonical links, `robots.txt`, and `sitemap.xml` use absolute production URLs.
- `vercel.json`, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, and favicon assets are included for deployment.
- Forms use the Google Apps Script placeholder and local preview fallback only.
