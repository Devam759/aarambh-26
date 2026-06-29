import { adminDb } from './firebaseAdmin';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';

// Fallback email transport setup using environment SMTP variables
async function getEmailTransporter() {
  const nodemailer = await import('nodemailer');
  
  const isProduction = process.env.NODE_ENV === 'production' || 
                       (process.env.NEXT_PUBLIC_CASHFREE_ENV || '').trim().toUpperCase() === 'PRODUCTION';

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.office365.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // STARTTLS
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
    tls: isProduction ? {
      rejectUnauthorized: true
    } : {
      rejectUnauthorized: false
    }
  });
}

/**
 * Creates a dynamic minimal PDF schedule on the fly if the physical PDF doesn't exist yet.
 * This guarantees the system is fully functional without pre-existing files on disk.
 */
async function generateFallbackSchedulePDF(batchName: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  
  page.drawText('JK Lakshmipat University', { x: 50, y: 350, size: 18, color: rgb(0.01, 0.01, 0.01) });
  page.drawText(`Official Schedule: ${batchName}`, { x: 50, y: 310, size: 22, color: rgb(1, 0.6, 0) });
  page.drawText('Orientation Program — Aarambh 2026', { x: 50, y: 280, size: 12, color: rgb(0.4, 0.4, 0.4) });
  
  page.drawText('Schedule Outline:', { x: 50, y: 220, size: 14, color: rgb(0.1, 0.1, 0.1) });
  page.drawText('• Day 1: Reporting, Registration and Welcome Inaugural Session', { x: 50, y: 190, size: 10 });
  page.drawText('• Day 2: Academic Orientation & Campus Tours', { x: 50, y: 170, size: 10 });
  page.drawText('• Day 3: Ice-breaking Activities & Club Introductions', { x: 50, y: 150, size: 10 });
  page.drawText('• Day 4-7: Skill Workshops, Guest Lectures & Cultural Rehearsals', { x: 50, y: 130, size: 10 });
  page.drawText('• Day 8: Convocation & Aarambh Gala Event Night', { x: 50, y: 110, size: 10 });
  
  page.drawLine({ start: { x: 50, y: 70 }, end: { x: 550, y: 70 }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
  page.drawText('This is a system-generated schedule document.', { x: 50, y: 55, size: 8, color: rgb(0.5, 0.5, 0.5) });

  return await pdfDoc.save();
}

/**
 * Resolves the batch allocation details for a student.
 * Checks Firestore collection 'studentBatches' first, then falls back to course rules.
 */
export async function getStudentBatchDetails(studentData: any, regId: string): Promise<{ batchName: string; pdfFileName: string }> {
  try {
    // 1. Check if there is a manual override document in Firestore for this registration ID
    const batchDoc = await adminDb.collection('studentBatches').doc(regId).get();
    if (batchDoc.exists) {
      const data = batchDoc.data();
      if (data && data.batchName) {
        return {
          batchName: data.batchName,
          pdfFileName: data.pdfFileName || `${data.batchName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_schedule.pdf`
        };
      }
    }
    
    // 2. Alternatively check by application/registration number
    const appNum = studentData.registrationNumber || studentData.rollNumber;
    if (appNum) {
      const batchQuery = await adminDb.collection('studentBatches')
        .where('registrationNumber', '==', appNum)
        .limit(1)
        .get();
      if (!batchQuery.empty) {
        const data = batchQuery.docs[0].data();
        return {
          batchName: data.batchName,
          pdfFileName: data.pdfFileName || `${data.batchName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_schedule.pdf`
        };
      }
    }
  } catch (err) {
    console.error("Error querying studentBatches collection:", err);
  }

  // 3. Fallback allocation rules (For now assign everyone to Batch 1. There will be 4 batches in total on July 6th).
  return { batchName: 'Batch 1', pdfFileName: 'batch_1_schedule.pdf' };
}

/**
 * Minimal HTML escaper for values interpolated directly into email HTML.
 * Prevents HTML injection in case upstream sanitization was bypassed.
 */
function htmlEscape(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sends check-in email attaching the respective batch schedule PDF.
 */
export async function sendCheckInEmail(
  toEmail: string,
  studentName: string,
  appNumber: string,
  batchName: string,
  pdfFileName: string
) {
  console.log(`Preparing to send check-in email to ${toEmail} for batch ${batchName}...`);
  const transporter = await getEmailTransporter();
  
  // 1. Locate/generate the attachment PDF
  let pdfBytes: Buffer | Uint8Array;
  const schedulesDir = path.join(process.cwd(), 'public', 'schedules');

  // Sanitize pdfFileName to prevent path traversal: only allow safe basenames (letters, digits, dashes, underscores, dots)
  const rawBasename = path.basename(pdfFileName);
  const safeBasename = rawBasename.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  const hasValidPdfExtension = safeBasename.endsWith('.pdf');
  if (!hasValidPdfExtension) {
    console.error(`Invalid PDF filename rejected (path traversal guard): "${pdfFileName}". Falling back to generated PDF.`);
  }
  const filePath = hasValidPdfExtension ? path.join(schedulesDir, safeBasename) : null;

  try {
    // Ensure public/schedules directory exists
    await fs.mkdir(schedulesDir, { recursive: true });

    if (filePath) {
      // Check if the physical PDF schedule has been provided/stored on disk
      try {
        pdfBytes = await fs.readFile(filePath);
        console.log(`Loaded physical schedule PDF from disk: ${filePath}`);
      } catch {
        console.log(`Physical schedule PDF not found on disk. Generating fallback on the fly: ${safeBasename}`);
        pdfBytes = await generateFallbackSchedulePDF(batchName);
        // Write to disk so next scans can read it directly
        await fs.writeFile(filePath, pdfBytes);
      }
    } else {
      // Invalid filename was rejected — use a generated fallback directly
      pdfBytes = await generateFallbackSchedulePDF(batchName);
    }
  } catch (err) {
    console.error("Failed to resolve or save PDF file:", err);
    // Ultimate fallback buffer to prevent email crash
    pdfBytes = await generateFallbackSchedulePDF(batchName);
  }

  // 2. Inline images for branding
  let logoAttachment: any = null;
  let jkluAttachment: any = null;
  try {
    const logoPath = path.join(process.cwd(), 'public', 'logos', 'Aarambh_new_logo.png');
    const logoBytes = await fs.readFile(logoPath);
    logoAttachment = {
      filename: 'Aarambh_new_logo.png',
      content: logoBytes,
      cid: 'aarambh_logo'
    };

    const jkluPath = path.join(process.cwd(), 'public', 'logos', 'jklu_logo.png');
    const jkluBytes = await fs.readFile(jkluPath);
    jkluAttachment = {
      filename: 'jklu_logo.png',
      content: jkluBytes,
      cid: 'jklu_logo'
    };
  } catch (err) {
    console.warn("Failed to load branding logos for check-in email:", err);
  }

  const safeName = htmlEscape(studentName);
  const safeAppNum = htmlEscape(appNumber);
  const safeBatch = htmlEscape(batchName);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background-color: #ffffff; padding: 40px 20px 20px 20px; text-align: center; border-bottom: 1px solid #eeeeee; }
        .content { padding: 40px 30px; background-color: #ffffff; color: #333; line-height: 1.6; }
        .success-badge { display: inline-block; padding: 6px 12px; background-color: #dcfce7; color: #166534; border-radius: 4px; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
        .details-box { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #cbd5e1; }
        .footer { background-color: #f9f9f9; padding: 30px 20px; text-align: center; color: #777; font-size: 13px; border-top: 1px solid #eeeeee; }
        .social-icons { margin: 15px 0; }
        .social-icons a { display: inline-block; margin: 0 6px; color: #555; text-decoration: none; font-weight: bold; font-size: 12px; }
        .footer-link { color: #0D21DD; text-decoration: none; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <table align="center" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
            <tr>
              <td align="center" valign="middle" style="padding-right: 20px;">
                <img src="cid:jklu_logo" alt="JKLU Logo" style="max-height: 55px; width: auto; display: block;" />
              </td>
              <td align="center" valign="middle" style="padding-left: 20px; border-left: 1px solid rgba(0,0,0,0.1);">
                <img src="cid:aarambh_logo" alt="Aarambh '26 Logo" style="max-height: 70px; width: auto; display: block;" />
              </td>
            </tr>
          </table>
        </div>
        <div class="content">
          <h2 style="margin-top: 0;">Dear ${safeName},</h2>
          <p>Thank you for completing your Check-in.</p>
          
          <p>Your registration details are as follows:</p>
          <ul style="line-height: 1.8;">
            <li><strong>Student Name:</strong> ${safeName}</li>
            <li><strong>Application Number:</strong> ${safeAppNum}</li>
            <li><strong>Assigned Batch:</strong> ${safeBatch}</li>
          </ul>

          <p>Please find attached the schedule PDF for your assigned batch. We recommend reviewing it carefully.</p>
          <p>If you have any questions or require further assistance, please feel free to contact your cohort leader.</p>
          
          <p>
            <strong>Name:</strong> [Cohort Leader’s Name]<br/>
            <strong>Phone Number:</strong> [Their Phone Number]
          </p>
          
          <p>We look forward to seeing you!</p>
          <p>Best regards,<br/><strong>AARAMBH Team</strong></p>
        </div>
        <div class="footer">
          <div class="social-icons">
            <a href="https://www.instagram.com/aarambh_jklu?igsh=NmZzYjFrcDNtejMw">Instagram</a> &bull; 
            <a href="https://www.linkedin.com/school/jklujaipur/">LinkedIn</a> &bull; 
            <a href="https://x.com/jklujaipur">X (Twitter)</a> &bull; 
            <a href="https://www.facebook.com/share/1Hsdb57Jcf/">Facebook</a>
          </div>
          <p style="margin-bottom: 5px;">JK Lakshmipat University, Jaipur</p>
          <p style="margin-top: 0;"><a href="https://aarambh.jklu.edu.in" class="footer-link">aarambh.jklu.edu.in</a></p>
          <p style="margin-top: 15px; font-size: 11px; opacity: 0.7;">&copy; 2026 Aarambh Event Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions: any = {
    from: `"Aarambh Team" <${process.env.SMTP_FROM || ''}>`,
    to: toEmail,
    subject: "Check-In Confirmation – Batch Details & Schedule",
    html: htmlContent,
    attachments: [
      {
        filename: pdfFileName,
        content: Buffer.from(pdfBytes),
        contentType: 'application/pdf'
      }
    ]
  };

  if (logoAttachment) {
    mailOptions.attachments.push(logoAttachment);
  }
  if (jkluAttachment) {
    mailOptions.attachments.push(jkluAttachment);
  }

  await transporter.sendMail(mailOptions);
  console.log(`Check-in email sent successfully to ${toEmail}.`);
}
