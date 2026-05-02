import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

const ManageStaff = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [staff, setStaff] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    })

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin/login')
            return
        }
        fetchStaff()
    }, [])

    const fetchStaff = async () => {
        try {
            const res = await API.get('/staff')
            setStaff(res.data)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        try {
            await API.post('/staff', form)
            setSuccess('Staff account created successfully!')
            setForm({ name: '', email: '', password: '' })
            setShowForm(false)
            fetchStaff()
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating staff')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this staff account?')) return
        try {
            await API.delete(`/staff/${id}`)
            fetchStaff()
        } catch (error) {
            setError(error.response?.data?.message || 'Error deleting staff')
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
                        Menu
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

            <div className="p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Manage Staff</h2>
                    <button
                        onClick={() => {
                            setShowForm(!showForm)
                            setError('')
                            setSuccess('')
                        }}
                        className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition font-medium"
                    >
                        {showForm ? 'Cancel' : '+ Add Staff'}
                    </button>
                </div>

                {/* Success message */}
                {success && (
                    <div className="bg-green-900 text-green-400 px-4 py-3 rounded-lg mb-6">
                        {success}
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="bg-red-900 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Add staff form */}
                {showForm && (
                    <div className="bg-gray-800 rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-bold mb-6">New Staff Account</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-400 text-sm block mb-2">Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    required
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Staff name"
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-2">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({...form, email: e.target.value})}
                                    required
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="staff@restaurant.com"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-gray-400 text-sm block mb-2">Password</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={e => setForm({...form, password: e.target.value})}
                                    required
                                    minLength={6}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Min 6 characters"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-lg transition font-medium"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Staff list */}
                <div className="bg-gray-800 rounded-xl overflow-hidden">
                    <div className="bg-gray-700 px-6 py-4">
                        <h3 className="font-bold text-gray-300">
                            All Staff ({staff.length})
                        </h3>
                    </div>
                    {staff.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                            No staff accounts yet
                        </p>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="text-left px-6 py-4 text-gray-300">Name</th>
                                    <th className="text-left px-6 py-4 text-gray-300">Email</th>
                                    <th className="text-left px-6 py-4 text-gray-300">Role</th>
                                    <th className="text-left px-6 py-4 text-gray-300">Joined</th>
                                    <th className="text-left px-6 py-4 text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map((member, index) => (
                                    <tr
                                        key={member.id}
                                        className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {member.name}
                                            {member.id === user.id && (
                                                <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                                                    You
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {member.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-purple-900 text-purple-400 text-xs px-3 py-1 rounded-full">
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {new Date(member.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {member.id !== user.id && (
                                                <button
                                                    onClick={() => handleDelete(member.id)}
                                                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm transition"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageStaff