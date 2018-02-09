// FETCH_USERS is a named export so it must have curly braces around it
import { FETCH_USERS } from '../actions';

export default (state = [], action) => {

	switch(action.type) {
		case FETCH_USERS:
			return action.payload.data
		default:
			return state;
	}
}
