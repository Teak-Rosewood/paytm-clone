const express = require("express");
const apiRouter = require("./routes/index");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// app.use(cors());
app.use(express.json());

app.use("/api/v1", apiRouter);

app.get("/api/v1", (req, res) => {
    res.send("Hello this is working");
});

app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log("Listening on PORT: ", PORT);
});
