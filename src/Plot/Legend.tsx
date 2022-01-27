import React from 'react';
import Pattern from './Pattern';
import {AccessorItem, PlotDimensions} from './types';

type Props = {
  items: AccessorItem[],
  plotDimensions?: PlotDimensions,
}

const Legend: React.FC<Props> = ({items}) =>{
  const width = 40;
  const height = 20;

  return(
    <div className="legend" style={{marginTop: "20px"}}>
    {items.map((item, index)=>(
      <div className="legend-item">
        <div className="legend-rect">
          <svg style={{display: "block"}} viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <clipPath id={`legend-cut-off${index}`}>
                <rect
                  height={height}
                  width={width} rx={2}>
                </rect>
              </clipPath>
            </defs>
            <rect
              height={height}
              fill={item.color}
              width={width}
              rx={2}>
            </rect>
            <Pattern
              name={items[index].pattern}
              barWidth={width}
              barHeight={height}
              clipPath={`url(#legend-cut-off${index})`}
              color={items[index].color}
              intensity={1}
            />
          </svg>
        </div>
        <div style={{marginLeft: "5px"}}>{item.legendLabel}</div>
      </div>
    ))}
    </div>
  );
}

export default Legend;
