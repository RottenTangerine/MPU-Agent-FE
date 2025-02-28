import { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline'
import axios from 'axios'

interface Props {
    open: boolean
    onClose: () => void
    userId: string
}

const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.src = e.target?.result as string

            img.onload = () => {
                const canvas = document.createElement('canvas')
                const maxWidth = 800
                const scale = maxWidth / img.width
                canvas.width = maxWidth
                canvas.height = img.height * scale

                const ctx = canvas.getContext('2d')!
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                canvas.toBlob((blob) => {
                    const compressedReader = new FileReader()
                    compressedReader.onloadend = () => {
                        resolve(compressedReader.result as string)
                    }
                    compressedReader.readAsDataURL(blob!)
                }, 'image/jpeg', 0.7)
            }
        }
        reader.readAsDataURL(file)
    })
}

const ImageUploader = ({ open, onClose, userId }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const compressed = await compressImage(file)
            setPreview(compressed)
        }
    }

    const handleUpload = async () => {
        if (!preview) return

        setIsUploading(true)
        try {
            const response = await axios.post('https://www.xhonxyun.site/chat', {
                user_id: userId,
                base64Source: preview.split(',')[1] // 移除 data URL 前缀
            })

            console.log('Upload success:', response.data)
            alert('上传成功！')
            onClose()
        } catch (error) {
            console.error('Upload failed:', error)
            alert('上传失败，请重试')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-xl font-bold">上传收据照片</Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {preview ? (
                            <div className="relative">
                                <img
                                    src={preview}
                                    alt="预览"
                                    className="rounded-lg object-cover w-full h-64"
                                />
                                <button
                                    onClick={() => setPreview(null)}
                                    className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white"
                                >
                                    <XMarkIcon className="w-6 h-6 text-gray-700" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 transition-colors"
                            >
                                <CameraIcon className="w-12 h-12 text-gray-400 mb-4" />
                                <p className="text-gray-600">点击拍照或选择照片</p>
                            </button>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!preview || isUploading}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading ? '上传中...' : '确认上传'}
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}

export default ImageUploader