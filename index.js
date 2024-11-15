// TODO: Add a feature to remove a site from the list
// TODO: Add a feature to lock the user from modifying the list for a period of time

//  CONSTANTS
const SELECTORS = {
  FORM: "form",
  SITE_LIST_CONTAINER: "#site-list-container",
  ADD_SITE_INPUT: "#add-site-input",
  ADD_SITE_BUTTON: "#add-site-btn",
  VALIDATION_ERROR_TEXT: "#error-message",
};
const SITES_LIST = "sitesList";

// GET HTML ELEMENTS HELPERS
const get = (selector) => document.querySelector(selector);
const getAll = (selector) => document.querySelectorAll(selector);

const formEl = get(SELECTORS.FORM);
const siteListContainerEl = get(SELECTORS.SITE_LIST_CONTAINER);
const addSiteInputEl = get(SELECTORS.ADD_SITE_INPUT);
const addSiteButtonEl = get(SELECTORS.ADD_SITE_BUTTON);
const validationErrorTextEl = get(SELECTORS.VALIDATION_ERROR_TEXT);

// CREATE SITE LIST WITH ITEMS FROM SYNC STORAGE
await createSiteList().then(() => {
  console.log("SITE LIST CREATED");
});

// EVENT LISTENERS

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  await addNewSite();
});
addSiteButtonEl.addEventListener("click", addNewSite);
addSiteInputEl.addEventListener("input", () => {
  validationErrorTextEl.textContent = "";
  addSiteInputEl.classList.remove("input-error");
});

// LOGIC FUNCTIONS

async function addNewSite() {
  let url = addSiteInputEl.value ?? "";
  url = url.replace(/\s+/g, "");

  const isValidInput = await validateInput(url);
  if (!isValidInput) {
    return;
  }

  try {
    const oldSitesList = await getSitesList();

    const newSitesList = [...oldSitesList, { url, checked: true }];
    chrome.storage.sync.set({ sitesList: newSitesList }, async () => {
      await createSiteList();
      addSiteInputEl.value = "";
    });
  } catch (error) {
    console.error(error);
    alert("Invalid URL");
  }
}

async function updateSite(e) {
  const oldSitesList = await getSitesList();
  if (!oldSitesList || oldSitesList.length <= 0) return;

  const updatedSites = oldSitesList.map((site) =>
    site.url === e.target.id ? { ...site, checked: e.target.checked } : site
  );

  await chrome.storage.sync.set({ sitesList: updatedSites });
}

async function removeSite(e) {
  const id = e.target.dataset.id;
  const oldSitesList = await getSitesList();

  const newSitesList = oldSitesList.filter((site) => site.url !== id);
  chrome.storage.sync.set({ sitesList: newSitesList }, () => {
    console.table("REMOVING SITE");
  });

  await createSiteList();
}

async function createSiteList() {
  siteListContainerEl.innerHTML = "";

  let sitesList = await getSitesList();

  if (!sitesList || sitesList.length <= 0) return;

  sitesList.forEach((site) => {
    const siteEl = document.createElement("div");

    const deleteIconEl = document.createElement("img");
    deleteIconEl.dataset.id = site.url;
    deleteIconEl.src = "./trash-solid.svg";
    deleteIconEl.classList.add("delete-btn");

    const inputEl = document.createElement("input");
    inputEl.id = site.url;
    inputEl.type = "checkbox";
    inputEl.checked = site.checked;

    const labelEl = document.createElement("label");
    labelEl.htmlFor = site.url;
    labelEl.textContent = site.url;

    siteEl.appendChild(inputEl);
    siteEl.appendChild(labelEl);
    siteEl.appendChild(deleteIconEl);

    siteListContainerEl.appendChild(siteEl);
  });

  const checkBoxes = getAll(`${SELECTORS.SITE_LIST_CONTAINER} input`) || null;
  const deleteButtons = getAll(`${SELECTORS.SITE_LIST_CONTAINER} img`) || null;

  checkBoxes?.forEach((input) => input.addEventListener("change", updateSite));
  deleteButtons?.forEach((button) =>
    button.addEventListener("click", removeSite)
  );
}

// HELPERS FUNCTIONS
async function validateInput(url) {
  const isValidUrl = url.startsWith("http://") || url.startsWith("https://");
  const oldSitesList = await getSitesList();
  const siteDoesNotExist = oldSitesList.every((site) => site.url !== url);

  if (url === "") {
    validationErrorTextEl.textContent = "Cannot be empty";
  } else if (!isValidUrl) {
    validationErrorTextEl.textContent = "Invalid URL";
  } else if (!siteDoesNotExist) {
    validationErrorTextEl.textContent = "Site already in the list";
  }

  const isValidInput = isValidUrl && siteDoesNotExist && url !== "";

  if (!isValidInput) {
    addSiteInputEl.classList.add("input-error");
  }
  return isValidInput;
}

async function getSitesList() {
  const items = await chrome.storage.sync.get([SITES_LIST]);
  return items?.sitesList ?? [];
}
