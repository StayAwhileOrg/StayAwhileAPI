require("dotenv").config();
const express = require("express");
const connectDB = require("./config.js");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth.js"));
app.use("/cabin", require("./routes/cabin.js"));
app.use("/profile", require("./routes/profile.js"));
app.use("/booking", require("./routes/booking.js"));

connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
});
