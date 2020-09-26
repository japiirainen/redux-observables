import React from 'react'
import { connect } from 'react-redux'
import { BeersList } from './BeersList'
import { cancel, fetchData, random, search } from '../redux/actions/beersActions'
import { setConfig } from '../redux/actions/configActions'

export const Beers = ({
   data,
   status,
   messages,
   random,
   fetchData,
   search,
   cancel,
   config,
   setConfig,
}) => {
   return (
      <>
         <div>
            <button type="button" onClick={random}>
               random
            </button>
            <select
               name="per-page"
               defaultValue={config.perPage}
               onChange={e => setConfig({ perPage: Number(e.target.value) })}
            >
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val, i) => {
                  return (
                     <option key={i} value={val}>
                        {val} results
                     </option>
                  )
               })}
            </select>
            <input type="text" placeholder="Search beers" onChange={e => search(e.target.value)} />
            <button type="button" disabled={status === 'pending'} onClick={fetchData}>
               Fetch some beers
            </button>

            {status === 'pending' && (
               <div>
                  <span>pending...</span>
                  <button onClick={cancel}>cancel reques</button>
               </div>
            )}
            {status === 'success' && (
               <div>
                  <BeersList data={data} />
               </div>
            )}
            {status === 'error' && (
               <div>
                  <p>Oops! {messages[0].text}</p>
               </div>
            )}
         </div>
      </>
   )
}

function mapState(state) {
   return {
      ...state.beers,
      config: state.config,
   }
}

export default connect(mapState, { fetchData, search, cancel, setConfig, random })(Beers)
