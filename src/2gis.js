const key = 'rublxb0021'
const axios = require('axios');

export const getGeoFromAddress = async (q) => {
    let address = []
    let res = await axios.get(`https://catalog.api.2gis.com/3.0/suggests?q=${q}&key=${key}&fields=items.point&region_id=112`)
    if(res.data.result&&res.data.result.items) {
        for(let i=0; i<res.data.result.items.length; i++) {
            if(res.data.result.items[i].full_name&&res.data.result.items[i].point)
                address = [{address: res.data.result.items[i].full_name, geo: [res.data.result.items[i].point.lat, res.data.result.items[i].point.lon]}, ...address]
        }
    }
    return address
}

export const getAddressFromGeo = async (lat, lon) => {
    let address
    let res = await axios.get(`https://catalog.api.2gis.com/3.0/items/geocode?lat=${lat}&lon=${lon}&key=${key}`)
    if(res.data.result&&res.data.result.items&&res.data.result.items[0]) {
        address = res.data.result.items[0].full_name
    }
    return address
}