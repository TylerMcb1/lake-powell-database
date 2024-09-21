import React, { useState} from 'react';

// Import weather icons
import sunny from '../../assets/weather/sunny.svg'
import cloudy from '../../assets/weather/cloudy.svg'
import night from '../../assets/weather/night.svg'
import windy from '../../assets/weather/windy.svg'
import snow from '../../assets/weather/snow.svg'

{/* <img src={sunny} alt='Sunny' className='inline-block w-10 h-10' />
    <img src={cloudy} alt='Cloudy' className='inline-block w-10 h-10' />
    <img src={night} alt='Night' className='inline-block w-10 h-10' />
    <img src={windy} alt='Windy' className='inline-block w-10 h-10' />
    <img src={snow} alt='Snowy' className='inline-block w-10 h-10' /> */}

type Alert = {
    name: string;
    link: string;
};

type TimeTempCondition = {
    time: number,
    temp: number,
    condition: string,
};

const ConditionIcons: Record<string, string> = {
    'sunny': sunny,
    'cloudy': cloudy,
    'night': night,
    'windy': windy,
    'snow': snow,
};

const exampleNext: TimeTempCondition[] = [
    {time: 18, temp: 98, condition: 'sunny'},
    {time: 19, temp: 97, condition: 'sunny'},
    {time: 20, temp: 96, condition: 'night'},
    {time: 21, temp: 95, condition: 'night'},
    {time: 22, temp: 92, condition: 'night'},
    {time: 23, temp: 91, condition: 'night'},
]

const Weather: React.FC = () => {
    // Current Conditions
    const [currentConditions, setCurrentConditions] = useState<string>('cloudy');
    const [currentTemp, setCurrentTemp] = useState<number>(99);
    const [currentWind, setCurrentWind] = useState<string>('10 mph NW');
    const [currentHumidity, setCurrentHumidity] = useState<number>(21);
    const [currentSunset, setCurrentSunset] = useState<string>('2024-09-20T19:25:00');
    const [currentPrecipitation, setCurrentPreciptation] = useState<number>(0);

    // Weather Alerts and next Conditions
    const [weatherAlerts, setWeatherAlerts] = useState<Alert[]>();
    const [nextHours, setNextHours] = useState<TimeTempCondition[]>(exampleNext);

    // Return weather icon based on condition string
    const getIcon = (key: keyof typeof ConditionIcons) => {
        return <img src={ConditionIcons[key]} alt={key} className='inline-block w-10 h-10' />;
    };

    const formatTime = (time: number) => {
        if (time > 12) {
            return `${time - 12} PM`;
        } else {
            return `${time} AM`;
        }
    };

    // Format Sunset time as HH:MM AM/PM
    const formatSunsetTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    }

    return (
        <div className='bg-background text-dark_gray text-body rounded-lg shadow-xl p-2'>
            <div className='flex items-center justify-center space-x-2 mt-2 mb-4'>
                <div className='flex items-center space-x-2'> 
                    {getIcon(currentConditions)}
                    <label className='text-titleXl'>{currentTemp}°F</label>
                </div>
                <div className='flex flex-col border-l border-gray pl-2'>
                    <label>Wind: {currentWind}</label>
                    <label>Humidity: {currentHumidity}%</label>
                </div>
                <div className='flex flex-col border-l border-gray pl-2'>
                    <label>Sunset: {formatSunsetTime(currentSunset)}</label>
                    <label>Precipitation: {currentPrecipitation}%</label>
                </div>
            </div>
            <div className='flex justify-between mx-4'>
                {nextHours.map((hour, index) => (
                    <div className={`flex flex-col flex-grow items-center ${index !== 0 ? 'border-l border-gray' : ''}`}>
                        {getIcon(hour.condition)}
                        <label>{formatTime(hour.time)}</label>
                        <label>{hour.temp}°F</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Weather;