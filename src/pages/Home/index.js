import React, { useState } from 'react';
import { Icon, Button, Tabs } from 'antd'
import PageHeader from '../PageHeader/index';
import bgHome from '../../assets/images/background1.png'
import avt from '../../assets/images/avatar.png'
import { Link } from 'react-router-dom'
const { TabPane } = Tabs

const Home = (props) => {

   const [isOpenWrapMenu, SetisOpenWrapMenu] = useState(false)
   const [styleMain, setStyleMain] = useState({ transition: 'all 0.5s ease 0s', margin: '10px 50px 0px 50px' })
   const [styleWrap, setStyleWrap] = useState({ position: 'fixed', right: 'inherit', zIndex: 1100, width: '500px', height: '100%', transition: 'all 0.5s ease 0s', transform: 'translate3d(-100%, 0px, 0px)' })
   
   const logout = () => {
        window.localStorage.removeItem('account');
        props.setIsAuth(false);
    }
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

   return (
      <div className="home-page" style={{ overflow: 'hidden', height: '100vh', backgroundImage: `url(${bgHome})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
         <PageHeader toggleWrapper={toggleWrapper} />
         <div className="menu-wrap" style={styleWrap}>
            <div className="wrap-main" style={{ display: 'grid', gridTemplateColumns: 'auto auto', alignItems: 'center',justifyContent: 'flex-start', margin: '30px 50px 0' }}>
               <span className="avatar-ui" style={{ width: '66px', height: '66px' }}>
                  <img src={avt} alt=''  style={{ width: '100%', height: '100%' }}/>

               </span>
               <div className="handle-group" style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', marginLeft:'10px' }}>
                  <span style={{ fontFamily: 'Nunito Sans', fontWeight: 700, fontSize: '18px', lineHeight: '25px', color: '#fff' }}>
                     NGUYỄN HỮU NGHĨA
                  </span>
                  <Link to="#" onClick= {logout} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                     <Icon  type="logout" /> Đăng xuất
                  </Link>
               </div>
            </div>
            <div style={{width:'100%'}}>
               <Button style={{backgroundColor: 'darkcyan', color: 'white', border:'none', margin: '20px 0 0 50px'}}>Đổi mật khẩu</Button>
            </div>
         </div>
         <main className="main" style={styleMain}>
            <Tabs defaultActiveKey="1" style={{background: 'transparent', fontSize: 16, color: 'rgba(255, 255, 255, 0.7)'}}>
               <TabPane  tab="App đặt cơm" key="lubTab">
                  <span>App đặt cơm</span>
                  <div className="lunch-box" style={{  width:'180px',height:'150px',backgroundColor:'white', margin:'10px 0'}}>
                     <span style={{color:'black', margin:'15px', display:'inline-block'}}>Đặt món</span>
                     <Icon style={{color:'#2D9CDB', fontSize: '40px', margin: '30px 0 0 120px'}} type="shopping-cart" />
                  </div>
               </TabPane>
               <TabPane tab="App nhân sự" key="hrmTab">
               <span>App nhân sự</span>
                  <div className="hrm-box" style={{width:'180px',height:'150px',backgroundColor:'white', margin:'10px 0'}}>
                  <span style={{color:'black', margin:'15px', display:'inline-block'}}>HRM</span>
                     <Icon style={{color:'#2D9CDB', fontSize: '40px', margin: '30px 0 0 120px'}} type="project" />
                  </div>
               </TabPane>
            </Tabs>
         </main>
      </div>
   )
}

export default Home;
