import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { UserGreeting } from './components/UserGreeting';
import { ReceiptList } from './components/ReceiptList';
import { ImageUploader } from './components/ImageUploader';
import { fetchReceipts } from './api';
import { Receipt} from '../types';

export default function App() {
    const [name, setName] = useState('');
    const [storedName, setStoredName] = useState('');
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const savedName = localStorage.getItem('userName');
        savedName && setStoredName(savedName);
    }, []);

    const handleSave = async () => {
        if (name.trim()) {
            try {
                setLoading(true);
                const userId = name.trim();

                localStorage.setItem('userName', userId);
                setStoredName(userId);

                const data = await fetchReceipts(userId);
                setReceipts(data);
                setName('');
                setError('');
            } catch (err) {
                setError('Failed to load receipts');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleClear = () => {
        localStorage.removeItem('userName');
        setStoredName('');
        setReceipts([]);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">

                    {!storedName && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-700">请输入用户名：</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                                    placeholder="用户名..."
                                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={handleSave}
                                    disabled={!name.trim() || loading}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? '加载中...' : '确认'}
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                    )}


                {storedName && (
                    <div className="space-y-8">
                        <UserGreeting name={storedName} onClear={handleClear} />

                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">上传收据</h3>
                                <ImageUploader userId={storedName} />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">历史记录</h3>
                                <ReceiptList userId={storedName} receipts={receipts} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}