const express = require('express');
const firebase = require('firebase');

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const app = express();

app.use(express.json());

let options = {
    dotfiles: "ignore",
    redirect:false
}
app.use(express.static('public', options));

app.get('/messages', (req, res) => {
  const messages = db.ref('messages');
  res.send(messages);
})

app.post('/message', (req, res) => {
  const messages = db.ref('messages');
  messages
  .child(id)
  .set({ message: req.body.message, sender: req.body.sender });
})


