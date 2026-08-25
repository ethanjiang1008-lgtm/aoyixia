# 再熬一下

一个放在电脑桌面上的打工人情绪陪伴工具。

核心体验：实时工资、工作进度、下班倒计时、目标与轻游戏化反馈。

## 技术栈

- Tauri 2
- React + TypeScript
- Vite
- Zustand

## 本地开发

```bash
npm install
npm run tauri dev
```

## 构建 Windows

```bash
npm install
npm run tauri build
```

GitHub Actions 会在 `main` 分支 push 后自动构建 Windows NSIS/MSI，并上传 `aoyixia-windows` artifact。

## MVP 功能

- 工资 / 日薪 / 时薪实时计算
- 工作时间与下班倒计时
- 桌面风格悬浮卡片 UI
- 愿望目标与工作时间换算
- XP / 社畜等级
- 成就图鉴 UI
- 多主题
- 本地持久化

> 当前版本优先保证核心体验与视觉表现，后续再加入真正的多窗口托盘、桌宠和更完整的成就数据统计。
