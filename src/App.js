import React from 'react'
import './App.css'
import { connect } from 'react-redux'
import Beers from './components/Beers'

const App = ({ name }) => {
   console.log(name)
   return (
      <div className="App">
         <Beers />
      </div>
   )
}

export default connect(state => state.app)(App)
