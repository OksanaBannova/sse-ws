import Modal from "../components/modal/Modal";
import Service from "./server/Service";
import Chat from "../components/chat/Chat";
import Users from "../components/users/Users";
import Spinner from "../components/spinner/Spinner";

export default class Controller {
  constructor(container) {
    this.container = container;
  }

  async init() {
    this.spinner = new Spinner(); // запускаем спиннер ожидания
    const server = await Service.pingServer(); // ждём ответа от сервера
    this.spinner.removeSpinner(); // убираем спиннер после получения ответа от сервера

    this.renderModal();
  }

  renderModal() {
    this.modal = new Modal();

    const inputField = this.modal.input;
    if (inputField) {
      inputField.addEventListener("input", () => {
        this.modal.hideTooltip(); // Скрываем tooltip при вводе текста
      });

      this.modal.submitEvent(this.addModalSubmitEvent.bind(this));
    }
  }

  async addModalSubmitEvent(event) {
    event.preventDefault();

    const name = this.modal.getInputValue();

    const data = await Service.registerUser(name);

    if (data.status === "error") {
      this.modal.showTooltip(
        "This nickname is taken. Please, choose another one.",
      );
      return;
    }

    if (data.status === "ok") {
      this.currentId = data.user.id; // свой id
      this.currentName = data.user.name; // своё имя

      window.addEventListener("beforeunload", this.exit.bind(this)); // перед закрытием страницы...

      this.modal.removeForm(); // удаляем модалку из DOM
      this.renderPage();
    }
  }

  exit() {
    const msg = {
      type: "exit",
      user: { id: this.currentId, name: this.currentName },
    };

    this.ws.send(JSON.stringify(msg)); // отправка данных через ws-соединение
  }

  renderPage() {
    this.container.classList.remove("hidden"); // отрисовка контейнера для всего контента
    this.usersContainer = new Users(this.container); // отрисовка контейнера для юзеров
    this.chatContainer = new Chat(this.container); // отрисовка контейнера для сообщений
    this.chatContainer.addSubmitEvent(this.addChatSubmitEvent.bind(this));

    this.connectToWebSocket();
  }

  connectToWebSocket() {
    // this.ws = new WebSocket("ws://localhost:3000/ws"); // локальный сервер
    this.ws = new WebSocket(
      "wss://ahj-homeworks-sse-ws-backend-4lat.onrender.com/ws",
    ); // сервер на Render

    this.ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      // отрисовка сообщений у всех юзеров:
      if (data.type === "send") {
        const name = data.user.id === this.currentId ? "You" : data.user.name;
        const info = `${name}, ${data.created}`;
        this.chatContainer.addMessage(info, data.msg, name === "You"); // 'Anna, 20:50 19.09.2024', 'Hello!', true
        this.chatContainer.resetForm(); // очищаем форму
        return;
      }

      // обновление списка юзеров при входе/выходе каждого юзера:
      this.usersContainer.deleteUsers(); // 1. полная очистка списка юзеров

      data.forEach((user) => {
        const name = user.id === this.currentId ? "You" : user.name;
        this.usersContainer.addUser(name); // 2. добавление заново всех юзеров, которые онлайн
      });
    });
  }

  addChatSubmitEvent(event) {
    event.preventDefault();

    const message = this.chatContainer.getMessages();

    if (!message) {
      this.chatContainer.resetForm(); // очищаем форму
      return;
    }

    this.sendMsg(message);
  }

  sendMsg(message) {
    const date = new Date(Date.now()).toLocaleString("ru-Ru", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const formattedDate = date.split(", ").reverse().join(" ");

    const msg = {
      type: "send",
      msg: message,
      user: {
        id: this.currentId,
        name: this.currentName,
      },
      created: formattedDate,
    };

    this.ws.send(JSON.stringify(msg)); // отправка данных через ws-соединение
  }
}
