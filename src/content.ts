// Initialize on load
window.addEventListener('load', async () => {
  injectAppRoot();
  injectScript();
  injectStyles();
  observeNavBar();
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((msg: { action: string }) => {
  if (msg.action === 'open_modal') {
    window.dispatchEvent(new CustomEvent('ext-show-modal', { detail: { type: 'ticket' } }));
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
