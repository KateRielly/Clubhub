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
  //gets todays date
  let today = new Date();
  // Reference to the club document
  const docRef = doc(db, "clubs", id);
  // Get a reference to the subcollection "all-meetings"
  const meetingsCollectionRef = collection(docRef, "all-meetings");
  const databaseItems = await getDocs(meetingsCollectionRef); // Now, we are getting the meetings from the subcollection


  databaseItems.forEach((meeting) => {
    //give the object atributes
    let meet = {
      date: meeting.data().date.toDate(),
      description: meeting.data().description,
      meetingID:meeting.id,
      attendance: meeting.data().attendance
    };
    //checks to see if the date is before or after today and appends it tothe right array
    if(meet.date > today){
      futureMeetings.push(meet);
    }
    else{
      pastMeetings.push(meet);
    }
  });
 
  //should sort the arrays by time (using helper function)
  pastMeetings.sort(compareDates);
  futureMeetings.sort(compareDates);
  var outlook = document.getElementById("outlook");
  var meetingLog = document.getElementById("meetingLog");

  //creates proper divs in future meeting section
  futureMeetings.forEach((meeting) => {
    var meetingDiv = document.createElement("div");

    var meetingInfo = document.createElement("div");
    var editMeetingDiv = document.createElement("div");
    // Assign a class to it
    meetingInfo.classList.add('meetingBox');
    editMeetingDiv.classList.add('editMeetingDiv');
    var editbutton = document.createElement("button");
    editbutton.innerHTML = "Delete";

    // Assign a class to it
    meetingInfo.classList.add('meetingBox');
    editMeetingDiv.classList.add('editMeetingDiv');
    meetingDiv.classList.add('meetingDiv');
    editbutton.classList.add('meetingEdit');

    editbutton.onclick = function() {
      // provides the meetingID for my showDeleteModal function
      showDeleteModal(meeting.meetingID); 
    };

    editMeetingDiv.appendChild(editbutton);
    meetingDiv.appendChild(meetingInfo);
    meetingDiv.appendChild(editMeetingDiv);

    meetingInfo.innerHTML = `
      <p>Date: ${meeting.date.toLocaleDateString()}</p>
      <p>Time: ${meeting.date.toLocaleTimeString()}</p>
      <p>Meeting info: ${meeting.description}</p>
    `;
    outlook.appendChild(meetingDiv);
  });

  var addEventDiv = document.createElement("div");
  var addButton = document.createElement("button");
  addEventDiv.classList.add('addEventDiv');
  addButton.classList.add('meetingEdit');
  addButton.classList.add('addButton');
  addButton.innerHTML = "register new meeting";
  addEventDiv.appendChild(addButton);
  outlook.appendChild(addEventDiv);

  //creates proper divs in past meeting section
  pastMeetings.forEach((meeting) => {
    var meetingDiv = document.createElement("div");
    var meetingInfo = document.createElement("div");
    var editMeetingDiv = document.createElement("div");
    var editbutton = document.createElement("button");
    var saveButton = document.createElement("button");
    var cancleButton = document.createElement("button");
    // Set the buttons to be hidden by default
    saveButton.style.display = "none";
    cancleButton.style.display = "none";
    editbutton.innerHTML = "Edit"
    saveButton.innerHTML = "Save";
    cancleButton.innerHTML = "Cancle";

    // Assign a class to it
    meetingInfo.classList.add('meetingBox');
    editMeetingDiv.classList.add('editMeetingDiv');
    meetingDiv.classList.add('meetingDiv');
    editbutton.classList.add('meetingEdit');
    saveButton.classList.add('meetingEdit');
    cancleButton.classList.add('meetingEdit');
    saveButton.classList.add('meetingEditConf');
    cancleButton.classList.add('meetingEditConf');

    editbutton.id = `editButton-${meeting.meetingID}`;
    saveButton.id = `saveButton-${meeting.meetingID}`;
    cancleButton.id = `cancleButton-${meeting.meetingID}`;

    
    //onclick listener for edit button
    editbutton.onclick = function() {
      // provides the meetingID for my editMeetingInfo function
      editMeetingInfo(meeting.meetingID, id); 
      editbutton.style.display = "none";
      saveButton.style.display = "flex";
      cancleButton.style.display = "flex";
    };
    cancleButton.onclick = function() {
      //reloads page without changing anything
      location.reload();
    };

    editMeetingDiv.appendChild(editbutton);
    editMeetingDiv.appendChild(saveButton);
    editMeetingDiv.appendChild(cancleButton);

    meetingDiv.appendChild(meetingInfo);
    meetingDiv.appendChild(editMeetingDiv);

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

    meetingLog.appendChild(meetingDiv);
  });
}
// simple helperfuntion to compare dates durring sorting
// (I had to look into this, but it should be correct)
function compareDates(meetingA, meetingB) {
  return new Date(meetingA.date) - new Date(meetingB.date);
}

async function showDeleteModal(meetingID) {
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
    }
    else{
      console.log('failure to update');
    };
    console.log("end");
    location.reload();
  };
}
