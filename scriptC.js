// import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
// const firebaseConfig = {
//     apiKey: "AIzaSyAH3oWF9S-ePd0352Ca-TdE5cu6oinzlXo",
//     authDomain: "softwareengineering-94854.firebaseapp.com",
//     projectId: "softwareengineering-94854",
//     storageBucket: "softwareengineering-94854.appspot.com",
//     messagingSenderId: "565847408909",
//     appId: "1:565847408909:web:9e116dae6ede6b965bb044"
//   };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

let clicked = null; // Stores the date of the currently clicked day.
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []; // Retrieves stored events from localStorage or initializes an empty array.


const newEventModal = document.getElementById('newEventModal'); // Modal for creating new events.
const deleteEventModal = document.getElementById('deleteEventModal'); // Modal for deleting existing events.
const backDrop = document.getElementById('modalBackDrop'); // Background overlay for modals.
const eventTitleInput = document.getElementById('eventTitleInput'); // Input field for event title.


// Opens the appropriate modal based on the clicked date.
// `date`: The date of the clicked day.
function openModal(date) {
    console.log("Click registered"); // Logs the click event.

    clicked = date; // Store the clicked date for later reference.
    console.log('Creating a new event');
    newEventModal.style.display = 'block'; // Show the new event modal.
    backDrop.style.display = 'block'; // Display the backdrop overlay.
}

function openEventModal(date) {
    console.log("Click registered"); // Logs the click event.

    clicked = date; // Store the clicked date for later reference.

    // Find if there is an event already scheduled for the clicked date.
    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        console.log('Event already exists');
        document.getElementById('eventText').innerText = eventForDay.title; // Display the event's title.
        deleteEventModal.style.display = 'block'; // Show the delete modal for existing events.
    }
}

// Waits for the DOM to fully load before executing.
document.addEventListener('DOMContentLoaded', function () {
    const monthYear = document.getElementById('month-year'); // Displays the current month and year.
    const daysContainer = document.getElementById('days'); // Container for the calendar days.
    const prevButton = document.getElementById('prev'); // Button to navigate to the previous month.
    const nextButton = document.getElementById('next'); // Button to navigate to the next month.

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]; // Array of month names for display.

    let currentDate = new Date(); // The date being displayed on the calendar.
    let today = new Date(); // The current date.

    // Renders the calendar for the given date.
    // `date`: The date for which the calendar should be rendered.
    function renderCalendar(date) {
        // Select the element

        const year = date.getFullYear(); // Extract the year.
        const month = date.getMonth(); // Extract the month.
        const firstDay = new Date(year, month, 1).getDay(); // Get the weekday of the first day of the month.
        const lastDay = new Date(year, month + 1, 0).getDate(); // Get the total days in the month.

        monthYear.innerText = `${months[month]} ${year}`; // Update the month and year display.
        daysContainer.innerHTML = ''; // Clear previous calendar rendering.

    // Add dates from the previous month for context.
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDay; i > 0; i--) {
        const dayDiv = document.createElement('div');
        const prevMonthDate = prevMonthLastDay - i + 1; // Previous month's date.
        dayDiv.innerText = prevMonthDate; 
        dayDiv.classList.add('fade'); // Dim styling for non-current dates.

        // Create the correct day string for the previous month (month - 1).
        const dayString = `${month}/${prevMonthDate}/${year}`; // month-1 for previous month

        dayDiv.addEventListener('click', () => openModal(dayString));
        daysContainer.appendChild(dayDiv);

        const eventForDay = events.find(e => e.date === dayString);
        if (eventForDay) {
            const eventDiv = document.createElement('div');
            eventDiv.innerText = eventForDay.title;
            eventDiv.addEventListener('click', () => openEventModal(dayString));//IN TESTING
            eventDiv.classList.add('event');
            dayDiv.appendChild(eventDiv);
        }
    }

    // Add dates for the current month.
    for (let i = 1; i <= lastDay; i++) {
        const dayString = `${month + 1}/${i}/${year}`;
        const dayDiv = document.createElement('div');
        dayDiv.innerText = i; // Current month's date.

        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today'); // Highlight today's date.
        }

        const eventForDay = events.find(e => e.date === dayString);
        if (eventForDay) {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.innerText = eventForDay.title;
            eventDiv.addEventListener('click', () => openEventModal(dayString));//IN TESTING
            dayDiv.appendChild(eventDiv);
        }
        dayDiv.addEventListener('click', () => openModal(dayString));
        daysContainer.appendChild(dayDiv);
    }

    // Add dates for the next month for context.
    const nextMonthStartDay = 7 - new Date(year, month + 1, 1).getDay(); // Correct next month start day calculation
    for (let i = 1; i <= nextMonthStartDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.innerText = i; // Next month's date.
        dayDiv.classList.add('fade'); // Dim styling for non-current dates.

        // Create the correct day string for the next month ..
        const dayString = `${month + 2}/${i}/${year}`; // month + 2 for next month

        const eventForDay = events.find(e => e.date === dayString);
        if (eventForDay) {
            const eventDiv = document.createElement('div');
            eventDiv.classList.add('event');
            eventDiv.innerText = eventForDay.title;
            eventDiv.addEventListener('click', () => openEventModal(dayString));//IN TESTING
            dayDiv.appendChild(eventDiv);
        }
        dayDiv.addEventListener('click', () => openModal(dayString));
        daysContainer.appendChild(dayDiv);
    }

    }

    // Navigate to the previous month.
    prevButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1); // Decrease the month.
        renderCalendar(currentDate); // Re-render the calendar.
    });

    // Navigate to the next month.
    nextButton.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1); // Increase the month.
        renderCalendar(currentDate); // Re-render the calendar.
    });

    console.log("event");
    renderCalendar(currentDate); // Initial render of the calendar.
});

// Closes any open modal and resets relevant states.
function closeModal() {
    eventTitleInput.classList.remove('error'); // Remove error styling.
    newEventModal.style.display = 'none'; // Hide the new event modal.
    deleteEventModal.style.display = 'none'; // Hide the delete event modal.
    backDrop.style.display = 'none'; // Hide the backdrop.
    eventTitleInput.value = ''; // Clear the input field.
    clicked = null; // Reset the clicked date.
    renderCalendar(currentDate); // Re-render the calendar to reflect changes.
}

// Saves a new event to the events array and updates localStorage.
function saveEvent() {
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error'); // Remove error styling.

        events.push({
            date: clicked, // Save the clicked date.
            title: eventTitleInput.value, // Save the inputted title.
        });

        localStorage.setItem('events', JSON.stringify(events)); // Save updated events to localStorage.
        closeModal(); // Close the modal.
    } else {
        eventTitleInput.classList.add('error'); // Highlight error if input is empty.
    }
}

// Deletes an event from the events array and updates localStorage.
function deleteEvent() {
    events = events.filter(e => e.date !== clicked); // Remove the event with the clicked date.
    localStorage.setItem('events', JSON.stringify(events)); // Save updated events to localStorage.
    closeModal(); // Close the modal.
}

// Initializes button event listeners.
function initButtons() {
    document.getElementById('saveButton').addEventListener('click', saveEvent); // Save event button.
    document.getElementById('cancelButton').addEventListener('click', closeModal); // Cancel modal button.
    document.getElementById('deleteButton').addEventListener('click', deleteEvent); // Delete event button.
    document.getElementById('closeButton').addEventListener('click', closeModal); // Close modal button.
}

initButtons(); // Initialize buttons.
renderCalendar(currentDate);
