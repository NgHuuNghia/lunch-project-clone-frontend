import authReducer from './authReducer/index'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import React from 'react'

const store = createStore(authReducer)

const StoreProvider = ({ children }) => {

	return <Provider store={store}>{children}</Provider>
}

export default StoreProvider
