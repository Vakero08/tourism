const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 7979;
class Server {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use(cors({ origin: "*" }));
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ limit: "50mb" }));
  }
  routes() {
    this.app.use("/images", require("./routes/routesImages"));
  }

  listen() {
    this.app.listen(PORT, () => {
      console.log("Server Runnign in port: " + PORT);
    });
  }
}

module.exports = Server;
