import { singleton } from "tsyringe";
import { version } from "../../package.json";
import { IError } from "./ErrorHandler";
import "../error-display.css";

@singleton()
export default class ErrorDisplay {
  private errorList: HTMLElement;
  private errorOverlay: HTMLElement;
  private errorToggle: HTMLElement;
  private errorCountBadge: HTMLElement;
  private errorCount = 0;

  constructor() {
    const errorContainer = document.createElement("div");
    errorContainer.id = "error-container";
    document.body.appendChild(errorContainer);

    this.errorToggle = document.createElement("button");
    this.errorToggle.id = "error-toggle";
    this.errorToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0
0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="roun
d" stroke-linejoin="round" class="lucide lucide-bug"><path d="m8 2 1.88 1.88"/><
path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d
="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><
path d="M12 20v-8"/><path d="M6.53 9C4.6 9 3 10.6 3 12.5S4.6 16 6.5 16H8"/><path
 d="M17.5 16c1.9 0 3.5-1.6 3.5-3.5S19.4 9 17.5 9H16"/></svg>
    `;
    errorContainer.appendChild(this.errorToggle);

    this.errorCountBadge = document.createElement("span");
    this.errorCountBadge.id = "error-count-badge";
    this.errorCountBadge.style.display = "none";
    errorContainer.appendChild(this.errorCountBadge);

    this.errorOverlay = document.createElement("div");
    this.errorOverlay.id = "error-overlay";
    this.errorOverlay.classList.add("hidden");
    document.body.appendChild(this.errorOverlay);

    const errorHeader = document.createElement("div");
    errorHeader.id = "error-header";
    errorHeader.innerHTML = `<h2>Errors</h2><span>v${version}</span>`;
    this.errorOverlay.appendChild(errorHeader);

    const closeButton = document.createElement("button");
    closeButton.id = "error-close-button";
    closeButton.innerText = "X";
    errorHeader.appendChild(closeButton);

    this.errorList = document.createElement("ul");
    this.errorOverlay.appendChild(this.errorList);

    this.errorToggle.addEventListener("click", () => {
      this.errorOverlay.classList.toggle("hidden");
    });

    closeButton.addEventListener("click", () => {
      this.errorOverlay.classList.add("hidden");
    });
  }

  public addError(error: IError): void {
    this.errorCount++;
    this.updateBadge();

    const errorItem = document.createElement("li");

    const details = document.createElement("details");

    const summary = document.createElement("summary");
    summary.innerText = error.message;
    details.appendChild(summary);

    const stackTrace = document.createElement("pre");
    stackTrace.innerText = error.stack || "No stack trace available";
    details.appendChild(stackTrace);

    const copyMessageButton = document.createElement("button");
    copyMessageButton.innerText = "Copy Message";
    copyMessageButton.onclick = () => {
      navigator.clipboard.writeText(error.message);
    };

    const copyStackButton = document.createElement("button");
    copyStackButton.innerText = "Copy Stack";
    copyStackButton.onclick = () => {
      navigator.clipboard.writeText(error.stack || "");
    };

    errorItem.appendChild(details);
    errorItem.appendChild(copyMessageButton);
    errorItem.appendChild(copyStackButton);

    this.errorList.appendChild(errorItem);
  }

  public clearErrors(): void {
    this.errorList.innerHTML = "";
    this.errorCount = 0;
    this.updateBadge();
    this.errorOverlay.classList.add("hidden");
  }

  private updateBadge(): void {
    if (this.errorCount > 0) {
      this.errorCountBadge.innerText = this.errorCount.toString();
      this.errorCountBadge.style.display = "block";
    } else {
      this.errorCountBadge.style.display = "none";
    }
  }
}
