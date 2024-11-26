import React from 'react';

interface TextboxObject {
    children: React.ReactNode;
}

const Textbox: React.FC<TextboxObject> = ({ children }) => {
    return (
        <div className='bg-background text-paragraph rounded-lg shadow-xl m-4 p-4 flex flex-col items-center h-auto'>
            <p>{children}</p>
        </div>
    );
}

export default Textbox;