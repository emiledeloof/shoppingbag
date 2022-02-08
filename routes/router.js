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
    res.render("pages/new", { stores: parsedStores, article: ""})
});

router.post("/new", (req, res) => {
    var generatedId = generateId();
    let articleName = req.body.article // request article name from front-end
    let quantity = req.body.quantity 
    let comment = req.body.comment
    let requestedBy = req.body.requestedBy
    let store = req.body.store
    validateId("article", generatedId)    // execute function to check if generated id is unique
    if(isUnique === true){          // check if id is unique
        const testObject = {        // create the object to be added to the database file
            id: generatedId,
            name: articleName,
            quantity: quantity,
            comment: comment,
            requestedBy: requestedBy,
            store: store
        }
        parsedArticles.push(testObject)     // push the object into the read data array
        const parsedData = JSON.stringify(parsedArticles, null, 4)   // make json buffer a string
        fs.writeFileSync("./database/articles.json", parsedData, (e) => {   //write to the database file
            if(e) throw e;
        });
        res.redirect("/");  // if complete redirect to confirm
        isUnique = true
    } else{
        console.log("is unique is false");
    }
});

router.post("/newStore", (req, res) => {
    let storeName = req.body.newStore // request store name from front-end
    validateId("store", storeName)
    if(isUnique === true){
        const testObject = {        // create the object to be added to the database file
            store: storeName
        }
        parsedStores.push(testObject)     // push the object into the read data array
        const parsedData = JSON.stringify(parsedStores, null, 4)   // make json buffer a string
        fs.writeFileSync("./database/stores.json", parsedData, (e) => {   //write to the database file
            if(e) throw e;
        });
        res.redirect("./settings");  // if complete redirect to confirm
        isUnique = true
    } else{
        console.log("is unique is false");
    }
});

router.get("/settings", (req, res) => {
    res.render("pages/settings", {stores: parsedStores})
});

router.delete("/:id", (req, res) => {
    var convertedId = parseInt(req.params.id);              
    parsedArticles.forEach(article => {                     // loop over each article
        if(article.id === convertedId){
            const index = parsedArticles.indexOf(article)   // get index of the item that needs to be delete from the array
            if(index > -1){                                 
                parsedArticles.splice(index, 1)             // delete item from array
                let parsedData = JSON.stringify(parsedArticles, null, 4);   // parse json buffer to string
                fs.writeFileSync("./database/articles.json", parsedData, (e) => {   //write to the database file
                    if(e) throw e;
                });
            }
        }
    })
    res.redirect("/")
})

router.delete("/deleteStore/:store", (req, res) => {
    parsedStores.forEach(store => {
        if(store.store === req.params.store){
            const index = parsedStores.indexOf(store)
            if(index > -1){
                parsedStores.splice(index, 1)
                let parsedData = JSON.stringify(parsedStores, null, 4);
                fs.writeFileSync("./database/stores.json", parsedData, (e) => {
                    if(e) throw e;
                })
            }
        }
    })
    res.redirect("./../settings")
})

router.get("/:id", (req, res) => {
    var requestedArticle
    var convertedId = parseInt(req.params.id)
    parsedArticles.forEach(article => {
        if(article.id === convertedId){
            requestedArticle = article
        }
    })
    res.render("pages/show", {article: requestedArticle})
})

router.get("/edit/:id", (req, res) => {
    var requestedArticle
    var convertedId = parseInt(req.params.id)
    parsedArticles.forEach(article => {
        if(article.id === convertedId){
            requestedArticle = article
        }
    })
    res.render("pages/edit", {article: requestedArticle, stores: parsedStores})
})

router.post("/edit/:id/post", (req, res) => {
    var convertedId = parseInt(req.params.id);              
    parsedArticles.forEach(article => {                     // loop over each article
        if(article.id === convertedId){
            const index = parsedArticles.indexOf(article)   // get index of the item that needs to be delete from the array
            article.id = convertedId
            article.name = req.body.article                 // request article name from front-end
            article.quantity = req.body.quantity 
            article.comment = req.body.comment
            article.requestedBy = req.body.requestedBy
            article.store = req.body.store
            parsedArticles.push(article)                    // push new article into the parsedArticle array
            let string = JSON.stringify(parsedArticles, null, 4)    // parse json buffer to string
            fs.writeFileSync("./database/articles.json", string, (e) => {       // write to db file
                throw e
            })
            if(index > -1){                                 
                parsedArticles.splice(index, 1)             // delete item from array
                let parsedData = JSON.stringify(parsedArticles, null, 4);   // parse json buffer to string
                fs.writeFileSync("./database/articles.json", parsedData, (e) => {   //write to the database file
                    if(e) throw e;
                });
            }
        }
    })
    res.redirect("/")
})

router.post("/done", (req, res) => {
    let filter = req.body.filter
    parsedArticles.forEach(article => {
        if(article.store === filter){
            const index = parsedArticles.indexOf(article);
            if(index > -1){
                parsedArticles.splice(index, 1);
                let parsedData = JSON.stringify(parsedArticles)
                fs.writeFileSync("./database/articles.json", parsedData, (e) => {
                    if(e) throw e;
                })
            }
        }
    })
    res.redirect("/")
})

function generateId(){
    return Math.floor(Math.random() * 100000000) + 10000000
}

function validateId(path, name){
    if(path == "article"){
        parsedArticles.forEach(article => {
            if(article.id == name){
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