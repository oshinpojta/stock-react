import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
  const {duration, setDuration} = props;

  const handleChange = (event) => {
    setDuration(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 100, maxWidth: 200, 
        marginLeft:"3rem",
        marginBottom:"10rem",
        "@media only screen and (max-width: 600px)" : {
            width:100,
            fontSize:"1rem"
    } }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" >Set Chart Duration</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={duration}
          label="Duration"
          onChange={handleChange}
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