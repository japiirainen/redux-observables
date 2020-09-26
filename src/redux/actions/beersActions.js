export const FETCH_FULFILLED = 'FETCH_FULFILLED'
export const SET_STATUS = 'SET_STATUS'
export const FETCH_DATA = 'FETCH_DATA'
export const SEARCH = 'SEARCH'
export const FETCH_FAILED = 'FETCH_FAILED'
export const CANCEL = 'CANCEL'
export const RESET = 'RESET'
export const RANDOM = 'RANDOM'

export const fetchFulfilled = beers => ({ type: FETCH_FULFILLED, payload: beers })
export const fetchFailed = message => ({ type: FETCH_FAILED, payload: message })
export const setStatus = status => ({ type: SET_STATUS, payload: status })
export const fetchData = () => ({ type: FETCH_DATA })
export const search = input => ({ type: SEARCH, payload: input })
export const cancel = () => ({ type: CANCEL })
export const reset = () => ({ type: RESET })
export const random = () => ({ type: RANDOM })
