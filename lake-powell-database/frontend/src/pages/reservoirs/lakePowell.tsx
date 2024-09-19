import React, { useState, useEffect } from 'react';
import Navbar from '../elements/navbar';
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
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
Legend
);

interface Reading {
    _id: string;
    Date: string;
    "Elevation (feet)": number;
    "Storage (af)": number;
    "Evaporation (af)": number;
    "Inflow** (cfs)": number;
    "Total Release (cfs)": number;
};

interface TableField {
    key: string;
    value: string;
};

type ChartData = {
    labels: string[];
    datasets: {
        label: string;
        backgroundColor: string;
        borderColor: string;
        data: (number | null)[];
    }[];
};

const FieldOptions: TableField[] = [
    { key: 'Water Level', value: 'Elevation (feet)' },
    { key: 'Inflows', value: 'Inflow** (cfs)' },
    { key: 'Outflows', value: 'Total Release (cfs)' },
    { key: 'Storage', value: 'Storage (af)' }
];

const Years: number[] = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]

const DateRange: number[] = [14, 365];

const LakePowell: React.FC = () => {
    const [selectedField, setSelectedField] = useState<string>('Elevation (feet)');
    const [selectedDateRange, setSelectedDateRange] = useState<number>(14);
    const [selectedOverlay, setSelectedOverlay] = useState<number>(0);

    const [selectedTimeTab, setSelectedTimeTab] = useState('current');
    const [selectedOptionsTab, setSelectedOptionsTab] = useState('options');

    const [readings, setReadings] = useState<Reading[]>([]);
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: [
            {
                label: '',
                backgroundColor: '',
                borderColor: '',
                data: [],
            },
        ],
    });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch('http://localhost:5050/powell/last-365-days')
                if (!response) {
                    console.error('Unsucessful retrieval of database');
                }
                const data = await response.json();
                setReadings(data)
            } catch (e) {
                console.error('Unsucessful retrieval of database');
                throw new Error(`Fetch Error: ${e}`)
            }
        };

        fetchChartData();
    }, []);

    useEffect(() => {
        const updateData = () => {
            setChartData({
            labels: setDates(),
            datasets: [
                {
                    label: `Lake Powell ${selectedField}`,
                    backgroundColor: '#1B98DF80',
                    borderColor: '#1B98DF',
                    data: setData(selectedField as keyof Reading),
                },
            ],
            });
        };

        updateData();

    }, [selectedField, selectedDateRange, readings]);

    const setData = (field: keyof Reading): number[] => {
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

    const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedField(event.target.value);
    };

    const handleDateChange = (event: Event, value: number | number[]) => {
        setSelectedDateRange(Array.isArray(value) ? value[0] : value);
    };

    const handleOverlayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOverlay(Number(event.target.value));
    };

    return (
        <div>
            <Navbar />
            <div className='bg-background rounded-lg shadow-xl m-4 flex flex-col items-center'>
                <div className='w-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-subtitle rounded-t-lg h-12'>
                    <label>Lake Powell {selectedField}</label>
                </div>
                <div className='w-full max-w-4xl p-5 relative'>
                    <div className='w-full h-full'>
                        <Line data={chartData} options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    align: 'center',
                                },
                            },
                        }}
                        className='w-full h-auto'
                    />
                    </div>
                </div>
            </div>
            <div className='flex w-full text-dark_gray text-body'>
                <div className='bg-background rounded-lg shadow-xl ml-4 mr-2 flex flex-col items-center flex-grow'>
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
                            <div className='w-full flex justify-center space-x-4 p-4'>
                                <div className='flex flex-col'>
                                    <label htmlFor='start-date'>Start Date</label>
                                    <input type='date' id='start-date' className='rounded-md border shadow-lg px-1' />
                                </div>
                                <div className='flex flex-col'>
                                    <label htmlFor='end-date'>End Date</label>
                                    <input type='date' id='end-date' className='rounded-md border shadow-lg px-1' />
                                </div>
                            </div>
                            <div className='w-full flex justify-end'>
                                <button className='bg-primary text-black rounded-lg shadow-lg px-4 mb-2 mr-2'>Go</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className='bg-background rounded-lg shadow-xl ml-2 mr-4 flex flex-col items-center flex-grow'>
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
                    <div className='flex w-full justify-center'>
                        <div className='flex flex-col'>
                            <div className='flex items-center space-x-1'>
                                <label>Max</label>
                                <input type='checkbox' id='max' className='rounded-md shadow-lg' />
                            </div>
                            <div className='flex items-center space-x-1'>
                                <label>Median</label>
                                <input type='checkbox' id='max' className='rounded-md shadow-lg' />
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
            </div>
        </div>
    );
};

export default LakePowell;