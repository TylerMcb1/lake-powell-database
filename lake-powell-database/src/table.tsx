import { useState } from 'react';

const Table = () => {
    const [readings, setReadings] = useState([
        {date: '8/1/24', waterLevel: 3582.11, temperature: 98.2, inflow: 23404, outflow: 12343},
        {date: '8/2/24', waterLevel: 3582.62, temperature: 97.5, inflow: 21189, outflow: 11809},
        {date: '8/3/24', waterLevel: 3582.95, temperature: 99.8, inflow: 20912, outflow: 13397},
        {date: '8/4/24', waterLevel: 3583.37, temperature: 95.1, inflow: 22554, outflow: 11012}
    ])

    return (
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Water Level</th>
                    <th>Temperature</th>
                    <th>Inflow</th>
                    <th>Outflow</th>
                </tr>
            </thead>
                <tbody>
                {readings.map(reading => (
                    <tr>
                        <td>{reading.date}</td>
                        <td>{reading.waterLevel}</td>
                        <td>{reading.temperature}</td>
                        <td>{reading.inflow}</td>
                        <td>{reading.outflow}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;