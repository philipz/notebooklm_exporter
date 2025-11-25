/**
 * NotebookLM Markdown Exporter - Content Script V3
 *
 * Features:
 * - Chat Export: Export entire conversation
 * - Studio Export: Export selected items with checkboxes (one file per item)
 * - SPA Support: Handles navigation between pages
 */

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    TIMEOUT_MS: 10000,
    RETRY_DELAY_MS: 100,
    MAX_RETRIES: 100,
    CONTENT_LOAD_DELAY_MS: 2000, // Wait for content to load after clicking item
    DOWNLOAD_DELAY_MS: 800, // Delay between multiple downloads
    SELECTORS: {
      CHAT_PANEL: '.chat-panel',
      CHAT_TOOLBAR: '.chat-panel .panel-header .chat-header-buttons',
      STUDIO_PANEL: '.studio-panel',
      STUDIO_TOOLBAR: '.studio-panel .panel-header',
      STUDIO_ITEMS: '.mat-mdc-button.artifact-button-content',
      MESSAGE_CONTAINER: ['.messages', '.conversation', '[role="log"]'],
      MESSAGE_ITEM: ['[data-message-id]', '.message', '.chat-message'],
      USER_MESSAGE: ['.user-message', '[data-role="user"]'],
      ASSISTANT_MESSAGE: ['.assistant-message', '[data-role="assistant"]']
    }
  };

  /**
   * Create Chat export button
   */
  function createChatExportButton(id, text) {
    const button = createBaseExportButton(id, text);

    button.addEventListener('click', async () => {
      try {
        button.disabled = true;
        button.textContent = '⏳ Exporting...';
        button.style.opacity = '0.7';

        const messages = extractChatMessages();
        if (messages.length === 0) {
          throw new Error('No messages found');
        }

        const markdown = convertToMarkdown(messages);
        const filename = generateChatFilename();
        downloadMarkdown(markdown, filename);

        showSuccessMessage(button, text);
      } catch (error) {
        console.debug('[NotebookLM Exporter] Chat export failed:', error);
        showErrorMessage(button, error.message, text);
      }
    });

    return button;
  }

  /**
   * Create Studio export button
   */
  function createStudioExportButton(id, text) {
    const button = createBaseExportButton(id, text);

    button.addEventListener('click', async () => {
      try {
        button.disabled = true;
        button.textContent = '⏳ Exporting...';
        button.style.opacity = '0.7';

        await exportStudioItems(button, text);

      } catch (error) {
        showErrorMessage(button, error.message, text);
      }
    });

    return button;
  }

  /**
   * Create base export button with shared styling
   */
  function createBaseExportButton(id, text) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.setAttribute('aria-label', 'Export to Markdown');

    // Button styles - Blue color to distinguish from PDF extension
    Object.assign(button.style, {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 16px',
      marginLeft: '8px',
      background: '#1a73e8',  // Google Blue
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap'
    });

    // Hover effect
    button.addEventListener('mouseenter', () => {
      if (!button.disabled) {
        button.style.background = '#1557b0';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
      }
    });

    button.addEventListener('mouseleave', () => {
      if (!button.disabled) {
        button.style.background = '#1a73e8';
        button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
      }
    });

    return button;
  }

  /**
   * Inject export buttons into toolbars
   */
  function injectExportButtons() {
    const chatToolbar = document.querySelector(CONFIG.SELECTORS.CHAT_TOOLBAR);
    const studioToolbar = document.querySelector(CONFIG.SELECTORS.STUDIO_TOOLBAR);

    // Inject Chat Export button
    if (chatToolbar && !document.getElementById('notebooklm-export-chat-btn')) {
      const chatButton = createChatExportButton('notebooklm-export-chat-btn', 'Export');
      chatToolbar.appendChild(chatButton);
      console.log('[NotebookLM Exporter] Chat Export button injected');
    }

    // Inject Studio Export button
    if (studioToolbar && !document.getElementById('notebooklm-export-studio-btn')) {
      const studioButton = createStudioExportButton('notebooklm-export-studio-btn', 'Export');
      studioToolbar.appendChild(studioButton);
      console.log('[NotebookLM Exporter] Studio Export button injected');
    }
  }

  /**
   * Inject radio buttons next to Studio items (single selection)
   */
  function injectStudioCheckboxes() {
    const studioPanel = document.querySelector(CONFIG.SELECTORS.STUDIO_PANEL);
    if (!studioPanel) {
      return;
    }

    const studioItems = studioPanel.querySelectorAll(CONFIG.SELECTORS.STUDIO_ITEMS);

    studioItems.forEach((item, index) => {
      // Check if radio button already exists
      if (item.previousElementSibling?.classList.contains('studio-export-radio-container')) {
        return;
      }

      // Filter: Only add radio to document items (Reports, Flashcards, Quiz)
      // Exclude: Audio Overview, Video Overview, Mind Map (creation buttons)
      const icon = item.querySelector('mat-icon');
      const iconText = icon?.textContent?.trim();

      // Only add radio to document items (sticky_note_2 icon)
      if (iconText !== 'sticky_note_2') {
        return;
      }

      // Create radio container
      const radioContainer = document.createElement('div');
      radioContainer.className = 'studio-export-radio-container';
      Object.assign(radioContainer.style, {
        display: 'inline-flex',
        alignItems: 'center',
        marginRight: '8px',
        verticalAlign: 'middle'
      });

      // Create radio button (single selection)
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'studio-export-item';  // Same name for radio group
      radio.className = 'studio-export-radio';
      radio.id = `studio-radio-${index}`;
      radio.value = index;
      Object.assign(radio.style, {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
        accentColor: '#1a73e8'
      });

      // Auto-select when user clicks the item
      item.addEventListener('click', () => {
        radio.checked = true;
      });

      radioContainer.appendChild(radio);

      // Insert before the item button
      item.parentNode.insertBefore(radioContainer, item);
    });
  }

  /**
   * Export selected Studio item (single selection with radio button)
   */
  async function exportStudioItems(button, originalText) {
    const studioPanel = document.querySelector(CONFIG.SELECTORS.STUDIO_PANEL);
    if (!studioPanel) {
      throw new Error('Studio panel not found');
    }

    // Find the selected radio button
    const selectedRadio = studioPanel.querySelector('.studio-export-radio:checked');

    if (!selectedRadio) {
      throw new Error('No item selected');
    }

    try {
      button.textContent = '⏳ Exporting...';

      // Get the item button next to the radio
      const itemButton = selectedRadio.parentElement.nextElementSibling;

      if (!itemButton) {
        throw new Error('Item button not found');
      }

      // Extract title from item button using .artifact-title selector
      const titleElement = itemButton.querySelector('.artifact-title');
      const title = titleElement ? titleElement.textContent.trim() : 'Studio-Item';

      console.log(`[NotebookLM Exporter] Exporting: "${title}"`);

      // Check if we're already viewing the Note content
      let docViewer = studioPanel.querySelector('labs-tailwind-doc-viewer');

      if (!docViewer) {
        // We're on the list page, need to click into the Note
        console.log(`[NotebookLM Exporter] Opening Note: "${title}"`);
        button.textContent = '⏳ Opening Note...';

        // Click the item button to open the Note
        itemButton.click();

        // Wait for content to load
        await waitForNoteContent(studioPanel, CONFIG.CONTENT_LOAD_DELAY_MS);

        // Try to find the doc viewer again
        docViewer = studioPanel.querySelector('labs-tailwind-doc-viewer');

        if (!docViewer) {
          throw new Error('Failed to load Note content. Please try opening the Note manually first.');
        }
      }

      button.textContent = '⏳ Extracting content...';

      // Extract content
      const content = extractStudioItemContent();

      if (!content || content.textContent.trim().length < 100) {
        throw new Error('Content not found or too short. Please make sure the item is loaded.');
      }

      // Convert to markdown
      const markdown = convertStudioItemToMarkdown(title, content);

      // Generate filename
      const filename = generateStudioFilename(title);

      // Download
      downloadMarkdown(markdown, filename);

      console.log(`[NotebookLM Exporter] Successfully exported: "${title}"`);

      // Navigate back to Studio list page
      await navigateBackToStudioList(studioPanel);

      showSuccessMessage(button, originalText);

    } catch (error) {
      console.debug(`[NotebookLM Exporter] Export failed:`, error);
      // Try to navigate back even on error
      try {
        await navigateBackToStudioList(studioPanel);
      } catch (navError) {
        console.warn('[NotebookLM Exporter] Failed to navigate back:', navError);
      }
      throw error;
    }
  }

  /**
   * Wait for Note content to load
   */
  async function waitForNoteContent(studioPanel, maxWaitMs) {
    const startTime = Date.now();
    const checkInterval = 100; // Check every 100ms

    while (Date.now() - startTime < maxWaitMs) {
      const docViewer = studioPanel.querySelector('labs-tailwind-doc-viewer');
      if (docViewer && docViewer.textContent?.trim().length > 100) {
        console.log(`[NotebookLM Exporter] Note content loaded (${Date.now() - startTime}ms)`);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }

    throw new Error(`Timeout waiting for Note content to load (${maxWaitMs}ms)`);
  }

  /**
   * Navigate back to Studio list page
   */
  async function navigateBackToStudioList(studioPanel) {
    try {
      // Check if we're in Note view (has "Studio > Note" in header)
      const headerText = studioPanel.querySelector('.panel-header')?.textContent;
      if (!headerText || !headerText.includes('Note')) {
        console.log('[NotebookLM Exporter] Already on Studio list page');
        return;
      }

      // Try multiple strategies to find the back button
      const backButtonSelectors = [
        'button[aria-label*="Back"]',
        'button[aria-label*="back"]',
        'button[aria-label*="Close"]',
        'button[aria-label*="close"]',
        'button mat-icon[fonticon="arrow_back"]',
        '.panel-header button:first-child',
        '.panel-header [role="button"]:first-child'
      ];

      let backButton = null;
      for (const selector of backButtonSelectors) {
        backButton = studioPanel.querySelector(selector);
        if (backButton) {
          console.log(`[NotebookLM Exporter] Found back button with selector: ${selector}`);
          break;
        }
      }

      // Also try finding button with arrow_back icon
      if (!backButton) {
        const allButtons = studioPanel.querySelectorAll('.panel-header button');
        for (const btn of allButtons) {
          const icon = btn.querySelector('mat-icon');
          if (icon && icon.textContent.trim() === 'arrow_back') {
            backButton = btn;
            console.log('[NotebookLM Exporter] Found back button by icon content');
            break;
          }
        }
      }

      if (backButton) {
        console.log('[NotebookLM Exporter] Navigating back to Studio list');
        backButton.click();
        // Wait for navigation to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        console.warn('[NotebookLM Exporter] Back button not found, staying on Note page');
        console.warn('[NotebookLM Exporter] Please manually navigate back to the Studio list');
      }
    } catch (error) {
      console.warn('[NotebookLM Exporter] Error navigating back:', error);
      // Don't throw - this is not critical
    }
  }

  /**
   * Extract content from currently displayed Studio item
   */
  function extractStudioItemContent() {
    const studioPanel = document.querySelector(CONFIG.SELECTORS.STUDIO_PANEL);
    if (!studioPanel) {
      return document.createElement('div');
    }

    // Primary selector: labs-tailwind-doc-viewer (the actual content viewer)
    // This contains the clean article content without UI controls
    const docViewer = studioPanel.querySelector('labs-tailwind-doc-viewer');

    if (docViewer) {
      const textContent = docViewer.textContent?.trim();
      if (textContent && textContent.length > 100) {
        console.log(`[NotebookLM Exporter] Content extracted from doc-viewer: ${textContent.length} chars`);
        console.log(`[NotebookLM Exporter] Content preview: "${textContent.substring(0, 100)}..."`);
        return docViewer.cloneNode(true);
      }
    }

    // Fallback 1: Try note-editor form (contains doc-viewer)
    const noteForm = studioPanel.querySelector('note-editor form');
    if (noteForm) {
      // Try to find doc-viewer inside the form
      const innerDocViewer = noteForm.querySelector('labs-tailwind-doc-viewer');
      if (innerDocViewer) {
        console.log(`[NotebookLM Exporter] Using doc-viewer from note-editor form`);
        return innerDocViewer.cloneNode(true);
      }
    }

    // Fallback 2: Try other content selectors
    const fallbackSelectors = [
      '.artifact-content',
      '.artifact-viewer',
      '.panel-content'
    ];

    for (const selector of fallbackSelectors) {
      const fallbackArea = studioPanel.querySelector(selector);
      if (fallbackArea && fallbackArea.textContent?.trim().length > 100) {
        console.log(`[NotebookLM Exporter] Using fallback selector: ${selector}`);
        return fallbackArea.cloneNode(true);
      }
    }

    console.warn('[NotebookLM Exporter] No content area found, using studio panel');
    return studioPanel.cloneNode(true);
  }

  /**
   * Convert Studio item content to Markdown
   */
  function convertStudioItemToMarkdown(title, contentElement) {
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '_'
    });

    turndownService.addRule('removeScripts', {
      filter: ['script', 'style', 'noscript'],
      replacement: () => ''
    });

    // Build markdown
    let markdown = '';

    // Add frontmatter
    const timestamp = new Date().toISOString();
    markdown += `---\n`;
    markdown += `exported: ${timestamp}\n`;
    markdown += `source: NotebookLM Studio\n`;
    markdown += `title: ${title}\n`;
    markdown += `---\n\n`;
    markdown += `# ${title}\n\n`;
    markdown += `Exported: ${new Date().toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    // Convert content
    const htmlContent = contentElement.innerHTML;
    const markdownContent = turndownService.turndown(htmlContent);
    markdown += markdownContent.trim() + '\n';

    // Clean up excessive newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    return markdown;
  }

  /**
   * Generate filename for Studio item
   */
  function generateStudioFilename(title) {
    // Clean title for filename
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')  // Replace non-alphanumeric (including Chinese) with dash
      .replace(/^-+|-+$/g, '')  // Remove leading/trailing dashes
      .substring(0, 50);  // Limit length

    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];

    return `notebooklm-studio-${cleanTitle}-${dateStr}.md`;
  }

  /**
   * Extract chat messages from the DOM
   */
  function extractChatMessages() {
    const messages = [];
    const chatPanel = document.querySelector(CONFIG.SELECTORS.CHAT_PANEL);

    if (!chatPanel) {
      console.log('[NotebookLM Exporter] Chat panel not found');
      return messages;
    }

    // Try to find message container
    let messageContainer = chatPanel;
    for (const selector of CONFIG.SELECTORS.MESSAGE_CONTAINER) {
      const found = chatPanel.querySelector(selector);
      if (found) {
        messageContainer = found;
        break;
      }
    }

    // Try to find individual messages
    let messageElements = [];
    for (const selector of CONFIG.SELECTORS.MESSAGE_ITEM) {
      messageElements = Array.from(messageContainer.querySelectorAll(selector));
      if (messageElements.length > 0) {
        console.log(`[NotebookLM Exporter] Found ${messageElements.length} messages with selector: ${selector}`);
        break;
      }
    }

    // If no messages found, try generic approach
    if (messageElements.length === 0) {
      const allDivs = Array.from(messageContainer.querySelectorAll('div'));
      messageElements = allDivs.filter(div => {
        const text = div.textContent?.trim();
        return text && text.length > 10 && div.children.length > 0;
      });
      console.log(`[NotebookLM Exporter] Using generic div selection: ${messageElements.length} candidates`);
    }

    // Extract messages and infer roles with deduplication
    const seenContent = new Set();

    messageElements.forEach((element, index) => {
      if (!element.textContent?.trim()) {
        return;
      }

      // Skip if this element is a child of another message element
      const isNested = messageElements.some((other, otherIndex) => {
        return otherIndex !== index && other.contains(element);
      });

      if (isNested) {
        return;
      }

      let role = 'assistant';
      for (const selector of CONFIG.SELECTORS.USER_MESSAGE) {
        if (element.matches(selector) || element.querySelector(selector)) {
          role = 'user';
          break;
        }
      }

      // Fallback: alternate based on position
      if (messages.length === 0 && role === 'assistant') {
        role = 'user';
      } else if (messages.length > 0) {
        const lastRole = messages[messages.length - 1].role;
        if (role === lastRole) {
          role = lastRole === 'user' ? 'assistant' : 'user';
        }
      }

      // Clone and clean the message content
      const cleanedContent = cleanChatMessageContent(element);
      const contentText = cleanedContent.textContent?.trim();

      // Skip if content is too short or already seen
      if (!contentText || contentText.length < 10) {
        return;
      }

      // Create a content signature for deduplication
      const contentSignature = contentText.substring(0, 200);
      if (seenContent.has(contentSignature)) {
        console.log(`[NotebookLM Exporter] Skipping duplicate message: "${contentSignature.substring(0, 50)}..."`);
        return;
      }

      seenContent.add(contentSignature);

      messages.push({
        role,
        content: cleanedContent
      });
    });

    console.log(`[NotebookLM Exporter] Extracted ${messages.length} unique messages`);
    return messages;
  }

  /**
   * Clean chat message content by removing UI elements
   */
  function cleanChatMessageContent(element) {
    const cloned = element.cloneNode(true);

    // Remove common UI elements
    const uiSelectors = [
      'button',                      // All buttons
      '.mdc-button',                 // Material Design buttons
      '.mat-mdc-button',             // Angular Material buttons
      '[role="button"]',             // Button-like elements
      'mat-icon',                    // Material icons
      '[class*="toolbar"]',          // Toolbars
      '[class*="action"]',           // Action buttons
      '.thumb-up',                   // Thumbs up/down
      '.thumb-down',
      '[aria-label*="Copy"]',        // Copy buttons
      '[aria-label*="Save"]',        // Save buttons
      '[aria-label*="Refresh"]',     // Refresh buttons
      '[class*="emoji"]',            // Emoji picker
      'input',                       // Input fields
      'form',                        // Forms
      'omnibar',                     // NotebookLM omnibar (follow-up questions)
      'query-box',                   // Query input box
      'follow-up',                   // Follow-up suggestions
      'scroll-carousel',             // Carousel for follow-up chips
      '.follow-up-chip',             // Individual follow-up question chips
      '.omnibar-container',          // Omnibar container
      '.query-box-container',        // Query box container
      'textarea[placeholder*="typing"]'  // Query input textarea
    ];

    uiSelectors.forEach(selector => {
      const elements = cloned.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Remove specific text patterns (UI labels)
    const textNodesToRemove = [];
    const walker = document.createTreeWalker(
      cloned,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const uiTextPatterns = [
      /^Search results$/,
      /^No emoji found$/,
      /^Recently used$/,
      /^Loading$/,
      /^keep$/,
      /^Save to note$/,
      /^copy_all$/,
      /^thumb_up$/,
      /^thumb_down$/,
      /^keep_pin$/,
      /^subscriptions$/,
      /^audio_magic_eraser$/,
      /^Video Overview$/,
      /^Audio Overview$/,
      /^flowchart$/,
      /^Mind Map$/,
      /^arrow_forward$/,
      /^keyboard_arrow_down$/,
      /^\d+ sources$/,
      /^quick_phrases$/,
      /^Refresh$/,
      /^tune$/,
      /^Start typing\.\.\.$/,
      /^chevron_right$/,
      /^chevron_left$/
    ];

    while (walker.nextNode()) {
      const textNode = walker.currentNode;
      const text = textNode.textContent.trim();

      // Check if this text matches any UI pattern
      if (uiTextPatterns.some(pattern => pattern.test(text))) {
        textNodesToRemove.push(textNode);
      }
    }

    // Remove identified text nodes
    textNodesToRemove.forEach(node => {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });

    return cloned;
  }

  /**
   * Convert chat messages to Markdown format
   */
  function convertToMarkdown(messages) {
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '_'
    });

    turndownService.addRule('removeScripts', {
      filter: ['script', 'style', 'noscript'],
      replacement: () => ''
    });

    let markdown = '';

    // Add frontmatter
    const timestamp = new Date().toISOString();
    markdown += `---\n`;
    markdown += `exported: ${timestamp}\n`;
    markdown += `source: NotebookLM\n`;
    markdown += `---\n\n`;
    markdown += `# NotebookLM Conversation\n\n`;
    markdown += `Exported: ${new Date().toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    // Convert each message
    messages.forEach((msg, index) => {
      const role = msg.role === 'user' ? 'User' : 'Assistant';
      markdown += `## ${role}\n\n`;

      const htmlContent = msg.content.innerHTML;
      const markdownContent = turndownService.turndown(htmlContent);

      markdown += markdownContent.trim() + '\n\n';

      if (index < messages.length - 1) {
        markdown += `---\n\n`;
      }
    });

    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    return markdown;
  }

  /**
   * Generate filename for chat export
   */
  function generateChatFilename() {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
    return `notebooklm-chat-${dateStr}-${timeStr}.md`;
  }

  /**
   * Download markdown content as a file
   */
  function downloadMarkdown(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 100);

    console.log(`[NotebookLM Exporter] Downloaded: ${filename}`);
  }

  /**
   * Show success message on button
   */
  function showSuccessMessage(button, originalText) {
    button.textContent = '✅ Downloaded!';
    button.style.background = '#34a853';
    button.style.opacity = '1';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '#1a73e8';
      button.disabled = false;
    }, 2000);
  }

  /**
   * Show error message on button
   */
  function showErrorMessage(button, message, originalText) {
    button.textContent = `❌ ${message}`;
    button.style.background = '#ea4335';
    button.style.opacity = '1';
    button.style.fontSize = '12px';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '#1a73e8';
      button.style.fontSize = '14px';
      button.disabled = false;
    }, 5000);
  }

  /**
   * DOM Observer to handle SPA navigation and dynamic content
   */
  class NotebookObserver {
    constructor() {
      this.lastUrl = location.href;
      this.observer = null;
      this.persistenceInterval = null;
    }

    start() {
      console.log('[NotebookLM Exporter] Starting observer...');

      // Initial injection attempt
      this.attemptInjection();

      // Watch for DOM changes (navigation, loading, etc.)
      this.observer = new MutationObserver((mutations) => {
        // Check for URL change
        if (location.href !== this.lastUrl) {
          console.log('[NotebookLM Exporter] URL changed:', location.href);
          this.lastUrl = location.href;
          this.attemptInjection();
        }

        // Check for relevant DOM additions
        let shouldInject = false;
        for (const mutation of mutations) {
          if (mutation.addedNodes.length > 0) {
            shouldInject = true;
            break;
          }
        }

        if (shouldInject) {
          this.attemptInjection();
        }
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Persistence check: Ensure buttons stay in the DOM
      // This handles cases where the framework removes our buttons after injection
      this.persistenceInterval = setInterval(() => {
        this.attemptInjection();
      }, 1000);
    }

    attemptInjection() {
      // Try to inject buttons if toolbars are present
      injectExportButtons();
      injectStudioCheckboxes();
    }
  }

  /**
   * Main entry point
   */
  function main() {
    try {
      console.log('[NotebookLM Exporter] Initializing V3 (SPA Support)...');
      const observer = new NotebookObserver();
      observer.start();
    } catch (error) {
      console.debug('[NotebookLM Exporter] Initialization failed:', error);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }

})();
