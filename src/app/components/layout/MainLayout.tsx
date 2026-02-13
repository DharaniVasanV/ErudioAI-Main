import React from 'react';
import { useAppStore } from '../../store';
import { Brain, LayoutGrid, Calendar, BookOpen, PenTool, BarChart2, Bell, User, LogOut, Menu } from 'lucide-react';
import { Button, cn } from '../ui/Base';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, navigate, currentView, logout, notifications } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isAuthScreen = ['Landing', 'Login', 'Signup'].includes(currentView);

  if (isAuthScreen) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 flex items-center justify-between px-4 md:px-8">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('Landing')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">ErudioAI</span>
          </div>
          
          <div className="flex items-center gap-3">
            {currentView === 'Landing' && (
              <>
                <Button variant="ghost" onClick={() => navigate('Login')}>Log in</Button>
                <Button onClick={() => navigate('Signup')}>Sign up</Button>
              </>
            )}
          </div>
        </nav>
        <div className="pt-16 min-h-screen">
          {children}
        </div>
      </div>
    );
  }

  // Authenticated Layout
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20 md:pb-0 md:pl-64">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 md:left-64 z-40 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
        <div className="md:hidden flex items-center gap-2">
           <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Brain size={20} />
            </div>
            <span className="font-bold text-lg">ErudioAI</span>
        </div>
        <div className="hidden md:flex items-center text-gray-500 text-sm">
          {/* Breadcrumbs or Page Title could go here */}
          <span className="font-medium text-gray-800">{currentView.replace(/([A-Z])/g, ' $1').trim()}</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full" onClick={() => navigate('Notifications')}>
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            )}
          </button>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-full pr-3 border border-gray-100">
            <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full bg-indigo-100" />
            <span className="hidden md:block text-sm font-medium">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white mr-2">
            <Brain size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">ErudioAI</span>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <NavDir currentView={currentView} navigate={navigate} />
        </div>

        <div className="p-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700" onClick={logout}>
            <LogOut size={18} className="mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 p-4 md:p-8 max-w-6xl mx-auto min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex items-center justify-around h-16">
          <MobileNavItem icon={LayoutGrid} label="Home" active={currentView === 'Dashboard'} onClick={() => navigate('Dashboard')} />
          <MobileNavItem icon={Calendar} label="Timetable" active={currentView === 'Timetable'} onClick={() => navigate('Timetable')} />
          <MobileNavItem icon={BookOpen} label="Lessons" active={currentView === 'Lessons' || currentView === 'TopicDetail'} onClick={() => navigate('Lessons')} />
          <MobileNavItem icon={PenTool} label="Quiz" active={currentView === 'Quiz'} onClick={() => navigate('Quiz')} />
          <MobileNavItem icon={BarChart2} label="Analytics" active={currentView === 'Analytics'} onClick={() => navigate('Analytics')} />
        </div>
      </nav>
    </div>
  );
};

const NavDir = ({ currentView, navigate }: { currentView: string, navigate: any }) => {
  const items = [
    { id: 'Dashboard', label: 'Home', icon: LayoutGrid },
    { id: 'Timetable', label: 'Timetable', icon: Calendar },
    { id: 'Lessons', label: 'Lessons', icon: BookOpen },
    { id: 'Quiz', label: 'Quiz', icon: PenTool },
    { id: 'Analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'History', label: 'History', icon: User }, // Using User icon for History/Profile related
  ];

  return (
    <>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => navigate(item.id)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            (currentView === item.id || (item.id === 'Lessons' && currentView === 'TopicDetail'))
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <item.icon size={20} />
          {item.label}
        </button>
      ))}
    </>
  );
};

const MobileNavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center w-full h-full space-y-1",
      active ? "text-indigo-600" : "text-gray-500"
    )}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);