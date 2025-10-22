import { html, useEffect, useState } from "./preact-htm.js";
import {
  getFocusAreaGroupIcon,
  getFocusAreaGroupFromArea,
} from "./focusAreas.js";
import { isMobile, REPO_URL } from "./helper.js";
import { AnimatedButton } from "./animatedButton.js";

export function Overlay({
  place,
  partners,
  allFocusAreas,
  handleCloseOverlay,
}) {
  if (!place) {
    return null;
  }

  console.log("Rendering Overlay for place:", place);

  // get random value between 1 and 6 for state shape image
  const randomAreaImage = Math.floor(Math.random() * 6) + 1;
  let areaImageName = "";
  switch (place.areaType) {
    case "Urban":
      areaImageName = `Area Type=Urban, Option=${randomAreaImage}.png`;
      break;
    case "Suburban":
      areaImageName = `Area Type=Suburban, Option=${randomAreaImage}.png`;
      break;
    case "Rural":
      areaImageName = `Area Type=Rural, Option=${randomAreaImage}.png`;
      break;
    default:
      areaImageName = `Area Type=Suburban, Option=${randomAreaImage}.png`;
      break;
  }

  const titleClasses = "font-sora text-sm uppercase mb-4 font-bold";
  return html`<div class="map-details-overlay fixed inset-0 z-[10001]">
    <div
      class="map-details-content absolute bg-white md:rounded-lg md:shadow-lg top-0 left-0 md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 z-[11] w-[100%] md:w-[90%] max-w-[1200px] max-h-[100%] md:max-h-[90%] xl:max-h-[80%] xl:w-[80%] overflow-y-auto overflow-x-hidden"
      data-lenis-prevent
    >
      ${!isMobile &&
      html`<svg
        class="absolute top-2 right-2 cursor-pointer h-8 w-8"
        onclick=${handleCloseOverlay}
        width="34"
        height="35"
        viewBox="0 0 34 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.7574 13.56L17 17.8027M17 17.8027L21.2426 22.0453M17 17.8027L21.2426 13.56M17 17.8027L12.7574 22.0453"
          stroke="lightgray"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>`}

      <div
        class="flex flex-col md:flex-row items-start md:items-end justify-between bg-blue-600 px-6 pt-[33px] pb-6 bg-cover bg-center"
        style="background-image: url('${REPO_URL}/assets/gradient_texture_blue_overlay_header${isMobile
          ? "_mobile"
          : ""}.png');"
      >
        <div class="flex flex-col items-start">
          ${isMobile &&
          html`
            <svg
              class="cursor-pointer h-4 w-4 mb-4"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 16 16"
              onclick=${handleCloseOverlay}
            >
              <g>
                <path
                  stroke="#FBF9F4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M10 4 6 8l4 4"
                />
              </g>
            </svg>
          `}
          <p
            class="font-libre italic text-lg font-italic text-vis-text-inverted"
          >
            ${place.startYear && place.startYear !== ""
              ? html`<span>
                  ${place.startYear}${" "}–${" "}
                  ${place.endYear ? place.endYear : "present"}
                </span>`
              : null}
          </p>
          <p class="text-vis-text-inverted text-[32px]">${place.name}</p>
        </div>
        ${place.projectLink &&
        place.projectLink !== "" &&
        html` <${AnimatedButton}
          onClickAction=${() => window.open(place.projectLink, "_blank")}
          text="${isMobile ? "See project website" : "Learn more"}"
          type="black"
        />`}
      </div>
      <div>
        <div class="grid-cols-5 hidden md:grid">
          <div class="col-span-2"><${DescriptionSection} place=${place} /></div>
          <div class="col-span-1 ">
            <${LocationSection} place=${place} titleClasses=${titleClasses} />
          </div>
          <div
            class="${place.gini && place.gini !== 0
              ? "col-span-1"
              : "col-span-2"} bg-cover bg-center bg-no-repeat"
            style="background-image: url('${REPO_URL}/assets/areaImages/${areaImageName}'); margin-top: -1px; margin-bottom: -1px;"
          ></div>
          ${!isMobile && place.gini && place.gini !== 0
            ? html` <${GiniCoefficientSection}
                gini=${place.gini}
                titleClasses=${titleClasses}
              />`
            : null}
        </div>
        <div class="grid grid-cols-5 hidden md:grid">
          <div class="col-span-2">
            <${HightlightSection} place=${place} titleClasses=${titleClasses} />
          </div>
          <div class="col-span-3">
            <${FocusAreaSection}
              place=${place}
              allFocusAreas=${allFocusAreas}
              titleClasses=${titleClasses}
            />

            <${PartnerSection}
              place=${place}
              partners=${partners}
              titleClasses=${titleClasses}
            />
          </div>
        </div>
      </div>
      <div class="md:hidden">
        <${DescriptionSection} place=${place} />
        <${HightlightSection} place=${place} titleClasses=${titleClasses} />
        <div
          class="bg-cover bg-center bg-no-repeat w-[102%] h-[218px] ml-[-2px] overflow-hidden"
          style="background-image: url('${REPO_URL}/assets/areaImages/${areaImageName}');"
        ></div>
        ${isMobile && place.gini && place.gini !== 0
          ? html` <div class="grid grid-cols-2">
              <div class="col-span-1">
                <${LocationSection}
                  place=${place}
                  titleClasses=${titleClasses}
                />
              </div>
              <div class="col-span-1">
                <${GiniCoefficientSection}
                  gini=${place.gini}
                  titleClasses=${titleClasses}
                />
              </div>
            </div>`
          : html`<div class="p-2 bg-vis-surface-primary-tonal">
              <${LocationSection} place=${place} titleClasses=${titleClasses} />
            </div>`}
        <${FocusAreaSection}
          place=${place}
          allFocusAreas=${allFocusAreas}
          titleClasses=${titleClasses}
        />
        <${PartnerSection}
          place=${place}
          partners=${partners}
          titleClasses=${titleClasses}
        />
      </div>
    </div>
    <div
      class="map-details-background absolute inset-0 bg-black opacity-50 backdrop-blur-md"
      onclick=${handleCloseOverlay}
    ></div>
  </div>`;
}

function DescriptionSection({ place }) {
  return html`<div
    class="p-6 text-vis-text-primary text-[16px] leading-[155%] font-authentic"
  >
    ${place.description}
  </div>`;
}

function HightlightSection({ place, titleClasses }) {
  return html`
    <div
      class="p-6 bg-vis-surface-primary bg-cover bg-center md:h-full"
      style="background-image: url('${REPO_URL}/assets/gradient_texture_gray_bg.png');"
    >
      <p class="${titleClasses} text-vis-text-primary">highlight</p>
      <span
        class="text-vis-text-primary text-[16px] leading-[155%] font-authentic "
        >${place.highlight}</span
      >
    </div>
  `;
}

function PartnerSection({ place, partners, titleClasses }) {
  return html`<div class="p-6 bg-white">
    <p class="${titleClasses} text-vis-text-primary">Partners</p>
    <div class="flex flex-row gap-8 items-center h-12 overflow-y-hidden">
      ${place.partners && place.partners.length > 0
        ? place.partners.map((partner) => {
            const partnerData = partners.find((p) => p.partnerName === partner);
            if (!partnerData || !partnerData.partnerLink)
              return html`<img
                src="${REPO_URL}/assets/partnerLogos/Partner Name=${partner}.png"
                alt="${partner} logo"
                class="h-12 object-contain"
              />`;
            return html`<a href=${partnerData.partnerLink} target="_blank"
              ><img
                src="${REPO_URL}/assets/partnerLogos/Partner Name=${partner}.png"
                alt="${partner} logo"
                class="h-12 min-w-12 object-contain"
            /></a>`;
          })
        : null}
    </div>
  </div>`;
}

function FocusAreaSection({ place, allFocusAreas, titleClasses }) {
  return html`<div class="p-6 bg-vis-main-blue">
    <p class="${titleClasses} text-vis-text-inverted">
      Focus area${place.focusAreas.length > 1 ? "s" : ""}
    </p>
    <div class="flex flex-wrap gap-2">
      ${place.focusAreas && place.focusAreas.length > 0
        ? place.focusAreas.map((focusArea) => {
            return html`<div
              class="flex flex-row space-x-2 items-center text-vis-text-primary px-3 py-1 rounded-full text-sm font-sora uppercase bg-vis-surface-primary-tonal"
            >
              <div class="w-[10px] h-[10px] shrink-0">
                ${getFocusAreaGroupIcon(
                  getFocusAreaGroupFromArea(focusArea, allFocusAreas),
                  "#0F100F"
                )}
              </div>
              <span>${focusArea}</span>
            </div>`;
          })
        : null}
    </div>
  </div>`;
}

function LocationSection({ place, titleClasses }) {
  return html`<div class="p-4 md:p-6 bg-vis-surface-primary-tonal h-full">
    <p class="${titleClasses} text-vis-text-primary">location</p>
    <div
      class="flex flex-col space-y-2 font-authentic text-[16px] leading-[155%] text-vis-text-primary"
    >
      <div class="flex flex-row space-x-1">
        <svg
          width="21"
          height="21"
          fill="none"
          viewBox="0 0 21 21"
          class="shrink-0"
        >
          <g>
            <path
              stroke="#000"
              stroke-width="1.25"
              d="M16.898 8.833c0 3.682-6.667 10-6.667 10s-6.667-6.318-6.667-10a6.667 6.667 0 1 1 13.334 0Z"
            />
            <path
              fill="#000"
              stroke="#000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.25"
              d="M10.23 9.667a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667Z"
            />
          </g></svg
        ><span>${place.city}, ${place.state}</span>
      </div>
      <div class="flex flex-row space-x-1">
        <svg
          width="21"
          height="21"
          fill="none"
          viewBox="0 0 21 21"
          class="shrink-0"
        >
          <g>
            <path
              stroke="#000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.25"
              d="M6.064 8.008 6.073 8m3.323.008L9.405 8m-3.341 3.342.009-.01m3.323.01.009-.01m-3.341 3.343.009-.009m3.323.009.009-.009M12.73 18h-9.5a.5.5 0 0 1-.5-.5V5.167a.5.5 0 0 1 .5-.5h4.5V3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5V8m0 10h4.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-4.5m0 10v-3.333m0-6.667v3.333m0 3.334v-3.334m0 3.334h1.667m-1.667-3.334h1.667"
            />
          </g>
        </svg>
        <span>${place.areaType}</span>
      </div>
      ${place.populationSize &&
      place.populationSize &&
      html` <div class="flex flex-row space-x-1">
        <svg
          width="21"
          height="21"
          fill="none"
          viewBox="0 0 21 21"
          class="shrink-0"
        >
          <defs>
            <clipPath id="a" class="a">
              <path fill="#fff" d="M.23.5h20v20h-20z" />
            </clipPath>
          </defs>
          <g clip-path="url(#a)">
            <path
              stroke="#000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.25"
              d="M6.064 15.5v-.833a4.167 4.167 0 1 1 8.334 0v.833m-13.334 0v-.834a2.5 2.5 0 0 1 2.5-2.5M19.396 15.5v-.834a2.5 2.5 0 0 0-2.5-2.5"
            />
            <path
              stroke="#000"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.25"
              d="M10.23 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm-6.667 1.667a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333Zm13.334 0a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333Z"
            />
          </g>
        </svg>
        <div>
          <span>${place.populationSize}</span>
          <span
            class="block font-libre italic text-[14px] leading-[135%] text-vis-text-secondary"
            >as of ${place.populationDataYear}</span
          >
        </div>
      </div>`}
    </div>
  </div>`;
}

function GiniCoefficientSection({ gini, titleClasses }) {
  if (!gini) {
    return null;
  }

  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [animatedGini, setAnimatedGini] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // get width and height of the image
  useEffect(() => {
    const giniEllipse = document.getElementById("gini-ellipse");
    if (giniEllipse) {
      const handleLoad = () => {
        setWidth(giniEllipse.naturalWidth || giniEllipse.width);
        setHeight(giniEllipse.naturalHeight || giniEllipse.height);
      };
      if (giniEllipse.complete) {
        handleLoad();
      } else {
        giniEllipse.addEventListener("load", handleLoad);
        return () => {
          giniEllipse.removeEventListener("load", handleLoad);
        };
      }
    }
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const giniContainer = document.getElementById("gini-container");
    if (!giniContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the component is visible
      }
    );

    observer.observe(giniContainer);

    return () => {
      observer.unobserve(giniContainer);
    };
  }, [isVisible]);

  // Animate gini value counting up
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = 0;
    const endValue = gini;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;

      setAnimatedGini(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isVisible, gini]);

  // Map gini value (0-1) to angle range:
  const startAngle = Math.PI; // 180° (left)
  const endAngle = 2 * Math.PI; // 360° (right)
  const angle = startAngle + animatedGini * (endAngle - startAngle);

  const lineLength = height * 0.625; // Length of the line as 62.5% of the image height
  const centerX = width / 2;
  const centerY = height; // Bottom center of SVG

  // Calculate start and end points of the line
  const startX = centerX + (height + 0.01) * Math.cos(angle);
  const startY = centerY + (height + 0.01) * Math.sin(angle);
  const endX = centerX + lineLength * Math.cos(angle);
  const endY = centerY + lineLength * Math.sin(angle);

  return html` <div class="h-full p-4 md:p-6 bg-vis-surface-primary-tonal">
    <div class="flex flex-row gap-1 items-center relative">
      <span class="${titleClasses} text-vis-text-primary">gini coefficient</span
      ><img
        src="${REPO_URL}/assets/question_icon.svg"
        class="cursor-pointer mb-4"
        onmouseenter="${() => setShowTooltip(true)}"
        onmouseleave="${() => setShowTooltip(false)}"
      />
      <div
        class="bg-[#0F100F] px-4 py-2 absolute top-[30px] right-0 font-authentic text-base leading-[155%] text-vis-text-inverted text-transform-none z-10 ${showTooltip
          ? ""
          : "hidden"}"
      >
        The Gini coefficient measures inequality on a scale ranging from${" "}
        <span class="font-bold">0%</span>
        (complete equality: everyone has the same income) to${" "}
        <span class="font-bold">100%</span> (complete inequality: one person has
        all the income).
      </div>
    </div>
    <div class="relative" id="gini-container">
      <img
        src="${REPO_URL}/assets/gini_coefficient_ellipse.png"
        alt="Gini Coefficient Chart"
        id="gini-ellipse"
      />
      ${width && height
        ? html`<svg
            width="${width}"
            height="${height}"
            style="position: absolute; top: 0; left: 0; overflow: visible;"
          >
            <rect width="${width}" height="${height}" fill="red" opacity="0" />
            <line
              x1="${startX}"
              y1="${startY}"
              x2="${endX}"
              y2="${endY}"
              stroke="#0F100F"
              stroke-width="3"
              stroke-linecap="round"
              style="transition: all 0.1s ease-out;"
            />
            <g opacity="0">
              <circle cx="${centerX}" cy="${centerY}" r="2" fill="red" />
              <circle cx="${startX}" cy="${startY}" r="2" fill="green" />
              <circle cx="${endX}" cy="${endY}" r="2" fill="blue" />
            </g>
            <text
              x="${centerX}"
              y="${centerY}"
              dy="-12"
              fill="#0f100f"
              font-size="14"
              text-anchor="middle"
              class="font-sora font-bold"
              style="transition: all 0.1s ease-out;"
            >
              ${(animatedGini * 100).toFixed(0)}%
            </text>
          </svg>`
        : null}
      <div class="flex justify-between w-full mt-2" style="width: ${width}px">
        <p
          class="italic font-libre text-[14px] leading-[135%] text-vis-text-secondary "
        >
          complete<br />equality
        </p>
        <p
          class="italic font-libre text-[14px] leading-[135%] text-vis-text-secondary text-right"
        >
          complete<br />inequality
        </p>
      </div>
    </div>
  </div>`;
}
