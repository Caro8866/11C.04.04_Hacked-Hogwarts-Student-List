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
  const response = await fetch(jsonURL);
  const jsonData = await response.json();
  prepareObjects(jsonData);
}
