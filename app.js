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
      searchResults = searchByName(people)[0];
      break;
    case 'no':
      // searchResults = searchByTraits(people);
      searchResults = searchByTrait(people);
      break
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

  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch (displayOption) {
    case "info":
      displayPerson(person);
      break;
    case "family":
      let family = findFamily(person, people);
      alert(family);
      break;
    case "descendants":
      // TODO: get person's descendants
      let descendants = findDescendants(person, people);
      alert(person.firstName + "'s children: \n" + descendants);
      break;
    case "restart":
      app(people); // restart
      return; //
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
  mainMenu(person, people)
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
  family += "Stepchildren: " + findStepchildren(person, people).toString() + "\n";
  family += "Spouse: " + findPersonById(person.currentSpouse, people) + "\n";
  return family;
}

function findSiblings(person, people) {
  if (person.parents.length === 0) {
    return "None";
  }

  let siblings = people.filter(function (el) {
    if ((el.parents[0] === person.parents[0] ||
         el.parents[0] === person.parents[1] ||
         el.parents[1] === person.parents[0] ||
         el.parents[1] === person.parents[1]) &&
         el.id !== person.id) {
      
      return true;
    }
    else {
      return false;
    }
  });

  siblings.splice(0, siblings.length, ...(new Set(siblings)));

  return siblings.map(function (person) {
    return person.firstName + " " + person.lastName;
  });
}

// el.parents.toString() === person.parents.toString() && el.id !== person.id

function findChildren(person, people) {
  let children = people.filter(function (el) {
    if (el.parents.includes(person.id)) {
      return true;
    }
    else {
      return false;
    }
  });
  return children.map(function (person) {
    return person.firstName + " " + person.lastName;
  });
  
}

function findStepchildren(person, people) {
  let children = people.filter(function (el) {
    if (el.parents.includes(person.currentSpouse)) {
      return true;
    }
    else {
      return false;
    }
  });
  return children.map(function (person) {
    return person.firstName + " " + person.lastName;
  });
}

function findPeopleById(personsIdArray, people) {
  if (personsIdArray.length === 0) {
    return "None";
  }
  let personNames = personsIdArray.map(function (el) {
    return findPersonById(el, people);
  });
  return personNames;
}

function findPersonById(personId, people) {
  if (personId === null) {
    return "None";
  }
  let person = searchById(personId, people);
  return person.firstName + " " + person.lastName;
}


function findDescendants(person, people, parent="") {
  let children = findChildrenObject(person, people);

  if(children.length === 0) {
    return "";
  }

  return children.map(function(el){
    return " ---> " + el.firstName + " " + el.lastName + findDescendants(el, people) + "\n";
  }).reduce(function(total, el) { //Reduce used to remove comma seperated values
    return total += el;
  });
}

function findChildrenObject(person, people) {
  let children = people.filter(function (el) {
    if (el.parents.includes(person.id)) {
      return true;
    }
    else {
      return false;
    }
  });
  return children;
}


function searchByTrait(people) {
  let menuSelection = promptFor("Do you want to search for\n1)'gender'\n2)'age'\n3)'height'\n4)'weight'\n5)'eye color'\n6)'occupation'\n7)'display results'.", chars).toLowerCase();
  let specificTrait;
  let promptText;

  switch (menuSelection) {
    case "1":
    case "gender":
      specificTrait = "gender";
      promptText = "gender";
      
    break;
    case "2":
    case "age":
      specificTrait = "age";
      promptText = "age";

      break;
      case "3":
    case "height":
      specificTrait = "height";
      promptText = "height";
      
      break;
      case "4":
    case "weight":
      specificTrait = "weight";
      promptText = "weight";
      
      break;
      case "5":
    case "eye color":
    case "eyecolor":
      specificTrait = "eyeColor";
      promptText = "eye color";

      break; 
      case "6":
    case "occupation":
      specificTrait = "occupation";
      promptText = "occupation";
      break
      case "7":
      case "search":
      case "display results":
      return numberedListOfPeople(people);
    default:
      searchByTrait(people); // ask again
  }

  let newPeople = searchBySpecificTrait(specificTrait, promptText, people);
  if(newPeople.length === 0) {
    return null;
  }

  return searchByTrait(newPeople);
}

function searchBySpecificTrait(trait, prompt, people){
  if(trait === "age") {
    people = people.map(function(el, index) {
      let date = new Date(el.dob);
      el.age = Math.floor(parseFloat(Date.now() - date) / (1000*60*60*24*365.25));
      return el;
    });
    var filter = parseInt(promptFor("enter the " + prompt + " of the person.", chars));
  }
  else {
  var filter = promptFor("enter the " + prompt + " of the person.", chars)
  }
  return people.filter(function (el) {
    if (el[trait] === filter) {
      return true;
    }
    else {
      return false;
    }
  });
}

function numberedListOfPeople(people) {
  let count = 0;
  let input = promptForInRange( "Please input number of individual:\n" + people.map(function (person) {
    count += 1;
    return count + ") " + person.firstName + " " + person.lastName;
  }).join("\n").toString(), people.length, checkInRange);

  return people[input-1]

}

function promptForInRange(question, upperLimit, valid) {
  do {
    var response = parseInt(prompt(question).trim());
  } while (!response || !valid(response, upperLimit));
  return response;
}

function checkInRange(response, upperLimit) {
  if(response >= 1 && response <= upperLimit) {
    return true;
  }
  return false;

}