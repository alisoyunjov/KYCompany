/* jshint esversion: 6 */
import React, { Component } from 'react'

class SearchTicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
          ticker: "",
          qty: "",
        };
    }
    
    handlerFormSubmit(event) {
        event.preventDefault();
        this.props.onSearch(this.state.ticker, this.state.qty); // do search
        this.setState({ticker: ""}); // reset
        this.setState({qty: ""}); // reset
    }

    render() {
        return (
        <form className='search_bar' onSubmit={this.handlerFormSubmit.bind(this)}>
            <input
                name='ticker'
                type='text'
                className='search_ticker'
                value={this.state.ticker}
                onChange={event => this.setState({ticker: event.target.value})}
                placeholder='Enter ticker'
            />
            <input
                name='qty'
                type='text'
                className='search_ticker'
                value={this.state.qty}
                onChange={event => this.setState({qty: event.target.value})}
                placeholder='qty'
            />
            <span className="search_btn">
                <button type='submit' className='btn_search'>+</button>
            </span>
        </form>
        );
    }
}

export default SearchTicker;