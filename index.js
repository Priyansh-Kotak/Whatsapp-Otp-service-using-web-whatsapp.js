// Method 1

// const express = require("express");
// const app = express();
// const { Client, LocalAuth } = require("whatsapp-web.js");
// const puppeteer = require("puppeteer");
// const port = 3001;
// const qrcode = require("qrcode-terminal");
// const http = require("http");
// const server = http.createServer(app);
// const { Server } = require("socket.io");

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["my-custom-header"],
//     credentials: true,
//   },
// });

// app.get("/", (req, res) => {
//   res.send("<h1>Hello world</h1>");
// });

// // Function to create the server
// const startServer = () => {
//   server.listen(port, () => {
//     console.log("listening on *:", port);
//   });
// };

// // Creating client for WhatsApp connection.
// const client = new Client({
//   authStrategy: new LocalAuth({
//     clientId: "YOUR_CLIENT_ID",
//   }),
//   puppeteer: {
//     headless: false,
//     ignoreDefaultArgs: ["--disable-extensions"],
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   },
// });
// //   puppeteer: {
// //     headless: "new",
// //     ignoreDefaultArgs: ["--disable-extensions"],
// //     args: ["--enable-gpu"],
// //   },

// // }

// client.on("authenticated", () => {
//   console.log("Client is authenticated on the server side");
// });

// client.on("qr", (qr) => {
//   // Generate and scan this code with your phone
//   console.log("QR RECEIVED", qr);
//   qrcode.generate(qr, { small: true });
// });

// const createWhatsappSession = (socket, mobilenumber) => {
//   const sixDigitNumberOtp = Math.floor(
//     100000 + Math.random() * 90000
//   ).toString();
//   client.on("ready", () => {
//     // client.getChats().then((chats) => {
//     //   console.log(chats[0]);
//     // });

//     client.sendMessage(
//       `91${mobilenumber}@c.us`,
//       `Welcome to GreenField International School, your OTP is ${sixDigitNumberOtp}`
//     );

//     socket.emit("client_otp", sixDigitNumberOtp);

//     socket.emit("client", "Sending a gift from the server to the client");

//     console.log("Client is ready!");

//     server.close(() => {
//       startServer();
//     });
//   });

//   client.initialize;
// };

// const createWhatsappOtp = (socket) => {};

// io.on("connection", (socket) => {
//   console.log("a user connected", socket?.id);
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });

//   socket.on("mobilenumber", (mobilenumber) => {
//     console.log(
//       "Displaying mobile to server from the client side",
//       mobilenumber
//     );

//     createWhatsappSession(socket, mobilenumber);
//   });

//   // console.log("Otp for testing is ", sixDigitNumberOtp);

//   socket.on("otp-funtion-trigger", (data) => {
//     console.log(
//       "Receiving data from the client to server from the otp function",
//       data
//     );

//     const otp = createWhatsappOtp(socket);
//   });

//   socket.on("connected", (data) => {
//     console.log("Connected to the server", data);
//     // emit message from the server side

//     socket.emit("hello", "Hello from server");
//   });
// });

// // Handle uncaught exceptions and restart the server
// process.on("uncaughtException", async (err) => {
//   console.error("Uncaught Exception:", err);
//   const browser = await puppeteer.launch();
//   server.close(async () => {
//     // await browser.close();
//     client.startServer();
//   });
// });

// // Start the server
// startServer();

// Method 2

const express = require("express");
const app = express();
const { Client, LocalAuth } = require("whatsapp-web.js");
const puppeteer = require("puppeteer");
const port = 3001;
const qrcode = require("qrcode-terminal");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// Function to create the server
const startServer = () => {
  server.listen(port, () => {
    console.log("listening on *:", port);
  });
};

// Creating client for WhatsApp connection.
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "YOUR_CLIENT_ID",
  }),
  puppeteer: {
    headless: true,
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("authenticated", () => {
  console.log("Client is authenticated on the server side");
});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("disconnected", (reason) => {
  console.log("Client disconnected. Reason:", reason);

  // Reinitialize the client with a delay to avoid immediate reconnection attempts
  setTimeout(() => {
    client.initialize();
  }, 5000); // 5 seconds delay before reinitializing
});

const createWhatsappSession = async (socket, mobilenumber) => {
  const sixDigitNumberOtp = Math.floor(
    100000 + Math.random() * 90000
  ).toString();

  console.log(
    "Logging the otp inside the the createwhatsapp function",
    sixDigitNumberOtp
  );

  client.sendMessage(
    `91${mobilenumber}@c.us`,
    `Welcome to GreenField International School, your OTP is ${sixDigitNumberOtp}`
  );

  console.log("Logging the otp ", sixDigitNumberOtp);

  socket.emit("client_otp", sixDigitNumberOtp);

  socket.emit("client", "Sending a gift from the server to the client");

  console.log("Client is ready!");
};

client.initialize().catch((error) => {
  console.error("Client initialization error:", error);
  // Handle initialization error as needed
});

io.on("connection", (socket) => {
  console.log("a user connected", socket?.id);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("mobilenumber", (mobilenumber) => {
    console.log(
      "Displaying mobile to server from the client side",
      mobilenumber
    );

    createWhatsappSession(socket, mobilenumber);
  });

  // console.log("Otp for testing is ", sixDigitNumberOtp);

  socket.on("otp-funtion-trigger", (data) => {
    console.log(
      "Receiving data from the client to server from the otp function",
      data
    );

    const otp = createWhatsappOtp(socket);
  });

  socket.on("connected", (data) => {
    console.log("Connected to the server", data);
    // emit message from the server side

    socket.emit("hello", "Hello from server");
  });
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  // const browser = await puppeteer.launch();
  server.close(async () => {
    // await browser.close();
    startServer();
  });
});

startServer();
