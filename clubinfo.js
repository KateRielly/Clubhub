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
sessionStorage.setItem("club", item.data().clubName);
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
var name = sessionStorage.getItem("club");
// pulling clubs from database to then sort through
const databaseItems = await getDocs(collection(db, "clubs"));
// gets the text in the header to then clear (default is club dash)
var clubName = document.getElementById("clubName");
clubName.innerHTML = "";
// gets the elements to append things to from HTML
// and sets their text to something user will understand
var bio = document.getElementById("bio");
bio.innerHTML = "About Us:";
var quickFacts = document.getElementById("quickFacts");
quickFacts.innerHTML = "Club information:";
// sorts through each club until the saved name matched an firebase club
// (this should never not work)
databaseItems.forEach((item) => {
if(item.data().clubName == name){
console.log("match");
// sets header to the club name
// (I could have also done this form session storage)
clubName.innerHTML = item.data().clubName;
// sets/creates feilds and assighns fire base values to them
var clubBio = document.createElement("h4");
clubBio.innerHTML=item.data().bio;
var dateFounded = document.createElement("h4");
dateFounded.innerHTML="Date founded: " + item.data().yearFounded;
var meetingPlan = document.createElement("h4");
meetingPlan.innerHTML="Meeting frequency: " +

item.data().meetingTime;

var numMembers = document.createElement("h4");
numMembers.innerHTML="Number of members: " +

item.data().memberCount;

var leaderNames = document.createElement("h4");
leaderNames.innerHTML = "Club Leaders: "
item.data().clubLeaders.forEach((leader) => {
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
sortDate(item.id);
return
}
else{
console.log("no club found")
}
});
}


async function sortDate(id){
  console.log("sorting dates!");
  const pastMeetings = [];
  const futureMeetings = [];
  //gets todays date
  let today = new Date();
  console.log(today)
  const docRef = doc(db, "clubs", id);
  const item = await getDoc(docRef);
  item.data().meetings.forEach((meeting) => {
    //give the object atributes
    let meet = {
      date: meeting.date.toDate(),
      description: meeting.description
      // atendence:
    };
    //checks to see if the date is before or after today and appends it tothe right array
    if(meet.date > today){
      futureMeetings.push(meet);
    }
    else{
      pastMeetings.push(meet);
    }
  });
  console.log(pastMeetings)
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
    var editbutton = document.createElement("button")
    editbutton.innerHTML = "Delete"
    // Assign a class to it
    meetingInfo.classList.add('meetingBox');
    editMeetingDiv.classList.add('editMeetingDiv');
    meetingDiv.classList.add('meetingDiv');
    editbutton.classList.add('meetingEdit');

    editMeetingDiv.appendChild(editbutton);
    meetingDiv.appendChild(meetingInfo);
    meetingDiv.appendChild(editMeetingDiv);

    meetingInfo.innerHTML = `
      <p>Date: ${meeting.date.toLocaleDateString()}</p>
      <p>Time: ${meeting.date.toLocaleTimeString()}</p>
      <p id="meetingDescription">Meeting info: ${meeting.description}</p>
      <p id="attendance"></p>
    `;
    outlook.appendChild(meetingDiv);
  });

  //creates proper divs in past meeting section
  pastMeetings.forEach((meeting) => {
    var meetingDiv = document.createElement("div");
    var meetingInfo = document.createElement("div");
    var editMeetingDiv = document.createElement("div");
    var editbutton = document.createElement("button")
    editbutton.innerHTML = "Edit"
    // Assign a class to it
    meetingInfo.classList.add('meetingBox');
    editMeetingDiv.classList.add('editMeetingDiv');
    meetingDiv.classList.add('meetingDiv');
    editbutton.classList.add('meetingEdit');

    editMeetingDiv.appendChild(editbutton);
    meetingDiv.appendChild(meetingInfo);
    meetingDiv.appendChild(editMeetingDiv);

    meetingInfo.innerHTML = `
      <p>Date: ${meeting.date.toLocaleDateString()}</p>
      <p>Time: ${meeting.date.toLocaleTimeString()}</p>
      <p>Meeting info: ${meeting.description}</p>
    `;
    meetingLog.appendChild(meetingDiv);
  });
}
// simple helperfuntion to compare dates durring sorting
// (I had to look into this, but it should be correct)
function compareDates(meetingA, meetingB) {
  return new Date(meetingA.date) - new Date(meetingB.date);
}



async function editMeetingInfo(meeting){

}
