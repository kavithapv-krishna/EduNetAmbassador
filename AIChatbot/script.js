(function () {
  'use strict';

  const storageKey = 'brightbite-demo-conversation';
  const messagesElement = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const feedback = document.getElementById('chat-feedback');
  const typingIndicator = document.getElementById('typing-indicator');
  const clearButton = document.getElementById('clear-chat');
  const nav = document.getElementById('primary-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  let conversation = loadConversation();
  let replyTimer;

  const replies = [
    {
      match: /\b(brush|toothbrush|brushing)\b/i,
      text: 'A common guideline is to brush twice a day for about two minutes with a soft-bristled toothbrush and fluoride toothpaste. Use gentle strokes and try to reach every surface. A dental professional can suggest what is right for you.'
    },
    {
      match: /\b(floss|between|interdental)\b/i,
      text: 'Cleaning between your teeth once a day can help remove plaque where a toothbrush may not reach. Guide floss gently along each tooth rather than snapping it into the gums. Interdental brushes may suit some spaces; a dental professional can help you choose.'
    },
    {
      match: /\b(gum|gums|gingiva)\b/i,
      text: 'Gentle daily brushing and cleaning between teeth support gum health. If your gums bleed, feel sore, or concern you, please ask a dental professional for individual advice rather than relying on this demo.'
    },
    {
      match: /\b(cavit|decay|fluoride|toothpaste)\b/i,
      text: 'Tooth decay can develop when acids damage tooth surfaces over time. Regular brushing with fluoride toothpaste, cleaning between teeth, and limiting frequent sugary snacks and drinks can support prevention. A dental professional can answer questions about your own risk.'
    },
    {
      match: /\b(dentist|dental visit|check.?up|appointment|professional)\b/i,
      text: 'Dental visits give a dental professional a chance to check your oral health, answer questions, and discuss care that fits your needs. How often to visit can vary from person to person, so ask your dental team what schedule they recommend.'
    },
    {
      match: /\b(bad breath|breath|mouthwash|tongue)\b/i,
      text: 'Brushing your teeth and tongue, cleaning between teeth, and drinking water are common parts of fresh-breath care. Persistent concerns can have different causes, so a dental professional can help you work out what to do.'
    }
  ];

  function loadConversation() {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (message) {
        return message && (message.role === 'user' || message.role === 'assistant') &&
          typeof message.text === 'string';
      }).slice(-100);
    } catch (error) {
      announceStorageIssue('Saved chat could not be loaded. You can still use the demo.');
      return [];
    }
  }

  function saveConversation() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(conversation));
      return true;
    } catch (error) {
      announceStorageIssue('This chat could not be saved in this browser.');
      return false;
    }
  }

  function announceStorageIssue(message) {
    if (feedback) feedback.textContent = message;
  }

  function appendMessage(role, text) {
    const item = document.createElement('div');
    item.className = 'message message-' + role;

    const label = document.createElement('span');
    label.className = 'message-label';
    label.textContent = role === 'user' ? 'You' : 'BrightBite guide · Demo reply';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;

    item.appendChild(label);
    item.appendChild(bubble);
    messagesElement.appendChild(item);
  }

  function renderConversation() {
    messagesElement.replaceChildren();
    if (conversation.length === 0) {
      appendMessage('assistant', 'Hi! I’m the BrightBite guide. Ask me a general question about brushing, flossing, gums, cavities, or dental visits. My replies are educational examples, not personal dental advice.');
    } else {
      conversation.forEach(function (message) {
        appendMessage(message.role, message.text);
      });
    }
    messagesElement.scrollTop = messagesElement.scrollHeight;
  }

  function getReply(question) {
    const matchingReply = replies.find(function (item) {
      return item.match.test(question);
    });
    if (matchingReply) return matchingReply.text;
    return 'I can share general educational information about brushing, flossing, gum health, cavities, and dental visits. Try asking about one of those topics. I can’t assess symptoms or provide a diagnosis; please contact a dental professional for personal advice.';
  }

  function submitMessage(text) {
    const message = text.trim();
    if (!message) {
      feedback.textContent = 'Type a question before sending.';
      input.focus();
      return;
    }
    if (replyTimer) window.clearTimeout(replyTimer);

    feedback.textContent = '';
    conversation.push({ role: 'user', text: message });
    appendMessage('user', message);
    saveConversation();
    input.value = '';
    typingIndicator.hidden = false;
    messagesElement.scrollTop = messagesElement.scrollHeight;

    replyTimer = window.setTimeout(function () {
      conversation.push({ role: 'assistant', text: getReply(message) });
      appendMessage('assistant', conversation[conversation.length - 1].text);
      typingIndicator.hidden = true;
      saveConversation();
      messagesElement.scrollTop = messagesElement.scrollHeight;
      replyTimer = undefined;
    }, 550);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    submitMessage(input.value);
  });

  document.querySelectorAll('[data-prompt]').forEach(function (button) {
    button.addEventListener('click', function () {
      const prompt = button.getAttribute('data-prompt');
      if (!prompt) return;
      input.value = prompt;
      submitMessage(prompt);
      document.getElementById('chat').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  clearButton.addEventListener('click', function () {
    if (replyTimer) {
      window.clearTimeout(replyTimer);
      replyTimer = undefined;
    }
    conversation = [];
    typingIndicator.hidden = true;
    feedback.textContent = '';
    try {
      window.localStorage.removeItem(storageKey);
    } catch (error) {
      announceStorageIssue('Chat cleared for this page, but saved chat could not be removed.');
    }
    renderConversation();
    clearButton.focus();
  });

  menuToggle.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  const observedSections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          nav.querySelectorAll('[data-nav]').forEach(function (link) {
            if (link.getAttribute('data-nav') === entry.target.id) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    observedSections.forEach(function (section) { observer.observe(section); });
  }

  renderConversation();
}());
