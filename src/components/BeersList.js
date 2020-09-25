import React from 'react'

export const BeersList = ({ data }) => {
   return (
      <ul>
         {data.map(beer => {
            return (
               <li key={beer.id}>
                  <figure>
                     <img
                        style={{ width: '80px', height: '200px' }}
                        src={beer.image_url}
                        alt={beer.name}
                     />
                  </figure>
                  <div>
                     <p>{beer.name}</p>
                     <ul>
                        <li>
                           <small>ABV: {beer.abv}</small>
                        </li>
                        <li>
                           <small>Volume: {beer.volume.unit} </small>
                        </li>
                     </ul>
                  </div>
               </li>
            )
         })}
      </ul>
   )
}
