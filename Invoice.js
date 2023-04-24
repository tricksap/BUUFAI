const PDFDocument = require("pdfkit");
const fs = require("fs");

const invoiceData = {
  month: "2",
  year: "2023",
  paid: "300",
  created_at: "2023-03-17 14:44:22",
  email: "oo@gmail.com",
  firstname: "oo",
  middlename: "oo",
  lastname: "oo",
  College: "CIT",
};

// Create a new PDF document
const doc = new PDFDocument({ bufferPages: true });

// Create a write stream to save the PDF
const writeStream = fs.createWriteStream("invoice.pdf");

// Pipe the PDF document to the write stream
doc.pipe(writeStream);

// Set some initial information on the PDF
doc.info["Title"] = "Invoice";
doc.info["Author"] = "Your Company Name";

// Add a custom font
// doc.registerFont('Roboto-Bold', 'fonts/Roboto-Bold.ttf');

// Define some colors
const primaryColor = "#008cba";
const secondaryColor = "#1a1a1a";

// Define the header text
const headerText = "Invoice";
const date = `${invoiceData.created_at}`;

// Define the customer information
const customerInfo = [
  {
    label: "Name",
    value: `${invoiceData.firstname} ${invoiceData.middlename} ${invoiceData.lastname}`,
  },
  { label: "Email", value: invoiceData.email },
  { label: "College", value: invoiceData.College },
];

// Define the invoice items
const invoiceItems = [
  {
    description: "Month " + `${invoiceData.month}`,
    price: `${invoiceData.paid}`,
  },
  { description: "Item 2", quantity: 2, price: 50 },
  { description: "Item 3", quantity: 3, price: 25 },
];

// Calculate the total price
const totalPrice = invoiceItems.reduce(
  (acc, item) => acc + item.quantity * item.price,
  0
);

// Add the header text to the PDF
doc
  .font("Helvetica-Bold")
  .fontSize(25)
  .fillColor(primaryColor)
  .text(headerText, { align: "center" });

// Add some spacing
doc.moveDown();

doc
  .font("Helvetica-Bold")
  .fontSize(10)
  .fillColor(secondaryColor)
  .text(date, { align: "right" });

// Add the customer information to the PDF
doc
  .font("Helvetica-Bold")
  .fontSize(12)
  .fillColor(secondaryColor)
  .text("Customer Information:");
doc.moveDown();
customerInfo.forEach(({ label, value }) => {
  doc.fontSize(10).fillColor(secondaryColor).text(`${label}: ${value}`);
});
doc.moveDown();

// Add the invoice items to the PDF
doc
  .font("Helvetica-Bold")
  .fontSize(12)
  .fillColor(secondaryColor)
  .text("Invoice Items:");
doc.moveDown();
invoiceItems.forEach(({ description, quantity, price }) => {
  doc
    .fontSize(10)
    .fillColor(secondaryColor)
    .text(`${description}`, { continued: true });
  doc.fillColor(primaryColor).text(` $${price}`);
});
doc.moveDown();

// Add the total price to the PDF
doc
  .fontSize(12)
  .fillColor(secondaryColor)
  .text(`Total Price: $${totalPrice}`, { align: "right" });

// Finalize the PDF and close the write stream
doc.end();
writeStream.on("finish", () => {
  console.log("Invoice PDF saved successfully!");
});
