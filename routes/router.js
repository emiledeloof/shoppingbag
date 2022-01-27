//import all dependencies
const express = require("express");
const router = express.Router();
const fs = require("fs");

// Read articles.json
var readArticles = fs.readFileSync("./database/articles.json");
var parsedArticles = JSON.parse(readArticles); // parse buffer to json

// Read stores.json
var readStores = fs.readFileSync("./database/stores.json");
var parsedStores = JSON.parse(readStores); // parse buffer to json

let isUnique = true;

router.get("/new", (req, res) => {
    res.render("pages/new")
});

router.post("/new", (req, res) => {
    let articleName = req.body.article // request article name from front-end
    let quantity = req.body.quantity 
    let comment = req.body.comment
    validateName("article", articleName)
    // console.log(validateName("article", articleName))
    if(isUnique === true){
        const testObject = {        // create the object to be added to the database file
            name: articleName,
            quantity: quantity,
            comment: comment
        }
        parsedArticles.push(testObject)     // push the object into the read data array
        const parsedData = JSON.stringify(parsedArticles, null, 4)   // make json buffer a string
        fs.writeFileSync("./database/articles.json", parsedData, (e) => {   //write to the database file
            if(e) throw e;
        });
        res.redirect("./confirm");  // if complete redirect to confirm
        isUnique = true
    } else{
        console.log("is unique is false");
    }
});

router.post("/newStore", (req, res) => {
    let storeName = req.body.newStore // request store name from front-end
    validateName("store", storeName)
    if(isUnique === true){
        const testObject = {        // create the object to be added to the database file
            store: storeName
        }
        parsedStores.push(testObject)     // push the object into the read data array
        const parsedData = JSON.stringify(parsedStores, null, 4)   // make json buffer a string
        fs.writeFileSync("./database/stores.json", parsedData, (e) => {   //write to the database file
            if(e) throw e;
        });
        res.redirect("./confirm");  // if complete redirect to confirm
        isUnique = true
    } else{
        console.log("is unique is false");
    }
});

router.get("/confirm", (req, res) => {
    res.render("pages/confirm");
});

router.get("/settings", (req, res) => {
    res.render("pages/settings", {stores: parsedStores})
});

function validateName(path, name){
    if(path == "article"){
        parsedArticles.forEach(article => {
            if(article.name == name){
                isUnique = false
            }
        })
    }
    if(path == "store"){
        parsedStores.forEach(store => {
            if(store.store == name){
                isUnique = false
            }
        })
    }
}

module.exports = router