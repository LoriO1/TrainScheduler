// Initialize Firebase
var config = {
  apiKey: "AIzaSyCukCDBaSYnjUyUaeRSYPfVgsQ6KP0E58M",
  authDomain: "test-4326d.firebaseapp.com",
  databaseURL: "https://test-4326d.firebaseio.com",
  projectId: "test-4326d",
  storageBucket: "test-4326d.appspot.com",
  messagingSenderId: "483985313125"
};
firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

// --------------------------------------------------------------

// update the page in real-time when the firebase database changes.
database.ref().on("child_added", function (snapshot) {
  // If Firebase has a data stored (first case) 
  // console.log("snapshot val", snapshot.val());

  // Set the variables for data equal to the stored values in firebase.
  var fireTrain = snapshot.val().trainName;
  var fireDest = snapshot.val().destination;
  var fireFirstTime = snapshot.val().arrival;
  var fireFreq = snapshot.val().frequency;
  var fireTime = moment.unix(fireFirstTime).format("HH:mm")
  //console.log("standard time / fire time", fireTime)

  var currentMilitaryTime = fireTime;
  var timeSplit = currentMilitaryTime.split(':');
  var trainTime = moment()
    .hours(timeSplit[0])
    .minutes(timeSplit[1])
  var max = moment.max(moment(), trainTime);
  var trainMinutes = 0;
  var trainArrival;
  
  if (max === trainTime) {
  trainArrival = moment(trainTime, "HH:mm");
  // console.log('arr', trainArr)
  trainMinutes = trainArrival.diff(moment(), "minutes");
  trainArrival = currentMilitaryTime
} else {
  var timeDifference = moment().diff(trainTime, "minutes");
  var timeRemainder = timeDifference % fireFreq;
  trainMinutes = fireFreq - timeRemainder;
  trainArrival = moment()
    .add(trainMinutes, "m")
    .format('HH:mm')
}
  
console.log('minutes', trainMinutes)
console.log('arrival', trainArrival)

  var tableRow = $("<tr>").append(
    $("<td>").text(fireTrain),
    $("<td>").text(fireDest),
    $("<td>").text(fireFreq),
    $("<td>").text(trainArrival),
    $("<td>").text(trainMinutes)
  );

  // append the new row to the table
  $("#trainDetails").append(tableRow);

  // }, function (errorObject) {
  //   console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------

// when user clicks submit...
$("#submit").on("click", function (event) {
  // prevent form from submitting
  event.preventDefault();
  // values from the DOM collected and pushed to Firebase
  var train = $("#train-name").val().trim();
  var dest = $("#destination").val().trim();
  var time = moment($("#firstTime").val().trim(), "HH:mm").format("X");
  var freq = $("#frequency").val().trim();
  // object created from the above variables
  var newTrain = {
    trainName: train,
    destination: dest,
    frequency: freq,
    arrival: time
  };

  // Save the new data in Firebase
  database.ref().push(newTrain)

  // clear out values still displayed in table in the DOM
  $("#train-name").val('');
  $("#destination").val('');
  $("#firstTime").val('');
  $("#frequency").val('');
});