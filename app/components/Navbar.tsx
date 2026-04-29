import {Link, useLocation} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useState} from "react";

const Navbar = () => {
    const { auth } = usePuterStore();
    const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const isActive = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path === '/applicants' && location.pathname === '/') return true;
        return location.pathname.startsWith(path) && path !== '/';
    };

    return (
        <nav className="flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-3 sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-[0_2px_10px_-2px_rgba(37,99,235,0.4)]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="text-xl font-black text-slate-900 tracking-tighter">Resumind</span>
                </Link>
            </div>
            
            <div className="flex items-center gap-2">
                <Link 
                    to="/" 
                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm transition-all duration-200 ${
                        location.pathname === '/' 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Home
                </Link>
                <Link 
                    to="/" 
                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm transition-all duration-200 ${
                        isActive('/applicants') 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    Applicants
                </Link>
                <Link 
                    to="/settings" 
                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm transition-all duration-200 ${
                        isActive('/settings') 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Settings
                </Link>
            </div>

            <div className="relative">
                <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
                >
                    <img src={`https://ui-avatars.com/api/?name=${auth?.user?.username || 'Alex+Chen'}&background=6366f1&color=fff`} className="w-8 h-8 rounded-full shadow-sm" alt="Avatar" />
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-bold text-slate-900 leading-none">{auth?.user?.username || 'Alex Chen'}</span>
                        <span className="text-[10px] text-slate-400 font-medium mt-0.5">Premium Plan</span>
                    </div>
                    <svg className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>

                {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 animate-in fade-in zoom-in-95 duration-200">
                        <Link 
                            to="/settings#profile-section" 
                            onClick={(e) => {
                                setShowProfileMenu(false);
                                if (location.pathname === '/settings') {
                                    const el = document.getElementById('profile-section');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }
                            }} 
                            className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Profile
                        </Link>
                        <Link 
                            to="/settings#privacy-section" 
                            onClick={(e) => {
                                setShowProfileMenu(false);
                                if (location.pathname === '/settings') {
                                    const el = document.getElementById('privacy-section');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }
                            }} 
                            className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            Privacy
                        </Link>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                        <Link to="/wipe" onClick={() => setShowProfileMenu(false)} className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Sign Out
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}
export default Navbar
