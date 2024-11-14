// FIX THE LOADING STATE
import React from 'react';

interface LoaderProps {
    message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "loading..." }) => {
    return (
        <div className="loader-container">
            <div className="loader-spinner"></div>
            <p className="loader-message">{message}</p>
        </div>
    );
};
export default Loader;