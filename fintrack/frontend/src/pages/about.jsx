import React, { Component } from "react";

class AboutPage extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1>AboutPage</h1>
        <h4>Created by:</h4>
        <div><ul>
          <li>Rustami Ubaydullo</li>
          <li>Alshir Soyunjov</li>
          </ul></div>
        <h4>Made Possible by:</h4>
        <div>
          <ul>
            <li><a href="https://reactjs.org/" target="_blank"
                      rel="noopener noreferrer">React</a></li>
            <ul>
              <li><a href="https://material-ui.com/" target="_blank"
                      rel="noopener noreferrer">Material UI</a></li>
              <li><a href="https://plotly.com/javascript/react/" target="_blank"
                      rel="noopener noreferrer">Plotly</a></li>
            </ul>
            <li>Backend</li>
            <ul>
              <li><a href="https://expressjs.com/" target="_blank"
                      rel="noopener noreferrer">Express</a></li>
              <li><a href="https://nodemailer.com/about/" target="_blank"
                      rel="noopener noreferrer">Node Mailer</a></li>
              <li><a href="https://www.mongodb.com/" target="_blank"
                      rel="noopener noreferrer">MongoDB</a></li>
            </ul>
            <li>API</li>
            <ul>
              <li><a href="https://www.alphavantage.co/" target="_blank"
                      rel="noopener noreferrer">AlphaVantage</a> - Stock Charts</li>
              <li><a href="https://www.worldtradingdata.com/" target="_blank"
                      rel="noopener noreferrer">WorldTradingData</a> - Stock Information</li>
              <li><a href="https://newsapi.org/" target="_blank"
                      rel="noopener noreferrer">NewsAPI</a>  - Related news section</li>
            </ul>
          </ul>
              
        </div>
      </div>
    );
  }
}

export default AboutPage;
