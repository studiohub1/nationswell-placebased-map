import { html, useEffect, useState } from "./preact-htm.js";
import {
  getFocusAreaGroupIcon,
  getFocusAreaGroupFromArea,
} from "./focusAreas.js";
import { isMobile, isTabletPortrait, REPO_URL } from "./helper.js";
import { AnimatedButton } from "./animatedButton.js";

export function Overlay({
  place,
  partners,
  allFocusAreas,
  handleCloseOverlay,
  filteredPlaces,
  goToPlace,
}) {
  if (!place) {
    return null;
  }

  // console.log("Rendering Overlay for place:", place);

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
      class="map-details-content absolute bg-white md:rounded-lg md:shadow-lg top-0 left-0 md:top-[10%] md:left-1/2 md:transform md:-translate-x-1/2 z-[11] w-[100%] md:w-[90%] max-w-[1200px] max-h-[100%] md:max-h-[90%] xl:max-h-[80%] xl:w-[80%] overflow-y-auto overflow-x-hidden"
      data-lenis-prevent
    >
      <div class="fixed top-0 z-[10] w-full lg:hidden">
        <${OverlayHeader}
          place=${place}
          handleCloseOverlay=${handleCloseOverlay}
          filteredPlaces=${filteredPlaces}
          goToPlace=${goToPlace}
        />
      </div>
      <${OverlayHeader}
        place=${place}
        handleCloseOverlay=${handleCloseOverlay}
        filteredPlaces=${filteredPlaces}
        goToPlace=${goToPlace}
      />

      <!-- Desktop Layout -->
      <div class="overlay-content-desktop hidden min-[1200px]:block">
        <div class="grid-cols-5 grid">
          <div class="col-span-2"><${DescriptionSection} place=${place} /></div>
          <div class="col-span-2">
            <${LocationSection} place=${place} titleClasses=${titleClasses} />
          </div>
          <div
            class="col-span-1 bg-cover bg-center bg-no-repeat"
            style="background-image: url('${REPO_URL}/assets/areaImages/${areaImageName}'); margin-top: -1px; margin-bottom: -1px;"
          ></div>
        </div>
        <div class="grid grid-cols-5 grid">
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

      <!-- Tablet Layout -->
      <div class="overlay-content-tablet hidden md:block min-[1200px]:hidden">
        <div class="grid-cols-2 grid">
          <div class="col-span-1">
            <${DescriptionSection} place=${place} />
          </div>
          <div class="col-span-1">
            <${HightlightSection} place=${place} titleClasses=${titleClasses} />
          </div>
        </div>
        <div class="grid-cols-2 grid">
          <div class="col-span-1">
            <div
              class="bg-cover bg-center bg-no-repeat w-full h-full"
              style="background-image: url('${REPO_URL}/assets/areaImages/${areaImageName}'); margin-left:-1px; margin-right: -1px;"
            ></div>
          </div>

          <div class="col-span-1 flex flex-col">
            <${LocationSection} place=${place} titleClasses=${titleClasses} />
          </div>
        </div>
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
        ${window.innerWidth <= 992
          ? html`
              <${PrevNextProjectSection}
                currentPlaceId=${place.id}
                filteredPlaces=${filteredPlaces}
                goToPlace=${goToPlace}
              />
            `
          : null}
      </div>

      <!-- Mobile Layout -->
      <div class="overlay-content-mobile md:hidden">
        <${DescriptionSection} place=${place} />
        <${HightlightSection} place=${place} titleClasses=${titleClasses} />
        <div
          class="bg-cover bg-center bg-no-repeat w-[102%] h-[218px] ml-[-2px] overflow-hidden"
          style="background-image: url('${REPO_URL}/assets/areaImages/${areaImageName}');"
        ></div>
        ${isMobile() && place.gini && place.gini !== 0
          ? html` <div class="grid grid-cols-2">
              <div class="col-span-2">
                <${LocationSection}
                  place=${place}
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
        ${isMobile()
          ? html`<${PrevNextProjectSection}
              currentPlaceId=${place.id}
              filteredPlaces=${filteredPlaces}
              goToPlace=${goToPlace}
            />`
          : null}
      </div>
    </div>
    <div
      class="map-details-background absolute inset-0 bg-black opacity-50 backdrop-blur-md"
      onclick=${handleCloseOverlay}
    ></div>
  </div>`;
}

function OverlayHeader({
  place,
  handleCloseOverlay,
  filteredPlaces,
  goToPlace,
}) {
  // listen to scroll event to add shadow on mobile
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const overlayContent = document.querySelector(".map-details-content");
    if (!overlayContent) return;

    function handleScroll() {
      setScrollY(overlayContent.scrollTop);
    }
    overlayContent.addEventListener("scroll", handleScroll);
    return () => {
      overlayContent.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return html`<div
    class="flex flex-col md:flex-col items-start md:items-end justify-between bg-blue-600 px-6 pt-[33px] md:pt-4 pb-6 bg-cover bg-center transition-shadow duration-300"
    style="${(isMobile() || isTabletPortrait()) && scrollY > 0
      ? "box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.75);"
      : ""} background-image: url('${REPO_URL}/assets/gradient_texture_blue_overlay_header${isMobile()
      ? "_mobile"
      : ""}.png');"
  >
    ${!isMobile() &&
    html`<div class="flex flex-row items-end justify-between gap-4 mb-3 w-full">
      <p
        class="font-libre italic text-lg font-italic text-vis-text-inverted w-[130px]"
      >
        <span style="${!place.startYear ? "opacity: 0;" : "opacity: 1;"}">
          ${place.startYear ? place.startYear : "2000"}${" "}–${" "}
          ${place.endYear ? place.endYear : "present"}
        </span>
      </p>
      <${PrevNextProjectSection}
        currentPlaceId=${place.id}
        filteredPlaces=${filteredPlaces}
        goToPlace=${goToPlace}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 12 12"
        class="cursor-pointer h-6 w-6 p-1 mr-[-4px] md:hover:opacity-65 transition-opacity"
        onclick=${handleCloseOverlay}
      >
        <path
          stroke="#FBF9F4"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="m.75 11.235 5.243-5.242m0 0L11.235.75M5.993 5.993.75.75m5.243 5.243 5.242 5.242"
        />
      </svg>
    </div>`}
    <div class="flex flex-col items-start justify-center w-full">
      ${isMobile() &&
      html`
        <div
          class="flex flex-row items-center gap-2 mb-6"
          onclick=${handleCloseOverlay}
        >
          <svg
            class="cursor-pointer h-4 w-4 "
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
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
          <p
            class="cursor-pointer mb-0 text-vis-text-inverted font-sora text-sm uppercase"
          >
            Back to map
          </p>
        </div>
      `}
      ${isMobile() &&
      html`<p
        class="font-libre italic text-lg font-italic text-vis-text-inverted"
      >
        ${place.startYear && place.startYear !== ""
          ? html`<span>
              ${place.startYear}${" "}–${" "}
              ${place.endYear ? place.endYear : "present"}
            </span>`
          : null}
      </p>`}
      <div class="flex flex-row items-start justify-between w-full">
        <p class="text-vis-text-inverted text-[32px]">${place.name}</p>
        ${place.projectLink && place.projectLink !== "" && !isMobile()
          ? html`<div class="mt-[-8px]">
              <${AnimatedButton}
                onClickAction=${() => window.open(place.projectLink, "_blank")}
                text="Learn more"
                type="black"
              />
            </div>`
          : null}
      </div>
    </div>
  </div>`;
}

function DescriptionSection({ place }) {
  return html`<div
    class="p-6 text-vis-text-primary text-[16px] leading-[155%] font-authentic"
  >
    ${place.description}
    ${place.projectLink && place.projectLink !== "" && isMobile()
      ? html` <${AnimatedButton}
          onClickAction=${() => window.open(place.projectLink, "_blank")}
          text="Learn more"
          type="black"
        />`
      : null}
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
  const [isScrolling, setIsScrolling] = useState(false);
  const [containerRef, setContainerRef] = useState(null);
  const [animationDistance, setAnimationDistance] = useState(null);

  // Reset animation state when place changes
  useEffect(() => {
    setIsScrolling(false);
    setAnimationDistance(null);
  }, [place.partners]);

  useEffect(() => {
    if (!containerRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Wait for all images to load before measuring
            const contentDiv = containerRef.querySelector("div");
            if (contentDiv) {
              const images = contentDiv.querySelectorAll("img");
              const imagePromises = Array.from(images).map((img) => {
                if (img.complete) {
                  return Promise.resolve();
                }
                return new Promise((resolve) => {
                  img.addEventListener("load", resolve);
                  img.addEventListener("error", resolve); // Handle errors gracefully
                });
              });

              Promise.all(imagePromises).then(() => {
                // Now measure after all images are loaded
                const contentWidth = contentDiv.scrollWidth;
                const containerWidth = containerRef.clientWidth;
                const animationDistance = contentWidth + 32;
                if (contentWidth > containerWidth) {
                  setAnimationDistance(animationDistance);
                  setTimeout(() => {
                    setIsScrolling(true);
                  }, 800);
                }
              });
            }
          } else {
            setIsScrolling(false);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(containerRef);

    return () => {
      observer.unobserve(containerRef);
    };
  }, [containerRef, place.partners]);

  const partnersContent =
    place.partners && place.partners.length > 0
      ? place.partners.map((partner) => {
          const partnerData = partners.find((p) => p.partnerName === partner);
          if (!partnerData || !partnerData.partnerLink)
            return html`<img
              src="${REPO_URL}/assets/partnerLogos/Partner Name=${partner}.png"
              alt="${partner} logo"
              class="h-12 object-contain shrink-0"
            />`;
          return html`<a
            href=${partnerData.partnerLink}
            target="_blank"
            class="shrink-0"
            ><img
              src="${REPO_URL}/assets/partnerLogos/Partner Name=${partner}.png"
              alt="${partner} logo"
              class="h-12 min-w-12 object-contain"
          /></a>`;
        })
      : null;

  return html`<div class="p-6 bg-white">
    <p class="${titleClasses} text-vis-text-primary">Partners</p>
    <div class="relative overflow-hidden h-14">
      <div ref=${setContainerRef} class="flex flex-row items-center h-14 py-1">
        <div
          class="flex flex-row items-center gap-8 ${isScrolling
            ? "partners-scroll-content"
            : ""}"
        >
          ${partnersContent} ${isScrolling ? partnersContent : null}
        </div>
      </div>
      <!-- Fade gradients on both sides - only when scrolling is needed -->
      ${isScrolling
        ? html`
            <!-- Left fade gradient -->
            <div
              class="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"
            ></div>
            <!-- Right fade gradient -->
            <div
              class="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"
            ></div>
          `
        : null}
    </div>

    ${animationDistance
      ? html`<style>
          @keyframes partnerScroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-${animationDistance}px);
            }
          }

          .partners-scroll-content {
            animation: partnerScroll 25s linear infinite;
            width: fit-content;
          }
        </style>`
      : html`<style>
          .partners-scroll-content {
            /* No animation until distance is calculated */
          }
        </style>`}
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
  let mergedLocationString = "";
  if (place.mergedLocation && place.mergedLocation.length === 1) {
    mergedLocationString = place.mergedLocation[0];
  } else if (place.mergedLocation && place.mergedLocation.length === 2) {
    mergedLocationString = place.mergedLocation.join(" & ");
  } else if (place.mergedLocation && place.mergedLocation.length > 2) {
    mergedLocationString = place.mergedLocation.join(" | ");
  }

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
        ><span>${mergedLocationString}</span>
      </div>
    </div>
  </div>`;
}

function GiniCoefficientSection({ gini, titleClasses, prefix = "mobile" }) {
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
    const giniEllipse = document.getElementById(prefix + "-gini-ellipse");
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
    const giniContainer = document.getElementById(prefix + "-gini-container");
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
        class="cursor-pointer mb-4 h-5 w-5"
        onmouseenter="${() => setShowTooltip(true)}"
        onmouseleave="${() => setShowTooltip(false)}"
      />
      <div
        class="w-[140%] bg-[#0F100F] px-4 py-4 absolute top-[30px] right-0 font-authentic text-base leading-[155%] text-vis-text-inverted text-transform-none z-10 shadow-lg pointer-events-none ${showTooltip
          ? ""
          : "hidden"}"
      >
        <span
          >The Gini coefficient measures inequality on a scale ranging
          from${" "} <span class="font-bold">0%</span>${" "} (complete equality:
          everyone has the same income) to${" "}
          <span class="font-bold">100%</span> (complete inequality: one person
          has all the income).</span
        >
        <span
          class="absolute top-0 left-[212px] md:left-[216px]"
          style="transform: rotate(180deg) translate(0, 15px);"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <polygon points="0,0 16,0 8,8" fill="#0F100F" stroke="#0F100F" />
          </svg>
        </span>
      </div>
    </div>
    <div class="relative" id="${prefix}-gini-container">
      <img
        src="${REPO_URL}/assets/gini_coefficient_ellipse.png"
        alt="Gini Coefficient Chart"
        id="${prefix}-gini-ellipse"
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

function PrevNextProjectSection({ currentPlaceId, filteredPlaces, goToPlace }) {
  // filteredPlaces is expected to be an object keyed by nameCleaned; convert to an array safely
  const placesArray =
    filteredPlaces && typeof filteredPlaces === "object"
      ? Object.values(filteredPlaces)
      : [];

  let currentIndex = placesArray.findIndex(
    (place) => place.id === currentPlaceId
  );
  if (currentIndex === -1) {
    currentIndex = 0;
  }

  function scrollToTopOfOverlay() {
    const overlayContent = document.querySelector(".map-details-content");
    if (overlayContent) {
      overlayContent.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goToPrevProject() {
    if (placesArray.length === 0) return;
    const prevIndex =
      currentIndex === 0 ? placesArray.length - 1 : currentIndex - 1;
    const prevPlace = placesArray[prevIndex];
    if (prevPlace) {
      goToPlace(prevPlace.nameCleaned);
      // Delay scroll to ensure new content is rendered
      setTimeout(() => {
        scrollToTopOfOverlay();
      }, 0);
    }
  }

  function goToNextProject() {
    if (placesArray.length === 0) return;
    const nextIndex =
      currentIndex === placesArray.length - 1 ? 0 : currentIndex + 1;
    const nextPlace = placesArray[nextIndex];
    if (nextPlace) {
      goToPlace(nextPlace.nameCleaned);
      // Delay scroll to ensure new content is rendered
      setTimeout(() => {
        scrollToTopOfOverlay();
      }, 0);
    }
  }

  return html`<div
    class="uppercase bg-vis-main-blue md:bg-transparent text-vis-text-inverted flex flex-row items-center justify-center gap-4 py-6 lg:py-0 font-sora text-sm"
    style="${isMobile()
      ? `background-image: url('${REPO_URL}/assets/gradient_texture_blue_button.png');`
      : ""}"
  >
    ${placesArray.length > 1
      ? html`<button
          class="flex flex-row items-center gap-4 md:hover:opacity-65 transition-opacity"
          onclick="${() => goToPrevProject()}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="#FBF9F4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M10 4 6 8l4 4"
            />
          </svg>
          <span class="uppercase">Prev</span>
        </button>`
      : null}
    <p
      class="border-x border-vis-text-inverted px-4 font-sora text-sm flex flex-row gap-1 items-center"
    >
      ${isMobile() ? null : html`Project`}
      <span class="bg-[#2C54DF] px-3 py-[2px] rounded-[112px]"
        >${currentIndex + 1}</span
      >
      ${isMobile() ? html`/` : html`of`}
      <span class="bg-[#2C54DF] px-3 py-[2px] rounded-[112px]"
        >${placesArray.length}</span
      >
    </p>
    ${placesArray.length > 1
      ? html`<button
          class="flex flex-row items-center gap-4 md:hover:opacity-65 transition-opacity"
          onclick="${() => goToNextProject()}"
        >
          <span class="uppercase">Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
          >
            <path
              stroke="#FBF9F4"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="m6 12 4-4-4-4"
            />
          </svg>
        </button>`
      : null}
  </div>`;
}
