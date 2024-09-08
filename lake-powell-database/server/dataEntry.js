import axios from 'axios';

const url = 'http://localhost:5050/new-reading';
const exampleData = {
    Date: new Date(new Date('06-Sep-2024').setUTCHours(0)),
    "Elevation (feet)": 3580.46,
    "Storage (af)": 9331029,
    "Inflow** (cfs)": 4327,
    "Total Release (cfs)": 9819,
};

const dataEntry = async (data) => {
    await axios.post(url, data)
        .then(response => {
            console.log('POST request success: ', response.data);
        })
        .catch(error => {
            console.error('Error making POST request: ', error.message);
        });
};

dataEntry(exampleData);

// const intervalId = setInterval(dataEntry, 10000);