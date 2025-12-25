import { browser } from 'wxt/browser';

export default defineContentScript({
  matches: [
    "*://*.atlassian.net/*",
  ],
  main() {
    const formatTitle = (text: string, url: string) => {
      return text
        .replace(/^\[.+\]/, (match) => `${match}(${url})`)
        .replace(/-[^-]*$/, '');
    };
    
    console.log('Content script loaded');
    browser.runtime.onMessage.addListener((message) => {
      const formatted = formatTitle(document.title, document.URL);
      navigator.clipboard.writeText(formatted).catch((err) => {
        console.error(err);
      });

      return true;
    });
  }
});