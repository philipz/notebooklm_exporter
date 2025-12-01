# NotebookLM Markdown Exporter

A Chrome extension that exports NotebookLM chat conversations to Markdown format.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/oielaelencilkmceoanecfnpkjlbjijk?label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/notebooklm-markdown-expor/oielaelencilkmceoanecfnpkjlbjijk)

## ☕ Support This Project

<a href="https://buymeacoffee.com/philipz" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## Features

- **One-Click Export**: Export entire conversations with a single button click
- **Clean Content**: Automatically removes UI elements, buttons, and suggested questions
- **Markdown Format**: Clean, readable Markdown with proper formatting
- **Conversation Structure**: Preserves user/assistant message flow
- **Metadata**: Includes export timestamp and source information
- **Local Processing**: All conversion happens in your browser - no external services

## Installation

### Option 1: Load Unpacked Extension (Development)

1. **Download the extension**

   - Clone this repository or download the `notebooklm_exporter` folder

2. **Open Chrome Extensions**

   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

3. **Load the extension**

   - Click "Load unpacked"
   - Select the `notebooklm_exporter` folder
   - The extension should now appear in your extensions list

4. **Verify installation**
   - You should see "NotebookLM Markdown Exporter" in the list
   - The extension will automatically activate on NotebookLM pages

### Option 2: Chrome Web Store (Recommended)

Install directly from the Chrome Web Store:

**[Install NotebookLM Markdown Exporter](https://chromewebstore.google.com/detail/notebooklm-markdown-expor/oielaelencilkmceoanecfnpkjlbjijk)**

1. Click the link above or visit the extension page
2. Click "Add to Chrome"
3. Confirm the installation
4. The extension will automatically activate on NotebookLM pages

## Usage

1. **Open NotebookLM**

   - Navigate to https://notebooklm.google.com
   - Start or open a chat conversation

2. **Export the conversation**

   - Look for the "Export" button at the top of the chat
   - Click the button
   - The conversation will be downloaded as a `.md` file

3. **File naming**
   - Files are named: `notebooklm-chat-YYYY-MM-DD-HH-MM-SS.md` and `notebooklm-studio-XXXXXXX-YYYY-MM-DD.md`
   - Example: `notebooklm-chat-2025-01-26-14-30-45.md` and `notebooklm-studio-ai整合開發的成本-監督與趨勢-2025-10-27.md`

## Exported Format

The exported Markdown includes:

```markdown
---
exported: 2025-01-26T14:30:45.123Z
source: NotebookLM
---

# NotebookLM Conversation

Exported: 1/26/2025, 2:30:45 PM

---

## User

[User's message content in Markdown]

---

## Assistant

[Assistant's response in Markdown]

---

...
```

### Format Details

- **Frontmatter**: YAML metadata with export timestamp and source
- **Headings**: Each message has a `## User` or `## Assistant` heading
- **Separators**: Messages separated by `---` horizontal rules
- **Content**: HTML converted to clean Markdown using Turndown.js
- **Content Cleaning**: Automatically removes:
  - UI buttons and controls
  - Suggested follow-up questions
  - Input fields and forms
  - Navigation elements
  - Icon labels and UI text
- **Formatting**: Preserves:
  - Headings and emphasis
  - Lists (bulleted and numbered)
  - Code blocks and inline code
  - Links and images
  - Blockquotes

## Technical Details

### Architecture

- **Manifest V3**: Uses latest Chrome extension manifest
- **Content Script**: Runs on NotebookLM pages only
- **Local Processing**: All operations happen in-browser
- **Dependencies**: Turndown.js for HTML-to-Markdown conversion

### Files

```
notebooklm_exporter/
├── manifest.json          # Extension configuration
├── IMPLEMENTATION_SUMMARY.md # Describe implementation details
├── INSTALL.md            # How to install this extension
├── README.md             # This file
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── lib/                  # Third-party libraries
│   └── turndown.min.js   # HTML to Markdown converter
└── content/              # Content scripts
    ├── content.js        # Main logic
    └── styles.css        # Button styles
```

### Permissions

The extension requires minimal permissions:

- **host_permissions**: Run on `https://notebooklm.google.com/*` and access page content for export

No data is collected, transmitted, or stored outside your browser.

### Browser Compatibility

- **Chrome**: Fully supported (Manifest V3)
- **Edge**: Should work (uses Chromium engine)
- **Firefox**: Not supported (uses different extension API)
- **Safari**: Not supported (uses different extension API)

## Development

### Prerequisites

- Chrome browser (v88+)
- Text editor
- Basic knowledge of Chrome extensions

### Local Development

1. **Make changes**

   - Edit files in the `notebooklm_exporter` folder
   - Common files to modify:
     - `content/content.js`: Main logic
     - `content/styles.css`: Button styling
     - `manifest.json`: Extension config

2. **Reload extension**

   - Go to `chrome://extensions/`
   - Click the reload icon for "NotebookLM Markdown Exporter"
   - Refresh the NotebookLM page to see changes

3. **Debug**
   - Open DevTools on the NotebookLM page
   - Check Console for log messages
   - Look for `[NotebookLM Exporter]` prefix

### Testing

Test cases to verify:

- [ ] Button appears on NotebookLM chat pages
- [ ] Button does not appear on non-NotebookLM pages
- [ ] Click exports conversation successfully
- [ ] Exported file has correct naming format
- [ ] Markdown preserves message order and roles
- [ ] HTML formatting converts correctly
- [ ] Empty conversations show appropriate error
- [ ] Success/error states display correctly

## Troubleshooting

### Button doesn't appear

- **Check the page URL**: Extension only runs on `notebooklm.google.com`
- **Check console**: Look for error messages in DevTools Console
- **Reload the page**: Try a hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- **Check extension status**: Verify extension is enabled in `chrome://extensions/`

### Export button shows error

- **"No messages found"**: Wait for conversation to fully load
- **"Chat container not found"**: NotebookLM UI may have changed
  - Report issue with console logs
- **Generic errors**: Check DevTools Console for details

### Downloaded file is empty

- **Check for JavaScript errors**: Look in DevTools Console
- **Verify Turndown.js loaded**: Check Network tab for `turndown.min.js`
- **Try a different conversation**: Test with a simple conversation first

### Performance issues

- **Large conversations**: Export may take a few seconds
- **Browser memory**: Close other tabs if experiencing slowness
- **File size**: Very long conversations may produce large Markdown files

## Privacy & Security

- **No data collection**: Extension does not collect any user data
- **No external requests**: All processing happens locally in your browser
- **No analytics**: No tracking or usage statistics
- **Open source**: Code is available for review
- **Minimal permissions**: Only accesses NotebookLM pages

## Contributing

Contributions are welcome! Areas for improvement:

- Better message detection for different NotebookLM UI versions
- Support for exporting source materials
- Custom export formats (JSON, plain text)
- Batch export of multiple conversations
- Export options (include/exclude timestamps, etc.)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Version History

### 1.0.0 (2025-11-20)

- Removed unused activeTab permission for Chrome Web Store compliance
- Initial release
- Basic export functionality
- Markdown conversion with Turndown.js
- Clean, accessible UI

## Support

For issues, questions, or suggestions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review console logs for error details
3. Report issues with:
   - Chrome version
   - NotebookLM URL (without sensitive data)
   - Console error messages
   - Steps to reproduce

## Acknowledgments

- **Turndown.js**: HTML to Markdown conversion library
- **NotebookLM**: Google's experimental note-taking tool
- **Chrome Extensions API**: Platform for browser extensions

---

**Note**: This is an unofficial, community-developed tool not affiliated with Google or NotebookLM.
