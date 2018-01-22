var express = require("express");
var router = express.Router();
var log4js = require("log4js");
var logger = log4js.getLogger();
var Room = require("../models/room.model");
const httpStatus = require("http-status");
const fs = require("fs");

let titles = fs.readFileSync("./data/titles.csv", "utf8");
titles = titles.split("\r");
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/room", createRoom);
router.options("/room", (req, res, next) => {
  res.status(200).send();
  return;
});

router.get("/title", (req, res, next) => {
  res.json({ title: titles[Math.floor(Math.random() * titles.length)] });
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
    const newTexts = Array.prototype.concat(req.body.text, room.texts);
    Room.update({ _id: id }, { texts: newTexts }, err => {
      if (err) logger.error(err);
    });
  });
  res.send(200);
}

function createRoom(req, res, next) {
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

module.exports = router;
