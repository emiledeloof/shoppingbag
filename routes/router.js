const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/new", (req, res) => {
    res.render("pages/new")
});

router.post("/new", (req, res) => {
    // Read database.json
    var data = fs.readFileSync("./database/database.json");
    var myObject = JSON.parse(data); // parse buffer to json
    let articleName = req.body.article // request article name from front-end
    const testObject = {        // create the object to be added to the database file
        name: articleName
    }
    myObject.push(testObject)     // push the object into the read data array
    const parsedData = JSON.stringify(myObject, null, 4)   // make json buffer a string
    fs.writeFileSync("./database/database.json", parsedData, (e) => {   //write to the database file
        if(e) throw e;
    });
    res.redirect("./confirm");  // if complete redirect to confirm
})

router.get("/confirm", (req, res) => {
    res.render("pages/confirm");
})

module.exports = router