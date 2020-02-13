const initialState = {
	isAuth: !!window.localStorage.getItem('token'),
}

export default function authReducer(state = initialState, action) {
	switch(action.type){
		case 'AUTHENTICATE':
			return { 
				isAuth : true
			 }
		case 'LOGOUT':
			return {
				isAuth : false
			}
		default:
			return state

	}
}