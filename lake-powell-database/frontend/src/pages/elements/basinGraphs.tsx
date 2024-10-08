import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

type GraphData = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
    options: object;
};

interface BasinReading {
    _id: string;
    Date: string;
    "Snow Water Equivalent": number;
    "Snow Depth": number;
    "Precipitation Accumulation": number;
    "Precipitation Increment": number;
    "Snow Water % of Median": number;
    "Precipitation % of Median": number;
};

interface BasinGraphObject {
    fetchString: string;
};

const BasinGraph: React.FC<BasinGraphObject> = ({ fetchString }) => {
    const currYear = new Date().getFullYear();
    const prevYear = new Date().getFullYear() - 1;

    const [readings, setReadings] = useState<BasinReading[]>([]);
    const [precipitationData, setPrecipitationData] = useState<GraphData>({
        labels: [] as string[],
        datasets: [
            {
                label: '',
                data: [],
                backgroundColor: '',
                borderColor: '',
                borderWidth: 0,
            },
        ],
        options: {}
    });
    const [snowWaterData, setSnowWaterData] = useState<GraphData>({
        labels: [] as string[],
        datasets: [
            {
                label: '',
                data: [],
                backgroundColor: '',
                borderColor: '',
                borderWidth: 0,
            },
        ],
        options: {}
    });

    useEffect(() => {
        const fetchBasinData = async () => {
            try {
                const response = await axios.get(fetchString);
                setReadings(response.data);
            } catch (e) {
                console.error('Unsucessful retrieval of database');
                throw new Error(`Fetch Error: ${e}`)
            }
        };

        fetchBasinData();

    }, []);

    useEffect(() => {
        const updatePrecipitationData = () => {
            setPrecipitationData({
                labels: [`${prevYear}`, `${currYear}`],
                datasets: [
                    {
                        label: `${prevYear}`,
                        data: setData('Precipitation Accumulation' as keyof BasinReading),  // Data for the previous year
                        backgroundColor: '#1B98DF80',
                        borderColor: '#1B98DF',
                        borderWidth: 1,
                    },
                    {
                        label: `${currYear}`,
                        data: setData('Precipitation Accumulation' as keyof BasinReading),  // Data for the current year
                        backgroundColor: '#0F537980',
                        borderColor: '#0F5379',
                        borderWidth: 1,
                    },
                ],
                options: {
                    scales: {
                        x: { grid: { display: false } },
                    }
                }
            });
        };

        const updateSnowWaterData = () => {
            setSnowWaterData({
                labels: [`${prevYear}`, `${currYear}`],
                datasets: [
                    {
                        label: `${prevYear}`,
                        data: setData('Snow Water Equivalent' as keyof BasinReading),  // Data for the previous year
                        backgroundColor: '#1B98DF80',
                        borderColor: '#1B98DF',
                        borderWidth: 1,
                    },
                    {
                        label: `${currYear}`,
                        data: setData('Snow Water Equivalent' as keyof BasinReading),  // Data for the current year
                        backgroundColor: '#0F537980',
                        borderColor: '#0F5379',
                        borderWidth: 1,
                    },
                ],
                options: {
                    scales: {
                        x: { grid: { display: false } },
                    }
                }
            });
        };

        updatePrecipitationData();
        updateSnowWaterData();

    }, [readings]);

    const setData = (field: keyof BasinReading): number[] => {
        return readings
            .map(reading => typeof reading[field] === 'number' ? reading[field] : 0)
            .reverse();
    };

    return (
        <div className='text-dark_gray text-subtitle rounded-lg'>
            <div className='flex flex-col grid grid-cols-2 gap-4 lg:grid-cols-2'>
                <div className='bg-background text-dark_gray text-subtitle rounded-lg shadow-xl'>
                    <label>
                        Precipitation {prevYear} vs {currYear}
                    </label>
                    <div className='w-full h-full flex items-center flex-col p-5 relative'>
                        <Bar 
                            data={precipitationData} 
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
                        />
                    </div>
                </div>
                <div className='bg-background text-dark_gray text-subtitle rounded-lg shadow-xl'>
                    <label>
                        Snow Water {prevYear} vs {currYear}
                    </label>
                    <div className='w-full h-full flex items-center flex-col p-5 relative'>
                        <Bar 
                            data={snowWaterData} 
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
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasinGraph;