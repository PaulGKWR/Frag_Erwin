// FAQs dynamisch laden
let faqData=[];

async function loadFAQs(){try{const response=await fetch('faq-data.json');faqData=await response.json();renderFAQs()}catch(error){console.error('Fehler beim Laden der FAQs:',error)}}function renderFAQs(){const faqSection=document.querySelector('.faq-section');if(!faqSection)return;const existingFAQs=faqSection.querySelectorAll('.faq-item');existingFAQs.forEach(item=>item.remove());faqData.faqs.forEach((faq,index)=>{const faqItem=document.createElement('div');faqItem.className='faq-item';faqItem.innerHTML=`<button class="faq-question" onclick="toggleFaq(${index})">
<span>${faq.frage}</span>
<span class="faq-icon">+</span>
</button>
<div class="faq-answer">${faq.antwort}</div>`;faqSection.appendChild(faqItem)})}function toggleFaq(index){const faqItems=document.querySelectorAll('.faq-item');if(index<0||index>=faqItems.length)return;const clickedItem=faqItems[index];const clickedAnswer=clickedItem.querySelector('.faq-answer');const isCurrentlyOpen=clickedItem.classList.contains('active');faqItems.forEach((item,i)=>{if(i!==index){item.classList.remove('active');item.querySelector('.faq-answer').classList.remove('open')}});if(!isCurrentlyOpen){clickedItem.classList.add('active');clickedAnswer.classList.add('open')}else{clickedItem.classList.remove('active');clickedAnswer.classList.remove('open')}}function openChat(){document.getElementById('chat-overlay').classList.add('open')}function closeChat(){document.getElementById('chat-overlay').classList.remove('open')}async function sendMessage(){const input=document.getElementById('chat-input');const message=input.value.trim();if(!message)return;input.value='';const messagesContainer=document.getElementById('chat-messages');const userMsg=document.createElement('div');userMsg.className='message user-message';userMsg.textContent=message;messagesContainer.appendChild(userMsg);messagesContainer.scrollTop=messagesContainer.scrollHeight;const response=await callAzureOpenAI(message);const botMsg=document.createElement('div');botMsg.className='message bot-message';botMsg.textContent=response;messagesContainer.appendChild(botMsg);messagesContainer.scrollTop=messagesContainer.scrollHeight}async function callAzureOpenAI(message){
  // Azure Function Endpoint
  const AZURE_FUNCTION_URL = 'https://fragerwinbe-b2h0dghuc6fscpam.eastus-01.azurewebsites.net/api/chat';
  
  try {
    const response = await fetch(AZURE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response || 'Entschuldigung, ich konnte keine Antwort generieren.';
    
  } catch (error) {
    console.error('Fehler beim API-Call:', error);
    // Fallback zu lokalen Mock-Antworten
    return getFallbackResponse(message);
  }
}

function getFallbackResponse(message) {
  const msg = message.toLowerCase();
  if(msg.includes('berechnung')||msg.includes('berechnet')){
    return 'Die Abwassergebühren werden nach der Menge des verbrauchten Frischwassers berechnet. Der Gebührensatz beträgt aktuell 2,50€ pro Kubikmeter.';
  }
  if(msg.includes('einspruch')){
    return 'Sie können innerhalb von einem Monat nach Erhalt des Bescheids Widerspruch einlegen. Nutzen Sie dafür das Formular auf unserer Website oder senden Sie ein formloses Schreiben.';
  }
  if(msg.includes('ermäßigung')||msg.includes('rabatt')){
    return 'Ermäßigungen gibt es für Haushalte mit geringem Einkommen und für Großfamilien. Bitte reichen Sie die entsprechenden Nachweise bei uns ein.';
  }
  if(msg.includes('zahlungsverzug')||msg.includes('nicht bezahlt')){
    return 'Bei Zahlungsverzug werden zunächst Mahngebühren erhoben. Nach mehrmaliger Mahnung kann die Wasserversorgung gesperrt werden. Bitte kontaktieren Sie uns bei Zahlungsschwierigkeiten.';
  }
  if(msg.includes('frist')||msg.includes('wann')){
    return 'Die Rechnung wird einmal jährlich im März verschickt. Die Zahlungsfrist beträgt 30 Tage.';
  }
  return 'Vielen Dank für Ihre Frage! Für detailliertere Informationen empfehle ich Ihnen, unsere FAQ-Sektion zu lesen oder uns direkt zu kontaktieren.';
}document.getElementById('chat-input').addEventListener('keypress',function(e){if(e.key==='Enter'){sendMessage()}});document.getElementById('chat-overlay').addEventListener('click',function(e){if(e.target.id==='chat-overlay'){closeChat()}});window.addEventListener('DOMContentLoaded',loadFAQs);