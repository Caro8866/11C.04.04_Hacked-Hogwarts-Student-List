"use strict";

window.addEventListener("DOMContentLoaded", start);

// Student JSON Data
const jsonURL = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodJsonURL = "https://petlatkea.dk/2021/hogwarts/families.json";

// Global Student Array
let allStudents = [];
let enrolledStudents = [];
let expelledStudents = [];
let prefectArray = [];
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
  expelled: 0,
};
const settings = {
  filterBy: "allStudents",
  sortBy: "firstName",
  sortDir: "asc",
};
function start() {
  console.log("Ready to start!");
  registerButtons();
  loadJSON();
}
function registerButtons() {
  document.querySelectorAll(".filter").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

async function loadJSON() {
  const response = await fetch(jsonURL);
  const jsonData = await response.json();
  prepareObjects(jsonData);
}
function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);

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

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  // console.table(sortedList);

  return sortedList;
}

function displayList(activeArray) {
  document.querySelector("#student-list-body").innerHTML = ""; // clear list
  activeArray.forEach(displayStudent);
}

function displayStudent(student) {
  let clone = document.querySelector(".student-template").content.cloneNode(true); // create clone

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
    document.querySelector(".modal").classList.remove(`${student.house}`);

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
      document.querySelector(".modal").classList.add("hidden");
      document.querySelector(".modal").classList.remove(`${student.house}`);
      buildList();
    });
    document.querySelector(".expelBtn").addEventListener("click", () => {
      document.querySelector(".expelBox").classList.remove("hidden");
      document.querySelector(".confirmExpel").addEventListener("click", () => {
        if (student.expelled === 0) {
          student.expelled = 1;
          expelledStudents.push(student);

          allStudents.splice(allStudents.indexOf(student), 1);
          console.log(expelledStudents);
        }
        document.querySelector(".expelBox").classList.add("hidden");
        document.querySelector(".modal").classList.add("hidden");
        document.querySelector(".modal").classList.remove(`${student.house}`);
        buildList();
      });
      document.querySelector(".uncomfirmExpel").addEventListener("click", () => {
        document.querySelector(".expelBox").classList.add("hidden");
      });
    });
    document.querySelector(".prefectBtn").addEventListener("click", makeprefect(student));
    /*   document.querySelector(".student-box-house").textContent = student.house;

      if (student.isPrefect === 0) {
        student.prefect = 1;
        prefectArray.push(student);
      } else {
        alert("Not possible to set expelled student as prefect!");
      }
      console.log(prefectArray);
      buildList();
    }); */

    document.querySelector(".squadBtn").addEventListener("click", makeSquadMember(student));
  });
  /* clone.querySelector(".squadBtn").addEventListener("click"), squadToggle(); */

  function makeprefect(student) {
    if (student.isPrefect === 0) {
      student.prefect = 1;
      prefectArray.push(student);
      console.log(prefectArray);
    }
  }

  function makeSquadMember(student) {
    if (student.house === "Slytherin" || student.bloodStatus === "PureBlood") {
      student.isInqSquad = 1;
    }
  }
  // append clone to list
  document.querySelector("#student-list-body").appendChild(clone);
}

/* FILTERING */

function selectFilter(event) {
  console.log(event);
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  //filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}
function filterList(filteredList) {
  // let filteredList = allStudents;
  if (settings.filterBy === "gryffindor") {
    // Filtered list of only gryffindor
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "hufflepuff") {
    // Filtered list of only hufflepuff
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    // Filtered list of only Ravenclaw
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "slytherin") {
    // Filtered list of only Slytherin
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "allStudents") {
    // Filtered list of allStudents
    filteredList = allStudents;
  } else if (settings.filterBy === "prefects") {
    // Filtered list of prefects
    filteredList = allStudents.filter(isPrefect);
  } else if (settings.filterBy === "inqSquad") {
    // Filtered list of inquisatorial squad members
    filteredList = allStudents.filter(isInqSquad);
  } else if (settings.filterBy === "expelledStudents") {
    // Filtered list of inquisatorial squad members
    filteredList = expelledStudents;
  } else if (settings.filterBy === "enrolledStudents") {
    // Filtered list of inquisatorial squad members
    filteredList = enrolledStudents;
  }
  //! NEED TO FIX EXROLLED
  return filteredList;
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isPrefect(student) {
  return student.isPrefect === 1;
}

function isInqSquad(student) {
  return student.isInqSquad === 1;
}

/* SORTING */
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // find prior sortBy element & remove sortBy class
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  // Highlight active sort
  event.target.classList.add("sortby");

  // toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  //   let sortedList = allStudents;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  // console.table(sortedList);
  displayList(sortedList);
}
