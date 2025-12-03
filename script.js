import { html, renderComponent, useEffect, useState } from "./js/preact-htm.js";
import { Map } from "./js/map.js";
import { isMobile, REPO_URL } from "./js/helper.js";
import { getAllFocusAreaGroupsForProject } from "./js/focusAreas.js";
import {
  FocusAreaDropdown,
  FocusAreaActiveIndicator,
  rotateFocusAreaTriggerCaret,
  closeFocusAreaDropdown,
} from "./js/focusAreaDropdown.js";

console.log("Script for place-based map loaded.");
main();

function main() {
  Promise.all([
    d3.csv(
      REPO_URL + "/data/focusAreasData.csv"
      // "./data/focusAreasData.csv"
    ),
    d3.csv(
      REPO_URL + "/data/nationswell_placebased_projects.csv"
      // "./data/nationswell_placebased_projects.csv"
    ),
  ]).then(([focusAreaData, placesData]) => {
    // process focus area data
    focusAreaData.forEach((d) => {
      d["group"] = d["Focus Area Category"];
      d["area"] = d["Focus Area"];
    });

    // group focus area data by focus group
    const groupedData = d3.group(focusAreaData, (d) => d["group"]);
    const groupedDataArray = Array.from(groupedData, ([group, areas]) => ({
      group,
      areas: areas.map((d) => d["area"]),
    }));

    // preprocess places data as needed
    placesData.forEach((d, i) => {
      d["id"] = i + 1;
      // d["approved"] =
      //   d["Approval Status"] && d["Approval Status"].trim() === "Approved"
      //     ? true
      //     : false;
      d["lat"] = +d["Latitude"];
      d["lon"] = +d["Longitude"];
      d["gini"] = +d["Gini Coefficient"];
      d["name"] = d["Project Name"];
      d["nameCleaned"] = d["Project Name"].trim().toLowerCase();
      d["startYear"] =
        d["Start Year"] && d["Start Year"] !== "" ? d["Start Year"] : null;
      d["endYear"] = d["End Year"];
      d["previewDescription"] =
        d["Project Preview Description"] &&
        d["Project Preview Description"] !== ""
          ? d["Project Preview Description"]
          : "No preview description available.";
      d["description"] =
        d["Project Description"] && d["Project Description"] !== ""
          ? d["Project Description"]
          : "No description available.";
      d["highlight"] =
        d["Key Highlight"] && d["Key Highlight"] !== ""
          ? d["Key Highlight"]
          : "No key highlight available.";
      d["city"] = d["City"];
      d["state"] = d["State"];
      d["focusAreas"] =
        d["Focus Areas"] && d["Focus Areas"] !== ""
          ? d["Focus Areas"].split(",").map((f) => f.trim())
          : [];
      d["areaType"] =
        d["Area Type"] && d["Area Type"] !== "" ? d["Area Type"] : null;
      d["populationSize"] =
        d["Population Size"] && d["Population Size"] !== ""
          ? d["Population Size"]
          : null;
      d["populationDataYear"] =
        d["Population Data Year"] && d["Population Data Year"] !== ""
          ? d["Population Data Year"]
          : null;
      d["projectLink"] =
        d["Learn More Link"] && d["Learn More Link"] !== ""
          ? d["Learn More Link"]
          : null;
      d["partners"] =
        d["Partners"] && d["Partners"] !== ""
          ? d["Partners"].split(",").map((p) => p.trim())
          : [];

      d["status"] = d["Status"] && d["Status"] !== "" ? d["Status"] : null;
    });
    placesData.forEach((d) => {
      d["focusAreaGroups"] =
        d["focusAreas"].length > 0
          ? getAllFocusAreaGroupsForProject(d["focusAreas"], focusAreaData)
          : [];
    });
    // placesData = placesData.filter((p) => p["name"] !== "" && p["approved"]);

    // render focus areas dropdown within Webflow container
    renderFocusAreasDropdown(groupedDataArray, placesData);

    // render main content
    renderContent(focusAreaData, placesData);

    // show or hide "hide completed projects" toggle based on whether any completed projects exist
    handleCompletedProjectsToggle(placesData);
  });
}

// show or hide "hide completed projects" toggle based on whether any completed projects exist
function handleCompletedProjectsToggle(placesData) {
  const completedProjects = placesData.filter(
    (p) => p["status"] === "Completed"
  );
  const toggleContainer = document.getElementById(
    "toggle-hide-completed-projects"
  );
  if (toggleContainer) {
    if (completedProjects.length > 0) {
      toggleContainer.style.display = "block";
    } else {
      toggleContainer.style.display = "none";
    }
  }
}

function positionDropdown(focusAreas, placesData) {
  const triggerElement = document.getElementById(
    "focus-areas-dropdown-trigger"
  );
  const containerElement = document.getElementById(
    "focus-areas-dropdown-container"
  );
  const firstLabel = document.querySelector(
    ".filter-form__radio-group label:first-child"
  );

  const triggerRightX = triggerElement.getBoundingClientRect().right;
  const triggerLeftX = triggerElement.getBoundingClientRect().left;
  const triggerTopY = triggerElement.getBoundingClientRect().top;
  const triggerBottomY = triggerElement.getBoundingClientRect().bottom;

  let containerTop = triggerTopY;
  let containerLeft = triggerRightX + 10;
  let containerWidth = 311;
  let containerHeight = 388;

  if (isMobile()) {
    containerLeft = triggerLeftX;
    containerTop = triggerBottomY;
    containerWidth = triggerRightX - triggerLeftX;
    containerHeight = 265;
  }

  if (containerElement) {
    containerElement.style.top = `${containerTop}px`;
    containerElement.style.left = `${containerLeft}px`;
    containerElement.style.width = `${containerWidth}px`;
    containerElement.style.height = `${containerHeight}px`;

    if (containerElement.style.display !== "block") {
      // check whether the first label element in the div with the class "filter-form__radio-group" has a div that has the class "w--redirected-checked"
      let isViewDataAsMapSelected = false;

      if (firstLabel) {
        const checkedDiv = firstLabel.querySelector(".w--redirected-checked");
        if (checkedDiv) {
          // If it does, add a class to the container element
          isViewDataAsMapSelected = true;
        }
      }

      if (isViewDataAsMapSelected) {
        containerElement.style.display = "block";
        rotateFocusAreaTriggerCaret(true);
      } else {
        containerElement.style.display = "none";
        rotateFocusAreaTriggerCaret(false);
      }
    } else {
      containerElement.style.display = "none";
      rotateFocusAreaTriggerCaret(false);
    }

    const mapFiltersSidebar = document.querySelector(".map-filters__sidebar");
    if (mapFiltersSidebar) {
      mapFiltersSidebar.addEventListener("click", (e) => {
        // do not close if the trigger itself is clicked
        if (e.target.id === "focus-areas-dropdown-trigger") return;
        // also do not close if any element within the trigger element is clicked
        if (triggerElement.contains(e.target)) return;

        closeFocusAreaDropdown();
      });
    }

    renderComponent(
      html`<${FocusAreaDropdown}
        focusAreas=${focusAreas}
        placesData=${placesData}
      />`,
      containerElement
    );
  }
}

function renderFocusAreasDropdown(focusAreas, placesData) {
  // get trigger element and add event listener to toggle visibility of container
  const triggerElement = document.getElementById(
    "focus-areas-dropdown-trigger"
  );
  if (triggerElement) {
    triggerElement.addEventListener("click", () => {
      positionDropdown(focusAreas, placesData);
    });

    // for mobile, add event listener to close button in drawer to hide dropdown container as well
    const filterDrawerCloseButton = document.querySelector(
      ".map-filters_drawer-close"
    );
    if (filterDrawerCloseButton) {
      filterDrawerCloseButton.addEventListener("click", () => {
        const containerElement = document.getElementById(
          "focus-areas-dropdown-container"
        );
        if (containerElement) {
          containerElement.style.display = "none";
        }
      });
    }
  }

  const activeFocusAreaIndicator = document.getElementById(
    "focus_area_active_indicator"
  );
  if (activeFocusAreaIndicator) {
    renderComponent(
      html`<${FocusAreaActiveIndicator} numberOfActiveFocusAreas=${null} />`,
      activeFocusAreaIndicator
    );
  }

  function updatePointerEventsForFocusAreaDropdownTrigger(enable) {
    const triggerElement = document.getElementById(
      "focus-areas-dropdown-trigger"
    );
    if (triggerElement) {
      triggerElement.style.pointerEvents = enable ? "auto" : "none";
      triggerElement.style.cursor = enable ? "pointer" : "auto";
    }

    const toggleCheckbox = document.querySelector(
      "#toggle-hide-completed-projects .filter-form__toggle-checkbox"
    ); // for "hide completed" toggle
    if (toggleCheckbox) {
      toggleCheckbox.style.pointerEvents = enable ? "auto" : "none";
      toggleCheckbox.style.cursor = enable ? "pointer" : "auto";
    }
  }

  const firstLabel = document.querySelector(
    ".filter-form__radio-group label:first-child"
  );
  if (firstLabel) {
    firstLabel.addEventListener("click", () => {
      updatePointerEventsForFocusAreaDropdownTrigger(true);
    });
  }
  const secondLabel = document.querySelector(
    ".filter-form__radio-group label:nth-child(2)"
  );
  if (secondLabel) {
    secondLabel.addEventListener("click", () => {
      updatePointerEventsForFocusAreaDropdownTrigger(false);
    });
  }
}

function renderContent(focusAreas, placesData) {
  const containerElement = document.getElementById("map");
  if (containerElement) {
    // clear existing content before rendering
    containerElement.innerHTML = "";

    console.log("Rendering main content...", placesData);

    (async () => {
      renderComponent(
        html`<${Content} focusAreas=${focusAreas} placesData=${placesData} />`,
        containerElement
      );
    })();
  } else {
    console.error(`Could not find container element for content`);
  }
}

function Content({ focusAreas, placesData }) {
  const [usGeoData, setUsGeoData] = useState(null);
  const [partnersData, setPartnersData] = useState(null);

  const [statusShowInactiveFilter, setStatusShowInactiveFilter] =
    useState(true);

  const [selectedFocusAreas, setSelectedFocusAreas] = useState([]);

  // load data
  useEffect(() => {
    fetch(REPO_URL + "/data/states-albers-10m.json")
      .then((res) => res.json())
      .then(setUsGeoData);

    d3.csv(
      REPO_URL + "/data/partnerData.csv"
      // "./data/partnerData.csv"
    ).then((data) => {
      // preprocess data as needed
      data.forEach((d) => {
        d["partnerName"] = d["Funder Name"];
        d["partnerLink"] = d["Partner Link"];
      });
      setPartnersData(data);
    });
  }, []);

  // add event listener for checkbox with id "Status"
  useEffect(() => {
    const statusCheckbox = document.getElementById("Status");
    if (statusCheckbox) {
      const handleStatusChange = (e) =>
        setStatusShowInactiveFilter(e.target.checked);
      statusCheckbox.addEventListener("change", handleStatusChange);
      return () => {
        statusCheckbox.removeEventListener("change", handleStatusChange);
      };
    }
  }, []);

  // listen to change in focus area dropdown
  useEffect(() => {
    const handleFocusAreasChange = (e) =>
      setSelectedFocusAreas(e.detail.selectedFocusAreas);
    document.addEventListener(
      "dropdown-focus-areas-changed",
      handleFocusAreasChange
    );
    return () => {
      document.removeEventListener(
        "dropdown-focus-areas-changed",
        handleFocusAreasChange
      );
    };
  }, []);

  // listen to change in focus area dropdown (indicator clear)
  useEffect(() => {
    const handleFocusAreasChange = (e) =>
      setSelectedFocusAreas(e.detail.selectedFocusAreas);
    document.addEventListener(
      "dropdown-focus-areas-changed-external",
      handleFocusAreasChange
    );
    return () => {
      document.removeEventListener(
        "dropdown-focus-areas-changed-external",
        handleFocusAreasChange
      );
    };
  }, []);

  // on window resize, rerender component to reflect any changes
  useEffect(() => {
    const handleResize = () => {
      // trigger a state change to force rerender
      setUsGeoData((prev) => prev);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // filter places data based on statusInactiveFilter
  let filteredPlacesData = placesData
    ? placesData.filter((p) =>
        statusShowInactiveFilter ? true : p["status"] === "Active"
      )
    : null;

  // also filter by focus areas if any are selected
  if (filteredPlacesData && selectedFocusAreas.length > 0) {
    filteredPlacesData = filteredPlacesData.filter((p) => {
      return p["focusAreas"].some((area) => selectedFocusAreas.includes(area));
    });
  }

  return html`
    ${usGeoData
      ? html`<${Map}
          usGeoData=${usGeoData}
          places=${filteredPlacesData}
          partners=${partnersData}
          allFocusAreas=${focusAreas}
        />`
      : null}
  `;
}
