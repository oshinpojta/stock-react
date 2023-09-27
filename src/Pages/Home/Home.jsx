import React, { useContext, useEffect, useState } from 'react'
import "./Home.css"
// import { socket } from '../../Utils/Socket';
// import { setCookie, getCookie } from '../../Utils/HandleCookie';
import { io } from 'socket.io-client';
import Context from '../../Utils/Context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { setCookie } from '../../Utils/HandleCookie';
import ChartBox from '../../Components/Chart/ChartBox';
import SideBar from '../../Components/SideBar/SideBar';
import Dropdown from '../../Components/Dropdown/Dropdown';
import Lists from '../../Components/Lists/List';

// https://socket.io/how-to/use-with-react
// https://socket.io/docs/v4/handling-cors
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

const serverURL = process.env.REACT_APP_SERVER_URL2;

const Home = () => {

    const [socket, setSocket] = useState(null);
    const navigate = useNavigate()
    const state = useContext(Context)
    const { user, setUser, 
        stocks, setStocks, logout,stockSubscribeData, 
        setStockSubscribeData,
        subscribeStock } = state;

    const [ toggle, setToggle ] = useState(false);
    

    useEffect(()=>{
        const options = {
            headers : {
                token : user.token
            }
        }
        axios.get(`${serverURL}/users/stocks`, options).then((response) => {
          if(response && response.data && response.data.success === true){
              let data = response.data.data;
              setStocks(data);
              data.forEach(stock => {
                    if(stock.is_subscribed){
                        setStockSubscribeData({
                            stock : stock,
                            is_subscribed : stock.is_subscribed
                        })
                    }
              });
              setToggle(!toggle)
              setStockSubscribeData(null)
          }
        }).catch(err => {
            console.log(err);
        })
      },[])

    // connect to socket only once, after rendering
    useEffect(() => {
        const newSocket = io(URL,{
            auth : user,
            autoConnect: false
        });
        
        setSocket(newSocket)
        setToggle(!toggle);
        if(socket){
            return () => socket.disconnect()
        }
      }, [])

    // keep only one instance
    if(socket && !socket.connected){
        socket.connect()
    }

    const logoutUser = () => {
        const options = {
            headers : {
                token : user.token
            }
        }
        socket.disconnect();
        socket.disconnect();
        axios.get(`${serverURL}/users/logout`, options).then(()=>{
            setCookie("user", null)
            setCookie("googleAuth", null);
            setUser(null);
            setStocks([]);
            navigate("/login")
        }).catch((err)=>{
            console.log(err)
            setCookie("user", null)
            setCookie("googleAuth", null);
            setUser(null);
            setStocks([]);
            navigate("/login")
        });
    }
    
    useEffect(()=>{
        if(logout){
            logoutUser();
        }
    }, [logout])

    // subscribe effect
    useEffect(()=>{
        if(socket){
            socket.emit("subscribe", stockSubscribeData, (success)=>{
                if(success){
                    let stock = stockSubscribeData.stock;
                    stock.is_subscribed = stockSubscribeData.is_subscribed;
                    let arr = stocks.map((item) => item.id === stock.id ? stock : item);
                    setStocks(arr);
                    setStockSubscribeData(null);
                    setToggle(!toggle)
                }
            })
        }  
    }, [stockSubscribeData])

    // Stock Consumer, Each stock has their own order-event
    // consume effect
    useEffect(()=>{
        // Stock Consumer, Each stock has their own order-event
        if(socket){
            // close multiple order-listeners created by re-renders
            socket.removeAllListeners("order")
            // start order-listener
            socket.on("order", (obj) => {

                // stock object
                if(obj && obj.id){
                    let stock_id = obj.id;
                    // get stocks array and update orders of that stock
                    let arr = stocks.map((item) => { 
                        if(item.id === stock_id){
                            item.orders = obj.orders;
                            return item;
                        }
                        return item;
                    });
                    setStocks(arr);
                }
            })
        }
    },[toggle, stocks])
    
  return (
    <div className='container' style={{ height:"100vh", display:"inline-grid", gridTemplateColumns:"1fr 1fr", overflow:"scroll" }}>
         <SideBar />
        <div style={{ display:"grid", gridTemplateRows:"0% 60% 40%" }}>
            <Dropdown />
            <ChartBox  stocks={stocks} />
            <Lists stocks={stocks}/>
        </div>
    </div>
  )
}

export default Home
