// import all needed libraries, files, ...
const express = require("express");
const app = express();
const PORT = 5001
const router = require("./routes/router")
const fs = require("fs")

// set ejs as view engine
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}))
app.use(express.static("styling")); // styling folder static so i can link to style.css

// render index file
app.get("/", (req, res) => {
    var articles = fs.readFileSync("./database/articles.json");
    var stores = fs.readFileSync("./database/stores.json");
    var articlesParsed = JSON.parse(articles);
    var storesParsed = JSON.parse(stores);
    res.render("pages/index", {articles: articlesParsed, stores: storesParsed});
})

// use router
app.use("/pages", router)

//listen to port 5001 and log when done
app.listen(PORT, () => console.log(`listening on port ${PORT}`))