#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║     🎓 ENEM ANÁLISE - Setup Completo do Sistema           ║"
echo "║                                                            ║"
echo "║     Criação e Desenvolvimento: @HARRISONCOSTA             ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Backend
echo -e "${BLUE}📦 [1/4] Instalando dependências do Backend...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependências do backend instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  Erro ao instalar dependências do backend${NC}"
fi

# Criar .env se não existir
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Arquivo .env criado. Configure as credenciais do PostgreSQL!${NC}"
fi

cd ..

# 2. Mobile
echo ""
echo -e "${BLUE}📱 [2/4] Instalando dependências do Mobile...${NC}"
cd mobile
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependências do mobile instaladas${NC}"
else
    echo -e "${YELLOW}⚠️  Erro ao instalar dependências do mobile${NC}"
fi

cd ..

# 3. Instruções do Banco de Dados
echo ""
echo -e "${BLUE}🗄️  [3/4] Configuração do Banco de Dados${NC}"
echo ""
echo "Execute os seguintes comandos para configurar o PostgreSQL:"
echo ""
echo "  1. Criar banco de dados:"
echo "     createdb enem_analise"
echo ""
echo "  2. Executar migrações:"
echo "     cd backend && npm run migrate"
echo ""

# 4. Scripts de inicialização
echo -e "${BLUE}🚀 [4/4] Tornando scripts executáveis...${NC}"
chmod +x start-backend.sh
chmod +x start-mobile.sh
chmod +x setup.sh
echo -e "${GREEN}✅ Scripts configurados${NC}"

# Resumo final
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    ✅ SETUP CONCLUÍDO                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Próximos passos:${NC}"
echo ""
echo "1. Configure o PostgreSQL:"
echo "   • Edite backend/.env com suas credenciais"
echo "   • Execute: createdb enem_analise"
echo "   • Execute: cd backend && npm run migrate"
echo ""
echo "2. Configure o IP da API no mobile:"
echo "   • Edite mobile/src/services/api.js"
echo "   • Ajuste API_BASE_URL para seu IP local"
echo ""
echo "3. Inicie os servidores:"
echo "   • Backend: ./start-backend.sh"
echo "   • Mobile: ./start-mobile.sh"
echo ""
echo -e "${YELLOW}📚 Documentação completa em README.md${NC}"
echo ""
