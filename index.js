// TODO !IMPORTANT : Fix the bug where the checkbox is not checked when the page is reloaded
// TODO : Add a feature to remove a site from the list

const SELECTORS = {
  FORM: "form",
  SITE_LIST_CONTAINER: "#site-list-container",
  YOUTUBE: "#youtube",
  ADD_SITE_INPUT: "#add-site-input",
  ADD_SITE_BUTTON: "#add-site-btn",
};
const get = (selector) => document.querySelector(selector);
const getAll = (selector) => document.querySelectorAll(selector);

const formEl = get(SELECTORS.FORM);
/**
 * @type {HTMLDivElement}
 */

const siteListContainerEl = get(SELECTORS.SITE_LIST_CONTAINER);
const addSiteInputEl = get(SELECTORS.ADD_SITE_INPUT);
const addSiteButtonEl = get(SELECTORS.ADD_SITE_BUTTON);

createSiteList();
const inputs = getAll(`${SELECTORS.SITE_LIST_CONTAINER} input`) || null;

// EVENT LISTENERS
// ########################################################################################

addSiteButtonEl.addEventListener("click", () => {
  let value = addSiteInputEl.value ?? "";
  value = value.trim();
  value = value.replace(/\s+/g, "");

  if (!isValidInput(value)) {
    // TODO: Add error message
    return;
  }
  try {
    const url = new URL(value).origin;
    if (!isValidInput(url)) return;
    addNewSite(url);
    createSiteList();
  } catch (error) {
    console.error(error);
    alert("Invalid URL");
  }
});

inputs?.forEach((input) => {
  input.addEventListener("change", (e) => {
    const oldSites = JSON.parse(localStorage.getItem("sitesList")) || null;
    if (!oldSites) return;

    const updatedSites = [...oldSites].map((site) =>
      site.url === e.target.id ? { ...site, checked: e.target.checked } : site
    );
    localStorage.setItem("sitesList", JSON.stringify(updatedSites));
  });
});

// FUNCTIONS
// ########################################################################################

function addNewSite(url) {
  const oldSites = JSON.parse(localStorage.getItem("sitesList")) || [];
  const newSite = { url, checked: true };
  localStorage.setItem("sitesList", JSON.stringify([...oldSites, newSite]));
}

// ########################################################################################

function isValidInput(url) {
  const isValidUrl = url.startsWith("http://") || url.startsWith("https://");
  const alreadyExistsInLocalStorage = JSON.parse(
    localStorage.getItem("sitesList")
  )?.some((site) => site.url === url);

  return isValidUrl && !alreadyExistsInLocalStorage;
}
// ########################################################################################

function createSiteList() {
  siteListContainerEl.innerHTML = "";

  const sitesList = JSON.parse(localStorage.getItem("sitesList")) || null;
  if (!sitesList) return;

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
// ########################################################################################
