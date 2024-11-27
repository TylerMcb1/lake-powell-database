import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Slider from '@mui/material/Slider';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

type ChartData = {
    labels: string[];
    datasets: {
        label: string;
        backgroundColor: string;
        fill: boolean;
        borderColor: string;
        data: number[];
    }[];
    options: object;
};

interface Reading {
    _id: string;
    Date: string;
    'Elevation (feet)': number;
    'Storage (af)': number;
    'Evaporation (af)': number;
    'Inflow** (cfs)': number;
    'Total Release (cfs)': number;
};

interface TableField {
    key: string;
    value: string;
};

const FieldOptions: TableField[] = [
    { key: 'Water Level', value: 'Elevation (feet)' },
    { key: 'Inflows', value: 'Inflow** (cfs)' },
    { key: 'Outflows', value: 'Total Release (cfs)' },
    { key: 'Storage', value: 'Storage (af)' }
];

interface LakeChartObject {
    fetchString: string;
    name: string;
};

const ExportOptions: string[] = ['PDF', 'JPEG', 'PNG', 'BNF'];
const DateRange: number[] = [14, 365];

const LakeChart: React.FC<LakeChartObject> = ({ fetchString, name }) => {
    // Graph/Export Options
    const [selectedField, setSelectedField] = useState<string>('Elevation (feet)');
    const [selectedDateRange, setSelectedDateRange] = useState<number>(14);
    const [selectedExport, setSelectedExport] = useState<string>('PDF');
    const [showMean, setShowMean] = useState<boolean>(false);
    const [mean, setMean] = useState<number>(0);
    const [showMedian, setShowMedian] = useState<boolean>(false);
    const [median, setMedian] = useState<number>(0);

    // Selected Time and Options Tabs
    const [selectedTimeTab, setSelectedTimeTab] = useState<string>('current');
    const [selectedOptionsTab, setSelectedOptionsTab] = useState<string>('options');

    // Toggle historical/current graph display
    // const [historicalStartDate, setHistoricalStartDate] = useState<string>('');
    // const [historicalEndDate, setHistoricalEndDate] = useState<string>('');
    const [displayCurrent, setDisplayCurrent] = useState<boolean>(true);
    

    // Readings and Chart Data
    const [readings, setReadings] = useState<Reading[]>([]);
    const [chartData, setChartData] = useState<ChartData>({
        labels: [] as string[],
        datasets: [
            {
                label: '',
                backgroundColor: '',
                fill: false,
                borderColor: '',
                data: [] as number[],
            },
        ],
        options: {},
    });

    // Fetch Chart Data
    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axios.get(fetchString)
                setReadings(response.data)
            } catch (e) {
                console.error('Unsucessful retrieval of database');
                throw new Error(`Fetch Error: ${e}`)
            }
        };

        if (displayCurrent) {
            fetchChartData();
        }

    }, [displayCurrent]);

    // Update Chart data with date range or selected field
    useEffect(() => {
        const updateData = () => {
            const currentYear = new Date().getFullYear();
            setChartData({
                labels: setDates(),
                datasets: [
                    {
                        label: `${displayCurrent ? currentYear : 'Historical'} ${selectedField}`,
                        backgroundColor: '#1B98DF80',
                        fill: false,
                        borderColor: '#1B98DF',
                        data: setData(selectedField as keyof Reading),
                    },
                ],
                options: {}
            });
        };

        // Toggle Mean and Median off when chart updating
        setShowMean(false);
        setShowMedian(false);

        updateData();

    }, [selectedField, selectedDateRange, readings]);

    // Update mean and/or median
    useEffect(() => {
        const calculateMean = () => {
            const total = setData(selectedField as keyof Reading).reduce((sum, value) => sum + value, 0);
            setMean(total / (selectedDateRange + 1));
        };

        const calculateMedian = () => {
            const sorted = setData(selectedField as keyof Reading).sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            setMedian(sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]);
        };

        const renderMeanMedian = () => {
            const newDatasets = chartData.datasets.filter(dataset => 
                dataset.label !== 'Mean' && dataset.label !== 'Median'
            );
    
            if (showMean) {
                newDatasets.push({
                    label: 'Mean',
                    backgroundColor: '#EF614C80',
                    fill: false,
                    borderColor: '#EF614C',
                    data: Array(selectedDateRange + 1).fill(mean),
                });
            }
    
            if (showMedian) {
                newDatasets.push({
                    label: 'Median',
                    backgroundColor: '#0CCE7180',
                    fill: false,
                    borderColor: '#0CCE71',
                    data: Array(selectedDateRange + 1).fill(median),
                });
            }
    
            setChartData({
                ...chartData,
                datasets: newDatasets,
            });
        };

        calculateMean();
        calculateMedian();
        renderMeanMedian();

    }, [showMean, showMedian]);

    // const handleHistoricalSubmit = () => {
    //     setDisplayCurrent(false);
    //     fetchHistorical();
    // };

    // const fetchHistorical = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:5050/powell/historical', {
    //             params: {
    //                 startDate: historicalStartDate,
    //                 endDate: historicalEndDate
    //             }
    //         });
    //         setReadings(response.data);
    //     } catch (e) {
    //         console.error('Unsucessful retrieval of database');
    //         throw new Error(`Fetch Error: ${e}`)
    //     }
    // };

    const setData = (field: keyof Reading): number[] => {
        return readings
            .filter(reading => {
                const currDate = new Date(reading['Date']);
                const referenceDate = new Date(readings[0]['Date']);
                referenceDate.setDate(referenceDate.getDate() - selectedDateRange);
                return currDate >= referenceDate;
            })
            .map(reading => reading[field] as number || 0) // Type casted
            .reverse();
    };

    const setDates = (): string[] => {
        return readings
            .filter(reading => {
                const currDate = new Date(reading['Date']);
                const referenceDate = new Date(readings[0]['Date']);
                referenceDate.setDate(referenceDate.getDate() - selectedDateRange);
                return currDate >= referenceDate;
            })
            .map(reading => new Date(reading['Date']).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                timeZone: 'UTC'
            }))
            .reverse();
    };

    const handleMeanChange = () => {
        setShowMean(!showMean);
    };

    const handleMedianChange = () => {
        setShowMedian(!showMedian);
    };

    const handleDateChange = (event: Event, value: number | number[]) => {
        setSelectedDateRange(Array.isArray(value) ? value[0] : value);
    };

    const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedField(event.target.value);
    };

    const handleExportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedExport(event.target.value);
    };

    // const handleHistoricalStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setHistoricalStartDate(event.target.value);
    // };

    // const handleHistoricalEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setHistoricalEndDate(event.target.value);
    // };

    return (
        <div>
            <div className='bg-background rounded-lg shadow-xl m-4 flex flex-col items-center h-auto lg:h-[45em]'>
                <div className='w-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-subtitle rounded-t-lg h-8'>
                    <label>{name} {selectedField}</label>
                </div>
                <div className='w-full h-full flex items-center flex-col p-5 relative'>
                    <Line data={chartData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    align: 'center',
                                },
                            },
                        }}
                        className='w-full h-full'
                    />
                </div>
            </div>
            <div className='m-4 grid grid-cols-1 gap-4 lg:grid-cols-2 md:mx-2 md:px-2 text-dark_gray text-body'>
                <div className='bg-background rounded-lg shadow-xl flex flex-col items-center'>
                    <div className='bg-gray rounded-t-lg flex w-full'>
                        <button 
                            className={`w-1/2 rounded-t-lg py-1 border-dark_gray 
                            ${selectedTimeTab === 'current' ? 'bg-background border-t border-r' : 'border-b'}`}
                            onClick={() => setSelectedTimeTab('current')}
                        >
                            Current
                        </button>
                        <button 
                            className={`w-1/2 rounded-t-lg py-1 border-dark_gray
                            ${selectedTimeTab === 'historical' ? 'bg-background border-t border-l' : 'border-b'}`}
                            // onClick={() => setSelectedTimeTab('historical')}
                        >
                            Historical
                        </button>
                    </div>
                    {selectedTimeTab === 'current' ? (
                        <div className='w-full flex flex-col items-center p-4' /* Why does changing padding affect mean/median? (i.e. px-4 pt-2)*/> 
                            <label>{selectedDateRange} days</label>
                            <div className='w-full flex items-center space-x-4'>
                                <label>14</label>
                                <Slider
                                    defaultValue={DateRange[0]}
                                    min={DateRange[0]}
                                    max={DateRange[1]}
                                    onChange={handleDateChange}
                                />
                                <label>365</label>
                            </div>
                        </div>
                    ) : (
                        <div className='w-full'>
                            {/* <form id='historical' onSubmit={handleHistoricalSubmit}>
                                <div className='w-full flex justify-center space-x-4 p-4'>
                                    <div className='flex flex-col'>
                                        <label htmlFor='start-date'>Start Date</label>
                                        <input 
                                            type='date' 
                                            id='start-date' 
                                            className='rounded-md border shadow-lg px-1'
                                            onChange={handleHistoricalStartChange}
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor='end-date'>End Date</label>
                                        <input 
                                            type='date' 
                                            id='end-date' 
                                            className='rounded-md border shadow-lg px-1' 
                                            onChange={handleHistoricalEndChange}
                                        />
                                    </div>
                                </div>
                                <div className='w-full flex justify-end'>
                                    <button type='submit' className='bg-primary text-black rounded-lg shadow-lg px-4 mb-2 mr-2'>Go</button>
                                </div>
                            </form> */}
                        </div>
                    )}
                </div>
                <div className='bg-background rounded-lg shadow-xl flex flex-col items-center'>
                    <div className='bg-gray rounded-t-lg flex w-full'>
                        <button 
                            className={`w-1/2 rounded-t-lg py-1 border-dark_gray 
                            ${selectedOptionsTab === 'options' ? 'bg-background border-t border-r' : 'border-b'}`}
                            onClick={() => setSelectedOptionsTab('options')}
                        >
                            Options
                        </button>
                        <button 
                            className={`w-1/2 rounded-t-lg py-1 border-dark_gray bg-gray
                            ${selectedOptionsTab === 'export' ? 'bg-background border-t border-l' : 'border-b'}`}
                            // onClick={() => setSelectedOptionsTab('export')}
                        >
                            Export
                        </button>
                    </div>
                    {selectedOptionsTab === 'options' ? (
                        <div className='flex w-full h-full justify-center space-x-4 p-4'>
                            <div className='flex items-center space-x-1'>
                                <label>Mean</label>
                                <input 
                                    type='checkbox' 
                                    id='mean' 
                                    checked={showMean}
                                    className='rounded-md shadow-lg'
                                    onChange={handleMeanChange}
                                />
                            </div>
                            <div className='flex items-center space-x-1'>
                                <label>Median</label>
                                <input 
                                    type='checkbox' 
                                    id='median' 
                                    checked={showMedian}
                                    className='rounded-md shadow-lg'
                                    onChange={handleMedianChange}
                                />
                            </div>
                            <div className='flex items-center space-x-1'>
                                <label>Select a field:</label>
                                <select value={selectedField} onChange={handleFieldChange}  className='rounded-md shadow-lg mx-1 px-1'>
                                    {FieldOptions.map((option) => (
                                        <option key={option.key} value={option.value}>
                                            {option.key}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ) : (
                        <div className='w-full'>
                             <div className='w-full flex justify-center space-x-4'>
                                <label>Export As:</label>
                                <select value={selectedExport} onChange={handleExportChange}  className='rounded-md shadow-lg mx-1 px-1'>
                                    {ExportOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='w-full flex justify-end'>
                                <button className='bg-primary text-black rounded-lg shadow-lg px-4 mb-2 mr-2'>Go</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LakeChart;