import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Context from '../../Utils/Context';

const Duration = [
    {
        name : "1min",
        time : 60
    },
    {
        name : "5min",
        time : 60*5
    },
    {
        name : "10min",
        time : 60*10
    },
    {
        name : "15min",
        time : 60*15
    },
    {
      name : "30min",
      time : 60*30
    },
    {
      name : "1hour",
      time : 60*60
    },
  ]
  

export default function Dropdown(props) {

  const state = React.useContext(Context);
  const {duration, setDuration, toggleBar} = state;

  const handleChange = (event) => {
    setDuration(event.target.value);
  };

  return (
    <Box sx={{ 
        minWidth: window.innerWidth*0.4, 
        maxWidth: 300, 
        // padding:"0",
        height:"20px",
        minHeight: "10",
        maxHeight: "20", 
        marginLeft:"40%",
        marginTop:"2rem",
        visibility: window.innerWidth>700 ? "visible" : !toggleBar ? "hidden" : "visible" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" >Chart Duration</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={duration}
          label="Duration"
          onChange={handleChange}
          MenuProps={{
            style: {
               maxHeight: "auto"
                }
            }}
        >
            {
                Duration.map((item) => {
                    return <MenuItem style={{ color:"black" }} key={item.name} value={item.time}>{item.name}</MenuItem>
                })
            }
          
        </Select>
      </FormControl>
    </Box>
  );
}