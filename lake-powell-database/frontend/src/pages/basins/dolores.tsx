import React from 'react';

// Element Import
import Navbar from '../elements/navbar';
import BasinCurrent from '../elements/basinCurrent';
import BasinGraphs from '../elements/basinGraphs';
import BasinChart from '../elements/basinChart';
import Table from '../elements/table';

// Fetch Strings
const TABLEFETCHSTRING = import.meta.env.VITE_BACKEND_URL + '/dolores/last-14-days';
const CHARTFETCHSTRING = import.meta.env.VITE_BACKEND_URL + '/dolores/last-365-days';
const HISTORICALFETCHSTRING = import.meta.env.VITE_BACKEND_URL + '/dolores/historical';

const Dolores: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className='m-4 grid grid-cols-1 gap-4 lg:grid-cols-2 md:mx-2 md:px-2'>
                <BasinCurrent 
                    fetchString={TABLEFETCHSTRING}
                    name='Upper Dolores Basin'
                />
                <BasinGraphs
                    fetchString={HISTORICALFETCHSTRING}
                />
            </div>
            <BasinChart 
                fetchCurrentString={CHARTFETCHSTRING}
                fetchHistoricalString={CHARTFETCHSTRING}
                name='Upper Dolores Basin'
            />
            <Table 
                fetchString={TABLEFETCHSTRING}
                type='basin'
            />
        </div>
    );
};

export default Dolores;