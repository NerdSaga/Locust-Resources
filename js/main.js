const accordionButtons = document.querySelectorAll('[data-accordion] button[aria-expanded]');

accordionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    const panel = document.getElementById(button.getAttribute('aria-controls'));

    button.setAttribute('aria-expanded', String(!isOpen));
    panel.hidden = isOpen;
  });
});
