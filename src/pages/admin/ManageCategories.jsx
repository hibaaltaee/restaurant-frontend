import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

const ManageCategories = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [newCategory, setNewCategory] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin/login')
            return
        }
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await API.get('/categories')
            setCategories(res.data)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await API.post('/categories', { name: newCategory })
            setNewCategory('')
            fetchCategories()
        } catch (error) {
            setError('Category already exists or invalid name')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return
        try {
            await API.delete(`/categories/${id}`)
            fetchCategories()
        } catch (error) {
            setError('Cannot delete category with menu items')
        }
    }

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
                    <Link to="/admin" className="hover:text-orange-500 transition">
                        Dashboard
                    </Link>
                    <Link to="/admin/menu" className="hover:text-orange-500 transition">
                        Manage Menu
                    </Link>
                    <Link to="/" className="hover:text-orange-500 transition">
                        View Menu
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="p-8 max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Manage Categories</h2>

                {/* Add category form */}
                <div className="bg-gray-800 rounded-xl p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">Add New Category</h3>

                    {error && (
                        <div className="bg-red-900 text-red-400 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAdd} className="flex gap-4">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            required
                            className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g. Desserts"
                        />
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg transition font-medium"
                        >
                            Add
                        </button>
                    </form>
                </div>

                {/* Categories list */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                    <div className="bg-gray-700 px-6 py-4">
                        <h3 className="font-bold text-gray-300">
                            All Categories ({categories.length})
                        </h3>
                    </div>
                    {categories.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                            No categories yet
                        </p>
                    ) : (
                        <ul>
                            {categories.map((cat, index) => (
                                <li
                                    key={cat.id}
                                    className={`flex items-center justify-between px-6 py-4 ${
                                        index !== categories.length - 1
                                            ? 'border-b border-gray-700'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📂</span>
                                        <span className="font-medium">
                                            {cat.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageCategories