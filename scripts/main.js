"use strict";

window.addEventListener("DOMContentLoaded", start);

// Student JSON Data
const jsonURL = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodJsonURL = "https://petlatkea.dk/2021/hogwarts/families.json";

// Global Student Array
let allStudents = [];
let enrolledStudents = [];
let expelledStudents = [];

let studentList;

// Student Prototype Object
const Student = {
  firstName: "-unknown-",
  lastName: "-unknown-",
  middleName: "-unknown-",
  nickName: "-unknown-",
  gender: "",
  image: ".png",
  house: "",
  blood: "",
  isPrefect: 0,
  isInqSquad: 0,
};

function start() {
  console.log("Ready to start!");
  loadJSON();
}
async function loadJSON() {
  console.log("load JSON");

  const response = await fetch(jsonURL);
  const jsonData = await response.json();
  prepareObjects(jsonData);
}
function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);
  console.log("prepre Objects");
  displayList(allStudents);
}

function prepareObject(jsonObject) {
  const student = Object.create(Student);

  let fullName = jsonObject.fullname.trim(); // Student full name with no space before or after
  let house = jsonObject.house.trim(); // Student house with no space before or after
  let gender = jsonObject.gender.trim(); // Student gender with no space before or after

  //? Name prep

  // First name cleaning & selecting
  if (fullName.includes(" ")) {
    // Make first char upper case and rest lower case
    student.firstName = fullName.substring(0, 1).toUpperCase() + fullName.substring(1, fullName.indexOf(" ")).toLowerCase();
  } else {
    // if only first name is know make first char upper case and rest lower case
    student.firstName = fullName.substring(0, 1).toUpperCase() + fullName.substring(1).toLowerCase();
  }

  // Last name cleaning & selecting
  if (fullName.includes(" ")) {
    student.lastName = fullName.substring(fullName.lastIndexOf(" ") + 1, fullName.lastIndexOf(" ") + 2).toUpperCase() + fullName.substring(fullName.lastIndexOf(" ") + 2).toLowerCase();
  }

  // middle name

  if (fullName.split(" ").length > 2) {
    student.middleName = fullName.substring(fullName.indexOf(" ") + 1, fullName.lastIndexOf(" "));
  }
  // nickname
  if (fullName.includes('"')) {
    student.nickName = fullName.substring(fullName.indexOf('"') + 1, fullName.lastIndexOf('"'));
    student.middleName = "";
  }

  // gender
  student.gender = gender.substring(1, 0).toUpperCase() + gender.substring(1).toLowerCase();

  // image
  student.image = `${student.lastName.toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;

  // house
  student.house = house.substring(1, 0).toUpperCase() + house.substring(1).toLowerCase();
  return student;
}

function displayList(activeArray) {
  console.log("Display List");

  document.querySelector("#student-list-body").innerHTML = ""; // clear list
  activeArray.forEach(displayStudent);
}

function displayStudent(student) {
  let clone = document.querySelector(".student-template").content.cloneNode(true); // create clone
  console.log("Display student");
  console.log(student);
  clone.querySelector(".student-first-name").textContent = student.firstName;
  clone.querySelector(".student-last-name").textContent = student.lastName;

  if (student.firstName === "Justin") {
    clone.querySelector(".student-image").src = "assets/images/fletchley_j.png";
  } else if (student.firstName === "Leanne") {
    clone.querySelector(".student-image").src = "assets/images/noPicture.png";
  } else if (student.firstName === "Parvati") {
    clone.querySelector(".student-image").src = "assets/images/patil_parvati.png";
  } else if (student.firstName === "Padma") {
    clone.querySelector(".student-image").src = "assets/images/patil_padma.png";
  } else {
    clone.querySelector(".student-image").src = `assets/images/${student.image}`;
  }

  clone.querySelector(".student-house").src = `assets/house-badges/${student.house}-badge.png`;

  if (student.isPrefect === 1) {
    clone.querySelector(".student-prefect").src = `assets/icons/prefect-true.svg`;
  } else if (student.isPrefect === 0) {
    clone.querySelector(".student-prefect").src = `assets/icons/prefect-false.svg`;
  }
  if (student.isInqSquad === 1) {
    clone.querySelector(".student-inq-squad").src = `assets/icons/squad-true.svg`;
  } else if (student.isInqSquad === 0) {
    clone.querySelector(".student-inq-squad").src = `assets/icons/squad-false.svg`;
  }

  clone.querySelector(".modalButton").addEventListener("click", () => {
    document.querySelector(".modal").classList.remove("hidden");
    document.querySelector(".modal").classList.add(`${student.house}`);
    if (student.nickName === "-unknown-") {
      document.querySelector("#studentFullName").textContent = student.firstName + " " + student.lastName;
    } else {
      document.querySelector("#studentFullName").textContent = student.firstName + " " + student.lastName + ' | "' + student.nickName + '"';
    }
    if (student.firstName === "Justin") {
      document.querySelector("#studentImage").src = "assets/images/fletchley_j.png";
    } else if (student.firstName === "Leanne") {
      document.querySelector("#studentImage").src = "assets/images/noPicture.png";
    } else if (student.firstName === "Parvati") {
      document.querySelector("#studentImage").src = "assets/images/patil_parvati.png";
    } else if (student.firstName === "Padma") {
      document.querySelector("#studentImage").src = "assets/images/patil_padma.png";
    } else {
      document.querySelector("#studentImage").src = `assets/images/${student.image}`;
    }

    document.querySelector("#studentHouse").src = `assets/house-badges/${student.house}-badge.png`;
    document.querySelector("#studentFirstName").textContent = student.firstName;
    document.querySelector("#studentMiddleName").textContent = student.middleName;
    document.querySelector("#studentLastName").textContent = student.lastName;
    document.querySelector("#studentNickName").textContent = student.nickName;
    document.querySelector("#studentBloodStatus").textContent = student.blood;

    if (student.isPrefect === 1) {
      document.querySelector(".studentPrefect").src = `assets/icons/prefect-true.svg`;
    } else if (student.isPrefect === 0) {
      document.querySelector(".studentPrefect").src = `assets/icons/prefect-false.svg`;
    }
    if (student.isInqSquad === 1) {
      document.querySelector(".studentSquad").src = `assets/icons/squad-true.svg`;
    } else if (student.isInqSquad === 0) {
      document.querySelector(".studentSquad").src = `assets/icons/squad-false.svg`;
    }
    document.querySelector("#closeButton").addEventListener("click", () => {
      console.log("clollick");
      document.querySelector(".modal").classList.add("hidden");
    });
  });
  /* clone.querySelector(".expelBtn").addEventListener("click"), expelStudent(); */
  /* clone.querySelector(".prefectBtn").addEventListener("click"), prefectToggle(); */
  /* clone.querySelector(".squadBtn").addEventListener("click"), squadToggle(); */

  // append clone to list
  document.querySelector("#student-list-body").appendChild(clone);
}
