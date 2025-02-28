import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器（用于添加用户ID）
api.interceptors.request.use(config => {
    const username = localStorage.getItem('username')
    if (username) {
        config.headers['uid'] = username // 根据实际header名称调整
    }
    return config
})

export interface ChatResponse {
    // 根据实际返回结构定义
    result: string
}


export interface Receipt {
    receipt_id: string
    receipt_name: string
    create_time: string
    total_price: number
    category?: string
}

export interface Item {
    item_id: string
    item_name: string
    quantity: number
    price: number
}

export const receiptAPI = {
    // 获取所有收据
    getAll: () => api.get<Receipt[]>('/usr/receipts'),

    // 创建收据
    create: (data: {
        receipt_name: string
        category: string
        total_price: number
    }) => api.post('/usr/receipts', data),

    // 获取收据详情
    getDetail: (receiptId: string) => api.get<{
        receipt: Receipt
        items: Item[]
    }>(`/usr/receipts/${receiptId}/items`),

    // 添加物品
    addItem: (receiptId: string, item: {
        item_name: string
        quantity: number
        price: number
    }) => api.post(`/usr/receipts/${receiptId}/items`, item)
}