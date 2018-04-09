import { generateSearchParams } from '../globalFunctions'
import { API_ROOT } from '../globalVars'


export const fetchCards = (searchTerms) => {
  let params = generateSearchParams(searchTerms, 'card')
  return (dispatch) => {
    dispatch({
      type: 'LOADING_CARDS'
    })
    return (
      fetch(`${API_ROOT}/cards/search?${params}`)
        .then(res => res.json())
        .then(cards => dispatch({
          type: 'SEARCH_CARDS',
          payload: cards.data
        })
      )
    )
  }
}