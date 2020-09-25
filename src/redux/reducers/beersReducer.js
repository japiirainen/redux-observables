import { RESET, FETCH_FAILED, FETCH_FULFILLED, SET_STATUS } from '../actions/beersActions'

const initialState = {
   data: [],
   status: 'idle',
}

export function beersReducer(state = initialState, action) {
   switch (action.type) {
      case FETCH_FULFILLED: {
         return {
            ...state,
            data: action.payload,
            status: 'success',
            messages: [],
         }
      }
      case SET_STATUS: {
         return {
            ...state,
            status: action.payload,
         }
      }
      case RESET: {
         return {
            ...state,
            status: 'idle',
            messages: [],
         }
      }
      case FETCH_FAILED: {
         return {
            ...state,
            status: 'error',
            messages: [
               {
                  type: 'error',
                  text: action.payload,
               },
            ],
         }
      }
      default:
         return state
   }
}
