import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Card from './shared/Card';
import { User, UserRole, AppView } from '../types';
import { apiService } from '../services/apiService';
import { useTranslation } from '../hooks/useTranslation';

interface DashboardProps {
  currentUser: User;
  setActiveView: (view: AppView) => void;
}

interface AdminDashboardData {
    preparednessScore: number;
    studentsTrained: number;
    drillsCompleted: number;
    participationByGrade: { name: string; participation: number }[];
    preparednessByDisaster: { subject: string; score: number; fullMark: number }[];
}

interface Contact {
    name: string;
    number: string;
}


// --- EMERGENCY NUMBERS COMPONENT ---
const EmergencyNumbers: React.FC = () => {
    const { t } = useTranslation();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await apiService.getEmergencyContacts();
                setContacts(data);
            } catch (err) {
                console.error("Failed to load contacts for dashboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;

    return (
        <Card className="!border-danger/50">
            <h3 className="text-xl font-bold mb-4 text-secondary">{t('dashboard.emergencyNumbersTitle')}</h3>
            {loading ? <p className="animate-pulse">Loading contacts...</p> : (
                <div className="space-y-3">
                    {contacts.map(contact => (
                        <div key={contact.name} className="flex items-center justify-between p-2 bg-dark-900/50 rounded-md">
                            <span className="font-semibold text-dark-200">{contact.name}</span>
                            <a href={`tel:${contact.number.replace(/\s/g, '')}`} className="flex items-center text-danger font-bold hover:underline">
                                <PhoneIcon />
                                {contact.number}
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};
// --- END EMERGENCY NUMBERS ---

// --- ADMIN DASHBOARD ---
const AdminDashboard: React.FC = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<AdminDashboardData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashboardData = await apiService.getDashboardData();
                setData(dashboardData);
            } catch (err) {
                console.error("Failed to load admin dashboard data", err);
            }
        };
        fetchData();
    }, []);

    if (!data) return <p className="animate-pulse">Loading dashboard telemetry...</p>;
    
    const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode }> = ({ title, value, icon }) => (
        <Card className="flex items-center !bg-dark-800/80">
            <div className="p-3 bg-secondary/10 text-secondary rounded-full">{icon}</div>
            <div className="ml-4">
                <p className="text-3xl font-bold text-dark-100">{value}</p>
                <p className="text-sm text-dark-400">{title}</p>
            </div>
        </Card>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-light">&gt; {t('dashboard.adminTitle')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title={t('dashboard.statPreparedness')} value={`${data.preparednessScore}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>} />
                <StatCard title={t('dashboard.statStudentsTrained')} value={data.studentsTrained.toLocaleString()} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>} />
                <StatCard title={t('dashboard.statDrillsCompleted')} value={data.drillsCompleted} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-bold mb-4 text-secondary">{t('dashboard.chartParticipationTitle')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.participationByGrade} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                            <XAxis dataKey="name" stroke="#5C6B73" tick={{ fontFamily: 'sans-serif' }}/>
                            <YAxis stroke="#5C6B73" tick={{ fontFamily: 'sans-serif' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E2DC', fontFamily: 'sans-serif', color: '#172B3A' }} cursor={{fill: 'rgba(52, 118, 90, 0.1)'}}/>
                            <Legend wrapperStyle={{fontFamily: 'sans-serif'}}/>
                            <Bar dataKey="participation" fill="#34765A" name={t('dashboard.chartParticipationYAxis')} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h3 className="text-xl font-bold mb-4 text-secondary">{t('dashboard.chartPreparednessTitle')}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.preparednessByDisaster}>
                             <PolarGrid stroke="rgba(0, 0, 0, 0.1)" />
                            <PolarAngleAxis dataKey="subject" stroke="#5C6B73" tick={{ fontFamily: 'sans-serif' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(0, 0, 0, 0.1)" />
                            <Radar name="Score" dataKey="score" stroke="#E6A23C" fill="#E6A23C" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}
// --- END ADMIN DASHBOARD ---

// --- STUDENT JUNIOR DASHBOARD ---
const StudentJuniorDashboard: React.FC<DashboardProps> = ({ currentUser, setActiveView }) => {
    const { t } = useTranslation();
    
    const ActionCard: React.FC<{ title: string; desc: string; onClick: () => void; icon: React.ReactNode; color: string }> = ({ title, desc, onClick, icon, color }) => (
        <button onClick={onClick} className="w-full text-left">
            <Card className={`group hover:!shadow-lg hover:-translate-y-1 transition-all duration-300 ring-1 ring-dark-700 hover:ring-${color.replace('border-', '')} border-0`}>
                <div className="flex items-center">
                    <div className={`text-3xl p-3 bg-dark-800 rounded-lg text-${color.replace('border-', '')} bg-opacity-20`}>{icon}</div>
                    <div className="ml-4">
                        <h3 className={`font-bold text-lg text-dark-100 group-hover:text-${color.replace('border-', '')} transition-colors`}>{title}</h3>
                        <p className="text-sm text-dark-400 mt-1">{desc}</p>
                    </div>
                </div>
            </Card>
        </button>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-light">{t('dashboard.studentJuniorWelcome', { name: currentUser.username })}</h1>
            <p className="text-lg text-dark-300">{t('dashboard.studentJuniorSubtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard 
                    title={t('dashboard.studentJuniorLearnTitle')} 
                    desc={t('dashboard.studentJuniorLearnDesc')} 
                    onClick={() => setActiveView(AppView.EDUCATION)} 
                    icon={'📚'}
                    color="border-secondary"
                />
                <ActionCard 
                    title={t('dashboard.studentJuniorDrillTitle')} 
                    desc={t('dashboard.studentJuniorDrillDesc')} 
                    onClick={() => setActiveView(AppView.VIRTUAL_DRILL)} 
                    icon={'🎮'}
                    color="border-accent"
                />
                 <ActionCard 
                    title={t('dashboard.studentJuniorVideosTitle')} 
                    desc={t('dashboard.studentJuniorVideosDesc')} 
                    onClick={() => setActiveView(AppView.RESOURCE_VIDEOS)} 
                    icon={'🎬'}
                    color="border-danger"
                />
            </div>
            <EmergencyNumbers />
        </div>
    );
};
// --- END STUDENT JUNIOR DASHBOARD ---

// --- GENERIC DASHBOARD (Secondary Student, College, Parent) ---
const GenericDashboard: React.FC<DashboardProps> = ({ currentUser, setActiveView }) => {
    const { t } = useTranslation();

    const QuickLink: React.FC<{ text: string, onClick: () => void, icon: React.ReactNode }> = ({ text, onClick, icon }) => (
        <button onClick={onClick} className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg hover:bg-primary/20 hover:text-light w-full transition-colors group border border-transparent hover:border-primary/30">
            <span className="text-secondary group-hover:text-primary transition-colors">{icon}</span>
            <span className="font-semibold">{text}</span>
        </button>
    );

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold text-light">{t('dashboard.genericWelcome', { name: currentUser.username })}</h1>
                <p className="text-lg text-dark-300 mt-1">{t('dashboard.genericSubtitle', { role: currentUser.role })}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex items-center">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-full text-2xl">💡</div>
                    <div className="ml-4">
                        <p className="text-3xl font-bold text-dark-100">4/4</p>
                        <p className="text-sm text-dark-400">{t('dashboard.genericModulesCompleted')}</p>
                    </div>
                </Card>
                 <Card className="flex items-center">
                    <div className="p-3 bg-accent/10 text-accent rounded-full text-2xl">🎯</div>
                    <div className="ml-4">
                        <p className="text-3xl font-bold text-dark-100">3/3</p>
                        <p className="text-sm text-dark-400">{t('dashboard.genericLastDrillScore')}</p>
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-bold mb-4 text-secondary">{t('dashboard.quickLinksTitle')}</h3>
                    <div className="space-y-3">
                        {currentUser.role !== UserRole.PARENT && 
                            <QuickLink text={t('dashboard.quickLinkDrill')} onClick={() => setActiveView(AppView.VIRTUAL_DRILL)} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>} />
                        }
                        <QuickLink text={t('dashboard.quickLinkModules')} onClick={() => setActiveView(AppView.EDUCATION)} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>} />
                        <QuickLink text={t('dashboard.quickLinkHazards')} onClick={() => setActiveView(AppView.REGIONAL_HAZARDS)} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>} />
                         <QuickLink text={t('sidebar.disasterPlans')} onClick={() => setActiveView(AppView.DISASTER_PLANS)} icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>} />
                    </div>
                </Card>
                <EmergencyNumbers />
            </div>
        </div>
    );
}
// --- END GENERIC DASHBOARD ---

// --- GUEST DASHBOARD ---
const GuestDashboard: React.FC<{setActiveView: (view: AppView) => void}> = ({ setActiveView }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-light">{t('dashboard.guestWelcome')}</h1>
            <p className="text-lg text-dark-300">{t('dashboard.guestSubtitle')}</p>
            <Card className="bg-primary/10 border-primary border">
                 <p className="text-dark-200">{t('dashboard.guestPrompt')}</p>
                 <p className="font-semibold text-primary mt-2 font-mono">{t('dashboard.guestRegister')}</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:!shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-secondary">
                    <h3 className="font-bold text-lg text-dark-100">{t('sidebar.education')}</h3>
                    <p className="text-sm text-dark-400 mt-1 mb-3">{t('education.subtitle')}</p>
                    <button onClick={() => setActiveView(AppView.EDUCATION)} className="font-semibold text-secondary hover:underline">Explore Modules &rarr;</button>
                </Card>
                 <Card className="hover:!shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-secondary">
                    <h3 className="font-bold text-lg text-dark-100">{t('sidebar.regionalHazards')}</h3>
                    <p className="text-sm text-dark-400 mt-1 mb-3">{t('regionalHazards.subtitle')}</p>
                    <button onClick={() => setActiveView(AppView.REGIONAL_HAZARDS)} className="font-semibold text-secondary hover:underline">View Hazard Map &rarr;</button>
                </Card>
            </div>
             <EmergencyNumbers />
        </div>
    );
}
// --- END GUEST DASHBOARD ---

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard: React.FC<DashboardProps> = ({ currentUser, setActiveView }) => {
    return (
         <div className="relative p-4 rounded-lg">
             <div className="relative z-10">
                {
                    (() => {
                        switch (currentUser.role) {
                            case UserRole.ADMIN_TEACHER:
                                return <AdminDashboard />;
                            case UserRole.STUDENT_PRIMARY:
                                return <StudentJuniorDashboard currentUser={currentUser} setActiveView={setActiveView} />;
                            case UserRole.STUDENT_SECONDARY:
                            case UserRole.STUDENT_COLLEGE:
                            case UserRole.PARENT:
                                return <GenericDashboard currentUser={currentUser} setActiveView={setActiveView} />;
                            case UserRole.GUEST:
                                return <GuestDashboard setActiveView={setActiveView} />;
                            default:
                                return <GenericDashboard currentUser={currentUser} setActiveView={setActiveView} />;
                        }
                    })()
                }
            </div>
         </div>
    )
};

export default Dashboard;