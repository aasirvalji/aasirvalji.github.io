const dateInput = document.getElementById("date");
const batteryLevel = document.getElementById("battery-level");
const passwordInput = document.getElementById("password");
const body = document.querySelector("body");

// Mac login page based on https://www.youtube.com/watch?v=bv7kzGtrPU0&ab_channel=CreativeJE

// Get battery percentage
navigator.getBattery().then((battery) => {
  const showBatteryLevel = () => {
    let level = Math.floor(battery.level * 100);
    batteryLevel.innerText = level;
  };

  showBatteryLevel();
  battery.ondischargingtimechange = () => {
    showBatteryLevel();
  };

  battery.onchargingtimechange = () => {
    showBatteryLevel();
  };
});

dateInput.innerText = moment().format("ddd D MMM h:mm A");

// Set date
setInterval(() => {
  dateInput.innerText = moment().format("ddd D MMM h:mm A");
}, 1000 * 60); // Every 1 minute

// Full screen on input field click
passwordInput.addEventListener("click", () => {
  body.requestFullscreen();
});

passwordInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    var userPasswordInput = passwordInput.value;
    console.log(
      `Woah, you were right. The password actually is ${userPasswordInput}`
    );

    document.getElementById("page-1").remove();

    var page2 = document.getElementById("page-2");
    page2.classList.remove("hidden");

    var elem = document.getElementById("myBar");
    var width = 0;
    var id = setInterval(frame, 50);

    function frame() {
      if (width >= 100) {
        clearInterval(id);
        page2.remove();
        var page3 = document.getElementById("page-3");
        page3.classList.remove("hidden");

        document.body.style.overflowX = "hidden";
        document.body.style.fontSize = "0.85rem";
        document.body.style.fontFamily = "Roboto Mono";
        document.body.style.color = "rgb(0, 240, 0)";
        rec();
      } else {
        width++;
        elem.style.width = `${width}%`;
      }
    }
  }
});
