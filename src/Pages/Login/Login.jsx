import React, { useContext, useEffect } from 'react'
import "./Login.css"
import Context from '../../Utils/Context'
import axios from 'axios';
import { setCookie } from "../../Utils/HandleCookie"

const serverURL = process.env.REACT_APP_SERVER_URL2;

const Login = () => {

    const state = useContext(Context);
    const { setUser, setStocks } = state;
    const googleAuth = () => {
        window.open(`${serverURL}/auth/google/callback`, "_self");
    }
    const loginUser = () => {
        axios.get(`${serverURL}/users/login`).then((response) => {
            if(response && response.data && response.data.success === true){
                let data = response.data.data;
                let user = data.user;
                let stocks = data.stocks;
                setStocks(stocks);
                setUser(user);
                setCookie("user", JSON.stringify(user), 1);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const getGoogleUser = async () => {
        try {
          const url = `${process.env.REACT_APP_SERVER_URL2}/auth/login/success`
          let response = await axios.get(url, { withCredentials : true });
          if(response && response.data && response.data.success === true){
            let data = response.data;
            let user = data.user;
            let stocks = data.stocks;
            setStocks(stocks);
            setUser(user);
            setCookie("user", JSON.stringify(user), 1);
          }
        } catch (error) {
          console.log(error);
        }
      }
    
      useEffect(() => {
        // getGoogleUser()
      }, []);

  return (
    <div className='container'>
        <h1 className='heading'>User LogIn</h1>
        <div className='form_container'>
            <div className='right'>
                <button className='google_btn' onClick={googleAuth}>
                    <img src='https://logowik.com/content/uploads/images/985_google_g_icon.jpg' alt='google icon' />
                    <span> Sign-In with Google</span>
                </button>
                <button onClick={loginUser}>
                    Login
                </button>
            </div>
        </div>
    </div>
  )
}

export default Login
