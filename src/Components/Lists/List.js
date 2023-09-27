import * as React from 'react';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Context from '../../Utils/Context';


export default function Lists(props) {


    const state = React.useContext(Context);
    const { chartStock } = state;
    const { stocks } = props;
    const [ orderList, setOrderList ] = React.useState([]);

    const marginLeft = window.innerHeight < 700 ? "22%" : "20%"; 
    const boxStyles = { 
      width: '100%', 
      maxWidth: "460", 
      marginLeft:marginLeft,
      marginTop:"10%", 
      bgcolor: 'background.paper', 
      color:"black", 
      boxShadow:"3px 3px 3px 3px rgba(0, 0, 0, 0.2)",
      alignText:"center",
      height:"70vh",
      marginBottom:"5rem",
      display:"block"
    }
    
    const orderStyles = {
      fontSize : window.innerWidth > 700 ? "1rem" : "0.8rem",
      alignText: "center",
      display:"flex",
      padding:"2px"
    }
    
    const showCurrencyIcon = window.innerWidth > 700 ? true : false ;
    const listLength = window.innerWidth > 700 ? 10 : 5 ;
    const listHeaderFontSize = window.innerWidth > 700 ? "1.5rem" : "1.2rem" ;
    
    React.useEffect(()=>{
        if(chartStock){
          let selectedStocks = stocks.filter((stock) => stock.id == chartStock);
          if(selectedStocks && selectedStocks.length>0){
            let chartStock = selectedStocks[0];
            setOrderList(chartStock.orders.slice(-10))
          }
        }
      },[stocks, chartStock])
  

  return (
    <div style={boxStyles}>
        <h1 style={{ color:"#092e69", alignText:"center", marginLeft:"8%", fontSize:listHeaderFontSize }}><AddTaskIcon /> Last {listLength} Executed Orders</h1>
        <ul>
            {
                orderList.sort((a, b) => { return a.id < b.id ? 1 : -1 }).slice(0, listLength).map((order, idx) => {
                    return <li key={order.id} style={{ 
                      listStyle : showCurrencyIcon ? "none" : "initial",
                      backgroundColor: idx == 0 ? "#ade8f0" : "white",
                      transition: "all 1s ease",
                      WebkitTransition: "all 1s ease",
                      MozTransition: "all .1s ease",
                      borderRadius : "2px",
                      padding:"2px"
                      }}> 
                      <p style={orderStyles}> { showCurrencyIcon && <CurrencyExchangeIcon sx={{ marginLeft:"1rem", marginRight:"1rem", display:"inline-block" }}/> } {`Order No.${order.id} @ Price Rs.${order.value} ( Orders Completed:${order.count} )`}</p>
                    </li>
                })
            }
        </ul>
    </div>
  );
}