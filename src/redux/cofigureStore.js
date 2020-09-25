import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { appReducer } from './reducers/appReducer'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import { fetchBeersEpic } from './epics/fetchBeers'
import { beersReducer } from './reducers/beersReducer'
import { configReducer } from './reducers/configReducer'

export function configureStore() {
   const rootEpic = combineEpics(fetchBeersEpic)

   const epicMiddleware = createEpicMiddleware()

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
