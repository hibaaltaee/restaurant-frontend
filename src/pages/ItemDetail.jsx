import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../api/axios'

const ItemDetail = () => {
    const { id } = useParams()
    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await API.get(`/menu/${id}`)
                setItem(res.data)
            } catch (error) {
                console.error('Error fetching item:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchItem()
    }, [id])

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="text-orange-500 text-xl">Loading...</div>
        </div>
    )

    if (!item) return (
        <div className="text-center mt-20">
            <p className="text-white text-xl">Item not found</p>
            <Link to="/" className="text-orange-500 hover:underline mt-4 block">
                Back to menu
            </Link>
        </div>
    )

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back button */}
            <Link
                to="/"
                className="text-orange-500 hover:underline mb-6 block"
            >
                ← Back to menu
            </Link>

            {/* Item card */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
                {/* Image */}
                <div className="h-72 bg-gray-700 flex items-center justify-center">
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-9xl">🍽️</span>
                    )}
                </div>

                {/* Details */}
                <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold text-white">
                            {item.name}
                        </h1>
                        <span className="text-3xl font-bold text-orange-500">
                            ${item.price}
                        </span>
                    </div>

                    <span className="bg-gray-700 text-orange-400 text-sm px-4 py-1 rounded-full">
                        {item.category}
                    </span>

                    <p className="text-gray-400 mt-6 text-lg leading-relaxed">
                        {item.description}
                    </p>

                    {!item.available && (
                        <div className="mt-6 bg-red-900 text-red-400 px-4 py-3 rounded-lg">
                            This item is currently unavailable
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ItemDetail