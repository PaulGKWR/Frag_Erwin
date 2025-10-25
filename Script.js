async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const msg = input.value.trim();
  
  if (!msg) return;
  
  chatBox.innerHTML += `<div><b>Du:</b> ${msg}</div>`;
  input.value = "";
  
  // Hier später dein Azure-Backend einfügen
  chatBox.innerHTML += `<div><b>Bot:</b> (Antwort folgt...)</div>`;
}
