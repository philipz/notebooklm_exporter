# 截圖與宣傳圖片準備指南

本指南說明如何準備 Chrome Web Store 所需的截圖和宣傳圖片。

## 📸 必需截圖 (Screenshots)

Chrome Web Store **至少需要 1 張截圖**，最多可以上傳 5 張。

### 尺寸要求
- **推薦尺寸**: 1280x800px
- **替代尺寸**: 640x400px
- **格式**: PNG 或 JPEG
- **檔案大小**: 每張最大 5MB
- **注意**: 所有截圖必須使用相同尺寸

### 建議截圖內容

#### 截圖 1: 擴充功能按鈕位置
**重要性**: ⭐⭐⭐⭐⭐
- 顯示 NotebookLM 聊天頁面
- 清楚標示「Export」按鈕的位置
- 最好有一些對話內容在畫面中
- 可以用箭頭或圓圈標注按鈕位置

**如何截圖**:
1. 前往 https://notebooklm.google.com
2. 開啟或建立一個聊天對話
3. 確保「Export」按鈕清楚可見
4. 使用截圖工具（Windows: Win+Shift+S，Mac: Cmd+Shift+4）
5. 裁切為 1280x800px

#### 截圖 2: 匯出成功提示
**重要性**: ⭐⭐⭐⭐
- 顯示點擊匯出按鈕後的成功狀態
- 按鈕應顯示「✓ Exported!」或類似文字
- 展示使用者回饋

#### 截圖 3: 匯出的 Markdown 檔案
**重要性**: ⭐⭐⭐⭐⭐
- 在文字編輯器或 Markdown 查看器中開啟匯出的檔案
- 顯示格式化的 Markdown 內容
- 可以看到 YAML frontmatter、標題、對話內容
- 推薦使用：VS Code、Typora、Obsidian 等

**建議編輯器**:
- VS Code（免費，顯示語法高亮）
- Typora（付費，顯示渲染後的 Markdown）
- Obsidian（免費，適合展示）
- Notion（匯入 Markdown 後截圖）

#### 截圖 4: 擴充功能安裝頁面
**重要性**: ⭐⭐⭐
- Chrome 擴充功能管理頁面 (chrome://extensions/)
- 顯示「NotebookLM Markdown Exporter」已安裝
- 展示權限和說明

#### 截圖 5: 對話範例
**重要性**: ⭐⭐⭐
- 顯示 NotebookLM 中豐富的對話內容
- 展示擴充功能適用的場景
- 可以包含列表、程式碼、連結等多種格式

### 截圖最佳實踐

✅ **應該做**:
- 使用高解析度、清晰的截圖
- 確保文字清楚可讀
- 使用真實但專業的範例內容
- 保持一致的視覺風格
- 考慮加入註解或箭頭指示重點

❌ **不應該**:
- 包含個人敏感資訊
- 使用模糊或低解析度的圖片
- 截圖包含無關的瀏覽器分頁或視窗
- 使用不當或冒犯性的範例內容
- 包含錯誤訊息或不完整的畫面

## 🎨 宣傳圖片 (Promotional Images)

這些圖片是**可選的**，但強烈建議準備，可以提升曝光率。

### 小型宣傳圖 (Small Promotional Tile)

**尺寸**: 440x280px
**格式**: PNG 或 JPEG
**用途**: 在 Chrome Web Store 的類別頁面和搜尋結果中顯示

**設計建議**:
- 簡潔的背景（純色或漸層）
- 大型、易讀的標題: "NotebookLM Markdown Exporter"
- 簡短標語: "Export Chats to Markdown"
- 包含擴充功能圖示
- 使用品牌顏色（如果有）

**範例布局**:
```
┌─────────────────────────┐
│                         │
│   [Icon]                │
│                         │
│   NotebookLM            │
│   Markdown Exporter     │
│                         │
│   One-click export      │
│   to clean Markdown     │
│                         │
└─────────────────────────┘
    440x280px
```

### 大型宣傳圖 (Marquee Promotional Tile)

**尺寸**: 1400x560px
**格式**: PNG 或 JPEG
**用途**: 如果被 Chrome Web Store 精選，會顯示在首頁橫幅

**設計建議**:
- 更大的視覺空間，可以更有創意
- 包含截圖範例或使用情境
- 清楚的價值主張
- Call-to-action: "Install Now" 或 "Get Started"

**範例布局**:
```
┌──────────────────────────────────────────────┐
│  [Icon]  NotebookLM Markdown Exporter        │
│                                               │
│  Export your NotebookLM conversations         │
│  to clean, formatted Markdown files           │
│                                               │
│  ✓ One-click export  ✓ Privacy-first         │
│  ✓ Clean formatting  ✓ Local processing      │
│                                               │
│         [Screenshot Preview]                  │
└──────────────────────────────────────────────┘
              1400x560px
```

## 🛠️ 製作工具推薦

### 截圖工具

#### Windows
- **Snipping Tool**: 內建工具（Win+Shift+S）
- **ShareX**: 免費開源，功能強大
- **Greenshot**: 免費，易用

#### Mac
- **內建截圖**: Cmd+Shift+4（區域）或 Cmd+Shift+3（全螢幕）
- **CleanShot X**: 付費，專業級
- **Skitch**: 免費，可以加註解

#### 跨平台
- **Lightshot**: 免費，簡單易用
- **Flameshot**: 免費開源

### 圖片編輯工具

#### 簡單編輯（裁切、調整大小）
- **Preview** (Mac 內建)
- **Photos** (Windows 內建)
- **GIMP**: 免費開源，類似 Photoshop
- **Paint.NET**: Windows，免費

#### 專業設計（製作宣傳圖）
- **Canva**: 線上工具，免費版足夠使用
  - 有現成的 Chrome Extension 模板
  - 可以直接設定自訂尺寸（440x280, 1400x560）
- **Figma**: 免費，專業設計工具
- **Adobe Photoshop**: 付費，專業級
- **Adobe Express**: 免費線上工具

#### 推薦工作流程（使用 Canva）

1. **前往 Canva**
   - 註冊免費帳號: https://www.canva.com

2. **建立自訂尺寸**
   - 點擊「建立設計」
   - 選擇「自訂尺寸」
   - 輸入 440 x 280 像素（小型宣傳圖）

3. **設計**
   - 選擇範本或從空白開始
   - 加入文字、圖示、背景
   - 使用品牌顏色

4. **匯出**
   - 點擊「分享」→「下載」
   - 選擇 PNG 格式
   - 下載

5. **重複步驟製作大型宣傳圖**
   - 尺寸設定為 1400 x 560 像素

## 📐 調整圖片尺寸

如果截圖尺寸不正確，可以使用以下工具調整：

### 線上工具
- **ResizeImage.net**: https://resizeimage.net
- **BulkResizePhotos**: https://bulkresizephotos.com
- **iLoveIMG**: https://www.iloveimg.com/resize-image

### 命令列工具 (ImageMagick)
```bash
# 安裝 ImageMagick
# Mac: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# 調整為 1280x800
convert screenshot.png -resize 1280x800^ -gravity center -extent 1280x800 screenshot_1280x800.png

# 批次處理多張截圖
for img in *.png; do
  convert "$img" -resize 1280x800^ -gravity center -extent 1280x800 "resized_$img"
done
```

## ✅ 檢查清單

在上傳到 Chrome Web Store 之前：

### 截圖
- [ ] 至少準備 1 張截圖（推薦 3-5 張）
- [ ] 所有截圖尺寸為 1280x800px 或 640x400px
- [ ] 所有截圖使用相同尺寸
- [ ] 格式為 PNG 或 JPEG
- [ ] 每張圖片小於 5MB
- [ ] 沒有包含敏感個人資訊
- [ ] 圖片清晰、專業
- [ ] 展示擴充功能的核心功能

### 宣傳圖片（可選但推薦）
- [ ] 小型宣傳圖: 440x280px
- [ ] 大型宣傳圖: 1400x560px（如果想爭取精選）
- [ ] 設計專業、吸引人
- [ ] 清楚傳達擴充功能的價值

## 💡 進階技巧

### 1. 加入視覺註解
使用工具在截圖上加入：
- 箭頭指向重要元素
- 圓圈或方框標注重點
- 簡短文字說明
- 數字標示步驟順序

**推薦工具**: Skitch (Mac), ShareX (Windows), Markup (Mac 內建)

### 2. 統一視覺風格
- 使用一致的字體和顏色
- 保持相同的註解樣式
- 使用品牌顏色（如果有）

### 3. 展示使用情境
- 在截圖中展示真實的使用場景
- 使用有意義的範例對話
- 展示不同類型的內容（列表、程式碼等）

### 4. A/B 測試
- 準備多個版本的截圖
- 觀察哪個版本的安裝率較高
- Chrome Web Store 允許更新截圖

## 📊 截圖範例文字內容

如果需要製作示範截圖，可以使用以下範例對話：

### 範例 1: 技術問題
```
User: 如何在 Python 中讀取 CSV 檔案？