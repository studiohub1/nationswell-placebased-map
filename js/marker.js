import { html, useState, useEffect } from "./preact-htm.js";
import { isMobile } from "./helper.js";
import {
  getFocusAreaGroupIcon,
  getAllFocusAreaGroupsForMultipleProjects,
} from "./focusAreas.js";

export function Marker({
  markerGroup,
  numberOfMarkers,
  allFocusAreas,
  handleMarkerClick,
  x,
  y,
  zoom = 1,
  height,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [cityNameLength, setCityNameLength] = useState(0);

  const markerGroupFocusAreas = getAllFocusAreaGroupsForMultipleProjects(
    markerGroup,
    allFocusAreas
  );

  const cityName = markerGroup[0].city;

  useEffect(() => {
    // get bounding box to calculate length of city name
    const textEl = document.querySelector(
      `#marker-city-name-${cityName.replaceAll(" ", "-")}`
    );
    if (textEl) {
      setCityNameLength(textEl.getBBox().width);
    }
  }, [cityName]);

  // Calculate inverse scale to maintain constant size
  const inverseScale = 1 / zoom;

  const focusAreaIconPositions = [];
  switch (markerGroupFocusAreas.length) {
    case 1:
      focusAreaIconPositions.push({ x: 0, y: -20 });
      break;
    case 2:
      focusAreaIconPositions.push({ x: -8, y: -18 });
      focusAreaIconPositions.push({ x: 8, y: -18 });
      break;
    case 3:
      focusAreaIconPositions.push({ x: -16, y: -14 });
      focusAreaIconPositions.push({ x: 0, y: -20 });
      focusAreaIconPositions.push({ x: 16, y: -14 });
      break;
    case 4:
      focusAreaIconPositions.push({ x: -20, y: -7 });
      focusAreaIconPositions.push({ x: -8, y: -18 });
      focusAreaIconPositions.push({ x: 8, y: -18 });
      focusAreaIconPositions.push({ x: 20, y: -7 });
      break;
    case 5:
      focusAreaIconPositions.push({ x: -20, y: 0 });
      focusAreaIconPositions.push({ x: -14, y: -14 });
      focusAreaIconPositions.push({ x: 0, y: -20 });
      focusAreaIconPositions.push({ x: 14, y: -14 });
      focusAreaIconPositions.push({ x: 20, y: 0 });
      break;
    default:
      break;
  }

  return html`
    <g
      class="marker pointer-events-auto cursor-pointer"
      transform="translate(${x}, ${y}) scale(${inverseScale}) translate(${-x}, ${-y})"
      onclick=${(event) => handleMarkerClick(event, markerGroup)}
      onMouseEnter=${() => setIsHovered(true)}
      onMouseLeave=${() => setIsHovered(false)}
    >
      <g
        class="marker-default ${isHovered
          ? "opacity-0"
          : "opacity-100"} transition-opacity duration-300"
      >
        <circle
          cx=${x}
          cy=${y}
          r="${24 / 2}"
          class="fill-white"
          style="filter: drop-shadow(0 0 6px rgba(11, 41, 148, 0.79))"
        />
        ${numberOfMarkers > 1 &&
        html` <text
          x=${x}
          y=${y}
          dy="1"
          class="text-black"
          font-size="14"
          text-anchor="middle"
          dominant-baseline="middle"
          class="font-sora font-bold"
        >
          ${numberOfMarkers}
        </text>`}
      </g>

      <g
        class="marker-hovered ${isHovered
          ? "opacity-100"
          : "opacity-0"} transition-opacity duration-300"
      >
        <circle
          cx=${x}
          cy=${y}
          r="${66 / 2}"
          fill="#061A6199"
          stroke="#061A61"
          stroke-width="2"
        />
        <circle cx=${x} cy=${y} r="${14 / 2}" class="fill-white" />
        ${!isMobile &&
        html` <g class="tooltip-layer" transform="translate(${33 + 2}, 1)">
          <rect
            x="${x}"
            y="${y - 15}"
            width="${cityNameLength + 20}"
            height="26"
            fill="black"
            rx="4"
            ry="4"
          />

          <path
            d="M1.06 7.06a1.5 1.5 0 0 1 0-2.12L6 0v12L1.06 7.06Z"
            fill="black"
            stroke="black"
            transform="translate(${x - 6}, ${y - 13 + 6})"
          />
          <text
            x="${x + 10}"
            y="${y - 2}"
            dy="1"
            fill="white"
            font-size="14px"
            font-family="system-ui, sans-serif"
            dominant-baseline="middle"
            id="marker-city-name-${cityName.replaceAll(" ", "-")}"
          >
            ${cityName}
          </text>
        </g>`}
        <g transform="translate(${x - 7}, ${-height / 2 + y})">
          ${markerGroupFocusAreas.length > 0 &&
          markerGroupFocusAreas.map((group, index) => {
            return html`<g
              transform="translate(${focusAreaIconPositions[index].x +
              1.5}, ${focusAreaIconPositions[index].y})"
              >${getFocusAreaGroupIcon(group, "#DAF975", 10)}
            </g>`;
          })}
        </g>
      </g>
    </g>
  `;
}
