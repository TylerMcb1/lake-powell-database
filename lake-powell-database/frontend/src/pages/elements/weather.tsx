import React, { useEffect, useState} from 'react';

// Import weather icons
import sunny from '../../assets/weather/sunny.svg'
import cloudy from '../../assets/weather/cloudy.svg'
import night from '../../assets/weather/night.svg'
import windy from '../../assets/weather/windy.svg'
import snow from '../../assets/weather/snow.svg'
import axios from 'axios';

{/* <img src={sunny} alt='Sunny' className='inline-block w-10 h-10' />
    <img src={cloudy} alt='Cloudy' className='inline-block w-10 h-10' />
    <img src={night} alt='Night' className='inline-block w-10 h-10' />
    <img src={windy} alt='Windy' className='inline-block w-10 h-10' />
    <img src={snow} alt='Snowy' className='inline-block w-10 h-10' /> */}

    // https://api.weather.gov/stations/KAGU1/observations/latest?units=us -- lake powell current observations
    // https://api.weather.gov/gridpoints/FGZ/37,111/forecast/hourly?units=us -- forecast
    // https://api.weather.gov/alerts/active?point=37,-111 -- alerts
    
//     const stationId = 'KAGU1';


type Alert = {
    name: string;
    link: string;
};

type ForecastCondition = {
    startTime: string,
    shortForecast: string,
    temperature: number,
};

type CurrentCondition = {
    shortForecast: string, 
    temperature: number,
    windSpeed: string,
    windDirection: string,
    humidity: number,
    precipitation: number,
};

const ConditionIcons: Record<string, string> = {
    'Sunny': sunny,
    'Cloudy': cloudy,
    'Night': night,
    'windy': windy,
    'snow': snow,
};

const Weather: React.FC = () => {
    // Current Conditions
    const [currentWeather, setCurrentWeather] = useState<CurrentCondition>({
        shortForecast: '', 
        temperature: 0,
        windSpeed: '',
        windDirection: '',
        humidity: 0,
        precipitation: 0,
    });

    // Forecast conditions
    const [forecastWeather, setForecastWeather] = useState<ForecastCondition[]>([]);

    // Weather alerts and sunrise/sunset
    const [weatherAlerts, setWeatherAlerts] = useState<Alert[]>();
    const [currentSunrise, setCurrentSunrise] = useState<string>('')
    const [currentSunset, setCurrentSunset] = useState<string>('');

    useEffect(() => {
        const fetchWeather = async () => {
            const response = await axios.get('http://localhost:5050/powell/weather');
            const weatherData = await response.data;

            const fetchedCurrentWeather: CurrentCondition = {
                shortForecast: weatherData[0].shortForecast,
                temperature: weatherData[0].temperature,
                windSpeed: weatherData[0].windSpeed,
                windDirection: weatherData[0].windDirection,
                humidity: weatherData[0].relativeHumidity.value,
                precipitation: weatherData[0].probabilityOfPrecipitation.value,
            };
            setCurrentWeather(fetchedCurrentWeather);

            const fetchedForecastWeather: ForecastCondition[] = weatherData.slice(1,7).map((hour: ForecastCondition) => ({
                startTime: hour.startTime,
                shortForecast: hour.shortForecast,
                temperature: hour.temperature,
            }));
            setForecastWeather(fetchedForecastWeather);
        };

        fetchWeather();

    }, [])

    // Return weather icon based on condition string
    const getIcon = (key: keyof typeof ConditionIcons) => {
        return <img src={ConditionIcons[key]} alt={key} className='inline-block w-10 h-10' />;
    };

    const getHour = (dateString: string) => {
        const forecastTime = new Date(dateString);
        return forecastTime.getHours();
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
                    {getIcon(currentWeather.shortForecast)}
                    <label className='text-titleXl'>{currentWeather.temperature}°F</label>
                </div>
                <div className='flex flex-col border-l border-gray pl-2'>
                    <label>{currentWeather.shortForecast}</label>
                    <label></label>
                </div>
                <div className='flex flex-col border-l border-gray pl-2'>
                    <label>Wind: {currentWeather.windSpeed} {currentWeather.windDirection}</label>
                    <label>Humidity: {currentWeather.humidity}%</label>
                </div>
                <div className='flex flex-col border-l border-gray pl-2'>
                    <label>Sunset: {formatSunsetTime(currentSunset)}</label>
                    <label>Precipitation: {currentWeather.precipitation}%</label>
                </div>
            </div>
            <div className='flex justify-between mx-4'>
                {forecastWeather.map((hour, index) => (
                    <div className={`flex flex-col flex-grow items-center ${index !== 0 ? 'border-l border-gray' : ''}`}>
                        {getIcon(hour.shortForecast)}
                        <label>{getHour(hour.startTime)}</label>
                        <label>{hour.temperature}°F</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Weather;