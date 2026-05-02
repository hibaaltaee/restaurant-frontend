import { useState, useEffect } from 'react'
import API from '../api/axios'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Home = () => {
    const { t } = useTranslation()
    const [menuItems, setMenuItems] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [menuRes, catRes] = await Promise.all([
                    API.get('/menu'),
                    API.get('/categories')
                ])
                setMenuItems(menuRes.data)
                setCategories(catRes.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const filteredItems = selectedCategory
        ? menuItems.filter(item => item.category === selectedCategory)
        : menuItems

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="text-orange-500 text-xl">{t('home.loading')}</div>
        </div>
    )

    return (
        <div>
            {/* Hero */}
            <div className="text-center py-12">
                <h1 className="text-5xl font-bold text-orange-500 mb-4">
                    {t('home.title')} 🍕
                </h1>
                <p className="text-gray-400 text-lg">
                    {t('home.subtitle')}
                </p>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-3 justify-center mb-10">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-6 py-2 rounded-full font-medium transition ${
                        selectedCategory === null
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    {t('home.all')}
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-6 py-2 rounded-full font-medium transition ${
                            selectedCategory === cat.name
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Menu items grid */}
            {filteredItems.length === 0 ? (
                <p className="text-center text-gray-400 text-lg">
                    {t('home.noItems')}
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <Link
                            to={`/item/${item.id}`}
                            key={item.id}
                            className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition duration-300 cursor-pointer"
                        >
                            {/* Image */}
                            <div className="h-48 bg-gray-700 flex items-center justify-center">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-6xl">🍽️</span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-white font-bold text-lg">
                                        {item.name}
                                    </h3>
                                    <span className="text-orange-500 font-bold text-lg">
                                        ${item.price}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-3">
                                    {item.description}
                                </p>
                                <span className="bg-gray-700 text-orange-400 text-xs px-3 py-1 rounded-full">
                                    {item.category}
                                </span>
                                {!item.available && (
                                    <span className="ml-2 bg-red-900 text-red-400 text-xs px-3 py-1 rounded-full">
                                        {t('itemDetail.unavailable')}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home