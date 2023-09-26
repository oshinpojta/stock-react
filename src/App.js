import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Context from "./Utils/Context";
import { useState, useEffect } from 'react';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import { getCookie } from "./Utils/HandleCookie"


function App() {
  
  const userStr = getCookie("user");
  const userObj = userStr ? JSON.parse(userStr) : null;
  const [user, setUser] = useState(userObj);
  const [stocks, setStocks] = useState([]);
  const [subscribedStocks, setSubscribedStocks] = useState([]);
  const state = {
    user : userObj,
    setUser,
    stocks,
    setStocks,
    subscribedStocks,
    setSubscribedStocks
  }

  return (
    <Router>
      <Context.Provider value={state}>
       <div className="container">
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
