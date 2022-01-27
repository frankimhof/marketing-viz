import {DataEntry, PatternType} from '../types'

type PlotDimensions = {
  width: number,
  height: number,
  boundedWidth: number,
  boundedHeight: number,
  marginLeft: number,
  marginRight: number,
  marginTop: number,
  marginBottom: number,
}

interface AccessorItem {
  legendLabel: string,
  color?: string,
  pattern?: PatternType,
  accessor: (d:DataEntry) => number
}

type TickType = {
  value: number | Date,
  offset: number,
}

type FontSettings = {
  valueFontSize?: number,
  xTicksFontSize?: number,
  yTicksFontSize?: number,
  yLabelFontSize?: number,
  xLabelFontSize?: number,
}

type ColorSettings = {
  backgroundColor?: string,
  valueColor?: string,
  xTicksColor?: string,
  yTicksColor?: string,
  xAxisColor?: string,
  yAxisColor?: string,
  xLabelColor?: string,
  yLabelColor?: string
  gridLineColor?: string,
}

export type {PlotDimensions, TickType, AccessorItem, FontSettings, ColorSettings}
