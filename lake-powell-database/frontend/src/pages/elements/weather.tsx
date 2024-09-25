import React, { useEffect, useState} from 'react';
import axios from 'axios';

// Import day icons
import sunny from '../../assets/weather/sunny.svg';
import mostlyCloudy from '../../assets/weather/mostlyCloudy.svg';
import partlyCloudy from '../../assets/weather/partlyCloudy.svg';
import cloudy from '../../assets/weather/cloudy.svg';
import windy from '../../assets/weather/windy.svg';
import rain from '../../assets/weather/rain.svg';
import rainThunderstorm from '../../assets/weather/rainThunderstorm.svg';
import thunderstorm from '../../assets/weather/thunderstorm.svg';
import sleet from '../../assets/weather/sleet.svg';
import hail from '../../assets/weather/hail.svg';
import snow from '../../assets/weather/snow.svg';

// Import night icons
import night from '../../assets/weather/night.svg';
import mostlyCloudyNight from '../../assets/weather/mostlyCloudyNight.svg';
import partlyCloudyNight from '../../assets/weather/partlyCloudyNight.svg';

interface WeatherObject {
    fetchWeatherString: string;
    fetchSSString: string;
    fetchAlertsString: string;
};

interface Alert {
    name: string;
    link: string;
};

interface ForecastCondition {
    isDaytime: boolean;
    startTime: string;
    shortForecast: string;
    temperature: number;
};

interface CurrentCondition {
    isDaytime: boolean;
    startTime: string;
    shortForecast: string; 
    temperature: number;
    windSpeed: string;
    windDirection: string;
    humidity: number;
    precipitation: number;
};

const DayConditionIcons: Record<string, string> = {
    'sunny': sunny,
    'clear': sunny,
    'partly cloudy': partlyCloudy,
    'mostly cloudy': mostlyCloudy,
    'cloudy': cloudy,
    'rain': rain,
    'rain thunderstorm': rainThunderstorm,
    'thunderstorm': thunderstorm,
    'sleet': sleet,
    'hail': hail,
    'snow': snow,
    'windy': windy,
};

const NightConditionIcons: Record<string, string> = {
    'clear': night,
    'partly cloudy': partlyCloudyNight,
    'mostly cloudy': mostlyCloudyNight,
    'cloudy': cloudy,
    'rain': rain,
    'rain thunderstorm': rainThunderstorm,
    'thunderstorm': thunderstorm,
    'sleet': sleet,
    'hail': hail,
    'snow': snow,
    'windy': windy,
};

const Weather: React.FC<WeatherObject> = ({ fetchWeatherString, fetchSSString, fetchAlertsString }) => {
    // Current Conditions
    const [currentWeather, setCurrentWeather] = useState<CurrentCondition>({
        isDaytime: true,
        startTime: '',
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
    const [timeOffset, setTimeOffset] = useState<number>(0);

    useEffect(() => {
        const fetchWeather = async () => {
            const response = await axios.get(fetchWeatherString);
            const weatherData = await response.data;

            const fetchedCurrentWeather: CurrentCondition = {
                isDaytime: weatherData[0].isDaytime,
                startTime: weatherData[0].startTime,
                shortForecast: weatherData[0].shortForecast,
                temperature: weatherData[0].temperature,
                windSpeed: weatherData[0].windSpeed,
                windDirection: weatherData[0].windDirection,
                humidity: weatherData[0].relativeHumidity.value,
                precipitation: weatherData[0].probabilityOfPrecipitation.value,
            };
            setCurrentWeather(fetchedCurrentWeather);

            const fetchedForecastWeather: ForecastCondition[] = weatherData.slice(1,7).map((hour: ForecastCondition) => ({
                isDaytime: hour.isDaytime,
                startTime: hour.startTime,
                shortForecast: hour.shortForecast,
                temperature: hour.temperature,
            }));
            setForecastWeather(fetchedForecastWeather);

            // Get offset time from current weather date string
            const dateString: string = weatherData[0].startTime;
            const offsetMatch = dateString.match(/([+-]\d{2}):(\d{2})$/);
            if (offsetMatch) {
                const hoursOffset = parseInt(offsetMatch[1].slice(1), 10);
                setTimeOffset(hoursOffset);
            }
        };

        const fetchAlerts = async () => {
            const response = await axios.get(fetchAlertsString);
            setWeatherAlerts(response.data);
        };

        const fetchSunriseSunset = async () => {
            const response = await axios.get(fetchSSString);
            const sunriseSunsetData = await response.data;

            setCurrentSunrise(adjustForTimezone(sunriseSunsetData.sunrise, timeOffset));
            setCurrentSunset(adjustForTimezone(sunriseSunsetData.sunset, timeOffset));
        };

        fetchWeather();
        fetchAlerts();
        fetchSunriseSunset();

    }, []);

    // Function to adjust the UTC time to the desired timezone
    const adjustForTimezone = (dateString: string, offset: number) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() - offset);
        return date.toLocaleString();
    };

    // Return weather icon based on condition string
    const getIcon = (hour: ForecastCondition) => {
        if (hour.isDaytime) {
            for (let condition in DayConditionIcons) {
                if (hour.shortForecast.toLowerCase().includes(condition)) {
                    return <img src={DayConditionIcons[condition]} alt={condition} className='inline-block w-10 h-10' />;
                }
                return <img src={DayConditionIcons['cloudy']} alt={'cloudy'} className='inline-block w-10 h-10' />;
            }
        } else {
            for (let condition in NightConditionIcons) {
                if (hour.shortForecast.toLowerCase().includes(condition)) {
                    return <img src={NightConditionIcons[condition]} alt={condition} className='inline-block w-10 h-10' />;
                }
                return <img src={NightConditionIcons['cloudy']} alt={'cloudy'} className='inline-block w-10 h-10' />;
            }
        }
    };

    // Get hour for hourly forecast
    const getHour = (dateString: string) => {
        const forecastTime = new Date(dateString);

        // Get offset time from the date string
        const offsetMatch = dateString.match(/([+-]\d{2}):(\d{2})$/);
        
        // Parse for offset and adjust UTC time for time offset
        if (offsetMatch) {
            const hoursOffset = parseInt(offsetMatch[1].slice(1), 10);
            const adjustedHour = (forecastTime.getUTCHours() - hoursOffset + 24) % 24;

            // Adjust hour for AM/PM label
            if (adjustedHour === 0 || adjustedHour === 12) {
                return `12 ${adjustedHour === 0 ? 'AM' : 'PM'}`;
            } else if (adjustedHour > 12) {
                return `${adjustedHour - 12} PM`;
            } else {
                return `${adjustedHour} AM`;
            }
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
                    {getIcon(currentWeather)}
                    <label className='text-titleXl'>{currentWeather.temperature}°F</label>
                </div>
                <div className='flex flex-col border-l border-gray pl-2'>
                    <label>{currentWeather.shortForecast}</label>
                    <label>Wind: {currentWeather.windSpeed} {currentWeather.windDirection}</label>
                </div>
                <div className='flex flex-col border-l border-gray pl-2'>
                    <label>Humidity: {currentWeather.humidity}%</label>
                    <label>Precipitation: {currentWeather.precipitation}%</label>
                </div>
                <div className='flex flex-col border-l border-gray pl-2'>
                    <label>Sunrise: {formatSunsetTime(currentSunrise)}</label>
                    <label>Sunset: {formatSunsetTime(currentSunset)}</label>
                </div>
            </div>
            <div className='flex justify-between mx-4'>
                {forecastWeather.map((hour, index) => (
                    <div className={`flex flex-col flex-grow items-center ${index !== 0 ? 'border-l border-gray' : ''}`}>
                        {getIcon(hour)}
                        <label>{getHour(hour.startTime)}</label>
                        <label>{hour.temperature}°F</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Weather;