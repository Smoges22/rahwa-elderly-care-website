# New Client Codex Prompt

Copy and paste this prompt into Codex when starting a new Adult Family Home client website.

```text
Build a new Adult Family Home client website using the AFH Website Starter Kit and connect it to the AFH Automation Engine.

Starter kit:
C:\Users\samue\Documents\GitHub\Website Projects\AFH Website Starter Kit

Automation engine:
C:\Users\samue\Documents\GitHub\Website Projects\AFH Automation Engine

New client project folder:
C:\Users\samue\Documents\GitHub\Website Projects\CLIENT_FOLDER_NAME_HERE

Client details:
- Business name:
- Display name:
- Tagline:
- Owner names:
- Owner bios:
- Address:
- City:
- State:
- ZIP:
- Main phone:
- Alternate phone:
- Email:
- Reply-to email:
- Website/domain:
- Form recipient email:
- Form endpoint:
- Google Map embed:
- Services:
- Care specialties:
- Logo files:
- Photo files:
- Social preview image:
- Google Business Profile access:

Tasks:

1. Copy the AFH Website Starter Kit into the new client folder.
2. Rename and configure the project for the client.
3. Update config/client-config.json with all client details.
4. Replace every placeholder token across HTML, sitemap, robots, schema, forms, and metadata.
5. Replace placeholder logo files, photos, owner portraits, and social preview image.
6. Customize the Home, About, Services, Gallery, Contact, Schedule Tour, Privacy Policy, and Terms pages.
7. Update SEO metadata, canonical URLs, Open Graph tags, JSON-LD schema, sitemap.xml, and robots.txt.
8. Connect the Contact and Schedule Tour forms using either Formspree or the AFH Automation Engine Google Apps Script web app.
9. If using AFH Automation Engine, create or configure the client Google Sheet CRM, referral agents, room availability, dry-run/test settings, and website lead capture.
10. Validate locally:
   - All pages return 200
   - No broken local links or image paths
   - Mobile hamburger works
   - Forms render and submit correctly
   - Gallery lightbox works
   - Map loads
   - Social preview loads
   - No horizontal scroll
   - No starter/client placeholder tokens remain
11. Initialize Git if needed.
12. Commit with this message:
   Build CLIENT_DISPLAY_NAME AFH website

Report:
- Files created/updated
- Client config completed
- Placeholder tokens replaced
- Form integration used
- Automation setup status
- Validation results
- Commit hash
```
