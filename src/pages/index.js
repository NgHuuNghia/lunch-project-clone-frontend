import React, { Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Loading from '../components/shared/loading'
import Login from '../pages/Login/index'
import Home from '../pages/Home/index'
import Register from '../pages/register/index';

function Root(props) {

	const users = JSON.parse(window.localStorage.getItem('users'));
	const [token,setToken] = useState(window.localStorage.getItem('account') ? window.localStorage.getItem('account') : '');
	const [isAuth,setIsAuth] = useState(token !== '' ? users.some(user => JSON.parse(token).username === user.username && JSON.parse(token).password === user.password) : false);

	useEffect(() => {

	},[isAuth]);
	return (
		<Suspense fallback={<Loading />}>
			<BrowserRouter>
				<Switch>
					<Route exact key='home' path='/' component={() => { return isAuth ? (<Home setIsAuth={setIsAuth} />) : (<Redirect to="/login" />) }} />
					<Route exact key='login' path='/login' component={() => { return !isAuth ? (<Login setToken={setToken} setIsAuth={setIsAuth} />) : (<Redirect to="/" />) }} />
					<Route exact key='register' path='/register' component= {Register} />
				</Switch>
			</BrowserRouter>
		</Suspense>
	)
}
// export default Root
export default Root;
