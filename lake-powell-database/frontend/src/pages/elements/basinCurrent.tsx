import React, { useState, useEffect } from 'react';
import downArrow from '../../assets/arrows/downArrow.svg';
import upArrow from '../../assets/arrows/upArrow.svg';
import neutralArrow from '../../assets/arrows/neutralArrow.svg';
import axios from 'axios';

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

interface BasinCurrentObject {
    fetchString: string;
    name: string;
};

const BasinCurrent: React.FC<BasinCurrentObject> = ({ fetchString, name }) => {
    const [currentReadings, setCurrentReadings] = useState<BasinReading[]>([]);
    const [snowWaterEquivalent, setSnowWaterEquivalent] = useState<number>(0);
    const [snowDepth, setSnowDepth] = useState<number>(0);
    const [precipitationAccumulation, setPrecipitationAccumulation] = useState<number>(0);
    const [precipitationIncrement, setPrecipitationIncrement] = useState<number>(0);
    const [snowWaterMedian, setSnowWaterMedian] = useState<number>(0);
    const [precipitationMedian, setPrecipitationMedian] = useState<number>(0);

    useEffect(() => {
        const getCurrentData = async () => {
            try {
                const response = await axios.get(fetchString);

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
        const calculateChange = (field: keyof BasinReading): number => {
            if (currentReadings[0] !== undefined && currentReadings[1] !== undefined) {
                const currentValue = currentReadings[0][field] as unknown as number;
                const previousValue = currentReadings[1][field] as unknown as number;
                return parseFloat((100 * ((currentValue - previousValue) / currentValue)).toFixed(3));
            } else {
                return 0;
            }
        };
        
        setSnowWaterEquivalent(calculateChange('Snow Water Equivalent (in) Start of Day Values' as keyof BasinReading));
        setSnowDepth(calculateChange('Snow Depth (in) Start of Day Values' as keyof BasinReading));
        setPrecipitationAccumulation(calculateChange('Precipitation Accumulation (in) Start of Day Values' as keyof BasinReading));
        setPrecipitationIncrement(calculateChange('Precipitation Increment (in)' as keyof BasinReading));
        setSnowWaterMedian(calculateChange('Snow Water Equivalent % of Median (1991-2020)' as keyof BasinReading));
        setPrecipitationMedian(calculateChange('Precipitation Accumulation % of Median (1991-2020)' as keyof BasinReading))

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
            <div className='flex flex-col'>
                <label className='text-title'>
                    {name} Readings - {currentReadings[0]?.['Date'] ? formatDateYear(currentReadings[0]?.['Date']) : 'N/A'}
                </label>
                <label>
                    Snow Water Equivalent:
                    {currentReadings[0]?.['Snow Water Equivalent (in) Start of Day Values'] !== undefined ? 
                    ` ${currentReadings[0]?.['Snow Water Equivalent (in) Start of Day Values']} inches (${snowWaterEquivalent}%)` : 'N/A'}
                    {displayArrow(snowWaterEquivalent)}
                </label>
                <label>
                    Snow Depth:
                    {currentReadings[0]?.['Snow Depth (in) Start of Day Values'] !== undefined ?
                    ` ${currentReadings[0]?.['Snow Depth (in) Start of Day Values']} inches (${snowDepth}%)` : 'N/A'}
                    {displayArrow(snowDepth)}
                </label>
                <label>
                    Annual Precipitation:
                    {currentReadings[0]?.['Precipitation Accumulation (in) Start of Day Values'] !== undefined ?
                    ` ${currentReadings[0]?.['Precipitation Accumulation (in) Start of Day Values']} inches (${precipitationAccumulation}%)` : 'N/A'}
                    {displayArrow(precipitationAccumulation)}
                </label>
                <label>
                    Daily Precipitation Increment:
                    {currentReadings[0]?.['Precipitation Increment (in)'] !== undefined ?
                    ` ${currentReadings[0]?.['Precipitation Increment (in)']} million acre feet (${precipitationIncrement}%)` : 'N/A'}
                    {displayArrow(precipitationIncrement)}
                </label>
                <label>
                    Snow Water Equivalent:
                    {currentReadings[0]?.['Snow Water Equivalent % of Median (1991-2020)'] !== undefined ?
                    ` ${currentReadings[0]?.['Snow Water Equivalent % of Median (1991-2020)']}% of Median` : 'N/A'}
                    {displayArrow(snowWaterMedian)}
                </label>
                <label>
                    Annual Precipitation:
                    {currentReadings[0]?.['Precipitation Accumulation % of Median (1991-2020)'] !== undefined ?
                    ` ${currentReadings[0]?.['Precipitation Accumulation % of Median (1991-2020)']}% of Median` : 'N/A'}
                    {displayArrow(precipitationMedian)}
                </label>
            </div>
        </div>
    )
};

export default BasinCurrent;