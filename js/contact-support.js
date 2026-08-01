const supportSection = document.querySelector('[data-phone-support]');

if (supportSection) {
  const currentTime = document.querySelector('[data-current-time]');
  const status = document.querySelector('[data-availability-status]');
  const callSupport = document.querySelector('[data-call-support]');
  const emailLink = document.querySelector('[data-support-email]');
  const emailSetup = document.querySelector('[data-email-setup]');
  const overrideInput = document.querySelector('[data-time-override]');
  const applyOverride = document.querySelector('[data-apply-override]');
  const clearOverride = document.querySelector('[data-clear-override]');
  let contactData = window.locustContactData || null;
  let overrideTime = null;

  const minutesFromTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
  };

  const formatClock = (minutes) => {
    const hours24 = Math.floor(minutes / 60);
    const minutesPart = minutes % 60;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${String(minutesPart).padStart(2, '0')} ${period}`;
  };

  const getSacramentoNow = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: contactData.timezone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
    const minutes = (Number(values.hour) % 24 * 60) + Number(values.minute);
    return {
      minutes,
      display: `${values.weekday}, ${values.month} ${values.day} at ${formatClock(minutes)}`
    };
  };

  const getOverrideTime = () => {
    const [datePart, timePart] = overrideTime.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutesPart] = timePart.split(':').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(date);
    const minutes = (hours * 60) + minutesPart;
    return { minutes, display: `${dayName}, test time ${formatClock(minutes)}` };
  };

  const isPlaceholder = (value, placeholder) => !value || value.trim() === placeholder;
  const decodeEntities = (value) => value.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

  const renderEmail = () => {
    const email = decodeEntities(contactData.supportEmail.trim());
    const needsSetup = isPlaceholder(email, 'REPLACE_WITH_SUPPORT_EMAIL');
    emailLink.href = needsSetup ? 'mailto:REPLACE_WITH_SUPPORT_EMAIL' : `mailto:${email}`;
    emailSetup.hidden = !needsSetup;
  };

  const renderSupportLineCard = (closesAt) => {
    const number = contactData.googleVoiceNumber.trim();
    const needsSetup = isPlaceholder(number, 'REPLACE_WITH_GOOGLE_VOICE_NUMBER');
    const card = document.createElement('article');
    card.className = 'support-line-card';
    const copy = document.createElement('div');
    copy.innerHTML = `<h3>Google Voice phone support</h3><p>Available until ${formatClock(closesAt)} Pacific Time</p>`;
    card.append(copy);

    if (needsSetup) {
      const missing = document.createElement('div');
      missing.className = 'missing-phone';
      missing.innerHTML = '<div class="support-line-actions"><span class="button button-call-support" aria-disabled="true"><i class="fa-solid fa-phone" aria-hidden="true"></i><span>Call Support</span></span><span class="button button-text-support" aria-disabled="true"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i><span>Text Support</span></span></div><small>Add the Google Voice number in <code>contact_persons.json</code>.</small>';
      card.append(missing);
    } else {
      const actions = document.createElement('div');
      actions.className = 'support-line-actions';

      const callLink = document.createElement('a');
      callLink.className = 'button button-call-support';
      callLink.href = `tel:${number.replace(/[^\d+]/g, '')}`;
      callLink.innerHTML = '<i class="fa-solid fa-phone" aria-hidden="true"></i><span>Call Support</span>';
      callLink.setAttribute('aria-label', `Call Locust v2 Sacramento support at ${number}`);

      const textLink = document.createElement('a');
      textLink.className = 'button button-text-support';
      textLink.href = `sms:${number.replace(/[^\d+]/g, '')}`;
      textLink.innerHTML = '<i class="fa-solid fa-comment-dots" aria-hidden="true"></i><span>Text Support</span>';
      textLink.setAttribute('aria-label', `Text Locust v2 Sacramento support at ${number}`);

      actions.append(callLink, textLink);
      card.append(actions);
    }
    return card;
  };

  const renderAvailability = () => {
    if (!contactData) return;

    const time = overrideTime ? getOverrideTime() : getSacramentoNow();
    const opensAt = minutesFromTime(contactData.opensAt);
    const closesAt = minutesFromTime(contactData.closesAt);
    const isOpen = time.minutes >= opensAt && time.minutes < closesAt;

    currentTime.textContent = `${overrideTime ? 'Testing' : 'Sacramento time'}: ${time.display}`;
    status.replaceChildren();
    callSupport.replaceChildren();

    if (isOpen) {
      const confirmation = document.createElement('div');
      confirmation.className = 'availability-alert availability-open';
      confirmation.innerHTML = '<strong>Phone support is available now.</strong><span>Call the Sacramento Google Voice support line below.</span>';
      status.append(confirmation);

      const remaining = closesAt - time.minutes;
      if (remaining <= 60) {
        const warning = document.createElement('div');
        warning.className = 'availability-alert availability-warning';
        const threshold = remaining <= 10 ? '10 minutes' : remaining <= 30 ? '30 minutes' : '1 hour';
        warning.innerHTML = `<strong>Phone support is ending soon.</strong><span>Service ends in less than ${threshold}, at ${formatClock(closesAt)} Pacific Time.</span>`;
        status.append(warning);
      }

      callSupport.append(renderSupportLineCard(closesAt));
      return;
    }

    const unavailable = document.createElement('div');
    unavailable.className = 'availability-alert availability-closed';
    unavailable.innerHTML = '<strong>Phone support is not available right now.</strong><span>Please use email support or call during the next phone-support period.</span>';
    status.append(unavailable);

    const nextCard = document.createElement('div');
    nextCard.className = 'next-availability';
    const nextLabel = time.minutes < opensAt ? 'Today' : 'Tomorrow';
    nextCard.innerHTML = `<h3>${nextLabel}</h3><p><strong>${formatClock(opensAt)}–${formatClock(closesAt)} Pacific Time</strong><br>Google Voice phone support</p>`;
    callSupport.append(nextCard);
  };

  const initialize = () => {
    renderEmail();
    renderAvailability();
  };

  applyOverride.addEventListener('click', () => {
    if (!overrideInput.value) {
      overrideInput.focus();
      return;
    }
    overrideTime = overrideInput.value;
    renderAvailability();
  });

  clearOverride.addEventListener('click', () => {
    overrideTime = null;
    overrideInput.value = '';
    renderAvailability();
  });

  window.addEventListener('pageshow', renderAvailability);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') renderAvailability();
  });
  window.setInterval(renderAvailability, 60_000);

  if (contactData) initialize();

  if (window.location.protocol !== 'file:') {
    fetch('../data/contact_persons.json')
      .then((response) => {
        if (!response.ok) throw new Error(`Contact data request failed with ${response.status}`);
        return response.json();
      })
      .then((data) => {
        contactData = data;
        initialize();
      })
      .catch(() => {
        if (contactData) return;
        status.innerHTML = '<div class="availability-alert availability-closed"><strong>Support information could not be loaded.</strong><span>Please try refreshing the page.</span></div>';
      });
  }
}
