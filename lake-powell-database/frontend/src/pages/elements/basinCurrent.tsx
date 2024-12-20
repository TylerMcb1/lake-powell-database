import React, { useState, useEffect } from 'react';
import downArrow from '../../assets/arrows/downArrow.svg';
import upArrow from '../../assets/arrows/upArrow.svg';
import neutralArrow from '../../assets/arrows/neutralArrow.svg';
import axios from 'axios';

interface BasinReading {
    _id: string; // Date?
    "Snow Water Equivalent": number;
    "Snow Depth": number;
    "Precipitation Accumulation": number;
    "Precipitation Increment": number;
    "Snow Water % of Median": number;
    "Precipitation % of Median": number;
};

interface ConfigObject {
    auth: {
        username: string;
        password: string;
    };
}

const config: ConfigObject = {
    auth: {
        username: process.env.AUTH_USER || '',
        password: process.env.AUTH_PASS || ''
    }
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

    useEffect(() => {
        const getCurrYearData = async () => {
            try {
                const response = await axios.get(fetchString, config);

                // Type check response.data
                if (Array.isArray(response.data)) {
                    setCurrentReadings(response.data);
                } else {
                    throw new Error('Invalid response format')
                }
            } catch (e) {
                console.error('Unsucessful retrieval of database');
                throw new Error(`Fetch Error: ${e}`)
            }
        };

        getCurrYearData();
        
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
        
        setSnowWaterEquivalent(calculateChange('Snow Water Equivalent' as keyof BasinReading));
        setSnowDepth(calculateChange('Snow Depth' as keyof BasinReading));
        setPrecipitationAccumulation(calculateChange('Precipitation Accumulation' as keyof BasinReading));
        setPrecipitationIncrement(calculateChange('Precipitation Increment' as keyof BasinReading));

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
                    {name} Readings - {currentReadings[0]?.['_id'] ? formatDateYear(currentReadings[0]?.['_id']) : 'N/A'}
                </label>
                <label>
                    Snow Water Equivalent:
                    {(currentReadings[0]?.['Snow Water Equivalent'] !== undefined &&
                      currentReadings[0]?.['Snow Water Equivalent'] !== null) ? 
                    ` ${currentReadings[0]?.['Snow Water Equivalent'].toFixed(3)} inches (${snowWaterEquivalent}%)` : ' N/A'}
                    {displayArrow(snowWaterEquivalent)}
                </label>
                {(currentReadings[0]?.['Snow Depth'] !== undefined && currentReadings[0]?.['Snow Depth'] !== null) ? (
                <label>
                    Snow Depth:
                    {(currentReadings[0]?.['Snow Depth'] !== undefined &&
                      currentReadings[0]?.['Snow Depth'] !== null) ? 
                    ` ${currentReadings[0]?.['Snow Depth'].toFixed(3)} inches (${snowDepth}%)` : ' N/A'}
                    {displayArrow(snowDepth)}
                </label>
                ) : (<div />)}
                <label>
                    Annual Precipitation:
                    {(currentReadings[0]?.['Precipitation Accumulation'] !== undefined &&
                      currentReadings[0]?.['Precipitation Accumulation'] !== null) ?
                    ` ${currentReadings[0]?.['Precipitation Accumulation'].toFixed(3)} inches (${precipitationAccumulation}%)` : ' N/A'}
                    {displayArrow(precipitationAccumulation)}
                </label>
                <label>
                    Daily Precipitation Increment:
                    {(currentReadings[0]?.['Precipitation Increment'] !== undefined &&
                      currentReadings[0]?.['Precipitation Increment'] !== null) ?
                    ` ${currentReadings[0]?.['Precipitation Increment'].toFixed(3)} inches (${precipitationIncrement}%)` : ' 0 inches'}
                    {displayArrow(precipitationIncrement)}
                </label>
                <label>
                    Snow Water Equivalent:
                    {(currentReadings[0]?.['Snow Water % of Median'] !== undefined &&
                      currentReadings[0]?.['Snow Water % of Median'] !== null) ?
                    ` ${currentReadings[0]?.['Snow Water % of Median'].toFixed(3)}% of Median` : ' N/A'}
                </label>
                <label>
                    Annual Precipitation:
                    {currentReadings[0]?.['Precipitation % of Median'] !== undefined ?
                    ` ${currentReadings[0]?.['Precipitation % of Median'].toFixed(3)}% of Median` : ' N/A'}
                </label>
            </div>
        </div>
    )
};

export default BasinCurrent;