# Form Integration

The Contact and Schedule Tour forms use `{{FORM_ENDPOINT}}`.

## Formspree

1. Create a Formspree form.
2. Copy the endpoint URL.
3. Replace `{{FORM_ENDPOINT}}` in `contact/index.html` and `schedule-tour/index.html`.
4. Test both forms.

The included JavaScript improves Formspree submissions with `fetch` and falls back to normal form submission if needed.

## Google Apps Script

Use the AFH Automation Engine web app URL as `{{FORM_ENDPOINT}}`.

Recommended hidden fields:

- `leadType`
- `websitePage`

The starter already includes those fields.

For Apps Script JSON endpoints, adapt `assets/js/site.js` or use a custom submit handler that posts JSON to the web app.
