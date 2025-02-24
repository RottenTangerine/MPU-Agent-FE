// NameStorage.tsx
import { useState, useEffect, FC } from 'react';

interface NameStorageProps {
    onUserChange: (username: string) => void;
}

const NameStorage: FC<NameStorageProps> = ({ onUserChange }) => {
    const [name, setName] = useState<string>('');
    const [storedName, setStoredName] = useState<string>('');

    useEffect(() => {
        const savedName = localStorage.getItem('userName');
        if (savedName) {
            setStoredName(savedName);
        }
    }, []);

    const handleSave = (): void => {
        localStorage.setItem('userName', name);
        setStoredName(name);
        onUserChange(name);
        setName('');
    };

    const handleClear = (): void => {
        localStorage.removeItem('userName');
        setStoredName('');
        onUserChange('');
    };

    if (storedName) {
        return (
            <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Welcome back, <span className="text-blue-600">{storedName}</span>!
                </h2>
                <button
                    onClick={handleClear}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSave}
                    disabled={!name.trim()}
                    className={`px-4 py-2 rounded-md transition-colors ${
                        name.trim()
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Save
                </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
                This name will be stored in localStorage
            </p>
        </div>
    );
};

export default NameStorage;