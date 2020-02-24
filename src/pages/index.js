import React, { Suspense, useState, useRef } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Loading from '../components/shared/loading'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useDispatch, useStore } from 'react-redux'
import Login from '../pages/Login/index'
import Home from '../pages/Home/index'
import Register from '../pages/register/index';
import Site from '../pages/Site/index'
import { useSelector } from 'react-redux'
import DashboardLayoutRoute from "./DashboardLayout/index";

function Root(props) {
	const store = useStore()
	const LoadOnceCurrentSite = useRef(false);
	const isAuth = useSelector(state => state.isAuth)
	const dispatch = useDispatch()
	const { data, loading, error } = useQuery(VERIFY_TOKEN, {
		variables: { token: window.localStorage.getItem('token') || '' },
	})
	const [currentSite, setCurrentSite] = useState(null)
	if (error) {
		dispatch({ type: 'LOGOUT' })
	}
	else if (loading) {
		return (<Loading />)
	}
	else {
		dispatch({ type: 'AUTHENTICATE', payload: data.verifyToken })
		if (!LoadOnceCurrentSite.current) {
			setCurrentSite(store.getState().currentUser.siteId)
			LoadOnceCurrentSite.current = true;
		 }
	  
	}
	return (
		<Suspense fallback={<Loading />}>
			<BrowserRouter>
				<Switch>
					<DashboardLayoutRoute exact key='home' path="/" component={  !isAuth ? (<Redirect to="/login" />) : Home } currentSite={currentSite} setCurrentSite={setCurrentSite} />
					<DashboardLayoutRoute exact key='site' path="/site" component={  !isAuth || store.getState().currentUser.role !== 'SUPERADMIN' ? (<Redirect to="/" />) : Site }  setCurrentSite={setCurrentSite}/>
					<Route exact key='login' path='/login' component={() => { return !isAuth ? (<Login />) : (<Redirect to="/" />) }} />
					<Route exact key='register' path='/register' component={() => { return !isAuth ? (<Register />) : (<Redirect to="/" />) }} />		
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
