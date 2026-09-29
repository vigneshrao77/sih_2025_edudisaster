import React, { useState } from 'react';
import { AppView, User, UserRole } from '../types';
import { useTranslation } from '../hooks/useTranslation';

// --- SVG Icons for Sidebar ---
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

const viewIcons: { [key in AppView]: React.ReactNode } = {
  [AppView.DASHBOARD]: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  [AppView.EDUCATION]: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
  [AppView.VIRTUAL_DRILL]: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  [AppView.DISASTER_PLANS]: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  [AppView.REGIONAL_HAZARDS]: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  [AppView.RESOURCE_VIDEOS]: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>,
};

interface SidebarProps {
  user: User;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onLogout: () => void;
}

const VIEW_PERMISSIONS: { [key in UserRole]: AppView[] } = {
    [UserRole.STUDENT_PRIMARY]: [AppView.DASHBOARD, AppView.EDUCATION, AppView.VIRTUAL_DRILL, AppView.RESOURCE_VIDEOS],
    [UserRole.STUDENT_SECONDARY]: [AppView.DASHBOARD, AppView.EDUCATION, AppView.VIRTUAL_DRILL, AppView.DISASTER_PLANS, AppView.RESOURCE_VIDEOS, AppView.REGIONAL_HAZARDS],
    [UserRole.STUDENT_COLLEGE]: Object.values(AppView),
    [UserRole.PARENT]: [AppView.DASHBOARD, AppView.EDUCATION, AppView.DISASTER_PLANS, AppView.REGIONAL_HAZARDS, AppView.RESOURCE_VIDEOS],
    [UserRole.ADMIN_TEACHER]: Object.values(AppView),
    [UserRole.GUEST]: [AppView.DASHBOARD, AppView.EDUCATION, AppView.REGIONAL_HAZARDS, AppView.RESOURCE_VIDEOS],
};

const viewTranslationKeys: { [key in AppView]: string } = {
  [AppView.DASHBOARD]: 'sidebar.dashboard',
  [AppView.EDUCATION]: 'sidebar.education',
  [AppView.VIRTUAL_DRILL]: 'sidebar.virtualDrill',
  [AppView.DISASTER_PLANS]: 'sidebar.disasterPlans',
  [AppView.REGIONAL_HAZARDS]: 'sidebar.regionalHazards',
  [AppView.RESOURCE_VIDEOS]: 'sidebar.resourceVideos',
};

const Sidebar: React.FC<SidebarProps> = ({ user, activeView, setActiveView, onLogout }) => {
  const { t, setLanguage, language } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const availableViews = VIEW_PERMISSIONS[user.role] || [];

  return (
    <aside className={`bg-dark-900/95 backdrop-blur-md border-r border-dark-700 flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-20' : 'absolute md:relative w-64'}`}>
      <div className="flex items-center justify-center h-20 border-b border-dark-700 relative">
        <div className={`flex items-center transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
           <ShieldIcon />
           <span className="font-bold text-2xl ml-2 text-light font-mono whitespace-nowrap">{t('sidebar.title')}</span>
        </div>
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-dark-700 text-dark-200 h-6 w-6 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {availableViews.map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left font-semibold transition-all duration-200 group relative ${isCollapsed ? 'justify-center' : ''} ${
              activeView === view
                ? 'bg-primary/20 text-light shadow-md'
                : 'text-dark-300 hover:bg-dark-800 hover:text-light'
            }`}
          >
            {viewIcons[view]}
            {!isCollapsed && <span className="ml-4">{t(viewTranslationKeys[view])}</span>}
            {activeView === view && (
              <div className="absolute left-0 top-0 h-full w-1 bg-secondary rounded-r-full" style={{boxShadow: '0 0 10px #00A4E4'}}></div>
            )}
          </button>
        ))}
      </nav>

      <div className={`px-4 py-6 border-t border-dark-700 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="mb-4">
            <div className="flex justify-center space-x-2">
                <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-sm rounded-md font-mono ${language === 'en' ? 'bg-secondary text-white' : 'bg-dark-700 text-dark-300'}`}
                >
                    EN
                </button>
                <button
                    onClick={() => setLanguage('hi')}
                    className={`px-3 py-1 text-sm rounded-md font-mono ${language === 'hi' ? 'bg-secondary text-white' : 'bg-dark-700 text-dark-300'}`}
                >
                    HI
                </button>
            </div>
        </div>
        <div className="text-center mb-4">
            <p className="font-semibold text-light truncate">{user.username}</p>
            <p className="text-xs text-dark-400 truncate">{user.role}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold text-danger bg-danger/10 hover:bg-danger/20 transition-colors duration-200 font-mono"
        >
          <LogoutIcon />
          <span className="ml-2 whitespace-nowrap">{user.role === UserRole.GUEST ? t('sidebar.exitGuest') : t('sidebar.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
