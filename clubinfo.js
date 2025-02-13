import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// TODO: import libraries for Cloud Firestore Database
// https://firebase.google.com/docs/firestore
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

export async function clubList(){
    // gets the documents from this query(if a field matches a given criteria)
    const allClubs = await getDocs(collection(db, "clubs"));    
    //loops through each club    
    allClubs.forEach((clubs) => {
        //makes a button and sets the info the the name of the club
        var newButton = document.createElement("button");
        newButton.innerHTML = clubs.data().clubName;
        //anonymous function that when the button is clicked,
        //it navigates to the clubDash.html
        newButton.onclick = function(){
            //calles the setClub() function and sets the
            //session storage as the club name
            setClub(clubs.data().clubName);
            //change the location of page to clubDash.html
            window.location.href = "clubDash.html";
        };
        //adds the button to the div
        document.getElementById('clubsBox').appendChild(newButton);
        document.getElementById('clubsBox').appendChild(document.createElement("br"));
    });
}



export const showClubs = async function(){
  const databaseItems = await getDocs(collection(db, "clubs"));
  var names =  document.getElementById("clubs");
  names.innerHTML = "";
  databaseItems.forEach((item) => {
    // for(item.data() in data){
      var clubTile = document.createElement("button");
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

// -- dispays each clubs information after getting selected/clicked in the club dashboard page --
export const displayClubInfo = async function(){
    console.log("displayClubInfo triggered");
    // gets the club name that was clicked from session storage
    var name = sessionStorage.getItem("club");
    // pulling clubs from database to then sort through
    const databaseItems = await getDocs(collection(db, "clubs"));
    // gets the text in the header to then clear (default is club dash)
    var clubName =  document.getElementById("clubName");
    clubName.innerHTML = "";

    // gets the elements to append things to from HTML 
    // and sets their text to something user will understand
    var bio =  document.getElementById("bio");
    bio.innerHTML = "About Us:";
    var quickFacts =  document.getElementById("quickFacts");
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
            meetingPlan.innerHTML="Meeting frequency: " + item.data().meetingTime;
            var numMembers = document.createElement("h4");
            numMembers.innerHTML="Number of members: " + item.data().memberCount;

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
            return
        }
        else{
            console.log("no club found")
        }
    });

}

// export const sortDate = async function(){
//   console.log("sorting dates!");

//   var name = sessionStorage.getItem("club");
//   const databaseItems = await getDocs(collection(db, "clubs"));
  
//   var clubBio = document.createElement("h4");
//   clubBio.innerHTML = "Club Leaders: "
//   databaseItems.forEach((item) => {
//     item.data().clubLeaders.forEach((leader) => {
//       clubBio.innerHTML += leader;
//     });
        
//   });
// }
