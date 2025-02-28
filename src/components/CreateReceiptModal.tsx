import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    category: string
    total: number
  }) => void
}

const CreateReceiptModal = ({ open, onClose, onSubmit }: Props) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    onSubmit({
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      total: parseFloat(formData.get('total') as number)
    })
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">新建发票</Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                发票名称
              </label>
              <input
                name="name"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                分类
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-2 border rounded-lg bg-white"
              >
                <option value="餐饮">餐饮</option>
                <option value="交通">交通</option>
                <option value="办公">办公</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                总金额
              </label>
              <input
                type="number"
                step="0.01"
                name="total"
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                创建
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default CreateReceiptModal