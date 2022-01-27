import React from 'react';
import {PlotDimensions, TickType} from './types';

type GridLineProps = {
  plotDimensions: PlotDimensions
  lineColor?: string,
  axis: "x"|"y",
  scale: d3.ScaleLinear<number, number>,
}

const GridLine : React.FC<GridLineProps> = ({axis, plotDimensions, scale, lineColor="#eee"}) =>{
  const {boundedHeight, boundedWidth} = plotDimensions;
  
  const ticks: TickType[] = scale.ticks()
    .map((value)=>({
      value,
      offset: scale(value)
    } as TickType))

  return(
    <>
      {axis==="x" && ticks.map(({offset}, index)=>(
        <g key={index} transform={`translate(${offset}, ${boundedHeight})`}>
          <line y2={boundedWidth} stroke={lineColor}/> 
        </g>
      ))}
      {axis==="y" && ticks.map(({offset}, index)=>(
        <g key={index} transform={`translate(0, ${boundedHeight-offset})`}>
          <line x2={boundedWidth} stroke={lineColor}/> 
        </g>
      ))}
    </>
  )
}

export default GridLine;
