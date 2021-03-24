"use strict";
/*
Build all of your functions for displaying and gathering information below (GUI).
*/
// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  let traitSearchResults;
  switch (searchType) {
    case "yes":
      searchResults = searchByName(people);
      break;
    case "no":
      const traits = Object.keys(people[0]).splice(0, 9);
      let numberOfKnownTraits = parseInt(promptFor("How many traits do you know about this person?", checkForNumber));
      if (numberOfKnownTraits > traits.length) {
        alert("Cannot search by " + numberOfKnownTraits + ". Must be less than or equal to " + traits.length + ". Restarting...");
        return app(people);
      }
      for (let i = 0; i < numberOfKnownTraits; i++) {
        traitSearchResults = startSearchingByTraits(i === 0 ? people : traitSearchResults, traits);
      }
      if (traitSearchResults.length > 1) {
        searchResults = getUniquePersonFrom(traitSearchResults);
      } else {
        searchResults = traitSearchResults[0];
      }
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
    return promptFor("Do you want to restart?") === "yes" ? app(people) : null;
    // return app(people); // restart
  }
  let family = [];
  let siblings = getSiblings(person, people);
  let spouse = getSpouse(person, people);
  let parents = getParents(person, people);
  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");
  switch (displayOption) {
    case "info":
      displayPerson(person);
      return mainMenu(person, people); // ask again
    case "family":
      family.push(buildFamilyTree(siblings, "Sibling"));
      family.push(buildFamilyTree(spouse, "Spouse"));
      family.push(buildFamilyTree(parents, "Parent"));
      alert(family.join("\n"));
      return mainMenu(person, people); // ask again
    case "descendants":
      let lineage = getChildren(person, people);
      if (lineage.length > 0) {
        displayDescendants(person, lineage);
      } else {
        alert("This person has no descendants.");
      }
      return mainMenu(person, people); // ask again
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}
// Search for person by selected traits
function startSearchingByTraits(people, traits) {
  let searchResults = [];
  let searchType;
  let message = `Here are the ${traits.length} available traits you can use to search:\n\n`;
  for (let i = 0; i < traits.length; i++) {
    message += `${i + 1}: ${traits[i]}\n`;
  }
  message += "Enter the number of the trait you want to use";
  searchType = promptFor(message, chars);
  switch (searchType) {
    case "1":
      searchResults = searchByTrait(people, "id");
      break;
    case "2":
      searchResults = searchByTrait(people, "firstName");
      break;
    case "3":
      searchResults = searchByTrait(people, "lastName");
      break;
    case "4":
      searchResults = searchByTrait(people, "gender");
      break;
    case "5":
      searchResults = searchByTrait(people, "dob");
      break;
    case "6":
      searchResults = searchByTrait(people, "height");
      break;
    case "7":
      searchResults = searchByTrait(people, "weight");
      break;
    case "8":
      searchResults = searchByTrait(people, "eyeColor");
      break;
    case "9":
      searchResults = searchByTrait(people, "occupation");
      break;
    default:
      return startSearchingByTraits(people);
  }
  return searchResults;
}
// Function to search by first and last name only
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
  foundPerson = foundPerson[0];
  return foundPerson;
}
// Function to search by specific traits
function searchByTrait(people, specificTrait) {
  let foundPerson;
  let userInput = promptFor("what is the person's " + specificTrait + ":", chars);
  if (parseInt(userInput) === NaN) {
    foundPerson = people.filter(function (person) {
      if (person[specificTrait].toLowerCase() == userInput.toLowerCase()) {
        return true;
      } else {
        return false;
      }
    });
  } else {
    foundPerson = people.filter(function (person) {
      if (person[specificTrait] == userInput) {
        return true;
      } else {
        return false;
      }
    });
  }
  return foundPerson;
}
function getAge(dateOfBirth) {
  let d = new Date();
  let y = d.getFullYear();
  let yearOfBirth = dateOfBirth.split("/")[2];
  let age = y - yearOfBirth;
  return age;
}
// Secelction of person after search filtering
function getUniquePersonFrom(filteredPeople) {
  let names = [];
  let uniquePerson;
  for (let i = 0; i < filteredPeople.length; i++) {
    names.push(filteredPeople[i].firstName + " " + filteredPeople[i].lastName);
  }
  let message = "Here are all the people who have those traits:\n\n";
  for (let i = 0; i < names.length; i++) {
    const element = names[i];
    message += `${i + 1}: ${names[i]}\n`;
  }
  message += "Enter the number of the person you want to use";
  let selection = promptFor(message, chars);
  uniquePerson = filteredPeople[selection - 1];
  return uniquePerson;
}
// map function can be your friend
// default parameter could be cool( like an empty array maybe? )
function getChildren(person, people) {
  let children = [];
  let grandChildren = [];
  for (let i = 0; i < people.length; i++) {
    if (people[i].parents.includes(person.id)) {
      children.push(people[i]);
    }
  }
  if (children.length > 0) {
    for (let i = 0; i < children.length; i++) {
      grandChildren = getChildren(children[i], people);
    }
  } else {
    return children;
  }
  if (grandChildren.length > 0) {
    for (let j = 0; j < grandChildren.length; j++) {
      children.push(grandChildren[j]);
    }
  }
  return children;
}
// return sibling of person object
function getSiblings(person, people) {
  let siblings = [];
  let parents = person.parents.length >= 1 ? person.parents : "";
  for (let i = 0; i < people.length; i++) {
    if (people[i].parents.includes(parents[0]) || people[i].parents.includes(parents[1])) {
      if (people[i].id !== person.id) {
        siblings.push(people[i]);
      }
    }
  }
  return siblings;
}
// returns spouse of person object
function getSpouse(person, people) {
  for (let i = 0; i < people.length; i++) {
    if (people[i].id === person.currentSpouse) {
      return [people[i]];
    }
  }
  return -1;
}
// Returns array of parent ids
function getParents(person, people) {
  let parents = [];
  for (let i = 0; i < people.length; i++) {
    if (person.parents.includes(people[i].id)) {
      parents.push(people[i]);
    }
  }
  return parents;
}
// Returns family member string
function buildFamilyTree(familyMembers, relationship) {
  if (familyMembers.length > 0) {
    familyMembers = familyMembers
      .map(function (member) {
        return `${relationship}: ` + member.firstName + " " + member.lastName;
      })
      .join("\n");
  } else {
    return "This person has no " + relationship;
  }
  return familyMembers;
}
// Alerts descendants
function displayDescendants(person, descendants) {
  descendants = descendants.map(function (descendant) {
    return descendant.firstName + " " + descendant.lastName;
  });
  alert(`${person.firstName} ${person.lastName}'s descendants are:\n${descendants.join("\n")}`);
}
// Function prints info about the person
function displayPerson(person) {
  alert(
    `First Name: ${person.firstName}\nLast Name: ${person.lastName}\nHeight: ${person.height}\nWeight: ${person.weight}\nEye Color: ${person.eyeColor}\nOccupation: ${person.occupation}\nAge: ${getAge(
      person.dob
    )}`
  );
}
// function that prompts and validates user input
function promptFor(question, valid) {
  try {
    do {
      var response = prompt(question).trim();
    } while (!response || !valid(response));
    return response;
  } catch (error) {
    console.log(error);
  }
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
