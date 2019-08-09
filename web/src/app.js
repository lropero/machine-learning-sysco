import axios from 'axios'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import config from './config'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      customer: '',
      disabled: false,
      imgs: []
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (e) {
    const customer = e.target.value.trim().replace(/\D/g, '')
    if (customer.length <= 10) {
      this.setState({
        customer
      })
      if (customer.length === 10) {
        this.setState({
          disabled: true,
          imgs: []
        })
        axios.get(config.api + customer, {
          headers: {
            Auth: config.key
          }
        }).then(response => {
          this.setState({
            disabled: false,
            imgs: response.data
          })
        })
      }
    }
  }

  render () {
    const imgs = this.state.imgs.map((img, i) => (<div className='row justify-content-md-center' key={i}><img src={'data:image/png;base64,' + img} /></div>))
    return (
      <div className='container' style={{ margin: '50px auto' }}>
        <div className='jumbotron' style={{ backgroundColor: '#c8b9e3' }}>
          <h1 className='display-3'>Machine Learning for Sysco</h1>
          <p className='lead'>Experimental, use at your own risk (?)<br />Example customers: 0010000039, 1000070820, 1000071455</p>
        </div>
        <div className='input-group' style={{ margin: '20px auto' }}>
          <input
            aria-label='Search for customer...'
            className='form-control'
            disabled={this.state.disabled}
            onChange={this.handleChange}
            onFocus={() => {
              this.setState({ customer: '' })
            }}
            placeholder='Search for customer...'
            type='text'
            value={this.state.customer}
          />
          <span className='input-group-btn'>
            <button className='btn btn-secondary' type='button'>{this.state.disabled ? 'Learning...' : 'Enter 10-digit ID number'}</button>
          </span>
        </div>
        {this.state.disabled && (
          <div className='alert alert-info' role='alert'>
            Please be patient, lots of math going on :)<br />
          </div>
        )}
        {imgs}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
