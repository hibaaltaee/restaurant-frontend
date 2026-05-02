import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
    const { t, i18n } = useTranslation()

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ar' : 'en'
        i18n.changeLanguage(newLang)
       
    }

    return (
        <nav className="bg-black text-white px-8 py-4 flex items-center justify-between border-b border-orange-500">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-orange-500">
                🍕 RestaurantApp
            </Link>

            {/* Links */}
            <div className="flex items-center gap-6">
                <Link to="/" className="hover:text-orange-500 transition">
                    {t('navbar.menu')}
                </Link>

                {/* Language toggle */}
                 <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full transition duration-300 font-bold text-sm shadow-lg shadow-orange-500/20"
>
                  {i18n.language === 'en' ? 'AR' : 'EN'}
                 </button>
            </div>
        </nav>
    )
}

export default Navbar