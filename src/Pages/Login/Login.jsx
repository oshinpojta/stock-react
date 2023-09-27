import React, { useEffect } from 'react'
import "./Login.css"
import { motion } from 'framer-motion';

const googelAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth"; 

const Login = () => {

    const getGoogleAuthUrl = () => {

      const options = {
        redirect_uri : process.env.REACT_APP_GOOGLE_REDIRECT_URI,
        client_id : process.env.REACT_APP_GOOGLE_CLIENT_ID,
        access_type : "offline",
        response_type : "code",
        prompt : "consent",
        scope : [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email"
        ].join(" ")
      }

      const qs = new URLSearchParams(options);
      return `${googelAuthUrl}?${qs.toString()}`

    }

  return (
    <div className='div_container'>

      <div className='image_container' ></div>
        <div className='form_container'>
          
            <div className='right'>
              <a href={getGoogleAuthUrl()} style={{ textDecoration:"none"}}>
                <button className='google_btn'  style={{ fontSize:"1.2rem" }}>
                      <img src='https://logowik.com/content/uploads/images/985_google_g_icon.jpg' alt='google icon' />
                      <span> Sign-In with Google</span>
                  </button>
              </a>
            </div>
        </div>
    </div>
  )
}

export default Login
