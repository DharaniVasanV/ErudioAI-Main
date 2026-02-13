import React from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, BookOpen, BrainCircuit, BarChart2, MessageSquare, LogOut, Bell, FileCheck } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { useApp } from '@/app/context/AppContext';
import { clsx } from 'clsx';
import { toast } from 'sonner';

export const DashboardLayout = () => {
  const { user, logout, notifications } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Timetable', icon: Calendar, path: '/timetable' },
    { name: 'Lessons', icon: BookOpen, path: '/lessons' },
    { name: 'Exams', icon: FileCheck, path: '/exams' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
  ];

  const hasUnread = notifications.some(n => !n.read);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-slate-900 font-sans">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0 z-20 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
            E
          </div>
          <span className="text-xl font-bold text-indigo-900 hidden sm:block">ErudioAI</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full" 
            onClick={() => navigate('/notifications')}
          >
            <Bell size={20} />
            {hasUnread && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-3 cursor-pointer">
                 <div className="text-right hidden md:block">
                   <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                   <p className="text-xs text-gray-500">{user?.level} Student</p>
                 </div>
                 <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold border border-indigo-200 hover:bg-indigo-200 transition-colors">
                   {user?.name?.charAt(0) || 'U'}
                 </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuLabel className="font-normal md:hidden">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.level} Student</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shrink-0 h-full">
          <div className="p-4 flex flex-col gap-1 flex-1 overflow-y-auto">
            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon size={18} />
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
               <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
               >
                 <LogOut size={18} />
                 Sign Out
               </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-4 lg:p-8 pb-24 lg:pb-8">
           <div className="max-w-5xl mx-auto w-full">
             <Outlet />
           </div>
        </main>
      </div>

      {/* Bottom Nav (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center px-2 py-1 h-16 z-30 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex flex-col items-center justify-center p-2 rounded-lg w-full transition-colors",
              isActive 
                ? "text-indigo-600" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="mb-1" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};