import React from 'react';
import { Icon, Tabs } from 'antd'
import { useStore } from 'react-redux'
import { Link } from 'react-router-dom'
import './index.css'
const { TabPane } = Tabs

const Home = (props) => {
   const store = useStore()
   const AdminLunPermision = [{ text: "Manage Menu", icon: "unordered-list" }, { text: "Manage Oder", icon: "shopping-cart" }, { text: "Manage User", icon: "user" }, { text: "Report", icon: "file-text" }, { text: "History", icon: "history" }]
   const SuperAdminLunPermision = [{ text: "Manage Site", icon: "environment" }]
   

   const functionLunchUser = props.currentSite === store.getState().currentUser.siteId && store.getState().currentUser.role === 'USER' ? (
      <div className="lunch-box" style={{ width: '180px', height: '150px', backgroundColor: 'white', margin: '10px 0' }}>
         <span style={{ color: 'black', margin: '15px', display: 'inline-block' }}>Đặt món</span>
         <Icon style={{ color: '#2D9CDB', fontSize: '40px', margin: '30px 0 0 120px' }} type="shopping-cart" />
      </div>
   ) : null
   const functionHrmUser = props.currentSite === store.getState().currentUser.siteId && store.getState().currentUser.role === 'USER' ? (
      <div className="hrm-box" style={{ width: '180px', height: '150px', backgroundColor: 'white', margin: '10px 0' }}>
         <span style={{ color: 'black', margin: '15px', display: 'inline-block' }}>HRM</span>
         <Icon style={{ color: '#2D9CDB', fontSize: '40px', margin: '30px 0 0 120px' }} type="project" />
      </div>
   ) : null
   const functionLunchAdmin = props.currentSite === store.getState().currentUser.siteId && store.getState().currentUser.role === 'ADMIN' ?
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
   const functionLunchSuperAdmin = store.getState().currentUser.role === 'SUPERADMIN' ?
      SuperAdminLunPermision.map(function (permision, i) {
         return (
            <Link key="link-to-site" to="/site">
               <div key={`box-superadmin-lun-${i}`} style={{ width: '180px', height: '150px', backgroundColor: 'white', margin: '10px 0' }}>
                  <span style={{ color: 'black', margin: '15px', display: 'inline-block' }}>{permision.text}</span>
                  <Icon style={{ color: '#2D9CDB', fontSize: '40px', margin: '30px 0 0 120px' }} type={permision.icon} />
               </div>
            </Link>
         )
      })
      : null
   return (
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
   )
}



export default Home