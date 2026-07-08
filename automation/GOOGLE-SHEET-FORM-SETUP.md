# Rahwa Elderly Care Google Sheet Form Setup

This setup connects the Rahwa Elderly Care website Contact and Schedule Tour forms to a Google Sheet through a Google Apps Script Web App.

## Google Sheet

Create a Google Sheet named:

`Rahwa Elderly Care Website Leads`

Recommended tabs:

- `Website Leads`
- `Email Log`
- `Settings`

## Website Leads Columns

Create the `Website Leads` tab with these columns in row 1:

1. Timestamp
2. Form Type
3. Source Page
4. Full Name
5. Phone
6. Email
7. Relationship to Resident
8. Care Timeline
9. Preferred Tour Date
10. Preferred Tour Time
11. Resident Care Needs
12. Message
13. Page URL
14. User Agent
15. Status
16. Notes

## Apps Script Setup

1. Open the Google Sheet.
2. Go to `Extensions` > `Apps Script`.
3. Create or replace the script code with:

   `automation/google-apps-script/rahwa-website-leads.gs`

4. Save the Apps Script project.
5. Run `setupRahwaWebsiteLeadSheet` once from the Apps Script editor to create or verify the recommended tabs and headers.
6. Deploy as a Web App:
   - Click `Deploy` > `New deployment`.
   - Select type: `Web app`.
   - Execute as: `Me`.
   - Who has access: `Anyone`.
   - Click `Deploy`.
7. Copy the Web App URL.

## Website Integration

Open:

`assets/js/site.js`

Replace:

```js
const GOOGLE_SCRIPT_URL = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

With the deployed Apps Script Web App URL:

```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

Do not use Formspree.

## Form Payload Mapping

The website sends normalized fields for both forms.

Contact form:

- `formType`: `Contact`
- `fullName`
- `phone`
- `email`
- `relationshipToResident`
- `careTimeline`
- `message`
- `sourcePage`
- `pageUrl`
- `userAgent`

Schedule Tour form:

- `formType`: `Schedule Tour`
- `fullName`
- `phone`
- `email`
- `preferredTourDate`
- `preferredTourTime`
- `residentCareNeeds`
- `message`
- `sourcePage`
- `pageUrl`
- `userAgent`

## Spam Control

The Apps Script includes basic protection:

- Rejects empty submissions.
- Requires full name and either phone or email.
- Supports honeypot fields named `company`, `website`, `hp`, or `honeypot` if a hidden field is added later.
- Does not expose secrets in frontend code.
- Returns JSON for success and error responses.

## QA Checklist

Before adding the Web App URL:

- Contact form validation works.
- Schedule Tour form validation works.
- Placeholder/fallback success message still appears locally.
- Forms do not clear before validation passes.

After adding the Web App URL:

- Submit one Contact test.
- Submit one Schedule Tour test.
- Confirm both rows appear in `Website Leads`.
- Confirm Rahwa receives the email notification at `rahwaelderlycare@gmail.com`.
- Confirm the website shows the success message.
- Confirm no console errors.

## Current Status

As of this setup file, the website is still using the placeholder Apps Script URL. Paste the deployed Web App URL into `assets/js/site.js` after the Google Apps Script deployment is created.
