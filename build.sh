cd /var/www/biobuy
git pull
sudo npm install
cd /var/www/biobuy/fintrack/frontend/
sudo npm install
sudo npm run build
cd /var/www/biobuy
pm2 stop app
pm2 start app.js
sudo service nginx stop && sudo service nginx start

