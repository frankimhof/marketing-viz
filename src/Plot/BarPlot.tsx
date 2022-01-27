import React from 'react';
import * as d3 from 'd3';
import {PlotDimensions, AccessorItem, FontSettings, ColorSettings } from './types';
import {DataEntry} from '../types';
import Axis from './Axis';
import GridLine from './GridLine';
import Pattern from './Pattern';
import { TimeInterval } from 'd3';

type Props = {
  data: DataEntry[],
  legend: AccessorItem[],
  xAccessor: (d:DataEntry)=>Date,
  yAccessors: ((d:DataEntry)=>number)[],
  xAxisLabel?: string,
  yAxisLabel?: string,
  xGridLine?: boolean,
  yGridLine?: boolean,
  fontSettings?: FontSettings,
  colorSettings?: ColorSettings, 
  barGroupSpacing?: number,
  barSpacing?: number,
  isStacked?: boolean,
  showValues?: boolean,
  xScaleMarginLeft?: number,
  xScaleMarginRight?: number,
  plotDimensions: PlotDimensions,
}

const BarPlot: React.FC<Props> = ({
  isStacked=false,
  data, xAccessor, yAccessors,
  legend, 
  yGridLine=true, barSpacing=5, barGroupSpacing=10,
  yAxisLabel="yAxisLabel",
  xAxisLabel="xAxisLabel",
  fontSettings,
  colorSettings,
  plotDimensions,
  showValues=false,
}) => {
  const {valueFontSize=20, yLabelFontSize, xLabelFontSize, xTicksFontSize, yTicksFontSize} = fontSettings || {};
  const defaultColor = "#ddd";
  //@ts-ignore
  const {
    backgroundColor="#303030",
    valueColor=defaultColor,
    gridLineColor=d3.rgb(defaultColor).darker(3).formatHex(),
    xLabelColor=defaultColor,
    yLabelColor=defaultColor,
    xAxisColor=defaultColor,
    yAxisColor=defaultColor
  } = colorSettings || {};

  const {width, height, boundedHeight, marginTop, marginLeft} = plotDimensions;

  //get the extents of all data that will be shown and use the biggest to scale the entire visualization
  const biggestExtentAccessor = isStacked ?
    (d:DataEntry) => yAccessors.reduce((accum, curr) => accum+curr(d), 0)
    :
    yAccessors.reduce((current, next) => ((d3.extent(data, next))[1] as number)>((d3.extent(data, current))[1] as number)? next:current, yAccessors[0])

  const yScale = d3
    .scaleLinear()
    .domain([0, (d3.extent(data, biggestExtentAccessor)[1] as number)])//toDo: make domain parameterizable [0+offsetBottom, extent+offsetTop]
    .range([0, plotDimensions.boundedHeight])
    .nice()

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xAccessor) as Date[])
    .range([100, plotDimensions.boundedWidth-100])
    .nice()
  
  const interval = d3.timeYear.every(1) as TimeInterval;
  //const entryWidth = boundedWidth/data.length;//The max width for each DataEntry. 
  //@todo ticks verbessern, momentan ist das mit dem interval sowohl hier, wie auch bei <Ticks> noetig
  const entryWidth = xScale(xScale.ticks(interval)[1]) - xScale(xScale.ticks(interval)[0]);
  const numberOfBarsPerGroup = yAccessors.length;
  const barWidth = isStacked?
    entryWidth-barGroupSpacing
    :
    (entryWidth-barGroupSpacing-(numberOfBarsPerGroup-1)*barSpacing)/numberOfBarsPerGroup;//split maxBarWidth evenly between the bars if there is more than one.
  //the svg patterns had to be added to /public/index.html
  return(
    <div className="plot">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinyMin meet" style={{backgroundColor: backgroundColor , borderRadius: "5px"}}>
        <g transform={`translate(${marginLeft}, ${marginTop})`}>
          {yGridLine && <GridLine axis="y" scale={yScale} plotDimensions={plotDimensions} lineColor={gridLineColor}/>}
          {data.map((d, index)=>{
            return(
              <g transform={`translate(${xScale(xAccessor(d))-entryWidth*0.5}, 0)`} key={index}>
                <g>
                  {yAccessors.map((yAcc, barIndex) => {
                    const topLeftCornerPosition = isStacked?
                      yAccessors
                        .slice(0, barIndex+1)
                        .reduce((accum, curr) => accum + yScale(curr(d)), 0)
                      :
                      yScale(yAcc(d))
                    return (
                      <g transform={`translate(${isStacked? barGroupSpacing*0.5 : barGroupSpacing*0.5 + barIndex*barWidth+barIndex*barSpacing}, ${boundedHeight-topLeftCornerPosition})`} key={barIndex}>
                        <defs>
                          <clipPath id={`cut-off${index}-${barIndex}`}>
                            <rect
                              height={yScale(yAcc(d))}
                              width={barWidth} rx={2}>
                            </rect>
                          </clipPath>
                        </defs>
                        <rect
                          height={yScale(yAcc(d))}
                          width={barWidth} rx={2}
                          style={{ fill:legend[barIndex].color }}>
                        </rect>
                        <Pattern name={legend[barIndex].pattern}
                          barWidth={barWidth}
                          barHeight={yScale(yAcc(d))}
                          clipPath={`url(#cut-off${index}-${barIndex})`}
                          color={legend[barIndex].color}
                          intensity={1}
                        />
                        {valueFontSize && showValues &&//show values only if not stacked
                        <g transform={`translate(${barWidth*0.5}, -5)`}>
                          <text fontWeight="bold" fontSize={valueFontSize} textAnchor="middle" style={{fill: `${valueColor}`}}>{yAcc(d)}</text>
                        </g>
                        }
                      </g>
                    )
                    })}
                </g>
                <g>
                  {yAccessors.map((yAcc, barIndex) => {
                    const topLeftCornerPosition = isStacked?
                      yAccessors
                        .slice(0, barIndex+1)
                        .reduce((accum, curr) => accum + yScale(curr(d)), 0)
                      :
                      yScale(yAcc(d))
                    return (
                      <g transform={`translate(${isStacked? barGroupSpacing*0.5 : barGroupSpacing*0.5 + barIndex*barWidth+barIndex*barSpacing}, ${boundedHeight-topLeftCornerPosition})`} key={barIndex}>
                        {valueFontSize && showValues &&
                        <g transform={`translate(${barWidth*0.5}, -5)`}>
                          <text fontWeight="bold" fontSize={valueFontSize} textAnchor="middle" style={{fill: `${valueColor}`}}>{yAcc(d)}</text>
                        </g>
                        }
                      </g>
                    )
                    })}
                </g>
              </g>
            )
          })}
          <Axis axis={"x"} labelColor={xLabelColor} scale={xScale} plotDimensions={plotDimensions} lineColor={xAxisColor} label={xAxisLabel} labelFontSize={xLabelFontSize} ticksFontSize={xTicksFontSize}/>
          <Axis axis={"y"} labelColor={yLabelColor} scale={yScale} plotDimensions={plotDimensions} lineColor={yAxisColor} label={yAxisLabel} labelFontSize={yLabelFontSize} ticksFontSize={yTicksFontSize}/>
        </g>
      </svg>
    </div>
  );
}

export default BarPlot;
