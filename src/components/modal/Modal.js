import "./modal.css";

export default class Modal {
  constructor() {
    this.modal = document.createElement("div");
    this.modal.classList.add("modal");

    this.form = document.createElement("form");
    this.form.classList.add("modal__form");

    this.title = document.createElement("h3");
    this.title.classList.add("modal__title");
    this.title.textContent = "Choose your nickname";

    this.label = document.createElement("label");
    this.label.classList.add("modal__label", "visually-hidden");
    this.label.htmlFor = "name";
    this.label.textContent = "Choose your nickname";

    this.input = document.createElement("input");
    this.input.classList.add("modal__input");
    this.input.id = "name";
    this.input.type = "text";
    this.input.placeholder = "Enter your nickname";
    this.input.required = true;

    this.tooltip = document.createElement("p");
    this.tooltip.classList.add("modal__tooltip", "visually-hidden");

    this.button = document.createElement("button");
    this.button.classList.add("modal__btn");
    this.button.type = "submit";
    this.button.textContent = "Join the chat";

    this.form.append(
      this.title,
      this.label,
      this.input,
      this.tooltip,
      this.button,
    );

    this.modal.append(this.form);

    document.body.append(this.modal);
  }

  hide() {
    this.modal.classList.add("hidden");
  }

  showTooltip(text) {
    this.tooltip.classList.remove("visually-hidden");
    this.tooltip.textContent = text;
  }

  hideTooltip() {
    this.tooltip.classList.add("visually-hidden");
  }

  getInputValue() {
    this.input.value = this.input.value.trim();
    return this.input.value;
  }

  submitEvent(handler) {
    this.form.addEventListener("submit", handler);
  }

  removeForm() {
    this.modal.remove();
  }
}
