export function appReducer(state = { name: 'Joona' }, action) {
   switch (action.type) {
      case 'SET_NAME': {
         return {
            ...state,
            name: action.payload,
         }
      }
      default:
         return state
   }
}
