const supportDockScript = document.currentScript;

if (supportDockScript) {
  const siteRoot = new URL('../', supportDockScript.src);
  const contactUrl = new URL('faq/contact-support.html', siteRoot).href;
  const contactDataUrl = new URL('data/contact_persons.json', siteRoot).href;
  let dockData = window.locustContactData || null;

  const dock = document.createElement('nav');
  document.body.classList.add('has-support-dock');
  dock.className = 'support-dock';
  dock.setAttribute('aria-label', 'Support options');
  dock.innerHTML = `
    <a class="support-dock-contact" href="${contactUrl}">
      <i class="fa-solid fa-headset" aria-hidden="true"></i>
      <span>Contact Support</span>
    </a>
    <a class="support-dock-call" href="${contactUrl}" data-dock-call aria-label="Call support">
      <i class="fa-solid fa-phone" aria-hidden="true"></i>
    </a>
    <a class="support-dock-text" href="${contactUrl}" data-dock-text aria-label="Text support">
      <i class="fa-solid fa-comment-dots" aria-hidden="true"></i>
    </a>`;
  document.body.append(dock);

  const callAction = dock.querySelector('[data-dock-call]');
  const textAction = dock.querySelector('[data-dock-text]');

  const decodeEntities = (value) => value.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
  const timeToMinutes = (value) => {
    const [hours, minutes] = value.split(':').map(Number);
    return (hours * 60) + minutes;
  };
  const getSacramentoMinutes = (timezone) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    return (Number(values.hour) % 24 * 60) + Number(values.minute);
  };

  const updateDock = () => {
    if (!dockData) return;
    const now = getSacramentoMinutes(dockData.timezone);
    const isOpen = now >= timeToMinutes(dockData.opensAt) && now < timeToMinutes(dockData.closesAt);

    if (isOpen) {
      const phone = dockData.googleVoiceNumber.replace(/[^\d+]/g, '');
      callAction.href = `tel:${phone}`;
      callAction.setAttribute('aria-label', `Call support at ${dockData.googleVoiceNumber}`);
      callAction.title = 'Call Support';
      callAction.querySelector('i').className = 'fa-solid fa-phone';
      textAction.href = `sms:${phone}`;
      textAction.hidden = false;
      return;
    }

    const email = decodeEntities(dockData.supportEmail);
    callAction.href = `mailto:${email}`;
    callAction.setAttribute('aria-label', 'Email support');
    callAction.title = 'Email Support';
    callAction.querySelector('i').className = 'fa-solid fa-envelope';
    textAction.hidden = true;
  };

  if (dockData) updateDock();
  window.addEventListener('pageshow', updateDock);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') updateDock();
  });
  window.setInterval(updateDock, 60_000);

  if (window.location.protocol !== 'file:') {
    fetch(contactDataUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Support data request failed with ${response.status}`);
        return response.json();
      })
      .then((data) => {
        dockData = data;
        updateDock();
      })
      .catch(() => {});
  }
}
