const faqSearch = document.querySelector('[data-faq-search]');

if (faqSearch) {
  const headerForm = document.querySelector('.header-search');
  const sectionForm = document.querySelector('.section-search');
  const headerInput = document.querySelector('[data-header-search-input]');
  const sectionInput = document.querySelector('[data-section-search-input]');
  const headerClear = document.querySelector('[data-header-search-clear]');
  const sectionClear = document.querySelector('[data-section-search-clear]');
  const homeLink = document.querySelector('[data-home-link]');
  const status = faqSearch.querySelector('[data-search-status]');
  const results = faqSearch.querySelector('[data-search-results]');
  const stopWords = new Set(['a', 'an', 'and', 'are', 'can', 'do', 'does', 'for', 'how', 'i', 'in', 'is', 'it', 'my', 'of', 'on', 'the', 'to', 'what', 'where', 'will']);
  let faqs = window.locustFaqs || [];
  let query = new URLSearchParams(window.location.search).get('q')?.trim() || '';
  let searchSource = query ? 'header' : '';

  if (query) {
    headerInput.value = query;
    sectionInput.value = query;
  }

  const normalize = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  const tokensFor = (value) => normalize(value)
    .split(' ')
    .filter((token) => token.length > 1 && !stopWords.has(token));

  const contentOrder = (a, b) =>
    (Number(b.importance) || 0) - (Number(a.importance) || 0)
    || (Number(a.order) || 999) - (Number(b.order) || 999);

  const sentenceCount = (value) => {
    const sentences = String(value || '').match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    return sentences ? sentences.filter((sentence) => sentence.trim()).length : 0;
  };

  const scoreFaq = (faq, rawQuery) => {
    const normalizedQuery = normalize(rawQuery);
    const queryTokens = tokensFor(rawQuery);
    const question = normalize(faq.question);
    const answer = normalize(faq.answer || '');
    const keywords = (faq.keywords || []).map(normalize);
    let score = 0;

    if (question.includes(normalizedQuery)) score += 30;
    if (keywords.some((keyword) => keyword === normalizedQuery)) score += 45;
    if (keywords.some((keyword) => keyword.includes(normalizedQuery) || normalizedQuery.includes(keyword))) score += 24;

    queryTokens.forEach((token) => {
      if (keywords.some((keyword) => keyword.split(' ').includes(token))) score += 12;
      if (question.split(' ').includes(token)) score += 7;
      if (answer.split(' ').includes(token)) score += 2;
      if (keywords.some((keyword) => keyword.startsWith(token))) score += 4;
    });

    return score;
  };

  const appendAnswer = (container, faq) => {
    const answer = document.createElement('p');
    if (faq.answer) {
      answer.textContent = faq.answer;
    } else {
      answer.className = 'answer-pending';
      answer.textContent = 'Answer coming soon. Contact support if you need help now.';
    }
    container.append(answer);

    if (faq.steps?.length) {
      const list = document.createElement('ol');
      list.className = 'faq-steps';
      faq.steps.forEach((step) => {
        const item = document.createElement('li');
        const url = String(step).match(/https:\/\/[^\s]+/);
        if (url) {
          item.append(document.createTextNode(String(step).replace(url[0], '')));
          const link = document.createElement('a');
          link.href = url[0].replace(/[.,]$/, '');
          link.textContent = 'open password recovery';
          item.append(link);
        } else {
          item.textContent = step;
        }
        list.append(item);
      });
      container.append(list);
    }

    if (faq.tip) {
      const tip = document.createElement('p');
      tip.className = 'note faq-tip';
      tip.textContent = faq.tip;
      container.append(tip);
    }

    if (!faq.answer) {
      const supportLink = document.createElement('a');
      supportLink.className = 'text-link';
      supportLink.href = 'faq/contact-support.html';
      supportLink.textContent = 'Contact support →';
      container.append(supportLink);
    }

    if (faq.id === 'download-app' || faq.question === 'Where can I download the app?') {
      const stores = document.createElement('div');
      stores.className = 'store-badges faq-store-badges';
      stores.innerHTML = `
        <a class="store-badge" href="https://apps.apple.com/us/app/locust-metro/id6757508541" aria-label="Download Locust on the App Store">
          <img src="images/download-on-the-app-store.svg" alt="Download on the App Store">
        </a>
        <a class="store-badge store-badge-google" href="https://play.google.com/store/apps/details?id=com.lightcubesolutions.locustmobile" aria-label="Get Locust on Google Play">
          <img src="images/get-it-on-google-play.png" alt="Get it on Google Play">
        </a>`;
      container.append(stores);
    } else if (faq.url && (
      sentenceCount(faq.answer) > 4
      || faq.id === 'find-mfs'
      || faq.id === 'contact-help'
      || faq.question.startsWith('How do I find the meeting for field service')
      || faq.question.startsWith('Who should I contact for help')
    )) {
      const link = document.createElement('a');
      link.className = 'button';
      link.href = faq.url;
      link.textContent = `${faq.linkLabel || 'View guide'} →`;
      container.append(link);
    }
  };

  const createSearchResult = (faq) => {
    const article = document.createElement('article');
    article.className = 'search-result';
    const heading = document.createElement('h3');
    heading.textContent = faq.question;
    article.append(heading);
    appendAnswer(article, faq);
    return article;
  };

  const createAccordionItem = (faq) => {
    const details = document.createElement('details');
    details.className = 'faq-accordion-item';
    const summary = document.createElement('summary');
    const question = document.createElement('span');
    question.textContent = faq.question;
    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.setAttribute('aria-hidden', 'true');
    summary.append(question, icon);
    const panel = document.createElement('div');
    panel.className = 'faq-accordion-panel';
    appendAnswer(panel, faq);
    details.append(summary, panel);
    return details;
  };

  const clearSearch = ({ focus, smooth = false } = {}) => {
    query = '';
    searchSource = '';
    headerInput.value = '';
    sectionInput.value = '';
    render();
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    if (focus === 'header') headerInput.focus();
    if (focus === 'section') sectionInput.focus();
  };

  const render = () => {
    const searching = Boolean(query);
    document.body.classList.toggle('search-mode', searching);
    document.body.classList.toggle('search-source-header', searching && searchSource === 'header');
    document.body.classList.toggle('search-source-section', searching && searchSource === 'section');
    headerClear.hidden = !(searching && searchSource === 'header');
    sectionClear.hidden = !(searching && searchSource === 'section');
    results.replaceChildren();

    if (!searching) {
      const orderedFaqs = [...faqs].sort(contentOrder);
      status.textContent = `Browse ${orderedFaqs.length} frequently asked questions`;
      const accordion = document.createElement('div');
      accordion.className = 'faq-accordion';
      orderedFaqs.forEach((faq) => accordion.append(createAccordionItem(faq)));
      results.append(accordion);
      return;
    }

    const matches = faqs
      .map((faq) => ({ faq, score: scoreFaq(faq, query) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || contentOrder(a.faq, b.faq))
      .map((item) => item.faq);

    if (!matches.length) {
      status.textContent = `No FAQs found for “${query}”.`;
      const empty = document.createElement('div');
      empty.className = 'search-empty';
      empty.innerHTML = '<h3>Try another keyword</h3><p>Try a shorter term such as “shift,” “location,” “password,” or “video.”</p><a class="button" href="faq/contact-support.html">Contact support →</a>';
      results.append(empty);
      return;
    }

    status.textContent = `${matches.length} ${matches.length === 1 ? 'result' : 'results'} for “${query}”`;
    matches.forEach((faq) => results.append(createSearchResult(faq)));
  };

  const updateFrom = (source, value) => {
    const wasSearching = Boolean(query);
    query = value.trim();
    searchSource = query ? source : '';
    headerInput.value = value;
    sectionInput.value = value;
    render();
    if (query && !wasSearching && source === 'header') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  headerForm.addEventListener('submit', (event) => event.preventDefault());
  sectionForm.addEventListener('submit', (event) => event.preventDefault());
  headerInput.addEventListener('input', () => updateFrom('header', headerInput.value));
  sectionInput.addEventListener('input', () => updateFrom('section', sectionInput.value));
  headerClear.addEventListener('click', () => clearSearch({ focus: 'header' }));
  sectionClear.addEventListener('click', () => clearSearch({ focus: 'section' }));
  homeLink.addEventListener('click', (event) => {
    if (!query) return;
    event.preventDefault();
    clearSearch({ smooth: true });
  });

  if (faqs.length) render();

  if (window.location.protocol !== 'file:') {
    fetch('data/faqs.json')
      .then((response) => {
        if (!response.ok) throw new Error(`FAQ request failed with ${response.status}`);
        return response.json();
      })
      .then((data) => {
        faqs = data;
        render();
      })
      .catch(() => {
        if (faqs.length) return;
        status.textContent = 'The FAQs could not be loaded.';
        status.classList.add('search-error');
      });
  }
}
