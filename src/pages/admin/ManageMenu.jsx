import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

const ManageMenu = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [menuItems, setMenuItems] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category_id: '',
        available: true
    })

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin/login')
            return
        }
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [menuRes, catRes] = await Promise.all([
                API.get('/menu'),
                API.get('/categories')
            ])
            setMenuItems(menuRes.data)
            setCategories(catRes.data)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingItem) {
                await API.put(`/menu/${editingItem.id}`, {
                    ...form,
                    price: parseFloat(form.price),
                    category_id: parseInt(form.category_id)
                })
            } else {
                await API.post('/menu', {
                    ...form,
                    price: parseFloat(form.price),
                    category_id: parseInt(form.category_id)
                })
            }
            setShowForm(false)
            setEditingItem(null)
            setForm({
                name: '', description: '',
                price: '', image: '',
                category_id: '', available: true
            })
            fetchData()
        } catch (error) {
            console.error('Error saving item:', error)
        }
    }

    const handleEdit = (item) => {
        const category = categories.find(c => c.name === item.category)
        setEditingItem(item)
        setForm({
            name: item.name,
            description: item.description || '',
            price: item.price,
            image: item.image || '',
            category_id: category ? category.id : '',
            available: item.available
        })
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return
        try {
            await API.delete(`/menu/${id}`)
            fetchData()
        } catch (error) {
            console.error('Error deleting item:', error)
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
                    <Link to="/admin/categories" className="hover:text-orange-500 transition">
                        Categories
                    </Link>
                    <Link to="/" className="hover:text-orange-500 transition">
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

            <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Manage Menu</h2>
                    <button
                        onClick={() => {
                            setShowForm(!showForm)
                            setEditingItem(null)
                            setForm({
                                name: '', description: '',
                                price: '', image: '',
                                category_id: '', available: true
                            })
                        }}
                        className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition font-medium"
                    >
                        {showForm ? 'Cancel' : '+ Add Item'}
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-gray-800 rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-bold mb-6">
                            {editingItem ? 'Edit Item' : 'Add New Item'}
                        </h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-400 text-sm block mb-2">Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    required
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Classic Burger"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={e => setForm({...form, price: e.target.value})}
                                    required
                                    step="0.01"
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="9.99"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-2">Category</label>
                                <select
                                    value={form.category_id}
                                    onChange={e => setForm({...form, category_id: e.target.value})}
                                    required
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={form.image}
                                    onChange={e => setForm({...form, image: e.target.value})}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-gray-400 text-sm block mb-2">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    rows={3}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Describe the item..."
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="available"
                                    checked={form.available}
                                    onChange={e => setForm({...form, available: e.target.checked})}
                                    className="w-5 h-5 accent-orange-500"
                                />
                                <label htmlFor="available" className="text-gray-300">
                                    Available
                                </label>
                            </div>
                            <div className="sm:col-span-2 flex gap-4">
                                <button
                                    type="submit"
                                    className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-lg transition font-medium"
                                >
                                    {editingItem ? 'Update Item' : 'Add Item'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg transition font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Menu items table */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="text-left px-6 py-4 text-gray-300">Item</th>
                                <th className="text-left px-6 py-4 text-gray-300">Category</th>
                                <th className="text-left px-6 py-4 text-gray-300">Price</th>
                                <th className="text-left px-6 py-4 text-gray-300">Status</th>
                                <th className="text-left px-6 py-4 text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuItems.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                                                ) : (
                                                    <span>🍽️</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-gray-400 text-sm truncate max-w-xs">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-700 text-orange-400 text-xs px-3 py-1 rounded-full">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-orange-500 font-bold">
                                        ${item.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.available ? (
                                            <span className="bg-green-900 text-green-400 text-xs px-3 py-1 rounded-full">
                                                Available
                                            </span>
                                        ) : (
                                            <span className="bg-red-900 text-red-400 text-xs px-3 py-1 rounded-full">
                                                Unavailable
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ManageMenu