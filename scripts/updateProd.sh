#!/bin/bash

npm run build:prod

# Verifica se o build foi bem-sucedido
if [ $? -ne 0 ]; then
    echo "O build falhou. Parando a execução do script."
    exit 1
fi

git fetch

git pull

git checkout main

git merge origin/develop

git checkout develop

ssh root@15.229.18.114 "pm2 delete ssr.finax"

ssh root@15.229.18.114 "rm -rf /var/www/html/finax/*"

scp -r dist/finax-front/* root@15.229.18.114:/var/www/html/finax/

ssh root@15.229.18.114 "/root/start_finax.sh"
