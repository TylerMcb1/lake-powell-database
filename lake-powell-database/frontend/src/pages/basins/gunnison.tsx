// Element Import
import Navbar from '../elements/navbar';
import BasinCurrent from '../elements/basinCurrent';
import BasinGraphs from '../elements/basinGraphs';
import BasinChart from '../elements/basinChart';
import Table from '../elements/table';

// Fetch Strings
const TABLEFETCHSTRING = 'http://localhost:5050/gunnison/last-14-days';
const CHARTFETCHSTRING = 'http://localhost:5050/gunnison/last-365-days';
const HISTORICALFETCHSTRING = 'http://localhost:5050/gunnison/historical';

const Gunnison = () => {
    return (
        <div>
            <Navbar />
            <div className='m-4 grid grid-cols-1 gap-4 lg:grid-cols-2 md:mx-2 md:px-2'>
                <BasinCurrent 
                    fetchString={TABLEFETCHSTRING}
                    name='Gunnison Basin'
                />
                <BasinGraphs
                    fetchString={HISTORICALFETCHSTRING}
                />
            </div>
            <BasinChart 
                fetchCurrentString={CHARTFETCHSTRING}
                fetchHistoricalString={CHARTFETCHSTRING}
                name='Gunnison Basin'
            />
            <Table 
                fetchString={TABLEFETCHSTRING}
                type='basin'
            />
        </div>
    );
};

export default Gunnison;