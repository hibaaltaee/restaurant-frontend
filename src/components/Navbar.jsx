import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="bg-black text-white px-8 py-4 flex items-center justify-between border-b border-orange-500">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-orange-500">
                🍕 RestaurantApp
            </Link>

            {/* Links */}
            <div className="flex items-center gap-6">
                <Link to="/" className="hover:text-orange-500 transition">
                    Menu
                </Link>
            </div>
        </nav>
    )
}

export default Navbar