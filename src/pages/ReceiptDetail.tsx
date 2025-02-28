import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { receiptAPI, Item } from '../api/client'
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline'
import AddItemForm from '../components/AddItemForm'

const ReceiptDetail = () => {
    const { receiptId } = useParams<{ receiptId: string }>()
    const [items, setItems] = useState<Item[]>([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [totalAmount, setTotalAmount] = useState(0)

    // 加载收据详情
    const loadReceiptDetail = async () => {
        if (!receiptId) return

        try {
            const { data } = await receiptAPI.getDetail(receiptId)
            setItems(data)
            calculateTotal(data)
        } catch (err) {
            console.error('加载收据详情失败:', err)
            alert('无法加载收据详情')
        }
    }

    // 计算总金额
    const calculateTotal = (items: Item[]) => {
        const total = items.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0
        )
        setTotalAmount(total)
    }

    // 添加新物品
    const handleAddItem = async (itemData: {
        name: string
        quantity: number
        price: number
    }) => {
        if (!receiptId) return

        try {
            const { data } = await receiptAPI.addItem(receiptId, {
                item_name: itemData.name,
                quantity: itemData.quantity,
                price: itemData.price
            })
            setItems(prev => [...prev, data])
            setShowAddForm(false)
            calculateTotal([...items, data])
        } catch (err) {
            console.error('添加物品失败:', err)
            alert('添加失败，请重试')
        }
    }

    useEffect(() => {
        loadReceiptDetail()
    }, [receiptId])

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* 返回导航 */}
                <div className="mb-6">
                    <Link
                        to="/dashboard"
                        className="flex items-center text-gray-600 hover:text-blue-500"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-1" />
                        返回发票列表
                    </Link>
                </div>

                {/* 总金额统计 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">总计金额</h2>
                        <span className="text-2xl font-bold text-blue-600">
              ¥{totalAmount.toFixed(2)}
            </span>
                    </div>
                </div>

                {/* 物品操作栏 */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">物品清单</h2>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            添加物品
                        </button>
                    </div>

                    {/* 物品列表 */}
                    <div className="space-y-4">
                        {items.map(item => (
                            <div
                                key={item.item_id}
                                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-800">{item.item_name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        数量: {item.quantity} × 单价: ¥{item.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-lg font-semibold text-blue-600">
                                    ¥{(item.quantity * item.price).toFixed(2)}
                                </div>
                            </div>
                        ))}

                        {items.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                暂无物品记录
                            </div>
                        )}
                    </div>
                </div>

                {/* 浮动添加按钮（移动端优化） */}
                <div className="md:hidden fixed bottom-8 right-8">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* 添加物品表单 */}
                <AddItemForm
                    open={showAddForm}
                    onClose={() => setShowAddForm(false)}
                    onSubmit={handleAddItem}
                />
            </div>
        </div>
    )
}

export default ReceiptDetail