import { createApplication } from '@angular/platform-browser';
import { ComponentRef } from '@angular/core';
import { Ticketmodal } from './app/ticketmodal/ticketmodal';

chrome.runtime.onMessage.addListener((msg: { action: string }) => {
  if (msg.action === 'open_modal') {
    showModal();
  }
});

//  Run observer on window load
window.addEventListener('load', () => {
  observeNavBar();
});

// Observe DOM changes and inject buttons
function observeNavBar(): void {
  const observer = new MutationObserver(() => {
    const createBtn = document.querySelector<HTMLButtonElement>(
      'button[data-testid="atlassian-navigation--create-button"]'
    );

    // Insert only if Jira's Create button exists AND our extension buttons are not yet added
    if (createBtn && !document.getElementById('my-extension-btn')) {
      injectButtons(createBtn);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Inject our extension buttons next to Jira's button
function injectButtons(createBtn: HTMLButtonElement): void {
  // Add Ticket button
  const addBtn = document.createElement('button');
  addBtn.id = 'my-extension-btn';
  addBtn.textContent = 'Add ticket';
  addBtn.className = createBtn.className;
  addBtn.style.marginLeft = '8px';

  createBtn.insertAdjacentElement('afterend', addBtn);
  addBtn.addEventListener('click', () => showModal());

  // Chat button
  // const chatBtn = document.createElement('button');
  // chatBtn.id = 'my-extension-chat-btn';
  // chatBtn.textContent = 'Chat';
  // chatBtn.className = createBtn.className;
  // chatBtn.style.marginLeft = '8px';

  // addBtn.insertAdjacentElement('afterend', chatBtn);
  // chatBtn.addEventListener('click', () => chatModal());
}

// Angular dynamic modal loader
let modalApp: any;
let modalRef: ComponentRef<Ticketmodal> | null = null;

async function showModal() {
  // Avoid duplicates
  if (document.getElementById('jira-ticket-modal-root')) return;

  // Create container
  const container = document.createElement('div');
  container.id = 'jira-ticket-modal-root';
  document.body.appendChild(container);

  // Create Angular "application"
  modalApp = await createApplication({
    providers: [],
  });

  // Bootstrap Angular component into container
  modalRef = await modalApp.bootstrap(Ticketmodal, container);

  // Handle close output
  modalRef?.instance.closeModal.subscribe(() => {
    closeModal(container);
  });
}

function closeModal(container: HTMLElement) {
  if (modalRef) {
    modalRef.destroy();
  }
  container.remove();
}
