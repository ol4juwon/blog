const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/events', async (req, res) => {
    const event = req.body;
try{
   await  axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log(err);
    });
    await axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log(err);
    });
    await axios.post('http://localhost:4002/events', event);
    // axios.post('http://localhost:4003/events', event);
}catch(e){
    console.log(e.message);
}
console.log('Event ',event.type)
    res.send({status: 'OK'});
});

app.listen(4005, () => {
    console.log('Event Bus: Listening on 4005');
});

