import bot from "./assets/bot.svg";
import usersvg from "./assets/user.svg";

const form = document.querySelector("form");
const chatcontainer = document.querySelector("#chat_container");

let loadinternal;

function loader(element) {
  element.textContent = "";
  loadinternal = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "...") {
      element.textContent = "";
    }
  }, 300);
}
  function typeText(element, text) {
    let Index = 0;
    let interval = setInterval(() => {
      if (Index < text.length) {
        element.innerHTML += text.charAt(Index);
        Index++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  }

function generateUniqueid() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimal = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimal}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class = "wrapper ${isAi && "ai"}">
    <div class="chat">
    <div class="profile">
    <img src="${isAi ? bot : usersvg}" alt="${isAi ? "bot" : "user"}" />
    </div>    
    <div class='message' id = ${uniqueId}>${value}</div>
    </div>
    </div>
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  chatcontainer.innerHTML += chatStripe(false, data.get("prompt"));
  console.log(chatcontainer);
  form.reset();
  const uniqueId = generateUniqueid();
  chatcontainer.innerHTML += chatStripe(true, " ", uniqueId);
  chatcontainer.scrollTop = chatcontainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  const response = await fetch('http://localhost:5000/', {
    method:'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  

  clearInterval(loadinternal);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedata = data.trim();
    console.log({ parsedata });
    typeText(messageDiv, parsedata);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Some thing went wrong ";
    alert(err);
    console.error(err);
  }
};

form.addEventListener("submit", handleSubmit);

form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
