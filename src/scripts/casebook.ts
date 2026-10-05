/**
 * Casebook and Evidence Disclosure enhancements per Spec R4, R5, AC06, AC29
 */
import { markEvidenceInspected, getProgress, clearProgressKeepPreferences } from './storage';

export function initEvidenceDisclosures(): void {
  const cards = document.querySelectorAll<HTMLDetailsElement>('details.evidence-card');

  cards.forEach(card => {
    const evidenceId = card.getAttribute('data-evidence-id');
    if (!evidenceId) return;

    card.addEventListener('toggle', () => {
      if (card.open) {
        const newlyAdded = markEvidenceInspected(evidenceId);
        if (newlyAdded) {
          const announcer = document.getElementById('live-announcer');
          if (announcer) {
            announcer.textContent = 'Added to casebook.';
            announcer.classList.add('active');
            setTimeout(() => announcer.classList.remove('active'), 2500);
          }
        }
      }
    });
  });

  // Handle URL fragment targeting an evidence item (#evidence-E01)
  if (window.location.hash) {
    const hashId = window.location.hash.replace('#evidence-', '');
    if (hashId) {
      const targetCard = document.querySelector<HTMLDetailsElement>(`details.evidence-card[data-evidence-id="${hashId}"]`);
      if (targetCard) {
        targetCard.open = true;
        const summary = targetCard.querySelector('summary');
        summary?.focus();
      }
    }
  }
}

export function initCasebookPage(): void {
  const progress = getProgress();
  const inspectedSet = new Set(progress.inspectedEvidence);

  // Update inspected count banner
  const countSpan = document.getElementById('casebook-inspected-count');
  if (countSpan) {
    countSpan.textContent = String(inspectedSet.size);
  }

  // Filter buttons
  const btnAll = document.getElementById('filter-all-evidence') as HTMLButtonElement;
  const btnInspected = document.getElementById('filter-inspected-evidence') as HTMLButtonElement;
  const evidenceCards = document.querySelectorAll<HTMLElement>('.casebook-item-card');

  function applyFilter(showOnlyInspected: boolean) {
    evidenceCards.forEach(card => {
      const eid = card.getAttribute('data-evidence-id') || '';
      const isInspected = inspectedSet.has(eid);
      const badge = card.querySelector('.casebook-status-tag');
      
      if (badge) {
        badge.textContent = isInspected ? 'Inspected' : 'Uninspected';
        badge.className = `casebook-status-tag badge ${isInspected ? 'badge-exact' : 'badge-context'}`;
      }

      if (showOnlyInspected && !isInspected) {
        card.style.display = 'none';
      } else {
        card.style.display = 'block';
      }
    });

    if (btnAll) btnAll.setAttribute('aria-pressed', String(!showOnlyInspected));
    if (btnInspected) btnInspected.setAttribute('aria-pressed', String(showOnlyInspected));
  }

  btnAll?.addEventListener('click', () => applyFilter(false));
  btnInspected?.addEventListener('click', () => applyFilter(true));

  // Initialize with All evidence shown per Spec R5
  applyFilter(false);

  // Start Over confirmation flow (Spec R5)
  const startOverBtn = document.getElementById('btn-start-over') as HTMLButtonElement;
  const confirmBox = document.getElementById('start-over-confirmation') as HTMLElement;
  const keepProgressBtn = document.getElementById('btn-keep-progress') as HTMLButtonElement;
  const confirmClearBtn = document.getElementById('btn-confirm-clear') as HTMLButtonElement;

  startOverBtn?.addEventListener('click', () => {
    if (confirmBox) {
      confirmBox.style.display = 'block';
      keepProgressBtn?.focus(); // Focus "Keep progress" by default per Spec R5
    }
  });

  keepProgressBtn?.addEventListener('click', () => {
    if (confirmBox) confirmBox.style.display = 'none';
    startOverBtn?.focus();
  });

  confirmClearBtn?.addEventListener('click', () => {
    clearProgressKeepPreferences();
    window.location.href = '/';
  });
}
