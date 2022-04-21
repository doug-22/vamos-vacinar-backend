const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./src/routes")
const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.listen(8080, () => {
    console.log(`Server is running on port 8080: http://localhost:8080/${process.env.PORT}`);
});