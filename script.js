document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const noteUrl = params.get("url");
  const password = params.get("password");

  if (!noteUrl || !password) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("noteTitle").innerText = `Editing: ${noteUrl}`;
  loadTabs(noteUrl);
});

// Load all tabs for the given URL
function loadTabs(noteUrl) {
  const savedTabs = JSON.parse(localStorage.getItem(`${noteUrl}_tabs`)) || [];
  
  if (savedTabs.length === 0) {
    addTab("New Tab");
  } else {
    savedTabs.forEach(tabName => createTab(tabName));
    switchTab(savedTabs[0]);
  }
}

// Create a new tab
document.getElementById("addTabBtn").addEventListener("click", function () {
  const tabName = prompt("Enter tab name:");
  if (!tabName) return;
  addTab(tabName);
});

function addTab(tabName) {
  const noteUrl = new URLSearchParams(window.location.search).get("url");
  const savedTabs = JSON.parse(localStorage.getItem(`${noteUrl}_tabs`)) || [];

  if (!savedTabs.includes(tabName)) {
    savedTabs.push(tabName);
    localStorage.setItem(`${noteUrl}_tabs`, JSON.stringify(savedTabs));
  }

  createTab(tabName);
  switchTab(tabName);
}

// Create and display tab button
function createTab(tabName) {
  const tab = document.createElement("button");
  tab.classList.add("tab");
  tab.innerText = tabName;
  tab.addEventListener("click", () => switchTab(tabName));
  document.getElementById("tabs").appendChild(tab);
}

// Switch to a selected tab
function switchTab(tabName) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    tab.classList.remove("active");
    if (tab.innerText === tabName) tab.classList.add("active");
  });

  loadNote(tabName);
}

// Load note content for selected tab
function loadNote(tabName) {
  const noteUrl = new URLSearchParams(window.location.search).get("url");
  const password = new URLSearchParams(window.location.search).get("password");
  const encrypted = localStorage.getItem(`${noteUrl}_${tabName}`);

  if (!encrypted) {
    document.getElementById("note").value = "";
    return;
  }

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    document.getElementById("note").value = decrypted || "";
  } catch {
    alert("Incorrect password!");
    window.location.href = "index.html";
  }
}

// Encrypt and save note
document.getElementById("encryptBtn").addEventListener("click", function () {
  const noteUrl = new URLSearchParams(window.location.search).get("url");
  const password = new URLSearchParams(window.location.search).get("password");
  const tabName = document.querySelector(".tab.active").innerText;
  const note = document.getElementById("note").value;

  const encrypted = CryptoJS.AES.encrypt(note, password).toString();
  localStorage.setItem(`${noteUrl}_${tabName}`, encrypted);
  alert("Note saved!");
});

// Delete current tab
document.getElementById("deleteTabBtn").addEventListener("click", function () {
  const noteUrl = new URLSearchParams(window.location.search).get("url");
  const tabName = document.querySelector(".tab.active").innerText;

  localStorage.removeItem(`${noteUrl}_${tabName}`);
  loadTabs(noteUrl);
});

// Back to homepage
document.getElementById("backBtn").addEventListener("click", function () {
  window.location.href = "index.html";
});
