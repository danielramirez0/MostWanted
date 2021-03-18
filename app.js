"use strict";
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch (searchType) {
    case "yes":
      searchResults = searchByName(people);
      break;
    case "no":
      // TODO: search by traits
      let traitList = Object.keys(people[0]);
      searchResults = startSearchingByTraits(traitList, people);
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

  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch (displayOption) {
    case "info":
      // TODO: get person's info
      break;
    case "family":
      // TODO: get person's family
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
function startSearchingByTraits(traits, people) {
  let searchType = promptFor(
    `Here are the available traits:\n\n${traits.join(" ").toLowerCase()}\n\nYou can search by as many as you like.\n\n To use multiple, separate them by a comman (ex. id,gender,dob)`,
    chars
  ).split(",");
  let searchResults = [];
  for (let i = 0; i < searchType.length; i++) {
    let uniqueResult = "";
    let traitSearch = searchType[i].toLowerCase();
    switch (traitSearch) {
      case "id":
        uniqueResult = searchByid(people);
        break;
      case "gender":
        uniqueResult = searchByGender(people);
        break;
      case "dob":
        uniqueResult = searchByDOB(people);
        break;
      case "height":
        uniqueResult = searchByHeight(people);
        break;
      case "weight":
        uniqueResult = searchByWeight(people);
        break;
      case "eyecolor":
        uniqueResult = searchByEyeColor(people);
        break;
      case "occupation":
        uniqueResult = searchByOccupation(people);
        break;
      default:
        // recursive call here??
        break;
    }
    uniqueResult === "" ? null : searchResults.push(uniqueResult);
  }
  console.log(searchResults);
  return searchResults;
}
// Methods of searching
function searchByid(people) {
  let id = Number(promptFor("What is the person's id number?", checkForNumber));
  let foundPerson = people.filter(function (person) {
    if (person.id === id) {
      return true;
    } else {
      return false;
    }
  });
  return foundPerson;
}
function searchByName(people) {
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  firstName = firstName[0].toUpperCase() + firstName.slice(1).toLowerCase();
  lastName = lastName[0].toUpperCase() + lastName.slice(1).toLowerCase();

  let foundPerson = people.filter(function (person) {
    if (person.firstName === firstName && person.lastName === lastName) {
      return true;
    } else {
      return false;
    }
  });
  // TODO: find the person using the name they entered
  return foundPerson;
}
function searchByGender(people) {
  let gender = promptFor("What is the person's gender?", chars);
  let foundPerson = people.filter(function (person) {
    if (person.gender === gender) {
      return true;
    } else {
      return false;
    }
  });
  return foundPerson;
}
function searchByDOB(people) {
  let dob = promptFor("What is the person's birthday?\n Use the following format: mm/dd/yyyy", chars);
  let foundPerson = people.filter(function (person) {
    if (person.dob === dob) {
      return true;
    } else {
      return false;
    }
  });
  return foundPerson;
}
function searchByHeight(people) {
  let height = Number(promptFor("What is the person's height in inches?", checkForNumber));
  let foundPerson = people.filter(function (person) {
    if (person.height === height) {
      return true;
    } else {
      return false;
    }
  });
  return foundPerson;
}
function searchByWeight(people) {
  let weight = Number(promptFor("What is the person's weight in pounds?", checkForNumber));
  let foundPerson = people.filter(function (person) {
    if (person.weight === weight) {
      return true;
    } else {
      return false;
    }
  });
  return foundPerson;
}
function searchByEyeColor(people) {
  let eyeColor = promptFor("What is the person's eye color?", chars);
  let foundPerson = people.filter(function (person) {
    if (person.eyeColor === eyeColor) {
      return true;
    } else {
      return false;
    }
  });
  return foundPerson;
}
function searchByOccupation(people) {
  let occupation = promptFor("What is the person's occupation?", chars);
  let foundPerson = people.filter(function (person) {
    if (person.occupation === occupation) {
      return true;
    } else {
      return false;
    }
  });
  return foundPerson;
}
function searchByParents(people) {
  let parents = Number(promptFor("What is the person's parent's id number?", checkForNumber));
  let foundPerson = people.filter(function (person) {
    if (person.parents === parents) {
      return true;
    } else {
      return false;
    }
  });
  return foundPerson;
}

function searchByCurrentSpouse(people) {
  let currentSpouse = Number(promptFor("What is the person's currentSpouse's id number?", checkForNumber));
  let foundPerson = people.filter(function (person) {
    if (person.currentSpouse === currentSpouse) {
      return true;
    } else {
      return false;
    }
  });
  return foundPerson;
}

// alerts a list of people
function displayPeople(people) {
  alert(
    people
      .map(function (person) {
        return person.firstName + " " + person.lastName;
      })
      .join("\n")
  );
}

function displayPerson(person) {
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
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

// helper function to pass into promptFor to validate number inputs
function checkForNumber(input) {
  return !isNaN(input);
}
