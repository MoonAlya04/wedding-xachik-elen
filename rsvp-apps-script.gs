/**
 * RSVP → Google Sheets կապիչ
 * -----------------------------------------
 * Տեղադրության քայլերը՝
 * 1. Ստեղծեք նոր Google Sheet (sheets.new)
 * 2. Extensions → Apps Script
 * 3. Ջնջեք գոյություն ունեցող կոդը և տեղադրեք սա
 * 4. Save (Ctrl+S)
 * 5. Deploy → New deployment → Type՝ "Web app"
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 6. Սեղմեք Deploy, հաստատեք թույլտվությունները
 * 7. Պատճենեք ստացված Web app URL-ը
 * 8. invitation.html ֆայլում SCRIPT_URL փոփոխականի փոխարեն դրեք այդ URL-ը
 */

function doPost(e) {
  // Honeypot՝ եթե այս թաքնված դաշտը լցված է, դա bot է, անտեսում ենք
  if (e.parameter.hp_confirm_9k2) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "ignored" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSVP");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("RSVP");
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Ամսաթիվ/Ժամ", "Կողմ (Հարս/Փեսա)", "Անուն Ազգանուն", "Հեռախոսահամար", "Մասնակցություն", "Հյուրերի թիվ", "Մեկնաբանություն"]);
  }

  sheet.appendRow([
    new Date(),
    e.parameter.side || "",
    e.parameter.name || "",
    e.parameter.phone || "",
    e.parameter.attending || "",
    e.parameter.guests || "0",
    e.parameter.message || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
