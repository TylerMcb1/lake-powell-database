import { useState } from 'react'

const Dropdown = () => {
    const [selectedOption, setSelectedOption] = useState('Water Level');
    const [options, setOptions] = useState([
        { label: 'Water Level', value: 'Water Level' },
        { label: 'Inflows', value: 'Inflows' },
        { label: 'Outflows', value: 'Outflows' },
        { label: 'Temperature', value: 'Temperature' }
    ]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
        console.log(event.target.value);
    };

    return (
        <div>
            <label htmlFor="dropdown">Choose an option: </label>
            <select id="dropdown" value={selectedOption} onChange={handleChange}>
                {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
                ))}
            </select>
            <p/>
            <b>{selectedOption} For Past 14 Days</b>
        </div>
    );
};

export default Dropdown;