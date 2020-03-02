import React, { Suspense, useState } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Loading from '../components/shared/loading'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useDispatch, useStore } from 'react-redux'
import Login from '../pages/Login/index'
import Home from '../pages/Home/index'
import Register from '../pages/register/index';
import Site from '../pages/Site/index'
import Shop from '../pages/Shop/index'
import Dish from '../pages/Dish/index'
import Menu from '../pages/Menu/index'
import { useSelector } from 'react-redux'
import DashboardLayoutRoute from "./DashboardLayout/index";
import NotFoundPage from '../components/error/notFoundPage/index'
import { useEffect } from 'react'

function Root(props) {
	const store = useStore()
	const isAuth = useSelector(state => state.isAuth)
	const dispatch = useDispatch()
	const { data, loading, error } = useQuery(VERIFY_TOKEN, {
		variables: { token: window.localStorage.getItem('token') || '' },
	})
	const [currentSite, setCurrentSite] = useState(null)
	useEffect(() => {
		if (data && data.verifyToken) {
			setCurrentSite(data.verifyToken.siteId)
		}
	}, [data])
	if (error) {
		dispatch({ type: 'LOGOUT' })
	}
	else if (loading) {
		return (<Loading />)
	}
	else {
		dispatch({ type: 'AUTHENTICATE', payload: data.verifyToken })
	}
	return (
		<Suspense fallback={<Loading />}>
			<BrowserRouter>
				<Switch>
					<DashboardLayoutRoute exact key='home' path="/" component={!isAuth ? (<Redirect to="/login" />) : Home} currentSite={currentSite} setCurrentSite={setCurrentSite} />
					<DashboardLayoutRoute exact key='site' path="/site" component={!isAuth || store.getState().currentUser.role !== 'SUPERADMIN' ? (<Redirect to="/" />) : Site}  setCurrentSite={setCurrentSite}  />
					<DashboardLayoutRoute exact key='shop' path="/shop" component={!isAuth || store.getState().currentUser.role !== 'ADMIN' ? (<Redirect to="/" />) : Shop} currentSite={currentSite} setCurrentSite={setCurrentSite} />
					<DashboardLayoutRoute exact key='menu' path="/menu" component={!isAuth || store.getState().currentUser.role !== 'ADMIN' ? (<Redirect to="/" />) : Menu} currentSite={currentSite} setCurrentSite={setCurrentSite} />
					<DashboardLayoutRoute exact key='shopDetail' path="/shop/detail/:shopId" component={!isAuth || store.getState().currentUser.role !== 'ADMIN' ? (<Redirect to="/" />) : Dish} currentSite={currentSite} setCurrentSite={setCurrentSite} />
					<Route exact key='login' path='/login' component={() => { return !isAuth ? (<Login />) : (<Redirect to="/" />) }} />
					<Route exact key='register' path='/register' component={() => { return !isAuth ? (<Register />) : (<Redirect to="/" />) }} />
					<Route path="*" component={NotFoundPage} />
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
