import React from 'react';
import {ColorSettings, FontSettings, PlotDimensions} from './types';
import Ticks from './Ticks';

type AxisType = 'x' | 'y';

type Props = {
  axis: AxisType,
  plotDimensions: PlotDimensions,
  colorSettings?: ColorSettings,
  fontSettings?: FontSettings,
  lineColor: string,
  labelColor?: string,
  label?: string,
  labelFontSize?: number,
  ticksFontSize?: number,
  scale?: d3.ScaleLinear<number, number> | d3.ScaleTime<number, number>,
}

type AxisLabelProps = {
  label:string,
  labelFontSize?:number,
  labelColor?: string,
  plotDimensions:PlotDimensions,
  axis: AxisType,
}

const Axis: React.FC<Props> = ({
    axis,
    plotDimensions,
    scale,
    lineColor="#ddd",
    labelColor="#ddd",
    label,
    labelFontSize=30,
    ticksFontSize=30,
  }) => {
    const {boundedHeight, boundedWidth} = plotDimensions;
    return (
      <>
        <g>
          {axis==="x"?
            <line y1={boundedHeight} y2={boundedHeight} x2={boundedWidth} stroke={lineColor}/>
            :
            <line y2={boundedHeight} stroke={lineColor}/>
          }
          {label && <AxisLabel axis={axis} plotDimensions={plotDimensions} label={label} labelColor={labelColor} labelFontSize={labelFontSize}/>}
          {scale && <Ticks axis={axis} plotDimensions={plotDimensions} scale={scale} lineColor={lineColor} tickFontSize={ticksFontSize}/>}
        </g>
      </>
    )
}

const AxisLabel:React.FC<AxisLabelProps> = ({axis, label, labelFontSize=30, labelColor="black", plotDimensions}) => {
  const {boundedWidth, boundedHeight, marginBottom, marginLeft} = plotDimensions;
  return (
  <>
    {axis==="y" &&
      <g style={{transform:`rotate(-90deg)`}}>
        <text transform={`translate(${-boundedHeight*0.5}, ${-marginLeft+2*labelFontSize})`} textAnchor={"middle"} fontSize={labelFontSize} fill={labelColor}>{label}</text>
      </g>
    }
    {axis==="x" &&
      <g transform={`translate(${boundedWidth*0.5}, ${boundedHeight+marginBottom})`}>
        <text textAnchor={"middle"} fill={labelColor} fontSize={labelFontSize}>{label}</text>
      </g>
    }
  </>
)}

export default Axis;
