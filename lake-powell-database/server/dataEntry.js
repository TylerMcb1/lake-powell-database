import axios from 'axios';

const url = 'http://localhost:5050/new-reading';
const exampleData = {
    Date: '07-Sep-2024',
    "Elevation (feet)": 3580.34,
    "Storage (af)": 9321418,
    "Inflow** (cfs)": 4755,
    "Total Release (cfs)": 9371,
};

const dataEntry = async (data) => {
    await axios.post(url, data)
        .then(response => {
            console.log('POST request success: ', response.data);
        })
        .catch(error => {
            console.error('Error making POST request: ', error);
        });
};

// const convertData = () => {} // Method to convert scraped data into record object

dataEntry(exampleData);

// const intervalId = setInterval(dataEntry, 10000);