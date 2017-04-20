'use strict';

// Initializes Illusion Game.
function IllusionGame() {
  this.checkSetup();

  //submit content
  this.resultForm = document.getElementById('result-form');
  this.resultSpot = document.getElementById('results');
  this.submitButton = document.getElementById('submit');

  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  this.resultForm.addEventListener('submit', this.saveAnswer.bind(this));
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

// Loads result and listens for upcoming ones.
IllusionGame.prototype.loadAnswer = function(userEmail) {
  // Reference to the illusion database path.
  this.resultRef = this.database.ref('contrast/illusionTwo');
  // Make sure we remove all previous listeners.
  this.resultRef.off();

  var setResult = function(data) {
    var val = data.val();
    this.displayAnswer(data.key, val.name, val.result);
  }.bind(this);

  this.resultRef.orderByChild('email').equalTo(userEmail).on('child_added',  setResult);
  this.resultRef.orderByChild('email').equalTo(userEmail).on('child_changed',  setResult);

};

// Saves the answer on the Firebase DB.
IllusionGame.prototype.saveAnswer = function(e) {
  e.preventDefault();
  // Check that the user moved the slider and is signed in.
  if (myAnswers.submit ==true && this.checkSignedInWithMessage()) {
    var currentUser = this.auth.currentUser;
    // Add a new entry to the Firebase Database.
    this.resultRef.push({
      name: currentUser.displayName,
      email: currentUser.email,
      test: 2,
      result: myAnswers.answer
    }).then(function() {
      this.toggleButton();
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
};

// Signs-in DIGIT.
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

    // We load answer
    this.loadAnswer(userEmail);

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

// Template for results.
IllusionGame.RESULT_TEMPLATE =
    '<div class="result-container">' +
     '<p>Your answer: ' +
      '<span class="result"></span></p>' +
    '</div>';

// Displays the answer in the UI.
IllusionGame.prototype.displayAnswer = function(key, name, answer) {
  var div = document.getElementById(key);
  var container = document.createElement('div');
  container.innerHTML = IllusionGame.RESULT_TEMPLATE;
  div = container.firstChild;
  div.setAttribute('id', key);
  this.resultSpot.appendChild(div);
  var resultElement = div.querySelector('.result');
  resultElement.textContent = answer;

  this.resultSpot.classList.add("your-results");
  this.submitButton.classList.add('hidden');

  //pass the answers to iFrame
  myAnswers.answer = answer;
  myAnswers.submit = true;
};

// Enables or disables the submit button depending on the values of the input fields.
IllusionGame.prototype.toggleButton = function() {
  if (myAnswers.submit ==true) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
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
