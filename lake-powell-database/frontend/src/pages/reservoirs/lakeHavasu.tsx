import React from 'react';

// Element Import
import Navbar from '../elements/navbar';
import LakeCurrent from '../elements/lakeCurrent';
import Weather from '../elements/weather';
import LakeChart from '../elements/lakeChart';
import Table from '../elements/table';

// Fetch Strings
const CHARTFETCHSTRING = 'http://localhost:5050/havasu/last-365-days';
const TABLEFETCHSTRING = 'http://localhost:5050/havasu/last-14-days';
const WEATHERSTRING = 'http://localhost:5050/havasu/weather';
const SUNRISESUNSETSTRING = 'http://localhost:5050/havasu/sunrise-sunset';
const ALERTSTRING = 'http://localhost:5050/havasu/alerts';

const LakeHavasu: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className='m-4 grid grid-cols-1 gap-4 lg:grid-cols-2 md:mx-2 md:px-2'>
                <LakeCurrent 
                    fetchString={TABLEFETCHSTRING}
                    name='Lake Havasu'
                />
                <Weather
                    fetchWeatherString={WEATHERSTRING}
                    fetchSSString={SUNRISESUNSETSTRING}
                    fetchAlertsString={ALERTSTRING}
                />
            </div>
            <LakeChart
                fetchString={CHARTFETCHSTRING}
                name='Lake Havasu'
            />
            <Table 
                fetchString={TABLEFETCHSTRING}
                type='reservoir'
            />
        </div>
    );
};

export default LakeHavasu;