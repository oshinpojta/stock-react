import React, { useContext, useEffect, useState } from 'react'
import "./Home.css"
// import { socket } from '../../Utils/Socket';
import { setCookie, getCookie } from '../../Utils/HandleCookie';
import { io } from 'socket.io-client';
import Context from '../../Utils/Context';
import axios from 'axios';

const serverURL = process.env.REACT_APP_SERVER_URL2;
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

const Home = () => {

    const state = useContext(Context)
    const { user, setUser, 
        stocks, setStocks } = state;

    const userStr = getCookie("user");
    const userObj = JSON.parse(userStr);
    if(!userStr || !userObj){
        setUser(null);
    }
    const socket = io(URL,{
        auth : userObj,
        autoConnect: false
    });
    socket.connect()

    // socket.on("connect", () => {
    //     console.log("Connected ", socket.id);
    // });
    // socket.on("disconnect", () => {
    //     console.log("disconnected")
    // })

    // socket.on("logout", ()=>{
    //     console.log("Logged OUT!");
    // })
    socket.on("error", (message) => {
        console.log("error", message)
    })

    socket.on("connect_failed", () => {
        console.log("failed")
    })
    socket.on("logout", () => { console.log("Logout!!!") });

    const [isConnected, setIsConnected] = useState(socket.connected);

    const options = {
        headers : {
            token : user.token
        }
    }
    const logoutUser = () => {
        setCookie("user", null)
        setUser(null);
        socket.disconnect();
        axios.get(`${serverURL}/users/logout`, options);
    }

    const onConnect = () => {
        setIsConnected(true);
    }
  
    const onDisconnect = () => {
        setIsConnected(false);
    }

    const subscribeStock = (stock, is_subscribed) => {
        socket.emit("subscribe", stock, !is_subscribed, (success)=>{
            // console.log("success", success)
            if(success){
                stock.is_subscribed = !is_subscribed;
                let arr = stocks;
                arr = arr.map((item) => item.id === stock.id ? stock : item);
                setStocks(arr);
            }
        })
    }

    useEffect(() => {
        
        socket.on("order", (obj) => {
            let stock_id = obj.id;
            let arr = stocks;
            arr = arr.map((item) => { 
                if(item.id === stock_id){
                    item.orders = obj.orders;
                    return item;
                }
                return item;
            });
            setStocks(arr);
            // console.log(arr);
        })
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on("logout", () => { console.log("Logout!!!") });
        return () => {
          socket.off("order");
          socket.off('connect', onConnect);
          socket.off('disconnect', onDisconnect);
        };
      }, []);
    

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
                        stock.orders.sort((a,b)=> a.id>b.id ? -1 : 1).slice(0,10).map((item, id)=>{
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
