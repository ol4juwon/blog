"use strict";
const express = require("express");
const {randomBytes} = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(bodyParser.json());
app.use(cors());
const comments = {};
app.get("/posts/:id/comments", (req, res) => {
    const response = comments[req.params.id] || [];
    res.send(response).status(200);
});

app.post("/posts/:id/comments", (req, res) => {
   
    const id = randomBytes(10).toString("hex");
    const {comment} = req.body;
    const data  = {id, comments:comment, status: 'pending'};
    const postId = req.params.id;
    comments[postId] = comments[postId] || [];
    comments[postId].push(data);
    axios.post("http://localhost:4005/events", {
        type: "CommentCreated",
        data: {...data, postId}
    }).catch((err) => {
        console.log(err.message);
    });
    res.status(201).send(comments[postId]);
});

app.post("/events", async (req, res) => {
    const {type, data} = req.body;
    console.log("Event Received:", type);

    if ( type === 'CommentModerated') {
        const {postId, id, status ,comments: comms} = data;
        const commentss = comments[postId];
        const comment = commentss.find(comment => comment.id === id);
        comment.status = status;
        await axios.post("http://localhost:4005/events", {
            type: "CommentUpdated",
            data: {
                id,
                postId,
                comments:comms,
                status
            }
        }).catch((err) => {
            console.log(err.message);
        });
    }
    res.send({});
});
app.listen(4001, () => {
  console.log("Comments Service: running on port 4001");
});