import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { appReducer } from './reducers/appReducer'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { fetchAllBeersEpic, fetchRandomBeersEpic, searchBeersEpic } from './epics/fetchBeers'
import { beersReducer } from './reducers/beersReducer'
import { configReducer } from './reducers/configReducer'
import { hydrateEpic, persistEpic } from './epics/persist'
import { ajax } from 'rxjs/ajax'

export function configureStore() {
   const rootEpic = combineEpics(
      searchBeersEpic,
      persistEpic,
      hydrateEpic,
      fetchRandomBeersEpic,
      fetchAllBeersEpic
   )

   const epicMiddleware = createEpicMiddleware({
      dependencies: {
         getJSON: ajax.getJSON,
         document: document,
      },
   })

   const rootReducer = combineReducers({
      app: appReducer,
      beers: beersReducer,
      config: configReducer,
   })

   const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

   const store = createStore(rootReducer, composeEnhancers(applyMiddleware(epicMiddleware)))

   epicMiddleware.run(rootEpic)

   return store
}
