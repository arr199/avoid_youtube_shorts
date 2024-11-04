// TODO !IMPORTANT : Fix the bug where the checkbox is not checked when the page is reloaded
// TODO : Add a feature to remove a site from the list

//  CONSTANTS
const SELECTORS = {
  FORM: "form",
  SITE_LIST_CONTAINER: "#site-list-container",
  ADD_SITE_INPUT: "#add-site-input",
  ADD_SITE_BUTTON: "#add-site-btn",
};
const SITES_LIST = "sitesList";

// GET HTML ELEMENTS HELPERS
const get = (selector) => document.querySelector(selector);
const getAll = (selector) => document.querySelectorAll(selector);

const formEl = get(SELECTORS.FORM);
const siteListContainerEl = get(SELECTORS.SITE_LIST_CONTAINER);
const addSiteInputEl = get(SELECTORS.ADD_SITE_INPUT);
const addSiteButtonEl = get(SELECTORS.ADD_SITE_BUTTON);

// CREATE SITE LIST WITH ITEMS FROM SYNC STORAGE
await createSiteList().then(() => {
  console.log("SITE LIST CREATED");
});

const checkBoxes = getAll(`${SELECTORS.SITE_LIST_CONTAINER} input`) || null;

// EVENT LISTENERS

addSiteButtonEl.addEventListener("click", async (e) => {
  let value = addSiteInputEl.value ?? "";
  value = value.trim();
  value = value.replace(/\s+/g, "");

  const isValidInput = await validateInput(value);

  console.log("INPUT :", isValidInput);

  if (!isValidInput) {
    // TODO: Add error message
    return;
  }

  try {
    const url = new URL(value).origin || null;
    if (!url) throw new Error("Invalid URL");

    await addNewSite(url);
    await createSiteList();
  } catch (error) {
    console.error(error);
    alert("Invalid URL");
  }
});

checkBoxes?.forEach((input) => {
  input.addEventListener("change", async (e) => {
    const oldSitesList = await getSitesList();
    if (!oldSitesList || oldSitesList.length <= 0) return;

    const updatedSites = oldSitesList.map((site) =>
      site.url === e.target.id ? { ...site, checked: e.target.checked } : site
    );

    await chrome.storage.sync.set({ sitesList: updatedSites });

    await createSiteList();
  });
});




// LOGIC FUNCTIONS
async function addNewSite(url) {
  const oldSitesList = await getSitesList();

  const newSitesList = [...oldSitesList, { url, checked: true }];
  chrome.storage.sync.set({ sitesList: newSitesList }, () => {
    console.table("SAVING NEW SITE");
  });
}

async function removeSite(url) {
  const oldSitesList = await getSitesList();
  const newSitesList = oldSitesList.filter((site) => site.url !== url);
  chrome.storage.sync.set({ sitesList: newSitesList }, () => {
    console.table("REMOVING SITE");
  });
}

async function createSiteList() {
  siteListContainerEl.innerHTML = "";

  let sitesList = await getSitesList();

  if (!sitesList || sitesList.length <= 0) return;

  sitesList.forEach((site) => {
    const siteEl = document.createElement("div");

    const inputEl = document.createElement("input");
    inputEl.id = site.url;
    inputEl.type = "checkbox";
    inputEl.checked = site.checked;

    const labelEl = document.createElement("label");
    labelEl.htmlFor = site.url;
    labelEl.textContent = site.url;

    siteEl.appendChild(inputEl);
    siteEl.appendChild(labelEl);

    siteListContainerEl.appendChild(siteEl);
  });
}

// HELPERS FUNCTIONS
async function validateInput(url) {
  const isValidUrl = url.startsWith("http://") || url.startsWith("https://");
  const oldSitesList = await getSitesList();
  const doesNotExist = oldSitesList.every((site) => site.url !== url);

  console.log("URL :", url);
  console.log("isValidUrl :", isValidUrl);
  console.log("doesNotExist :", doesNotExist);

  return isValidUrl && doesNotExist;
}

async function getSitesList() {
  const items = await chrome.storage.sync.get([SITES_LIST]);

  return items?.sitesList ?? [];
}
