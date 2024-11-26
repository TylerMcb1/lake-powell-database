import React from 'react';

// Element Import
import Navbar from './elements/navbar';
import Slideshow from './elements/slideshow';
import Textbox from './elements/textbox';

interface SlideshowImage {
    name: string;
    caption: string;
}

// Slideshow Images
const images: SlideshowImage[] = [
    {
        name: '/images/image1.jpg',
        caption: 'image 1'
    },
    {
        name: '/images/image3.jpg',
        caption: 'image 3'
    },
    {
        name: '/images/image4.jpg',
        caption: 'image 4'
    },
    {
        name: '/images/image5.jpg',
        caption: 'image 5'
    },
    {
        name: '/images/image7.jpg',
        caption: 'image 7'
    }
];

const Home: React.FC = () => {
    return (
        <div>
            <Navbar />
            <Slideshow images={images} interval={5000} />
            <Textbox>
                Colorado River Data is a cohesive platform that was created for greater access to thorough water data for each major reservoir in the 
                Colorado River Basin, as well as basin data for each respecitve subregion of the Colorado River Basin. This website provides a simple, 
                easy-to-use service for obtaining water and weather trends, lake conditions, and atmospheric trends through a simplified user interface.
                This includes daily elevation, storage, inflow/outflow, and weather data for each reservoir, as well as current snowpack and 
                precipitation data trends for each subregion.
            </Textbox>
        </div>
    );
};

export default Home;