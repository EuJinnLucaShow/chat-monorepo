#!/bin/bash

echo "🐙 Налаштування GitHub репозиторія..."

# Ініціалізуємо git репозиторій
git init

# Додаємо всі файли
git add .

# Перший коміт
git commit -m "🎉 Initial commit: Chat monorepo setup

- Added NestJS backend with WebSocket support
- Added Next.js frontend with real-time chat
- Added shared packages for types and utilities
- Added Docker configuration
- Added development scripts and tooling"

# Налаштовуємо віддалений репозиторій
echo "🔗 Додайте remote repository:"
echo "git remote add origin https://github.com/EuJinnLucaShow/chat-monorepo.git"
echo "git branch -M main"
echo "git push -u origin main"