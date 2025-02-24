// App.tsx
import {useState, useEffect, FC} from 'react';
import axios from 'axios';
import NameStorage from "./components/NameStorage.tsx";

type Receipt = {
    receipt_id: string;
    receipt_name: string;
    create_time: string;
    total_price: number;
};

type ReceiptItem = {
    item_id: string;
    receipt_id: string;
    item_name: string;
    quantity: number;
    price: number;
};

const API_BASE = 'http://127.0.0.1:8000';

const App: FC = () => {
    const [storedName, setStoredName] = useState<string>('');
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const fetchReceipts = async (username: string): Promise<void> => {
        try {
            setLoading(true);
            const {data} = await axios.get<Receipt[]>(`${API_BASE}/user/receipts`, {
                headers: {'user-id': username}
            });
            setReceipts(data);
            setError('');
        } catch (err) {
            setError('无法获取收据列表');
        } finally {
            setLoading(false);
        }
    };

    const fetchReceiptItems = async (receiptId: string): Promise<void> => {
        try {
            setLoading(true);
            const {data} = await axios.get<ReceiptItem[]>(
                `${API_BASE}/user/receipts/${receiptId}/items`,
                {headers: {'user-id': storedName}}
            );
            setSelectedReceipt(data);
        } catch (err) {
            setError('获取详情失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const username = localStorage.getItem('userName');
        if (username) {
            setStoredName(username);
            fetchReceipts(username);
        }
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <NameStorage
                onUserChange={(username: string) => {
                    setStoredName(username);
                    if (username) {
                        fetchReceipts(username);
                    }
                }}
            />

            <div className={`transition-opacity duration-300 ${storedName ? 'opacity-100' : 'opacity-0'}`}>
                {error && (
                    <div className="p-4 mb-4 text-red-600 bg-red-50 rounded-lg">
                        {error}
                    </div>
                )}


                {loading ? (
                    <div className="text-center py-8 text-gray-500">加载中...</div>
                ) : receipts.length > 0 ? (
                    <div className="grid gap-4">
                        {receipts.map(receipt => (
                            <div
                                key={receipt.receipt_id}
                                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => fetchReceiptItems(receipt.receipt_id)}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                        {receipt.receipt_name}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        {new Date(receipt.create_time).toLocaleDateString()}
                                     </span>
                                </div>
                                <div className="mt-2 text-right font-medium">
                                    ¥{receipt.total_price.toFixed(2)}
                                </div>
                            </div>
                        ))}

                        {selectedReceipt && (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
                                <h3 className="text-lg font-semibold mb-4">消费明细</h3>
                                {selectedReceipt.map(item => (
                                    <div
                                        key={item.item_id}
                                        className="flex justify-between py-2 border-b border-gray-200 last:border-0"
                                    >
                                        <span>{item.item_name}</span>
                                        <div className="space-x-4">
                                            <span className="text-gray-500">x{item.quantity}</span>
                                            <span className="font-medium">
                        ¥{item.price.toFixed(2)}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : storedName && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        暂无历史消费记录
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;