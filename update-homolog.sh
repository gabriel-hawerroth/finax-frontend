#!/bin/bash

set -e # Faz o script parar imediatamente em caso de erro.

npm i

npm run build:prod || { echo "Build failed"; exit 1; }

ssh ubuntu@server3 "pm2 delete ssr.finax-homolog || true"

ssh ubuntu@server3 "rm -rf /home/ubuntu/finax_homolog/front/*"

scp -r ./dist/finax-front/* ubuntu@server3:/home/ubuntu/finax_homolog/front/

ssh ubuntu@server3 "/home/ubuntu/start_scripts/start_finax_homolog.sh"
