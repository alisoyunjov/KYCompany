# BioBuy

# Run App on Dev

0. Install dependencies by `npm install` (Both in /biobuy and /biobuy/fintrack/frontend directories)
1. `node app.js` keep this running (execute in /biobuy)
2. `cd ./fintrank/frondend`
3. `npm start` keep this running (execute /biobuy/fintrack/frontend)

If build files are already ready then run `npm start` at the root.

# Build and Deploy in AWS
If you have not yet opened AWS EC2 machine and haven't set up any dependencies for this project follow this link:

https://itnext.io/deploy-a-mongodb-expressjs-reactjs-nodejs-mern-stack-web-application-on-aws-ec2-2a0d8199a682

If you already have run the project once in your EC2 machine and want to redeploy then execute the following commands in your EC2 Machine:

1. `cd /var/www/biobuy`
2. `bash build.sh`
3. Go to the Public IP address of EC2 Server (Can be found in EC2 Console Dashboard) to see the web app

