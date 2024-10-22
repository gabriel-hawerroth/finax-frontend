#!/bin/bash

cd ..

npm run build:prod

# Verifica se o build foi bem-sucedido
if [ $? -ne 0 ]; then
    echo "O build falhou. Parando a execução do script."
    exit 1
fi

git fetch origin

git checkout develop
git pull origin develop

git checkout main
git pull origin main

git merge origin/develop
git push origin main
git checkout develop

ssh ubuntu@server3 "pm2 delete ssr.finax"

ssh ubuntu@server3 "rm -rf /home/ubuntu/finax_builds/front/*"

scp -r dist/finax-front/* ubuntu@server3:/home/ubuntu/finax_builds/front/

ssh ubuntu@server3 "/home/ubuntu/start_scripts/start_finax.sh"
