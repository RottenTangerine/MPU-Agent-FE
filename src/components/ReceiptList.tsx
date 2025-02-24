import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { Receipt, ReceiptItem } from '../types';
import { fetchReceiptItems } from '../api';

interface ReceiptListProps {
    userId: string;
    receipts: Receipt[];
}

export const ReceiptList = ({ userId, receipts }: ReceiptListProps) => {
    const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
    const [items, setItems] = useState<ReceiptItem[]>([]);

    const handleClick = async (receiptId: string) => {
        if (selectedReceipt === receiptId) {
            setSelectedReceipt(null);
        } else {
            const data = await fetchReceiptItems(userId, receiptId);
            setItems(data);
            setSelectedReceipt(receiptId);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">收据历史</h3>
            {receipts.map((receipt) => (
                <div
                    key={receipt.receipt_id}
                    className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleClick(receipt.receipt_id)}
                >
                    <div className="flex justify-between items-center">
                        <span className="font-medium">{receipt.receipt_name}</span>
                        <span className="text-blue-600">¥{receipt.total_price}</span>
                    </div>

                    <Transition
                        show={selectedReceipt === receipt.receipt_id}
                        enter="transition-opacity duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                    >
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            {items.map((item) => (
                                <div key={item.item_id} className="flex justify-between text-sm py-1">
                                    <span>{item.item_name}</span>
                                    <span>¥{item.price} x{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </Transition>
                </div>
            ))}
        </div>
    );
};