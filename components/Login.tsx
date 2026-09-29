
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { login, register } from '../auth/authService';
import Card from './shared/Card';
import Button from './shared/Button';
import { useTranslation } from '../hooks/useTranslation';

interface LoginProps {
  onLogin: (user: User) => void;
}

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <path d="m9 12 2 2 4-4" strokeWidth="2.5" />
    </svg>
);

const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 30;

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t, setLanguage, language } = useTranslation();
  const [isRegistering, setIsRegistering] = useState(false);

  // Login state
  const [loginRole, setLoginRole] = useState<UserRole | ''>('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  
  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regRole, setRegRole] = useState<UserRole | ''>('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // FIX: Refactored to correctly handle timer creation and cleanup.
    // This prevents a ReferenceError when lockoutTime is 0 and implicitly fixes the NodeJS type error.
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    if (!loginRole || !loginUsername || !loginPassword) {
      setError(t('login.errorFillFields'));
      return;
    }
    setError('');
    setSuccess('');

    const user = await login(loginRole, loginUsername, loginPassword);
    if (user) {
      setLoginAttempts(0);
      onLogin(user);
    } else {
      const newAttemptCount = loginAttempts + 1;
      setLoginAttempts(newAttemptCount);
      if (newAttemptCount >= MAX_LOGIN_ATTEMPTS) {
        setLockoutTime(LOCKOUT_DURATION_SECONDS);
        setError(t('login.errorTooManyAttempts', { seconds: LOCKOUT_DURATION_SECONDS }));
      } else {
        setError(t('login.errorInvalidCredentials') + ' ' + t('login.attemptsRemaining', { count: MAX_LOGIN_ATTEMPTS - newAttemptCount }));
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!regUsername || !regRole || !regPassword || !regConfirmPassword) {
      setError(t('login.errorFillRegistration'));
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError(t('login.errorPasswordsNoMatch'));
      return;
    }

    const result = await register({
        username: regUsername,
        role: regRole,
        password: regPassword,
    });

    if (result.success) {
        setSuccess(result.message);
        setIsRegistering(false);
        setLoginRole(regRole);
        setLoginUsername(regUsername);
        setRegUsername(''); setRegRole(''); setRegPassword(''); setRegConfirmPassword('');
    } else {
        setError(result.message);
    }
  };
  
  const handleGuestLogin = () => {
    const guestUser: User = {
      id: 'guest-user',
      username: 'guest',
      role: UserRole.GUEST,
    };
    onLogin(guestUser);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    if (lang === 'en' || lang === 'hi') {
      setLanguage(lang);
    }
  };

  const customSelectStyles = "w-full p-3 border border-dark-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-dark-800 text-dark-200 appearance-none hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const customInputStyles = "w-full p-3 pl-10 border border-dark-700 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-dark-800 text-dark-200 hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="bg-dark-900 min-h-screen flex items-center justify-center p-4 font-sans">
      <Card className="max-w-md w-full !shadow-2xl !rounded-2xl !border-primary/20">
        <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-secondary/10 rounded-full mb-4">
                 <ShieldIcon />
            </div>
            <h1 className="text-3xl font-bold text-light">{isRegistering ? t('login.createAccountTitle') : t('login.welcomeTitle')}</h1>
            <p className="text-dark-400 mt-1">{isRegistering ? t('login.createAccountSubtitle') : t('login.welcomeSubtitle')}</p>
        </div>
        
        {isRegistering ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in-up">
                 <div>
                    <label htmlFor="reg-username-input" className="block text-sm font-medium text-dark-300 mb-1 ml-1">{t('login.usernameLabel')}</label>
                    <div className="relative">
                        <UserIcon />
                        <input id="reg-username-input" type="text" value={regUsername} onChange={e => setRegUsername(e.target.value)} className={customInputStyles} required />
                    </div>
                </div>
                <div>
                  <label htmlFor="reg-role-select" className="block text-sm font-medium text-dark-300 mb-1 ml-1">{t('login.roleLabel')}</label>
                  <div className="relative">
                      <select id="reg-role-select" value={regRole} onChange={(e) => setRegRole(e.target.value as UserRole)} className={customSelectStyles} required >
                          <option value="" disabled>{t('login.selectRolePlaceholder')}</option>
                          {Object.values(UserRole).filter(r => r !== UserRole.GUEST).map(role => (<option key={role} value={role}>{role}</option>))}
                      </select>
                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-400"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-password-input" className="block text-sm font-medium text-dark-300 mb-1 ml-1">{t('login.passwordLabel')}</label>
                  <div className="relative">
                    <LockIcon />
                    <input id="reg-password-input" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} className={customInputStyles} required />
                  </div>
                </div>
                 <div>
                  <label htmlFor="reg-confirm-password-input" className="block text-sm font-medium text-dark-300 mb-1 ml-1">{t('login.confirmPasswordLabel')}</label>
                  <div className="relative">
                    <LockIcon />
                    <input id="reg-confirm-password-input" type="password" value={regConfirmPassword} onChange={e => setRegConfirmPassword(e.target.value)} className={customInputStyles} required />
                  </div>
                </div>
                {error && <p className="text-sm text-center text-danger pt-2">{error}</p>}
                <div className="pt-2"><Button type="submit" variant="accent" className="w-full !py-3 !text-base">{t('login.createAccountButton')}</Button></div>
            </form>
        ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="language-select" className="block text-sm font-medium text-dark-300 mb-1 ml-1 flex items-center"><GlobeIcon /><span className="ml-2">{t('login.languageLabel')}</span></label>
                  <div className="relative">
                    <select id="language-select" value={language} onChange={handleLanguageChange} className={customSelectStyles} disabled={lockoutTime > 0}>
                      <option value="en">English</option>
                      <option value="hi">हिन्दी</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-400"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
                  </div>
                </div>
                <div>
                  <label htmlFor="role-select" className="block text-sm font-medium text-dark-300 mb-1 ml-1">{t('login.roleLabel')}</label>
                  <div className="relative">
                      <select id="role-select" value={loginRole} onChange={(e) => setLoginRole(e.target.value as UserRole)} className={customSelectStyles} required disabled={lockoutTime > 0}>
                          <option value="" disabled>{t('login.selectRolePlaceholder')}</option>
                          {Object.values(UserRole).filter(r => r !== UserRole.GUEST).map(role => (<option key={role} value={role}>{role}</option>))}
                      </select>
                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-dark-400"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
                  </div>
                </div>
                {loginRole && (
                  <div className="space-y-4 animate-fade-in-up">
                    <div>
                      <label htmlFor="username-input" className="block text-sm font-medium text-dark-300 mb-1 ml-1">{t('login.usernameLabel')}</label>
                      <div className="relative">
                        <UserIcon />
                        <input id="username-input" type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} className={customInputStyles} disabled={lockoutTime > 0} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="password-input" className="block text-sm font-medium text-dark-300 mb-1 ml-1">{t('login.passwordLabel')}</label>
                      <div className="relative">
                        <LockIcon />
                        <input id="password-input" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className={customInputStyles} disabled={lockoutTime > 0} />
                      </div>
                    </div>
                  </div>
                )}
                {error && <p className="text-sm text-center text-danger pt-2">{lockoutTime > 0 ? t('login.errorTooManyAttempts', { seconds: lockoutTime }) : error}</p>}
                {success && <p className="text-sm text-center text-accent pt-2">{success}</p>}
                <div className="pt-2"><Button type="submit" className="w-full !py-3 !text-base" disabled={!loginRole || lockoutTime > 0}>{lockoutTime > 0 ? `${t('login.tryAgainIn')} ${lockoutTime}s` : t('login.loginButton')}</Button></div>
            </form>
        )}

        {!isRegistering && (
             <div className="mt-6">
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-dark-700"></div>
                    <span className="flex-shrink mx-4 text-xs text-dark-500 font-semibold tracking-wider">OR</span>
                    <div className="flex-grow border-t border-dark-700"></div>
                </div>
                <Button onClick={handleGuestLogin} variant="secondary" className="w-full !py-3 !text-base">
                    {t('login.guestButton')}
                </Button>
            </div>
        )}

        <div className="text-center mt-6">
          <button onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccess(''); }} className="text-sm font-semibold text-primary hover:underline focus:outline-none">
            {isRegistering ? t('login.switchToLogin') : t('login.switchToRegister')}
          </button>
        </div>

      </Card>
    </div>
  );
};

export default Login;
