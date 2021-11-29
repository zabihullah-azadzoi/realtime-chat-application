const socket = io();

const locationButton = document.querySelector(".location-button");
const messageInput = document.querySelector(".message-input");
const messageBody = document.querySelector(".message-body");
const sidebar = document.querySelector(".sidebar");

//templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const joinForm = document.querySelector(".join");

const autoScroll = () => {
  messageBody.scrollTop = messageBody.scrollHeight;
};

socket.on("message", (data) => {
  const html = Mustache.render(messageTemplate, {
    userName: data.userName,
    message: data.message,
    createdAt: data.createdAt,
  });
  messageBody.insertAdjacentHTML("beforeend", html);
  if (data.id === socket.id) {
    // messageBody.lastElementChild.classList.add("my-message");
    messageBody.lastElementChild.id = "my-message";
  }
  autoScroll();
});

socket.on("shareLocation", (location) => {
  const html = Mustache.render(locationTemplate, {
    userName: location.userName,
    location: location.location,
    createdAt: location.createdAt,
  });
  messageBody.insertAdjacentHTML("beforeend", html);
  if (location.id === socket.id) {
    messageBody.lastElementChild.id = "my-message";
  }
  autoScroll();
});

socket.on("join", (users) => {
  const html = Mustache.render(sidebarTemplate, {
    users,
  });
  sidebar.innerHTML = html;
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.querySelector("input").value;

  socket.emit("message", message, (message) => {
    console.log(message);
  });
  messageInput.value = "";
  messageInput.focus();
});

locationButton.addEventListener("click", (e) => {
  locationButton.setAttribute("disabled", "disabled");
  var options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };
  navigator.geolocation.getCurrentPosition(
    (success) => {
      if (success) {
        socket.emit("shareLocation", {
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
        });
      } else {
        alert("this feature is not supported by your browser");
      }
      locationButton.removeAttribute("disabled");
    },
    (error) => {
      alert(error.message);
      locationButton.removeAttribute("disabled");
    },
    options
  );
});

socket.emit("join", location.search, (error) => {
  location.href = "/";
  alert(error);
});

// humberger menu icon function
function myFunction(x) {
  x.classList.toggle("change");
  const sidebar = document.querySelector(".sidebar");
  if (sidebar.style.display !== "block") {
    sidebar.style.display = "block";
  } else if (sidebar.style.display === "block") {
    sidebar.style.display = "none";
  }
}
