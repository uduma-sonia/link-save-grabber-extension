const linkInput = document.getElementById("linkInput");
const addBtn = document.getElementById("addBtn");
const linkList = document.getElementById("linkList");
const saveCurrentTabBtn = document.getElementById("saveCurrentTabBtn");

function renderLinks(links) {
  linkList.innerHTML = "";
  links.forEach((link, index) => {
    const li = document.createElement("li");

    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.textContent = link;
    anchor.target = "_blank";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.onclick = () => deleteLink(index);

    li.appendChild(anchor);
    li.appendChild(deleteBtn);
    linkList.prepend(li);
  });
}

function addLink() {
  const newLink = linkInput.value.trim();
  if (!newLink) return;

  chrome.storage.sync.get("links", (data) => {
    const links = data.links || [];
    links.push(newLink);
    chrome.storage.sync.set({ links }, loadLinks);
    linkInput.value = "";
  });
}

function deleteLink(index) {
  chrome.storage.sync.get("links", (data) => {
    const links = data.links || [];
    links.splice(index, 1);
    chrome.storage.sync.set({ links }, loadLinks);
  });
}

saveCurrentTabBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentUrl = tabs[0]?.url;
    if (currentUrl) {
      chrome.storage.sync.get("links", (data) => {
        const links = data.links || [];
        if (!links.includes(currentUrl)) {
          links.push(currentUrl);
          chrome.storage.sync.set({ links }, loadLinks);
        }
      });
    }
  });
});

function loadLinks() {
  chrome.storage.sync.get("links", (data) => {
    const links = data.links || [];
    renderLinks(links);
  });
}

addBtn.addEventListener("click", addLink);
loadLinks();
