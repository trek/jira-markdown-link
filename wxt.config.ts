import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src", 
  outDir: "dist",
  manifest: {
    "permissions": [
      "activeTab", 
      "clipboardWrite",
      "scripting"
    ],
    "action": {
      "default_title": "Copy Links As Markdown"
    },
    "host_permissions": [
      "*://*.atlassian.net/browse/*"
    ]
  }
});
