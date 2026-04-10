const fs = require('fs');
const PDFDocument = require('pdfkit');

const output = 'c:/Users/Anasj/OneDrive/Desktop/New folder (2)/test-cases.pdf';

const rows = [
  ['T1', 'User Login', 'Email: invalid, Password: invalid', 'Error message: Incorrect credentials', 'Pending execution', 'Not Run'],
  ['T2', 'User Login', 'Email: valid, Password: invalid', 'Error message: Incorrect credentials', 'Pending execution', 'Not Run'],
  ['T3', 'User Login', 'Email: invalid, Password: valid', 'Error message: Incorrect credentials', 'Pending execution', 'Not Run'],
  ['T4', 'User Login', 'Email: valid, Password: valid', 'User redirected to User Dashboard', 'Pending execution', 'Not Run'],
  ['T5', 'Registration', 'Empty required fields', 'Validation error shown', 'Pending execution', 'Not Run'],
  ['T6', 'Registration', 'Existing email', 'Error: account already exists', 'Pending execution', 'Not Run'],
  ['T7', 'Registration', 'Password length < 8', 'Error: password must be at least 8 chars', 'Pending execution', 'Not Run'],
  ['T8', 'Registration', 'Valid new user data', 'Registration successful, account created', 'Pending execution', 'Not Run'],
  ['T9', 'Pickup Request', 'Date/time in past', 'Error: only upcoming date/time allowed', 'Pending execution', 'Not Run'],
  ['T10', 'Pickup Request', 'Valid waste type, date, address, no image', 'Request submitted successfully', 'Pending execution', 'Not Run'],
  ['T11', 'Pickup Request', 'Valid data with image upload', 'Request submitted with image attached', 'Pending execution', 'Not Run'],
  ['T12', 'Pickup to Payment Flow', 'Submit pickup request', 'Payment panel opens immediately', 'Pending execution', 'Not Run'],
  ['T13', 'Payment Submission', 'No payment method selected', 'Error: choose payment method', 'Pending execution', 'Not Run'],
  ['T14', 'Payment Submission', 'Valid amount + valid method', 'Payment successful, record added to history', 'Pending execution', 'Not Run'],
  ['T15', 'Profile Update', 'Change name/phone/address/email', 'Profile updated successfully', 'Pending execution', 'Not Run'],
  ['T16', 'Change Password', 'New and confirm mismatch', 'Error: passwords do not match', 'Pending execution', 'Not Run'],
  ['T17', 'Change Password', 'Valid current + valid new password', 'Password changed successfully', 'Pending execution', 'Not Run'],
  ['T18', 'Collector View Routes', 'Collector login', 'Assigned routes list displayed', 'Pending execution', 'Not Run'],
  ['T19', 'Collector Status Update', 'Update status to In-Progress/Completed', 'Status updated and visible in user tracking', 'Pending execution', 'Not Run'],
  ['T20', 'Collector Proof Upload', 'Upload completion proof image', 'Proof saved and visible in request history', 'Pending execution', 'Not Run']
];

const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 24 });
doc.pipe(fs.createWriteStream(output));

doc.fontSize(16).fillColor('#225f35').text('Waste Disposal System - Test Cases', { align: 'left' });
doc.moveDown(0.6);

const headers = ['Test ID', 'Test Scenario Name', 'Test Data', 'Expected Result', 'Actual Result', 'Test Status'];
const colWidths = [50, 120, 220, 190, 135, 70];
const rowHeight = 24;
const startX = doc.x;
let y = doc.y;

function drawRow(values, isHeader = false) {
  let x = startX;
  for (let i = 0; i < values.length; i += 1) {
    const w = colWidths[i];
    doc
      .lineWidth(0.5)
      .strokeColor('#9aa8a0')
      .rect(x, y, w, rowHeight)
      .fillAndStroke(isHeader ? '#2f6f3e' : '#ffffff', '#9aa8a0');

    doc
      .fillColor(isHeader ? '#ffffff' : '#1f2a24')
      .fontSize(8)
      .text(String(values[i]), x + 3, y + 4, {
        width: w - 6,
        height: rowHeight - 6,
        ellipsis: true
      });

    x += w;
  }

  y += rowHeight;
}

drawRow(headers, true);

for (const row of rows) {
  if (y > doc.page.height - 40) {
    doc.addPage({ size: 'A4', layout: 'landscape', margin: 24 });
    y = 24;
    drawRow(headers, true);
  }
  drawRow(row, false);
}

doc.end();
