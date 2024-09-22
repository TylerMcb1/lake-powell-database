import React, { useState, useEffect } from 'react';
import downArrow from '../../assets/arrows/downArrow.svg';
import upArrow from '../../assets/arrows/upArrow.svg';
import neutralArrow from '../../assets/arrows/neutralArrow.svg';
import axios from 'axios';

interface Reading {
    _id: string;
    Date: string;
    "Elevation (feet)": number;
    "Storage (af)": number;
    "Evaporation (af)": number;
    "Inflow** (cfs)": number;
    "Total Release (cfs)": number;
};

const Current: React.FC = () => {
    const [currentReadings, setCurrentReadings] = useState<Reading[]>([]);
    const [elevationChange, setElevationChange] = useState<number>(0);
    const [inflowChange, setInflowChange] = useState<number>(0);
    const [outflowChange, setOutflowChange] = useState<number>(0);
    const [storageChange, setStorageChange] = useState<number>(0);

    useEffect(() => {
        const getCurrentData = async () => {
            try {
                const response = await axios.get<Reading[]>('http://localhost:5050/powell/last-14-days');

                // Type check response.data
                if (Array.isArray(response.data)) {
                    const readings = response.data;
                    setCurrentReadings(
                        readings.filter((reading) => {
                            const currDate = new Date(reading['Date']);
                            const referenceDate = new Date(readings[0]['Date']);
                            referenceDate.setDate(referenceDate.getDate() - 2);
                            return currDate >= referenceDate;
                        })
                    );
                } else {
                    throw new Error('Invalid response format')
                }
            } catch (e) {
                console.error('Unsucessful retrieval of database');
                throw new Error(`Fetch Error: ${e}`)
            }
        };

        getCurrentData();
        
    }, []);

    useEffect(() => {
        const calculateChange = (field: keyof Reading): number => {
            if (currentReadings[0] !== undefined && currentReadings[1] !== undefined) {
                const currentValue = currentReadings[0][field] as unknown as number;
                const previousValue = currentReadings[1][field] as unknown as number;
                return parseFloat((100 * ((currentValue - previousValue) / currentValue)).toFixed(3));
            } else {
                return 0;
            }
        };

        setElevationChange(calculateChange('Elevation (feet)' as keyof Reading));
        setInflowChange(calculateChange('Inflow** (cfs)' as keyof Reading));
        setOutflowChange(calculateChange('Total Release (cfs)' as keyof Reading));
        setStorageChange(calculateChange('Storage (af)' as keyof Reading));

    }, [currentReadings]);

    // Display Up, Down, or Neutral arrow for reading component
    const displayArrow = (percent: number): React.ReactNode => {
        if (percent > 0) {
            return <img src={upArrow} alt='Up Arrow' className='inline-block w-4 h-4 ml-2'/>;
        } else if (percent < 0) {
            return <img src={downArrow} alt='Down Arrow' className='inline-block w-4 h-4 ml-2'/>;
        } else {
            return <img src={neutralArrow} alt='Neutral Arrow' className='inline-block w-4 h-4 ml-2'/>;
        }
    };

    // Convert ISO date string to a readable format
    const formatDateYear = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
        };
        return (new Date(dateString)).toLocaleDateString('en-US', options);
    };

    return (
        <div className='bg-background text-dark_gray text-subtitle rounded-lg shadow-xl p-2'>
            {currentReadings[0] ? (
                <div className='flex flex-col'>
                    <label className='text-title'>
                        Lake Powell Readings - {currentReadings[0]?.['Date'] ? formatDateYear(currentReadings[0]?.['Date']) : 'N/A'}
                    </label>
                    <label>
                        Lake Powell Elevation:
                        {currentReadings[0]?.['Elevation (feet)'] !== undefined ? 
                        ` ${currentReadings[0]?.['Elevation (feet)']} feet (${elevationChange}%)` : 'N/A'}
                        {displayArrow(elevationChange)}
                    </label>
                    <label>
                        Inflow:
                        {currentReadings[0]?.['Inflow** (cfs)'] !== undefined ?
                        ` ${currentReadings[0]?.['Inflow** (cfs)']} cubic feet/second (${inflowChange}%)` : 'N/A'}
                        {displayArrow(inflowChange)}
                    </label>
                    <label>
                        Outflow:
                        {currentReadings[0]?.['Total Release (cfs)'] !== undefined ?
                        ` ${currentReadings[0]?.['Total Release (cfs)']} cubic feet/second (${outflowChange}%)` : 'N/A'}
                        {displayArrow(outflowChange)}
                    </label>
                    <label>
                        Storage:
                        {currentReadings[0]?.['Storage (af)'] !== undefined ?
                        ` ${currentReadings[0]?.['Storage (af)']} million acre feet (${storageChange}%)` : 'N/A'}
                        {displayArrow(storageChange)}
                    </label>
                </div>
            ) : <div/> }
        </div>
    )
};

export default Current;