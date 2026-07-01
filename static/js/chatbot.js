// ======================================================
//                  NEXUS AI CHATBOT
//                  Part 3A
// ======================================================

// ------------------------------------------------------
// Elements
// ------------------------------------------------------

const chatBody = document.getElementById("chatBody");
const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const clearButton = document.getElementById("clearButton");
const newChatButton = document.getElementById("newChat");
const typingIndicator = document.getElementById("typingIndicator");
const historyList = document.getElementById("historyList");

// ------------------------------------------------------
// Auto Resize Textarea
// ------------------------------------------------------

if (input) {

    input.addEventListener("input", () => {

        input.style.height = "auto";

        input.style.height = input.scrollHeight + "px";

    });

}

// ------------------------------------------------------
// Enter Key
// Shift + Enter = New Line
// ------------------------------------------------------

if (input) {

    input.addEventListener("keydown", (e) => {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            sendMessage();

        }

    });

}

// ------------------------------------------------------
// Send Button
// ------------------------------------------------------

if (sendButton) {

    sendButton.addEventListener("click", sendMessage);

}

// ------------------------------------------------------
// Suggestion Buttons
// ------------------------------------------------------

document.querySelectorAll(".suggestion").forEach(btn => {

    btn.addEventListener("click", () => {

        input.value = btn.innerText;

        sendMessage();

    });

});

// ------------------------------------------------------
// Create Chat Bubble
// ------------------------------------------------------

function createMessage(text, type) {

    const wrapper = document.createElement("div");

    wrapper.className = type + "-message fade-in";

    wrapper.innerHTML = `

        <div class="avatar">

            <i class="fa-solid ${type === "user" ? "fa-user" : "fa-robot"}"></i>

        </div>

        <div class="message">

            ${type === "bot" ? `

            <button class="copy-btn">

                <i class="fa-solid fa-copy"></i>

            </button>

            ` : ""}

            <div class="message-text">

                ${text}

            </div>

        </div>

    `;

    chatBody.appendChild(wrapper);

    chatBody.scrollTop = chatBody.scrollHeight;

    // Copy Button

    const copy = wrapper.querySelector(".copy-btn");

    if (copy) {

        copy.onclick = () => {

            navigator.clipboard.writeText(text);

            copy.innerHTML =

                '<i class="fa-solid fa-check"></i>';

            setTimeout(() => {

                copy.innerHTML =

                    '<i class="fa-solid fa-copy"></i>';

            }, 1200);

        };

    }

}

// ------------------------------------------------------
// Typing Animation
// ------------------------------------------------------

function showTyping() {

    if (typingIndicator) {

        typingIndicator.style.display = "flex";

    }

}

function hideTyping() {

    if (typingIndicator) {

        typingIndicator.style.display = "none";

    }

}

// ------------------------------------------------------
// Send Message
// ------------------------------------------------------

async function sendMessage() {

    if (!input) return;

    const message = input.value.trim();

    if (message === "") return;

    createMessage(message, "user");

    input.value = "";

    input.style.height = "60px";

    showTyping();

    // Part 3B continues here...
        try {

        const response = await fetch("/ask", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        const data = await response.json();

        hideTyping();

        createMessage(data.response, "bot");

        addHistory(message);

        saveChat();

    }

    catch (error) {

        hideTyping();

        createMessage(

            "❌ Sorry, I couldn't connect to the AI server.",

            "bot"

        );

        console.error(error);

    }

}

// ======================================================
// Chat History
// ======================================================

function addHistory(text) {

    if (!historyList) return;

    const li = document.createElement("li");

    li.innerText =

        text.length > 35

        ? text.substring(0,35) + "..."

        : text;

    historyList.prepend(li);

}

// ======================================================
// Save Chat
// ======================================================

function saveChat() {

    localStorage.setItem(

        "nexus_chat",

        chatBody.innerHTML

    );

}

// ======================================================
// Load Chat
// ======================================================

function loadChat() {

    const chat = localStorage.getItem(

        "nexus_chat"

    );

    if(chat){

        chatBody.innerHTML = chat;

    }

}

// ======================================================
// Clear Chat
// ======================================================

if(clearButton){

    clearButton.addEventListener("click",()=>{

        if(!confirm("Clear this conversation?")) return;

        chatBody.innerHTML = `

        <div class="bot-message">

            <div class="avatar">

                <i class="fa-solid fa-robot"></i>

            </div>

            <div class="message">

                <div class="message-text">

                    👋 Hello!

                    <br><br>

                    I'm Nexus AI.

                    Ask me anything.

                </div>

            </div>

        </div>

        `;

        localStorage.removeItem("nexus_chat");

    });

}

// ======================================================
// New Chat
// ======================================================

if(newChatButton){

    newChatButton.addEventListener("click",()=>{

        chatBody.innerHTML = `

        <div class="bot-message">

            <div class="avatar">

                <i class="fa-solid fa-robot"></i>

            </div>

            <div class="message">

                <div class="message-text">

                    ✨ New conversation started.

                    <br><br>

                    Ask me anything.

                </div>

            </div>

        </div>

        `;

        input.value = "";

        localStorage.removeItem("nexus_chat");

    });

}

// ======================================================
// Auto Scroll
// ======================================================

const observer = new MutationObserver(()=>{

    chatBody.scrollTop = chatBody.scrollHeight;

});

observer.observe(chatBody,{

    childList:true,

    subtree:true

});

// ======================================================
// Initialize
// ======================================================

window.onload = ()=>{

    loadChat();

    hideTyping();

};