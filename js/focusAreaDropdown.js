import { html, useState, useEffect } from "./preact-htm.js";
import { getFocusAreaGroupIcon } from "./focusAreas.js";
import { REPO_URL } from "./helper.js";

export function FocusAreaDropdown({ focusAreas, placesData }) {
  const [selectedAreas, setSelectedAreas] = useState([]);

  function updateSelectedAreas(newAreas) {
    setSelectedAreas(newAreas);
    document.dispatchEvent(
      new CustomEvent("dropdown-focus-areas-changed", {
        detail: { selectedFocusAreas: newAreas },
      })
    );
  }

  useEffect(() => {
    const handleFocusAreasChange = (e) => {
      setSelectedAreas(e.detail.selectedFocusAreas);
    };
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

  const groupElements = focusAreas.map((group) => {
    return html` <div
        class="font-libre w-full block border-b border-vis-surface-primary border-solid text-base italic leading-[135%] flex flex-row items-center p-2"
      >
        <div class="h-[18px] w-[18px] inline-block align-middle mr-[10px]">
          ${getFocusAreaGroupIcon(group.group, "#FBF9F4")}
        </div>
        <span>${group.group}</span>
      </div>
      <div>
        ${group.areas.map((area) => {
          // find out if any places are associated with this focus area
          const areaHasPlaces = placesData.some((place) => {
            return place.focusAreas.includes(area);
          });

          return html`<div
            class="rounded-md  flex flex-row items-start p-2 gap-2 ${areaHasPlaces
              ? "hover:bg-[#2148D1] cursor-pointer"
              : "opacity-40 cursor-not-allowed"}"
            onclick=${() => {
              if (!areaHasPlaces) return;
              const isChecked = selectedAreas.includes(area);
              const newSelectedAreas = isChecked
                ? selectedAreas.filter((a) => a !== area)
                : [...selectedAreas, area];
              updateSelectedAreas(newSelectedAreas);
            }}
          >
            <div class="w-5 h-5 shrink-0">
              ${selectedAreas.includes(area)
                ? html`<img
                    src="${REPO_URL}/assets/checkbox_checked.svg"
                    alt="Checked"
                    class="w-5 h-5"
                  />`
                : html`<img
                    src="${REPO_URL}/assets/checkbox_unchecked.svg"
                    alt="Unchecked"
                    class="w-5 h-5"
                  />`}
            </div>
            <span
              class="inline-block font-authentic text-sm pt-[1.5px] mb-0 grow ${areaHasPlaces
                ? "cursor-pointer"
                : "cursor-not-allowed"} text-balance"
              >${area}</span
            >
            <span class="text-vis-text-inverted/65 text-sm"
              >${placesData.filter((place) => place.focusAreas.includes(area))
                .length}</span
            >
          </div>`;
        })}
      </div>`;
  });

  return html`<div class="text-vis-text-inverted p-2 w-full">
    <p
      class="cursor-pointer text-vis-text-inverted/65 hover:text-vis-text-inverted/90 transition text-right text-sm"
      onclick=${() => updateSelectedAreas([])}
    >
      Clear all
    </p>
    ${groupElements}
  </div>`;
}

export function FocusAreaActiveIndicator({ numberOfActiveFocusAreas }) {
  const [numActive, setNumActive] = useState(numberOfActiveFocusAreas);

  useEffect(() => {
    const handleFocusAreasChange = (e) =>
      setNumActive(e.detail.selectedFocusAreas.length);

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

  function clearFocusAreas() {
    document.dispatchEvent(
      new CustomEvent("dropdown-focus-areas-changed-external", {
        detail: { selectedFocusAreas: [] },
      })
    );
    setNumActive(0);
  }

  if (numActive === null || numActive === 0) {
    return null;
  }

  return html`<div
    class="flex items-center gap-[2px] rounded-[112px] bg-[#1F38A5] inline-block py-1 px-2"
  >
    <div
      class="rounded-[999px] text-vis-text-primary text-sm font-sora leading-[100%] py-1 px-[6px] bg-[#E9FBAE]"
    >
      ${numActive}
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="cursor-pointer h-4 w-4 p-1 opacity-65 hover:opacity-100 transition"
      onclick=${() => clearFocusAreas()}
      width="9"
      height="9"
      fill="none"
      viewBox="0 0 9 9"
    >
      <path
        stroke="#FBF9F4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="m.75 7.74 3.495-3.495m0 0L7.74.75M4.245 4.245.75.75m3.495 3.495L7.74 7.74"
      />
    </svg>
  </div>`;
}
