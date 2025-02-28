import { useEffect, useState } from 'react'
import { receiptAPI } from '../api/client'
import { Receipt } from '../api/client'
import { Link } from 'react-router-dom'
import { PlusIcon, CameraIcon } from '@heroicons/react/24/outline'
import CreateReceiptModal from '../components/CreateReceiptModal'
import ImageUploader from '../components/ImageUploader'

const Dashboard = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showImageUpload, setShowImageUpload] = useState(false)

    const username = localStorage.getItem('username')

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data } = await receiptAPI.getAll()
                setReceipts(data)
            } catch (err) {
                console.error('加载数据失败:', err)
                alert('无法加载发票数据，请稍后重试')
            }
        }
        loadData()
    }, [])

    const handleCreateReceipt = async (formData: {
        name: string
        category: string
        total: number
    }) => {
        try {
            const { data } = await receiptAPI.create({
                receipt_name: formData.name,
                category: formData.category,
                total_price: formData.total
            })
            setReceipts([...receipts, data])
            setShowCreateModal(false)
            alert('发票创建成功！')
        } catch (err) {
            console.error('创建失败:', err)
            alert('创建发票失败，请检查网络连接')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* 头部操作栏 */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">我的发票</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowImageUpload(true)}
                            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <CameraIcon className="w-5 h-5 mr-2" />
                            拍照上传
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            新建发票
                        </button>
                    </div>
                </div>

                {/* 发票列表 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {receipts.map(receipt => (
                        <Link
                            to={`/receipts/${receipt.receipt_id}`}
                            key={receipt.receipt_id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {receipt.receipt_name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(receipt.create_time).toLocaleDateString()}
                                    </p>
                                    {receipt.category && (
                                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {receipt.category}
                    </span>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-blue-600">
                                        ¥{receipt.total_price.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* 空状态 */}
                {receipts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">暂无发票记录，请点击上方按钮创建</p>
                    </div>
                )}

                {/* 创建发票模态框 */}
                <CreateReceiptModal
                    open={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateReceipt}
                />

                {/* 图片上传模态框 */}
                <ImageUploader
                    open={showImageUpload}
                    onClose={() => setShowImageUpload(false)}
                    userId={username || ''}
                />
            </div>
        </div>
    )
}

export default Dashboard