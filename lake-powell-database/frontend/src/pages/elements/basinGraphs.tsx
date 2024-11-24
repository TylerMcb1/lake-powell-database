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

    const [readings, setReadings] = useState<BasinReading[]>([]);
    const [precipitationData, setPrecipitationData] = useState<GraphData>({
        labels: [] as string[],
        datasets: []
    });
    const [snowWaterData, setSnowWaterData] = useState<GraphData>({
        labels: [] as string[],
        datasets: []
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

    const setData = (key: keyof BasinReading) => {
        const maxPrevYearData: number = Math.max(
            ...readings
                .filter(reading => new Date(reading._id)
                .getFullYear() === prevYear)
                .map(reading => reading[key])
                .map(value => (typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value))
                .filter(value => typeof value === "number" && value !== null)
        );
        const maxCurrYearData: number = Math.max(
            ...readings
                .filter(reading => new Date(reading._id)
                .getFullYear() === currYear)
                .map(reading => reading[key])
                .map(value => (typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value))
                .filter(value => typeof value === "number" && value !== null)
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

    }, [readings]);

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