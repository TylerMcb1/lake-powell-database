import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

interface SlideshowImage {
    name: string;
    caption: string;
}

interface SlideshowProps {
    images: SlideshowImage[];
    interval?: number;
}

const Slideshow: React.FC<SlideshowProps> = ({ images, interval = 3000 }) => {
    return (
        <div className='rounded-lg overflow-hidden m-5'>
            <Slide duration={interval}>
                {images.map((image, index) => (
                    <div
                        key={index}
                        className='flex items-center justify-center h-[40em]'
                    >
                        <img src={image.name} alt={image.caption} className='w-full h-full object-cover'/>
                    </div>
                ))}
            </Slide>
        </div>
    );
};

export default Slideshow;