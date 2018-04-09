import { adapter } from '../services';
import { API_ROOT } from '../globalVars'

export const fetchUser = () => dispatch => {
  dispatch({ type: 'LOADING_USER' });
  adapter.auth.getCurrentUser()
    .then(res => {
      console.log('current_user',res)
      const { id, name } = res.data.attributes
      const decks = res.data.attributes.decks.data
      dispatch({ type: 'SET_CURRENT_USER', user: { id, name } });
      dispatch({ type: 'LOAD_CURRENT_USER_DECKS', payload: decks })
    });
};

export const loginUser = (username, password, history) => dispatch => {
  dispatch({ type: 'LOADING_USER' });

  adapter.auth.login({ username, password }).then(res => {
    if (res.error) {
      dispatch({ type: 'LOGIN_ERROR', payload: res.error })
    } else {
      console.log(res)
      localStorage.setItem('token', res.jwt);
      const { id, name } = res.user.data.attributes
      const decks = res.user.data.attributes.decks.data
      dispatch({ type: 'SET_CURRENT_USER', user: { id, name } });
      dispatch({ type: 'LOAD_CURRENT_USER_DECKS', payload: decks })
      history.push('/');
    }

  });
};

export const logoutUser = () => {
  localStorage.removeItem('token')
  return {
    type: 'LOGOUT_USER'
  }
}

export const createUser = (username, password, history) => {
  return (dispatch) => {
    dispatch({ type: 'LOADING_USER'})
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accepts: 'application/json'
      },
      body: JSON.stringify({ username, password })
    }
    return (
      fetch(`${API_ROOT}/users`, options)
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            dispatch({ type: 'LOGIN_ERROR', payload: res.error })
          } else {
            localStorage.setItem('token', res.jwt);
            const { id, name } = res.user.data.attributes
            const decks = res.user.data.attributes.decks.data
            dispatch({ type: 'SET_CURRENT_USER', user: { id, name } });
            dispatch({ type: 'LOAD_CURRENT_USER_DECKS', payload: decks })
            history.push('/');
          }
        })
    )
  }
}