import React, { useContext, useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Context from '../../Utils/Context';

import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';

const rootStyles={
  height:"110vh",
  backgroundColor:"#fafafa",
  position:"fixed", 
  top:"68px",
  overflow:"scroll",
  boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  "@media screen and (max-width: 600px)" : {
    width:"150px"
  }
}

const arrowIconStyles = { color:"black", float:"right", margin:"10", width:"100%", cursor:"pointer" };
const menuIconStyles = { fontSize:"1.4rem", marginLeft:"2.5rem" }
const menuItemsStyles = { 
    display: 'flex',
    alignItems: 'left',
    flexWrap: 'nowrap',
    fontSize:"1.2rem",
} 


// https://github.com/azouaoui-med/react-pro-sidebar
const SideBar = () => {

    const state = useContext(Context);
    const { stocks, subscribeStock, toggleBar, setToggleBar, setChartStock, setLogout } = state;

    const toggleBarState = () => {
        setToggleBar(!toggleBar);
    }

    useEffect(()=>{
        if(window.innerWidth < 700){
            setToggleBar(true);
        }
    },[])

  return (
    <Sidebar component={"div"} width='270px' collapsedWidth='60px' collapsed={toggleBar} rootStyles={rootStyles} >
        <button onClick={toggleBarState}>
            { toggleBar ? <KeyboardDoubleArrowRightOutlinedIcon style={arrowIconStyles}/> : <KeyboardDoubleArrowLeftOutlinedIcon style={arrowIconStyles}/> }
        </button>

    <Menu menuItemStyles={{
      button: {
        // the active class will be added automatically by react router
        // so we can use it to style the active menu item
        [`:hover`]: {
            backgroundColor: '#91d1ff',
            color: 'black',
          },
        color:"black"
      },
    }}>
        <SubMenu style={{  fontSize:"1.2rem" }} defaultOpen={true} label="All Stocks" >
        { stocks.map((stock) => {
            return <div key={stock.id}><MenuItem style={menuItemsStyles} key={stock.id+"stocks"}> <span style={{ display:"inline-block" }}>{stock.name}</span> <span>{ stock.is_subscribed ? <CancelIcon style={{...menuIconStyles, color:"red"}} onClick={() => { subscribeStock(stock, stock.is_subscribed) }} /> : <AddCircleOutlineIcon style={{...menuIconStyles, color:"blue"}} onClick={() => { subscribeStock(stock, stock.is_subscribed) }} /> }</span> </MenuItem></div>
        }) }
        </SubMenu>
        <SubMenu style={{  fontSize:"1.2rem" }} defaultOpen={true} label="Subscribed Stocks" >
        { stocks.filter((stock)=> stock.is_subscribed ).map((stock) => {
            return <div key={stock.id} onClick={() => { setChartStock(stock.id) }}><MenuItem style={menuItemsStyles}  key={stock.id+"subStocks"}> {stock.name} <p style={{ display:"inline", marginLeft:"0.5rem", color: stock.orders.slice(-1)[0].value > stock.startPrice ? "green" : "red"}}>{stock.orders.slice(-1)[0].value > stock.startPrice ? "+" : "-"}{Math.round((stock.orders.slice(-1)[0].value/stock.startPrice)*1000)/1000}%</p> <VisibilityIcon style={{ ...menuIconStyles, color:"gray" }} /></MenuItem></div>
        }) }
        </SubMenu>
      <MenuItem style={{  fontSize:"1.2rem" }}>  <a key={"node-repo"} href='https://github.com/oshinpojta/stock-react' target="_blank" rel='noreferrer' style={{ textDecoration:"none", color:"black" }}> React-Repo Github </a> </MenuItem>
      <MenuItem style={{  fontSize:"1.2rem" }}> <a key={"react-repo"} href='https://github.com/oshinpojta/stock-node' target="_blank" rel='noreferrer' style={{ textDecoration:"none", color:"black" }}>Node-Repo Github </a> </MenuItem>
        <MenuItem style={{ backgroundColor:"red", color:"white", marginTop:"4rem", fontSize:"1.2rem" }} onClick={() => setLogout(true)}> Logout </MenuItem>
    </Menu>
    </Sidebar>
  )
}

export default SideBar
