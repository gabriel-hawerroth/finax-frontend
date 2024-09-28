cd ..

call npm run build:prod

IF NOT %ERRORLEVEL% == 0 (
    exit /b %ERRORLEVEL%
)

git fetch origin

git checkout develop
git pull origin develop

git checkout main
git pull origin main

git merge origin/develop
git push origin main
git checkout develop

ssh root@147.79.81.13 "pm2 delete ssr.finax"

ssh root@147.79.81.13 "rm -rf /var/www/html/finax/*"

scp -r dist/finax-front/* root@147.79.81.13:/var/www/html/finax/

ssh root@147.79.81.13 "/root/start_finax.sh"
