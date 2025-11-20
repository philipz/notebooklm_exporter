# Chrome Web Store 上架指南

本指南將協助您將 NotebookLM Markdown Exporter 上架到 Chrome Web Store。

## 📋 前置準備

### 1. Chrome Web Store 開發者帳號

1. 前往 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. 使用 Google 帳號登入
3. 支付一次性開發者註冊費用 **$5 USD**
4. 同意開發者協議

### 2. 準備必要文件

已完成的文件：
- ✅ `manifest.json` - 擴充功能配置
- ✅ `PRIVACY_POLICY.md` - 隱私政策
- ✅ `README.md` - 說明文件
- ✅ `icons/icon1024.png` - 大圖示 (1024x1024)
- ✅ `icons/icon128.png` - 中圖示 (128x128)

## 🎨 需要準備的圖片資產

### 必需圖片

#### 1. 商店圖示 (Store Icon)
- ✅ **已有**: `icons/icon128.png` (128x128px)
- 用途：顯示在 Chrome Web Store 的搜尋結果和擴充功能頁面

#### 2. 截圖 (Screenshots) - **必需至少 1 張**
- 尺寸：1280x800px 或 640x400px
- 格式：PNG 或 JPEG
- 數量：至少 1 張，最多 5 張
- 內容建議：
  - 截圖 1：NotebookLM 頁面顯示匯出按鈕的位置
  - 截圖 2：點擊匯出按鈕後的成功提示
  - 截圖 3：匯出的 Markdown 檔案範例（在文字編輯器中開啟）
  - 截圖 4：Chrome 擴充功能管理頁面顯示已安裝

### 可選圖片（但強烈建議）

#### 3. 宣傳小圖 (Small Promotional Tile)
- 尺寸：440x280px
- 格式：PNG 或 JPEG
- 用途：在 Chrome Web Store 的精選區域顯示

#### 4. 宣傳大圖 (Marquee Promotional Tile)
- 尺寸：1400x560px
- 格式：PNG 或 JPEG
- 用途：如果被 Chrome Web Store 精選，會顯示在首頁

#### 5. YouTube 影片（可選）
- 展示擴充功能如何使用的短片
- 可以提升安裝率

## 📦 打包擴充功能

### 方法 1：使用本專案的打包腳本

```bash
cd /home/user/notebooklm_exporter
zip -r notebooklm-exporter-v1.0.0.zip . \
  -x "*.git*" \
  -x "*.md" \
  -x "node_modules/*" \
  -x ".DS_Store"
```

### 方法 2：手動選擇檔案

只需要包含以下檔案和資料夾：
```
notebooklm_exporter.zip
├── manifest.json
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── lib/
│   └── turndown.min.js
└── content/
    ├── content.js
    └── styles.css
```

**不要包含：**
- `.git/` 資料夾
- `README.md`、`INSTALL.md` 等說明文件（可以在商店頁面上另外提供）
- `node_modules/`
- `.gitignore`
- `IMPLEMENTATION_SUMMARY.md`

## 📝 填寫 Chrome Web Store 資訊

### 基本資訊

#### 產品名稱（Product Name）
```
NotebookLM Markdown Exporter
```

#### 簡短說明（Summary）- 最多 132 字元
```
Export NotebookLM conversations to clean, formatted Markdown files with one click. Local processing, no data collection.
```

或中文版：
```
一鍵將 NotebookLM 對話匯出為格式化的 Markdown 檔案。本地處理，不收集任何資料。
```

#### 詳細說明（Detailed Description）

建議使用以下內容（可以從 README.md 改寫）：

```markdown
## Overview

NotebookLM Markdown Exporter is a privacy-focused Chrome extension that exports your NotebookLM chat conversations to clean, readable Markdown format.

## ✨ Features

• **One-Click Export**: Export entire conversations with a single button click
• **Clean Content**: Automatically removes UI elements, buttons, and suggested questions
• **Markdown Format**: Clean, readable Markdown with proper formatting
• **Conversation Structure**: Preserves user/assistant message flow with clear headings
• **Metadata**: Includes export timestamp and source information
• **100% Local Processing**: All conversion happens in your browser - no external services, no data collection
• **Privacy First**: No tracking, no analytics, no data transmission

## 🚀 How to Use

1. Navigate to NotebookLM (https://notebooklm.google.com)
2. Start or open a chat conversation
3. Click the "Export" button at the top of the chat
4. Your conversation downloads as a `.md` file

That's it! Your conversation is now saved in a portable, readable Markdown format.

## 📄 Exported Format

The exported Markdown includes:
- YAML frontmatter with timestamp and source
- Clear headings for each User and Assistant message
- Preserved formatting (lists, code blocks, links, emphasis)
- Clean content with UI elements removed
- Proper message separation

## 🔒 Privacy & Security

- **Zero Data Collection**: We don't collect, store, or transmit any data
- **No External Requests**: All processing happens locally in your browser
- **No Tracking**: No analytics, no cookies, no third-party services
- **Minimal Permissions**: Only accesses NotebookLM pages
- **Open Source**: Code available for review

## 🛠️ Technical Details

- Manifest V3 compliant
- Uses Turndown.js for HTML-to-Markdown conversion
- Runs only on notebooklm.google.com
- Local file processing only

## ⚠️ Important Notes

- This is an unofficial, community-developed tool
- Not affiliated with Google or NotebookLM
- Works only on Chrome and Chromium-based browsers

## 💬 Support

For issues, feedback, or questions, please visit our GitHub repository or refer to the documentation.

---

**Note**: Your conversations stay private. This extension operates entirely within your browser with no external communication.
```

#### 類別（Category）
選擇：**Productivity** (生產力)

#### 語言（Language）
- 主要語言：**English**
- 可以添加：**繁體中文** (如果您想提供中文版說明)

### 隱私政策

#### Privacy Practices（隱私實踐）

在提交時，需要聲明：

1. **Do you collect or transmit user data?**
   - 選擇：**No** ❌

2. **Do you use or allow the use of remote code?**
   - 選擇：**No** ❌

3. **Is the primary purpose of the extension obscured?**
   - 選擇：**No** ❌

#### Privacy Policy URL（隱私政策網址）

您需要將 `PRIVACY_POLICY.md` 上傳到公開網址，例如：
- GitHub Pages
- 您的個人網站
- GitHub 原始檔案連結

範例：
```
https://github.com/[your-username]/notebooklm_exporter/blob/main/PRIVACY_POLICY.md
```

或者，您可以使用 GitHub Pages：
```
https://[your-username].github.io/notebooklm_exporter/privacy-policy
```

### 權限說明（Permission Justification）

當 Chrome Web Store 詢問為何需要某些權限時：

#### `host_permissions` for `https://notebooklm.google.com/*`
```
Required to inject the export button and content script into NotebookLM pages, and to read conversation content when the user clicks export. The extension only runs on NotebookLM and does not access any other websites.
```

## 🚀 上架步驟

### Step 1: 登入開發者控制台

1. 前往 https://chrome.google.com/webstore/devconsole/
2. 點擊 **"New Item"** 或 **"新增項目"**

### Step 2: 上傳 ZIP 檔案

1. 上傳剛才打包的 `.zip` 檔案
2. 等待系統驗證（檢查 manifest.json 和檔案結構）
3. 如果有錯誤，修正後重新上傳

### Step 3: 填寫商店列表資訊

依照上面「填寫 Chrome Web Store 資訊」的內容填寫：

- Product name（產品名稱）
- Summary（摘要）
- Detailed description（詳細說明）
- Category（類別）
- Language（語言）

### Step 4: 上傳圖片資產

1. **Store icon**: 上傳 `icons/icon128.png`
2. **Screenshots**: 上傳截圖（至少 1 張）
3. **Small promotional tile** (可選): 440x280px
4. **Marquee promotional tile** (可選): 1400x560px

### Step 5: 設定隱私與權限

1. 回答隱私問題（如上所述）
2. 提供隱私政策 URL
3. 說明權限用途

### Step 6: 選擇可見性與定價

#### Visibility（可見性）
- **Public**: 所有人都能搜尋和安裝
- **Unlisted**: 只有有連結的人可以安裝
- **Private**: 只有特定 Google 帳號可以安裝

建議選擇：**Public**

#### Pricing（定價）
- 選擇：**Free** (免費)

### Step 7: 提交審核

1. 檢查所有資訊是否正確
2. 點擊 **"Submit for Review"** 或 **"提交審核"**
3. 等待 Google 審核（通常 1-3 個工作天，可能更快）

## ⏰ 審核時間與流程

### 預期時間
- **快速審核**: 幾小時到 1 天
- **一般審核**: 1-3 個工作天
- **複雜審核**: 最多 7 個工作天（如果需要額外驗證）

### 審核內容
Google 會檢查：
- ✅ Manifest 檔案格式正確
- ✅ 權限使用合理且有說明
- ✅ 無惡意程式碼
- ✅ 隱私政策完整且正確
- ✅ 商店列表資訊清楚易懂
- ✅ 截圖和說明符合實際功能
- ✅ 不違反 Chrome Web Store 政策

### 可能被拒絕的原因
- ❌ 權限過多或未充分說明
- ❌ 隱私政策不完整或錯誤
- ❌ 程式碼有安全問題
- ❌ 截圖與功能不符
- ❌ 說明誤導或不清楚

## ✅ 核准後

審核通過後：
1. 您會收到電子郵件通知
2. 擴充功能將出現在 Chrome Web Store
3. 用戶可以搜尋並安裝
4. 您可以在開發者控制台查看安裝統計

### 取得商店連結
格式：
```
https://chrome.google.com/webstore/detail/[extension-id]
```

範例：
```
https://chrome.google.com/webstore/detail/notebooklm-markdown-export/abcdefghijklmnopqrstuvwxyz123456
```

## 🔄 更新擴充功能

未來要更新時：

1. 修改程式碼
2. 更新 `manifest.json` 中的 `version` 號碼（例如：1.0.0 → 1.1.0）
3. 重新打包成 ZIP
4. 在開發者控制台上傳新版本
5. 填寫更新說明（What's new）
6. 提交審核

### 版本號碼規則
遵循 [Semantic Versioning](https://semver.org/)：
- **Major (主版本)**: 1.x.x - 重大變更或不相容更新
- **Minor (次版本)**: x.1.x - 新功能，向後相容
- **Patch (修訂版)**: x.x.1 - Bug 修復

範例：
- `1.0.0` - 初始版本
- `1.0.1` - Bug 修復
- `1.1.0` - 新增功能
- `2.0.0` - 重大變更

## 📊 發布後的最佳實踐

### 1. 監控回饋
- 定期檢查 Chrome Web Store 的使用者評論
- 回覆使用者問題和建議
- 追蹤常見問題

### 2. 更新 README
- 在 README.md 中加入 Chrome Web Store 安裝連結
- 更新安裝說明

### 3. 宣傳
- 在社群媒體分享
- 在相關論壇發布（如 Reddit r/chrome, r/productivity）
- 寫部落格文章介紹

### 4. 維護
- 關注 NotebookLM 的 UI 變更
- 定期測試擴充功能是否正常運作
- 即時修復問題

## 🔗 有用的連結

- [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Chrome Web Store Program Policies](https://developer.chrome.com/docs/webstore/program-policies/)
- [Best Practices for Chrome Extensions](https://developer.chrome.com/docs/extensions/mv3/quality_guidelines/)

## 💡 提示

1. **高品質截圖很重要**: 好的截圖可以大幅提升安裝率
2. **詳細說明**: 清楚說明功能和使用方式
3. **快速回覆**: 積極回應使用者評論和問題
4. **保持更新**: 定期更新以支援 NotebookLM 的變更
5. **收集回饋**: 根據使用者回饋改進擴充功能

## ❓ 常見問題

### Q: 需要多久時間才能上架？
A: 審核通常需要 1-3 個工作天，但可能更快或更慢。

### Q: 可以在審核期間修改嗎？
A: 可以，但修改後需要重新提交審核。

### Q: 審核被拒絕怎麼辦？
A: Google 會提供拒絕原因，修正後可以重新提交。

### Q: 需要提供隱私政策嗎？
A: 是的，即使不收集資料也需要說明隱私實踐。

### Q: 可以改成付費擴充功能嗎？
A: 可以，但需要設定 Google Payments Merchant Account。

---

## 📋 檢查清單

在提交前確認：

- [ ] 已註冊 Chrome Web Store 開發者帳號並支付 $5
- [ ] 已準備好 ZIP 檔案（只包含必要檔案）
- [ ] 已準備至少 1 張截圖 (1280x800px)
- [ ] 已上傳隱私政策到公開 URL
- [ ] 已填寫完整的產品名稱和說明
- [ ] 已選擇正確的類別
- [ ] 已說明所有權限的用途
- [ ] 已選擇可見性設定（建議 Public）
- [ ] 已確認所有圖片格式和尺寸正確
- [ ] 已測試 ZIP 檔案可以正常載入

完成所有項目後，就可以提交審核了！

---

**祝您順利上架！** 🚀

如有任何問題，請參考 Chrome Web Store 的官方文件或開發者支援。
