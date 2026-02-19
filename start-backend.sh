#!/bin/bash

echo "🚀 Iniciando Backend - ENEM Análise"
echo "Criação: @HARRISONCOSTA"
echo ""

cd backend

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "⚙️  Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️  ATENÇÃO: Configure as credenciais do PostgreSQL no arquivo backend/.env"
fi

echo ""
echo "✅ Iniciando servidor..."
npm run dev
