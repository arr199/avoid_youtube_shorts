// TODO: Add a validation pop up when the user tries to block the extension

/**
 * @typedef {Object} Site
 * @property {string} url
 * @property {boolean} checked
 */

// HTML ELEMENT SELECTORS
const SELECTORS = {
  FORM: "form",
  SITE_LIST_CONTAINER: "#site-list-container",
  ADD_SITE_INPUT: "#add-site-input",
  ADD_SITE_BUTTON: "#add-site-btn",
  VALIDATION_ERROR_TEXT: "#error-message",
  LOCK_EXTENSION_BUTTON: "#lock-extension-btn",
  LOCKED_TOOLTIP: "#locked-tooltip",
};

// CONSTANTS
const SITES_LIST = "sitesList";
const LOCKED = "locked";

// GET HTML ELEMENTS HELPERS
const get = (selector) => document.querySelector(selector);
const getAll = (selector) => document.querySelectorAll(selector);

const formEl = get(SELECTORS.FORM);
const siteListContainerEl = get(SELECTORS.SITE_LIST_CONTAINER);
const addSiteInputEl = get(SELECTORS.ADD_SITE_INPUT);
const addSiteButtonEl = get(SELECTORS.ADD_SITE_BUTTON);
const validationErrorTextEl = get(SELECTORS.VALIDATION_ERROR_TEXT);
const lockExtensionButtonEl = get(SELECTORS.LOCK_EXTENSION_BUTTON);
const lockedTooltip = document.querySelector(SELECTORS.LOCKED_TOOLTIP);
const timeRemainingEl = document.createElement("p");

// CREATE SITE LIST WITH ITEMS FROM SYNC STORAGE

await createSiteList().then(async () => {
  if (await isExtensionLocked()) {
    disableUI();
  }
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
lockExtensionButtonEl.addEventListener("mouseover", () => {
  lockedTooltip.style.display = "block";
});
lockExtensionButtonEl.addEventListener("mouseout", () => {
  lockedTooltip.style.display = "none";
});
lockExtensionButtonEl.addEventListener("click", lockExtension);

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

/**
 * @param {MouseEvent} e
 */
async function updateSite(e) {
  const oldSitesList = await getSitesList();
  if (!oldSitesList || oldSitesList.length <= 0) return;

  const updatedSites = oldSitesList.map((site) =>
    site.url === e.target.id ? { ...site, checked: e.target.checked } : site
  );

  await chrome.storage.sync.set({ sitesList: updatedSites });
}

/**
 * @param {MouseEvent} e
 */
async function removeSite(e) {
  const id = e.target.dataset.id;
  const oldSitesList = await getSitesList();

  const newSitesList = oldSitesList.filter((site) => site.url !== id);
  chrome.storage.sync.set({ sitesList: newSitesList }, () => {
    console.table("REMOVING SITE");
  });

  await createSiteList();
}
/**
 * @description Create a list of sites from the sync storage
 */
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
/**
 * @description Lock the extension for a week disabling the form and the lock button
 */

async function lockExtension() {
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  chrome.storage.sync.set({ locked: oneWeekFromNow.getTime() }, () => {
    console.log("Locking extension");
  });

  disableUI();
}

/**
 * @description Update the time remaining to unlock the extension
 */
async function updateRemainingLockedTime() {
  const result = await chrome.storage.sync.get([LOCKED]);
  const lockedTime = new Date(result.locked);

  const remainingTime = new Date(lockedTime - Date.now());
  const days = remainingTime.getUTCDate() - 1;
  const hours = remainingTime.getUTCHours();
  const minutes = remainingTime.getUTCMinutes();
  const seconds = remainingTime.getUTCSeconds();
  timeRemainingEl.textContent = `Time remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function disableUI() {
  formEl.style.pointerEvents = "none";
  formEl.style.opacity = 0.5;
  formEl.style.pointer = "none";
  lockExtensionButtonEl.textContent = "Locked";
  lockExtensionButtonEl.insertAdjacentElement("afterend", timeRemainingEl);
  updateRemainingLockedTime();
  setInterval(updateRemainingLockedTime, 1000);
}

// HELPERS FUNCTIONS

/**
 * @param {string} url
 * @returns {Promise<boolean>}
 */
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

/**
 * @returns {Promise<Site[]>}
 */
async function getSitesList() {
  const items = await chrome.storage.sync.get([SITES_LIST]);
  return items?.sitesList ?? [];
}

/**
 * @returns {Promise<boolean>}
 */
async function isExtensionLocked() {
  const { locked = null } = await chrome.storage.sync.get([LOCKED]);

  console.log(locked);
  if (locked) return Date.now() < locked;
  return false;
}
