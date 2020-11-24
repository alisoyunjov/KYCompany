/* jshint esversion: 6 */
import React, { Component } from "react";
import SearchTicker from "../components/investments/SearchTicker";
import Loading from "../components/utilities/loading";

import '../style/investments.css';
import axios from "axios";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import NumberFormat from 'react-number-format';
import FormHelperText from "@material-ui/core/FormHelperText";

const Plot = createPlotlyComponent(Plotly);

class InvestmentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_tickers: [],
      ticker_qty: {'': ''}, // {ticker1: quantity1,..,ticker1: quantity1}
      ticker_buyat_price: {'': ''}, // {ticker: price bought at}
      ticker_current_price:{'': ''}, // {ticker: current price}
      user_tickers_data: {'data': []}, // from wtd api
      chart_x_val: [],
      chart_y_val: [],
      current_chart: "",
      adding_ticker: false,
      apidwn: 0,
      errorMaxLimit: false,
    };
  }
  
  /* TODO
    // beta
    => display first ticker chart ---- _/
    => display list of tickers and data ---- _/
    => add & remove tickers ---- _/
    => calculate and display Profit and Loss ---- _/
    => display chart for specific ticker ---- _/
    // final
    => add validation to fields and duplicate tickers ---- _/
    => patch security ---- _/
  */

  componentDidMount() {
    this.getTicker(); // get tickers from user profile
    this.getQty();
    this.getBuyAt();
  }
  
  getTicker() {
    try {
      axios.get('/api/investments/getTickers/' + this.props.user + '/').then(response => {
        console.log(response, response.data);
        if (response !== "no tickers" && response.data[0].tickers) {
          const This = this;
          let first_ticker = response.data[0].tickers[0];
         
          This.setState({
            user_tickers: response.data[0].tickers,
            current_chart: first_ticker
          });
          
          this.getChartingDataSingleTicker(first_ticker);
          this.getChartingDataBatch();
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  getBuyAt() {
    try {
      axios.get('/api/investments/getBuyAt/' + this.props.user + '/').then(response => {
        if (response !== "no tickers") {
          const This = this;
          let dict = {};
          
          for (let keys in response.data[0].buyat) {
            Object.assign(dict, response.data[0].buyat[keys]);
          }
          //console.log(dict);

          This.setState({
            ticker_buyat_price: dict // {ticker: "qty"}
          });
        }
        //console.log(this.state.ticker_qty);
      });
    } catch (e) {
      console.error(e);
    }
  }
  
  // returns {ticker1: qty1,...,}
  getQty() {
    try {
      axios.get('/api/investments/getQty/' + this.props.user + '/').then(response => {
        if (response !== "no tickers") {
          const This = this;
          let dict = {};
          
          for (let keys in response.data[0].qty) {
            Object.assign(dict, response.data[0].qty[keys]);
          }
          //console.log(dict);

          This.setState({
            ticker_qty: dict // {ticker: "qty"}
          });
        }
        //console.log(this.state.ticker_qty);
      });
    } catch (e) {
      console.error(e);
    }
  }
  
  // get current data for all users' stocks
  getChartingDataBatch() {
    const This = this;
    let tickers = this.state.user_tickers.join(',');
    
    axios.get('/api/investments/daily/batch/' + tickers + '/').then(response => {
      let data = response.data;
      //console.log(data);

      for (let s in data["data"]) {
        if (data["data"][s].price === null) {
          let val = parseFloat(This.state.ticker_buyat_price[data["data"][s].symbol]) + parseFloat(Math.floor(Math.random() * (1000.0 - 100.0) + 100.0) / 100.0);
          data["data"][s].price = val.toFixed(2);
          //console.log("4: ", This.state.ticker_buyat_price);
        }
      }
      /*
      if (data["data"][0].price === null) {
        data["data"].map((dict) => 
          dict.price = parseFloat(This.state.ticker_buyat_price[dict.symbol]) + Math.floor(Math.random() * (1000 - 100) + 100) / 100
        )
      }
      */

      This.setState({
        user_tickers_data: data // list of dictionaries
      });
      
      let currentprices = {...this.state.ticker_current_price}; // make a copy of the current price state dictionary

      for (let keys in data["data"]) {
        let stock = data["data"][keys].symbol;
        let price = data["data"][keys].price;
        //console.log("3: ", price);
        if (price === null) {
          let rand = (Math.floor(Math.random() * (1000.0 - 100.0) + 100.0) / 100.0); //1.00-10.00
          //console.log("2: ", parseFloat(this.state.ticker_buyat_price[stock]), parseFloat(rand));
          price = (parseFloat(this.state.ticker_buyat_price[stock]) + parseFloat(rand));
          price = price.toFixed(2).toString();
        }
        currentprices[stock] = price; // add new ticker and current price
      }
      //console.log("current prices: ",currentprices);
      This.setState({
        ticker_current_price: currentprices,
      });
    })
  }

  // get and set charting data
  getChartingDataSingleTicker(ticker) {
    const This = this;
  
    let x_vals = [], y_vals = [];

    try {
        axios.get('/api/investments/daily/'+ ticker + '/').then(response => {
        let data = response.data;

        for (let date_entry in data['Time Series (Daily)']) {
          x_vals.push(date_entry);
          y_vals.push(data['Time Series (Daily)'][date_entry]['4. close']);
        }

        This.setState({
          chart_x_val: x_vals,
          chart_y_val: y_vals
        });
      });
    } catch (e) {
      console.error(e);
    }
  }
  
  addBuyatPrice(ticker) {
    const This = this;
    // get ticker price
    axios.get('/api/investments/daily/batch/' + ticker + '/').then(response => {
      let data = response.data; // list of dictionaries
      let buyatprice = data["data"]["0"].price; // one dictionary containing stock info?
      if (buyatprice === null) {
        let rand = (Math.floor(Math.random() * (1000 - 100) + 100) / 10);
        buyatprice = rand.toFixed(2).toString();
        //console.log("1:", buyatprice);
      }
      //console.log(data);
      // add to db and update state
        axios.post('/api/investments/addbuyat/' + this.props.user + '/' + ticker + '/' + buyatprice + '/').then(response => {
          let tickerbuyat = {...this.state.ticker_buyat_price}; // make a copy of the buyat state dictionary
          tickerbuyat[ticker] = buyatprice; // add new ticker and buy-at price
          This.setState({
            ticker_buyat_price: tickerbuyat,
          }, this.getChartingDataBatch());
      });
    })
  }

  addTicker(ticker, qty) {
    const This = this;

    try { // /addticker/:username/:ticker/
      This.setState({
        adding_ticker: true,
      });
      // add ticker to user database
      axios.post('/api/investments/addticker/' + this.props.user + '/' + ticker + '/').then(response => {
        // add ticker to ticker list
        let usertickers = this.state.user_tickers.slice();
        usertickers.push(ticker);
        
        // add ticker and qty to qty dict
        axios.post('/api/investments/addqty/' + this.props.user + '/' + ticker + '/' + qty + '/').then(response => {
          let tickerqty = {...this.state.ticker_qty}; // make a copy of the qty state dictionary
          tickerqty[ticker] = qty; // add new ticker and qty
          This.setState({
            ticker_qty: tickerqty,
          });
          //console.log(this.state.ticker_qty); 
        });

        // add ticker and buy price to db and update state ticker_buyat_price
        this.addBuyatPrice(ticker);

        This.setState({
          user_tickers: usertickers,
          current_chart: ticker,
        });

        // fetch new data for all tickers and update state
        //this.getChartingDataBatch();
        this.getChartingDataSingleTicker(ticker);
        
        This.setState({
          adding_ticker: false
        });
      });
    } catch (e) {
      console.error(e, "error adding ticker");
    }
  }

  deleteTicker(ticker) {
    const This = this;
    // remove ticker entry from database
    axios.delete('/api/investments/removeticker/' + this.props.user + '/' + ticker + '/').then(response => {
      let tickerqty = {...this.state.ticker_qty}; // make a copy of the qty state dictionary
      delete tickerqty[ticker]; // remove ticker from qty dictionary
      
      let usertickers = this.state.user_tickers.slice();
      const index = usertickers.indexOf(ticker);
      if (index > -1) {
        usertickers.splice(index, 1);
      }
      
      // update state
      This.setState({
        ticker_qty: tickerqty,
        user_tickers: usertickers,
        errorMaxLimit: false,
      });

      if (this.state.user_tickers.length !== 0) {
        let next_ticker = this.state.user_tickers[0];
        this.getChartingDataBatch();
        this.getChartingDataSingleTicker(next_ticker);
        This.setState({
          current_chart: next_ticker,
        });
      } else { // reset blanks
        This.setState({
          chart_x_val: [],
          chart_y_val: [],
          current_chart: "",
          user_tickers_data: {'data': []},
        });
      }
    });
  }
  
  // onClick update chart
  updateChart(ticker) {
    let This = this;

    This.setState({
      current_chart: ticker
    });

    this.getChartingDataSingleTicker(ticker);
  }

  handleSearch(ticker, qty) {
    if (this.state.user_tickers.length < 4) {
      //console.log(this.state.user_tickers.length, this.state.user_tickers);
      let t = ticker.toUpperCase();
      qty = qty.toString();
      this.setState({
        errorMaxLimit: false
      });
      this.addTicker(t, qty);
    } else {
      this.setState({
        errorMaxLimit: true
      });
    }
  }

  calculatePL(currentPrice, buyPrice) {
    //console.log(currentPrice,buyPrice);
    let PL = ( ( ( parseFloat(currentPrice) - parseFloat(buyPrice) ) / parseFloat(buyPrice) ) * 100 );
   
    return PL.toFixed(2).toString() + "%";
  }

  render() {
    return (
      <div className="flex-container">
        <div id="chart_component">
          <Plot
            data={[
              {
                x: this.state.chart_x_val,
                y: this.state.chart_y_val,
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'blue'},
              }
            ]}
            style={{ width: '100%', height: '100%' }}
            layout={ {autosize: true, title: this.state.current_chart + ' Daily Time Series'} }
          />
        </div>
        
        <div id="ticker_component" style={{textAlign: 'center'}}>
          <SearchTicker onSearch={this.handleSearch.bind(this)} />
          {this.state.errorMaxLimit ? (
                <FormHelperText>Due to Free-Tier API limitations, cannot track more than 4 stocks at a time</FormHelperText>
            ) : (
                ""
          )}
          <Loading loading={this.state.adding_ticker}/>
          {this.state.user_tickers_data.data.map((dict) =>
            <div key={dict.symbol + "_+"}>
              <span className="delete_btn">
                <button onClick={() => this.deleteTicker(dict.symbol)} id='btn_delete' className='btn_delete'> X </button>
              </span>
              <div id={"ticker_container_" + dict.symbol} className="ticker_container" key={dict.symbol} onClick={() => this.updateChart(dict.symbol)}>   
                <span className="left">{dict.symbol}</span>
                <span className="qty"><a>Units: </a>{this.state.ticker_qty[dict.symbol]}    |    </span>
                <span className="buyatprice"><a>PPS: </a>{this.state.ticker_buyat_price[dict.symbol]}    |    </span>
                <span className="profitloss"><strong>P&amp;L: </strong>{this.calculatePL(this.state.ticker_current_price[dict.symbol], this.state.ticker_buyat_price[dict.symbol])}    </span>  
                <span className="right"><NumberFormat value={dict.price} displayType={'text'} prefix={'$'} thousandSeparator={true} decimalprecision={2}/></span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default InvestmentsPage;
