require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes");

const PORT = process.env.PORT || 4000;
app.use(cors());

app.use("/proxyServer", router);

app.listen(PORT, () => console.log(`Listening...`));
