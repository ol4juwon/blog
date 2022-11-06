const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};
const handleEvent = (type, data) => {

  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }
  if (type === 'CommentCreated') {
    const { id, comments, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, comments, status });
  }

  if (type === 'CommentUpdated') {
    const { id, comments, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find(comment => {
      return comment.id === id;
    });
    comment.status = status;
    comment.comments = comments;
  }

}
app.get('/posts', async (req, res) => {

  res.send(posts);

});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({ status: 'OK' });
});


app.listen(4002, async () => {
    console.log('Query service: Listening on 4002');
  try {
    const res = await axios.get('http://localhost:4005/events');
    for (let event of res.data) {
      handleEvent(event.type, event.data);
    }
  }
  catch (err) {
    console.log(err.message);
  }


});
