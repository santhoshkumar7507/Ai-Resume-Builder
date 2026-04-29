import Navbar from "~/components/Navbar";
import {usePuterStore} from "~/lib/puter";
import {useState, useEffect} from "react";

export const SettingsContent = () => {
    const { auth } = usePuterStore();
    const [theme, setTheme] = useState(
        typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? "Dark" : "Light"
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    useEffect(() => {
        if (theme === "Dark") {
            document.documentElement.classList.add("dark");
        } else if (theme === "Light") {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    const [isPremium, setIsPremium] = useState(false);
    const [showPremiumSuccess, setShowPremiumSuccess] = useState(false);

    const handleUpgrade = () => {
        setIsProcessingPayment(true);
        // Simulate a smooth payment gateway integration internally to avoid broken external links
        setTimeout(() => {
            setIsProcessingPayment(false);
            setIsPremium(true);
            setShowPremiumSuccess(true);
            setTimeout(() => setShowPremiumSuccess(false), 5000); // Hide success message after 5 seconds
        }, 2000);
    };

    const SettingCard = ({ title, icon, children, description }: any) => (
        <div className="bg-white dark:bg-[#0f172a] rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] dark:hover:border-slate-700 transition-all duration-500 group">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 transition-all duration-500 shadow-inner dark:shadow-none">
                    {icon}
                </div>
                <div>
                    <h3 className="font-black text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>
                    {description && <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">{description}</p>}
                </div>
            </div>
            {children}
        </div>
    );

    return (
        <main className="relative bg-[#f8fafc] dark:bg-[#020617] min-h-screen pb-32 transition-colors duration-500">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/80 dark:from-blue-900/10 to-transparent pointer-events-none transition-colors duration-500"></div>
            <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-blue-400/10 dark:bg-blue-500/5 blur-[100px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-400/5 dark:bg-indigo-500/5 blur-[100px] rounded-full animate-pulse delay-1000"></div>
            
            <Navbar />

            <section className="relative z-10 pt-16 px-8">
                <div className="max-w-5xl mx-auto" id="profile-section">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-5xl font-black tracking-tight mb-3 text-slate-900 dark:text-white bg-none [-webkit-text-fill-color:initial]">Preferences</h1>
                            <p className="text-slate-500 dark:text-slate-400 font-semibold max-w-lg text-lg leading-relaxed">Customize your <span className="text-blue-600 dark:text-blue-400 font-black">Resumind</span> experience. All changes are synced across your devices.</p>
                        </div>
                        <button 
                            onClick={handleSave}
                            className={`px-8 py-4 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 flex items-center gap-2 ${isSaving ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 shadow-slate-200 dark:shadow-blue-900/20"}`}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Syncing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                    Save Preferences
                                </>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Appearance Card */}
                        <SettingCard 
                            title="Appearance" 
                            description="Visual Experience"
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                        >
                            <div className="grid grid-cols-3 gap-3">
                                {["Light", "Dark", "System"].map(mode => (
                                    <button 
                                        key={mode}
                                        onClick={() => setTheme(mode)}
                                        className={`py-3 rounded-xl border-2 font-black text-xs transition-all ${theme === mode ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 dark:border-blue-500" : "border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-700 dark:hover:text-slate-300"}`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div>
                                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-200">Reduced Motion</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Disable animations</p>
                                </div>
                                <button className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full relative transition-colors">
                                    <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all"></div>
                                </button>
                            </div>
                        </SettingCard>

                        {/* Analysis Card */}
                        <SettingCard 
                            title="Analysis Engine" 
                            description="AI Performance"
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        >
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-xs font-black text-slate-900 dark:text-slate-200">AI Intelligence</h4>
                                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">Advanced</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 dark:bg-blue-500 w-3/4"></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs font-black text-slate-600 dark:text-slate-400">Strict ATS Parsing</span>
                                    <button className="w-12 h-6 bg-blue-600 dark:bg-blue-500 rounded-full relative transition-colors">
                                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                                    </button>
                                </div>
                            </div>
                        </SettingCard>

                        {/* Notification Card */}
                        <SettingCard 
                            title="Notifications" 
                            description="Stay Updated"
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Weekly Performance Report</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Interview Reminders</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">New Beta Features</span>
                                </div>
                            </div>
                        </SettingCard>

                        {/* Data Card */}
                        <div id="privacy-section">
                            <SettingCard 
                                title="Privacy & Data" 

                            description="Account Security"
                            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-slate-600 dark:text-slate-300">Public Profile</span>
                                    <button className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative transition-colors">
                                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                                    </button>
                                </div>
                                <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700">
                                    Export My Data
                                </button>
                                <button className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-xs font-black rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/30">
                                    Wipe All Analysis
                                </button>
                            </div>
                        </SettingCard>
                        </div>
                    </div>

                    {isPremium ? (
                        <div className="mt-20 p-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[40px] text-white relative overflow-hidden group shadow-2xl shadow-emerald-500/30 dark:shadow-none">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-3xl font-black tracking-tight">Pro Plan Active</h2>
                                        <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm">LIFETIME</span>
                                    </div>
                                    <p className="text-emerald-50 font-bold max-w-md">You have unlocked unlimited AI analysis, specialized models, and bulk exports.</p>
                                </div>
                                <div className="px-8 py-4 bg-white/10 border border-white/20 rounded-[24px] font-black text-sm backdrop-blur-md flex items-center gap-3">
                                    <svg className="w-6 h-6 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                    Premium Features Enabled
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-20 p-10 bg-slate-900 dark:bg-[#0f172a] rounded-[40px] text-white relative overflow-hidden group shadow-2xl shadow-blue-100/50 dark:shadow-none dark:border dark:border-slate-800">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 dark:bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight mb-2">Ready to level up?</h2>
                                    <p className="text-slate-400 font-bold max-w-md">Unlock specialized AI models and unlimited analysis reports with our Premium plan.</p>
                                </div>
                                <button 
                                    onClick={handleUpgrade}
                                    disabled={isProcessingPayment}
                                    className="px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black text-sm hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-xl shadow-blue-900/40 dark:shadow-none active:scale-95 flex items-center gap-2"
                                >
                                    {isProcessingPayment ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Secure Checkout...
                                        </>
                                    ) : (
                                        "Upgrade to Premium"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Impressive Success Overlay Modal */}
            {showPremiumSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500"></div>
                    <div className="relative z-10 bg-white dark:bg-slate-900 rounded-[40px] p-12 max-w-lg w-full mx-4 shadow-[0_0_100px_rgba(16,185,129,0.3)] animate-in zoom-in-95 fade-in duration-500 flex flex-col items-center text-center border border-slate-100 dark:border-slate-800">
                        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-8 relative">
                            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                            <svg className="w-12 h-12 text-emerald-500 animate-in zoom-in duration-500 delay-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Payment Successful!</h2>
                        <p className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-8">
                            Welcome to <span className="text-emerald-500 font-black">Resumind PRO</span>. Your account has been instantly upgraded. Enjoy unlimited AI power!
                        </p>
                        <button onClick={() => setShowPremiumSuccess(false)} className="w-full py-4 bg-slate-900 dark:bg-emerald-500 text-white rounded-2xl font-black shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                            Start Exploring Pro
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}
