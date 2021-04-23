import { debounce } from "./utils.mjs";

class AutoComplete extends HTMLElement {
  constructor() {
    super();

    this.suggestions = [];
    this.initializeElements();
  }

  initializeElements() {
    this.inputElement = document.createElement("input");
    this.inputElement.type = "text";

    this.popoverElement = document.createElement("div");
    this.popoverElement.id = "popover";

    this.containerElement = document.createElement("div");
    this.containerElement.appendChild(this.inputElement);
    this.containerElement.appendChild(this.popoverElement);

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.containerElement);
  }

  populateSuggestions() {
    if (this.popoverElement.children.length) {
      this.popoverElement.removeChild(this.popoverElement.firstChild);
    }

    const suggestionListElement = document.createElement("div");
    this.suggestions.forEach((suggestion) => {
      const element = document.createElement("div");
      element.innerHTML = suggestion;

      suggestionListElement.appendChild(element);
    });
    this.popoverElement.appendChild(suggestionListElement);
  }

  fetchSuggestions() {
    if (this.inputElement.value) {
      fetch(`${this.getAttribute('source')}/${this.inputElement.value}`)
        .then((res) => res.json())
        .then((countries) => {
          this.suggestions = countries.map((country) => country.name);
          this.populateSuggestions();
        })
        .catch(() => {
          this.suggestions = [];
          this.populateSuggestions();
        });
    } else {
      this.suggestions = [];
      this.populateSuggestions();
    }
  }

  connectedCallback() {
    this.inputElement.addEventListener(
      "keyup",
      debounce(this.fetchSuggestions.bind(this), 400)
    );
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener("keyup");
  }
}

customElements.define("auto-complete", AutoComplete);
