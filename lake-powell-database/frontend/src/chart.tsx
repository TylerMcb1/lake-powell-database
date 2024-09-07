import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Slider from '@mui/material/Slider';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
// import { IntegerType } from 'mongodb';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
Legend
);

interface Reading {
    _id: string;
    Date: string;
    "Elevation (feet)": number;
    "Storage (af)": number;
    "Evaporation (af)": number;
    "Inflow** (cfs)": number;
    "Total Release (cfs)": number;
};

interface TableField {
    key: string;
    value: string;
};

type ChartData = {
    labels: string[];
    datasets: {
        label: string;
        backgroundColor: string;
        borderColor: string;
        data: (number | null)[];
    }[];
};

const FieldOptions: TableField[] = [
    { key: 'Water Level', value: 'Elevation (feet)' },
    { key: 'Inflows', value: 'Inflow** (cfs)' },
    { key: 'Outflows', value: 'Total Release (cfs)' },
    { key: 'Storage', value: 'Storage (af)' },
    { key: 'Evaporation', value: 'Evaporation (af)'}
];

const DateRange: number[] = [14, 365];

const Chart: React.FC = () => {
    const [readings, setReadings] = useState<Reading[]>([]);

    const [selectedField, setSelectedField] = useState('Elevation (feet)');
    const [selectedDateRange, setSelectedDateRange] = useState(14);
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: [
            {
                label: '',
                backgroundColor: '',
                borderColor: '',
                data: [],
            },
        ],
    });

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch('http://localhost:5050/last-365-days')
                if (!response) {
                    console.error('Unsucessful retrieval of database');
                }
                const data = await response.json();
                setReadings(data)
            } catch (e) {
                console.error('Unsucessful retrieval of database');
                throw new Error(`Fetch Error: ${e}`)
            }
        };

        fetchChartData();
    }, []);

    useEffect(() => {
        const updateData = () => {
            setChartData({
            labels: setDates(),
            datasets: [
                {
                label: 'Lake Powell Elevations',
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                data: setData(selectedField as keyof Reading),
                },
            ],
            });
        };

        updateData();

    }, [selectedField, selectedDateRange]);

    const setData = (field: keyof Reading): number[] => {
        return readings
        .filter(reading => {
            const currDate = new Date(reading['Date']);
            const referenceDate = new Date(readings[0]['Date']);
            referenceDate.setDate(referenceDate.getDate() - selectedDateRange);
            return currDate >= referenceDate;
        })
        .map(reading => typeof reading[field] === 'number' ? reading[field] : 0)
        .reverse();
    };

    const setDates = (): string[] => {
        return readings
            .filter(reading => {
                const currDate = new Date(reading['Date']);
                const referenceDate = new Date(readings[0]['Date']);
                referenceDate.setDate(referenceDate.getDate() - selectedDateRange);
                return currDate >= referenceDate;
            })
            .map(reading => new Date(reading['Date']).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit'
                }))
            .reverse();
    };

    const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedField(event.target.value);
    };

    const handleDateChange = (event: Event, value: number | number[]) => {
        setSelectedDateRange(Array.isArray(value) ? value[0] : value);
    };

    return (
        <>
        <div>
            <label>Select a field: </label>
            <select id="dropdown" value={selectedField} onChange={handleFieldChange}>
                {FieldOptions.map((option) => (
                <option key={option.key} value={option.value}>
                    {option.key}
                </option>
                ))}
            </select>
        </div>
        <div>
            <label>Select a time range: {selectedDateRange} days</label>
            <Slider
                defaultValue={DateRange[0]}
                min={DateRange[0]}
                max={DateRange[1]}
                onChange={handleDateChange}
            />
        </div>
        <b>{selectedField} For Past {selectedDateRange} Days</b>
        <div style={{ width: '50em', height: '25em' }}>
            <Line data={chartData} options={{}}/>
        </div>
        </>
    );
};

export default Chart;