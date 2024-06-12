const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
require('dotenv').config();
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors({
    origin: '*',
    credentials: true, // Allow credentials (cookies) to be sent
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));
app.use(express.json());
app.use(cookieParser());

require("./config/db").connect();

const userRoutes = require("./routes/user");
const customerRoutes = require("./routes/customer");
const orderRoutes = require("./routes/order");
const campaignRoutes = require("./routes/campaign");

app.use("/api/v1", userRoutes);
app.use("/api/v1", customerRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", campaignRoutes);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
