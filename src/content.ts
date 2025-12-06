// Initialize on load
window.addEventListener('load', async () => {
  injectAppRoot();
  injectScript();
  injectStyles();
  observeNavBar();
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((msg: { action: string; selectionText: string }) => {
  if (msg.action === 'open_modal') {
    window.dispatchEvent(
      new CustomEvent('ext-show-modal', {
        detail: { type: 'ticket', selectionText: msg.selectionText },
      })
    );
  }
  if (msg.action === 'open_chat') {
    window.dispatchEvent(new CustomEvent('ext-show-modal', { detail: { type: 'chat' } }));
  }
});

// Inject app-root container for Angular
function injectAppRoot(): void {
  const appRoot = document.createElement('div');
  appRoot.id = 'ext-app-root';
  document.body.appendChild(appRoot);

  // // Load Angular main bundle
  // const script = document.createElement('script');
  // script.src = chrome.runtime.getURL('main.js');
  // script.type = 'module';
  // document.body.appendChild(script);
}

// Inject script
function injectScript(): void {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('main.js');
  script.type = 'module';
  document.body.appendChild(script);
}

// Inject styles
function injectStyles(): void {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('styles.css');
  document.head.appendChild(link);
}

// Observe DOM changes and inject buttons
function observeNavBar(): void {
  const observer = new MutationObserver(() => {
    const createBtn = document.querySelector<HTMLButtonElement>(
      'button[data-testid="atlassian-navigation--create-button"]'
    );

    if (createBtn && !document.getElementById('my-extension-btn')) {
      injectButtons(createBtn);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Inject extension buttons
function injectButtons(createBtn: HTMLButtonElement): void {
  const addBtn = document.createElement('button');
  addBtn.id = 'my-extension-btn';
  addBtn.textContent = 'Add ticket';
  addBtn.className = createBtn.className;
  addBtn.style.marginLeft = '8px';

  createBtn.insertAdjacentElement('afterend', addBtn);
  addBtn.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('ext-show-modal', { detail: { type: 'ticket' } }));
  });

  const chatBtn = document.createElement('button');
  chatBtn.id = 'my-extension-chat-btn';
  chatBtn.textContent = 'Chat';
  chatBtn.className = createBtn.className;
  chatBtn.style.marginLeft = '8px';

  addBtn.insertAdjacentElement('afterend', chatBtn);
  chatBtn.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('ext-show-modal', { detail: { type: 'chat' } }));
  });
}

// document.addEventListener('mouseup', () => {
//   const text = window.getSelection()?.toString().trim();

//   if (text) {
//     showPopup(text);
//   } else {
//     removePopup();
//   }
// });

// let popupEl: HTMLDivElement | null = null;

// function showPopup(selectedText: string) {
//   removePopup();

//   const selection = window.getSelection();
//   if (!selection?.rangeCount) return;

//   const range = selection.getRangeAt(0);
//   const rect = range.getBoundingClientRect();

//   popupEl = document.createElement('div');
//   popupEl.innerText = selectedText.toUpperCase();
//   popupEl.style.position = 'fixed';
//   popupEl.style.top = rect.bottom + 8 + 'px';
//   popupEl.style.left = rect.left + 'px';
//   popupEl.style.padding = '6px 10px';
//   popupEl.style.background = '#0052cc';
//   popupEl.style.color = '#fff';
//   popupEl.style.borderRadius = '6px';
//   popupEl.style.cursor = 'pointer';
//   popupEl.style.zIndex = '999999';
//   popupEl.style.fontSize = '13px';
//   popupEl.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';

//   popupEl.onclick = () => {
//     removePopup();

//     window.dispatchEvent(
//       new CustomEvent('ext-show-modal', {
//         detail: { type: 'ticket', text: selectedText },
//       })
//     );
//   };

//   document.body.appendChild(popupEl);
// }

// function removePopup() {
//   if (popupEl) {
//     popupEl.remove();
//     popupEl = null;
//   }
// }
