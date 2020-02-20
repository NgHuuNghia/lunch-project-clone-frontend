const initialState = {
	isAuth: !!window.localStorage.getItem('token'),
	curentUser: null
}

export default function authReducer(state = initialState, action) {
	switch (action.type) {
		case 'AUTHENTICATE':
			return {
				isAuth: true,
				currentUser: action.payload
			}
		case 'LOGOUT':
			return {
				isAuth: false,
				currentUser: null
			}
		default:
			return state

	}
}