const { Router } = require("express");
const imagesController = require("../controllers/imagesController");
const imagesSend = require("../controllers/imagesSend");

const route = new Router();

route.get("/sitios", imagesController);
route.get("/image/:name", imagesSend);

module.exports = route;
