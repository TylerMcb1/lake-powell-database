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
};

interface BasinReading {
    _id: string; // Date
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

    const [currYearReadings, setCurrYearReadings] = useState<BasinReading[]>([]);
    const [prevYearReadings, setPrevYearReadings] = useState<BasinReading[]>([]);

    const [precipitationData, setPrecipitationData] = useState<GraphData>({
        labels: [] as string[],
        datasets: []
    });
    const [snowWaterData, setSnowWaterData] = useState<GraphData>({
        labels: [] as string[],
        datasets: []
    });

    useEffect(() => {
        const fetchHistoricalBasinData = async () => {
            try {
                const response = await axios.get(fetchString, {
                    params: {
                        startDate: new Date(`01-01-${prevYear}`),
                        endDate: new Date(`01-01-${currYear}`)
                    }
                });
                setPrevYearReadings(response.data);
            } catch (e) {
                console.error('Unsucessful retrieval of database');
                throw new Error(`Fetch Error: ${e}`)
            }
        };

        const fetchCurrentBasinData = async () => {
            try {
                const response = await axios.get(fetchString, {
                    params: {
                        startDate: new Date(`01-01-${currYear}`),
                        endDate: new Date()
                    }
                });
                setCurrYearReadings(response.data);
            } catch (e) {
                console.error('Unsucessful retrieval of database');
                throw new Error(`Fetch Error: ${e}`)
            }
        }

        fetchHistoricalBasinData();
        fetchCurrentBasinData();

    }, []);

    const setData = (key: keyof BasinReading) => {
        const maxPrevYearData: number = Math.max(
            ...prevYearReadings
                .map(reading => reading[key])
                .map(reading => reading as number || 0) // Type casted
        );
        const maxCurrYearData: number = Math.max(
            ...currYearReadings
                .map(reading => reading[key])
                .map(reading => reading as number || 0) // Type casted
        );

        return { maxPrevYearData, maxCurrYearData };
    };

    useEffect(() => {
        const updateGraphData = (key: keyof BasinReading): GraphData => {
            const { maxPrevYearData, maxCurrYearData } = setData(key);
            return{
                labels: [`Maximum ${key}`],
                datasets: [
                    {
                        label: `${prevYear}`,
                        data: [maxPrevYearData],
                        backgroundColor: '#1B98DF80',
                        borderColor: '#1B98DF',
                        borderWidth: 1,
                    },
                    {
                        label: `${currYear}`,
                        data: [maxCurrYearData],
                        backgroundColor: '#0F537980',
                        borderColor: '#0F5379',
                        borderWidth: 1,
                    },
                ]
            };
        };

        setPrecipitationData(updateGraphData('Precipitation Accumulation'));
        setSnowWaterData(updateGraphData('Snow Water Equivalent'));

    }, [currYearReadings, prevYearReadings]);

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