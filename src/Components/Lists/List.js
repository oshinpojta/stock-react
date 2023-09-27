import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Context from '../../Utils/Context';

export default function Lists(props) {

    const state = React.useContext(Context);
    const { chartStock } = state;
    const { stocks } = props;
    const [ orderList, setOrderList ] = React.useState([]);
    
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
    <Box sx={{ width: '100%', maxWidth: 460, bgcolor: 'background.paper', color:"black", boxShadow:"3px 3px 3px 3px rgba(0, 0, 0, 0.2)" }}>
      <nav aria-label="main mailbox folders">
        <h1 style={{ color:"#092e69" }}><AddTaskIcon /> Last 10 Prices with Executed Orders</h1>
        <List dense={true}>
            {
                orderList.sort((a, b) => { return a.id < b.id ? 1 : -1 }).map((order) => {
                    return <ListItem disablePadding>
                            <ListItemButton>
                            <ListItemIcon>
                                <CurrencyExchangeIcon />
                            </ListItemIcon>
                            <ListItemText primary={`Order No.${order.id} @ Price Rs.${order.value}`} />
                            <ListItemText secondary={` ( Orders Completed:${order.count} )`} />
                            </ListItemButton>
                        </ListItem>
                })
            }
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CurrencyExchangeIcon />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
    </Box>
  );
}