const express = require("express")
const app = express();

app.use((req, res) => {
    console.log('hello world')
})

module.exports = app