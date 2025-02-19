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


export const displayClubInfo = async function(){
    console.log("displayClubInfo triggered");
    var name = sessionStorage.getItem("club");
    const databaseItems = await getDocs(collection(db, "clubs"));
    var clubName =  document.getElementById("clubName");
    clubName.innerHTML = "";

    var bio =  document.getElementById("bio");
    bio.innerHTML = "About Us:";

    var quickFacts =  document.getElementById("quickFacts");
    quickFacts.innerHTML = "Club information:";
    
    databaseItems.forEach((item) => {
        if(item.data().clubName == name){
            console.log("match");
            clubName.innerHTML = item.data().clubName;

            var clubBio = document.createElement("h4");
            clubBio.innerHTML=item.data().bio;

            var dateFounded = document.createElement("h4");
            dateFounded.innerHTML=item.data().yearFounded;
            var meetingPlan = document.createElement("h4");
            meetingPlan.innerHTML=item.data().meetingTime;
            var numMembers = document.createElement("h4");
            numMembers.innerHTML=item.data().memberCount;

            console.log("read comands");
            bio.appendChild(clubBio);
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
