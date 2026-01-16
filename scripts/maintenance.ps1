# Script PowerShell para ativar/desativar o modo de manutenção
# Uso: .\maintenance.ps1 [on|off|status]

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('on','off','status')]
    [string]$Action
)

$envFile = ".env"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

switch ($Action) {
    'on' {
        Write-ColorOutput Yellow "🔧 Ativando modo de manutenção..."
        
        if (-not (Test-Path $envFile)) {
            Write-ColorOutput Red "❌ Erro: Ficheiro .env não encontrado"
            exit 1
        }
        
        # Remove linhas antigas de MAINTENANCE_MODE
        $content = Get-Content $envFile | Where-Object { $_ -notmatch 'MAINTENANCE_MODE' }
        Set-Content $envFile $content
        
        # Adiciona nova linha
        Add-Content $envFile 'MAINTENANCE_MODE="true"'
        
        Write-ColorOutput Green "✅ Modo de manutenção ativado!"
        Write-ColorOutput Yellow "⚠️  Não te esqueças de reiniciar a aplicação:"
        Write-ColorOutput Green "   pnpm dev (desenvolvimento)"
        Write-ColorOutput Green "   pm2 restart athlifyr (produção)"
    }
    
    'off' {
        Write-ColorOutput Yellow "✅ Desativando modo de manutenção..."
        
        if (-not (Test-Path $envFile)) {
            Write-ColorOutput Red "❌ Erro: Ficheiro .env não encontrado"
            exit 1
        }
        
        # Remove linhas de MAINTENANCE_MODE
        $content = Get-Content $envFile | Where-Object { $_ -notmatch 'MAINTENANCE_MODE' }
        Set-Content $envFile $content
        
        # Adiciona linha desativada
        Add-Content $envFile 'MAINTENANCE_MODE="false"'
        
        Write-ColorOutput Green "✅ Modo de manutenção desativado!"
        Write-ColorOutput Yellow "⚠️  Não te esqueças de reiniciar a aplicação:"
        Write-ColorOutput Green "   pnpm dev (desenvolvimento)"
        Write-ColorOutput Green "   pm2 restart athlifyr (produção)"
    }
    
    'status' {
        if (-not (Test-Path $envFile)) {
            Write-ColorOutput Red "❌ Erro: Ficheiro .env não encontrado"
            exit 1
        }
        
        $content = Get-Content $envFile -Raw
        
        if ($content -match 'MAINTENANCE_MODE="true"') {
            Write-ColorOutput Red "🔧 Modo de manutenção: ATIVO"
        } elseif ($content -match 'MAINTENANCE_MODE="false"') {
            Write-ColorOutput Green "✅ Modo de manutenção: INATIVO"
        } else {
            Write-ColorOutput Yellow "⚠️  Modo de manutenção: NÃO CONFIGURADO (considerado inativo)"
        }
    }
}
