const express = require("express");
const app = express();
const PORT = 5001
const router = require("./routes/router")

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}))
app.use(express.static("styling"));

app.get("/", (req, res) => {
    res.render("pages/index")
})

app.use("/pages", router)

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
