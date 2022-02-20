import { process } from './dotenv.js';

(function Chat() {

  const firebaseConfig = {
    apiKey: process.env('API_KEY'),
    authDomain: process.env('AUTH_DOMAIN'),
    projectId: process.env('PROJECT_ID'),
    storageBucket: process.env('STORAGE_BUCKET'),
    messagingSenderId: process.env('SENDER_ID'),
    appId: process.env('APP_ID')
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // handle on firebase db
  const db = firebase.database();

  // get elements
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const profileDisplay = document.getElementById('profile-display');
  const loginDisplay = document.getElementById('login-block');
  const login = document.getElementById('login');
  const signup = document.getElementById('signup');
  const message = document.getElementById('message');
  const write = document.getElementById('write');
  const status = document.getElementById('status');
  const userNameDisplay = document.getElementById('name-display'); // element that can show the current user's email
  const chat = document.getElementById('chat-box');
  let currentUserEmail = ''; // variable to store the current user's email

  // write
  write.addEventListener('click', (e) => {
    const messages = db.ref('messages');

    // simple id - ok for example, do not use in production
    const id = new Date().getTime();

    messages
      .child(id)
      .set({ message: message.value, sender: currentUserEmail })
      .then(function () {
        console.log('Wrote to DB!');
        message.value = '';
      });
  });

  const messagesRef = db.ref('messages');
  messagesRef.on('value', () => handleRead());

  function handleRead() {
    status.innerHTML = '';
    chat.innerHTML = '';
    const messages = db.ref('messages');

    messages.once('value').then(function (dataSnapshot) {
      var data = dataSnapshot.val();
      if (data) {
        var keys = Object.keys(data);

        keys.slice(keys.length - 5).forEach(function (key) {
          console.log(data[key]);
          if (data[key]['sender'] && data[key]['sender'] == currentUserEmail) {
            chat.innerHTML += '<div class="message-lockup" style="justify-content: left;"><div class="sender">' +
            (data[key]['sender'] || '') +
            '</div><br><div class="message">' +
            data[key].message +
            '</div></div>';
          }
          else {
            chat.innerHTML += '<div class="message-lockup"><div class="sender" style="text-align:right">' +
            (data[key]['sender'] || '') +
            '</div><br><div class="message">' +
            data[key].message +
            '</div></div>';
          }
        });
      }
    });
  }

  // TODO: in this function you should set the userNameDisplay.innerHTML to the passed in userEmail as well as updating the currentUserEmail variable to that same value
  function updateCurrentUser(userEmail) {
    currentUserEmail = userEmail;
    handleRead();
    userNameDisplay.innerHTML = '<b>' + currentUserEmail + '</b>';
  }

  // login
  login.addEventListener('click', (e) => {
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(
      email.value,
      password.value
    );
    promise.then((resp) => {
      console.log('User Login Response: ', resp);
      profileDisplay.style.display = 'flex';
      loginDisplay.style.display = 'none';
      write.style.display = 'inline';
      email.value = '';
      password.value = '';
      updateCurrentUser(resp.user.email);
    });
    promise.catch((e) => console.log(e.message));
  });

  // signup
  signup.addEventListener('click', (e) => {
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(
      email.value,
      password.value
    );
    promise.then((resp) => {
      console.log('User Signup + Login Response: ', resp);
      profileDisplay.style.display = 'flex';
      loginDisplay.style.display = 'none';
      write.style.display = 'inline';
      email.value = '';
      password.value = '';
      updateCurrentUser(resp.user.email);
    });
    promise.catch((e) => console.log(e.message));
  });

  // logout
  logout.addEventListener('click', (e) => {
    firebase
      .auth()
      .signOut()
      .then((resp) => {
        console.log('Logout Response: ', resp);
        profileDisplay.style.display = 'none';
        loginDisplay.style.display = 'block';
        write.style.display = 'none';
        updateCurrentUser('');
      })
      .catch((e) => console.warn(e.message));
  });
})();
