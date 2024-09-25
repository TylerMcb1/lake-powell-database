import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Reading {
    _id: string;
    Date: string;
    "Elevation (feet)": number;
    "Storage (af)": number;
    "Evaporation (af)": number;
    "Inflow** (cfs)": number;
    "Total Release (cfs)": number;
}

interface TableField {
    key: string;
    value: string;
}

const TableFields: TableField[] = [
    {key: 'Date', value: 'Date'},
    {key: 'Water Level', value: 'Elevation (feet)'},
    {key: 'Storage', value: 'Storage (af)'},
    {key: 'Inflow', value: 'Inflow** (cfs)'},
    {key: 'Outflow', value: 'Total Release (cfs)'}
];

const Table: React.FC = () => {
    // Readings and Chart Data
    const [readings, setReadings] = useState<Reading[]>([]);
    const [tableReadings, setTableReadings] = useState<Reading[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5050/powell/last-14-days')
                setReadings(response.data)
            } catch (e) {
                console.error('Unsucessful retrieval of database');
                throw new Error(`Fetch Error: ${e}`)
            }
        };

        fetchData();

    }, []);

    useEffect(() => {
        const getTableData = (dateRange: number) => {
            setTableReadings(
                readings.filter(reading => {
                    const currDate = new Date(reading['Date']);
                    const referenceDate = new Date(readings[0]['Date']);
                    referenceDate.setDate(referenceDate.getDate() - dateRange);
                    return currDate >= referenceDate;
                }));
        };

        getTableData(14);

    }, [readings]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch('http://localhost:5050/powell/last-14-days')
                if (!response.ok) {
                    console.error('Unsucessful retrieval of database');
                }
                const data: Reading[] = await response.json();
                setReadings(data)
                console.log(data)
            } catch (e) {
                console.error('Unsucessful retrieval of database');
                throw new Error(`Fetch Error: ${e}`)
            }
        };

        fetchChartData();
    }, []);

    // Convert ISO date string to a readable format
    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            month: '2-digit',
            day: '2-digit',
            timeZone: 'UTC'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className='bg-background rounded-lg shadow-xl m-4 flex flex-col items-center text-dark_gray'>
            <table className='w-full'>
                <thead className='bg-gradient-to-r from-primary to-secondary text-black text-subtitle h-8'>
                    <tr>
                        {TableFields.map((field, index) => (
                            <th 
                                key={field.key}
                                className={`${index === 0 ? 'rounded-tl-lg' : index === TableFields.length - 1 ? 'rounded-tr-lg' : ''}`}
                            >
                                {field.key}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableReadings.map((reading, rowIndex) => (
                        <tr key={rowIndex}>
                            {TableFields.map((field, colIndex) => (
                                <td 
                                    key={field.key}
                                    className={`p-1 ${rowIndex % 2 === 1 ? 'bg-gray ' : ' '} 
                                    ${(rowIndex === tableReadings.length - 1 && colIndex === 0) ? 'rounded-bl-lg ' : ' '}
                                    ${(rowIndex === tableReadings.length - 1 && colIndex === TableFields.length - 1) ? 'rounded-br-lg' : ''}`}
                                >
                                    {field.value === 'Date' ? formatDate(reading[field.value]) : (reading as any)[field.value]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;