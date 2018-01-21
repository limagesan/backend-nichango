var express = require("express");
var router = express.Router();
var log4js = require("log4js");
var logger = log4js.getLogger();
var User = require("../models/user.model");
var Room = require("../models/room.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var users = require("./users");
const httpStatus = require("http-status");
const saltRounds = 10;

const titles = ["タイトル1", "タイトル2", "タイトル2", "タイトル3", "タイトル4", "タイトル5", "タイトル6"];

function setTitles(titles) {}

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

// router.post("/login", login);

// ユーザー作成
// router.post("/users", createUser);
// router.options("/users", (req, res, next) => {
//   res.status(200).send();
// });

router.post("/room", createRoom);
router.options("/room", (req, res, next) => {
  res.status(200).send();
  return;
});

router.get("/title", (req, res, next) => {
  res.json({ title: titles[Math.floor(Math.random() * titles.length)] });
});

router.get("/test", (req, res, next) => {
  // Room.findById(req.query.roomId, room => {
  //   res.json({ room });
  // });

  const room = new Room({
    title: "oioi",
    texts: ["aaa"]
  });

  // room.save().then(room => {
  //   console.log("saved");
  //   res.json({ room });
  // });

  room.save().then(savedUser => {
    res.json({
      success: true,
      message: "Authentication successfully finished."
    });
  });
  // res.json({ ok: "yes" });
  return;
});

router.get("/room", (req, res, next) => {
  Room.find({}, (err, rooms) => {
    if (err) {
      logger.error(err);
      return res.json([]);
    }
    res.json(rooms);
  });
});

router.get("/room/:roomId", getRoom);
router.options("/room", (req, res, next) => {
  res.status(200).send();
  return;
});

router.post("/room/:roomId/text", postText);

function getRoom(req, res, next) {
  console.log("id is", req.params.roomId);
  Room.findOne({ _id: req.params.roomId }, (err, room) => {
    res.json({ room });
  });
}

function postText(req, res, next) {
  const id = req.params.roomId;
  Room.findOne({ _id: id }, (err, room) => {
    const newTexts = room.texts.concat(req.body.text);
    Room.update({ _id: id }, { texts: newTexts }, err => {
      if (err) logger.error(err);
    });
  });
  res.send(200);
}

function createRoom(req, res, next) {
  // const texts = [];
  const room = new Room({
    title: req.body.title,
    texts: []
  });

  room.save().then(savedUser => {
    res.json({
      success: true,
      message: "room is created",
      room: room
    });
  });
}

// function compareHash(str, hash) {
//   return new Promise((resolve, reject) => {
//     bcrypt.compare(str, hash, (err, res) => {
//       if (err) reject(err);
//       else resolve(res);
//     });
//   });
// }

// function login(req, res, next) {
//   User.findOne({ username: req.body.username }, async function(err, user) {
//     if (err) throw err;

//     // validation
//     if (!user) {
//       res.status(401);
//       res.json({
//         success: false,
//         message: "Authentication failed. User not found."
//       });
//       return;
//     }

//     const auth = await compareHash(req.body.password, user.password);
//     if (!auth) {
//       res.status(401);
//       res.json({
//         success: false,
//         message: "Authentication failed. Wrong password.",
//         status: 401
//       });
//       return;
//     }

//     // when valid -> create token
//     var token = jwt.sign(
//       {
//         username: user.username,
//         password: user.password
//       },
//       process.env.SECRET || "secret",
//       {
//         expiresIn: "24h"
//       }
//     );

//     res.json({
//       success: true,
//       message: "Authentication successfully finished.",
//       token: token
//     });
//   });
// }

module.exports = router;
