/**
 * Interactive Selection Presenter handler per Spec R2 & AC36
 */

export function initSelectionPresenters(): void {
  const presenters = document.querySelectorAll<HTMLElement>('.interactive-presenter');
  
  presenters.forEach(presenter => {
    const buttons = presenter.querySelectorAll<HTMLButtonElement>('.presenter-select-btn');
    const targets = presenter.querySelectorAll<HTMLElement>('.presenter-target');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedKey = btn.getAttribute('data-selection');
        if (!selectedKey) return;

        // Update button states
        buttons.forEach(b => {
          const isSelected = b === btn;
          b.setAttribute('aria-pressed', String(isSelected));
          b.classList.toggle('active', isSelected);
        });

        // Highlight matching target item without hiding unselected items per Spec R2
        targets.forEach(t => {
          const targetKey = t.getAttribute('data-target-key');
          if (targetKey === selectedKey) {
            t.classList.add('selected-highlight');
            t.setAttribute('tabindex', '-1');
            t.focus({ preventScroll: true });
          } else {
            t.classList.remove('selected-highlight');
            t.removeAttribute('tabindex');
          }
        });
      });
    });
  });
}
