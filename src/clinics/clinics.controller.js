const path = require("path");
const dentals = require(path.resolve("src/data/dental-data"));
const vets = require(path.resolve("src/data/vet-data"));
const states = require(path.resolve("src/data/states-data"));

function renameKeys(obj, newKeys) {
  const keyValues = Object.keys(obj).map(key => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
}

function cleanData(req, res, next) {
  let renamedClinicKeys = []
  dentals.forEach((den)=>{
    states.forEach((state) =>{
      const [key, value] = Object.entries(state)[0]
      if(den["stateName"] === key){
        den.stateName = value
      }
    })
    const newKeys = { name: "clinicName", stateName: "state"}; 
    renamedClinicKeys.push(renameKeys(den, newKeys))
  })
    

  vets.forEach((vet)=>{
    const newKeys = { stateCode: "state", opening: "availability"};
    renamedClinicKeys.push(renameKeys(vet, newKeys));
  })
  res.locals.clinics = renamedClinicKeys
  return next()
}

function searchName(req, res, next){
  let { name } = req.query;
  if(!name) return next()
  let clinics = res.locals.clinics
  res.locals.clinics = clinics.filter((clinic)=>clinic["clinicName"].includes(name))

  return next()
}

function filterByState(req, res, next){
  let searchedState = req.query.state;
  if(!searchedState) return next()
  states.forEach((state) =>{
    const [key, value] = Object.entries(state)[0]
    if(searchedState == key || searchedState == value){
      res.locals.clinics = res.locals.clinics.filter((clinic)=>clinic["state"] === key || clinic["state"] === value)
    }
  })
  // states.forEach((state) =>{
  //   const [key, value] = Object.entries(state)[0]
  //   if(searchedState == value || searchedState == key){
  //     let vetRes = clinics.filter((clinic)=>clinic["stateCode"] === value)
  //     let dentalRes = clinics.filter((clinic)=>clinic["stateName"] === key)
  //     if(searchedState === key ){res.locals.clinics = [...dentalRes, ...vetRes]}
  //     if(searchedState === value){res.locals.clinics = [...vetRes, ...dentalRes]}
  //     return
  //   }
  // })
  return next()
}

function cleanTimeStr(time){
  const hr = Number(time.split(":")[0])
  const min = Number(time.split(":")[1])/60
  return hr + min
}

function hasOpenings(req, res, next) {
  let {from, to} = req.query;
  if(!req.query.from || !req.query.to){
    return res.json({ data: res.locals.clinics})
  }
  from = cleanTimeStr(from)
  to = cleanTimeStr(to)
  
  const clinics = res.locals.clinics
  const filtered = []
  clinics.forEach((clinic)=>{
    let clinicFrom = cleanTimeStr(clinic["availability"]["from"])
    let clinicTo = cleanTimeStr(clinic["availability"]["to"])
    if(from >= clinicFrom && from < clinicTo && to > clinicFrom){
      filtered.push(clinic)
    }
  })

  res.json({ data: filtered})
}

module.exports = {
  read: [cleanData, searchName, filterByState, hasOpenings],
};

