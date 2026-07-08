const RAHWA_CONFIG = {
  spreadsheetName: 'Rahwa Elderly Care Website Leads',
  leadsSheetName: 'Website Leads',
  emailLogSheetName: 'Email Log',
  settingsSheetName: 'Settings',
  notificationEmail: 'rahwaelderlycare@gmail.com',
  defaultStatus: 'New',
  headers: [
    'Timestamp',
    'Form Type',
    'Source Page',
    'Full Name',
    'Phone',
    'Email',
    'Relationship to Resident',
    'Care Timeline',
    'Preferred Tour Date',
    'Preferred Tour Time',
    'Resident Care Needs',
    'Message',
    'Page URL',
    'User Agent',
    'Status',
    'Notes'
  ]
};

function setupRahwaWebsiteLeadSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  getOrCreateSheet_(spreadsheet, RAHWA_CONFIG.leadsSheetName, RAHWA_CONFIG.headers);
  getOrCreateSheet_(spreadsheet, RAHWA_CONFIG.emailLogSheetName, [
    'Timestamp',
    'Recipient',
    'Subject',
    'Form Type',
    'Lead Name',
    'Status',
    'Error'
  ]);
  getOrCreateSheet_(spreadsheet, RAHWA_CONFIG.settingsSheetName, [
    'Setting',
    'Value',
    'Notes'
  ]);
}

function doPost(e) {
  try {
    const payload = normalizePayload_(parseRequest_(e));
    validatePayload_(payload);

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const leadsSheet = getOrCreateSheet_(spreadsheet, RAHWA_CONFIG.leadsSheetName, RAHWA_CONFIG.headers);
    const timestamp = new Date();
    const row = [
      timestamp,
      payload.formType,
      payload.sourcePage,
      payload.fullName,
      payload.phone,
      payload.email,
      payload.relationshipToResident,
      payload.careTimeline,
      payload.preferredTourDate,
      payload.preferredTourTime,
      payload.residentCareNeeds,
      payload.message,
      payload.pageUrl,
      payload.userAgent,
      RAHWA_CONFIG.defaultStatus,
      ''
    ];

    leadsSheet.appendRow(row);

    const subject = payload.formType === 'Schedule Tour'
      ? 'New Tour Request — Rahwa Elderly Care'
      : 'New Website Lead — Rahwa Elderly Care';

    sendLeadEmail_(payload, subject);
    logEmail_(spreadsheet, timestamp, subject, payload, 'Sent', '');

    return jsonResponse_({
      success: true,
      message: 'Submission received.'
    });
  } catch (error) {
    return jsonResponse_({
      success: false,
      message: error && error.message ? error.message : 'Submission failed.'
    });
  }
}

function doOptions() {
  return jsonResponse_({
    success: true,
    message: 'OK'
  });
}

function parseRequest_(e) {
  if (!e) return {};

  const postData = e.postData && e.postData.contents ? e.postData.contents : '';
  if (postData) {
    try {
      return JSON.parse(postData);
    } catch (jsonError) {
      return parseFormEncoded_(postData);
    }
  }

  if (e.parameter && Object.keys(e.parameter).length) {
    return e.parameter;
  }

  return {};
}

function parseFormEncoded_(body) {
  return body.split('&').reduce(function (result, pair) {
    if (!pair) return result;
    const parts = pair.split('=');
    const key = decodeURIComponent((parts[0] || '').replace(/\+/g, ' '));
    const value = decodeURIComponent((parts.slice(1).join('=') || '').replace(/\+/g, ' '));
    if (key) result[key] = value;
    return result;
  }, {});
}

function normalizePayload_(data) {
  const rawFormType = pick_(data, ['formType', 'leadType', 'form_type']) || 'Website Inquiry';
  const formType = /schedule/i.test(rawFormType) ? 'Schedule Tour' : 'Contact';

  return {
    formType: formType,
    sourcePage: clean_(pick_(data, ['sourcePage', 'source', 'websiteSource'])),
    fullName: clean_(pick_(data, ['fullName', 'name', 'full_name'])),
    phone: clean_(pick_(data, ['phone', 'phoneNumber', 'tel'])),
    email: clean_(pick_(data, ['email', 'emailAddress'])),
    relationshipToResident: clean_(pick_(data, ['relationshipToResident', 'relationship'])),
    careTimeline: clean_(pick_(data, ['careTimeline', 'timeline'])),
    preferredTourDate: clean_(pick_(data, ['preferredTourDate', 'preferredDate'])),
    preferredTourTime: clean_(pick_(data, ['preferredTourTime', 'preferredTime'])),
    residentCareNeeds: clean_(pick_(data, ['residentCareNeeds', 'careNeeds'])),
    message: clean_(pick_(data, ['message', 'comments', 'notes'])),
    pageUrl: clean_(pick_(data, ['pageUrl', 'websitePage', 'url'])),
    userAgent: clean_(pick_(data, ['userAgent', 'browserUserAgent'])),
    honeypot: clean_(pick_(data, ['company', 'website', 'hp', 'honeypot']))
  };
}

function validatePayload_(payload) {
  const values = Object.keys(payload).map(function (key) {
    return payload[key];
  }).join('').trim();

  if (!values) {
    throw new Error('Empty submission rejected.');
  }

  if (payload.honeypot) {
    throw new Error('Spam submission rejected.');
  }

  if (!payload.fullName) {
    throw new Error('Full name is required.');
  }

  if (!payload.phone && !payload.email) {
    throw new Error('Phone or email is required.');
  }
}

function sendLeadEmail_(payload, subject) {
  const body = [
    subject,
    '',
    'Form Type: ' + payload.formType,
    'Source Page: ' + payload.sourcePage,
    'Full Name: ' + payload.fullName,
    'Phone: ' + payload.phone,
    'Email: ' + payload.email,
    'Relationship to Resident: ' + payload.relationshipToResident,
    'Care Timeline: ' + payload.careTimeline,
    'Preferred Tour Date: ' + payload.preferredTourDate,
    'Preferred Tour Time: ' + payload.preferredTourTime,
    'Resident Care Needs: ' + payload.residentCareNeeds,
    'Message: ' + payload.message,
    'Page URL: ' + payload.pageUrl,
    'User Agent: ' + payload.userAgent
  ].join('\n');

  MailApp.sendEmail({
    to: RAHWA_CONFIG.notificationEmail,
    subject: subject,
    body: body,
    name: 'Rahwa Elderly Care Website'
  });
}

function logEmail_(spreadsheet, timestamp, subject, payload, status, error) {
  const sheet = getOrCreateSheet_(spreadsheet, RAHWA_CONFIG.emailLogSheetName, [
    'Timestamp',
    'Recipient',
    'Subject',
    'Form Type',
    'Lead Name',
    'Status',
    'Error'
  ]);

  sheet.appendRow([
    timestamp,
    RAHWA_CONFIG.notificationEmail,
    subject,
    payload.formType,
    payload.fullName,
    status,
    error
  ]);
}

function getOrCreateSheet_(spreadsheet, name, headers) {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  }

  if (headers && headers.length) {
    const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    const shouldWriteHeaders = currentHeaders.join('').trim() === '';
    if (shouldWriteHeaders) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
  }

  return sheet;
}

function pick_(data, keys) {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (data && data[key] !== undefined && data[key] !== null && String(data[key]).trim() !== '') {
      return data[key];
    }
  }
  return '';
}

function clean_(value) {
  return String(value || '').trim();
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
