# PV-ESS

## 簡介

PV-ESS（光儲系統）是一個智能能源管理系統，能夠有效地安排儲存的太陽能，並透過 AI 預測最佳的充放電時間。此外，系統提供即時數據監測功能，幫助使用者提升能源利用效率。

## 功能

- **智慧排程**：根據太陽能發電量與用電需求，動態調整充放電計劃。
- **即時監測**：透過 Web 介面監控系統運行狀態、電池電量與功率變化。
- **多設備支援**：透過 WebSocket 實現即時數據同步，支援多裝置同時監控。

## 技術棧

### **Frontend**

- Vue 3
- TailwindCSS
- ShadCN
- TypeScript
- Pinia

### **Backend**

- Express.js
- JWT 驗證機制
- Redis（快取與即時數據存儲）
- PostgreSQL（數據庫）
- MongoDB replica sets (Real time data Access)
- Socket.io（即時通訊）

### **開發工具**

- pnpm
- Docker Compose
- Turborepo（單體倉庫管理）


## 運行方式

## 本地端啟動(已容器化)
```sh
pnpm run docker-rebuild
```
### **服務端口**

| 服務       | 端口 |
| ---------- | ---- |
| 前端       | 5173 |
| 後端       | 3000 |
| PostgreSQL | 5432 |
| PgAdmin    | 5050 |
| Redis      | 6379 |

## 可擴展性
- LLM 數據分析或圖表生成
- Kubernetes 新增高可用性 高併發
- 通訊軟件警示通知(Telegram/Line)
- PWA多裝置相容

## 相關資源

- [Vue.js 官方網站](https://vuejs.org/)
- [Express.js 官方網站](https://expressjs.com/)
- [TailwindCSS 官方網站](https://tailwindcss.com/)
- [ShadCN 官方網站](https://ui.shadcn.com/)
- [Turborepo 官方網站](https://turbo.build/repo)
- [Vercel 官方網站](https://vercel.com/)
