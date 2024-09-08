import { useState, useEffect } from 'react';

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

const Table = () => {
    const [readings, setReadings] = useState<Reading[]>([]);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch('http://localhost:5050/last-14-days')
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
        <div>
            <table>
                <thead>
                    <tr>
                        {TableFields.map(field => (
                            <th key={field.key}>{field.key}</th>
                        ))}
                    </tr>
                </thead>
                    <tbody>
                    {readings.map(reading => (
                        <tr key={reading._id}>
                            {TableFields.map(field => (
                                <td key={field.key}>
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