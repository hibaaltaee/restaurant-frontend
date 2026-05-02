import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

const Dashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        totalItems: 0,
        totalCategories: 0,
        unavailableItems: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin/login')
            return
        }

        const fetchStats = async () => {
            try {
                const [menuRes, catRes] = await Promise.all([
                    API.get('/menu'),
                    API.get('/categories')
                ])

                const unavailable = menuRes.data.filter(
                    item => !item.available
                ).length

                setStats({
                    totalItems: menuRes.data.length,
                    totalCategories: catRes.data.length,
                    unavailableItems: unavailable
                })
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/admin/login')
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-orange-500 text-xl">Loading...</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-900 text-white">

            {/* Admin Navbar */}
            <nav className="bg-black px-8 py-4 flex items-center justify-between border-b border-orange-500">
                <h1 className="text-xl font-bold text-orange-500">
                    🍕 Admin Panel
                </h1>
                <div className="flex items-center gap-6">
                    <Link
                        to="/admin/menu"
                        className="hover:text-orange-500 transition"
                    >
                        Manage Menu
                    </Link>
                    <Link
                        to="/admin/categories"
                        className="hover:text-orange-500 transition"
                    >
                        Categories
                    </Link>
                    <Link
                        to="/"
                        className="hover:text-orange-500 transition"
                    >
                        View Menu
                    </Link>
                    <Link to="/admin/staff" className="hover:text-orange-500 transition">
                       Staff
                    </Link>
                    
                    <button
                        onClick={handleLogout}
                        className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Content */}
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-2">
                    Welcome, {user?.name}! 👋
                </h2>
                <p className="text-gray-400 mb-8">
                    Here's an overview of your restaurant menu
                </p>

                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-orange-500">
                        <p className="text-gray-400 text-sm mb-1">
                            Total Menu Items
                        </p>
                        <p className="text-4xl font-bold text-white">
                            {stats.totalItems}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-blue-500">
                        <p className="text-gray-400 text-sm mb-1">
                            Total Categories
                        </p>
                        <p className="text-4xl font-bold text-white">
                            {stats.totalCategories}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-red-500">
                        <p className="text-gray-400 text-sm mb-1">
                            Unavailable Items
                        </p>
                        <p className="text-4xl font-bold text-white">
                            {stats.unavailableItems}
                        </p>
                    </div>
                </div>

                {/* Quick actions */}
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        to="/admin/menu"
                        className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition flex items-center gap-4"
                    >
                        <span className="text-4xl">🍽️</span>
                        <div>
                            <p className="font-bold text-lg">Manage Menu</p>
                            <p className="text-gray-400 text-sm">
                                Add, edit or delete menu items
                            </p>
                        </div>
                    </Link>
                    <Link
                        to="/admin/categories"
                        className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 transition flex items-center gap-4"
                    >
                        <span className="text-4xl">📂</span>
                        <div>
                            <p className="font-bold text-lg">
                                Manage Categories
                            </p>
                            <p className="text-gray-400 text-sm">
                                Add or delete categories
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Dashboard