import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const apiClient = async <T>(config: AxiosRequestConfig) => {
    try {
        const response = await axios({
            ...config,
            baseURL: API_BASE,
            timeout: 120000, // 120秒超时
        });
        return response.data as T;
    } catch (error) {
        const err = error as AxiosError;
        throw {
            message: err.response?.data?.message || '请求失败',
            code: err.response?.status
        } as ApiError;
    }
};

// API方法封装
export const fetchReceipts = (userId: string) =>
    apiClient<Receipt[]>({
        url: '/user/receipts',
        headers: { 'user-id': userId }
    });

export const fetchReceiptItems = (userId: string, receiptId: string) =>
    apiClient<ReceiptItem[]>({
        url: `/usr/receipts/${receiptId}/items`,
        headers: { 'user-id': userId }
    });

export const uploadImage = (userId: string, base64: string) =>
    apiClient<void>({
        url: '/chat/',
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        data: JSON.stringify({ user_id: userId, base64Source: base64 })
    });