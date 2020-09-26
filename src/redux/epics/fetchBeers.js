import {
   catchError,
   debounceTime,
   delay,
   filter,
   map,
   mapTo,
   pluck,
   switchMap,
   withLatestFrom,
} from 'rxjs/operators'
import {
   CANCEL,
   fetchFailed,
   fetchFulfilled,
   FETCH_DATA,
   RANDOM,
   reset,
   SEARCH,
   setStatus,
} from '../actions/beersActions'
import { ofType } from 'redux-observable'
import { concat, fromEvent, of, merge, race, forkJoin } from 'rxjs'

const search = (apiBase, perPage, term) =>
   `${apiBase}?beer_name=${encodeURIComponent(term)}&per_page=${perPage}`

const random = apiBase => `${apiBase}/random`

export function searchBeersEpic(action$, state$, { getJSON, document }) {
   return action$.pipe(
      ofType(SEARCH),
      debounceTime(500),
      filter(({ payload }) => payload.trim() !== ''),
      withLatestFrom(state$.pipe(pluck('config'))),
      switchMap(([{ payload }, config]) => {
         const ajax$ = getJSON(search(config.apiBase, config.perPage, payload)).pipe(
            delay(3000),
            map(res => fetchFulfilled(res)),
            catchError(err => {
               return of(fetchFailed(err.response.message))
            })
         )
         const blocker$ = merge(
            action$.pipe(ofType(CANCEL)),
            fromEvent(document, 'keyup').pipe(filter(e => e.key === 'Escape' || e.key === 'Esc'))
         ).pipe(mapTo(reset()))

         return concat(of(setStatus('pending')), race(ajax$, blocker$))
      })
   )
}

export function fetchAllBeersEpic(action$, state$, { getJSON, document }) {
   return action$.pipe(
      ofType(FETCH_DATA),
      withLatestFrom(state$.pipe(pluck('config', 'apiBase'))),
      switchMap(([{ payload }, apiBase]) => {
         const ajax$ = getJSON(apiBase).pipe(
            delay(3000),
            map(res => fetchFulfilled(res)),
            catchError(err => {
               return of(fetchFailed(err.response.message))
            })
         )
         const blocker$ = merge(
            action$.pipe(ofType(CANCEL)),
            fromEvent(document, 'keyup').pipe(filter(e => e.key === 'Escape' || e.key === 'Esc'))
         ).pipe(mapTo(reset()))

         return concat(of(setStatus('pending')), race(ajax$, blocker$))
      })
   )
}

export function fetchRandomBeersEpic(action$, state$, { getJSON, document }) {
   return action$.pipe(
      ofType(RANDOM),
      debounceTime(500),
      withLatestFrom(state$.pipe(pluck('config'))),
      switchMap(([{ payload }, config]) => {
         const reqs = [...Array(config.perPage)].map(() => {
            return getJSON(random(config.apiBase)).pipe(pluck(0))
         })

         const ajax$ = forkJoin(reqs).pipe(
            delay(3000),
            map(res => fetchFulfilled(res)),
            catchError(err => {
               return of(fetchFailed(err.response.message))
            })
         )

         const blocker$ = merge(
            action$.pipe(ofType(CANCEL)),
            fromEvent(document, 'keyup').pipe(filter(e => e.key === 'Escape' || e.key === 'Esc'))
         ).pipe(mapTo(reset()))

         return concat(of(setStatus('pending')), race(ajax$, blocker$))
      })
   )
}
