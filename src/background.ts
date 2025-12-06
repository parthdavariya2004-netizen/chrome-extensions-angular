console.log('background');

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'open-options',
    title: 'Open Jira Options',
    contexts: ['all'],
  });

  chrome.contextMenus.create({
    id: 'create-ticket',
    title: 'Create Jira Ticket',
    contexts: ['selection'], // only when text selected
  });
});

function sendToContentScript(type: string, selectionText: string) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    if (!tabs[0]?.id) return;
    chrome.tabs
      .sendMessage(tabs[0].id, { action: type, selectionText })
      .catch((err: any) => console.error('Messaging error:', err));
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'open-options') {
    chrome.runtime.openOptionsPage();
  }

  if (info.menuItemId === 'create-ticket' && tab?.id) {
    console.log('Selected text:', info.selectionText);
    sendToContentScript('open_modal', info?.selectionText || '');
  }
});
