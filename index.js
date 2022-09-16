const express = require('express');
const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');
const db_js = require('./serverjs/db.js');

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieSession({
    name: "session",
    keys: ["username", "pwd"],
    maxAge: 12 * 60 * 60 * 1000
}));
app.use("/", express.static("./static"));
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.listen(port, () => {
    // console.log(`Running on port ${port}`);
})

// Router
app.get("/", (req, res) => {
    if (req.session.username == null || req.session.pwd == null) {
        res.redirect("/login");
        return;
    }
    res.render("index");
});
app.get("/login", (req, res) => {
    if (req.session.username != null || req.session.pwd != null) {
        res.redirect("/");
        return;
    }
    res.render("login");
});
app.post("/postLogin", (req, res) => {
    db_js.postLogin(req, res);
});

app.get("/readData", (req, res) => {
    try {
        db_js.readData(req, res);
    } catch (error) {

    }

});

app.get("/searchData", (req, res) => {
    db_js.searchData(req, res, req.query.name);
});

app.post("/addStudent", (req, res) => {
    db_js.createData(req, res);
});

app.delete("/deleteData", (req, res) => {
    db_js.deleteData(req, res);
});

// app.get("/decrypt", (req, res)=>{
//     let sec = require("./serverjs/security.js");
//     let stdid = req.query.
// })