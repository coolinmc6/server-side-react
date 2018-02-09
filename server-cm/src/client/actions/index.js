import axios from 'axios';

// Types
export const FETCH_USERS = 'FETCH_USERS';


// Action Creators
export const fetchUsers = () => async dispatch => {
	const res = await axios.get('https://react-ssr-api.herokuapp.com/users');

	dispatch({
		type: FETCH_USERS,
		payload: res
	})
}