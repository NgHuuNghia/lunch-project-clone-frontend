import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PageWrap from '../pageWrap/index'
import PageHeader from '../PageHeader/index';
import bgHome from '../../assets/images/background1.png'


const DashboardLayout = (props) => {

	const [isOpenWrapMenu, SetisOpenWrapMenu] = useState(false)
	const [styleMain, setStyleMain] = useState({ transition: 'all 0.5s ease 0s', margin: '10px 50px 0px 50px' })
	const [styleWrap, setStyleWrap] = useState({ position: 'fixed', right: 'inherit', width: '500px', height: '100%', transition: 'all 0.5s ease 0s', transform: 'translate3d(-100%, 0px, 0px)' })
	const toggleWrapper = () => {
		SetisOpenWrapMenu(!isOpenWrapMenu)
		if (isOpenWrapMenu) {
			setStyleMain({ transition: 'all 0.5s ease 0s', margin: '10px 50px 0px 50px' })
			setStyleWrap({ position: 'fixed', right: 'inherit', width: '500px', height: '100%', transition: 'all 0.5s ease 0s', transform: 'translate3d(-100%, 0px, 0px)' })
		}
		else {
			setStyleMain({ transform: 'translate3d(500px, 0px, 0px)', transition: 'all 0.5s ease 0s', margin: '10px 50px 0px 50px' })
			setStyleWrap({ position: 'fixed', right: 'inherit', width: '500px', height: '100%', transition: 'all 0.5s ease 0s' })
		}
  }
  return (
    <div className="root-page" style={{ overflow: 'hidden', height: '100vh', backgroundImage: `url(${bgHome})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
      <PageHeader setCurrentSite={props.setCurrentSite} toggleWrapper={toggleWrapper} />
      <PageWrap styleWrap={styleWrap} />
      <div className="main" style={styleMain}>
        {props.children}
      </div>
    </div>
  )
}

const DashboardLayoutRoute = ({ component: Component, ...rest }) => {
  if(!Component.name)  return (<Redirect to="/login" />)
  return (
    <Route {...rest} render={ (props) => (
      <DashboardLayout {...rest}>
        <Component {...rest} {...props} />
      </DashboardLayout>
    )} />
  )
};

export default DashboardLayoutRoute;