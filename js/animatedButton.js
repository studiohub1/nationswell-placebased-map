import { html } from "./preact-htm.js";
import { REPO_URL } from "./helper.js";

export function AnimatedButton({ onClickAction, text, type = "default" }) {
  return html`<button
    onclick=${() => onClickAction()}
    class="animated-button-wrapper ${type === "black"
      ? "bg-black"
      : "bg-vis-main-blue"} ${type === "default"
      ? "w-full"
      : ""} flex gap-x-6 flex-row justify-between items-center px-4 py-2 mt-4 bg-cover bg-center"
    style="${type === "default"
      ? `background-image: url('${REPO_URL}/assets/gradient_texture_blue_button.png');`
      : ""}"
  >
    <div class="relative overflow-hidden flex items-center">
      <span
        class="animated-button-element-y font-sora text-sm uppercase text-vis-text-inverted"
        >${text}</span
      >
      <span
        class="animated-button-element-y font-sora text-sm uppercase text-vis-text-inverted absolute"
        style="inset: auto 0% -100%;"
        >${text}</span
      >
    </div>
    <div class="relative overflow-hidden flex">
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="animated-button-element-x"
      >
        <path
          d="M4.30859 7.84961C3.96342 7.84961 3.68359 8.12943 3.68359 8.47461C3.68359 8.81979 3.96342 9.09961 4.30859 9.09961L4.30859 8.47461L4.30859 7.84961ZM13.5005 8.91655C13.7446 8.67247 13.7446 8.27675 13.5005 8.03267L9.52306 4.05519C9.27898 3.81111 8.88325 3.81111 8.63918 4.05519C8.3951 4.29927 8.3951 4.695 8.63918 4.93908L12.1747 8.47461L8.63918 12.0101C8.3951 12.2542 8.3951 12.6499 8.63918 12.894C8.88325 13.1381 9.27898 13.1381 9.52306 12.894L13.5005 8.91655ZM4.30859 8.47461L4.30859 9.09961L13.0586 9.09961L13.0586 8.47461L13.0586 7.84961L4.30859 7.84961L4.30859 8.47461Z"
          fill="#FBF9F4"
        />
      </svg>
      <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="animated-button-element-x absolute"
        style="top: 0; left:-100%;"
      >
        <path
          d="M4.30859 7.84961C3.96342 7.84961 3.68359 8.12943 3.68359 8.47461C3.68359 8.81979 3.96342 9.09961 4.30859 9.09961L4.30859 8.47461L4.30859 7.84961ZM13.5005 8.91655C13.7446 8.67247 13.7446 8.27675 13.5005 8.03267L9.52306 4.05519C9.27898 3.81111 8.88325 3.81111 8.63918 4.05519C8.3951 4.29927 8.3951 4.695 8.63918 4.93908L12.1747 8.47461L8.63918 12.0101C8.3951 12.2542 8.3951 12.6499 8.63918 12.894C8.88325 13.1381 9.27898 13.1381 9.52306 12.894L13.5005 8.91655ZM4.30859 8.47461L4.30859 9.09961L13.0586 9.09961L13.0586 8.47461L13.0586 7.84961L4.30859 7.84961L4.30859 8.47461Z"
          fill="#FBF9F4"
        />
      </svg>
    </div>
  </button>`;
}
