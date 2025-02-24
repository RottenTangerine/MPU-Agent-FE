import { useState, useRef } from 'react';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { uploadImage } from '../api';

interface ImageUploaderProps {
    userId: string;
}

export const ImageUploader = ({ userId }: ImageUploaderProps) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        try {
            setStatus('uploading');
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64 = reader.result?.toString().split(',')[1] || '';
                await uploadImage(userId, base64);
                setPreview(URL.createObjectURL(file));
                setStatus('idle');
            };

            reader.readAsDataURL(file);
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <div className="relative group">
            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                className="hidden"
                disabled={status === 'uploading'}
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                className="relative w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50"
                disabled={status === 'uploading'}
            >
                {/* 状态指示 */}
                {status === 'uploading' && (
                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                    </div>
                )}

                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full rounded-full object-cover border-2 border-white"
                        />
                        <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 hover:bg-red-600 cursor-pointer"
                             onClick={(e) => {
                                 e.stopPropagation();
                                 setPreview(null);
                             }}>
                            <XMarkIcon className="w-4 h-4 text-white" />
                        </div>
                    </>
                ) : (
                    <CameraIcon className="w-8 h-8 text-white transform transition-transform group-hover:scale-110" />
                )}
            </button>

            {status === 'error' && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-red-500 text-sm whitespace-nowrap">
                    上传失败，请重试
                </div>
            )}
        </div>
    );
};