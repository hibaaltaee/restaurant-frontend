import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="bg-black text-gray-400 text-center py-6 border-t border-orange-500">
            <p>© 2026 RestaurantApp. All rights reserved.</p>
            <Link
                to="/admin/login"
                className="text-gray-800 hover:text-gray-600 text-xs mt-2 block transition select-none"
            >
                Staff Access
            </Link>
        </footer>
    )
}

export default Footer