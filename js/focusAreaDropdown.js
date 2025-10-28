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
          ${getFocusAreaGroupIcon(group.group, "#E9FBAE")}
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

  return html`<div
      class="dropdown-inner text-vis-text-inverted pr-2 w-full h-full overflow-y-scroll relative"
      data-lenis-prevent
    >
      <div class="flex justify-between items-center w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="cursor-pointer h-6 w-6 p-1 opacity-65 md:hover:opacity-100 transition-opacity"
          fill="none"
          viewBox="0 0 16 16"
          onclick=${() => {
            closeFocusAreaDropdown();
          }}
        >
          <g clip-path="url(#a_close)">
            <path
              stroke="#FBF9F4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m4.508 11.496 3.495-3.495m0 0 3.495-3.495M8.003 8 4.508 4.506M8.003 8l3.495 3.495"
            />
          </g>
          <defs>
            <clipPath id="a_close">
              <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
          </defs>
        </svg>
        <p
          class="cursor-pointer text-vis-text-inverted/65 hover:text-vis-text-inverted/90 transition text-right text-sm"
          onclick=${() => {
            updateSelectedAreas([]);
          }}
        >
          Clear all
        </p>
      </div>
      ${groupElements}
    </div>
    <svg
      fill="none"
      viewBox="0 0 309 20"
      class="absolute bottom-0 left-0 right-0"
    >
      <defs>
        <filter
          id="a"
          width="320.531"
          height="54.609"
          x="-12"
          y="0"
          class="a"
          color-interpolation-filters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="-8" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            values="0 0 0 0 0.0666667 0 0 0 0 0.192157 0 0 0 0 0.658824 0 0 0 1 0"
          />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_58_1028"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_58_1028"
            result="shape"
          />
        </filter>
      </defs>
      <g class="Rectangle 2530" filter="url(#a)">
        <path fill="#D9D9D9" d="M0 20h296.531v30.609H0z" />
      </g>
    </svg> `;
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
    closeFocusAreaDropdown();
  }

  return html` <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    width="55"
    height="26"
    viewBox="0 0 55 26"
    class="cursor-pointer ${numActive === 0 || numActive === null
      ? "opacity-0"
      : ""}"
    onclick=${() => clearFocusAreas()}
  >
    <defs>
      <clipPath id="tag__a" transform="translate(12 12)">
        <path
          d="M0 13C0 5.82 5.82 0 13 0h29c7.18 0 13 5.82 13 13s-5.82 13-13 13H13C5.82 26 0 20.18 0 13Z"
        />
      </clipPath>
      <clipPath id="tag__b">
        <rect width="16" height="16" fill="#fff" transform="translate(35 5)" />
      </clipPath>
    </defs>
    <foreignObject width="79" height="50" x="-12" y="-12">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        clip-path="url(#tag__a)"
        style="backdrop-filter:blur(6px);height:100%;width:100%"
      />
    </foreignObject>
    <g data-figma-bg-blur-radius="12">
      <path
        fill="#1F38A5"
        d="M0 13C0 5.82 5.82 0 13 0h29c7.18 0 13 5.82 13 13s-5.82 13-13 13H13C5.82 26 0 20.18 0 13Z"
      />
      <rect width="27" height="18" x="4" y="4" fill="#E9FBAE" rx="9" />
      <text
        x="17"
        y="18"
        fill="#0F100F"
        font-family="Sora, sans-serif"
        font-size="14"
        text-anchor="middle"
      >
        ${numActive}
      </text>
      <g clip-path="url(#tag__b)" opacity=".65">
        <path
          class="hover:stroke-white transition-stroke"
          stroke="#FBF9F4"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="m39.508 16.496 3.495-3.495m0 0 3.495-3.495M43.003 13l-3.495-3.495M43.003 13l3.495 3.495"
        />
      </g>
    </g>
  </svg>`;
}

export function closeFocusAreaDropdown() {
  // scroll back to top of dropdown before closing dropdown
  const dropdownInnerElement = document.querySelector(
    "#focus-areas-dropdown-container .dropdown-inner"
  );
  if (dropdownInnerElement) {
    dropdownInnerElement.scrollTo({ top: 0 });
  }

  const containerElement = document.getElementById(
    "focus-areas-dropdown-container"
  );
  if (containerElement) {
    containerElement.style.display = "none";
  }

  rotateFocusAreaTriggerCaret(false);
}

export function rotateFocusAreaTriggerCaret(isOpen) {
  const triggerElementCaret = document.querySelector(
    "#focus-areas-dropdown-trigger svg"
  );
  if (triggerElementCaret) {
    triggerElementCaret.style.transition = "transform 0.3s ease";
    triggerElementCaret.style.transform = isOpen
      ? "rotate(90deg)"
      : "rotate(0deg)";
  }
}
