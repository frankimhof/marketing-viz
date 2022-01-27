// @flow 
import * as React from 'react';
import { PatternType } from '../types';
import {rgb} from 'd3';

type Props = {
  name: PatternType | undefined,
  barWidth: number,
  barHeight: number,
  clipPath: string,
  color?: string,
  intensity?: number,
};

const Pattern = ({name, barWidth, barHeight, clipPath, color="#000", intensity=2}: Props) => {
  let objectsToRender:any[]=[];
  const patternColor = rgb(color).darker(intensity).formatHex()
  switch(name){
    case "diagonal-lines":
    objectsToRender = diagonalLines(barWidth, barHeight, patternColor);
    break;
    case "checkered":
    objectsToRender = checkered(barWidth, barHeight, patternColor);
    break;
    case "sine":
    objectsToRender = sine(barWidth, barHeight, patternColor);
    break;
    case "circles":
    objectsToRender = circles(barWidth, barHeight, patternColor);
    break;
    default:
    objectsToRender = [];
  }
  return(
    <g clipPath={clipPath}>
      {objectsToRender}
    </g>
  )
};

const degToRadian = (deg:number):number => {
  return deg*Math.PI/180;
}

const diagonalLines = (barWidth:number, barHeight:number, color:string) =>{
  const angle = 20;
  const startPoint = Math.tan(degToRadian(angle))*barWidth;
  let lines = [];
  for(let i = -startPoint; i<barHeight; i+=20){
    lines.push(<line style={{transform: `translate(0, ${i}px) rotate(${angle}deg)`}} x2={barWidth*1.5} stroke={color} stroke-width="2" stroke-linecap="square"/>)
  }
  return lines
}

const checkered = (barWidth:number, barHeight:number, color:string) =>{
  const angle = 30;
  const startPoint = Math.tan(degToRadian(angle))*barWidth;
  let lines = [];
  for(let i = -startPoint; i<barHeight; i+=10){
    lines.push(<line style={{transform: `translate(0, ${i}px) rotate(${angle}deg)`}} x2={barWidth*1.5} stroke={color} stroke-width="2" stroke-linecap="square"/>)
    lines.push(<line style={{transform: `translate(0, ${i+startPoint}px) rotate(-${angle}deg)`}} x2={barWidth*1.5} stroke={color} stroke-width="1" stroke-linecap="square"/>)
  }
  return lines
}

const sine = (barWidth:number, barHeight:number, color:string) =>{
  let paths = [];
  const amp = 20;//amplitude
  const period = 40;
  const firstHalf =`M 0 0 Q ${period*0.25} ${amp} ${period*0.5} 0`;
  const secondHalf =`M ${period*0.5} 0 Q ${period*0.75} ${-amp} ${period} 0`;
  for(let i = 0; i<=barHeight+100; i+=1.5*amp){
    for(let j = -period; j<=barWidth; j+=0.75*period){
      paths.push(
      <g style={{transform: `translate(${j}px, ${i+amp*0.5}px)`}}>
        <path d={firstHalf}  fill="none" stroke={color} stroke-width="2"/>);
        <path d={secondHalf}  fill="none" stroke={color} stroke-width="2"/>);
      </g>
      )
    }
  }
  return paths
}
const circles = (barWidth:number, barHeight:number, color:string) =>{
  let circles = [];
  for(let i = 0; i<=barHeight+20; i+=25){
    for(let j = 0; j<=barWidth+20; j+=20){
      circles.push(
      <g style={{transform:"translate(10px, 10px)"}}>
        <circle cx={j} cy={i} r={3} fill={color}/>
        <circle cx={j} cy={i} r={10} fill="transparent" stroke={color} strokeWidth={2}/>
      </g>)
    }
  }
  return circles 
}
export default Pattern;
