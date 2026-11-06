(function () {
  'use strict';

  const STORAGE_KEY = 'dentiai-demo-v1';
  const now = new Date();
  const TODAY = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  const checklistItems = [
    { id: 'morning', title: 'Morning brushing', time: 'A fresh start' },
    { id: 'floss', title: 'Clean between teeth', time: 'Floss or another suitable aid' },
    { id: 'rinse', title: 'Mouthwash (optional)', time: 'If part of your routine' },
    { id: 'tongue', title: 'Tongue cleaning (optional)', time: 'Gentle daily care' },
    { id: 'evening', title: 'Evening brushing', time: 'Before bed' }
  ];
  const topics = [
    { id: 'Anatomy', title: 'A tour of tooth anatomy', text: 'A tooth has several parts working together. Enamel covers the crown, dentin lies underneath, and the pulp contains nerves and blood vessels. The root anchors the tooth in the jaw. This simplified overview is for learning only.', duration: '4 min', xp: 15 },
    { id: 'Pediatric care', title: 'Growing smiles: pediatric basics', text: 'Children’s oral care changes as they grow. A dental professional can offer age-appropriate advice about brushing, fluoride, and routine visits. A calm, positive approach can help children become familiar with oral care.', duration: '5 min', xp: 15 },
    { id: 'Gum health', title: 'Getting to know your gums', text: 'Gums support and surround the teeth. Gentle brushing along the gumline and cleaning between teeth are common daily habits. If you have concerns about bleeding, soreness, or changes, seek advice from a dental professional.', duration: '3 min', xp: 10 },
    { id: 'Cavities', title: 'Cavities and prevention basics', text: 'Tooth decay can happen when acids affect the tooth surface over time. Regular brushing with fluoride toothpaste, cleaning between teeth, and limiting frequent sugary snacks and drinks can support prevention. A dental professional can explain individual needs.', duration: '4 min', xp: 15 },
    { id: 'Orthodontics', title: 'An introduction to orthodontics', text: 'Orthodontic care focuses on how teeth and jaws line up. Braces and clear aligners are examples of appliances used in some care plans. Only a qualified dental professional can advise whether orthodontic care is suitable for a particular person.', duration: '4 min', xp: 15 }
  ];
  const anatomy = {
    Enamel: 'The hard, outer surface covering the visible crown of a tooth. It helps protect the layers beneath it.',
    Dentin: 'A layer beneath enamel that makes up much of the tooth. It surrounds and protects the inner pulp.',
    Pulp: 'The soft inner area containing nerves and blood vessels. This diagram is simplified and not to scale.',
    Root: 'The part of a tooth anchored in the jaw, beneath the gumline.',
    Gum: 'Soft tissue surrounding and supporting the teeth. The illustration does not show real anatomy in detail.'
  };
  const quizQuestions = [
    { topic: 'Daily care', question: 'Which habit is commonly recommended for cleaning between teeth?', answers: ['Once a day', 'Only once a month', 'Never'], correct: 0, explain: 'Many people are advised to clean between teeth daily; a dental professional can suggest what suits you.' },
    { topic: 'Anatomy', question: 'Which part forms the hard outer covering of the visible tooth?', answers: ['Pulp', 'Enamel', 'Root'], correct: 1, explain: 'Enamel is the hard outer covering of the crown.' },
    { topic: 'Gum health', question: 'What is a gentle way to support gum health?', answers: ['Brush gently along the gumline', 'Scrub as hard as possible', 'Skip cleaning between teeth'], correct: 0, explain: 'Gentle daily cleaning around teeth and along the gumline is a common oral-care habit.' },
    { topic: 'Cavities', question: 'Which product is commonly used to help protect teeth from decay?', answers: ['Fluoride toothpaste', 'Sugary drinks', 'Abrasive household cleaner'], correct: 0, explain: 'Fluoride toothpaste is commonly recommended for everyday brushing.' },
    { topic: 'Orthodontics', question: 'Who can advise whether orthodontic treatment may be suitable?', answers: ['A qualified dental professional', 'A quiz app', 'A sample clinic listing'], correct: 0, explain: 'A qualified dental professional can assess individual needs and discuss options.' }
  ];
  const flashcards = [
    { topic: 'Anatomy', front: 'What is enamel?', back: 'The hard outer covering of the visible crown of a tooth.' },
    { topic: 'Anatomy', front: 'What is the pulp?', back: 'The soft inner part of a tooth that contains nerves and blood vessels.' },
    { topic: 'Daily care', front: 'What can help clean between teeth?', back: 'Floss or another suitable interdental cleaning aid, as advised by a dental professional.' },
    { topic: 'Gum health', front: 'Name one gentle daily habit that supports gum health.', back: 'Brush gently along the gumline and clean between teeth.' },
    { topic: 'Orthodontics', front: 'What does orthodontic care focus on?', back: 'How teeth and jaws line up. Individual guidance comes from a qualified professional.' }
  ];
  const clinics = [
    { name: 'Willow Grove Dental Studio', area: 'Sample district, Cedar Lane', services: ['General dentistry', 'Preventive care'], hours: 'Sample hours: weekdays, 9:00–17:00', description: 'A fictional general dental practice for demonstrating directory cards.' },
    { name: 'Little Acorn Smile Centre', area: 'Sample district, Orchard Walk', services: ['Pediatric dentistry', 'Preventive care'], hours: 'Sample hours: weekdays, 8:30–16:30', description: 'A fictional child-focused sample listing. No real location or services are provided.' },
    { name: 'Align & Bloom Orthodontics', area: 'Sample district, Meadow Square', services: ['Orthodontics'], hours: 'Sample hours: Monday–Thursday, 10:00–18:00', description: 'A fictional orthodontic listing used to illustrate the interface.' },
    { name: 'Harborlight Dental Rooms', area: 'Sample district, Pebble Street', services: ['General dentistry', 'Preventive care'], hours: 'Sample hours: weekdays, 9:30–17:30', description: 'A fictional sample clinic card. It is not a real provider.' },
    { name: 'Maple Corner Family Smiles', area: 'Sample district, Paper Birch Way', services: ['General dentistry', 'Pediatric dentistry'], hours: 'Sample hours: weekdays, 8:00–16:00', description: 'A fictional family-oriented listing to demonstrate search and filtering.' },
    { name: 'Northstar Alignment Lab', area: 'Sample district, Lantern Row', services: ['Orthodontics'], hours: 'Sample hours: Tuesday–Saturday, 9:00–16:00', description: 'A fictional orthodontic sample. No appointments can be made.' }
  ];

  function defaultState() {
    return {
      entered: false,
      profile: { name: '', avatar: '☺' },
      lessons: [],
      checklist: { date: TODAY, done: [] },
      chat: [],
      quiz: { score: 0, answered: 0, misses: {} },
      preferences: { font: 'normal', contrast: false, motion: false, theme: 'light', language: 'en' },
      reminder: { enabled: false, time: '08:00' }
    };
  }

  let state = loadState();
  let accessMode = 'guest';
  let selectedLessonTopic = 'All topics';
  let selectedPart = 'Enamel';
  let selectedAnswer = null;
  let answerChecked = false;
  let quizIndex = 0;
  let cardIndex = 0;
  let cardIsFlipped = false;
  let quizFilter = 'All topics';
  let quizFinished = false;
  let detailedReplies = false;
  let replyTimer;
  let timerInterval;
  let elapsedSeconds = 0;
  let currentView = state.entered ? 'dashboard' : 'welcome';
  let toastTimer;

  const $ = function (selector, root) { return (root || document).querySelector(selector); };
  const $$ = function (selector, root) { return Array.from((root || document).querySelectorAll(selector)); };

  function loadState() {
    const initial = defaultState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initial;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== 'object') throw new Error('Invalid saved data');
      const merged = Object.assign(initial, saved);
      merged.profile = Object.assign(initial.profile, saved.profile || {});
      merged.preferences = Object.assign(initial.preferences, saved.preferences || {});
      merged.reminder = Object.assign(initial.reminder, saved.reminder || {});
      merged.quiz = Object.assign(initial.quiz, saved.quiz || {});
      if (!Array.isArray(merged.lessons)) merged.lessons = [];
      if (!Array.isArray(merged.chat)) merged.chat = [];
      merged.chat = merged.chat.filter(function (item) {
        return item && ['user', 'assistant'].includes(item.role) && typeof item.text === 'string';
      }).slice(-80);
      if (!merged.checklist || merged.checklist.date !== TODAY) merged.checklist = { date: TODAY, done: [] };
      if (!Array.isArray(merged.checklist.done)) merged.checklist.done = [];
      return merged;
    } catch (error) {
      setTimeout(function () { showToast('Saved demo data could not be read. You can continue with a fresh session.'); }, 0);
      return initial;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      showToast('This change could not be saved in this browser. The demo remains usable.');
      return false;
    }
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove('show'); }, 3200);
  }

  function setView(view) {
    if (view === 'dashboard' && !state.entered) view = 'welcome';
    const target = $('#view-' + view);
    if (!target) return;
    currentView = view;
    $$('.view').forEach(function (section) { section.hidden = section !== target; });
    $$('.nav-item[data-view]').forEach(function (button) {
      button.classList.toggle('active', button.dataset.view === view);
      if (button.dataset.view === view) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const nameMap = { welcome: 'Welcome', dashboard: 'Dashboard', learn: 'Learn', bot: 'DentiBot', quiz: 'Quiz & cards', planner: 'Care planner', clinics: 'Clinic finder', profile: 'Profile & access', feedback: 'Feedback' };
    $('#breadcrumb-current').textContent = nameMap[view] || 'Dashboard';
    $('#sidebar').classList.remove('open');
    $('#mobile-menu').setAttribute('aria-expanded', 'false');
    $('#main').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: state.preferences.motion ? 'auto' : 'smooth' });
    if (view === 'dashboard') renderDashboard();
  }

  function renderDashboard() {
    const name = state.profile.name.trim() || 'learner';
    $('#greeting-name').textContent = name;
    $('#mini-name').textContent = state.profile.name.trim() || 'Guest learner';
    $('#mini-avatar').textContent = state.profile.avatar || '☺';
    $('.top-avatar').textContent = state.profile.avatar || '☺';
    $('#stat-lessons').textContent = state.lessons.length;
    $('#stat-xp').textContent = state.lessons.reduce(function (total, id) {
      const lesson = topics.find(function (topic) { return topic.id === id; });
      return total + (lesson ? lesson.xp : 0);
    }, 0);
    $('#stat-care').textContent = state.checklist.done.length + ' / ' + checklistItems.length;
    $('#streak-count').textContent = state.lessons.length ? '1 day' : '0 days';
  }

  function initializeAccess() {
    const form = $('#access-form');
    $$('.access-tab').forEach(function (button) {
      button.addEventListener('click', function () {
        accessMode = button.dataset.access;
        $$('.access-tab').forEach(function (tab) {
          const selected = tab === button;
          tab.classList.toggle('selected', selected);
          tab.setAttribute('aria-pressed', String(selected));
        });
        const accessCopy = {
          guest: ['Continue as guest', 'Continue without a profile, or optionally add a display name.'],
          login: ['Continue with demo login', 'Simulated login only. No username, email, or password is requested.'],
          register: ['Create demo profile', 'Simulated registration only. No username, email, or password is requested.']
        };
        $('#access-submit').innerHTML = accessCopy[accessMode][0] + ' <span>→</span>';
        $('#display-name').setAttribute('aria-label', accessMode === 'guest' ? 'Optional guest display name' : 'Optional demo profile display name');
        $('#access-mode-note').textContent = accessCopy[accessMode][1];
        $('#access-feedback').textContent = '';
      });
    });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const name = $('#display-name').value.trim();
      if (name.length > 24) {
        $('#access-feedback').textContent = 'Please use 24 characters or fewer.';
        return;
      }
      state.profile.name = name;
      state.entered = true;
      saveState();
      setView('dashboard');
    });
  }

  function renderLessons() {
    const filter = $('#topic-filter');
    filter.replaceChildren();
    ['All topics'].concat(topics.map(function (topic) { return topic.id; })).forEach(function (topicName) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-chip' + (selectedLessonTopic === topicName ? ' selected' : '');
      button.textContent = topicName;
      button.setAttribute('aria-pressed', String(selectedLessonTopic === topicName));
      button.addEventListener('click', function () {
        selectedLessonTopic = topicName;
        renderLessons();
      });
      filter.appendChild(button);
    });
    const grid = $('#lesson-grid');
    grid.replaceChildren();
    topics.filter(function (topic) { return selectedLessonTopic === 'All topics' || topic.id === selectedLessonTopic; })
      .forEach(function (topic) {
        const card = document.createElement('article');
        const complete = state.lessons.includes(topic.id);
        card.className = 'lesson-card' + (complete ? ' completed' : '');
        const meta = document.createElement('span');
        meta.className = 'lesson-meta';
        meta.textContent = topic.id.toUpperCase() + ' · ' + topic.duration.toUpperCase();
        const heading = document.createElement('h3');
        heading.textContent = topic.title;
        const description = document.createElement('p');
        description.textContent = topic.text;
        const read = document.createElement('button');
        read.type = 'button';
        read.textContent = 'Read lesson →';
        read.addEventListener('click', function () { openLesson(topic); });
        const completeButton = document.createElement('button');
        completeButton.type = 'button';
        completeButton.textContent = complete ? '✓ Completed · ' + topic.xp + ' XP' : 'Mark lesson complete · +' + topic.xp + ' XP';
        completeButton.addEventListener('click', function () {
          if (!state.lessons.includes(topic.id)) {
            state.lessons.push(topic.id);
            saveState();
            renderLessons();
            renderDashboard();
            showToast('Lesson completed. +' + topic.xp + ' demo XP');
          } else {
            showToast('This lesson is already marked complete.');
          }
        });
        card.append(meta, heading, description, read, completeButton);
        grid.appendChild(card);
      });
  }

  function openLesson(topic) {
    const dialog = document.createElement('dialog');
    dialog.className = 'lesson-dialog';
    const closeForm = document.createElement('form');
    closeForm.method = 'dialog';
    const close = document.createElement('button');
    close.className = 'dialog-close';
    close.type = 'submit';
    close.setAttribute('aria-label', 'Close lesson');
    close.textContent = '×';
    closeForm.appendChild(close);
    const eyebrow = document.createElement('p');
    eyebrow.className = 'overline';
    eyebrow.textContent = topic.id + ' · ' + topic.duration;
    const title = document.createElement('h2');
    title.textContent = topic.title;
    const text = document.createElement('p');
    text.textContent = topic.text;
    const safety = document.createElement('p');
    safety.textContent = 'General education only. Ask a qualified dental professional about individual care.';
    const complete = document.createElement('button');
    complete.type = 'button';
    complete.className = 'button button-green';
    complete.textContent = state.lessons.includes(topic.id) ? 'Lesson completed ✓' : 'Mark complete · +' + topic.xp + ' XP';
    complete.addEventListener('click', function () {
      if (!state.lessons.includes(topic.id)) {
        state.lessons.push(topic.id);
        saveState();
        renderLessons();
        renderDashboard();
      }
      dialog.close();
      dialog.remove();
      showToast('Lesson saved in your demo progress.');
    });
    dialog.append(closeForm, eyebrow, title, text, safety, complete);
    document.body.appendChild(dialog);
    dialog.addEventListener('close', function () { dialog.remove(); });
    dialog.showModal();
  }

  function renderAnatomy() {
    const buttons = $('#anatomy-choices');
    buttons.replaceChildren();
    Object.keys(anatomy).forEach(function (part) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'anatomy-choice';
      button.textContent = part;
      button.setAttribute('aria-pressed', String(part === selectedPart));
      button.addEventListener('click', function () { selectAnatomyPart(part); });
      buttons.appendChild(button);
    });
    $$('.tooth-diagram path').forEach(function (path, index) {
      const part = ['Root', 'Dentin', 'Pulp', 'Enamel', 'Gum'][index];
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', 'Explore ' + part);
      path.addEventListener('click', function () { selectAnatomyPart(part); });
      path.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectAnatomyPart(part);
        }
      });
    });
    selectAnatomyPart(selectedPart);
  }

  function selectAnatomyPart(part) {
    selectedPart = part;
    $('#anatomy-details').replaceChildren();
    const title = document.createElement('strong');
    title.textContent = 'Tooth ' + part.toLowerCase();
    const description = document.createElement('p');
    description.textContent = anatomy[part];
    $('#anatomy-details').append(title, description);
    $$('.anatomy-choice').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.textContent === part));
    });
  }

  const botReplies = [
    { topic: 'Anatomy', match: /\b(enamel|dentin|dentine|pulp|root|anatomy|tooth part)\b/i, short: 'Enamel is the hard outer covering of a tooth’s crown. Beneath it is dentin, and the inner pulp contains nerves and blood vessels. This is a simplified educational overview.', detail: 'A tooth has several structures. Enamel covers the crown, the part usually visible above the gumline. Dentin lies beneath enamel and surrounds the pulp. The pulp is soft tissue containing nerves and blood vessels. A root anchors the tooth in the jaw. Tooth anatomy is more complex than this short description; ask a dental professional about individual concerns.' },
    { topic: 'Daily care', match: /\b(brush|brushing|toothbrush)\b/i, short: 'A common guideline is to brush twice a day for about two minutes with a soft-bristled brush and fluoride toothpaste. Use gentle strokes. Your dental professional can personalize advice.', detail: 'Many public oral-health resources suggest brushing twice daily for about two minutes with fluoride toothpaste and a soft-bristled toothbrush. Use gentle, thorough strokes across the tooth surfaces and along the gumline. Individual needs can vary, so ask a qualified dental professional for guidance suited to you.' },
    { topic: 'Daily care', match: /\b(floss|between teeth|interdental)\b/i, short: 'Cleaning between teeth daily can help reach spaces a toothbrush may miss. Use a gentle technique; a dental professional can suggest a suitable aid.', detail: 'Floss or another suitable interdental cleaning aid can help clean between teeth where a toothbrush may not reach. Gently guide the aid rather than snapping it into the gums. The right method depends on your mouth and dexterity, so a dental professional can demonstrate options.' },
    { topic: 'Gum health', match: /\b(gum|gums|gingiva)\b/i, short: 'Gentle brushing along the gumline and cleaning between teeth are common habits that support gum health. Ask a dental professional about any personal concerns.', detail: 'Gums are tissues that surround and support teeth. Daily brushing with gentle technique and cleaning between teeth are common oral-care habits. Changes such as ongoing bleeding or soreness need personal assessment; a chatbot demo cannot assess symptoms, so contact a dental professional for advice.' },
    { topic: 'Cavities', match: /\b(cavit|decay|fluoride|toothpaste)\b/i, short: 'Fluoride toothpaste, regular brushing, and cleaning between teeth are common parts of cavity prevention. A dental professional can advise about individual needs.', detail: 'Tooth decay can occur when acids damage tooth surfaces over time. Common preventive habits include brushing regularly with fluoride toothpaste, cleaning between teeth, and limiting frequent sugary snacks and drinks. Risk and recommendations differ, so a dental professional can discuss your personal situation.' },
    { topic: 'Pediatric care', match: /\b(child|children|baby|kid|pediatric|baby tooth)\b/i, short: 'Children’s oral-care needs change as they grow. A dental professional can offer age-appropriate advice about brushing, fluoride, and check-ups.', detail: 'Children benefit from oral-care guidance suited to their age and development. Caregivers can ask a dental professional about brushing help, fluoride use, first visits, and how to make routines comfortable. This demo cannot advise on an individual child’s care.' },
    { topic: 'Orthodontics', match: /\b(orthodont|braces|aligner|retainer)\b/i, short: 'Orthodontic care focuses on tooth and jaw alignment. A qualified dental professional can explain options and whether an assessment is appropriate.', detail: 'Orthodontic care may use braces or aligners to address tooth or jaw alignment. Treatment choices depend on an individual assessment and can only be discussed with a qualified dental professional. This demo cannot assess whether any treatment is suitable.' },
    { topic: 'Dental visits', match: /\b(dentist|dental visit|check.?up|appointment|clinic)\b/i, short: 'Routine visits give a dental professional a chance to check your oral health and answer questions. Suggested visit timing varies; ask your dental team.', detail: 'Dental visits can include an oral health check, preventive care, and a chance to discuss concerns. How often to visit depends on individual needs and local advice. Ask your dental team what schedule is appropriate for you.' }
  ];
  const botFallback = { topic: 'General', short: 'I can share general education about tooth anatomy, brushing, flossing, gum health, cavities, children’s oral care, orthodontics, and dental visits. Try one of those topics. For personal concerns, contact a dental professional.', detail: 'This prototype has no live AI or connected knowledge source. Its replies are a small set of prewritten educational examples about tooth anatomy, brushing, flossing, gum health, cavities, pediatric care, orthodontics, and dental visits. It cannot evaluate symptoms or provide diagnosis or treatment. Please contact a qualified dental professional for personal advice.' };

  function renderChat() {
    const log = $('#chat-log');
    log.replaceChildren();
    if (!state.chat.length) {
      appendChatMessage('assistant', 'Hello! I’m DentiBot, a demo with prewritten replies. Ask a general question about oral health. Please don’t share personal health information.', null);
    } else {
      state.chat.forEach(function (item, index) { appendChatMessage(item.role, item.text, index); });
    }
    log.scrollTop = log.scrollHeight;
  }

  function appendChatMessage(role, text, index) {
    const message = document.createElement('div');
    message.className = 'chat-message' + (role === 'user' ? ' user' : '');
    const label = document.createElement('span');
    label.className = 'chat-label';
    label.textContent = role === 'user' ? 'You' : 'DentiBot · Demo response';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    message.append(label, bubble);
    if (role === 'assistant' && index !== null) {
      const actions = document.createElement('div');
      actions.className = 'message-actions';
      [['copy', 'Copy'], ['speak', 'Listen'], ['quiz', 'Quiz']].forEach(function (action) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.chatAction = action[0];
        button.dataset.messageIndex = String(index);
        button.textContent = action[1];
        actions.appendChild(button);
      });
      message.appendChild(actions);
    }
    $('#chat-log').appendChild(message);
  }

  function submitChat(text) {
    const question = text.trim();
    if (!question) {
      $('#chat-status').textContent = 'Type a question before sending.';
      $('#chat-input').focus();
      return;
    }
    if (!$('#bot-typing').hidden) {
      $('#chat-status').textContent = 'Please wait for the current demo reply.';
      return;
    }
    $('#chat-status').textContent = '';
    state.chat.push({ role: 'user', text: question });
    saveState();
    $('#chat-input').value = '';
    $('#bot-typing').hidden = false;
    renderChat();
    replyTimer = window.setTimeout(function () {
      const found = botReplies.find(function (item) { return item.match.test(question); }) || botFallback;
      state.chat.push({ role: 'assistant', text: detailedReplies ? found.detail : found.short, topic: found.topic, short: found.short, detail: found.detail, detailed: detailedReplies });
      $('#bot-typing').hidden = true;
      saveState();
      renderChat();
      replyTimer = undefined;
    }, 400);
  }

  function initializeBot() {
    $('#chat-form').addEventListener('submit', function (event) { event.preventDefault(); submitChat($('#chat-input').value); });
    $$('[data-prompt]').forEach(function (button) {
      button.addEventListener('click', function () {
        setView('bot');
        submitChat(button.dataset.prompt);
      });
    });
    $('#clear-chat').addEventListener('click', function () {
      window.clearTimeout(replyTimer);
      state.chat = [];
      $('#bot-typing').hidden = true;
      $('#chat-status').textContent = 'Conversation cleared.';
      saveState();
      renderChat();
    });
    $('#chat-log').addEventListener('click', function (event) {
      const button = event.target.closest('[data-chat-action]');
      if (!button) return;
      const item = state.chat[Number(button.dataset.messageIndex)];
      if (!item || item.role !== 'assistant') return;
      $('#bot-action-status').textContent = '';
      if (button.dataset.chatAction === 'copy') copyText(item.text, $('#bot-action-status'));
      if (button.dataset.chatAction === 'speak') speakText(item.text, $('#bot-action-status'));
      if (button.dataset.chatAction === 'quiz') {
        const related = quizQuestions.find(function (question) { return question.topic === item.topic; });
        setView('quiz');
        if (related) setQuizFilter(related.topic);
        $('#quiz-mode-quiz').hidden = false;
        $('#quiz-mode-cards').hidden = true;
        showToast(related ? 'Quiz ready for ' + related.topic + '.' : 'Choose a topic for a related quiz.');
      }
    });
    $('#detail-toggle').addEventListener('click', function () {
      const last = state.chat.slice().reverse().find(function (item) { return item.role === 'assistant'; });
      if (!last || !last.detail) { $('#bot-action-status').textContent = 'Ask a question to try reply detail options.'; return; }
      last.detailed = !last.detailed;
      last.text = last.detailed ? last.detail : last.short;
      saveState();
      renderChat();
      $('#bot-action-status').textContent = last.detailed ? 'Showing a more detailed demo reply.' : 'Showing a shorter demo reply.';
    });
    $('#copy-answer').addEventListener('click', function () {
      const last = state.chat.slice().reverse().find(function (item) { return item.role === 'assistant'; });
      if (!last) { $('#bot-action-status').textContent = 'There is no reply to copy yet.'; return; }
      copyText(last.text, $('#bot-action-status'));
    });
    $('#speak-answer').addEventListener('click', function () {
      const last = state.chat.slice().reverse().find(function (item) { return item.role === 'assistant'; });
      if (!last) { $('#bot-action-status').textContent = 'There is no reply to read yet.'; return; }
      speakText(last.text, $('#bot-action-status'));
    });
    $('#make-chat-quiz').addEventListener('click', function () {
      const last = state.chat.slice().reverse().find(function (item) { return item.role === 'assistant'; });
      if (!last) { $('#bot-action-status').textContent = 'Ask a question first to choose a related quiz.'; return; }
      const related = quizQuestions.find(function (question) { return question.topic === last.topic; });
      setView('quiz');
      if (related) setQuizFilter(related.topic);
      $('#quiz-mode-quiz').hidden = false;
      $('#quiz-mode-cards').hidden = true;
    });
  }

  function copyText(text, status) {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      status.textContent = 'Copy is unavailable in this browser context.';
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      status.textContent = 'Reply copied.';
    }).catch(function () {
      status.textContent = 'Could not copy this reply. You can select and copy it manually.';
    });
  }

  function speakText(text, status) {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      status.textContent = 'Text-to-speech is not available in this browser.';
      return;
    }
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
      status.textContent = 'Reading the demo reply aloud.';
    } catch (error) {
      status.textContent = 'Could not start text-to-speech in this browser.';
    }
  }

  function setQuizFilter(topic) {
    quizFilter = topic;
    quizFinished = false;
    quizIndex = 0;
    selectedAnswer = null;
    answerChecked = false;
    $('#card-topic').value = topic;
    renderQuiz();
    renderFlashcard();
  }

  function filteredQuestions() {
    return quizQuestions.filter(function (item) { return quizFilter === 'All topics' || item.topic === quizFilter; });
  }

  function renderQuiz() {
    const questions = filteredQuestions();
    if (quizIndex >= questions.length) quizIndex = 0;
    const filter = $('#question-topic');
    filter.replaceChildren();
    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Choose quiz topic');
    ['All topics'].concat(Array.from(new Set(quizQuestions.map(function (item) { return item.topic; })))).forEach(function (topic) {
      const option = document.createElement('option');
      option.value = topic;
      option.textContent = topic;
      option.selected = quizFilter === topic;
      select.appendChild(option);
    });
    select.addEventListener('change', function () {
      quizFilter = select.value;
      quizIndex = 0;
      selectedAnswer = null;
      answerChecked = false;
      quizFinished = false;
      renderQuiz();
      renderFlashcard();
    });
    filter.appendChild(select);
    const current = questions[quizIndex];
    $('#answer-options').replaceChildren();
    $('#answer-feedback').textContent = '';
    if (!current) {
      $('#quiz-question').textContent = 'No questions are available for this topic yet.';
      $('#question-count').textContent = '0 questions';
      $('#quiz-progress').style.width = '0%';
      $('#quiz-next').textContent = 'Choose a topic';
      return;
    }
    $('#quiz-question').textContent = current.question;
    $('#question-count').textContent = 'Question ' + (quizIndex + 1) + ' of ' + questions.length;
    $('#quiz-progress').style.width = ((quizIndex / questions.length) * 100) + '%';
    current.answers.forEach(function (answer, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-option' + (selectedAnswer === index ? ' selected' : '');
      button.textContent = answer;
      button.setAttribute('aria-pressed', String(selectedAnswer === index));
      button.addEventListener('click', function () {
        if (answerChecked) return;
        selectedAnswer = index;
        $$('.answer-option').forEach(function (option, optionIndex) {
          option.classList.toggle('selected', optionIndex === index);
          option.setAttribute('aria-pressed', String(optionIndex === index));
        });
      });
      $('#answer-options').appendChild(button);
    });
    $('#quiz-score').textContent = 'Demo score: ' + state.quiz.score + ' / ' + state.quiz.answered;
    $('#quiz-next').textContent = answerChecked ? (quizIndex === questions.length - 1 ? 'Finish quiz' : 'Next question') : 'Check answer →';
    renderReviewTopics();
  }

  function renderReviewTopics() {
    const misses = Object.entries(state.quiz.misses || {}).filter(function (entry) { return entry[1] > 0; });
    $('#topics-to-review').textContent = misses.length
      ? misses.sort(function (a, b) { return b[1] - a[1]; }).map(function (entry) { return entry[0]; }).join(', ')
      : 'None yet';
  }

  function handleQuizAction() {
    const questions = filteredQuestions();
    if (quizFinished) {
      quizFinished = false;
      quizIndex = 0;
      selectedAnswer = null;
      answerChecked = false;
      renderQuiz();
      return;
    }
    const question = questions[quizIndex];
    if (!question) return;
    if (answerChecked) {
      if (quizIndex < questions.length - 1) {
        quizIndex += 1;
        selectedAnswer = null;
        answerChecked = false;
        renderQuiz();
      } else {
        quizFinished = true;
        selectedAnswer = null;
        answerChecked = false;
        $('#quiz-question').textContent = 'Quiz complete. You can replay or choose another topic.';
        $('#answer-options').replaceChildren();
        $('#answer-feedback').textContent = 'Your demo progress is saved in this browser.';
        $('#quiz-progress').style.width = '100%';
        $('#quiz-next').textContent = 'Replay quiz';
      }
      return;
    }
    if (selectedAnswer === null) {
      $('#answer-feedback').textContent = 'Choose an answer to continue.';
      return;
    }
    answerChecked = true;
    const correct = selectedAnswer === question.correct;
    state.quiz.answered += 1;
    if (correct) state.quiz.score += 1;
    else state.quiz.misses[question.topic] = (state.quiz.misses[question.topic] || 0) + 1;
    saveState();
    $$('.answer-option').forEach(function (button, index) {
      button.disabled = true;
      if (index === question.correct) button.classList.add('correct');
      else if (index === selectedAnswer) button.classList.add('incorrect');
    });
    $('#answer-feedback').textContent = (correct ? 'That’s right. ' : 'Not quite. ') + question.explain;
    renderQuiz();
    answerChecked = true;
    $$('.answer-option').forEach(function (button, index) {
      button.disabled = true;
      if (index === question.correct) button.classList.add('correct');
      else if (index === selectedAnswer) button.classList.add('incorrect');
    });
    $('#answer-feedback').textContent = (correct ? 'That’s right. ' : 'Not quite. ') + question.explain;
  }

  function renderFlashcard() {
    const filtered = flashcards.filter(function (card) { return quizFilter === 'All topics' || card.topic === quizFilter; });
    if (!filtered.length) {
      $('#flashcard-content').textContent = 'No cards for this topic yet.';
      $('#card-count').textContent = '0 cards';
      return;
    }
    if (cardIndex >= filtered.length) cardIndex = 0;
    const card = filtered[cardIndex];
    $('#card-count').textContent = 'Card ' + (cardIndex + 1) + ' of ' + filtered.length + ' · ' + card.topic;
    $('#flashcard-content').textContent = cardIsFlipped ? card.back : card.front;
    $('#flashcard').setAttribute('aria-pressed', String(cardIsFlipped));
    $('.flashcard-hint').textContent = cardIsFlipped ? 'ANSWER · TAP OR PRESS ENTER TO FLIP BACK' : 'QUESTION · TAP OR PRESS ENTER TO REVEAL';
  }

  function initializeQuiz() {
    $$('.quiz-tab').forEach(function (button) {
      button.addEventListener('click', function () {
        $$('.quiz-tab').forEach(function (tab) {
          const selected = tab === button;
          tab.classList.toggle('selected', selected);
          tab.setAttribute('aria-selected', String(selected));
        });
        const cards = button.dataset.quizMode === 'cards';
        $('#quiz-mode-quiz').hidden = cards;
        $('#quiz-mode-cards').hidden = !cards;
      });
    });
    $('#quiz-next').addEventListener('click', handleQuizAction);
    $('#flashcard').addEventListener('click', function () { cardIsFlipped = !cardIsFlipped; renderFlashcard(); });
    $('#card-next').addEventListener('click', function () {
      const filtered = flashcards.filter(function (card) { return quizFilter === 'All topics' || card.topic === quizFilter; });
      cardIndex = (cardIndex + 1) % Math.max(filtered.length, 1);
      cardIsFlipped = false;
      renderFlashcard();
    });
    const cardTopic = $('#card-topic');
    ['All topics'].concat(Array.from(new Set(flashcards.map(function (item) { return item.topic; })))).forEach(function (topic) {
      const option = document.createElement('option');
      option.value = topic;
      option.textContent = topic;
      cardTopic.appendChild(option);
    });
    cardTopic.addEventListener('change', function () {
      quizFilter = cardTopic.value;
      cardIndex = 0;
      cardIsFlipped = false;
      quizIndex = 0;
      selectedAnswer = null;
      answerChecked = false;
      quizFinished = false;
      renderQuiz();
      renderFlashcard();
    });
    renderQuiz();
    renderFlashcard();
  }

  function renderPlanner() {
    $('#today-label').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    const checklist = $('#checklist');
    checklist.replaceChildren();
    checklistItems.forEach(function (item) {
      const label = document.createElement('label');
      label.className = 'check-item';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = state.checklist.done.includes(item.id);
      checkbox.setAttribute('aria-label', item.title);
      checkbox.addEventListener('change', function () {
        if (checkbox.checked && !state.checklist.done.includes(item.id)) state.checklist.done.push(item.id);
        if (!checkbox.checked) state.checklist.done = state.checklist.done.filter(function (id) { return id !== item.id; });
        saveState();
        renderPlanner();
        renderDashboard();
      });
      const title = document.createElement('span');
      title.textContent = item.title;
      const time = document.createElement('small');
      time.textContent = item.time;
      label.append(checkbox, title, time);
      checklist.appendChild(label);
    });
    const percent = Math.round((state.checklist.done.length / checklistItems.length) * 100);
    $('#completion-value').textContent = percent + '%';
    $('#planner-progress').style.width = percent + '%';
    $('#planner-summary').textContent = state.checklist.done.length + ' of ' + checklistItems.length + ' activities complete';
    $('#reminder-enabled').checked = state.reminder.enabled;
    $('#reminder-time').value = state.reminder.time || '08:00';
  }

  function updateTimer() {
    const remaining = Math.max(0, 120 - elapsedSeconds);
    const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
    const seconds = String(remaining % 60).padStart(2, '0');
    $('#timer-display').textContent = minutes + ':' + seconds;
    $('#timer-display').setAttribute('aria-label', minutes + ' minutes and ' + seconds + ' seconds remaining');
    const activeQuadrant = Math.min(Math.floor(elapsedSeconds / 30), 3);
    $$('.quadrant').forEach(function (element, index) {
      element.classList.toggle('active', elapsedSeconds < 120 && index === activeQuadrant);
      element.classList.toggle('complete', elapsedSeconds >= (index + 1) * 30);
    });
    if (elapsedSeconds >= 120) {
      window.clearInterval(timerInterval);
      timerInterval = undefined;
      $('#timer-toggle').textContent = 'Start again';
      $('#timer-status').textContent = 'Two minutes complete. Timer ended; no sound was played.';
      return;
    }
    $('#timer-toggle').textContent = timerInterval ? 'Pause timer' : (elapsedSeconds ? 'Resume timer' : 'Start timer');
  }

  function initializePlanner() {
    $('#timer-toggle').addEventListener('click', function () {
      if (timerInterval) {
        window.clearInterval(timerInterval);
        timerInterval = undefined;
        $('#timer-status').textContent = 'Timer paused. Select resume when ready.';
      } else {
        if (elapsedSeconds >= 120) elapsedSeconds = 0;
        timerInterval = window.setInterval(function () {
          elapsedSeconds += 1;
          updateTimer();
        }, 1000);
        $('#timer-status').textContent = 'Timer running. Move to the next quadrant every 30 seconds.';
      }
      updateTimer();
    });
    $('#timer-reset').addEventListener('click', function () {
      window.clearInterval(timerInterval);
      timerInterval = undefined;
      elapsedSeconds = 0;
      updateTimer();
      $('#timer-status').textContent = 'Timer reset. Visual timer only; no sound will play.';
    });
    $('#reminder-enabled').addEventListener('change', function () {
      state.reminder.enabled = $('#reminder-enabled').checked;
      saveState();
      $('#reminder-status').textContent = state.reminder.enabled ? 'Demo preference saved; this will not send a notification.' : 'Demo reminder preference is off.';
    });
    $('#reminder-time').addEventListener('change', function () {
      state.reminder.time = $('#reminder-time').value || '08:00';
      saveState();
      $('#reminder-status').textContent = 'Demo reminder time saved; no notification will be sent.';
    });
    renderPlanner();
    updateTimer();
  }

  function renderClinics() {
    const query = $('#clinic-query').value.trim().toLowerCase();
    const service = $('#clinic-service').value;
    const results = clinics.filter(function (clinic) {
      const haystack = clinic.name + ' ' + clinic.area + ' ' + clinic.services.join(' ');
      return haystack.toLowerCase().includes(query) && (!service || clinic.services.includes(service));
    });
    $('#clinic-grid').replaceChildren();
    $('#clinic-count').textContent = results.length + ' fictional sample listing' + (results.length === 1 ? '' : 's');
    if (!results.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No sample listings match those filters. Try another search or choose all services.';
      $('#clinic-grid').appendChild(empty);
      return;
    }
    results.forEach(function (clinic) {
      const card = document.createElement('article');
      card.className = 'clinic-card';
      const type = document.createElement('span');
      type.className = 'clinic-type';
      type.textContent = 'FICTIONAL SAMPLE';
      const title = document.createElement('h3');
      title.textContent = clinic.name;
      const area = document.createElement('p');
      area.textContent = clinic.area;
      const services = document.createElement('p');
      services.className = 'clinic-services';
      services.textContent = clinic.services.join(' · ');
      const hours = document.createElement('p');
      hours.textContent = clinic.hours;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'View sample details →';
      button.addEventListener('click', function () { showClinicDetails(clinic); });
      card.append(type, title, area, services, hours, button);
      $('#clinic-grid').appendChild(card);
    });
  }

  function showClinicDetails(clinic) {
    $('#clinic-dialog-title').textContent = clinic.name;
    $('#clinic-dialog-content').replaceChildren();
    [clinic.description, clinic.area, 'Sample services: ' + clinic.services.join(', '), clinic.hours, 'Sample contact and navigation are not connected.'].forEach(function (text) {
      const p = document.createElement('p');
      p.textContent = text;
      $('#clinic-dialog-content').appendChild(p);
    });
    const dialog = $('#clinic-dialog');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else showToast(clinic.description);
  }

  function initializeProfile() {
    $('#profile-name').value = state.profile.name;
    $('#font-size').value = state.preferences.font;
    $('#high-contrast').checked = state.preferences.contrast;
    $('#reduce-motion').checked = state.preferences.motion;
    $('#theme-choice').value = state.preferences.theme;
    $('#language-choice').value = state.preferences.language;
    $$('.avatar-options button').forEach(function (button) {
      const selected = button.dataset.avatar === state.profile.avatar;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    applyPreferences();
    $('#profile-name').addEventListener('input', function () {
      state.profile.name = $('#profile-name').value.trim().slice(0, 24);
      saveState();
      renderDashboard();
      $('#profile-status').textContent = 'Display name saved locally.';
    });
    $$('.avatar-options button').forEach(function (button) {
      button.addEventListener('click', function () {
        state.profile.avatar = button.dataset.avatar;
        $$('.avatar-options button').forEach(function (item) {
          item.classList.toggle('selected', item === button);
          item.setAttribute('aria-pressed', String(item === button));
        });
        saveState();
        renderDashboard();
        $('#profile-status').textContent = 'Avatar preference saved.';
      });
    });
    $('#font-size').addEventListener('change', function () { state.preferences.font = $('#font-size').value; updatePreferences(); });
    $('#high-contrast').addEventListener('change', function () { state.preferences.contrast = $('#high-contrast').checked; updatePreferences(); });
    $('#reduce-motion').addEventListener('change', function () { state.preferences.motion = $('#reduce-motion').checked; updatePreferences(); });
    $('#theme-choice').addEventListener('change', function () { state.preferences.theme = $('#theme-choice').value; updatePreferences(); });
    $('#language-choice').addEventListener('change', function () { state.preferences.language = $('#language-choice').value; updatePreferences(); });
    $('#reset-settings').addEventListener('click', function () {
      state.preferences = defaultState().preferences;
      state.profile.avatar = '☺';
      saveState();
      initializeProfileControls();
      renderDashboard();
      $('#privacy-status').textContent = 'Preferences reset to defaults.';
    });
    $('#clear-data').addEventListener('click', function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (error) { showToast('Browser storage could not be cleared.'); return; }
      state = defaultState();
      currentView = 'welcome';
      quizFinished = false;
      quizIndex = 0;
      selectedAnswer = null;
      answerChecked = false;
      cardIndex = 0;
      cardIsFlipped = false;
      applyPreferences();
      initializeProfileControls();
      renderDashboard();
      renderPlanner();
      renderChat();
      renderLessons();
      renderQuiz();
      renderFlashcard();
      $('#privacy-status').textContent = 'All DentiAI demo data has been cleared from this browser.';
      showToast('Demo data cleared. Continue as guest to start again.');
      setView('welcome');
    });
  }

  function initializeProfileControls() {
    $('#profile-name').value = state.profile.name;
    $('#font-size').value = state.preferences.font;
    $('#high-contrast').checked = state.preferences.contrast;
    $('#reduce-motion').checked = state.preferences.motion;
    $('#theme-choice').value = state.preferences.theme;
    $('#language-choice').value = state.preferences.language;
    $$('.avatar-options button').forEach(function (button) {
      const selected = button.dataset.avatar === state.profile.avatar;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function applyPreferences() {
    document.body.classList.toggle('font-large', state.preferences.font === 'large');
    document.body.classList.toggle('font-larger', state.preferences.font === 'larger');
    document.body.classList.toggle('high-contrast', Boolean(state.preferences.contrast));
    document.body.classList.toggle('reduce-motion', Boolean(state.preferences.motion));
    document.body.classList.toggle('dark-theme', state.preferences.theme === 'dark');
    document.documentElement.lang = state.preferences.language === 'en' ? 'en' : 'en';
  }

  function updatePreferences() {
    applyPreferences();
    saveState();
    $('#profile-status').textContent = 'Accessibility preference saved on this device.';
  }

  function initializeFeedback() {
    $('#feedback-form').addEventListener('submit', function (event) {
      event.preventDefault();
      const rating = $('input[name="rating"]:checked');
      if (!rating) {
        $('#feedback-status').textContent = 'Choose a rating before submitting.';
        return;
      }
      if (!$('#feedback-type').value || !$('#feedback-message').value.trim()) {
        $('#feedback-status').textContent = 'Choose a feedback type and enter a short message.';
        return;
      }
      $('#feedback-status').textContent = 'Thank you. This demo submission was not sent or stored.';
      $('#feedback-form').reset();
      showToast('Thanks for trying the feedback demo.');
    });
  }

  function initializeNavigation() {
    document.addEventListener('click', function (event) {
      const target = event.target.closest('[data-view]');
      if (!target) return;
      event.preventDefault();
      setView(target.dataset.view);
    });
    $('#mobile-menu').addEventListener('click', function () {
      const opened = $('#sidebar').classList.toggle('open');
      $('#mobile-menu').setAttribute('aria-expanded', String(opened));
      $('#mobile-menu').setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
    });
    $('.banner-dismiss').addEventListener('click', function () {
      $('.safety-banner').hidden = true;
    });
    $('#clinic-query').addEventListener('input', renderClinics);
    $('#clinic-service').addEventListener('change', renderClinics);
    $('#close-clinic-dialog').addEventListener('click', function () { $('#clinic-dialog').close(); });
  }

  initializeAccess();
  initializeNavigation();
  initializeBot();
  initializeQuiz();
  initializePlanner();
  initializeProfile();
  initializeFeedback();
  renderLessons();
  renderAnatomy();
  renderChat();
  renderClinics();
  renderDashboard();
  updateTimer();
  if (state.entered) {
    $('#display-name').value = state.profile.name;
    setView(currentView);
  } else {
    setView('welcome');
  }
}());
