cd /var/www/biobuy || exit
sudo npm install
cd /var/www/biobuy/fintrack/frontend/ || exit
sudo npm install
sudo npm run build
cd /var/www/biobuy || exit
pm2 stop app
pm2 start app.js
sudo service nginx stop && sudo service nginx start

