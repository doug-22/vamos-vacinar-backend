const express = require("express");

const app = express();

app.listen(8080, () => {
    console.log("Server started on port 8080: http://localhost:8080/");
});