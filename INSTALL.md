# Quick Installation Guide

## Step-by-Step Installation

### 1. Open Chrome Extensions Page

- Open Chrome browser
- Navigate to: `chrome://extensions/`
- Or: Menu → More Tools → Extensions

### 2. Enable Developer Mode

- Look for "Developer mode" toggle in the **top-right corner**
- Click to enable it
- You should now see additional buttons (Load unpacked, Pack extension, etc.)

### 3. Load the Extension

- Click the **"Load unpacked"** button (top-left area)
- Navigate to the `notebooklm_exporter` folder
- Select the folder and click "Select"

### 4. Verify Installation

You should see:
- ✅ Extension card titled "NotebookLM Markdown Exporter"
- ✅ Version 1.0.0
- ✅ Status: Enabled
- ✅ Blue icon (placeholder with "M")

### 5. Test It Out

1. Go to https://notebooklm.google.com
2. Open or start a chat conversation
3. Look for the blue "📄 Export to Markdown" button
4. Click it to export your conversation

## Troubleshooting

### Extension won't load

**Error: "Manifest file is missing or unreadable"**
- Make sure you selected the `notebooklm_exporter` folder (not a parent folder)
- Verify `manifest.json` exists in the selected folder

**Error: "Invalid manifest"**
- Try downloading the extension again
- Check that all files are present

### Button doesn't appear on NotebookLM

1. **Refresh the page** (Cmd+R / Ctrl+R)
2. **Check extension is enabled** at `chrome://extensions/`
3. **Check console for errors**:
   - Right-click page → Inspect
   - Go to Console tab
   - Look for messages starting with `[NotebookLM Exporter]`

### Export fails with error

- **"No messages found"**: Make sure there are messages in the conversation
- **"Chat container not found"**: Wait a few seconds for the page to fully load
- Check DevTools Console for specific error messages

## Updating the Extension

If you make changes to the code:

1. Go to `chrome://extensions/`
2. Find "NotebookLM Markdown Exporter"
3. Click the **reload icon** (circular arrow)
4. Refresh the NotebookLM page

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "NotebookLM Markdown Exporter"
3. Click **"Remove"**
4. Confirm removal

## Need Help?

See the full [README.md](README.md) for:
- Detailed usage instructions
- Technical documentation
- Privacy information
- Troubleshooting guide
