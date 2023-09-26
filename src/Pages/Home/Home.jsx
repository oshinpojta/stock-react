import React, { useContext, useEffect, useState } from 'react'
import "./Home.css"
// import { socket } from '../../Utils/Socket';
// import { setCookie, getCookie } from '../../Utils/HandleCookie';
import { io } from 'socket.io-client';
import Context from '../../Utils/Context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { getCookie, setCookie } from '../../Utils/HandleCookie';

// https://socket.io/how-to/use-with-react
// https://socket.io/docs/v4/handling-cors
// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

const serverURL = process.env.REACT_APP_SERVER_URL2;
const duration = [
    {
        name : "min",
        time : 60
    },
    {
        name : "hour",
        time : 60*60
    },
    {
        name : "4hour",
        time : 60*60*4
    },
    {
        name : "day",
        time : 60*60*24
    },
]


const Home = () => {

    const [socket, setSocket] = useState(null);
    const userStr = getCookie("user");
    const userObj = JSON.parse(userStr);
    const navigate = useNavigate()
    const state = useContext(Context)
    const { user, setUser, 
        stocks, setStocks } = state;

    const [toggle, setToggle] = useState(false);
    const [ stockSubscribeData, setStockSubscribeData ] = useState(null);

    // if not user-cookie refresh to login page
    useEffect(()=>{
        if(!userStr || !userObj){
            setUser(null);
            navigate("/login")
        }
    },[user]);

    // connect to socket only once, after rendering
    useEffect(() => {
        const newSocket = io(URL,{
            auth : userObj,
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
        axios.get(`${serverURL}/users/logout`, options).then(()=>{
            setCookie("user", null)
            setCookie("session", null)
            setCookie("session.sig", null)
            axios.get(`${serverURL}/auth/logout`).catch(err => console.log(err));
            setUser(null);
            navigate("/login")
        }).catch((err)=>{
            console.log(err)
            setCookie("user", null)
            setCookie("session", null)
            setCookie("session.sig", null)
            axios.get(`${serverURL}/auth/logout`).catch(err => console.log(err));
            setUser(null);
            navigate("/login")
        });
    }

    // Subscribe to Stock Topics
    const subscribeStock = (stock, is_subscribed) => {
        setStockSubscribeData({
            stock : stock,
            is_subscribed : !is_subscribed
        })
    }

    // socket.emit("subscribe", stockSubscribeData, (success)=>{
    //     console.log("success", success)
    //     if(success){
    //         console.log("here")
    //         let stock = stockSubscribeData.stock;
    //         stock.is_subscribed = stockSubscribeData.is_subscribed;
    //         let arr = stocks.map((item) => item.id === stock.id ? stock : item);
    //         setStocks(arr);
    //         setStockSubscribeData(null);
    //     }
    // });

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
                let stock_id = obj.id;
                console.log("debug : stock-id calls :" , stock_id);
                let arr = stocks;
                // get stocks array and update orders of that stock
                arr = arr.map((item) => { 
                    if(item.id === stock_id){
                        item.orders = obj.orders;
                        return item;
                    }
                    return item;
                });
                setStocks(arr);
            })
        }
    },[toggle])
    

  return (
    <div className='container'>
        <h1 className='heading'>Home</h1>
        <button onClick={logoutUser}>Logout</button>
        <h3>Stocks</h3>
        <ul>
            { stocks.map((item)=>{
                return <li key={item.id}>{item.name} <button style={{ backgroundColor: item.is_subscribed ? "purple" : "blue", color:"white", cursor:"pointer" }} onClick={() => subscribeStock(item, item.is_subscribed)}>{item.is_subscribed ? "Subscribed" : "Subscribe"}</button></li>
            }) }
        </ul>

        <br/>
        <br/>
        {
            stocks.filter( stock => stock.is_subscribed === true).map((stock, idx)=>{
                return <div key={idx}>
                    <br />
                    <br />
                    <h1>{stock.name}</h1>
                    <br/>
                    <ul>
                        {
                        stock.orders.sort((a,b)=> a.id>b.id ? -1 : 1).slice(0,duration[0].time).map((item, id)=>{
                                return <li key={id}>Id : {item.id} | Value : {item.value} | Total Orders : {item.count}</li>
                            })
                        }
                    </ul>
                </div>
            })
        }

    </div>
  )
}

export default Home
