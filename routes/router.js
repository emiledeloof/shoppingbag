const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/new", (req, res) => {
    res.render("pages/new")
});

router.post("/new", (req, res) => {
    var data = fs.readFileSync("./database/database.json");
    var myObject = JSON.parse(data);
    let articleName = req.body.article
    const testObject = {
        name: articleName
    }
    myObject.push(testObject)
    const parsedData = JSON.stringify(myObject, null, 4)
    fs.writeFileSync("./database/database.json", parsedData, (e) => {
        if(e) throw e;
    });
    res.redirect("./confirm");
})

router.get("/confirm", (req, res) => {
    res.render("pages/confirm");
})

module.exports = router