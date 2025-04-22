export default async function createRequest(options) {
  // const baseUrl = "http://localhost:8080"; // локальный сервер
  const baseUrl = "https://sse-ws-lsz9.onrender.com"; // сервер на Render

  const { method, url, body } = options;

  try {
    const response = await fetch(baseUrl + url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // проверка подключения к серверу:
    if (response.status === 204) {
      return { status: response.status, message: "Server found!" };
    }

    return await response.json();
  } catch (err) {
    return { error: true, status: 520 };
  }
}
