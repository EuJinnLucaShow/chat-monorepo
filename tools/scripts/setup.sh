#!/bin/bash

echo "🚀 Налаштування Chat монорепозиторія..."

# Перевіряємо наявність pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Встановлюємо pnpm..."
    npm install -g pnpm
fi

# Встановлюємо залежності
echo "📦 Встановлюємо залежності..."
pnpm install

# Збираємо спільні пакети
echo "🏗️ Збираємо спільні пакети..."
pnpm run build --filter @chat/shared

echo "✅ Налаштування завершено!"
echo ""
echo "🔥 Для запуску розробки:"
echo "   pnpm dev"
echo ""
echo "🚀 Для запуску через Docker:"
echo "   pnpm docker:up"