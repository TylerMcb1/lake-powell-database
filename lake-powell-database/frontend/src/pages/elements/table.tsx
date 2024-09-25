import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface LakeReading {
    _id: string;
    Date: string;
    "Elevation (feet)": number;
    "Storage (af)": number;
    "Evaporation (af)": number;
    "Inflow** (cfs)": number;
    "Total Release (cfs)": number;
};

interface BasinReading {
    _id: string;
    Date: string;
    "Station Id": number;
    "Snow Water Equivalent (in) Start of Day Values": number;
    "Snow Depth (in) Start of Day Values": number;
    "Precipitation Accumulation (in) Start of Day Values": number;
    "Precipitation Increment (in)": number;
    "Snow Water Equivalent % of Median (1991-2020)": number;
    "Precipitation Accumulation % of Median (1991-2020)": number;
};

interface TableField {
    key: string;
    value: string;
};

interface TableObject {
    fetchString: string;
    type: string;
};

const LakeFields: TableField[] = [
    {key: 'Date', value: 'Date'},
    {key: 'Water Level', value: 'Elevation (feet)'},
    {key: 'Storage', value: 'Storage (af)'},
    {key: 'Inflow', value: 'Inflow** (cfs)'},
    {key: 'Outflow', value: 'Total Release (cfs)'}
];

const BasinFields: TableField[] = [
    {key: 'Date', value: 'Date'},
    {key: 'Snow Water Equivalent', value: 'Snow Water Equivalent (in) Start of Day Values'},
    {key: 'Snow Depth', value: 'Snow Depth (in) Start of Day Values'},
    {key: 'Annual Precipitation', value: 'Precipitation Accumulation (in) Start of Day Values'},
    {key: 'Daily Precipitation', value: 'Precipitation Increment (in)'}
];

const Table: React.FC<TableObject> = ({ fetchString, type }) => {
    // Readings and Chart Data
    const [readings, setReadings] = useState<(LakeReading | BasinReading)[]>([]);
    const [tableReadings, setTableReadings] = useState<(LakeReading | BasinReading)[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(fetchString);
                setReadings(response.data);
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
                        {(type === 'reservoir') ? (
                            LakeFields.map((field, index) => (
                                <th 
                                    key={field.key}
                                    className={`${index === 0 ? 'rounded-tl-lg' : index === LakeFields.length - 1 ? 'rounded-tr-lg' : ''}`}
                                >
                                    {field.key}
                                </th>
                            ))
                        ) : (
                            BasinFields.map((field, index) => (
                                <th 
                                    key={field.key}
                                    className={`${index === 0 ? 'rounded-tl-lg' : index === BasinFields.length - 1 ? 'rounded-tr-lg' : ''}`}
                                >
                                    {field.key}
                                </th>
                            ))
                        )}
                    </tr>
                </thead>
                <tbody>
                    {tableReadings.map((reading, rowIndex) => (
                        <tr key={rowIndex}>
                            {(type === 'reservoir') ? (
                                LakeFields.map((field, colIndex) => (
                                    <td 
                                        key={field.key}
                                        className={`p-1 ${rowIndex % 2 === 1 ? 'bg-gray ' : ' '} 
                                        ${(rowIndex === tableReadings.length - 1 && colIndex === 0) ? 'rounded-bl-lg ' : ' '}
                                        ${(rowIndex === tableReadings.length - 1 && colIndex === LakeFields.length - 1) ? 'rounded-br-lg' : ''}`}
                                    >
                                        {field.value === 'Date' ? formatDate(reading[field.value]) : (reading as any)[field.value]}
                                    </td>
                                ))
                            ) : (
                                BasinFields.map((field, colIndex) => (
                                    <td 
                                        key={field.key}
                                        className={`p-1 ${rowIndex % 2 === 1 ? 'bg-gray ' : ' '} 
                                        ${(rowIndex === tableReadings.length - 1 && colIndex === 0) ? 'rounded-bl-lg ' : ' '}
                                        ${(rowIndex === tableReadings.length - 1 && colIndex === BasinFields.length - 1) ? 'rounded-br-lg' : ''}`}
                                    >
                                        {field.value === 'Date' ? formatDate(reading[field.value]) : (reading as any)[field.value]}
                                    </td>
                                ))
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;