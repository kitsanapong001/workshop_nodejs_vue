const express = require('express')
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World')
})

require("./app/routes/auth.routes")(app);
require("./app/routes/products.routes")(app);

const PORT = process.env.PORT || 8092;
app.listen(PORT, () => {
  console.log(`Start server at port ${PORT}`)
})