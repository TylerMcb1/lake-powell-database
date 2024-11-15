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

interface BasinReading {
    _id: string;
    Date: string;
    'Snow Water Equivalent': number;
    'Snow Depth': number;
    'Precipitation Accumulation': number;
    'Precipitation Increment': number;
    'Snow Water % of Median': number;
    'Precipitation % of Median': number;
};

interface TableField {
    key: string;
    value: string;
};

const FieldOptions: TableField[] = [
    { key: 'Snow Water Equivalent', value: 'Snow Water Equivalent' },
    { key: 'Snow Depth', value: 'Snow Depth' },
    { key: 'Precipitation Accumulation', value: 'Precipitation Accumulation' },
    { key: 'Daily Precipitation', value: 'Precipitation Increment'},

];

interface BasinChartObject {
    fetchCurrentString: string;
    fetchHistoricalString: string;
    name: string;
};

const Years: number[] = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
const ExportOptions: string[] = ['PDF', 'JPEG', 'PNG', 'BNF'];
const DateRange: number[] = [14, 365];

const BasinChart: React.FC<BasinChartObject> = ({ fetchCurrentString, fetchHistoricalString, name }) => {
    // Graph/Export Options
    const [selectedField, setSelectedField] = useState<string>('Snow Water Equivalent');
    const [selectedDateRange, setSelectedDateRange] = useState<number>(14);
    const [selectedOverlay, setSelectedOverlay] = useState<number>(0);
    const [selectedExport, setSelectedExport] = useState<string>('PDF');
    const [historicalStartDate, setHistoricalStartDate] = useState<string>('');
    const [historicalEndDate, setHistoricalEndDate] = useState<string>('');
    const [showMean, setShowMean] = useState<boolean>(false);
    const [mean, setMean] = useState<number>(0);
    const [showMedian, setShowMedian] = useState<boolean>(false);
    const [median, setMedian] = useState<number>(0);

    // Selected Time and Options Tabs
    const [selectedTimeTab, setSelectedTimeTab] = useState<string>('current');
    const [selectedOptionsTab, setSelectedOptionsTab] = useState<string>('options');

    // Toggle historical/current graph display
    const [displayCurrent, setDisplayCurrent] = useState<boolean>(true);

    // Readings and Chart Data
    const [readings, setReadings] = useState<BasinReading[]>([]);
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

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axios.get(fetchCurrentString)
                console.log(response.data);
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
                        data: setData(selectedField as keyof BasinReading),
                    },
                ],
                options: {}
            });
        };

        updateData();

    }, [selectedField, selectedDateRange, readings]);

    const handleHistoricalSubmit = () => {
        setDisplayCurrent(false);
        fetchHistorical();
    };

    const fetchHistorical = async () => {
        try {
            const response = await axios.get(fetchHistoricalString, {
                params: {
                    startDate: historicalStartDate,
                    endDate: historicalEndDate
                }
            });
            setReadings(response.data);
        } catch (e) {
            console.error('Unsucessful retrieval of database');
            throw new Error(`Fetch Error: ${e}`)
        }
    };

    const setData = (field: keyof BasinReading): number[] => {
        return readings
            .filter(reading => {
                const currDate = new Date(reading['Date']);
                const referenceDate = new Date(readings[0]['Date']);
                referenceDate.setDate(referenceDate.getDate() - selectedDateRange);
                return currDate >= referenceDate;
            })
            .map(reading => typeof reading[field] === 'number' ? reading[field] : 0)
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

    const handleOverlayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOverlay(Number(event.target.value));
    };

    const handleExportChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedExport(event.target.value);
    };

    const handleHistoricalStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHistoricalStartDate(event.target.value);
    };

    const handleHistoricalEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHistoricalEndDate(event.target.value);
    };

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
                    <div className='flex w-full'>
                        <button 
                            className={`w-1/2 rounded-t-lg py-1 border-dark_gray 
                            ${selectedTimeTab === 'current' ? 'border-t border-r' : 'border-b'}`}
                            onClick={() => setSelectedTimeTab('current')}
                        >
                            Current
                        </button>
                        <button 
                            className={`w-1/2 rounded-t-lg py-1 border-dark_gray 
                            ${selectedTimeTab === 'historical' ? 'border-t border-l' : 'border-b'}`}
                            onClick={() => setSelectedTimeTab('historical')}
                        >
                            Historical
                        </button>
                    </div>
                    {selectedTimeTab === 'current' ? (
                        <div className='w-full flex flex-col items-center p-4'>
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
                            <form id='historical' onSubmit={handleHistoricalSubmit}>
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
                            </form>
                        </div>
                    )}
                </div>
                <div className='bg-background rounded-lg shadow-xl flex flex-col items-center flex-grow'>
                    <div className='flex w-full'>
                        <button 
                            className={`w-1/2 rounded-t-lg py-1 border-dark_gray 
                            ${selectedOptionsTab === 'options' ? 'border-t border-r' : 'border-b'}`}
                            onClick={() => setSelectedOptionsTab('options')}
                        >
                            Options
                        </button>
                        <button 
                            className={`w-1/2 rounded-t-lg py-1 border-dark_gray 
                            ${selectedOptionsTab === 'export' ? 'border-t border-l' : 'border-b'}`}
                            onClick={() => setSelectedOptionsTab('export')}
                        >
                            Export
                        </button>
                    </div>
                    {selectedOptionsTab === 'options' ? (
                        <div className='w-full'>
                            <div className='flex w-full justify-center p-4'>
                                <div className='flex flex-col'>
                                    <div className='flex items-center space-x-1'>
                                        <label>Mean</label>
                                        <input 
                                            type='checkbox' 
                                            id='mean' 
                                            className='rounded-md shadow-lg'
                                            onChange={handleMeanChange}
                                        />
                                    </div>
                                    <div className='flex items-center space-x-1'>
                                        <label>Median</label>
                                        <input 
                                            type='checkbox' 
                                            id='median' 
                                            className='rounded-md shadow-lg'
                                            onChange={handleMedianChange}
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col'>
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
                                    <div className='flex items-center space-x-1'>
                                        <label>Historical Overlay:</label>
                                        <select value={selectedOverlay} onChange={handleOverlayChange}  className='rounded-md shadow-lg mx-1 px-1'>
                                            {Years.map((year, index) => (
                                            <option key={index} value={year}>
                                                {year}
                                            </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex justify-end'>
                                <button className='bg-primary text-black rounded-lg shadow-lg px-4 mb-2 mr-2'>Go</button>
                            </div>
                        </div>
                    ) : (
                        <div className='w-full'>
                             <div className='flex justify-center items-center space-x-1'>
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

export default BasinChart;