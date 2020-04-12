# Finance Tracker

**Team Members** :

- --Ram Gurram, 1002538621, gurramra
- --Alan Lee, 1002492965, leealan1
- --Ubaydullo Rustami, 1006631879, rustamiu

Final Product
---
App url: https://www.fintrack.me/ \
Documentation: [Docs](api/doc/README.md) \
Video Link: https://youtu.be/CCtHCdwPQXI 

Original Long Video: [here](https://youtu.be/hI1__-X_9s4) \
Longer video but goes more in detail

Limitation of App:
---
- Track up to 4 stocks at a time due to free-tier API limitations
- App uses two stock APIs due to each having their own free-tier limitations (i.e. one of them allows only 4 requests/minute, 1 stock request per call, etc.)
- Stock API we use only covers stocks listed on: NYSE, TSX, NIKKEI, HKEX, Euronext Paris (Bourse), SSE, SZSE, +other indices such as ^DJI
- If stock API is not working, stock data on investments page will instead be pulled from pseudocaching

**Description:**

Our web app is going to be a personal finance tracker, where you can track credit card bills and other expenses. It will be an easy way to keep track of your money and where it&#39;s going. Also, it will help you plan for the future and set aside savings. Additionally, you will be able to keep track of your investments in the stock market and the app will update how much money you made from them or how much you lost.

**Key Features (beta version):**

- --Create user accounts and profile: name, email, username and password.
- --Proper user authentication using salted hashes. Ensure user profiles are isolated and can only be accessed by their owners.
- --Store paychecks based on any frequency (bi-weekly, monthly) and automatically update your profile&#39;s income.
- --Keep track of expenses in a categorized manner (monthly, quarterly expenses etc) and be able to search for certain types of expenses

**Key Features (final version + additional features):**

- --Getting a machine learning algorithm, where given a bill updates the expenses without typing manually

- --Be able to graph our investments in a visual way (profit loss over a period of time), as well as performance of stocks in a graph
- --Be able to keep track of any investments in stocks and the app would calculate net profit/loss live with the market.
- --Two - factor authentication: Have a pin from a phone that is obtained from a google authenticator app on a person&#39;s phone. This counts as something a person should **have** and they should **know** their password.

**Technologies we will use:**

- --React
- --Mongodb
- --Node.js
- --TypeScript
- --Google authenticator
- --APIs:
  - --Stock data: alphavantange api [https://www.alphavantage.co/documentation/](https://www.alphavantage.co/documentation/)
  - --WorldTradingData
  - --Charting data: tradingview.com

**Technical Challenges:**

- --Identify and integrate am AI to read bills

- --Making the frontend user friendly and smooth
- --Integrating 2FA verification
- --Integrating multiple APIs
- --Learning and utilizing TypeScript
- --React.js

# Run App on Dev

1. `node app,js` keep this running (backend)
2. `cd ./fintrank/frondend`
3. `npm start` keep this running (frontend react)

If build files are already ready then run `npm start` at the root.
