(() => {
  const header = document.querySelector('.header-inner');
  if (!header) return;

  const inFaqFolder = window.location.pathname.includes('/faq/');
  const home = inFaqFolder ? '../index.html' : 'index.html';
  const faq = inFaqFolder ? '' : 'faq/';
  const tutorials = [
    ['How to find a location', `${home}#find-location`],
    ['How to find a service meeting', `${home}#find-meeting`],
    ['How to manage my locations', `${home}#manage-location`],
    ['How to view all my shifts', `${faq}view-all-shifts.html`],
    ['How to set time away', `${faq}set-time-away.html`],
    ['How to change availability', `${faq}change-availability.html`]
  ];

  const menu = document.createElement('details');
  menu.className = 'tutorial-menu';
  const summary = document.createElement('summary');
  summary.setAttribute('aria-label', 'Open video tutorials menu');
  summary.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  const links = document.createElement('nav');
  links.className = 'tutorial-menu-links';
  links.setAttribute('aria-label', 'Video tutorials');

  tutorials.forEach(([label, href]) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    links.append(link);
  });

  menu.append(summary, links);

  if (!header.querySelector('.header-search')) {
    const search = document.createElement('form');
    search.className = 'header-search secondary-header-search';
    search.setAttribute('role', 'search');
    search.innerHTML = `
      <label class="visually-hidden" for="secondary-faq-search">Search frequently asked questions</label>
      <div class="search-control">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
          <path d="m21 21-4.35-4.35m2.35-5.15A7.5 7.5 0 1 1 4 11.5a7.5 7.5 0 0 1 15 0Z"></path>
        </svg>
        <input id="secondary-faq-search" name="q" type="search" placeholder="Search FAQs" autocomplete="off">
        <button type="button" class="search-clear" hidden>Clear</button>
      </div>`;

    const searchPanel = document.createElement('section');
    searchPanel.className = 'page-faq-results';
    searchPanel.hidden = true;
    searchPanel.innerHTML = `
      <div class="shell narrow">
        <p class="eyebrow">Search results</p>
        <h1>Frequently asked questions</h1>
        <p class="search-status" role="status" aria-live="polite"></p>
        <div class="search-results"></div>
      </div>`;
    document.querySelector('.site-header').insertAdjacentElement('afterend', searchPanel);

    const input = search.querySelector('input');
    const clearButton = search.querySelector('.search-clear');
    const status = searchPanel.querySelector('.search-status');
    const results = searchPanel.querySelector('.search-results');
    const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const renderSearch = () => {
      const query = normalize(input.value);
      results.replaceChildren();
      searchPanel.hidden = !query;
      clearButton.hidden = !query;
      document.body.classList.toggle('secondary-search-mode', Boolean(query));
      if (!query) return;

      const tokens = query.split(' ').filter((token) => token.length > 1);
      const matches = (window.locustFaqs || [])
        .map((faq) => {
          const question = normalize(faq.question);
          const answer = normalize(faq.answer);
          const keywords = normalize((faq.keywords || []).join(' '));
          const content = `${question} ${answer} ${keywords}`;
          const score = (question.includes(query) ? 30 : 0)
            + (keywords.includes(query) ? 20 : 0)
            + tokens.reduce((total, token) => total + (content.includes(token) ? 5 : 0), 0);
          return { faq, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || (b.faq.importance || 0) - (a.faq.importance || 0));

      status.textContent = matches.length
        ? `${matches.length} ${matches.length === 1 ? 'result' : 'results'} for “${input.value.trim()}”`
        : `No FAQs found for “${input.value.trim()}”.`;

      matches.forEach(({ faq }) => {
        const article = document.createElement('article');
        article.className = 'search-result';
        const heading = document.createElement('h2');
        heading.textContent = faq.question;
        const answer = document.createElement('p');
        answer.textContent = faq.answer || 'Answer coming soon. Contact support if you need help now.';
        if (!faq.answer) answer.className = 'answer-pending';
        article.append(heading, answer);
        if (faq.steps?.length) {
          const list = document.createElement('ol');
          list.className = 'faq-steps';
          faq.steps.forEach((step) => {
            const item = document.createElement('li');
            const url = String(step).match(/https:\/\/[^\s]+/);
            if (url) {
              item.append(document.createTextNode(String(step).replace(url[0], '')));
              const recoveryLink = document.createElement('a');
              recoveryLink.href = url[0].replace(/[.,]$/, '');
              recoveryLink.textContent = 'open password recovery';
              item.append(recoveryLink);
            } else {
              item.textContent = step;
            }
            list.append(item);
          });
          article.append(list);
        }
        if (faq.tip) {
          const tip = document.createElement('p');
          tip.className = 'note faq-tip';
          tip.textContent = faq.tip;
          article.append(tip);
        }
        if (!faq.answer) {
          const supportLink = document.createElement('a');
          supportLink.className = 'text-link';
          supportLink.href = inFaqFolder ? 'contact-support.html' : 'faq/contact-support.html';
          supportLink.textContent = 'Contact support →';
          article.append(supportLink);
        }
        const isMeetingVideo = faq.id === 'find-mfs'
          || faq.question.startsWith('How do I find the meeting for field service');
        if (faq.url && (!faq.url.startsWith('#') || isMeetingVideo)) {
          const link = document.createElement('a');
          link.className = 'button';
          link.href = isMeetingVideo
            ? `${home}#find-meeting`
            : (inFaqFolder ? faq.url.replace(/^faq\//, '') : faq.url);
          link.textContent = `${faq.linkLabel || 'View guide'} →`;
          article.append(link);
        }
        results.append(article);
      });
    };

    search.addEventListener('submit', (event) => {
      event.preventDefault();
      renderSearch();
    });
    input.addEventListener('input', renderSearch);
    clearButton.addEventListener('click', () => {
      input.value = '';
      renderSearch();
      input.focus();
    });
    header.append(search);
  }

  header.append(menu);

  menu.addEventListener('mouseenter', () => {
    if (window.matchMedia('(hover: hover)').matches) menu.open = true;
  });
  menu.addEventListener('mouseleave', () => {
    if (window.matchMedia('(hover: hover)').matches) menu.open = false;
  });
  menu.addEventListener('focusout', (event) => {
    if (!menu.contains(event.relatedTarget)) menu.open = false;
  });

  const openLinkedAccordion = () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (target?.matches('details')) target.open = true;
  };
  openLinkedAccordion();
  window.addEventListener('hashchange', openLinkedAccordion);
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="#"]');
    if (!link) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname) return;
    const target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
    if (!target?.matches('details')) return;
    target.open = true;
    if (window.location.hash === destination.hash) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  document.querySelectorAll('.video-frame video').forEach((video) => {
    const frame = video.closest('.video-frame');
    const videoSection = video.closest('.help-video-section');
    let button;
    const markVideoUnavailable = () => {
      const message = document.createElement('p');
      message.className = 'video-coming-soon';
      message.textContent = 'Video coming soon';
      frame.replaceWith(message);
      button?.remove();
      videoSection?.querySelector('.placeholder-copy')?.remove();
    };
    video.addEventListener('error', markVideoUnavailable, { once: true });
    if (video.error) {
      markVideoUnavailable();
      return;
    }

    button = document.createElement('button');
    button.className = 'button video-fullscreen-button';
    button.type = 'button';
    button.innerHTML = '<i class="fa-solid fa-expand" aria-hidden="true"></i><span>Open full screen</span>';
    button.addEventListener('click', async () => {
      try {
        if (video.requestFullscreen) {
          await video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      } catch (error) {
        button.querySelector('span').textContent = 'Full screen unavailable';
      }
    });
    frame.insertAdjacentElement('afterend', button);
  });
})();
