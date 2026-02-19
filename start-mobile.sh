#!/bin/bash

echo "📱 Iniciando App Mobile - ENEM Análise"
echo "Criação: @HARRISONCOSTA"
echo ""

cd mobile

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo ""
echo "✅ Iniciando Expo..."
echo "⚠️  LEMBRE-SE: Configure o IP da API em mobile/src/services/api.js"
echo ""
npm start
