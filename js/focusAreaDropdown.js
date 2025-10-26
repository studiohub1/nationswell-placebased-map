import { html, useState } from "./preact-htm.js";
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
