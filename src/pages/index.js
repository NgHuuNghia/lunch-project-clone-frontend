import React, { Suspense } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Loading from '../components/shared/loading'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useDispatch } from 'react-redux'
import Login from '../pages/Login/index'
import Home from '../pages/Home/index'
import Register from '../pages/register/index';
import Site from '../pages/Site/index'
import { useSelector } from 'react-redux'

function Root(props) {
	const isAuth = useSelector(state => state.isAuth)
	const dispatch = useDispatch()
	const { data, loading, error } = useQuery(VERIFY_TOKEN, {
		variables: { token: window.localStorage.getItem('token') || '' },
	})
	if (error) {
		dispatch({ type: 'LOGOUT' })
	 }
	else if (loading) {
		return (<Loading />)
	}
	else {
		dispatch({ type: 'AUTHENTICATE', payload: data.verifyToken });
	}
	return (
		<Suspense fallback={<Loading />}>
			<BrowserRouter>
				<Switch>
					<Route exact key='home' path='/' component={() => { return isAuth ? (<Home />) : (<Redirect to="/login" />) }} />
					<Route exact key='login' path='/login' component={() => { return !isAuth ? (<Login />) : (<Redirect to="/" />) }} />
					<Route exact key='register' path='/register' component={() => { return !isAuth ? (<Register />) : (<Redirect to="/" />) }} />
					<Route exact key='site' path='/site' component={() => { return isAuth ? (<Site />) : (<Redirect to="/" />) }} />
					<Redirect to="/" />
				</Switch>
			</BrowserRouter>
		</Suspense>
	)

}
const VERIFY_TOKEN = gql`
    query currentUser($token: String!) {
        verifyToken(token: $token) {
            _id
            fullname
            siteId
            role
        }
    }
`
// export default Root
export default Root;
