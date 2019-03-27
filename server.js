var cors = require('cors');
var mongoose = require('mongoose');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var index = require('./routes/index'); // home page
var tasks = require('./routes/tasks'); // api for mongodb conection
//Grid = mongo.Grid; //griFs
Grid = require('mongodb').Grid
var Grid = require('gridfs-stream');

//Comments implementation for the app

var Pusher = require('pusher');

var pusher = new Pusher({
    appId: '424094',
    key: '8da7bb601e3e1a0400e1',
    secret: 'bf1db406367b5c2eb029',
    cluster: 'us2',
    encrypted: true
});

// pusher.trigger('my-channel', 'my-event', {
//     "message": "hello world"
// });

//var mongoDB = 'mongodb://localhost:27017/GOT';
// var mongoDB = 'mongodb://kxm2263:Kranthi-143@cluster0-shard-00-00-pwgtx.mongodb.net:27017,cluster0-shard-00-01-pwgtx.mongodb.net:27017,cluster0-shard-00-02-pwgtx.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
// mongoose.connect(mongoDB, {
//     useMongoClient: true
// });

// //Get the default connection
// var db = mongoose.connection;

// console.log("DB connected" + db);
// var MongoClient = require('mongodb').MongoClient;


var searchElement = "";
var collection = "";

//Get search field from front end
//searchElement = "character";
searchElement = "battle";

var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;
var user = encodeURIComponent('ogkranthi');
var password = encodeURIComponent('kranthi1');
//var url = format("mongodb://[%s:%s]@cluster0-shard-00-00-pwgtx.mongodb.net:27017,cluster0-shard-00-01-pwgtx.mongodb.net:27017,cluster0-shard-00-02-pwgtx.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin", user, password);
var url = format('mongodb://%s:%s@ds243345.mlab.com:43345/got', user, password);
MongoClient.connect(url, function(err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
        //localhost:3000/character/Kyle%20(brotherhood) get for the client
       app.get('/character/:name', (req, res) => {
            // const details = { 'name': name };
            var name = req.params.name;
            db.collection('character').find({ name: new RegExp(name) }).toArray(function(err, record) {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    res.send(record);
                }
            });
        });


        //localhost:3000/battle/Battle%20of%20the%20Golden%20Tooth
        app.get('/battle/:bat', (req, res) => {
            // const details = { 'name': name };
            var par = req.params.bat;
            console.log(par);
            collection.find({ name: new RegExp(par) }).toArray(function(err, record) {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    res.send(record);
                }
            });
        });

        // var grid = new Grid(db, 'fs');

        // grid.get("59fbf08fc3328134c6b8ab4f", function(err, data) {
        //     if (err) {
        //         console.log("Error Occured:" + err);
        //     } else console.log("image retrieved:" + data)
        // });

        db.collection("fs.files").findOne({ filename: "jonsnow.jpg" },
            function(err, data) {
                if (err) console.log("err:" + err);
                else
                    console.log("img:" + data.filename)
            });
        if (searchElement === "character") {
            collection = db.collection('character');
            var name = "Kyle (brotherhood)";
            collection.findOne({ name: name }, function(err, record) {
                console.log("Title:" + record.title +
                    "House" + record.house
                );
            });

        } else {
            collection = db.collection('battle');
            var name = "Battle of the Golden Tooth";

            collection.findOne({ name: name }, function(err, record) {
                console.log("Name:" + record.name +
                    "Year" + record.year +
                    "Attacker King" + record.attacker_king +
                    "Defender King" + record.defender_king +
                    "Outcome" + record.attacker_outcome +
                    "Battle Type" + record.battle_type +
                    "Region" + record.region +
                    "Location" + record.location +
                    "Attacker Commander" + record.attacker_commander +
                    "Defender Commander" + record.defender_commander +
                    "Notes" + record.note
                );
            });

        }
    }
});

var port = 3000;

function searchBattle(bat) {

    console.log("Battle You searched for:" + bat);
}

var app = express(); // main name
app.use(cors({origin: 'http://localhost:3000'}));

//View Engine
//app.set('views',path.join(_dirname,'views')); //tell the system that our views are inthe view folder
//commented to use vanilla js
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);



//set Static folder for angular 2(client)

//app.use(express.static(path.join(_dirname,'client'))); // name of front end file

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//for vanilla js
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',index);
app.use(cors());
app.post('/comment', function(req, res) {
    console.log(req.body);
    var newComment = {
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment
    }
    pusher.trigger('flash-comments', 'new_comment', newComment);
    res.json({ created: true });
});
app.use('/api', tasks);

app.listen(port, function() {
    console.log('Server Started on Port' + port);
});