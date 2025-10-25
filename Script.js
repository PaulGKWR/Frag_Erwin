async function sendMessage() {async function sendMessage() {async function sendMessage() {

  const input = document.getElementById("user-input");

  const chatBox = document.getElementById("chat-box");  const input = document.getElementById("user-input");  const input = document.getElementById("user-input");

  const msg = input.value.trim();

  if (!msg) return;  const chatBox = document.getElementById("chat-box");  const chatBox = document.getElementById("chat-box");

  chatBox.innerHTML += `<div><b>Du:</b> ${msg}</div>`;

  input.value = "";  const msg = input.value.trim();  const msg = input.value.trim();

  // Hier später dein Azure-Backend einfügen

  chatBox.innerHTML += `<div><b>Bot:</b> (Antwort folgt...)</div>`;  if (!msg) return;  if (!msg) return;

}
  chatBox.innerHTML += `<div><b>Du:</b> ${msg}</div>`;  chatBox.innerHTML += `<div><b>Du:</b> ${msg}</div>`;

  input.value = "";  input.value = "";

  // Hier später dein Azure-Backend einfügen  // Hier später dein Azure-Backend einfügen

  chatBox.innerHTML += `<div><b>Bot:</b> (Antwort folgt...)</div>`;  chatBox.innerHTML += `<div><b>Bot:</b> (Antwort folgt...)</div>`;

}}
