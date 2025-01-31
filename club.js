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
// const auth = getAuth(app);

export const login2 = async function(){
  console.log("TEST")
}

export const login = async function(username, password){
  // var username = document.getElementById('username').value;
  // var password = document.getElementById('password').value;
console.log("hello");
// Add a new document in collection "cities"
  await setDoc(doc(db, "clubs", username), {
    Username: username,
    Password: password
  }

);

window.location.href="moreInfo.html";
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
        //this does somehting when the club tile is clicked
      }
    
      names.appendChild(clubTile);
    // }
    });
  }

//collection --> clubs
//document
//fields bio, name, password, username
