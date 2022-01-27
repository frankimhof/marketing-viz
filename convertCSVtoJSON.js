const fs = require('fs');
const csv = require('csv-parser');
const data = [];

//read csv data into javascript object
fs.createReadStream('studierende.csv')
  .pipe(csv({separator: ';'}))
  .on('data', (csvData) => data.push(csvData))
  .on('end', async () => {
    try {
      const preparedData = await prepareData(data)
      fs.writeFileSync('studierende.json', JSON.stringify(preparedData, null, 4))
    }
    catch(error){
      console.log("ALERT: Data could not be converted.\n===> "+error)
    }
  })
  //.on('end', () => fs.writeFileSync('studierende.json', JSON.stringify(csvData, null, 4)))

const elementWiseAddKeys = (objA, objB, keys) => {
  return Object.assign(objA, 
    Object.fromEntries(
      keys.map(key => [key, objA[key] + objB[key]])//add the values
    ))
}

const checkObjectEqualityByRangeOfEntries = (a, b, rangeStart, rangeEnd) => {
  //check if first two keys have same value
  return Object.entries(a).slice(rangeStart, rangeEnd).toString() === Object.entries(b).slice(rangeStart,rangeEnd).toString();
}
// csv gives us numbers as Strings, therefore we need to parse the values that hold numbers
const parseStringValues = (d) => {
  const changedEntries = Object
    .entries(d)
    .slice(3)//not all entries need to be changed)
    .map(entry => [entry[0], parseInt(entry[1])])
  return Object.assign(d, Object.fromEntries(changedEntries))
}

const mergeGenderReducer = (acc, curr, index, data) => {
  if(curr.Geschlecht === "Mann"){
    const correspondingFemaleData = data.find(
      d => checkObjectEqualityByRangeOfEntries(d, curr, 0, 2) && //first two entries (Jahr, Fachbereich) should be equal
      d.Geschlecht === "Frau"
    )
    if(correspondingFemaleData === undefined){
      throw `Female Data for ${Object.values(curr).slice(0, 2)} is missing`
    }
    return [
      ...acc, 
      elementWiseAddKeys(
        curr, 
        correspondingFemaleData,
        Object.keys(curr).slice(3) 
      )
    ]
  }
  else{
    return [...acc]
  }
}

const totalNumberOfStudents = (d) => {
  return Object.entries(d).slice(3).reduce((acc, curr) => acc+curr[1], 0)
}

const prepareData = (data) => new Promise((resolve, reject) => {
  const preparedData = data
    .map(d => parseStringValues(d))
    .reduce(mergeGenderReducer, [])//
    .map(d => Object.assign(d, {Geschlecht: "Mann+Frau"}))
    .map(d => Object.assign(d, {totalNumberOfStudents: totalNumberOfStudents(d)}))
  const studentsOfAllFachrichtungenAdded = Array.from(new Set(data.map(d=>d.Jahr)))
  .map(year => data
    .filter(d=>d.Jahr===year)
    .reduce((acc, curr) => Object.assign(acc, Object.fromEntries(Object.keys(curr).slice(3, -1).map(key=>[key, curr[key] + acc[key]]))), Object.assign({}, {Jahr: year, Fachrichtung: "alle", Geschlecht: 'Mann+Frau', 
      "BFH": 0,
      "HES-SO": 0,
      "FHNW": 0,
      "FHZ": 0,
      "SUPSI": 0,
      "FHO": 0,
      "OST": 0,
      "ZFH": 0,
      "totalNumberOfStudents": 0,
    }))
  ).map(d=>Object.assign(d, {totalNumberOfStudents: totalNumberOfStudents(d)}))
  resolve([...preparedData, ...studentsOfAllFachrichtungenAdded])
})

//fs.writeFileSync('malePlusFemaleData.json', JSON.stringify(malePlusFemaleData, null, 4))
