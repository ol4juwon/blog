const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};


app.post('/events', async (req, res) => {

    const {type, data} = req.body;
    if( type === 'PostCreated'){
            const {id, title} = data;

            posts[id] = {id, title, comments: []};
    }
  if (type === 'CommentCreated') {
    const {id, comments, postId} = data;
    const status = data.comments.includes('orange') ? 'rejected' : 'approved';
    await axios.post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
            id,
            postId,
            comments,
            status
        }
    }).catch((err) => {
        console.log(err.message);
    });
  }

    res.send({status: 'OK'});
}

);

app.listen(4003, () => {
    console.log('Moderation service: Listening on 4003');
});
