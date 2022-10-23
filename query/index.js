const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};

app.get('/posts', async (req, res) => {
    
    res.send(posts);

});

app.post('/events', async (req, res) => {
    const {type, data} = req.body;
    if( type === 'PostCreated'){
            const {id, title} = data;

            posts[id] = {id, title, comments: []};
    }
  if (type === 'CommentCreated') {
    const {id, comments, postId} = data;
    console.log(data)
    console.log(posts)
    const post = posts[postId];
    post.comments.push({id, comments});
  }

    res.send({status: 'OK'});
});


app.listen(4002, () => {
    console.log('Query service: Listening on 4002');
});
