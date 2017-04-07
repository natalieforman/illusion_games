/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
'use strict';

// Initializes Illusion Game.
function IllusionGame() {
  this.checkSetup();

  this.messageList = document.getElementById('messages');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.illusionOne = {
    total: 0,
    answers: [0, 0, 0, 0, 0],
  };
  this.illusionOne.i = 0;

  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));
  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
IllusionGame.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Loads chat messages history and listens for upcoming ones.
IllusionGame.prototype.loadMessages = function(userEmail) {
  // Reference to the /messages/ database path.
  this.messagesRef = this.database.ref('contrast/illusionOne');
  // Make sure we remove all previous listeners.
  this.messagesRef.off();
  // Loads the users
  var setMessage = function(data) {
    var val = data.val();
    //this.displayMessage(data.key, val.name, val.result);
    //displays message and sorts results
    this.displayMessage(data.key, val.result);
    this.drawResults("viz");
  }.bind(this);
  // Loads the users
  var setAnswer = function(data) {
    var val = data.val();
    //this.displayMessage(data.key, val.name, val.result);
    //displays message and sorts results
    this.displayAnswer(data.key, val.result);
  }.bind(this);
  //only show personal results
  // var query = this.messagesRef.orderByChild('email').equalTo(userEmail);
  // query.once('value').then(function(data){
  //   data.forEach(function(dataChild) {
  //     var key = dataChild.val();
  //     this.sortData(key.result);
  //   });
  // });
  // this.drawResults();

  this.messagesRef.orderByChild('email').on('child_added',  setMessage);
  this.messagesRef.orderByChild('email').on('child_changed',  setMessage);

  this.messagesRef.orderByChild('email').equalTo(userEmail).on('child_added',  setAnswer);
  this.messagesRef.orderByChild('email').equalTo(userEmail).on('child_changed',  setAnswer);
};

IllusionGame.prototype.sortData = function(value){
  this.illusionOne.total += 1;
  //this.illusionOne.answers[this.illusionOne.i] = value;
  if (value <20){
      this.illusionOne.answers[0] += 1;
  }
  else if (value <40){
    this.illusionOne.answers[1] += 1;
  }
  else if (value <60){
    this.illusionOne.answers[2] += 1;
  }
  else if (value <80){
    this.illusionOne.answers[3] += 1;
  }
  else{
    this.illusionOne.answers[4] += 1;
  }
  console.log(this.illusionOne.total);
  console.log(this.illusionOne.answers);
  this.illusionOne.i += 1;
}


IllusionGame.prototype.drawResults = function(divId){
  if(document.getElementById(divId).innerHTML != ""){
    document.getElementById(divId).innerHTML = "";
  }
  var plotP = this.illusionOne.answers;
  var total = this.illusionOne.total;

  //define variables
  var data = plotP;
  var name = ["0-19", "20-39", "40-59", "60-79", "80-100"];
  var width = 350,
      barHeight = 30;
  var x = d3.scale.linear()
      .domain([0, d3.max(data)])
      .range([0, width]);
  //create svg
  var svg = d3.select("#"+divId)
    .append("svg")
    .attr('class', 'chart')
    .attr('width', 435)
    .attr('height', 175);
  //add labels
  svg.selectAll("text.name")
    .data(name)
    .enter().append("text")
    .attr("transform", function(d, i) { return "translate(0," + (i * barHeight+20) + ")"; })
    .attr('class', 'name')
    .text(String);
  //create bars
  var bar = svg.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(80," + i * barHeight + ")"; });
  bar.append("rect")
      .attr("width", x)
      .attr("height", barHeight - 2);
  //add percentages
  bar.append("text")
      .attr("class", "text")
      .attr("x", function(d) { return x(d) - 35; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return (Math.round( d/total * 100 ) + '%'); });
  };

// Signs-in to DIGIT.
IllusionGame.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Signs-out of DIGIT.
IllusionGame.prototype.signOut = function() {
  // Sign out of Firebase.
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
IllusionGame.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL;
    var userName = user.displayName;
    var userEmail = user.email;

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.classList.remove('hidden');
    this.userPic.classList.remove('hidden');
    this.signOutButton.classList.remove('hidden');

    // Hide sign-in button.
    this.signInButton.classList.add('hidden');

    // We load currently existing chant messages.
    this.loadMessages(userEmail);
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.classList.add('hidden');
    this.userPic.classList.add('hidden');
    this.signOutButton.classList.add('hidden');

    // Show sign-in button.
    this.signInButton.classList.remove('hidden');
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
IllusionGame.prototype.checkSignedInWithMessage = function() {
  // Return true if the user is signed in Firebase
  if (this.auth.currentUser) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

// Resets the given MaterialTextField.
IllusionGame.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
IllusionGame.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
    '<div><p>Your Answer:</p></div>' +
      '<div class="message"></div>' +
    '</div>';

// A loading image URL.
IllusionGame.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
IllusionGame.prototype.displayMessage = function(key, result) {
  var test = this.sortData(result);
};

// Displays a Message in the UI.
IllusionGame.prototype.displayAnswer = function(key, result) {
  console.log(result);
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = IllusionGame.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  var messageElement = div.querySelector('.message');
  messageElement.textContent = result;
};

// Checks that the Firebase SDK has been correctly setup and configured.
IllusionGame.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
  } else if (config.storageBucket === '') {
    window.alert('Your Cloud Storage bucket has not been enabled. Sorry about that. This is ' +
        'actually a Firebase bug that occurs rarely. ' +
        'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
        'and make sure the storageBucket attribute is not empty. ' +
        'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
        'displayed there.');
  }
};

window.onload = function() {
  window.illusionGame = new IllusionGame();
};
