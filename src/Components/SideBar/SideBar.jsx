import React, { useContext, useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Context from '../../Utils/Context';

import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

const arrowIconStyles = { color:"black", float:"right", margin:"10", width:"100%", cursor:"pointer" };
const menuIconStyles = { fontSize:"1.6rem", marginLeft:"1.5rem" }
const menuItemsStyles = { 
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    //boxShadow:"2px 3px lightblue inset" 
} 


// https://github.com/azouaoui-med/react-pro-sidebar
const SideBar = () => {

    const state = useContext(Context);
    const { stocks, subscribeStock, toggleBar, setToggleBar, setChartStock } = state;

    const toggleBarState = () => {
        setToggleBar(!toggleBar);
    }

    useEffect(()=>{
        if(window.innerWidth < 700){
            setToggleBar(true);
        }
    },[])

  return (
    <Sidebar width='270px' collapsed={toggleBar} rootStyles={{
        height:"110vh",
        backgroundColor:"#fafafa",
        boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        "@media only screen and (max-width: 600px)" : {
          width:"150px"
        }
      }} >
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
        <SubMenu defaultOpen={true} label="All Stocks" >
        { stocks.map((stock) => {
            return <div key={stock.id}><MenuItem style={menuItemsStyles} key={stock.id+"stocks"}> <span>{stock.name}</span> { stock.is_subscribed ? <CancelIcon style={{...menuIconStyles, color:"red"}} onClick={() => { subscribeStock(stock, stock.is_subscribed) }} /> : <AddCircleOutlineIcon style={{...menuIconStyles, color:"blue"}} onClick={() => { subscribeStock(stock, stock.is_subscribed) }} /> } </MenuItem></div>
        }) }
        </SubMenu>
        <SubMenu defaultOpen={true} label="Subscribed Stocks" >
        { stocks.filter((stock)=> stock.is_subscribed ).map((stock) => {
            return <div key={stock.id} onClick={() => { setChartStock(stock.id) }}><MenuItem style={menuItemsStyles}  key={stock.id+"subStocks"}> {stock.name} <p style={{ display:"inline", marginLeft:"0.5rem", color: stock.orders.slice(-1)[0].value > stock.startPrice ? "green" : "red"}}>{stock.orders.slice(-1)[0].value > stock.startPrice ? "+" : "-"}{Math.round((stock.orders.slice(-1)[0].value/stock.startPrice)*1000)/1000}%</p></MenuItem></div>
        }) }
        </SubMenu>
        <MenuItem> React Repo Github </MenuItem>
        <MenuItem> Node Repo Github </MenuItem>
    </Menu>
    </Sidebar>
  )
}

export default SideBar
