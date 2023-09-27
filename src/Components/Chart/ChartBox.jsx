import React, { useContext, useEffect, useState } from 'react'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js/auto';
import { Line } from 'react-chartjs-2'

import Context from '../../Utils/Context'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartBox = (props) => {

    const stocks = props.stocks;
    const state = useContext(Context);

    const { chartStock, toggleBar, duration } = state;
    const chartDataObj = {
      labels : [],
      datasets : [
        {
          label: "Stock Price",
          backgroundColor : "rgba(9, 235, 47)",
          data : [],
          fill: true,
          borderWidth: 1
        }
      ]
    }

    const [chartWidth, setChartWidth] = useState("62vw");
    const [chartData, setChartData] = useState(chartDataObj)
   

    useEffect(()=>{
      if(chartStock){
        let selectedStocks = stocks.filter((stock) => stock.id == chartStock);
        if(selectedStocks && selectedStocks.length>0){
          let chartStock = selectedStocks[0];
          const Obj = {
            labels : chartStock.orders.slice(-duration).map((order)=> order.id),
            datasets : [
              {
                label: chartStock.name+ " Price at Rs:"+ chartStock.orders.slice(-1)[0].value ,
                backgroundColor : chartStock.orders.slice(-1)[0].value > chartStock.startPrice ? "rgba(9, 235, 47)" : "rgba(207, 16, 2)",
                data : chartStock.orders.slice(-duration).map((order)=> order.value),
                borderWidth: 5,
                fill: {
                  target: 'origin',
                  above: chartStock.orders.slice(-1)[0].value > chartStock.startPrice ? "rgba(138, 219, 160)" : "rgba(191, 80, 80)",  // Area will be red above the origin
                }
              }
            ]
          }
          setChartData(Obj);
        }
      }
    },[stocks, chartStock, setChartData, duration])

    useEffect(()=>{
        if(toggleBar){
            setChartWidth("80vw")
        }else{
            setChartWidth("62vw")
        }
    }, [toggleBar])


  return (
    <div style={{ width:chartWidth, height:"45vh", margin:"3rem", marginRight:"3rem"}}>
      { !chartStock && <h1 style={{ color:"white" }}>Tap on 1 Subscribed Stock !</h1> }
      { chartStock && <Line redraw={false} options={{
            type : "bar",
            responsive:true,
            animation: false,
            redraw:false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Current Market Price',
              },
            },
        }} data={chartData} /> }
    </div>
  )
}

export default ChartBox
