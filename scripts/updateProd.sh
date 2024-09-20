#!/bin/bash

# Executa o build em modo produção
npm run build:prod

# Verifica se o build foi bem-sucedido
if [ $? -ne 0 ]; then
    echo "O build falhou. Parando a execução do script."
    exit 1
fi

# Deleta o processo existente do PM2 no servidor remoto
ssh root@15.229.18.114 "pm2 delete ssr.finax"

# Remove os arquivos antigos no servidor remoto
ssh root@15.229.18.114 "rm -rf /var/www/html/finax/*"

# Copia os novos arquivos para o servidor remoto
scp -r dist/finax-front/* root@15.229.18.114:/var/www/html/finax/

# Inicia o processo no servidor remoto
ssh root@15.229.18.114 "/root/start_finax.sh"
