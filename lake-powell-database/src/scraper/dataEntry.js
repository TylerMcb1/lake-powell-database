import axios from 'axios';
import { scrapeData } from './scraper.js'

const data = await scrapeData();
const recordFields = [
    "Date",
    "Elevation (feet)",
    "Storage (af)",
    "Inflow** (cfs)",
    "Total Release (cfs)",
];

const dataEntry = async (data) => {
    // Convert data to record object
    const recordData = recordFields.reduce((acc, field, index) => {
        acc[field] = data[index];
        return acc;
    }, {});

    // Post record to API endpoint
    await axios.post('http://localhost:5050/new-reading', recordData)
        .then(response => {
            console.log('POST request success: ', response.data);
        })
        .catch(error => {
            console.error('Error making POST request: ', error);
        });
};

dataEntry(data);
// const intervalId = setInterval(dataEntry, 10000);