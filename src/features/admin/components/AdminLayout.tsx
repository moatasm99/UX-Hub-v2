import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Map, Settings, LogOut, Menu, X, MessageSquare, Lightbulb, ChevronDown, ChevronRight, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function AdminLayout() {
    const { logout, user } = useAdminAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCommunityOpen, setIsCommunityOpen] = useState(location.pathname.includes('/admin/community'));

    // Sync menu state with location
    useEffect(() => {
        if (location.pathname.includes('/admin/community')) {
            setIsCommunityOpen(true);
        }
    }, [location.pathname]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', end: true },
        { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
        { icon: Map, label: 'Roadmap', path: '/admin/roadmap' },
    ];

    const communityItems = [
        { icon: MessageSquare, label: 'Feedback', path: '/admin/community/feedback' },
        { icon: Lightbulb, label: 'Suggestions', path: '/admin/community/suggestions' },
        { icon: BookOpen, label: 'Resources', path: '/admin/community/resources' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
            {/* Mobile Header */}
            <div className="lg:hidden p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
                <span className="font-bold text-white">UX Hub Admin</span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={isMobileMenuOpen ? 'Close sidebar menu' : 'Open sidebar menu'}
                    aria-expanded={isMobileMenuOpen}
                >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className={`
                    fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="flex flex-col h-full">
                        {/* Sidebar Header */}
                        <div className="p-6 border-b border-slate-800">
                            <h1 className="text-xl font-bold text-white tracking-tight">UX Design Hub</h1>
                            <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Admin Portal</span>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto" aria-label="Admin navigation">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.end}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                        ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }
                                    `}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </NavLink>
                            ))}

                            {/* Community Group */}
                            <div className="pt-2">
                                <button
                                    onClick={() => setIsCommunityOpen(!isCommunityOpen)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                        ${location.pathname.includes('/admin/community')
                                            ? 'text-white bg-slate-800/50'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Share2 className="w-4 h-4" />
                                        <span>Community</span>
                                    </div>
                                    {isCommunityOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                </button>

                                {isCommunityOpen && (
                                    <div className="mt-1 ml-4 border-l-2 border-slate-800 pl-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                        {communityItems.map((item) => (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={({ isActive }) => `
                                                    flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                                                    ${isActive
                                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                                    }
                                                `}
                                            >
                                                <item.icon className="w-3.5 h-3.5" />
                                                {item.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <NavLink
                                to="/admin/settings"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mt-2
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }
                                `}
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </NavLink>
                        </nav>

                        {/* User Profile & Logout */}
                        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold ring-2 ring-blue-500/10">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">Admin</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-slate-700 rounded-lg text-sm font-medium transition-all duration-200 text-slate-300 focus-visible:ring-2 focus-visible:ring-red-500"
                                aria-label="Sign out of admin"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-slate-950 relative w-full">
                    {/* Overlay for mobile sidebar */}
                    {isMobileMenuOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    )}

                    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
