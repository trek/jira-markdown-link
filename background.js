// FORKED: https://github.com/hjdarnel/jira-markdown-link

/*

  This Extension:
  - extracts one or more links from the relevant identifiers, descriptions, and urls from a given page
  - formats a markdown link, based on options:
    - Long Form: `[${identifier}: ${description}](${url})`
    - Short Form: `[${identifier}](${url})`
    - Partial Link Long Form: `[${identifier}](${url}): ${description}`
  - formats lists (when present) as a bulleted list
  - copies all links to the clipboard

  Interactions with this Extension:
  - Click Button: use default form
  - `CMD+L`: Short Form
  - `CMD+SHIFT+L`: Long Form
  - `CTRL+CMD+SHIFT+L`: Partial Link Long Form

  Settings Page:
  - select default form
  - change all keybindings

  Default:
  - If only one H1 present
    - Link Text: `${H1}`
  - Else
    - Link Text: `${title}`

  Failure Cases:
  - Error
    - Show Error Flash Message
  - Miss
    - Show Miss Flash Message

*/

/*

  TODO:
  - Figure out how multiple browser tabs should be processed
    - in a window?
    - only selected?
    - what other extension permissions are required?
  - Implement the processing described below in Supported Pages

*/

/*

  Supported Pages:
  - JIRA
    - Specific Ticket: https://endangeredmassa.atlassian.net/browse/BTS-6
      - Identifier: `browse\/([^\/]+)$` (from `document.URL`)
      - Description: `document.querySelectorAll('h1')[0].innerText`
      - URL: `document.URL`
    - Modal Ticket: https://endangeredmassa.atlassian.net/jira/software/projects/BTS/boards/1?selectedIssue=BTS-6
      - Identifier: `selectedIssue=([^&]+)$` (from `document.URL`)
      - Description: `document.querySelectorAll('[role="dialog"] h1')[0].innerText`
      - URL: `document.URL`
    - List /w Selected: https://endangeredmassa.atlassian.net/jira/software/projects/BTS/list?jql=project%20%3D%20%22BTS%22%20ORDER%20BY%20created%20DESC
      - List: `document.querySelectorAll('tboday input[type="checkbox"]')` (filter `$item.checked`)
      - Identifier: `$item.closest('tr').querySelectorAll('[data-vc="native-issue-table-ui-issue-key-cell"]')[0].innerText`
      - Description: `$item.closest('tr').querySelectorAll('[data-vc="issue-field-inline-edit-read-view-container"]')[0].innerText`
      - URL: `$item.closest('tr').querySelectorAll('[data-vc="native-issue-table-ui-issue-key-cell"] a')[0].href`
  - Linear
    - Specific Card: https://linear.app/massalabs/issue/MAS-10/some-side-quest
      - Identifier: `issue\/([^\/]+)\/` (from `document.URL`)
      - Description: `document.querySelectorAll('[aria-label="Issue title"]')[0].innerText`
      - URL: `document.URL`
    - List /w Selected: https://linear.app/massalabs/team/MAS/active
      - List: `document.querySelectorAll('input[type="checkbox"]')` (filter `$item.checked`)
      - Identifier: `issue\/([^\/]+)\/` (from `document.URL`)
      - Description: `document.querySelectorAll('[aria-label="Issue title"]')[0].innerText`
      - URL: `$item.closest('a').href`
  - Github
    - Repo: https://github.com/EndangeredMassa/massa-labs
      - Identifier: `github\.com\/([^\/]+\/[^\/]+)[^\/]*$` (from `document.URL`)
      - Description: NULL
      - URL: `document.URL`
    - PR: https://github.com/EndangeredMassa/massa-labs/pull/1
      - Identifier: `\/pull\/([^\/?]+)$` (from `document.URL`)
      - Description: `document.querySelectorAll('.non-sticky-header-container h1')[0].innerText`
      - URL: `document.URL`
    - Issue: https://github.com/testiumjs/testium-core/issues/32
      - Identifier: `\/issues\/([^\/?]+)$` (from `document.URL`)
      - Description: `document.querySelectorAll('[data-component="TitleArea"] h1')[0].innerText`
      - URL: `document.URL`
    - PR List:
      - List: `document.querySelectorAll('div[aria-label="Issues"]')[0].querySelectorAll('a.h4')`
      - Identifier: `\/pull\/([^\/?]+)$` (from `$item.href`)
      - Description: `$item.innerText`
      - URL: `$item.href`
    - Issue List:
      - List: `document.querySelectorAll('[data-listview-item-title-container="true"]')[0].querySelectorAll('a')`
      - Identifier: `\/issues\/([^\/?]+)$` (from `$item.href`)
      - Description: `$item.innerText`
      - URL: `$item.href`

*/

const injectedFunction = () => {
  const formatTitle = (text, url) => {
    return text
      .replace(/^\[.+\]/, (match) => `${match}(${url})`)
      .replace(/-[^-]*$/, '');
  };

  const copyTextToClipboard = (text) => {
    var copyFrom = document.createElement('textarea');
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
  };

  const formatted = formatTitle(document.title, document.URL);

  if (!navigator.clipboard) {
    copyTextToClipboard(formatted);
  } else {
    navigator.clipboard.writeText(formatted).catch((err) => {
      console.error(err);
    });
  }
};

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: injectedFunction
  });
});
