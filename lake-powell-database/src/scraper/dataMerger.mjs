import axios from 'axios';

const lakeMap = {
    'Lake Mead': ["1930", "1874", "1721", "1776"],
    'Lake Mohave': ["2100", "2096", "2086"],
    'Lake Havasu': ["2101", "2097", "2087"]
};

const APITIMEOUT = 5000;

const combineLakeData = (elevations, outflows, storage) => {
    // const inflowMap = new Map(inflows.map(inflow => [inflow.t, inflow]));
    const outflowMap = new Map(outflows.Data.map(outflow => [outflow.t, outflow]));
    const storageMap = new Map(storage.Data.map(storage => [storage.t, storage]));
  
    // Combine entries by matching dates
    const mergedData = elevations.Data.map(elevation => {
        const outflow = outflowMap.get(elevation.t);
        const storage = storageMap.get(elevation.t);

        if (outflow && storage) {
            return {
                Date: elevation.t,
                'Elevation (feet)': Number(elevation.v),
                'Storage (af)': Number(storage.v),
                'Total Release (cfs)':Number(outflow.v),
            };
        }

        return null;
    }).filter(entry => entry !== null);
  
    return mergedData;
};

async function obtainLakeData (reservoirName, cutoff, endpoint) {
    try {
        const response = await axios.get('https://www.usbr.gov/lc/region/g4000/riverops/webreports/accumweb.json', {
            headers: { 'User-Agent': 'ColoradoRiverData/1.0 (ColoradoRiverData@gmail.com)' },
            timeout: APITIMEOUT,
        });

        const lakeData = await response.data.Series;

        // Obtain lake data in Series list using SDI values
        const elevations = lakeData.find(data => data.SDI === lakeMap[reservoirName][0]);
        const outflows = lakeData.find(data => data.SDI === lakeMap[reservoirName][1]);
        const storage = lakeData.find(data => data.SDI === lakeMap[reservoirName][2]);

        if (!elevations || !outflows || !storage) {
            throw new Error(`Lake data for ${reservoirName} is missing.`);
        }

        // Return merged JSON data
        const mergedData = combineLakeData(elevations, outflows, storage);

        // Filter data to only include entries before cutoff date
        const cutoffDate = new Date(cutoff);
        const filteredData = mergedData.filter(entry => new Date(entry.date) > cutoffDate);
        
        // Post all data
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        for (let i = 0; i < filteredData.length; i++) {
            await axios.post(endpoint, filteredData[i])
                .then(response => {
                    console.log('POST request success: ', response.data);
                })
                .catch(error => {
                    console.error('Error making POST request: ', error.response?.data || error.message);
                });

            // Sleep for 1 second before the next request
            if (i < filteredData.length - 1) {
                await sleep(1000);
            }
        }

        return filteredData;
    } catch (error) {
        console.error('Error obtaining JSON data: ', error.message);
    }
};

obtainLakeData('Lake Mead', '2024-11-17', 'http://localhost:5050/mead/new-reading')
    // .then(data => {
    //     console.log('Merged Data:', data);
    // }).catch(err => {
    //     console.error('Failed to obtain lake data:', err);
    // });