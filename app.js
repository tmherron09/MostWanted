"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch (searchType) {
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      // TODO: search by traits
      break;
    default:
      app(people); // restart app
      break;
  }

  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people) {

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if (!person) {
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = prompt("Found " + person[0].firstName + " " + person[0].lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");



  switch (displayOption) {
    case "info":
      displayPerson(person[0]);
      break;
    case "family":
      let family = findFamily(person[0], people);
      alert(family);
      break;
    case "descendants":
      // TODO: get person's descendants
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }

}

function searchByName(people) {
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function (person) {
    if (person.firstName === firstName && person.lastName === lastName) {
      return true;
    }
    else {
      return false;
    }
  })
  // TODO: find the person using the name they entered
  return foundPerson;
}

// alerts a list of people
function displayPeople(people) {
  alert(people.map(function (person) {
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person) {
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "DoB: " + person.dob + "\n";
  personInfo += "Height: " + person.height + "\"" + "\n";
  personInfo += "Weight: " + person.weight + "lbs" + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  // TODO Add Family Names, parents, etc
  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}

// function that prompts and validates user input
function promptFor(question, valid) {
  do {
    var response = prompt(question).trim();
  } while (!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input) {
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input) {
  return true; // default validation only
}

function searchById(id, people) {
  let foundPerson = people.filter(function (person) {
    if (person.id === id) {
      return true;
    }
    else {
      return false;
    }
  });
  return foundPerson[0];
  //return foundPerson[0].firstName + " " + foundPerson[0].lastName;
}

function findFamily(person, people) {
  let family = "Parents: " + findPeopleById(person.parents, people).toString() + "\n";
  family += "Siblings: " + findSiblings(person, people).toString() + "\n";
  family += "Children: " + findChildren(person, people).toString() + "\n";
  family += "Spouse: " + findPersonById(person.currentSpouse, people) + "\n";
  return family;
}

function findSiblings(person, people) {
  if(person.parents.length === 0){
    return "None";
  }
  let siblings = people.filter( function(el) {
    if(el.parents.toString() === person.parents.toString() && el.id !== person.id) {
      return true;
    }
    else {
      return false;
    }
  });
  return siblings.map(function(person) {
    return person.firstName + " " + person.lastName;
  });
}

function findChildren(person, people) {
  let children = people.filter( function(el) {
    if(el.parents.includes(person.id)) {
      return true;
    }
    else {
      return false;
    }
  });
  return children.map(function(person) {
    return person.firstName + " " + person.lastName;
  });
}

function findPeopleById(personsIdArray, people) {
  if(personsIdArray.length === 0){
    return "None";
  }
  let personNames = personsIdArray.map(function (el) {
    return findPersonById(el, people);
  });
  return personNames;
}

function findPersonById(personId, people) {
  if(personId === null) {
    return "None";
  }
  let person = searchById(personId, people);
  return person.firstName + " " + person.lastName;
}
