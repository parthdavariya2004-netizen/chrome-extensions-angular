import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Check if we're in extension context (content script injected ext-app-root)
const extRoot = document.getElementById('ext-app-root');

if (extRoot) {
  // Extension context - create app-root element inside ext-app-root
  const appRoot = document.createElement('app-root');
  extRoot.appendChild(appRoot);

  // Bootstrap App with full config
  bootstrapApplication(App, appConfig).catch((err) =>
    console.error('Extension bootstrap error:', err)
  );
} else {
  // Popup context - bootstrap main App normally
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
}
