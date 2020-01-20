import React, { Suspense } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Loading from '../components/shared/loading'
import Login from '../pages/Login/index'
import Home from '../pages/Home/index'

function Root(props) {
	const { isAuth } = props;
	return (
		<Suspense fallback={<Loading />}>
			<BrowserRouter>
				<Switch>
                <Route exact path='/' component={ isAuth ? Home : Login } />
                </Switch>
			</BrowserRouter>
		</Suspense>
	)
}
// export default Root
export default Root;
