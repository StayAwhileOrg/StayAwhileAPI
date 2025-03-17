require("dotenv").config();
const express = require("express");
const connectDB = require("./config.js");
const cors = require("cors");
const app = express();
const auth = require("./routes/auth.js");
const cabin = require("./routes/cabin.js");
const profile = require("./routes/profile.js");
const booking = require("./routes/booking.js");

app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/cabin", cabin);
app.use("/profile", profile);
app.use("/booking", booking);

connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
});
