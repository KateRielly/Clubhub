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


// export async function clubPage(){
//     allClubs.forEach((clubs) => {
//         if(SS == clubName)
//     }
//     var aboutUs = document.createElement("h2");
//     aboutUs.innerHTML = clubs.data().clubName;
// }
