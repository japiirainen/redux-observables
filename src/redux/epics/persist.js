import { ofType } from 'redux-observable'
import { EMPTY, of } from 'rxjs'
import { ignoreElements, pluck, withLatestFrom, tap } from 'rxjs/operators'
import { setConfig, SET_CONFIG } from '../actions/configActions'

const CACHE_KEY = 'ro-config'

export function persistEpic(action$, state$) {
   return action$.pipe(
      ofType(SET_CONFIG),
      withLatestFrom(state$.pipe(pluck('config'))),
      tap(([action, config]) => {
         localStorage.setItem(CACHE_KEY, JSON.stringify(config))
      }),
      ignoreElements()
   )
}

export function hydrateEpic() {
   const maybeCongig = localStorage.getItem(CACHE_KEY)
   if (typeof maybeCongig === 'string') {
      try {
         const parsed = JSON.parse(maybeCongig)
         return of(setConfig(parsed))
      } catch (e) {
         return EMPTY
      }
   }
   return EMPTY
}
