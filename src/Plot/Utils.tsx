import {PlotDimensions} from './types';

const createDimensions = (width:number, height: number, marginLeft: number, marginRight: number, marginTop:number, marginBottom: number):PlotDimensions => {
  return {
    width,
    height,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    boundedWidth:width-marginLeft-marginRight,
    boundedHeight:height-marginTop-marginBottom,
  }
}

export {createDimensions};
