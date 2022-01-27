import React from 'react';
import {PlotDimensions, TickType} from './types';
import * as d3 from 'd3';
import { TimeInterval } from 'd3';

const stringParser = d3.timeFormat("%Y")

type TickProps = {
  plotDimensions: PlotDimensions
  tickFontSize: number,
  lineColor: string,
  axis: "x"|"y",
  scale: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number>,
  lineWidth?: number
}

const Ticks: React.FC<TickProps> = ({axis, tickFontSize, plotDimensions, scale, lineColor, lineWidth=1}) =>{
  const {boundedHeight} = plotDimensions;
  const myFormat = d3.formatLocale({thousands: "\u2009", decimal: ".", grouping: [3], currency: ["Euro", ""] })
  const interval = d3.timeYear.every(1) as TimeInterval;
  let ticks:TickType[];
  if(axis==="x"){
    ticks = (scale as d3.ScaleTime<number,number>).ticks(interval)
      .map((value)=>({
        value,
        offset: scale(value)
      } as TickType))
  }
  else{
    ticks = (scale as d3.ScaleTime<number,number>).ticks()
      .map((value)=>({
        value,
        offset: scale(value)
      } as TickType))
  }
  return(
    <>
      {axis==="x" && ticks.map(({value, offset}, index)=>(
        <g key={index} transform={`translate(${offset}, ${boundedHeight})`}>
          <line y2={8} stroke={lineColor} strokeWidth={lineWidth}/> 
          <text key={index} textAnchor="end" dominantBaseline="middle" style={{
            fontSize: tickFontSize,
            fill: `${lineColor}`,
            transformOrigin: "top left",
            transform: `translate(0px, 30px) rotate(-40deg)`}}
          >{stringParser(value as Date)+"/"+(parseInt(stringParser(value as Date).slice(-2))+1)}</text>
        </g>
      ))}
      {axis==="y" && ticks.map(({value, offset}, index)=>(
        <g key={index} transform={`translate(0, ${boundedHeight-offset})`}>
          <line x2={-8} stroke={lineColor} strokeWidth={lineWidth}/> 
          <text key={index} style={{fontSize: tickFontSize, fill: `${lineColor}`, textAnchor:"end", transform: "translate(-10px,2px)"}}>{myFormat.format(",")(value)}</text>
        </g>
      ))}
    </>
  )
}

export default Ticks
