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

ssh ubuntu@64.181.177.7 "pm2 delete ssr.finax"

ssh ubuntu@64.181.177.7 "rm -rf /home/ubuntu/finax_builds/front/*"

scp -r dist/finax-front/* ubuntu@64.181.177.7:/home/ubuntu/finax_builds/front/

ssh ubuntu@64.181.177.7 "/home/ubuntu/start_scripts/start_finax.sh"
