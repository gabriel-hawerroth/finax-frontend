call npm run build:prod

IF NOT %ERRORLEVEL% == 0 (
    exit /b %ERRORLEVEL%
)

git fetch

git pull

git checkout main

git merge origin/develop

git checkout develop

ssh root@15.229.18.114 "pm2 delete ssr.finax"

ssh root@15.229.18.114 "rm -rf /var/www/html/finax/*"

scp -r dist/finax-front/* root@15.229.18.114:/var/www/html/finax/

ssh root@15.229.18.114 "/root/start_finax.sh"
