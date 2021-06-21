const PubSub = function () {
  this.events = {};

  this.subscribe = (eventName, fn) => {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  };

  this.publish = (eventName, data) => {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach((callBack) => {
      if (typeof callBack === "function") {
        callBack(data);
      }
    });
  };
};

//Initializing a new instance for the above function constructor
const newPubSub = new PubSub();

//This object basically maps which subscriber has subscribed to which publisher
const pubToSubMapping = {
  pub1: ["s1-display-area", "s2-display-area"],
  pub2: ["s2-display-area"],
};

//Subscription code for our 2 subscriber s1 and s2

newPubSub.subscribe("pub1", function (data) {
  pubToSubMapping["pub1"].forEach((displayAreaId) => {
    const displayAreaList = document.getElementById(displayAreaId);
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(`From 1 : ${data}`));
    displayAreaList.appendChild(li);
  });
});

newPubSub.subscribe("pub2", function (data) {
  pubToSubMapping["pub2"].forEach((displayAreaId) => {
    const displayAreaList = document.getElementById(displayAreaId);
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(`From 2 : ${data}`));
    displayAreaList.appendChild(li);
  });
});

//Initializing stats count to zero
var p1Stats = 0;
var p2Stats = 0;

//subscribing the stats counter dynamically to the publishers
newPubSub.subscribe("dataPublished", function (data) {
  const statsDisplayArea = document.getElementById(`${data}-stats`);

  if (data === "p1") {
    p1Stats++;
    statsDisplayArea.innerHTML = p1Stats;
  } else {
    p2Stats++;
    statsDisplayArea.innerHTML = p2Stats;
  }
});

//PUBLISHING PART - Here every event that is fired from from the input is published
//and the subscribers who have already above will recieve these event as data to be published/consumed
const p1Input = document.getElementById("p1-input");
const p1Button = document.querySelector(".p1-btn");
const p2Input = document.getElementById("p2-input");
const p2Button = document.querySelector(".p2-btn");

p1Button.addEventListener("click", (e) => {
  let data = p1Input.value;

  newPubSub.publish("pub1", data);
  p1Input.value = "";
  newPubSub.publish("dataPublished", "p1");
});

p2Button.addEventListener("click", (e) => {
  let data = p2Input.value;

  newPubSub.publish("pub2", data);
  p2Input.value = "";
  newPubSub.publish("dataPublished", "p2");
});
