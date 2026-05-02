import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {
    const { t } = useTranslation()

    return (
        <footer className="bg-black text-gray-400 text-center py-6 border-t border-orange-500">
            <p>© 2026 RestaurantApp. {t('footer.rights')}</p>
            <Link
                to="/admin/login"
                className="text-gray-800 hover:text-gray-600 text-xs mt-2 block transition select-none"
            >
                {t('navbar.staffAccess')}
            </Link>
        </footer>
    )
}

export default Footer