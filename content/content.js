/**
 * NotebookLM Markdown Exporter - Content Script
 *
 * This script:
 * 1. Waits for the NotebookLM chat interface to load
 * 2. Injects an "Export to Markdown" button
 * 3. Extracts chat messages when clicked
 * 4. Converts HTML to Markdown using Turndown.js
 * 5. Downloads the result as a .md file
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    TIMEOUT_MS: 10000,
    RETRY_DELAY_MS: 100,
    MAX_RETRIES: 100, // 10 seconds total
    SELECTORS: {
      // Try multiple selectors in priority order
      MAIN_CONTAINER: ['[role="main"]', '.chat-container', 'main'],
      MESSAGE_CONTAINER: ['.messages', '.conversation', '[role="log"]'],
      MESSAGE_ITEM: ['[data-message-id]', '.message', '.chat-message'],
      USER_MESSAGE: ['.user-message', '[data-role="user"]'],
      ASSISTANT_MESSAGE: ['.assistant-message', '[data-role="assistant"]']
    }
  };

  /**
   * Wait for the chat container to appear in the DOM
   * Tries multiple selector strategies with retries
   */
  async function waitForChatContainer() {
    let attempts = 0;

    while (attempts < CONFIG.MAX_RETRIES) {
      // Try each selector in priority order
      for (const selector of CONFIG.SELECTORS.MAIN_CONTAINER) {
        const container = document.querySelector(selector);
        if (container) {
          console.log(`[NotebookLM Exporter] Found container with selector: ${selector}`);
          return container;
        }
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS));
      attempts++;
    }

    throw new Error('Chat container not found after timeout');
  }

  /**
   * Inject the export button into the chat interface
   */
  function injectExportButton(container) {
    // Check if button already exists
    if (document.getElementById('notebooklm-export-btn')) {
      console.log('[NotebookLM Exporter] Button already exists');
      return;
    }

    const button = document.createElement('button');
    button.id = 'notebooklm-export-btn';
    button.className = 'notebooklm-export-button';
    button.textContent = '📄 Export to Markdown';
    button.setAttribute('aria-label', 'Export conversation to Markdown');

    // Add click handler
    button.addEventListener('click', async () => {
      try {
        button.disabled = true;
        button.textContent = '⏳ Exporting...';

        const messages = extractChatMessages(container);
        if (messages.length === 0) {
          throw new Error('No messages found to export');
        }

        const markdown = convertToMarkdown(messages);
        const filename = generateFilename();
        downloadMarkdown(markdown, filename);

        showSuccessMessage(button);
      } catch (error) {
        console.error('[NotebookLM Exporter] Export failed:', error);
        showErrorMessage(button, error.message);
      }
    });

    // Insert button at the top of the container
    container.insertBefore(button, container.firstChild);
    console.log('[NotebookLM Exporter] Button injected successfully');
  }

  /**
   * Extract chat messages from the DOM
   * Returns array of {role: 'user'|'assistant', content: HTMLElement}
   */
  function extractChatMessages(container) {
    const messages = [];

    // Try to find message container
    let messageContainer = container;
    for (const selector of CONFIG.SELECTORS.MESSAGE_CONTAINER) {
      const found = container.querySelector(selector);
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

    // If no messages found with specific selectors, try generic approach
    if (messageElements.length === 0) {
      // Look for alternating div patterns or common chat structures
      const allDivs = Array.from(messageContainer.querySelectorAll('div'));
      messageElements = allDivs.filter(div => {
        // Filter for elements that look like messages
        const text = div.textContent?.trim();
        return text && text.length > 10 && div.children.length > 0;
      });
      console.log(`[NotebookLM Exporter] Using generic div selection: ${messageElements.length} candidates`);
    }

    // Extract messages and infer roles
    messageElements.forEach((element, index) => {
      // Skip empty messages
      if (!element.textContent?.trim()) {
        return;
      }

      // Try to determine role from class/attributes
      let role = 'assistant'; // Default to assistant

      for (const selector of CONFIG.SELECTORS.USER_MESSAGE) {
        if (element.matches(selector) || element.querySelector(selector)) {
          role = 'user';
          break;
        }
      }

      // If still assistant, check assistant selectors
      if (role === 'assistant') {
        for (const selector of CONFIG.SELECTORS.ASSISTANT_MESSAGE) {
          if (element.matches(selector) || element.querySelector(selector)) {
            role = 'assistant';
            break;
          }
        }
      }

      // Fallback: alternate based on position (user starts conversations)
      if (messages.length === 0 && role === 'assistant') {
        role = 'user'; // First message is typically from user
      } else if (messages.length > 0) {
        // Alternate roles if we can't determine from DOM
        const lastRole = messages[messages.length - 1].role;
        if (role === lastRole) {
          role = lastRole === 'user' ? 'assistant' : 'user';
        }
      }

      messages.push({
        role,
        content: element.cloneNode(true) // Clone to avoid modifying original
      });
    });

    console.log(`[NotebookLM Exporter] Extracted ${messages.length} messages`);
    return messages;
  }

  /**
   * Convert messages to Markdown format
   */
  function convertToMarkdown(messages) {
    // Initialize Turndown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '_'
    });

    // Add custom rules for better formatting
    turndownService.addRule('removeScripts', {
      filter: ['script', 'style', 'noscript'],
      replacement: () => ''
    });

    // Build markdown content
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

      // Convert HTML to Markdown
      const htmlContent = msg.content.innerHTML;
      const markdownContent = turndownService.turndown(htmlContent);

      markdown += markdownContent.trim() + '\n\n';

      // Add separator between messages (except last)
      if (index < messages.length - 1) {
        markdown += `---\n\n`;
      }
    });

    // Clean up extra whitespace
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    return markdown;
  }

  /**
   * Generate filename for the export
   */
  function generateFilename() {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
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

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);

    console.log(`[NotebookLM Exporter] Downloaded: ${filename}`);
  }

  /**
   * Show success message on button
   */
  function showSuccessMessage(button) {
    button.textContent = '✅ Exported!';
    button.className = 'notebooklm-export-button success';

    setTimeout(() => {
      button.textContent = '📄 Export to Markdown';
      button.className = 'notebooklm-export-button';
      button.disabled = false;
    }, 2000);
  }

  /**
   * Show error message on button
   */
  function showErrorMessage(button, message) {
    button.textContent = `❌ Error: ${message}`;
    button.className = 'notebooklm-export-button error';

    setTimeout(() => {
      button.textContent = '📄 Export to Markdown';
      button.className = 'notebooklm-export-button';
      button.disabled = false;
    }, 3000);
  }

  /**
   * Main entry point
   */
  async function main() {
    try {
      console.log('[NotebookLM Exporter] Initializing...');

      // Wait for chat interface to load
      const container = await waitForChatContainer();

      // Inject export button
      injectExportButton(container);

      console.log('[NotebookLM Exporter] Ready');
    } catch (error) {
      console.error('[NotebookLM Exporter] Initialization failed:', error);

      // Show error notification
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 16px;
        border-radius: 4px;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      errorDiv.textContent = `NotebookLM Exporter Error: ${error.message}`;
      document.body.appendChild(errorDiv);

      setTimeout(() => errorDiv.remove(), 5000);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
