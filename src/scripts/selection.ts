export function initSelectionPresenters(){
 document.querySelectorAll<HTMLElement>('.interactive-presenter').forEach(presenter=>{
  presenter.querySelectorAll<HTMLButtonElement>('[data-selection]').forEach(button=>button.addEventListener('click',()=>{
   const key=button.dataset.selection;
   presenter.querySelectorAll<HTMLButtonElement>('[data-selection]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   presenter.querySelectorAll<HTMLElement>('[data-target-key]').forEach(target=>target.classList.toggle('selected-highlight',target.dataset.targetKey===key));
  }));
 });
}
