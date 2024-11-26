// Element Import
import Navbar from '../elements/navbar';
import BasinCurrent from '../elements/basinCurrent';
import BasinGraphs from '../elements/basinGraphs';
import BasinChart from '../elements/basinChart';
import Table from '../elements/table';

// Fetch Strings
const TABLEFETCHSTRING = 'http://localhost:5050/dirty-devil/last-14-days';
const CHARTFETCHSTRING = 'http://localhost:5050/dirty-devil/last-365-days';
const HISTORICALFETCHSTRING = 'http://localhost:5050/dirty-devil/historical';

const DirtyDevil = () => {
    return (
        <div>
            <Navbar />
            <div className='m-4 grid grid-cols-1 gap-4 lg:grid-cols-2 md:mx-2 md:px-2'>
                <BasinCurrent 
                    fetchString={TABLEFETCHSTRING}
                    name='Dirty Devil Basin'
                />
                <BasinGraphs
                    fetchString={HISTORICALFETCHSTRING}
                />
            </div>
            <BasinChart 
                fetchCurrentString={CHARTFETCHSTRING}
                fetchHistoricalString={CHARTFETCHSTRING}
                name='Dirty Devil Basin'
            />
            <Table 
                fetchString={TABLEFETCHSTRING}
                type='basin'
            />
        </div>
    );
};

export default DirtyDevil;