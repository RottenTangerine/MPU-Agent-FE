// src/App.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom'

const App: React.FC = () => {
    const navigate = useNavigate()
    const username = localStorage.getItem('username')

    const handleLogout = () => {
        localStorage.removeItem('username')
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 导航栏 */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="text-xl font-bold text-blue-600">
                            发票管理系统
                        </Link>

                        {username && (
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600">欢迎，{username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                                >
                                    退出登录
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* 主内容区域 */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    )
}

export default App