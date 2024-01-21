const express = require("express");
const apiRouter = require('./routes/index')
const cors = require("cors");
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000

app.use(cors());
app.use(bodyParser)

app.use('api/v1', apiRouter)

app.listen(PORT, (err) => {
    if (err) 
        console.log(err)
    console.log("Listening on PORT: ", PORT)
})


