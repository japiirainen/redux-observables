import { of } from 'rxjs'
import { TestScheduler } from 'rxjs/testing'
import {
   fetchData,
   fetchFailed,
   fetchFulfilled,
   search,
   setStatus,
} from '../../actions/beersActions'
import { initialState } from '../../reducers/configReducer'
import { fetchRandomBeersEpic, fetchAllBeersEpic } from '../fetchBeers'

it('produces correct actions (success)', () => {
   const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected)
   })

   testScheduler.run(({ hot, cold, expectObservable }) => {
      const action$ = hot('a', {
         a: search('ship'),
      })
      const state$ = of({
         config: initialState,
      })
      const dependencies = {
         getJSON: () => {
            return cold('-a', {
               a: [{ name: 'Beer 1' }],
            })
         },
      }

      const output$ = fetchRandomBeersEpic(action$, state$, dependencies)
      expectObservable(output$).toBe('500ms ab', {
         a: setStatus('pending'),
         b: fetchFulfilled([{ name: 'Beer 1' }]),
      })
   })
})

it('produces correct actions (error)', () => {
   const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected)
   })

   testScheduler.run(({ hot, cold, expectObservable }) => {
      const action$ = hot('a', {
         a: search('ship'),
      })
      const state$ = of({
         config: initialState,
      })
      const dependencies = {
         getJSON: () => {
            return cold('-#', null, {
               response: {
                  message: 'oops!',
               },
            })
         },
      }

      const output$ = fetchRandomBeersEpic(action$, state$, dependencies)
      expectObservable(output$).toBe('500ms ab', {
         a: setStatus('pending'),
         b: fetchFailed('oops!'),
      })
   })
})

it('fetches ass beers (success)', () => {
   const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected)
   })

   testScheduler.run(({ hot, cold, expectObservable }) => {
      const action$ = hot('a', {
         a: fetchData(),
      })
      const state$ = of({
         config: initialState,
      })
      const dependencies = {
         getJSON: () => {
            return cold('-a', {
               a: { name: 'Beer 1' },
            })
         },
      }

      const output$ = fetchAllBeersEpic(action$, state$, dependencies)
      expectObservable(output$).toBe('ab', {
         a: setStatus('pending'),
         b: fetchFulfilled({ name: 'Beer 1' }),
      })
   })
})
