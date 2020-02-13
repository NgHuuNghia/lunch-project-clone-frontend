import React, { Suspense } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Loading from '../components/shared/loading'
import Login from '../pages/Login/index'
import Home from '../pages/Home/index'
import Register from '../pages/register/index';
import { useSelector } from 'react-redux'

function Root(props) {

	const isAuth = useSelector(state => state.isAuth)

	return (
		<Suspense fallback={<Loading />}>
			<BrowserRouter>
				<Switch>
					<Route exact key='home' path='/' component={() => { return isAuth ? (<Home />) : (<Redirect to="/login" />) }} />
					<Route exact key='login' path='/login' component={() => { return !isAuth ? (<Login />) : (<Redirect to="/" />) }} />
					<Route exact key='register' path='/register' component= {() => { return !isAuth ?  (<Register/>)  : (<Redirect to="/" />) }} />
				</Switch>
			</BrowserRouter>
		</Suspense>
	)
}
// export default Root
export default Root;
