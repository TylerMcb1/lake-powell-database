import React from 'react';

// Element Import
import Navbar from './elements/navbar';
import Slideshow from './elements/slideshow';

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
        </div>
    );
};

export default Home;