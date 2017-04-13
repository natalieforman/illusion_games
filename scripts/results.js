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

  //this.messageList = document.getElementById('messages');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

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
  var illusions = {
                        "illusionOne" : {
                        Title: 'Color Contrast One',
                        Div: '#viz1',
                        i: 0,
                        Data: {
                            min: 0,
                            max: 100,
                            range: [0,20,40,60,80,100]
                          },
                        Answers: {
                          total: 0,
                          results: [0, 0, 0, 0, 0]}
                        }
                        ,
                        "illusionTwo" : {
                          Title: 'Color Contrast Two', 
                          Div: '#viz2',
                          i: 0,
                          Data: {
                            min: 0,
                            max: 80,
                            range: [0,20,40,60,80]
                          },
                        Answers: {
                          total: 0,
                          results: [0, 0, 0, 0]}
                        },
                        "illusionThree" : {
                          Title: 'Color Contrast Three', 
                          Div: '#viz3',
                          i: 0,
                          Data: {
                            min: -20,
                            max: 80,
                            range: [-20, 0, 20, 40, 60, 80]
                          },
                        Answers: {
                          total: 0,
                          results: [0, 0, 0, 0, 0]}
                        }
                      };

  // Global variables
    var user_char = {};

    var store_user_char = function(user_char) {
      var char_obj = user_char;
        for(var key in char_obj){
            if(char_obj.hasOwnProperty(key)){
              //iterate over each illusion
              for(var key2 in char_obj[key]){
                //key, answer, Answers
                //set the value of the illusion
                var j = char_obj[key][key2].test-1;
                this.displayMessage(key2, illusions[Object.keys(illusions)[j]].Data, char_obj[key][key2].email, char_obj[key][key2].result, illusions[Object.keys(illusions)[j]].Answers, j);
                this.drawResults(illusions[Object.keys(illusions)[j]].Data, illusions[Object.keys(illusions)[j]].Div, illusions[Object.keys(illusions)[j]].Answers);
              }
        }
    }
  }.bind(this);

    var getChar = firebase.database().ref('contrast').orderByKey();
    getChar.on('value', function(snapshot){
        snapshot.forEach(function(child){
            var key = child.key;
            var value = child.val();
            user_char[key] = value;
        });
       store_user_char(user_char);
    });

};

IllusionGame.prototype.sortData = function(data, value, illAnswers){
  illAnswers.total += 1;
  var range = data.range;

  var length = data.range.length;
  for (var i = 0; i < length; i++){
    if (value < range[i+1]){
      illAnswers.results[i] += 1;
      break;
    }
  }
  }


IllusionGame.prototype.drawResults = function(dataR, divId, illAnswers){
    //define labels
  var divide = illAnswers.total;
  var graphAnswers = [];
  for (var j=0; j<illAnswers.results.length; j++){
    graphAnswers[j] = Math.round((illAnswers.results[j]/divide).toFixed(2)*100);
  }

  var hyph = "-";
  var name =[];
  for (var i =0; i < dataR.range.length-1; i++){
    var one = dataR.range[i].toString();
    var two = dataR.range[i+1].toString();
    var oneTwo = one.concat(hyph, two);
    name[i] = oneTwo;
  }
console.log(graphAnswers);
var graph = {
  labels: name,
  series: [graphAnswers]
};

var options = {
scaleMinSpace: 40,
fullWidth: true,
  chartPadding: {
    right: 40
  },
  axisY: {
    onlyInteger: true
  },
  high: 100,
  low: 0
};

new Chartist.Bar(divId, graph, options);
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
    this.userEmail = user.email;

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
IllusionGame.prototype.displayMessage = function(key, data, email, result, illAnswers, i) {
  if (email == this.userEmail){
    this.displayAnswer(key, result, i);
  }
  var test = this.sortData(data, result, illAnswers);
};

// Displays a Message in the UI.
IllusionGame.prototype.displayAnswer = function(key, result, i) {
  console.log(result);
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = IllusionGame.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    var entry = document.getElementById('messages'+i);
    entry.appendChild(div);
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
