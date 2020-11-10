import { display } from "display";
import document from "document";
import { HeartRateSensor } from "heart-rate";

const hrmData = document.getElementById("hrm-data");

const sensors = [];
const hr_history = [];

const root_width = document.getElementById("root").width;
const root_height = document.getElementById("root").height;

function update_hr_history(hr) {
  while (hr_history.length >= 30) {
    hr_history.shift();
  }
  hr_history.push(hr);
  for (var i=0; i<hr_history.length; i++) {
    let bar_elem = document.getElementById("bar" + i);
    bar_elem.height = root_height - (hr_history[i] * 2);
  }
}

if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    let hr = hrm.heartRate ? hrm.heartRate : 0;
    hrmData.text = hr;
    update_hr_history(hr);
  });
  sensors.push(hrm);
  hrm.start();
//  for (var i=0; i<30; i++) {
//    let bar_elem = document.getElementById("bar" + i);
//    bar_elem.width = (root_width / 30) * i;
//  }
} else {
  hrmData.style.display = "none";
}

display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});
