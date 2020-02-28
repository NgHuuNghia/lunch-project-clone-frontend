import React, { useState } from 'react'
import { Button, Icon, Modal, Form } from 'antd'
import avt from '../../assets/images/avatar.png'
import { Link } from 'react-router-dom'
import { useDispatch, useStore } from 'react-redux'
import FormChangePassword from './fromChangePassword/index'
import bgHome from '../../assets/images/background1.png'

const PageWrap = (props) => {

    const store = useStore()
    const dispatch = useDispatch()
    const [isOpenModal, SetisOpenModal] = useState(false)
    const WrappedNormalChangePasswordForm = Form.create({ name: 'normal_changepassword' })(FormChangePassword);

    const showModal = () => {
        SetisOpenModal(true)
    };

    const handleCancel = e => {
        SetisOpenModal(false)
    };

    return (
        <div className="page-wrap" style={{ backgroundImage: `url(${bgHome})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center center', backgroundAttachment: 'fixed', backgroundSize: 'cover'  }}>
            <div className="menu-wrap" style={props.styleWrap}>
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
                <Button onClick={showModal} style={{ backgroundColor: 'darkcyan', color: 'white', border: 'none', margin: '20px 0 0 50px' }}>Đổi mật khẩu</Button>
            </div>
            <Modal
                width={730}
                style={{ top: 100, zIndex:1 }}
                title="Đổi Mật Khẩu"
                visible={isOpenModal}
                okButtonProps={{form:'fromChangePassword', key: 'submit', htmlType: 'submit'}}
                onCancel={handleCancel}
                okText='Xác Nhận'
                cancelText="Hủy"
            >
                <WrappedNormalChangePasswordForm SetisOpenModal={SetisOpenModal} {...props}/> 
            </Modal>
        </div>
        </div>
        
    )
}

export default PageWrap;