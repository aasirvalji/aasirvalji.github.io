// ---------- Start global vars and helper functions ----------
const commandsMap = {
  ls: "ls -- list directory contents",
  cat: "cat -- concatenate and print files",
  pwd: "pwd -- print name of current/working directory",
  cd: "cd -- change the working directory",
  open: "open -- open image preview",
  help: "help -- Shows all available commands and what each command does",
};

const validLsPaths = [
  "/Users/aasirvalji/pics",
  "/Users/aasirvalji",
  "/Users",
  "/",
];

const tabCompletionValidPath = {
  ls: "", // tab completion available anywhere
  cat: "",
  pwd: "",
  cd: "",
  help: "",
  "cat me.txt": "/Users/aasirvalji",
  "cat socials.txt": "/Users/aasirvalji",
  "cat hobbies.txt": "/Users/aasirvalji",
  "cd pics": "/Users/aasirvalji",
  open: "",
  "open apex_2021.png": "/Users/aasirvalji/pics",
  "open travel_1.jpg": "/Users/aasirvalji/pics",
  "open travel_2.jpg": "/Users/aasirvalji/pics",
  "open pics/apex_2021.png": "/Users/aasirvalji",
  "open pics/travel_1.jpg": "/Users/aasirvalji",
  "open pics/travel_2.jpg": "/Users/aasirvalji",
  "open ./pics/apex_2021.png": "/Users/aasirvalji",
  "open ./pics/travel_1.jpg": "/Users/aasirvalji",
  "open ./pics/travel_2.jpg": "/Users/aasirvalji",
  "open aasirvalji/pics/apex_2021.png": "/Users",
  "open aasirvalji/pics/travel_1.jpg": "/Users",
  "open aasirvalji/pics/travel_2.jpg": "/Users",
  "open ./aasirvalji/pics/apex_2021.png": "/Users",
  "open ./aasirvalji/pics/travel_1.jpg": "/Users",
  "open ./aasirvalji/pics/travel_2.jpg": "/Users",
  "open Users/aasirvalji/pics/apex_2021.png": "/",
  "open Users/aasirvalji/pics/travel_1.jpg": "/",
  "open Users/aasirvalji/pics/travel_2.jpg": "/",
  "open ./Users/aasirvalji/pics/apex_2021.png": "/",
  "open ./Users/aasirvalji/pics/travel_1.jpg": "/",
  "open ./Users/aasirvalji/pics/travel_2.jpg": "/",
  "open /Users/aasirvalji/pics/apex_2021.png": "",
  "open /Users/aasirvalji/pics/travel_1.jpg": "",
  "open /Users/aasirvalji/pics/travel_2.jpg": "",
  "cat ../pics/me.txt": "/Users/aasirvalji/pics",
  "cat ../pics/socials.txt": "/Users/aasirvalji/pics",
  "cat ../pics/hobbies.txt": "/Users/aasirvalji/pics",
  "cat ./me.txt": "/Users/aasirvalji",
  "cat ./socials.txt": "/Users/aasirvalji",
  "cat ./hobbies.txt": "/Users/aasirvalji",
  "cat me.txt": "/Users/aasirvalji",
  "cat socials.txt": "/Users/aasirvalji",
  "cat hobbies.txt": "/Users/aasirvalji",
  "cat ./aasirvalji/me.txt": "/Users",
  "cat ./aasirvalji/socials.txt": "/Users",
  "cat ./aasirvalji/hobbies.txt": "/Users",
  "cat aasirvalji/me.txt": "/Users",
  "cat aasirvalji/socials.txt": "/Users",
  "cat aasirvalji/hobbies.txt": "/Users",
  "cat ./Users/aasirvalji/me.txt": "/",
  "cat ./Users/aasirvalji/socials.txt": "/",
  "cat ./Users/aasirvalji/hobbies.txt": "/",
  "cat Users/aasirvalji/me.txt": "/",
  "cat Users/aasirvalji/socials.txt": "/",
  "cat Users/aasirvalji/hobbies.txt": "/",
  "cat /Users/aasirvalji/me.txt": "",
  "cat /Users/aasirvalji/socials.txt": "",
  "cat /Users/aasirvalji/hobbies.txt": "",
  "cd Users": "/",
  "cd aasirvalji": "/Users",
  "cd pics": "/Users/aasirvalji",
};

var width =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

var height =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

const cdItems = ["pics", "pics/"];
var userInputStack = [];
var userInputStackIndex = -1;
var currentPath = "/Users/aasirvalji";

function autocompleteMatch(input, terms) {
  if (input == "") {
    return [];
  }
  var reg = new RegExp(input);
  return terms.filter(function (term) {
    if (term.match(reg)) {
      return term;
    }
  });
}

function generateLastLoginStr() {
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  var prnDt = new Date().toLocaleTimeString("en-us", options);

  var splitDateStr = prnDt.split(", ");
  var dayName = splitDateStr[0];
  var time = splitDateStr[3];
  var monthName = splitDateStr[1].split(" ")[0].slice(0, 3);
  var dayNum = splitDateStr[1].split(" ")[1];
  var days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  dayName = days[days.indexOf(dayName)].slice(0, 3);
  return dayName && monthName && dayNum && time
    ? `Last login: ${dayName} ${monthName}  ${dayNum} ${time} on ttys000`
    : "Last login: Thu Dec  30 14:01:02 on ttys000";
}

// ---------- End global vars and helper functions ----------

document.getElementById("ttys").innerText = generateLastLoginStr();

// Define global vars
var currentCli = document.getElementById("current-cli");
var currentCliInput = document.getElementById("cli-input");
var mainContainer = document.getElementById("container");
var webbookPath = document.getElementById("webbook-path");
var userInput;
var otherInput;
var iteration = 0;

// Keep input field in focus even after document clicks
document.addEventListener("click", () => {
  currentCliInput.focus();
});

function rec() {
  // When the user button press
  currentCliInput.addEventListener("keydown", function onEvent(e) {
    var rawInput = currentCliInput.value;
    var formattedInput = rawInput.replace(/\s+/g, " ").trim();
    var tabResults;
    userInput = formattedInput.split(" ")[0];
    otherInput = formattedInput.split(" ")[1];

    // Autocomplete
    if (e.key === "Tab") {
      e.preventDefault();
      tabResults = autocompleteMatch(
        rawInput,
        Object.keys(tabCompletionValidPath)
      );
      if (userInput && !otherInput) {
        tabResults = tabResults.filter(
          (item) =>
            item.split(" ").length === 1 &&
            (tabCompletionValidPath[item] === currentPath ||
              !tabCompletionValidPath[item])
        );
      } else {
        tabResults = tabResults.filter(
          (item) =>
            item.split(" ")[0] === `${userInput}` &&
            (tabCompletionValidPath[item] === currentPath ||
              !tabCompletionValidPath[item])
        );
      }

      if (tabResults.length === 0) return;
      else if (tabResults.length === 1) {
        currentCliInput.value = tabResults[0];
      } else {
        newDiv = document.createElement("div");
        newDiv.classList.add("tab-grid");
        for (var i = 0; i < tabResults.length; i++) {
          var p = document.createElement("p");
          p.classList.add("tab-item");
          p.classList.add(`ls-item-${i % 4}`);
          p.appendChild(document.createTextNode(`${tabResults[i]}`));
          newDiv.appendChild(p);
        }

        currentCli.parentNode.insertBefore(newDiv, currentCli.nextSibling);

        // Clone the current cli
        var cliCopy = currentCli.cloneNode({ deep: true });

        // Turn the current cli into plain text
        var nestedCliInput = document.getElementById("cli-input");
        currentCli.removeChild(nestedCliInput);
        currentCli.id = ``;
        webbookPath.removeAttribute("id");
        currentCli.classList.add("command-result");
        var previousCommandLine = document.createElement("p");
        previousCommandLine.id = "prev-cli-text";
        previousCommandLine.appendChild(document.createTextNode(`${rawInput}`));
        currentCli.appendChild(previousCommandLine);

        // Remove old text from cli copy
        for (var i = cliCopy.childNodes.length - 1; i >= 0; i--) {
          if (
            cliCopy.childNodes[i].nodeName !== "#text" &&
            cliCopy.childNodes[i].nodeName !== "#comment"
          ) {
            cliCopy.childNodes[i].value = "";
          }
        }

        var newCli = newDiv.parentNode.insertBefore(
          cliCopy,
          newDiv.nextSibling
        );
        currentCli = document.getElementById("current-cli");
        currentCliInput = document.getElementById("cli-input");
        currentCliInput.focus();
        mainContainer = document.getElementById("container");
        webbookPath = document.getElementById("webbook-path");
        iteration++;
        rec();
      }
      return;
    } else if (e.key === "ArrowUp") {
      // Access command history
      if (userInputStackIndex >= userInputStack.length - 1) {
        if (userInputStack.length === 0) return (currentCliInput.value = "");
        return (currentCliInput.value =
          userInputStack[userInputStack.length - 1]);
      }
      currentCliInput.value = userInputStack[++userInputStackIndex];
    } else if (e.key === "ArrowDown") {
      // Access command history
      if (userInputStackIndex <= 0 || userInputStack.length === 0) {
        userInputStackIndex = -1;
        return (currentCliInput.value = "");
      }
      currentCliInput.value = userInputStack[--userInputStackIndex];
    } else if (e.key === "Enter") {
      // Process command
      if (
        !rawInput ||
        !rawInput.replace(/\s/g, "").length ||
        (userInput === "ls" && !validLsPaths.includes(currentPath)) ||
        (userInput === "cd" && otherInput === ".." && currentPath === "/") ||
        (userInput === "cd" && otherInput === ".") ||
        (userInput === "cd" && !otherInput)
      ) {
        if (
          (userInput === "ls" && !validLsPaths.includes(currentPath)) ||
          (userInput === "cd" && otherInput === ".." && currentPath === "/") ||
          (userInput === "cd" && otherInput === ".") ||
          (userInput === "cd" && !otherInput)
        )
          userInputStack.unshift(rawInput);

        // Clone the current cli
        var cliCopy = currentCli.cloneNode({ deep: true });

        // Make the current cli the previous cli, textify the previous cli
        var nestedCliInput = document.getElementById("cli-input");
        currentCli.removeChild(nestedCliInput);
        currentCli.id = ``;
        webbookPath.removeAttribute("id");
        currentCli.classList.add("command-result");
        var previousCommandLine = document.createElement("p");
        previousCommandLine.id = "prev-cli-text";
        previousCommandLine.appendChild(document.createTextNode(`${rawInput}`));
        currentCli.appendChild(previousCommandLine);

        // Remove old text from cli copy
        for (var i = cliCopy.childNodes.length - 1; i >= 0; i--) {
          if (
            cliCopy.childNodes[i].nodeName !== "#text" &&
            cliCopy.childNodes[i].nodeName !== "#comment"
          ) {
            cliCopy.childNodes[i].value = "";
          }
        }

        // Append the clone cli to the previous cli
        currentCli.parentNode.insertBefore(cliCopy, currentCli.nextSibling);

        // Update references, make recursive call
        currentCli = document.getElementById("current-cli");
        currentCliInput = document.getElementById("cli-input");
        currentCliInput.focus();
        mainContainer = document.getElementById("container");
        webbookPath = document.getElementById("webbook-path");
        iteration++;
        return rec();
      } else {
        // If the command didn't exist, return an error message as a new div
        userInputStack.unshift(rawInput);
        var newDiv;
        if (!(userInput in commandsMap)) {
          newDiv = document.createElement("div");
          newDiv.classList.add("command-result"); // Generic ouput
          var commandNotFoundP = document.createElement("p");
          commandNotFoundP.appendChild(
            document.createTextNode(`-bash: ${userInput}: command not found`)
          );
          newDiv.appendChild(commandNotFoundP);
        } else {
          if (userInput === "help") {
            // display list of available commands
            newDiv = document.createElement("div");
            newDiv.classList.add("command-result");
            var commandNotFoundP = document.createElement("p");
            commandNotFoundP.appendChild(
              document.createTextNode(`${currentPath}`)
            );
            newDiv.appendChild(commandNotFoundP);

            newDiv = document.createElement("div");
            newDiv.classList.add("help-list");
            for (var key of Object.keys(commandsMap)) {
              if (key === "help") continue;
              var p = document.createElement("p");
              p.classList.add("help-item");
              p.appendChild(document.createTextNode(`${commandsMap[key]}`));
              newDiv.appendChild(p);
            }
          } else if (userInput === "pwd") {
            newDiv = document.createElement("div");
            newDiv.classList.add("command-result");
            var commandNotFoundP = document.createElement("p");
            commandNotFoundP.appendChild(
              document.createTextNode(`${currentPath}`)
            );
            newDiv.appendChild(commandNotFoundP);
          } else if (userInput === "ls") {
            if (currentPath) {
              var lsItems;
              if (currentPath === "/") lsItems = ["Users/"];
              else if (currentPath === "/Users") lsItems = ["aasirvalji/"];
              else if (currentPath === "/Users/aasirvalji")
                lsItems = ["me.txt", "socials.txt", "hobbies.txt", "pics/"];
              else if (currentPath === "/Users/aasirvalji/pics")
                lsItems = ["apex_2021.png", "travel_1.jpg", "travel_2.jpg"];
              newDiv = document.createElement("div");
              newDiv.classList.add("ls-grid");
              for (var i = 0; i < lsItems.length; i++) {
                var p = document.createElement("p");
                p.classList.add("ls-item");
                p.classList.add(`ls-item-${i % 4}`);
                p.appendChild(document.createTextNode(`${lsItems[i]}`));
                newDiv.appendChild(p);
              }
            }
          } else if (userInput === "cat") {
            var catItem = otherInput && otherInput.toLowerCase();
            var picsRefItems = [
              "../pics/me.txt",
              "../pics/socials.txt",
              "../pics/hobbies.txt",
            ];
            var homeRefItems = [
              "./me.txt",
              "./socials.txt",
              "./hobbies.txt",
              "me.txt",
              "socials.txt",
              "hobbies.txt",
            ];
            var userRefItems = [
              "./aasirvalji/me.txt",
              "./aasirvalji/socials.txt",
              "./aasirvalji/hobbies.txt",
              "aasirvalji/me.txt",
              "aasirvalji/socials.txt",
              "aasirvalji/hobbies.txt",
            ];
            var rootRefItems = [
              "./users/aasirvalji/me.txt",
              "./users/aasirvalji/socials.txt",
              "./users/aasirvalji/hobbies.txt",
              "users/aasirvalji/me.txt",
              "users/aasirvalji/socials.txt",
              "users/aasirvalji/hobbies.txt",
            ];
            var anyRefItems = [
              "/users/aasirvalji/me.txt",
              "/users/aasirvalji/socials.txt",
              "/users/aasirvalji/hobbies.txt",
            ];

            if (!catItem || !otherInput) {
              newDiv = document.createElement("div");
              newDiv.classList.add("command-result"); // Generic ouput
              var commandNotFoundP = document.createElement("p");
              commandNotFoundP.appendChild(
                document.createTextNode(
                  `Please specify a files contents to print`
                )
              );
              newDiv.appendChild(commandNotFoundP);
            } else if (
              (currentPath === "/Users/aasirvalji/pics" &&
                picsRefItems.includes(catItem)) ||
              (currentPath === "/Users/aasirvalji" &&
                homeRefItems.includes(catItem)) ||
              (currentPath === "/Users" && userRefItems.includes(catItem)) ||
              (currentPath === "/" && rootRefItems.includes(catItem)) ||
              (currentPath && anyRefItems.includes(catItem))
            ) {
              var splitCatItem = catItem.split("/");
              var catFileName = splitCatItem[splitCatItem.length - 1];
              newDiv = document.createElement("div");
              newDiv.classList.add("cat-result");
              var catResult = document.createElement("p");
              if (catFileName === "me.txt") {
                catResult.appendChild(
                  document.createTextNode(
                    `My name is Aasir Valji. Im a university student currently taking a year off to gain more work experience as well as to explore new hobbies.
                    I'll be entering my 4th year of Software Engineering in the upcoming year. 
                    Please note, this isn't a serious portfolio and is something I threw 
                    together because I was bored. If you'd like to chat about anything, you can reach me directly at aasirvaljiuwo@gmail.com`
                  )
                );
              } else if (catFileName === "socials.txt") {
                catResult.appendChild(
                  document.createTextNode(
                    `Linkedin: https://www.linkedin.com/in/aasir-valji/
                    Github: https://github.com/aasirvalji`
                  )
                );
              } else if (catFileName === "hobbies.txt") {
                catResult.appendChild(
                  document.createTextNode(
                    `- Playing video games: The games I play the most are Apex Legends (Xbox) and krunker.io (PC). Fun fact, I started playing Apex Legends about 1 year ago and 
                    reached the top 1% of players (Masters rank). I have a picture of my masters accounts stats in '/Users/aasirvalji/pics' if you're interested haha. To view it, 
                    go to the pics directory and use the 'open' command to view the image.`
                  )
                );
                catResult.appendChild(document.createElement("br"));
                catResult.appendChild(
                  document.createTextNode(
                    `
                    - Watching movies/tv-shows: I usually watch whatever is trending on Netflix or revisit older classics.`
                  )
                );
                catResult.appendChild(document.createElement("br"));
                catResult.appendChild(
                  document.createTextNode(
                    `- Travelling: I love visiting new places and seeing what the world has to offer. It's been kinda hard to do that lately because of
                    COVID but hopefully I can go on more trips down the road. There should be a few pictures of a couple of places I've been to in '/Users/aasirvalji/pics'.`
                  )
                );
              }
              newDiv.appendChild(catResult);
            } else {
              // command result output here: cat: ahli.txt: No such file or directory
              newDiv = document.createElement("div");
              newDiv.classList.add("command-result"); // Generic ouput
              var commandNotFoundP = document.createElement("p");
              commandNotFoundP.appendChild(
                document.createTextNode(`cat: ${otherInput}: No such file.`)
              );
              newDiv.appendChild(commandNotFoundP);
            }
          } else if (userInput === "cd") {
            var newPath;
            otherInput = otherInput.toLowerCase(); // allow cd with incase sensitivity
            if (otherInput === "/") {
              currentPath = "/";
              newPath = "/";
            } else if (
              otherInput === "/users" ||
              (otherInput === "users" && currentPath === "/") ||
              (otherInput === "users/" && currentPath === "/") ||
              (otherInput === "./users" && currentPath === "/") ||
              (otherInput === "./users/" && currentPath === "/")
            ) {
              currentPath = "/Users";
              newPath = currentPath;
            } else if (
              otherInput === "/users/aasirvalji" ||
              (otherInput === "users/aasirvalji" && currentPath === "/") ||
              (otherInput === "users/aasirvalji/" && currentPath === "/") ||
              (otherInput === "./users/aasirvalji" && currentPath === "/") ||
              (otherInput === "./users/aasirvalji/" && currentPath === "/") ||
              (otherInput === "aasirvalji" && currentPath === "/Users") ||
              (otherInput === "./aasirvalji" && currentPath === "/Users") ||
              (otherInput === "./aasirvalji/" && currentPath === "/Users") ||
              (otherInput === "aasirvalji/" && currentPath === "/Users") ||
              (otherInput === "~" && currentPath)
            ) {
              currentPath = "/Users/aasirvalji";
              newPath = "~";
            } else if (
              otherInput === "/users/aasirvalji/pics" ||
              (otherInput === "users/aasirvalji/pics" && currentPath === "/") ||
              (otherInput === "./users/aasirvalji/pics" &&
                currentPath === "/") ||
              (otherInput === "./users/aasirvalji/pics/" &&
                currentPath === "/") ||
              (otherInput === "users/aasirvalji/pics/" &&
                currentPath === "/") ||
              (otherInput === "aasirvalji/pics" && currentPath === "/Users") ||
              (otherInput === "./aasirvalji/pics" &&
                currentPath === "/Users") ||
              (otherInput === "./aasirvalji/pics/" &&
                currentPath === "/Users") ||
              (otherInput === "aasirvalji/pics/" && currentPath === "/Users") ||
              (otherInput === "pics" && currentPath === "/Users/aasirvalji") ||
              (otherInput === "pics/" && currentPath === "/Users/aasirvalji") ||
              (otherInput === "./pics" &&
                currentPath === "/Users/aasirvalji") ||
              (otherInput === "./pics/" &&
                currentPath === "/Users/aasirvalji") ||
              (otherInput === "pics" && currentPath === "/Users/aasirvalji")
            ) {
              currentPath = "/Users/aasirvalji/pics";
              newPath = "pics";
            } else if (otherInput === "." || otherInput === "./") {
              if (currentPath === "/Users/aasirvalji/pics") return;
            } else if (otherInput === ".." || otherInput === "../") {
              if (currentPath === "/") return;
              var tempCurrentPath = currentPath.split("/");
              tempCurrentPath.pop();
              currentPath =
                tempCurrentPath.length === 1 && !tempCurrentPath[0]
                  ? "/"
                  : tempCurrentPath.join("/");

              if (currentPath === "/Users") newPath = "/Users";
              else if (currentPath === "/Users/aasirvalji") newPath = "~";
              else newPath = currentPath;
            } else {
              if (currentPath === "/Users/aasirvalji") newPath = "~";
              else if (currentPath === "/Users/aasirvalji/pics")
                newPath = "pics";
              else newPath = currentPath;
              if (!otherInput) {
                // Clone the current cli
                var cliCopy = currentCli.cloneNode({ deep: true });

                // Make the current cli the previous cli, textify the previous cli
                var nestedCliInput = document.getElementById("cli-input");
                currentCli.removeChild(nestedCliInput);
                currentCli.id = ``;
                webbookPath.removeAttribute("id");
                currentCli.classList.add("command-result");
                var previousCommandLine = document.createElement("p");
                previousCommandLine.id = "prev-cli-text";
                previousCommandLine.appendChild(
                  document.createTextNode(`${rawInput}`)
                );
                currentCli.appendChild(previousCommandLine);

                // Remove old text from cli copy
                for (var i = cliCopy.childNodes.length - 1; i >= 0; i--) {
                  if (
                    cliCopy.childNodes[i].nodeName !== "#text" &&
                    cliCopy.childNodes[i].nodeName !== "#comment"
                  ) {
                    cliCopy.childNodes[i].value = "";
                  }
                }

                // Append the clone cli to the previous cli
                currentCli.parentNode.insertBefore(
                  cliCopy,
                  currentCli.nextSibling
                );

                // Update references, make recursive call
                currentCli = document.getElementById("current-cli");
                currentCliInput = document.getElementById("cli-input");
                currentCliInput.focus();
                mainContainer = document.getElementById("container");
                webbookPath = document.getElementById("webbook-path");
                iteration++;
                return rec();
              } else {
                var cdError = `cd: no such directory: ${otherInput.replace(
                  /\/+/g,
                  "/"
                )}`;
                newDiv = document.createElement("div");
                newDiv.classList.add("command-result"); // Generic ouput
                var cdNotFound = document.createElement("p");
                cdNotFound.appendChild(document.createTextNode(`${cdError}`));
                newDiv.appendChild(cdNotFound);
              }
            }

            // Revert by removing newDiv exec in this.block
            if (newDiv)
              currentCli.parentNode.insertBefore(
                newDiv,
                currentCli.nextSibling
              );

            // Clone the current cli
            var cliCopy = currentCli.cloneNode({ deep: true });

            // Make the current cli the previous cli, textify the previous cli
            var nestedCliInput = document.getElementById("cli-input");
            webbookPath = document.getElementById("webbook-path");
            webbookPath.removeAttribute("id");
            currentCli.removeChild(nestedCliInput);
            currentCli.id = ``;
            currentCli.classList.add("command-result");
            var previousCommandLine = document.createElement("p");
            previousCommandLine.id = "prev-cli-text";
            previousCommandLine.appendChild(
              document.createTextNode(`${rawInput}`)
            );
            currentCli.appendChild(previousCommandLine);

            // Remove old text from cli copy
            for (var i = cliCopy.childNodes.length - 1; i >= 0; i--) {
              if (
                cliCopy.childNodes[i].nodeName !== "#text" &&
                cliCopy.childNodes[i].nodeName !== "#comment"
              ) {
                cliCopy.childNodes[i].value = "";
              }
            }

            // Append the clone cli to the previous cli
            if (newDiv)
              newDiv.parentNode.insertBefore(cliCopy, newDiv.nextSibling);
            else
              currentCli.parentNode.insertBefore(
                cliCopy,
                currentCli.nextSibling
              );

            // Update references, make recursive call
            currentCli = document.getElementById("current-cli");
            currentCliInput = document.getElementById("cli-input");
            currentCliInput.focus();
            mainContainer = document.getElementById("container");
            webbookPath = document.getElementById("webbook-path");
            webbookPath.innerText = newPath;
            iteration++;
            return rec();
          } else if (userInput === "open") {
            var imageStr = otherInput && otherInput.toLowerCase();
            var picsRefImages = [
              "apex_2021.png",
              "travel_1.jpg",
              "travel_2.jpg",
            ];
            var homeRefImages = [
              "pics/apex_2021.png",
              "pics/travel_1.jpg",
              "pics/travel_2.jpg",
              "./pics/apex_2021.png",
              "./pics/travel_1.jpg",
              "./pics/travel_2.jpg",
            ];
            var userRefImages = [
              "aasirvalji/pics/apex_2021.png",
              "aasirvalji/pics/travel_1.jpg",
              "aasirvalji/pics/travel_2.jpg",
              "./aasirvalji/pics/apex_2021.png",
              "./aasirvalji/pics/travel_1.jpg",
              "./aasirvalji/pics/travel_2.jpg",
            ];
            var rootRefImages = [
              "users/aasirvalji/pics/apex_2021.png",
              "users/aasirvalji/pics/travel_1.jpg",
              "users/aasirvalji/pics/travel_2.jpg",
              "./users/aasirvalji/pics/apex_2021.png",
              "./users/aasirvalji/pics/travel_1.jpg",
              "./users/aasirvalji/pics/travel_2.jpg",
            ];
            var anyRefImages = [
              "/users/aasirvalji/pics/apex_2021.png",
              "/users/aasirvalji/pics/travel_1.jpg",
              "/users/aasirvalji/pics/travel_2.jpg",
            ];

            if (!imageStr) {
              // Show error message stating that the other input is not an image
              newDiv = document.createElement("div");
              newDiv.classList.add("command-result"); // Generic ouput
              var commandNotFoundP = document.createElement("p");
              commandNotFoundP.appendChild(
                document.createTextNode(
                  `Please provide a image file as an argument.`
                )
              );
              newDiv.appendChild(commandNotFoundP);
            } else if (
              (currentPath === "/Users/aasirvalji/pics" &&
                picsRefImages.includes(imageStr)) ||
              (currentPath === "/Users/aasirvalji" &&
                homeRefImages.includes(imageStr)) ||
              (currentPath === "/Users" && userRefImages.includes(imageStr)) ||
              (currentPath === "/" && rootRefImages.includes(imageStr)) ||
              (currentPath && anyRefImages.includes(imageStr))
            ) {
              var imageStrSplit = imageStr.split("/");
              var imageName = imageStrSplit[imageStrSplit.length - 1];
              new WinBox({
                title: imageName,
                width: `${width / 1.25}px`,
                height: `${height / 1.5}px`,
                top: 50,
                right: 50,
                bottom: 50,
                left: 50,
                class: ["no-min", "no-max", "no-resize", "no-move"],
                url: `./images/${imageName}`,
                onfocus: function () {
                  this.setBackground("#00aa00");
                },
                onblur: function () {
                  this.setBackground("#777");
                },
              });

              // append new terminal line
              // Clone the current cli
              var cliCopy = currentCli.cloneNode({ deep: true });

              // Make the current cli the previous cli, textify the previous cli
              var nestedCliInput = document.getElementById("cli-input");
              currentCli.removeChild(nestedCliInput);
              currentCli.id = ``;
              webbookPath.removeAttribute("id");
              currentCli.classList.add("command-result");
              var previousCommandLine = document.createElement("p");
              previousCommandLine.id = "prev-cli-text";
              previousCommandLine.appendChild(
                document.createTextNode(`${rawInput}`)
              );
              currentCli.appendChild(previousCommandLine);

              // Remove old text from cli copy
              for (var i = cliCopy.childNodes.length - 1; i >= 0; i--) {
                if (
                  cliCopy.childNodes[i].nodeName !== "#text" &&
                  cliCopy.childNodes[i].nodeName !== "#comment"
                ) {
                  cliCopy.childNodes[i].value = "";
                }
              }

              // Append the clone cli to the previous cli
              currentCli.parentNode.insertBefore(
                cliCopy,
                currentCli.nextSibling
              );

              // Update references, make recursive call
              currentCli = document.getElementById("current-cli");
              currentCliInput = document.getElementById("cli-input");
              currentCliInput.focus();
              mainContainer = document.getElementById("container");
              webbookPath = document.getElementById("webbook-path");
              iteration++;
              return rec();
            } else {
              // check the current path and the otherInput
              // Show error message stating that the other input is not an image
              newDiv = document.createElement("div");
              newDiv.classList.add("command-result"); // Generic ouput
              var commandNotFoundP = document.createElement("p");
              commandNotFoundP.appendChild(
                document.createTextNode(
                  `The file ${currentPath}${
                    currentPath[currentPath.length - 1] !== "/" ? "/" : ""
                  }${otherInput} is uncompatible.`.replace(/\/+/g, "/")
                )
              );
              newDiv.appendChild(commandNotFoundP);
            }
          }
        }

        if (!newDiv) return;
        currentCli.parentNode.insertBefore(newDiv, currentCli.nextSibling);

        // Clone the current cli
        var cliCopy = currentCli.cloneNode({ deep: true });

        // Turn the current cli into plain text
        var nestedCliInput = document.getElementById("cli-input");
        currentCli.removeChild(nestedCliInput);
        currentCli.id = ``;
        webbookPath.removeAttribute("id");
        currentCli.classList.add("command-result");
        var previousCommandLine = document.createElement("p");
        previousCommandLine.id = "prev-cli-text";
        previousCommandLine.appendChild(document.createTextNode(`${rawInput}`));
        currentCli.appendChild(previousCommandLine);

        // Remove old text from cli copy
        for (var i = cliCopy.childNodes.length - 1; i >= 0; i--) {
          if (
            cliCopy.childNodes[i].nodeName !== "#text" &&
            cliCopy.childNodes[i].nodeName !== "#comment"
          ) {
            cliCopy.childNodes[i].value = "";
          }
        }

        newDiv.parentNode.insertBefore(cliCopy, newDiv.nextSibling);
        currentCli = document.getElementById("current-cli");
        currentCliInput = document.getElementById("cli-input");
        webbookPath = document.getElementById("webbook-path");
        currentCliInput.focus();
        mainContainer = document.getElementById("container");
        iteration++;
        rec();
      }
    }
  });
}
rec();
