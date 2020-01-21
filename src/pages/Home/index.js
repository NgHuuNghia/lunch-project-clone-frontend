import React from 'react'

const Home = (props) => {

    const logout = () => {
        window.localStorage.removeItem('account');
        props.setIsAuth(false);
    }

    return (
        <div className="home">
            <h1>Is Login</h1>
            <button onClick= { logout }>Logout</button>
        </div> 
     );
}
 
export default Home;
