// src/components/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = 'https://www.xhonxyun.site/receipts/api'

const Login = () => {
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!username.trim()) {
            setError('用户名不能为空')
            return
        }

        try {
            setLoading(true)
            // 这里需要替换为实际的API端点
            const response = await axios.post(`${API_BASE}/login`, {
                username
            })

            if (response.data.success) {
                localStorage.setItem('username', username)
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.response?.data?.message || '登录失败')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <h2>用户登录</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="输入用户名"
                />
                <button type="submit" disabled={loading}>
                    {loading ? '登录中...' : '登录'}
                </button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    )
}

export default Login