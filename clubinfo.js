import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// TODO: import libraries for Cloud Firestore Database
// https://firebase.google.com/docs/firestore
import { getFirestore, collection, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyAH3oWF9S-ePd0352Ca-TdE5cu6oinzlXo",
authDomain: "softwareengineering-94854.firebaseapp.com",
projectId: "softwareengineering-94854",
storageBucket: "softwareengineering-94854.appspot.com",
messagingSenderId: "565847408909",
appId: "1:565847408909:web:9e116dae6ede6b965bb044"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//changes the sessionStorage to what is in the parameter
export async function setClub(clubName){
//makes a variable called showClub, set its value to be the parameter
sessionStorage.setItem("showClub", clubName);
console.log(sessionStorage.getItem("showClub"));
}

export const showClubs = async function(){
const databaseItems = await getDocs(collection(db, "clubs"));
var names = document.getElementById("clubs");
names.innerHTML = "";
databaseItems.forEach((item) => {
// for(item.data() in data){

var clubTile = document.createElement("button");
clubTile.classList.add('clubButton');
clubTile.innerHTML=item.data().clubName;
clubTile.onclick = function() {
location.replace("clubDash.html");
sessionStorage.setItem("club", item.data().username);
//this does somehting when the club tile is clicked
}
names.appendChild(clubTile);
// }
});
}




// -- dispays each clubs information after getting selected/clicked in theclub dashboard page --
export const displayClubInfo = async function(){
console.log("displayClubInfo triggered");
// gets the club name that was clicked from session storage
var parentName = sessionStorage.getItem("club");
// pulling the specific club from database
const parentDocRef = doc(db, "clubs", parentName);
const clubDoc = await getDoc(parentDocRef);
// gets the text in the header to then clear (default is club dash)
var clubName = document.getElementById("clubName");
clubName.innerHTML = "";
// gets the elements to append things to from HTML
// and sets their text to something user will understand
var bio = document.getElementById("bio");
bio.innerHTML = "About Us:";
var quickFacts = document.getElementById("quickFacts");
quickFacts.innerHTML = "Club information:";

// sets header to the club name
// (I could have also done this form session storage)
clubName.innerHTML = clubDoc.data().clubName;
// sets/creates feilds and assighns fire base values to them
var clubBio = document.createElement("h4");
clubBio.innerHTML=clubDoc.data().bio;
var dateFounded = document.createElement("h4");
dateFounded.innerHTML="Date founded: " + clubDoc.data().yearFounded;
var meetingPlan = document.createElement("h4");
meetingPlan.innerHTML="Meeting frequency: " + clubDoc.data().meetingTime;

var numMembers = document.createElement("h4");
numMembers.innerHTML="Number of members: " + clubDoc.data().memberCount;

var leaderNames = document.createElement("h4");
leaderNames.innerHTML = "Club Leaders: "
clubDoc.data().clubLeaders.forEach((leader) => {
leaderNames.innerHTML += leader + ", ";
});
leaderNames.innerHTML = leaderNames.innerHTML.slice(0,-2);
console.log("read comands");
// appends created objects to the html

bio.appendChild(clubBio);
quickFacts.appendChild(leaderNames);
quickFacts.appendChild(dateFounded);
quickFacts.appendChild(meetingPlan);
quickFacts.appendChild(numMembers);
displayMeetingInfo(clubDoc.id);
return
} 


async function displayMeetingInfo(id){
  console.log("sorting dates!");

  const pastMeetings = [];
  const futureMeetings = [];

  // Gets today's date to compare meetings.
  let today = new Date();

  // Reference to the club document using the passed id.
  const docRef = doc(db, "clubs", id);

  // Get a reference to the subcollection "all-meetings" within the club document.
  const meetingsCollectionRef = collection(docRef, "all-meetings");

  // Fetch all the meeting documents from the subcollection.
  const databaseItems = await getDocs(meetingsCollectionRef);

  // Loop through each meeting fetched from Firestore
  databaseItems.forEach((meeting) => {
    // Create a meeting object with necessary data.
    let meet = {
      date: meeting.data().date.toDate(),
      description: meeting.data().description,
      meetingID: meeting.id,
      attendance: meeting.data().attendance
    };

    // Check if the meeting's date is in the future or past and push to appropriate array.
    if(meet.date > today){
      futureMeetings.push(meet); // Future meeting
    }
    else{
      pastMeetings.push(meet); // Past meeting
    }
  });
  
  // Sort both future and past meetings by date using helper function (compareDates).
  pastMeetings.sort(compareDates);
  futureMeetings.sort(compareDates);

  var outlook = document.getElementById("outlook"); // Get reference to "outlook" section.
  var meetingLog = document.getElementById("meetingLog"); // Get reference to "meetingLog" section.

  // Loop through future meetings and create div elements for each.
  futureMeetings.forEach((meeting) => {
    var meetingDiv = document.createElement("div");
    var meetingInfo = document.createElement("div");
    var editMeetingDiv = document.createElement("div");
    
    // Create and style button for deleting the meeting
    var editbutton = document.createElement("button");
    editbutton.innerHTML = "Delete";
    
    // Add appropriate classes for styling
    meetingInfo.classList.add('meetingBox');
    editMeetingDiv.classList.add('editMeetingDiv');
    meetingDiv.classList.add('meetingDiv');
    editbutton.classList.add('meetingEdit');

    // When clicked, it triggers the showDeleteModal with meetingID
    editbutton.onclick = function() {
      showDeleteModal(meeting.meetingID, id); 
    };

    // Append button and info to the meeting div
    editMeetingDiv.appendChild(editbutton);
    meetingDiv.appendChild(meetingInfo);
    meetingDiv.appendChild(editMeetingDiv);

    // Populate meeting details
    meetingInfo.innerHTML = `
      <p>Date: ${meeting.date.toLocaleDateString()}</p>
      <p>Time: ${meeting.date.toLocaleTimeString()}</p>
      <p>Meeting info: ${meeting.description}</p>
    `;

    // Append the meeting div to the "outlook" section
    outlook.appendChild(meetingDiv);
  });

  // Add button to register a new meeting
  var addEventDiv = document.createElement("div");
  var addButton = document.createElement("button");
  addEventDiv.classList.add('addEventDiv');
  addButton.classList.add('meetingEdit');
  addButton.classList.add('addButton');
  addButton.innerHTML = "register new meeting";
  
  // Append the "add new meeting" button
  addEventDiv.appendChild(addButton);
  outlook.appendChild(addEventDiv);

  // Loop through past meetings and create div elements for each.
  pastMeetings.forEach((meeting) => {
    var meetingDiv = document.createElement("div");
    var meetingInfo = document.createElement("div");
    var editMeetingDiv = document.createElement("div");
    var editbutton = document.createElement("button");
    var saveButton = document.createElement("button");
    var cancleButton = document.createElement("button");
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";

    // Set buttons to be hidden by default.
    saveButton.style.display = "none";
    cancleButton.style.display = "none";
    editbutton.innerHTML = "Edit";
    saveButton.innerHTML = "Save";
    cancleButton.innerHTML = "Cancle";

    // Add appropriate classes for styling
    meetingInfo.classList.add('meetingBox');
    editMeetingDiv.classList.add('editMeetingDiv');
    meetingDiv.classList.add('meetingDiv');
    editbutton.classList.add('meetingEdit');
    saveButton.classList.add('meetingEdit');
    deleteButton.classList.add('meetingEdit');
    cancleButton.classList.add('meetingEdit');
    saveButton.classList.add('meetingEditConf');
    cancleButton.classList.add('meetingEditConf');

    // Set unique ids for buttons using meetingID
    editbutton.id = `editButton-${meeting.meetingID}`;
    saveButton.id = `saveButton-${meeting.meetingID}`;
    cancleButton.id = `cancleButton-${meeting.meetingID}`;

    // Handle the "Edit" button click
    editbutton.onclick = function() {
      // Call the edit function with meetingID and club ID
      editMeetingInfo(meeting.meetingID, id); 
      editbutton.style.display = "none"; // Hide Edit button
      saveButton.style.display = "flex"; // Show Save button
      cancleButton.style.display = "flex"; // Show Cancel button
    };

    // Handle the "Cancel" button click
    cancleButton.onclick = function() {
      location.reload(); // Reloads the page to revert changes.
    };

    deleteButton.onclick = function() {
      showDeleteModal(meeting.meetingID,id); 
    };

    // Append the buttons and meeting info div
    editMeetingDiv.appendChild(editbutton);
    editMeetingDiv.appendChild(deleteButton);
    editMeetingDiv.appendChild(saveButton);
    editMeetingDiv.appendChild(cancleButton);

    meetingDiv.appendChild(meetingInfo);
    meetingDiv.appendChild(editMeetingDiv);

    // Populate meeting details for past meetings
    meetingInfo.innerHTML = `
      <p>Date: ${meeting.date.toLocaleDateString()}</p>
      <p>Time: ${meeting.date.toLocaleTimeString()}</p>

      <div class="infoContainer">
        <span>Attendance:</span>
        <span id="attendance-${meeting.meetingID}">${meeting.attendance}</span>
      </div>

      <div class="infoContainer">
        <span>Meeting recap:</span>
        <span id="recap-${meeting.meetingID}">${meeting.description}</span>
      </div>
    `;

    // Append the meeting div to the "meetingLog" section
    meetingLog.appendChild(meetingDiv);
  });
}

// simple helperfuntion to compare dates durring sorting
// (I had to look into this, but it should be correct)
function compareDates(meetingA, meetingB) {
  return new Date(meetingA.date) - new Date(meetingB.date);
}

async function showDeleteModal(meetingID, id) {
  // I want to add sone of the meeting info club, date, time
  // so that the user can see what meeting they are deleteing before they delete it!

  console.log('meeting delete double check!')
  // clubID should be the name of the club
  const clubID = sessionStorage.getItem("club"); 
  console.log(clubID);
  console.log(meetingID);
  // Show the delete confirmation modal
  const modal = document.getElementById("deleteConfModal");
  modal.style.display = "flex";
  document.getElementById('confDelete').onclick = function (){
    deleteMeeting(meetingID, id);
  }
}

async function deleteMeeting(meetingID, id) {
  console.log('meeting delete function activated...');
  const docRef = doc(db, "clubs", id);
    // Get a reference to the subcollection "all-meetings"
    const meetingsCollectionRef = collection(docRef, "all-meetings");
    const databaseItem = doc(meetingsCollectionRef, meetingID);
    await deleteDoc(databaseItem);
    console.log("deleted!");
    location.reload();
}

async function editMeetingInfo(meetingID, id) {
  console.log('meeting edit function activated!');

  // Get the actual DOM elements for attendance and recap using dynamic IDs
  const attendanceElement = document.getElementById(`attendance-${meetingID}`);
  const recapElement = document.getElementById(`recap-${meetingID}`);

  // Get the text content of these elements
  const attendanceCount = attendanceElement.textContent.replace('Attendance : ', ''); // Removing "Attendance : " part
  const meetingRecap = recapElement.textContent.replace('Meeting recap: ', ''); // Removing "Meeting recap: " part

  // Create text input and textarea elements
  const attendanceInput = document.createElement('input');
  const recapInput = document.createElement('textarea');
  attendanceInput.classList.add("attendance");
  recapInput.id = 'recapInput';

  // Set the value of the input to the current text of the paragraph
  attendanceInput.value = attendanceCount; // Assigning the text value to the input
  recapInput.value = meetingRecap; // Assigning the text value to the textarea

  // Replace the paragraph elements with the input boxes
  attendanceElement.parentNode.replaceChild(attendanceInput, attendanceElement);
  recapElement.parentNode.replaceChild(recapInput, recapElement);

  // saving info:
  const saveButtonElement = document.getElementById(`saveButton-${meetingID}`);

  // Add a click event listener for the save button
  saveButtonElement.onclick = async function() {
    console.log("Save button clicked!");
    const docRef = doc(db, "clubs", id);
    // Get a reference to the subcollection "all-meetings"
    const meetingsCollectionRef = collection(docRef, "all-meetings");
    const databaseItem = doc(meetingsCollectionRef, meetingID);
    console.log("GAHHHH");
            // const databaseItemSnapshot = await getDoc(databaseItem);
            // const oldAttendance = databaseItemSnapshot.attendance;
            // console.log(oldAttendance);
            // // const isEvent = databaseItemSnapshot.isEvent;
            // console.log(isEvent);
    // Get the new values from input fields and removes white space
    const newAttendanceString = attendanceInput.value.trim();
    // Convert the string to an integer
    const newAttendance = parseInt(newAttendanceString, 10); // base 10/normal
    const newRecap = recapInput.value;
    //checks to see if the new attendance value works (not zero)
    if (!isNaN(newAttendance) && newRecap){
      await updateDoc(databaseItem,{
        attendance: newAttendance,
        description: newRecap,
      });
      // Log success
      console.log('Document successfully updated!');
      // updatePoints(id, oldAttendance, newAttendance, isEvent, oldEventStatus);
    }
    else{
      console.log('failure to update');
    };
    console.log("end");
    location.reload();
  };
}






var clubLogin = false;
export async function cLogin() {
  var docRef = doc(db, "clubs", sessionStorage.getItem("club"))
  var docSnap = await getDoc(docRef)
  if (sessionStorage.getItem("password") == docSnap.data().password){
    clubLogin = true;
    console.log("club login working")
    location.replace(clubDash.html)
  }else{
    alert('Wrong Username or Password')
    console.log("wrong username/password")
  }
}
