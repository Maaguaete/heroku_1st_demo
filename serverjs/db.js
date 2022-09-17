const { ObjectId } = require('mongodb');
var mongoClient = require('mongodb').MongoClient;
// This format is to "connect using VS CODE"
// var url = "mongodb+srv://maaguaete:Atlas%401108@cluster0.5koit4y.mongodb.net/test";

// mongodb port local: 27017 => url = localhost:27017/demo

// This is "connect your application" FORMAT
var url = "mongodb+srv://maaguaete:Atlas%401108@cluster0.5koit4y.mongodb.net/?retryWrites=true&w=majority";
module.exports = { postLogin, readData, searchData, createData, deleteData };

function postLogin(req, res) {

    let txt_username = req.body.username;
    let txt_password = req.body.password;

    mongoClient.connect(url, (err, db) => {
        if (err) {
            console.log(err);
        }

        let dbo = db.db("demo");
        // Login check username vs password
        // let query = { username: txt_username, pwd: txt_password };

        // dbo.collection("users").countDocuments(query, (err, result) => {
        //     if (err) {
        //         console.log(err);
        //     } else {

        //         if (result >= 1) {
        //             req.session.username = txt_username;
        //             req.session.pwd = txt_password;
        //             res.redirect("/");
        //         } else {
        //             res.render("login", { err: "Invalid username or password!" });
        //         }
        //     }
        //     db.close();
        // });

        let query = { username: txt_username };
        dbo.collection("users").countDocuments(query, (err, result) => {
            if (err) {
                console.log(err);
            } else {

                if (result >= 1) {

                    req.session.username = txt_username;
                    req.session.pwd = txt_password;
                    res.redirect("/");
                } else {
                    res.render("login", { err: "Invalid username or password!" });
                }
            }
            db.close();
        });
    });
}

function readData(req, res) {
    mongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("demo");
        let query = {};
        dbo.collection("students").find(query).toArray((err, result) => {
            if (err) {
                res.json(JSON.stringify(err));
            } else {

                let sec = require('./serverjs/security.js');
                Object.entries(result).forEach(([key, value]) => {
                    let temp = sec.decrypt(value.id.split(","));
                    temp = temp.replace(/[+]/g, '-');
                    temp = temp.substring(0, temp.length - 2);
                    value['id'] = temp;
                    // console.log(value['id']);
                });
                res.json(result);
            }
            db.close();
        });
    });
}

function searchData(req, res, name) {
    if (name == null || name == "") {
        readData(req, res);
        return;
    }
    mongoClient.connect(url, (err, db) => {
        if (err) throw err;
        let dbo = db.db("demo");

        let query = { name: { $regex: ".*" + name + ".*", $options: 'i' } };

        dbo.collection("students").find(query).toArray((err, result) => {
            if (err) {
                res.json(JSON.stringify(err));
            } else {
                // console.log(result);
                res.json(result);
            }
            db.close();
        });
    });
}

function valid_multipleOf4(str) {
    while (true) {
        if (str.length % 4 == 0) {
            return str.toString();
        }
        str += ' ';
    }
}

function createData(req, res) {
    mongoClient.connect(url, (err, db) => {
        if (err) {
            res.json(JSON.stringify(err));
            return;
        }
        let students = db.db("demo").collection("students");

        let std_id = valid_multipleOf4(req.body.id);
        let sec = require('./security.js');
        let student = { id: sec.encrypt(std_id), name: req.body.name, batch: req.body.batch, address: req.body.address };

        students.insertOne(student, (err, result) => {
            if (err) {
                res.json({ OK: false, Error: JSON.stringify(err) });
            } else {
                // console.log(result);
                if (result && result.acknowledged) {

                    res.json({ OK: true, data: student });
                } else {
                    res.json({ OK: false, data: student });
                }
                //res.json({ data: result, OK: true });
                //res.redirect("/");
            }
            db.close();
        });
    });
}

function deleteData(req, res) {
    mongoClient.connect(url, (err, db) => {
        if (err) {
            throw err;
        }
        let students = db.db("demo").collection("students");
        students.deleteOne({ _id: ObjectId(req.body._id) }, (err, result) => {
            // console.log(req.body._id);
            if (err) {
                res.json({ OK: false, Error: JSON.stringify(err) });
            } else {
                // console.log(result);
                res.json({ OK: true });
            }
            db.close();
        })
    });
}