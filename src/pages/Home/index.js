import React, { useState, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks'
import { Icon, Button, Tabs } from 'antd'
import PageHeader from '../PageHeader/index';
import bgHome from '../../assets/images/background1.png'
import avt from '../../assets/images/avatar.png'
import { Link } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import gql from 'graphql-tag'
import Loading from '../../components/shared/loading'
import { useStore } from 'react-redux'
import './index.css'
const { TabPane } = Tabs

const Home = (props) => {
   const dispatch = useDispatch()
   const store = useStore()
   const LoadOnceCurrentSite = useRef(false);
   const { data, loading, error } = useQuery(VERIFY_TOKEN, {
      variables: { token: window.localStorage.getItem('token') || '' },
   })
   const [currentSite, setCurrentSite] = useState(null)
   const [isOpenWrapMenu, SetisOpenWrapMenu] = useState(false)
   const [styleMain, setStyleMain] = useState({ transition: 'all 0.5s ease 0s', margin: '10px 50px 0px 50px' })
   const [styleWrap, setStyleWrap] = useState({ position: 'fixed', right: 'inherit', zIndex: 1100, width: '500px', height: '100%', transition: 'all 0.5s ease 0s', transform: 'translate3d(-100%, 0px, 0px)' })
   const AdminLunPermision = [{text:"Manage Menu",icon:"unordered-list"}, {text:"Manage Oder",icon:"shopping-cart"}, {text:"Manage User",icon:"user"}, {text:"Report",icon:"file-text"}, {text:"History",icon:"clock-circle"}]
   const toggleWrapper = () => {
      SetisOpenWrapMenu(!isOpenWrapMenu)
      if (isOpenWrapMenu) {
         setStyleMain({ transition: 'all 0.5s ease 0s', margin: '10px 50px 0px 50px' })
         setStyleWrap({ position: 'fixed', right: 'inherit', zIndex: 1100, width: '500px', height: '100%', transition: 'all 0.5s ease 0s', transform: 'translate3d(-100%, 0px, 0px)' })
      }
      else {
         setStyleMain({ transform: 'translate3d(500px, 0px, 0px)', transition: 'all 0.5s ease 0s', margin: '10px 50px 0px 50px' })
         setStyleWrap({ position: 'fixed', right: 'inherit', zIndex: 1100, width: '500px', height: '100%', transition: 'all 0.5s ease 0s' })
      }
   }

   if (error) {
      return (<Redirect to="/login" />)
   }
   if (loading) {
      return (<Loading />)
   }
   else {
      if (!LoadOnceCurrentSite.current) {
         dispatch({ type: 'AUTHENTICATE', payload: data.verifyToken });
         setCurrentSite(data.verifyToken.site)
         LoadOnceCurrentSite.current = true;
      }
      const functionLunchUser = currentSite === store.getState().currentUser.site && store.getState().currentUser.role === 'USER' ? (
         <div className="lunch-box" style={{ width: '180px', height: '150px', backgroundColor: 'white', margin: '10px 0' }}>
            <span style={{ color: 'black', margin: '15px', display: 'inline-block' }}>Đặt món</span>
            <Icon style={{ color: '#2D9CDB', fontSize: '40px', margin: '30px 0 0 120px' }} type="shopping-cart" />
         </div>
      ) : null
      const functionHrmUser = currentSite === store.getState().currentUser.site && store.getState().currentUser.role === 'USER' ? (
         <div className="hrm-box" style={{ width: '180px', height: '150px', backgroundColor: 'white', margin: '10px 0' }}>
            <span style={{ color: 'black', margin: '15px', display: 'inline-block' }}>HRM</span>
            <Icon style={{ color: '#2D9CDB', fontSize: '40px', margin: '30px 0 0 120px' }} type="project" />
         </div>
      ) : null
      const functionLunchAdmin = currentSite === store.getState().currentUser.site && store.getState().currentUser.role === 'ADMIN' ?
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
      return (
         <div className="home-page" style={{ overflow: 'hidden', height: '100vh', backgroundImage: `url(${bgHome})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
            <PageHeader setCurrentSite={setCurrentSite} site={store.getState().currentUser.site} toggleWrapper={toggleWrapper} />
            <div className="menu-wrap" style={styleWrap}>
               <div className="wrap-main" style={{ display: 'grid', gridTemplateColumns: 'auto auto', alignItems: 'center', justifyContent: 'flex-start', margin: '30px 50px 0' }}>
                  <span className="avatar-ui" style={{ width: '66px', height: '66px' }}>
                     <img src={avt} alt='' style={{ width: '100%', height: '100%' }} />

                  </span>
                  <div className="handle-group" style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', marginLeft: '10px' }}>
                     <span style={{ fontFamily: 'Nunito Sans', fontWeight: 700, fontSize: '18px', lineHeight: '25px', color: '#fff' }}>
                        {store.getState().currentUser.fullname.toUpperCase()}
                     </span>
                     <Link to="#" onClick={() => {
                        window.localStorage.removeItem('token');
                        dispatch({ type: 'LOGOUT' })
                     }} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        <Icon type="logout" /> Đăng xuất
                     </Link>
                  </div>
               </div>
               <div style={{ width: '100%' }}>
                  <Button style={{ backgroundColor: 'darkcyan', color: 'white', border: 'none', margin: '20px 0 0 50px' }}>Đổi mật khẩu</Button>
               </div>
            </div>
            <main className="main" style={styleMain}>
               <Tabs defaultActiveKey="1" className="tab-main" style={{ background: 'transparent', fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }}>
                  <TabPane tab="App đặt cơm" key="lubTab" className="tab-lun">
                     <span>App đặt cơm</span>
                     <div className="function-lun-main-box">
                        {functionLunchUser}
                        {functionLunchAdmin}
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
            site
            role
        }
    }
`

export default Home