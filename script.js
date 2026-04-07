/**
 * Parallax Stacking Card Scroll
 *
 * Cards use CSS `position: sticky` with incrementing `top` values.
 * As the user scrolls, each card pins at its top offset, and the next card
 * slides up and stacks on top. Previous cards scale down slightly and dim
 * to create a depth/parallax feel.
 */

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const container = document.querySelector('.cards-container');
  const cardCount = cards.length;

  // Set container height so there's enough scroll distance for all cards
  // Each card needs ~100vh of scroll to fully pass through
  const scrollPerCard = window.innerHeight * 0.85;
  container.style.height = `${cardCount * scrollPerCard + window.innerHeight * 0.5}px`;

  // Track card positions and apply parallax transforms
  function onScroll() {
    const containerTop = container.getBoundingClientRect().top;

    cards.forEach((card, index) => {
      const cardInner = card.querySelector('.card-inner');
      const topOffset = 8 + index * 3; // matches CSS vh offsets
      const topPx = (topOffset / 100) * window.innerHeight;

      // How far this card is into its "stuck" phase
      // When containerTop is very negative, the card has been stuck for a while
      const cardStartScroll = index * scrollPerCard;
      const scrolled = -containerTop - cardStartScroll;

      // Once the next card starts covering this one, scale it down
      const nextCardScroll = scrollPerCard;
      const progress = Math.max(0, Math.min(1, scrolled / nextCardScroll));

      if (index < cardCount - 1) {
        // Scale down and dim cards as they get buried
        const scaleVal = 1 - progress * 0.05;
        const opacityVal = 1 - progress * 0.3;
        const translateY = -progress * 15;

        if (scrolled > 0) {
          cardInner.style.transform = `scale(${scaleVal}) translateY(${translateY}px)`;
          cardInner.style.opacity = opacityVal;
        } else {
          cardInner.style.transform = '';
          cardInner.style.opacity = '';
        }
      }
    });

    requestAnimationFrame(() => {}); // keep RAF loop alive if needed
  }

  // Throttle scroll with requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  onScroll();

  // Recalculate on resize
  window.addEventListener('resize', () => {
    const scrollPerCardNew = window.innerHeight * 0.85;
    container.style.height = `${cardCount * scrollPerCardNew + window.innerHeight * 0.5}px`;
    onScroll();
  });
});
