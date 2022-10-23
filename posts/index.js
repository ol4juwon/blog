"use strict";
const express = require("express");
const {randomBytes} = require("crypto");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json())
app.use(cors());
const posts = {};
app.get("/", (req, res) => {
    res.send(posts);
});

app.post("/", async  (req, res) => {
   
    const id = randomBytes(10).toString("hex");
    const {title} = req.body;
    const data  = {id, title};
    posts[id] = {...data};
    console.log(posts);
    await axios.post("http://localhost:4005/events", {
        type: "PostCreated",
        data
    }).catch((err) => {
      console.log(err.message);
    });
    res.status(201).send(posts[id]);
});
app.post("/events", async (req, res) => {

    console.log("Received Event", req.body.type);
    res.send({});
});

app.listen(4000, () => {
  console.log("Post Service: running on port 4000");
});