var { ObjectId } = require('mongodb');
// var mongoClient = require('mongodb').MongoClient;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://maaguaete:Atlas%401108@cluster0.5koit4y.mongodb.net/?retryWrites=true&w=majority";

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });


// This format is to "connect using VS CODE"
// var url = "mongodb+srv://maaguaete:Atlas%401108@cluster0.5koit4y.mongodb.net/test";

// mongodb port local: 27017 => url = localhost:27017/demo

// This is "connect your application" FORMAT
// var url = "mongodb+srv://maaguaete:Atlas%401108@cluster0.5koit4y.mongodb.net/?retryWrites=true&w=majority";

module.exports = { postLogin, readData, searchData, createData, editData, deleteData };

function postLogin(req, res) {
    try {
        let txt_username = req.body.username;
        let txt_password = req.body.password;

        // New Format
        let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        client.connect(err => {
            const collection = client.db("demo").collection("users");
            // perform actions on the collection object
            if (err) {
                console.log(err);
            }


            let query = { username: txt_username };
            collection.countDocuments(query, (err, result) => {
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
                client.close();
            });
        });

        // let { ObjectId } = require('mongodb');
        // let mongoClient = require('mongodb').MongoClient;
        // let url = "mongodb+srv://maaguaete:Atlas%401108@cluster0.5koit4y.mongodb.net/?retryWrites=true&w=majority";
        // mongoClient.connect(url, (err, db) => {
        // if (err) {
        //     console.log(err);
        // }

        //     let dbo = db.db("demo");
        //     // Login check username vs password
        //     // let query = { username: txt_username, pwd: txt_password };

        //     // dbo.collection("users").countDocuments(query, (err, result) => {
        //     //     if (err) {
        //     //         console.log(err);
        //     //     } else {

        //     //         if (result >= 1) {
        //     //             req.session.username = txt_username;
        //     //             req.session.pwd = txt_password;
        //     //             res.redirect("/");
        //     //         } else {
        //     //             res.render("login", { err: "Invalid username or password!" });
        //     //         }
        //     //     }
        //     //     db.close();
        //     // });

        //     let query = { username: txt_username };
        //     dbo.collection("users").countDocuments(query, (err, result) => {
        //         if (err) {
        //             console.log(err);
        //         } else {

        //             if (result >= 1) {

        //                 req.session.username = txt_username;
        //                 req.session.pwd = txt_password;
        //                 res.redirect("/");
        //             } else {
        //                 res.render("login", { err: "Invalid username or password!" });
        //             }
        //         }
        //             db.close();
        //         });
        //     });

    } catch (error) {

    }

}

function readData(req, res) {

    try {
        // New Format
        let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        client.connect(err => {
            let students = client.db("demo").collection("students");
            // perform actions on the collection object
            if (err) {
                console.log(err);
            }
            let query = {};
            students.find(query).toArray((err, result) => {
                if (err) {
                    res.json(JSON.stringify(err));
                } else {

                    let sec = require('./security.js');
                    Object.entries(result).forEach(([key, value]) => {
                        let temp = sec.decrypt(value.id.split(","));
                        temp = temp.replace(/[+]/g, '-');
                        temp = temp.substring(0, temp.length - 2);
                        value['id'] = temp;
                        // console.log(value['id']);
                    });

                    res.json(result);
                }
                client.close();
            });
        });
    } catch (error) {

    }
}

function searchData(req, res, name) {

    if (name == null || name == "") {
        readData(req, res);
        return;
    }
    var client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect(err => {
        if (err) throw err;
        let students = db.db("demo").collection("students");

        let query = { name: { $regex: ".*" + name + ".*", $options: 'i' } };

        students.find(query).toArray((err, result) => {
            if (err) {
                res.json(JSON.stringify(err));
            } else {
                // console.log(result);
                res.json(result);
            }
            client.close();
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

    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect(err => {
        if (err) {
            res.json(JSON.stringify(err));
            return;
        }
        let students = client.db("demo").collection("students");

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
            client.close();
        });
    });
}

function editData(req, res) {
    try {
        let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        client.connect(err => {
            if (err) {
                throw err;
            }
            let students = client.db("demo").collection("students");

            let student = { _id: req.body._id, index: req.body.index, name: req.body.name, batch: req.body.batch, address: req.body.address };

            students.updateOne({ _id: ObjectId(req.body._id) }, {
                $set: {
                    name: req.body.name,
                    batch: req.body.batch,
                    address: req.body.address
                }
            }, (err, result) => {
                // console.log(req.body._id);
                if (err) {
                    res.json({ OK: false, Error: JSON.stringify(err) });
                } else {
                    // console.log(result);
                    // console.log(result);
                    if (result.matchedCount > 0 && result.modifiedCount > 0 && result.acknowledged) {

                        res.json({ OK: true, data: student });
                    } else {
                        res.json({ OK: false, data: student });
                    }
                }
                client.close();
            });
        });
    } catch (error) {

    }
}

function deleteData(req, res) {

    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect(err => {
        if (err) {
            throw err;
        }
        let students = client.db("demo").collection("students");
        students.deleteOne({ _id: ObjectId(req.body._id) }, (err, result) => {
            // console.log(req.body._id);
            if (err) {
                res.json({ OK: false, Error: JSON.stringify(err) });
            } else {
                // console.log(result);
                res.json({ OK: true });
            }
            client.close();
        })
    });
}