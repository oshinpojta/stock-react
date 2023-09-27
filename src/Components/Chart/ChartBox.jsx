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

    const { chartStock, duration } = state;
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

    const chartWidth = window.innerWidth*0.79;
    const chartHeight = window.innerHeight*0.35;
    const chartMarginLeft = window.innerHeight < 700 ? "24%" : "16%"; 
    const [chartData, setChartData] = useState(chartDataObj)

    useEffect(()=>{
      if(chartStock){
        let selectedStocks = stocks.filter((stock) => stock.id == chartStock);
        if(selectedStocks && selectedStocks.length>0){
          let chartStock = selectedStocks[0];
          const Obj = {
            labels : chartStock.orders.slice(-duration).map((order)=> new Date(order.executed_at).toTimeString().split(" ")[0] == "Invalid" ? "" : new Date(order.executed_at).toTimeString().split(" ")[0] ),
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


  return (
    <div style={{ width:chartWidth, height:chartHeight, marginLeft:chartMarginLeft, marginTop:"6rem"}}>
      { chartStock && <Line redraw={false} options={{
            type : "bar",
            responsive:true,
            maintainAspectRatio: false,
            animation: false,
            redraw:false,
            tension: 0.5,
            pointRadius: [...new Array(stocks.filter((stock) => stock.id == chartStock)[0].orders.slice(-duration).length-1).fill(2).map((element, idx) => {
              if(idx%(duration/120) == 0) return 2
              else return 0
            }), 8],
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Current Market Price',
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Executed At ( Time )'
                }
              },
          
              y: {
                grid: {
                  display: true,
                },
                title: {
                  display: true,
                  text: 'Price ( in Rs. )' 
                }
              },
            },
        }} data={chartData} /> }
    </div>
  )
}

export default ChartBox
