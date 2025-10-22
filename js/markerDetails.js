import { html } from "./preact-htm.js";
import { isMobile, REPO_URL } from "./helper.js";
import { getFocusAreaGroupIcon } from "./focusAreas.js";
import { AnimatedButton } from "./animatedButton.js";

export function MarkerDetails({
  markerDetails,
  position,
  viewProjectDetails,
  handleCloseDetails,
}) {
  // console.log("Rendering MarkerDetails with:", markerDetails);
  let markerDetailsPositionY = position ? position.y : 0;
  let markerDetailsPositionX = position ? position.x : 0;

  if (isMobile) {
    markerDetailsPositionX = null;
    markerDetailsPositionY = window.innerHeight / 2 - 200;
  }

  return html`<div
    className="marker-details absolute bg-white p-6 rounded-xl shadow-lg flex flex-col items-start gap-4 max-w-md z-[101] w-[90%] md:w-unset left-[5%] md:left-unset"
    style="top: ${markerDetailsPositionY}px; left: ${markerDetailsPositionX}px; ${isMobile &&
    markerDetails.markerGroup.length > 2
      ? "height: 390px;"
      : ""}"
  >
    <svg
      class="close-icon absolute top-2 right-2 cursor-pointer h-8 w-8"
      onclick=${handleCloseDetails}
      width="34"
      height="35"
      viewBox="0 0 34 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.7574 13.56L17 17.8027M17 17.8027L21.2426 22.0453M17 17.8027L21.2426 13.56M17 17.8027L12.7574 22.0453"
        stroke="#0F100F"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <div class="flex items-center gap-2">
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.349 8.80827C17.349 12.4902 10.6823 18.8083 10.6823 18.8083C10.6823 18.8083 4.01562 12.4902 4.01562 8.80827C4.01562 5.12637 7.00039 2.1416 10.6823 2.1416C14.3642 2.1416 17.349 5.12637 17.349 8.80827Z"
          stroke="black"
          stroke-width="1.25"
        />
        <path
          d="M10.6849 9.64128C11.1451 9.64128 11.5182 9.26819 11.5182 8.80794C11.5182 8.34771 11.1451 7.97461 10.6849 7.97461C10.2246 7.97461 9.85156 8.34771 9.85156 8.80794C9.85156 9.26819 10.2246 9.64128 10.6849 9.64128Z"
          fill="black"
          stroke="black"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <p class="uppercase font-sora text-sm text-vis-text-primary">
        ${markerDetails.markerGroup[0].city},${" "}
        ${markerDetails.markerGroup[0].state}
      </p>
    </div>
    <div
      data-lenis-prevent
      class="max-h-[550px] overflow-y-auto flex flex-col gap-6 w-full"
    >
      ${markerDetails.markerGroup &&
      markerDetails.markerGroup.length > 0 &&
      markerDetails.markerGroup.map((marker, i) => {
        return html` <${MarkerDetailsItem}
          markerDetails=${marker}
          viewProjectDetails=${viewProjectDetails}
          showPreviewDescription=${markerDetails.markerGroup.length === 1 ||
          (markerDetails.markerGroup.length > 1 && !isMobile)}
        />`;
      })}
    </div>
  </div>`;
}

function MarkerDetailsItem({
  markerDetails,
  viewProjectDetails,
  showPreviewDescription = true,
}) {
  return html`<div class="bg-[#F3F0E9] py-4 px-6 flex flex-col items-start">
    <div class="flex flex-row gap-4 items-center">
      ${markerDetails.startYear && markerDetails.startYear !== ""
        ? html` <p
            class="font-libre text-lg font-italic text-vis-text-secondary italic"
          >
            ${markerDetails.startYear}${" "}–${" "}
            ${markerDetails.endYear ? markerDetails.endYear : "present"}
          </p>`
        : null}
      <div class="flex flex-row gap-2">
        ${markerDetails.focusAreaGroups.length > 0
          ? markerDetails.focusAreaGroups.map(
              (focusAreaGroup) => html` <div class="w-[10px] h-[10px]">
                ${getFocusAreaGroupIcon(
                  focusAreaGroup,
                  "rgba(15, 16, 15, 0.7)"
                )}
              </div>`
            )
          : null}
      </div>
    </div>

    <p class="font-sora text-sm text-vis-text-primary font-bold uppercase mt-2">
      ${markerDetails.name}
    </p>
    ${showPreviewDescription &&
    html` <p
      class="font-authentic font-md line-height-[155%] text-vis-text-primary mt-1"
    >
      ${markerDetails.previewDescription || ""}
    </p>`}
    <${AnimatedButton}
      onClickAction=${() => viewProjectDetails(markerDetails.id)}
      text="View project details"
      type="default"
    />
  </div>`;
}
