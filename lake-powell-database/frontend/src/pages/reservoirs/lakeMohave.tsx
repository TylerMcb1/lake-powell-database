import React from 'react';

// Element Import
import Navbar from '../elements/navbar';
import LakeCurrent from '../elements/lakeCurrent';
import Weather from '../elements/weather';
import LakeChart from '../elements/lakeChart';
import Table from '../elements/table';

// Fetch Strings
const CHARTFETCHSTRING = import.meta.env.VITE_BACKEND_URL + '/mohave/last-365-days';
const TABLEFETCHSTRING = import.meta.env.VITE_BACKEND_URL + '/mohave/last-14-days';
const WEATHERSTRING = import.meta.env.VITE_BACKEND_URL + '/mohave/weather';
const SUNRISESUNSETSTRING = import.meta.env.VITE_BACKEND_URL + '/mohave/sunrise-sunset';
const ALERTSTRING = import.meta.env.VITE_BACKEND_URL + '/mohave/alerts';

const LakeMohave: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className='m-4 grid grid-cols-1 gap-4 lg:grid-cols-2 md:mx-2 md:px-2'>
                <LakeCurrent 
                    fetchString={TABLEFETCHSTRING}
                    name='Lake Mohave'
                />
                <Weather
                    fetchWeatherString={WEATHERSTRING}
                    fetchSSString={SUNRISESUNSETSTRING}
                    fetchAlertsString={ALERTSTRING}
                />
            </div>
            <LakeChart
                fetchString={CHARTFETCHSTRING}
                name='Lake Mohave'
            />
            <Table 
                fetchString={TABLEFETCHSTRING}
                type='reservoir'
            />
        </div>
    );
};

export default LakeMohave;