import React, { useState, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks'
import { Icon, Tabs } from 'antd'
import PageHeader from '../PageHeader/index';
import bgHome from '../../assets/images/background1.png'
import { useDispatch, useStore } from 'react-redux'
import gql from 'graphql-tag'
import Loading from '../../components/shared/loading'
import WrapMenu from '../pageWrap/index'
import Login from '../Login/index'
import { Route } from 'react-router-dom'
import './index.css'
const { TabPane } = Tabs

const Home = (props) => {
   const dispatch = useDispatch()
   const store = useStore()
   const LoadOnceCurrentSite = useRef(false);
   const { data, loading, error } = useQuery(VERIFY_TOKEN, {
      variables: { token: window.localStorage.getItem('token') },
   })
   const [currentSite, setCurrentSite] = useState(null)
   const AdminLunPermision = [{text:"Manage Menu",icon:"unordered-list"}, {text:"Manage Oder",icon:"shopping-cart"}, {text:"Manage User",icon:"user"}, {text:"Report",icon:"file-text"}, {text:"History",icon:"history"}]
   const SuperAdminLunPermision = [{text:"Manage Site", icon: "environment"}]
   const [isOpenWrapMenu, SetisOpenWrapMenu] = useState(false)
   const [styleMain, setStyleMain] = useState({ transition: 'all 0.5s ease 0s', margin: '10px 50px 0px 50px' })
   const [styleWrap, setStyleWrap] = useState({ position: 'fixed', right: 'inherit' , width: '500px', height: '100%', transition: 'all 0.5s ease 0s', transform: 'translate3d(-100%, 0px, 0px)' })
   const toggleWrapper = () => {
        SetisOpenWrapMenu(!isOpenWrapMenu)
        if (isOpenWrapMenu) {
            setStyleMain({ transition: 'all 0.5s ease 0s', margin: '10px 50px 0px 50px' })
            setStyleWrap({ position: 'fixed', right: 'inherit' , width: '500px', height: '100%', transition: 'all 0.5s ease 0s', transform: 'translate3d(-100%, 0px, 0px)' })
        }
        else {
            setStyleMain({ transform: 'translate3d(500px, 0px, 0px)', transition: 'all 0.5s ease 0s', margin: '10px 50px 0px 50px' })
            setStyleWrap({ position: 'fixed', right: 'inherit' , width: '500px', height: '100%', transition: 'all 0.5s ease 0s' })
        }
    }
  

   if (error) {
      dispatch({ type: 'LOGOUT'});
      return <Route path="/login" component={Login} />
   }
   else if (loading ) {
      return (<Loading />)
   }
   else {
      if (!LoadOnceCurrentSite.current) {
         dispatch({ type: 'AUTHENTICATE', payload: data.verifyToken });
         setCurrentSite(data.verifyToken.siteId)
         LoadOnceCurrentSite.current = true;
      }
      const functionLunchUser = currentSite === store.getState().currentUser.siteId && store.getState().currentUser.role === 'USER' ? (
         <div className="lunch-box" style={{ width: '180px', height: '150px', backgroundColor: 'white', margin: '10px 0' }}>
            <span style={{ color: 'black', margin: '15px', display: 'inline-block' }}>Đặt món</span>
            <Icon style={{ color: '#2D9CDB', fontSize: '40px', margin: '30px 0 0 120px' }} type="shopping-cart" />
         </div>
      ) : null
      const functionHrmUser = currentSite === store.getState().currentUser.siteId && store.getState().currentUser.role === 'USER' ? (
         <div className="hrm-box" style={{ width: '180px', height: '150px', backgroundColor: 'white', margin: '10px 0' }}>
            <span style={{ color: 'black', margin: '15px', display: 'inline-block' }}>HRM</span>
            <Icon style={{ color: '#2D9CDB', fontSize: '40px', margin: '30px 0 0 120px' }} type="project" />
         </div>
      ) : null
      const functionLunchAdmin = currentSite === store.getState().currentUser.siteId && store.getState().currentUser.role === 'ADMIN' ?
         AdminLunPermision.map(function (permision, i) {
            return (
               <div key={`box-admin-lun-${i}`} style={{ width: '180px', height: '150px', backgroundColor: 'white', margin: '10px 0' }}>
                  <span style={{ color: 'black', margin: '15px', display: 'inline-block' }}>{permision.text}</span>
                  <Icon style={{ color: '#2D9CDB', fontSize: '40px', margin: '30px 0 0 120px' }} type={permision.icon} />
               </div>
            )
         })
         : null
      // hrm admin
      // super admin
      const functionLunchSuperAdmin =  store.getState().currentUser.role === 'SUPERADMIN' ?
      SuperAdminLunPermision.map(function (permision, i) {
         return (
            <div key={`box-superadmin-lun-${i}`} style={{ width: '180px', height: '150px', backgroundColor: 'white', margin: '10px 0' }}>
               <span style={{ color: 'black', margin: '15px', display: 'inline-block' }}>{permision.text}</span>
               <Icon style={{ color: '#2D9CDB', fontSize: '40px', margin: '30px 0 0 120px' }} type={permision.icon} />
            </div>
         )
      })
      : null
      return (
         <div className="home-page" style={{ overflow: 'hidden', height: '100vh', backgroundImage: `url(${bgHome})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
            <PageHeader setCurrentSite={setCurrentSite} site={store.getState().currentUser.siteId} toggleWrapper={toggleWrapper} />
            <WrapMenu styleWrap={styleWrap}/>
            <main className="main" style={styleMain}>
               <Tabs defaultActiveKey="1" className="tab-main" style={{ background: 'transparent', fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }}>
                  <TabPane tab="App đặt cơm" key="lubTab" className="tab-lun">
                     <span>App đặt cơm</span>
                     <div className="function-lun-main-box">
                        {functionLunchUser}
                        {functionLunchAdmin}
                        {functionLunchSuperAdmin}
                     </div>

                  </TabPane>
                  <TabPane tab="App nhân sự" key="hrmTab" className="tab-hrm">
                     <span>App nhân sự</span>
                     <div className="function-hrm-main-box">
                        {functionHrmUser}
                     </div>
                  </TabPane>
               </Tabs>
            </main>
         </div>
      )
   }
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

export default Home