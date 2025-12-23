# Firebase 安全設定指南

## 1. Security Rules 設定

### 設定位置
Firebase Console > 你的專案 > **Realtime Database** > **Rules** 分頁

### 步驟
1. 前往 https://console.firebase.google.com/
2. 選擇你的專案
3. 左側選單點擊 **Build** > **Realtime Database**
4. 點擊上方的 **Rules** 分頁
5. 將 `database.rules.json` 的內容貼上
6. 點擊 **Publish**

### Rules 說明
```json
{
  "rules": {
    "shrine": {
      "items": {
        ".read": true,  // 任何人都可以讀取
        "$itemId": {
          ".write": true,
          ".validate": "..."  // 驗證資料格式
        }
      }
    },
    ".read": false,   // 其他路徑禁止讀取
    ".write": false   // 其他路徑禁止寫入
  }
}
```

驗證內容：
- `type` 必須是 candle, bouquet, drink, cookie, plush 其中之一
- `x`, `y` 必須是 0-100 的數字
- `createdAt` 必須是伺服器時間戳
- `message` 如果有的話，必須是字串且不超過 200 字元

---

## 2. App Check 設定（防止惡意腳本）

### 設定位置
Firebase Console > 你的專案 > **App Check**

### 步驟

#### A. 在 Firebase 啟用 App Check
1. 前往 Firebase Console
2. 左側選單點擊 **Build** > **App Check**
3. 點擊 **Get started**
4. 選擇 **Web app**
5. 選擇 Provider: **reCAPTCHA v3**
6. 輸入你的網站網域

#### B. 取得 reCAPTCHA Site Key
1. 前往 https://www.google.com/recaptcha/admin
2. 點擊 **+** 建立新的 site key
3. 選擇 **reCAPTCHA v3**
4. 輸入你的網域（例如 `your-site.web.app`）
5. 複製 **Site Key**

#### C. 在專案中設定

安裝套件：
```bash
npm install firebase
```

修改 `src/lib/firebase.js`：
```javascript
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue, serverTimestamp } from 'firebase/database'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const firebaseConfig = {
  // ... 你的設定
}

let app = null
let database = null

export function initFirebase() {
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase config not found. Running in local-only mode.')
    return null
  }

  try {
    app = initializeApp(firebaseConfig)

    // 啟用 App Check
    if (import.meta.env.PROD) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true
      })
    }

    database = getDatabase(app)
    return database
  } catch (error) {
    console.error('Firebase initialization error:', error)
    return null
  }
}

// ... 其餘程式碼
```

在 `.env` 加入：
```
VITE_RECAPTCHA_SITE_KEY=你的_reCAPTCHA_site_key
```

#### D. 強制啟用 App Check
1. 回到 Firebase Console > **App Check**
2. 在 **Realtime Database** 區塊點擊 **Enforce**
3. 這會讓沒有通過 App Check 的請求被拒絕

---

## 3. 預算警報設定

### 設定位置
Google Cloud Console > **Billing** > **Budgets & alerts**

### 步驟

1. 前往 https://console.cloud.google.com/billing
2. 選擇你的 Billing Account
3. 左側選單點擊 **Budgets & alerts**
4. 點擊 **CREATE BUDGET**

### 建議設定

#### 基本資訊
- **Name**: Spontaneous Shrine Budget
- **Projects**: 選擇你的 Firebase 專案

#### 預算金額
- **Budget type**: Specified amount
- **Target amount**: 建議設 $5 或 $10 USD（依你的需求）

#### 警報門檻
建議設定多個門檻：
| 百分比 | 說明 |
|--------|------|
| 50% | 提早警告 |
| 90% | 即將超標 |
| 100% | 已達預算 |

#### 通知設定
- 勾選 **Email alerts to billing admins and users**
- 可選：連結 Pub/Sub 來觸發自動化動作（例如自動停用服務）

---

## 4. 額外安全建議

### 限制 API Key 來源（選用）

1. 前往 Google Cloud Console > **APIs & Services** > **Credentials**
2. 點擊你的 API Key
3. 在 **Application restrictions** 選擇 **HTTP referrers**
4. 加入允許的網域：
   ```
   https://your-site.web.app/*
   https://your-custom-domain.com/*
   localhost:*
   ```

### 監控使用量

1. Firebase Console > **Realtime Database** > **Usage** 分頁
2. 可以看到：
   - Connections（連線數）
   - Storage（儲存空間）
   - Downloads（下載量）

### 設定資料庫配額

Firebase Console > **Realtime Database** > **Usage** > **Set spending limit**

---

## 快速檢查清單

- [ ] Security Rules 已設定並發布
- [ ] App Check 已啟用（reCAPTCHA v3）
- [ ] App Check 已強制執行（Enforce）
- [ ] 預算警報已設定
- [ ] API Key 已限制來源（選用）
- [ ] 定期檢查 Usage 監控

---

## 常見問題

### Q: App Check 會影響效能嗎？
A: 影響很小，reCAPTCHA v3 在背景執行，不會顯示驗證碼給使用者。

### Q: 開發時怎麼測試？
A: 在開發環境可以使用 App Check Debug Token：
```javascript
if (import.meta.env.DEV) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
}
```

### Q: 如果被攻擊怎麼辦？
A:
1. 暫時在 Security Rules 設定 `.write": false`
2. 檢查 Firebase Console 的 Usage 找出異常
3. 如果有啟用 App Check，確認 Enforce 已開啟
