import { Component } from '@angular/core';

@Component({
  selector: 'app-popup',
  imports: [],
  templateUrl: './popup.html',
  styleUrl: './popup.css',
})
export class Popup {
  sendToContentScript(type: string) {
    console.log('sendToContentScript');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      console.log(tabs);
      if (!tabs[0]?.id) return;
      chrome.tabs
        .sendMessage(tabs[0].id, { action: type })
        .catch((err: any) => console.error('Messaging error:', err));
    });
  }
}
