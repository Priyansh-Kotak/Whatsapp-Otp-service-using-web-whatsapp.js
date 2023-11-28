const express = require("express");
const app = express();
const { Client, LocalAuth } = require("whatsapp-web.js");

const port = 3001;

app.listen(port, () => {
  console.log("Server started on the port 3000");
});

// Generate a random 5-digit number
const fiveDigitNumberOtp = Math.floor(10000 + Math.random() * 90000);

const client = new Client({
  puppeteer: {
    headless: false,
  },
  authStrategy: new LocalAuth({
    clientId: "YOUR_CLIENT_ID",
  }),
});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  console.log("QR RECEIVED", qr);
});

client.on("ready", () => {
  client.getChats().then((chats) => {
    console.log(chats[0]);
  });

  client.sendMessage(
    "918160521017@c.us",
    `Welcome to GreenField International School, your OTP is ${fiveDigitNumberOtp}`
  );
  console.log("Client is ready!");
});

client.initialize();
