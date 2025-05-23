import "./users.css";

export default class Users {
  constructor(container) {
    this.container = container;

    this.users = document.createElement("div");
    this.users.classList.add("users");

    this.container.append(this.users);
  }

  addUser(nickName) {
    const user = document.createElement("div");
    user.classList.add("user");

    const photo = document.createElement("div");
    photo.classList.add("user__photo");
    photo.textContent = nickName.slice(0, 1).toUpperCase();

    const name = document.createElement("div");
    name.classList.add("user__name");
    name.textContent = nickName;

    if (nickName === "You") {
      name.classList.add("user__name_you");
    }

    user.append(photo, name);

    this.users.append(user);
  }

  deleteUsers() {
    [...this.users.children].forEach((child) => child.remove());
  }
}
