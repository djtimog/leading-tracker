let myLeads = [];
const inputBtn = document.getElementById("input-btn");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("ul-el");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));

    render(myLeads);
  });
});

function render(leads) {
  ulEl.innerHTML = "";

  leads.reverse().forEach((lead, i) => {
    const li = document.createElement("li");

    const linkContainer = document.createElement("div");
    linkContainer.className = "link-container";

    const a = document.createElement("a");
    a.target = "_blank";
    a.href = lead;
    a.textContent = lead;

    const copyBtn = document.createElement("button");
    copyBtn.className = "copy";
    copyBtn.textContent = "Copy";
    copyBtn.addEventListener("click", () => copyLead(lead));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "cross";
    deleteBtn.textContent = "X";
    deleteBtn.addEventListener("dblclick", () => deleteLead(i));

    linkContainer.appendChild(a);
    li.appendChild(linkContainer);
    li.appendChild(copyBtn);
    li.appendChild(deleteBtn);

    ulEl.appendChild(li);
  });
}

inputBtn.addEventListener("click", function () {
  myLeads.push(inputEl.value);
  inputEl.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));

  render(myLeads);
});

deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
});

function deleteLead(index) {
  myLeads.splice(index, 1);
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
}

function copyLead(lead) {
  navigator.clipboard
    .writeText(lead)
    .then(() => {
      alert("Copied the text: " + lead);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}
