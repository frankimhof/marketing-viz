import React, {useEffect, useState} from 'react';
import './App.css';

import * as d3 from 'd3';
import {DataEntry, PatternType} from './types';
import {AccessorItem, PlotDimensions} from './Plot/types';
import Select, { SingleValue, MultiValue } from 'react-select';
import { useFetch } from './useFetch';
import { createDimensions } from './Plot/Utils';
import BarPlot from './Plot/BarPlot';
import Legend from './Plot/Legend';

//const colors = ["#200", "#311", "#422", "#533", "#644", "#755"]
//const colors = ["#fce70c", "#d4afb9", "#d1cfe2", "#9cadce", "#7ec4cf", "#daeaf6", "#aaa", "#bee5b0"]
const colors = ["#fce70c", ...d3.schemeSet2];
const patterns:PatternType[] = ["", "", "sine", "diagonal-lines", "", "circles", "checkered", "sine"]
const dateParser = d3.timeParse("%Y");

const getAvailableAccessors = (dataEntry:DataEntry):AccessorItem[] => {
  const foundKeys= Object.keys(dataEntry).slice(3, -1)

  return foundKeys.map(fKey => {
    const newItem:AccessorItem = {
      legendLabel: fKey,
      accessor: (d:DataEntry) => Math.round((d[fKey] as number)/d.totalNumberOfStudents*100)
    }
    return newItem
  })
}

const plotDimensions:PlotDimensions = createDimensions(1200, 600, 180, 50, 50, 150);

function App() {
  const [fachrichtung, setFachrichtung] = useState("Elektrotechnik");
  const [showSettings, setShowSettings] = useState(true);
  const [showValues, setShowValues] = useState(false);
  const [showAsPercentage, setShowAsPercentage] = useState(true);
  const [isStacked, setIsStacked] = useState(true);
  const [selectedAccessors, setSelectedAccessors] = useState<AccessorItem[] | undefined>(undefined)
  const [availableAccessors, setAvailableAccessors] = useState<AccessorItem[] | undefined>(undefined)
  const {data, error, isLoading} = useFetch('studierende.json')

  useEffect(()=>{
    if(data){
      const availableAcc = getAvailableAccessors(data[0]);
      setAvailableAccessors(availableAcc)
      setSelectedAccessors(availableAcc.filter(d=>d.legendLabel==="FHNW"))
    }
  }, [data])

  const handleFachrichtungChange = (newValue: SingleValue<{value: string, label:string}>) => {
    if(newValue===null){
      throw "Fachrichtung was not propperly selected"
    }
    else{
      setFachrichtung(newValue.label)
    }
  }

  const handleShowAsPercentageChange = () => {
    setShowAsPercentage(!showAsPercentage)
    if(showAsPercentage){
      //@ts-ignore
      setAvailableAccessors(availableAccessors.map(a => Object.assign(a, {accessor: (d:DataEntry) => d[a.legendLabel]})))
      //@ts-ignore
      setSelectedAccessors(selectedAccessors.map(a => Object.assign(a, {accessor: (d:DataEntry) => d[a.legendLabel]})))
    }
    else{//show as absolute
      //@ts-ignore
      setAvailableAccessors(availableAccessors.map(a => Object.assign(a, {accessor: (d:DataEntry) => Math.round((d[a.legendLabel] as number)/d.totalNumberOfStudents*100)})))
      //@ts-ignore
      setSelectedAccessors(selectedAccessors.map(a => Object.assign(a, {accessor: (d:DataEntry) => Math.round((d[a.legendLabel] as number)/d.totalNumberOfStudents*100)})))
    }
  }

  const handleSchoolChange = (newValues: MultiValue<{value:AccessorItem, label:string}>)=> {
    setSelectedAccessors(newValues.map((d=>d.value)))
  }

  const handleStackedChange = () => {
    setIsStacked(!isStacked)
  }

  const handleShowSettings = () => {
    setShowSettings(!showSettings)
  }

  return (
    <div className="App">
      {availableAccessors && selectedAccessors &&
        <>
          <div className="settings">
            <div onClick={handleShowSettings} style={{padding: "5px", display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
              <svg width={20} height={20}>
                <g style={{transform: showSettings? "rotate(90deg)": "", transformOrigin: "center"}}> 
                  <line transform="translate(0, 4)" x1={2} x2={18} strokeWidth={4} stroke="#ddd" strokeLinecap="round"/>
                  <line transform="translate(0, 10)"x1={2} x2={18} strokeWidth={4} stroke="#ddd" strokeLinecap="round"/>
                  <line transform="translate(0, 16)"x1={2} x2={18}  strokeWidth={4} stroke="#ddd" strokeLinecap="round"/>
                </g>
              </svg>
            </div>
            {showSettings &&
            <div className="select-group">
              <Select
                onChange={handleFachrichtungChange}
                defaultValue={{value: fachrichtung, label: fachrichtung}}
                options={Array.from(new Set((data as DataEntry[]).
                  map(d=>d.Fachrichtung))).map(d=>({value:d, label:d}))}
              />
              <Select
                onChange={handleSchoolChange}
                defaultValue={selectedAccessors.map((d:AccessorItem) =>({value: d, label: d.legendLabel}))}
                options={availableAccessors.map((d:AccessorItem) =>({value: d, label: d.legendLabel}))}
                isMulti
              />
              <button onClick={handleStackedChange}>{isStacked? "Balken nicht stapeln" : "Balken stapeln"}</button>
              <button onClick={handleShowAsPercentageChange}>{showAsPercentage? "als absolute Zahlen angeben" : "als Marktanteile in % angeben"}</button>
              <button onClick={()=>setShowValues(!showValues)}>{showValues? "Zahlen verstecken" : "Zahlen anzeigen"}</button>
            </div>
            }
          </div>
          <div className="title">Studierende an den Fachhochschulen</div>
          <div className="subtitle">{fachrichtung==="alle"? "Alle technischen Fachrichtungen kumuliert":`Fachrichtung ${fachrichtung}`}</div>
          <Legend items={selectedAccessors}></Legend>
          <BarPlot
            plotDimensions={plotDimensions}
            isStacked={isStacked}
            data={(data as DataEntry[]).filter(d=>d.Fachrichtung === fachrichtung)}
            xAccessor={(d:DataEntry): Date => {
              const date = dateParser(d.Jahr.slice(0, 4))
              if(date){ return date }
              else{ throw "could not convert date" }
            }}
            yAccessors={selectedAccessors.map(item => item.accessor)}
            yAxisLabel={showAsPercentage? "Marktanteil (%)" : "Studierende"}
            xAxisLabel="Jahr"
            legend={selectedAccessors.map((item, index) => Object.assign(
              item,
              {
                color: colors[index%colors.length],
                pattern: patterns[index%patterns.length]
              }
            ))}
            barGroupSpacing={25}
            fontSettings={{xLabelFontSize: 30, yLabelFontSize: 30}}
            showValues={showValues}
          />
          <div style={{width: "vw"}}>
            <a style={{ marginTop: "20px", color: "#1cb2f5"}} href="https://www.bfs.admin.ch/bfs/de/home/statistiken/kataloge-datenbanken/daten.assetdetail.16324913.html">Quelle: https://www.bfs.admin.ch/bfs/de/home/statistiken/kataloge-datenbanken/daten.assetdetail.16324913.html</a>
          </div>
        </>
      }
    </div>
  );
}
//data={Array.from(new Set((data as DataEntry[]).map(d=>d.Jahr)))
//  .map(year => (data as DataEntry[])
//    .filter(d=>d.Jahr===year)
//    .reduce((acc, curr) => Object.assign(acc, Object.fromEntries(Object.keys(curr).slice(3, -1).map(key=>[key, (curr[key] as number) + (acc[key] as number)]))), Object.assign({}, {Jahr: year, Fachrichtung: "alle", Geschlecht: 'Mann+Frau', 
//      "BFH": 0,
//      "HES-SO": 0,
//      "FHNW": 0,
//      "FHZ": 0,
//      "SUPSI": 0,
//      "FHO": 0,
//      "OST": 0,
//      "ZHAW": 0,
//      "totalNumberOfStudents": 0,
//    }) as DataEntry)
//  ).map(d=>Object.assign(d, {totalNumberOfStudents: Object.keys(d).slice(3, -1).reduce((acc, curr)=>acc+(d[curr] as number), 0)}))
//}

export default App;
