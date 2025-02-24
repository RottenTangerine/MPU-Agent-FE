export interface Receipt {
    receipt_id: string;
    receipt_name: string;
    create_time: string;
    total_price: number;
}

export interface ReceiptItem {
    item_id: string;
    item_name: string;
    quantity: number;
    price: number;
}

export type ApiError = {
    message: string;
    code?: number;
};