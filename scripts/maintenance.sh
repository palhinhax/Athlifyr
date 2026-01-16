#!/bin/bash

# Script para ativar/desativar o modo de manutenção
# Uso: ./maintenance.sh [on|off|status]

ENV_FILE=".env"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

case "$1" in
  on)
    echo -e "${YELLOW}🔧 Ativando modo de manutenção...${NC}"
    
    # Verifica se o .env existe
    if [ ! -f "$ENV_FILE" ]; then
      echo -e "${RED}❌ Erro: Ficheiro .env não encontrado${NC}"
      exit 1
    fi
    
    # Remove linhas antigas de MAINTENANCE_MODE
    sed -i '/MAINTENANCE_MODE/d' "$ENV_FILE"
    
    # Adiciona nova linha
    echo 'MAINTENANCE_MODE="true"' >> "$ENV_FILE"
    
    echo -e "${GREEN}✅ Modo de manutenção ativado!${NC}"
    echo -e "${YELLOW}⚠️  Não te esqueças de reiniciar a aplicação:${NC}"
    echo -e "   ${GREEN}pnpm dev${NC} (desenvolvimento)"
    echo -e "   ${GREEN}pm2 restart athlifyr${NC} (produção)"
    ;;
    
  off)
    echo -e "${YELLOW}✅ Desativando modo de manutenção...${NC}"
    
    # Verifica se o .env existe
    if [ ! -f "$ENV_FILE" ]; then
      echo -e "${RED}❌ Erro: Ficheiro .env não encontrado${NC}"
      exit 1
    fi
    
    # Remove linhas de MAINTENANCE_MODE
    sed -i '/MAINTENANCE_MODE/d' "$ENV_FILE"
    
    # Adiciona linha desativada
    echo 'MAINTENANCE_MODE="false"' >> "$ENV_FILE"
    
    echo -e "${GREEN}✅ Modo de manutenção desativado!${NC}"
    echo -e "${YELLOW}⚠️  Não te esqueças de reiniciar a aplicação:${NC}"
    echo -e "   ${GREEN}pnpm dev${NC} (desenvolvimento)"
    echo -e "   ${GREEN}pm2 restart athlifyr${NC} (produção)"
    ;;
    
  status)
    if [ ! -f "$ENV_FILE" ]; then
      echo -e "${RED}❌ Erro: Ficheiro .env não encontrado${NC}"
      exit 1
    fi
    
    if grep -q 'MAINTENANCE_MODE="true"' "$ENV_FILE"; then
      echo -e "${RED}🔧 Modo de manutenção: ATIVO${NC}"
    elif grep -q 'MAINTENANCE_MODE="false"' "$ENV_FILE"; then
      echo -e "${GREEN}✅ Modo de manutenção: INATIVO${NC}"
    else
      echo -e "${YELLOW}⚠️  Modo de manutenção: NÃO CONFIGURADO (considerado inativo)${NC}"
    fi
    ;;
    
  *)
    echo -e "${YELLOW}Uso: $0 {on|off|status}${NC}"
    echo ""
    echo -e "Comandos disponíveis:"
    echo -e "  ${GREEN}on${NC}     - Ativar modo de manutenção"
    echo -e "  ${GREEN}off${NC}    - Desativar modo de manutenção"
    echo -e "  ${GREEN}status${NC} - Ver estado atual"
    echo ""
    exit 1
    ;;
esac
