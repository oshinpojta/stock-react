import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Context from "./Utils/Context";
import { useState, } from 'react';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import { getCookie } from "./Utils/HandleCookie"
import NavBar from './Components/NavBar/NavBar';
import SideBar from './Components/SideBar/SideBar';

function App() {
  
  const userCookie = getCookie("user");
  const googleAuth = getCookie("googleAuth");
  let userObj = null;
  if(googleAuth == "true"){
    const userStr = decodeURIComponent(userCookie);
    userObj = JSON.parse(userStr);
  }
  const [user, setUser] = useState(userObj);
  const [stocks, setStocks] = useState([]);
  const [subscribedStocks, setSubscribedStocks] = useState([]);
  const [ logout, setLogout ] = useState(false);
  const [ stockSubscribeData, setStockSubscribeData ] = useState(null);
  const [ chartStock, setChartStock ] = useState(null);
  const [ toggleBar, setToggleBar ] = useState(false);
  const [duration, setDuration] = useState(60);

   // Subscribe to Stock Topics
   const subscribeStock = (stock, is_subscribed) => {
    if(chartStock && chartStock == stock.id && !is_subscribed == false){
      setChartStock(null)
    }
    setStockSubscribeData({
        stock : stock,
        is_subscribed : !is_subscribed
    })
}

  const state = {
    user : userObj,
    setUser,
    stocks,
    setStocks,
    subscribedStocks,
    setSubscribedStocks,
    logout,
    setLogout,
    stockSubscribeData, 
    setStockSubscribeData,
    subscribeStock,
    toggleBar, setToggleBar,
    chartStock, setChartStock,
    duration, setDuration
  }

  return (
    <Router>
      <Context.Provider value={state}>
       <div className="container">
          <NavBar />
          {/* <SideBar /> */}
          <Routes>
            <Route exact path="/" element={ user ? <Home /> : <Navigate to="/login" />} />
            <Route exact path="/login" element={user ? <Navigate to="/" /> : <Login /> } />
          </Routes>
      </div>
      </Context.Provider>
    </Router>
  );
}

export default App;
