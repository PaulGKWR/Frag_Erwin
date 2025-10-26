const AZURE_FUNCTION_URL = 'https://fragerwinchatv2.azurewebsites.net/api/chat';
const CHAT_STYLE_ID = 'chat-enhancements';
const CHAT_ENHANCEMENT_STYLES = `
.message-pending { opacity: 0.75; font-style: italic; }
.message-citations { margin-top: 0.5rem; color: #4c5a6a; font-size: 0.85rem; }
.message-citations ul { margin-top: 0.25rem; margin-left: 1.2rem; }
.message-citations li { margin-bottom: 0.2rem; list-style: disc; }
.message-citations a { color: #4255c3; text-decoration: underline; }
.message-citations a:hover { color: #2d3aa0; text-decoration: none; }
.citation-meta { color: #7f8c8d; font-size: 0.75rem; }

.bot-message p {
    margin: 0 0 0.75em 0;
    line-height: 1.6;
}

.bot-message p:last-child {
    margin-bottom: 0;
}

.typing-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
}

.typing-indicator span {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #667eea;
    animation: typing-bounce 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing-bounce {
    0%, 60%, 100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-15px);
    }
}
`;

let faqData = [];

function ensureChatStyles() {
  if (document.getElementById(CHAT_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = CHAT_STYLE_ID;
  style.textContent = CHAT_ENHANCEMENT_STYLES;
  document.head.appendChild(style);
}

function openChat() {
  const overlay = document.getElementById('chat-overlay');
  if (overlay) {
    overlay.classList.add('open');
  }
}

function closeChat() {
  const overlay = document.getElementById('chat-overlay');
  if (overlay) {
    overlay.classList.remove('open');
  }
}

function createMessageElement(text, type) {
  const wrapper = document.createElement('div');
  wrapper.className = `message-wrapper ${type}-wrapper`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = type === 'user-message' ? '👤' : '💧';
  
  const element = document.createElement('div');
  element.className = `message ${type}`;
  element.textContent = text;
  
  if (type === 'user-message') {
    wrapper.appendChild(element);
    wrapper.appendChild(avatar);
  } else {
    wrapper.appendChild(avatar);
    wrapper.appendChild(element);
  }
  
  return wrapper;
}

function renderCitations(messageElement, citations) {
    if (!Array.isArray(citations) || citations.length === 0) {
        console.log('No citations to render');
        return;
    }

    console.log('Rendering citations:', citations);

    // Gruppiere Citations nach Dokument
    const uniqueDocs = new Map();
    citations.forEach(citation => {
        const filepath = citation?.filepath || citation?.title || 'unknown';
        if (!uniqueDocs.has(filepath)) {
            uniqueDocs.set(filepath, citation);
        }
    });

    if (uniqueDocs.size === 0) return;

    const container = document.createElement('div');
    container.className = 'message-citations';
    container.style.cssText = 'margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(124, 58, 237, 0.2);';

    const title = document.createElement('strong');
    title.textContent = '📚 Quellen:';
    title.style.cssText = 'display: block; margin-bottom: 8px; color: #7c3aed; font-size: 0.9em;';
    container.appendChild(title);

    let docIndex = 1;
    uniqueDocs.forEach((citation, filepath) => {
        const link = document.createElement('a');
        let url = citation?.url || citation?.filepath || '#';
        
        // Entferne Dateiendung für Display
        const displayName = filepath.replace(/\.[^/.]+$/, '').substring(0, 30);
        
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = `[${docIndex}] ${displayName}${filepath.length > 30 ? '...' : ''}`;
        link.style.cssText = 'display: block; margin: 6px 0; color: #7c3aed; text-decoration: none; font-size: 0.85em; transition: color 0.2s;';
        
        link.addEventListener('mouseover', () => {
            link.style.color = '#5b21b6';
            link.style.textDecoration = 'underline';
        });
        link.addEventListener('mouseout', () => {
            link.style.color = '#7c3aed';
            link.style.textDecoration = 'none';
        });
        
        container.appendChild(link);
        docIndex++;
    });

    messageElement.appendChild(container);
}

function scrollMessagesToBottom(container) {
  container.scrollTop = container.scrollHeight;
}

function setInputDisabled(isDisabled) {
  const input = document.getElementById('chat-input');
  const button = document.getElementById('send-button');
  if (input) input.disabled = isDisabled;
  if (button) button.disabled = isDisabled;
}

function useStarterPrompt(button) {
  const promptText = button.querySelector('.prompt-text').textContent;
  const input = document.getElementById('chat-input');
  
  if (input) {
    input.value = promptText;
    input.focus();
  }
  
  // Hide the entire starter prompts section after clicking one
  const starterPromptsSection = document.querySelector('.starter-prompts-section');
  if (starterPromptsSection) {
    starterPromptsSection.style.display = 'none';
  }
  
  // Optionally send the message automatically
  sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    if (!input || !messagesContainer) return;

    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    input.style.height = 'auto'; // Reset height after sending

    const userMsgWrapper = createMessageElement(message, 'user-message');
    messagesContainer.appendChild(userMsgWrapper);
    scrollMessagesToBottom(messagesContainer);

    const pendingWrapper = document.createElement('div');
    pendingWrapper.className = 'message-wrapper bot-message-wrapper';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '💧';
    
    const pendingMsg = document.createElement('div');
    pendingMsg.className = 'message bot-message';
    pendingMsg.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    
    pendingWrapper.appendChild(avatar);
    pendingWrapper.appendChild(pendingMsg);
    messagesContainer.appendChild(pendingWrapper);
    scrollMessagesToBottom(messagesContainer);

    setInputDisabled(true);

    let response;
    try {
        response = await callAzureOpenAI(message);
    } catch (error) {
        console.error('Unerwarteter Fehler beim API-Call:', error);
        response = {
            text: `[Fallback] ${getFallbackResponse(message)}\n(Grund: ${error.message})`,
            citations: []
        };
    }

    pendingWrapper.remove();
    
    const botMsgWrapper = document.createElement('div');
    botMsgWrapper.className = 'message-wrapper bot-message-wrapper';
    
    const botAvatar = document.createElement('div');
    botAvatar.className = 'message-avatar';
    botAvatar.textContent = '💧';
    
    const botMsg = document.createElement('div');
    botMsg.className = 'message bot-message';
    
    // Format text with proper paragraph structure
    const formattedText = formatTextWithParagraphs(response.text);
    botMsg.innerHTML = formattedText;
    
    renderCitations(botMsg, response.citations);
    
    botMsgWrapper.appendChild(botAvatar);
    botMsgWrapper.appendChild(botMsg);
    messagesContainer.appendChild(botMsgWrapper);
    
    // Scroll to show the new message at the top of the visible area
    setTimeout(() => {
        botMsgWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    setInputDisabled(false);
    input.focus();
}

function formatTextWithParagraphs(text) {
    // Split by double newlines (paragraphs) or numbered lists
    let formatted = text
        // Preserve existing line breaks and convert to <br>
        .split('\n\n')
        .map(para => para.trim())
        .filter(para => para.length > 0)
        .join('</p><p>');
    
    // Wrap in paragraph tags
    formatted = '<p>' + formatted + '</p>';
    
    // Convert single newlines within paragraphs to <br>
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Format numbered lists (1., 2., etc.)
    formatted = formatted.replace(/(<br>)?(\d+\.)\s+/g, '<br><strong>$2</strong> ');
    
    // Format bullet points
    formatted = formatted.replace(/(<br>)?[-•]\s+/g, '<br>• ');
    
    return formatted;
}async function callAzureOpenAI(message) {
  try {
    const response = await fetch(AZURE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    console.log('Azure Function response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    console.log('Azure Function response data:', data);

    const text = data?.message || data?.response;
    if (!text) {
      throw new Error('Antwort ohne message-Feld erhalten');
    }

    return {
      text,
      citations: Array.isArray(data?.citations) ? data.citations : [],
      searchActivated: Boolean(data?.searchActivated)
    };
  } catch (error) {
    console.error('Fehler beim API-Call:', error);
    return {
      text: `[Fallback] ${getFallbackResponse(message)}\n(Grund: ${error.message})`,
      citations: []
    };
  }
}

function getFallbackResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes('berechnung') || msg.includes('berechnet')) {
    return 'Die Abwassergebühren werden nach der Menge des verbrauchten Frischwassers berechnet. Der Gebührensatz beträgt aktuell 2,50€ pro Kubikmeter.';
  }
  if (msg.includes('einspruch')) {
    return 'Sie können innerhalb von einem Monat nach Erhalt des Bescheids Widerspruch einlegen. Nutzen Sie dafür das Formular auf unserer Website oder senden Sie ein formloses Schreiben.';
  }
  if (msg.includes('ermäßigung') || msg.includes('rabatt')) {
    return 'Ermäßigungen gibt es für Haushalte mit geringem Einkommen und für Großfamilien. Bitte reichen Sie die entsprechenden Nachweise bei uns ein.';
  }
  if (msg.includes('zahlungsverzug') || msg.includes('nicht bezahlt')) {
    return 'Bei Zahlungsverzug werden zunächst Mahngebühren erhoben. Nach mehrmaliger Mahnung kann die Wasserversorgung gesperrt werden. Bitte kontaktieren Sie uns bei Zahlungsschwierigkeiten.';
  }
  if (msg.includes('frist') || msg.includes('wann')) {
    return 'Die Rechnung wird einmal jährlich im März verschickt. Die Zahlungsfrist beträgt 30 Tage.';
  }
  return 'Vielen Dank für Ihre Frage! Für detailliertere Informationen empfehle ich Ihnen, unsere FAQ-Sektion zu lesen oder uns direkt zu kontaktieren.';
}

document.addEventListener('click', event => {
  const button = event.target.closest('.faq-question');
  if (button && button.dataset.faqIndex) {
    toggleFaq(parseInt(button.dataset.faqIndex, 10));
  }
});

document.getElementById('chat-input')?.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

document.getElementById('send-button')?.addEventListener('click', sendMessage);

document.getElementById('chat-overlay')?.addEventListener('click', event => {
  if (event.target?.id === 'chat-overlay') {
    closeChat();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  ensureChatStyles();
  initAnimatedPlaceholder();
  initAutoResizeTextarea();
  loadFAQs(1, 'Alle'); // Load FAQs from API
});

function initAutoResizeTextarea() {
  const textarea = document.getElementById('chat-input');
  if (!textarea) return;
  
  textarea.addEventListener('input', function() {
    // Reset height to auto to get the correct scrollHeight
    this.style.height = 'auto';
    
    // Set height based on content, with min and max constraints
    const newHeight = Math.min(Math.max(this.scrollHeight, 42), 150);
    this.style.height = newHeight + 'px';
  });
}

function initAnimatedPlaceholder() {
  const input = document.getElementById('chat-input');
  const placeholder = document.getElementById('animated-placeholder');
  
  if (!input || !placeholder) return;
  
  const text = 'Ihre Frage zu Abwassergebühren...';
  let index = 0;
  let typingInterval;
  
  function typePlaceholder() {
    if (index < text.length) {
      placeholder.textContent = text.substring(0, index + 1);
      index++;
    } else {
      clearInterval(typingInterval);
      // Restart after a pause
      setTimeout(() => {
        index = 0;
        placeholder.textContent = '';
        typingInterval = setInterval(typePlaceholder, 80);
      }, 3000);
    }
  }
  
  // Start typing animation
  typingInterval = setInterval(typePlaceholder, 80);
  
  // Hide placeholder when input is focused or has value
  input.addEventListener('focus', () => {
    placeholder.style.display = 'none';
  });
  
  input.addEventListener('blur', () => {
    if (!input.value) {
      placeholder.style.display = 'block';
    }
  });
  
  input.addEventListener('input', () => {
    if (input.value) {
      placeholder.style.display = 'none';
    } else if (document.activeElement !== input) {
      placeholder.style.display = 'block';
    }
  });
}

// ========================================
// FAQ FILTERING & PAGINATION
// ========================================

const FAQ_API_URL = 'https://fragerwinchatv2.azurewebsites.net/api/faq-manager';
let currentFAQPage = 1;
const faqsPerPage = 6;
let currentFilter = 'Alle';

async function loadFAQs(page = 1, filter = 'Alle') {
  const loadingDiv = document.getElementById('faq-loading');
  const container = document.getElementById('faq-container');
  const pagination = document.getElementById('faq-pagination');
  
  try {
    loadingDiv.style.display = 'block';
    container.style.display = 'none';
    
    const sortBy = filter === 'Am häufigsten genutzt' ? 'viewCount' : 'newest';
    const response = await fetch(`${FAQ_API_URL}?action=listPaginated&page=${page}&pageSize=${faqsPerPage}&sortBy=${sortBy}`);
    
    if (!response.ok) throw new Error('Failed to load FAQs');
    
    const data = await response.json();
    renderFAQs(data.faqs, filter);
    renderPagination(data.page, data.totalPages);
    
    loadingDiv.style.display = 'none';
    container.style.display = 'block';
    pagination.style.display = data.totalPages > 1 ? 'flex' : 'none';
  } catch (error) {
    console.error('Error loading FAQs:', error);
    loadingDiv.textContent = 'Fehler beim Laden der FAQs';
  }
}

function renderFAQs(faqs, filter) {
  const container = document.getElementById('faq-container');
  
  if (faqs.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Keine FAQs gefunden.</p>';
    return;
  }
  
  container.innerHTML = faqs.map(faq => {
    const isTopQuestion = filter === 'Am häufigsten genutzt';
    const topBadge = isTopQuestion ? '<span class="faq-top-badge">⭐ Top</span>' : '';
    
    return `
      <details class="faq-item">
        <summary class="faq-question">
          ${topBadge}
          ${faq.question}
        </summary>
        <div class="faq-answer">${faq.answer}</div>
      </details>
    `;
  }).join('');
  
  // Track view count when FAQ is opened
  container.querySelectorAll('.faq-item').forEach((item, index) => {
    item.addEventListener('toggle', async function() {
      if (this.open && faqs[index]) {
        await fetch(`${FAQ_API_URL}?action=incrementView&id=${faqs[index].id}`, { method: 'POST' });
      }
    });
  });
}

function renderPagination(currentPage, totalPages) {
  const pagination = document.getElementById('faq-pagination');
  
  let html = '';
  
  if (currentPage > 1) {
    html += `<button class="pagination-btn" onclick="changeFAQPage(${currentPage - 1})">← Zurück</button>`;
  }
  
  html += '<div class="pagination-numbers">';
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<span class="pagination-number active">${i}</span>`;
    } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<span class="pagination-number" onclick="changeFAQPage(${i})">${i}</span>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += '<span class="pagination-ellipsis">...</span>';
    }
  }
  html += '</div>';
  
  if (currentPage < totalPages) {
    html += `<button class="pagination-btn" onclick="changeFAQPage(${currentPage + 1})">Weiter →</button>`;
  }
  
  pagination.innerHTML = html;
}

function changeFAQPage(page) {
  currentFAQPage = page;
  loadFAQs(page, currentFilter);
  document.querySelector('.faq-section').scrollIntoView({ behavior: 'smooth' });
}

function filterFAQs() {
  const select = document.getElementById('faq-filter-select');
  currentFilter = select.value;
  currentFAQPage = 1;
  loadFAQs(1, currentFilter);
}

// Load FAQs on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    loadFAQs();
  });
} else {
  loadFAQs();
}
