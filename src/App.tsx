import React, { useMemo, useState } from 'react';
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  CircleAlert,
  CreditCard,
  Home,
  LogOut,
  Menu,
  MessageSquareText,
  Package2,
  Search,
  Send,
  ShieldCheck,
  UserCircle2,
  Wallet,
  X,
} from 'lucide-react';

import {
  appSettings,
  depositRequests,
  formatCurrency,
  formatDate,
  notifications as initialNotifications,
  products as initialProducts,
  profile,
  referrals,
  wallet as initialWallet,
  withdrawalRequests,
} from './data/mockData';
import { Product } from './types';

const countryLabels: Record<string, string> = {
  BJ: 'Bénin',
  CM: 'Cameroun',
  CI: 'Côte d’Ivoire',
  BF: 'Burkina Faso',
  NE: 'Niger',
};

type Role = 'user' | 'admin';

const navItems = [
  { label: 'Accueil', to: '/', icon: Home },
  { label: 'Produits', to: '/produits', icon: Package2 },
  { label: 'Transactions', to: '/transactions', icon: CreditCard },
  { label: 'Notifications', to: '/notifications', icon: Bell },
  { label: 'Moi', to: '/profil', icon: UserCircle2 },
];

const productDefaults = {
  name: 'Station Pro',
  amount: 15000,
  dailyYield: 2400,
  totalReturn: 432000,
  duration: '180 jours',
  description: 'Produit modifiable depuis le back-office.',
  conditions: 'Validation administrative avant activation.',
};

function normalizePhone(value: string) {
  return value.replace(/\D/g, '');
}

function App() {
  const [role, setRole] = useState<Role>('user');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [deposits, setDeposits] = useState(depositRequests);
  const [withdrawals, setWithdrawals] = useState(withdrawalRequests);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [wallet, setWallet] = useState(initialWallet);
  const [search, setSearch] = useState('');
  const [authForm, setAuthForm] = useState({
    fullName: 'Aissatou Soro',
    country: 'BJ',
    phone: '97000000',
    password: 'Azerty123!',
    sponsor: '',
  });
  const [loginForm, setLoginForm] = useState({
    country: 'BJ',
    phone: '97000000',
    password: 'Azerty123!',
  });
  const [depositForm, setDepositForm] = useState({
    amount: '25000',
    network: 'Moov Money',
    paymentNumber: '97000000',
    reference: '',
    proof: '',
  });
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '10000',
    network: 'Wave',
    beneficiary: '97000000',
  });
  const [productForm, setProductForm] = useState(productDefaults);
  const [adminTab, setAdminTab] = useState<'deposits' | 'withdrawals'>('deposits');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const searchValue = search.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchValue) ||
        ` ${product.amount}`.includes(searchValue)
      );
    });
  }, [products, search]);

  const currentNotificationCount = notifications.filter((n) => !n.seen).length;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const country = authForm.country;
    const phone = normalizePhone(authForm.phone);

    if (!authForm.fullName || !country || !phone || !authForm.password) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }
    if (!appSettings.allowedCountries.includes(country as any)) {
      alert('Pays non autorisé.');
      return;
    }
    if (authForm.password.length < 8) {
      alert('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setIsLoggedIn(true);
    setShowInfo(true);
    setRole('user');
    setAuthForm({ ...authForm, password: '', sponsor: '' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = normalizePhone(loginForm.phone);
    if (!loginForm.country || !phone || !loginForm.password) {
      alert('Pays, téléphone et mot de passe sont requis.');
      return;
    }
    setIsLoggedIn(true);
    setShowInfo(true);
    setRole('user');
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositForm.amount);
    if (!amount || amount < appSettings.minDeposit) {
      alert('Le montant minimum pour un dépôt est de 2000 FCFA.');
      return;
    }

    const newRequest = {
      id: `DEP-${Date.now()}`,
      userId: profile.id,
      userName: profile.fullName,
      phone: profile.phone,
      amount,
      network: depositForm.network,
      paymentNumber: depositForm.paymentNumber,
      country: profile.country,
      reference: depositForm.reference || `REF-${Date.now()}`,
      status: 'En attente' as const,
      createdAt: new Date().toISOString(),
      proof: depositForm.proof || 'Aucun justificatif fourni',
    };

    setDeposits((prev) => [newRequest, ...prev]);
    setDepositForm({ amount: '', network: 'Moov Money', paymentNumber: '', reference: '', proof: '' });
    alert('Demande de dépôt envoyée. En attente de validation Admin');
  };

  const handleDepositConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositForm.amount);
    if (!amount || amount < appSettings.minDeposit) {
      alert('Le montant minimum pour un dépôt est de 2000 FCFA.');
      return;
    }
    if (!depositForm.network || !depositForm.paymentNumber) {
      alert('Veuillez remplir le réseau et le numéro utilisé.');
      return;
    }

    const newRequest = {
      id: `DEP-${Date.now()}`,
      userId: profile.id,
      userName: profile.fullName,
      phone: profile.phone,
      amount,
      network: depositForm.network,
      paymentNumber: depositForm.paymentNumber,
      country: profile.country,
      reference: depositForm.reference || `REF-${Date.now()}`,
      status: 'En attente' as const,
      createdAt: new Date().toISOString(),
      proof: 'Justificatif de paiement fourni',
    };

    setDeposits((prev) => [newRequest, ...prev]);
    setDepositForm({ amount: '', network: 'Moov Money', paymentNumber: '', reference: '', proof: '' });
    alert('Demande de dépôt envoyée. En attente de validation Admin');
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawForm.amount);
    const fee = Math.round(amount * appSettings.withdrawalFeePercent / 100);
    const net = amount - fee;

    if (amount < appSettings.minWithdrawal) {
      alert('Le montant minimum pour un retrait est de 800 FCFA.');
      return;
    }
    if (amount > wallet.availableBalance) {
      alert('Le solde disponible est insuffisant pour traiter ce retrait.');
      return;
    }

    const newRequest = {
      id: `WDR-${Date.now()}`,
      userId: profile.id,
      userName: profile.fullName,
      phone: profile.phone,
      amount,
      fee,
      net,
      network: withdrawForm.network,
      beneficiaryNumber: withdrawForm.beneficiary,
      country: profile.country,
      status: 'En attente' as const,
      createdAt: new Date().toISOString(),
    };

    setWithdrawals((prev) => [newRequest, ...prev]);
    setWallet((current) => ({
      ...current,
      availableBalance: current.availableBalance - amount,
      reservedBalance: current.reservedBalance + amount,
    }));
    alert('Demande de retrait enregistrée.');
  };

  const approveDeposit = (id: string) => {
    setDeposits((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, status: 'Approuvé' };
      })
    );
    setWallet((current) => ({
      ...current,
      availableBalance: current.availableBalance + (deposits.find((d) => d.id === id)?.amount ?? 0),
      totalDeposits: current.totalDeposits + (deposits.find((d) => d.id === id)?.amount ?? 0),
    }));
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Dépôt approuvé',
        message: 'Votre dépôt a été validé et votre solde a été crédité.',
        type: 'success',
        seen: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const rejectDeposit = (id: string) => {
    setDeposits((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, status: 'Rejeté' };
      })
    );
  };

  const approveWithdrawal = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, status: 'Payé' };
      })
    );
    setWallet((current) => ({
      ...current,
      availableBalance: current.availableBalance - (withdrawals.find((w) => w.id === id)?.amount ?? 0),
      totalWithdrawals: current.totalWithdrawals + (withdrawals.find((w) => w.id === id)?.amount ?? 0),
    }));
  };

  const rejectWithdrawal = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return { ...item, status: 'Rejeté' };
      })
    );
  };

  const markSeen = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, seen: true } : item))
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-brand-gold text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-blue-700">T</div>
                <div>
                  <div className="text-2xl font-black">Total Énergie</div>
                  <div className="text-sm text-white/70">Investissement fiable et sécurisé</div>
                </div>
              </div>

              <h1 className="mb-4 text-4xl font-black leading-tight">Bienvenue dans votre espace d’investissement</h1>
              <p className="mb-6 text-white/75">
                Créez un compte, rejoignez le canal Telegram et gérez vos dépôts, retraits et investissements en toute simplicité.
              </p>

              <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/80">
                <div className="mb-2 font-semibold">Pays autorisés</div>
                <div className="flex flex-wrap gap-2">
                  {appSettings.allowedCountries.map((country) => (
                    <span key={country} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs">
                      {countryLabels[country]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white p-8 text-slate-800 shadow-soft">
              <div className="mb-6 text-center">
                <div className="text-2xl font-black">Inscription</div>
                <div className="text-sm text-slate-500">Créer votre compte Total Énergie</div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  value={authForm.fullName}
                  onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                  placeholder="Nom complet"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none ring-0"
                />
                <select
                  value={authForm.country}
                  onChange={(e) => setAuthForm({ ...authForm, country: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                >
                  <option value="">Sélectionnez votre pays</option>
                  {appSettings.allowedCountries.map((country) => (
                    <option key={country} value={country}>
                      {countryLabels[country]}
                    </option>
                  ))}
                </select>
                <input
                  value={authForm.phone}
                  onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                  placeholder="Numéro de téléphone"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                />
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="Mot de passe"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                />
                <input
                  value={authForm.sponsor}
                  onChange={(e) => setAuthForm({ ...authForm, sponsor: e.target.value })}
                  placeholder="Code parrain (facultatif)"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                />
                <button type="submit" className="w-full rounded-xl bg-brand-blue px-4 py-3 font-bold text-white">
                  S’inscrire
                </button>
              </form>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <div className="mb-3 text-sm font-medium text-slate-500">Déjà inscrit ?</div>
                <form onSubmit={handleLogin} className="space-y-3">
                  <select
                    value={loginForm.country}
                    onChange={(e) => setLoginForm({ ...loginForm, country: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                  >
                    {appSettings.allowedCountries.map((country) => (
                      <option key={country} value={country}>{countryLabels[country]}</option>
                    ))}
                  </select>
                  <input
                    value={loginForm.phone}
                    onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
                    placeholder="Numéro de téléphone"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                  />
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Mot de passe"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                  />
                  <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white">
                    Connexion
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <CircleAlert size={20} />
              </div>
              <div>
                <div className="text-xl font-black uppercase">Information</div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <p>1. Inscrivez-vous maintenant et recevez 500 FCFA gratuitement.</p>
              <p>2. Invitez vos amis à investir et gagnez 25% / 3% / 2% sur 3 niveaux.</p>
              <p>3. Les rendements sont versés automatiquement chaque jour pendant 180 jours.</p>
              <p>4. Investissez dès 2 000 FCFA et commencez à gagner dès le lendemain.</p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setShowInfo(false)} className="flex-1 rounded-xl bg-slate-900 px-4 py-3 font-bold text-white">
                D’accord
              </button>
              <a
                href={appSettings.telegramLink}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white"
              >
                <Send size={18} /> Telegram
              </a>
            </div>
          </div>
        </div>
      )}

      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-gold text-lg font-black text-white">
              T
            </div>
            <div>
              <div className="text-lg font-black">Total Énergie</div>
              <div className="text-xs text-slate-500">Bénin • Cameroun • Côte d’Ivoire • Burkina Faso • Niger</div>
            </div>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a href={appSettings.telegramLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600">
              <Send size={16} /> Canal Telegram
            </a>
            <a href={appSettings.supportLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <MessageSquareText size={16} /> Service client
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-full border border-slate-200 p-2 text-slate-600" aria-label="Notifications">
              <Bell size={18} />
              {currentNotificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-slate-900">
                  {currentNotificationCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="rounded-xl border border-slate-200 p-2 md:hidden" aria-label="Menu mobile">
              {mobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3 text-sm font-medium">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2 ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
                >
                  <item.icon size={16} /> {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produits" element={<ProductsPage products={filteredProducts} search={search} setSearch={setSearch} />} />
          <Route path="/depot" element={<DepositPage depositForm={depositForm} setDepositForm={setDepositForm} onSubmit={handleDepositConfirmation} openPayment={() => window.open(appSettings.paymentLink, '_blank', 'noopener,noreferrer')} />} />
          <Route path="/retrait" element={<WithdrawalPage withdrawForm={withdrawForm} setWithdrawForm={setWithdrawForm} onSubmit={handleWithdrawal} wallet={wallet} />} />
          <Route path="/transactions" element={<TransactionsPage deposits={deposits} withdrawals={withdrawals} />} />
          <Route path="/notifications" element={<NotificationsPage notifications={notifications} markSeen={markSeen} />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage deposits={deposits} withdrawals={withdrawals} products={products} setProducts={setProducts} productForm={productForm} setProductForm={setProductForm} approveDeposit={approveDeposit} rejectDeposit={rejectDeposit} approveWithdrawal={approveWithdrawal} rejectWithdrawal={rejectWithdrawal} adminTab={adminTab} setAdminTab={setAdminTab} />} />
        </Routes>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-5 gap-1 px-2 py-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

function HomePage() {
  return (
    <div className="space-y-6 pb-24">
      <section className="overflow-hidden rounded-[28px] bg-hero text-white shadow-soft">
        <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
              Total Énergie
            </div>
            <h1 className="text-3xl font-black md:text-5xl">Votre avenir énergétique commence ici.</h1>
            <p className="max-w-xl text-sm text-white/80 md:text-base">
              Investissez avec confiance, recevez les rendements automatiquement et gérez vos transactions en toute simplicité.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/depot" className="rounded-xl bg-white px-5 py-3 font-bold text-slate-900">Déposer</Link>
              <Link to="/retrait" className="rounded-xl border border-white/30 bg-transparent px-5 py-3 font-bold text-white">Retirer</Link>
            </div>
          </div>

          <div className="rounded-[24px] bg-white/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-white/70">Portefeuille</div>
              <div className="rounded-full bg-white/10 px-2 py-1 text-xs">Actif</div>
            </div>
            <div className="text-3xl font-black">{formatCurrency(wallet.availableBalance)}</div>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <div className="flex justify-between"><span>Solde disponible</span><span>{formatCurrency(wallet.availableBalance)}</span></div>
              <div className="flex justify-between"><span>Fonds réservés</span><span>{formatCurrency(wallet.reservedBalance)}</span></div>
              <div className="flex justify-between"><span>Versements dus</span><span>{formatCurrency(wallet.contractDue)}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xl font-black">Rejoignez notre Canal Telegram</div>
          <a href={appSettings.telegramLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">
            <Send size={16} /> Rejoindre
          </a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'Déposer', to: '/depot', icon: ArrowDownToLine },
          { title: 'Retirer', to: '/retrait', icon: ArrowUpFromLine },
          { title: 'Transactions', to: '/transactions', icon: CreditCard },
          { title: 'Assistance', to: '/profil', icon: ShieldCheck },
        ].map((item) => (
          <Link key={item.title} to={item.to} className="rounded-[24px] bg-white p-5 shadow-soft transition hover:-translate-y-0.5">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white"><item.icon size={20} /></div>
            <div className="text-lg font-bold">{item.title}</div>
            <div className="mt-2 text-sm text-slate-500">Accès rapide</div>
          </Link>
        ))}
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xl font-black">Offres disponibles</div>
          <Link to="/produits" className="text-sm font-semibold text-brand-blue">Voir tout</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {initialProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
              <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
              <div className="p-4">
                <div className="mb-2 text-lg font-black">{product.name}</div>
                <div className="mb-2 text-2xl font-black text-slate-900">{formatCurrency(product.amount)}</div>
                <div className="text-sm text-slate-500">Rendement annoncé : {formatCurrency(product.dailyYield)} / jour</div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">Détails</button>
                  <button className="flex-1 rounded-xl bg-brand-blue px-3 py-2 text-sm font-semibold text-white">Souscrire</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="mb-4 text-xl font-black">Conditions applicables</div>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>• Le montant minimum de dépôt est de 2 000 FCFA.</li>
          <li>• Le montant minimum de retrait est de 800 FCFA.</li>
          <li>• Les frais de retrait sont de 15 %.</li>
          <li>• Les rendements sont versés automatiquement pendant 180 jours.</li>
        </ul>
      </section>

      <div className="flex gap-3 pb-20">
        <button onClick={() => setRole('admin')} className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">Mode admin</button>
        <button onClick={() => setRole('user')} className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700">Mode utilisateur</button>
      </div>
    </div>
  );
}

function ProductsPage({ products, search, setSearch }: { products: Product[]; search: string; setSearch: (value: string) => void }) {
  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-black">Produits Total Énergie</div>
            <div className="text-sm text-slate-500">Investissements 180 jours avec rendements quotidiens.</div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit" className="w-full bg-transparent text-sm outline-none" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="overflow-hidden rounded-[28px] bg-white shadow-soft">
            <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <div className="text-xl font-black">{product.name}</div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">{product.active ? 'Actif' : 'Inactif'}</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{formatCurrency(product.amount)}</div>
              <p className="text-sm text-slate-600">{product.description}</p>
              <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                <div>Rendement journalier : {formatCurrency(product.dailyYield)}</div>
                <div>Retour total : {formatCurrency(product.totalReturn)}</div>
                <div>Durée : {product.duration}</div>
              </div>
              <div className="text-sm text-slate-500">Conditions : {product.conditions}</div>
              <div className="flex gap-2">
                <button className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold">Détails</button>
                <button className="flex-1 rounded-xl bg-brand-gold px-3 py-2 text-sm font-semibold text-slate-900">Souscrire</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DepositPage({ depositForm, setDepositForm, onSubmit, openPayment }: { depositForm: any; setDepositForm: any; onSubmit: (e: React.FormEvent) => void; openPayment: () => void }) {
  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="text-2xl font-black">Dépôt / Recharger</div>
        <div className="mt-2 text-sm text-slate-500">Méthode de paiement : Mobile Money — Orange Money, Moov Money, MTN Money, Wave.</div>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="mb-3 text-lg font-black">Informations</div>
        <div className="space-y-2 text-sm text-slate-600">
          <div>Montant minimum : 2 000 FCFA</div>
          <div>Le lien de paiement reste caché dans le site et n’est jamais affiché au client.</div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-[28px] bg-white p-5 shadow-soft">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Montant</label>
          <input value={depositForm.amount} onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })} placeholder="Montant minimum 2000" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Réseau</label>
          <select value={depositForm.network} onChange={(e) => setDepositForm({ ...depositForm, network: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3">
            <option>Orange Money</option>
            <option>Moov Money</option>
            <option>MTN Money</option>
            <option>Wave</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Numéro utilisé</label>
          <input value={depositForm.paymentNumber} onChange={(e) => setDepositForm({ ...depositForm, paymentNumber: e.target.value })} placeholder="Ex : Numéro de téléphone sans indicatif" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
          <div className="mt-2 text-xs text-slate-500">Indiquez le numéro mobile money utilisé.</div>
        </div>

        <button type="button" onClick={openPayment} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white">Payer</button>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="mb-2 font-bold">1. Effectuez le paiement</div>
          <div>2. Cliquez sur le bouton ci-dessous.</div>
        </div>

        <div className="pt-2">
          <div className="text-lg font-black">Confirmation de dépôt</div>
          <div className="mt-4 grid gap-4">
            <input value={depositForm.amount} onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })} placeholder="Montant déposé" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            <select value={depositForm.network} onChange={(e) => setDepositForm({ ...depositForm, network: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3">
              <option>Orange Money</option>
              <option>Moov Money</option>
              <option>MTN Money</option>
              <option>Wave</option>
            </select>
            <input value={depositForm.paymentNumber} onChange={(e) => setDepositForm({ ...depositForm, paymentNumber: e.target.value })} placeholder="Numéro utilisé" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            <input value={depositForm.reference} onChange={(e) => setDepositForm({ ...depositForm, reference: e.target.value })} placeholder="Référence / preuve" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
            <textarea value={depositForm.proof} onChange={(e) => setDepositForm({ ...depositForm, proof: e.target.value })} placeholder="Preuve / commentaire" className="min-h-[100px] w-full rounded-xl border border-slate-200 px-4 py-3" />
          </div>
          <button type="submit" className="mt-4 w-full rounded-xl bg-green-600 px-4 py-3 font-bold text-white">Confirmation de dépôt</button>
        </div>
      </form>
    </div>
  );
}

function WithdrawalPage({ withdrawForm, setWithdrawForm, onSubmit, wallet }: { withdrawForm: any; setWithdrawForm: any; onSubmit: (e: React.FormEvent) => void; wallet: any }) {
  const amount = Number(withdrawForm.amount || 0);
  const fee = Math.round(amount * appSettings.withdrawalFeePercent / 100);
  const net = amount - fee;

  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="text-2xl font-black">Retraits</div>
        <div className="mt-2 text-sm text-slate-500">Montant minimum : 800 FCFA • Frais : 15 % • Traitement sous validation admin.</div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-[28px] bg-white p-5 shadow-soft">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Montant</label>
          <input value={withdrawForm.amount} onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })} placeholder="800 FCFA minimum" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Réseau</label>
          <select value={withdrawForm.network} onChange={(e) => setWithdrawForm({ ...withdrawForm, network: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3">
            <option>Orange Money</option>
            <option>Moov Money</option>
            <option>MTN Money</option>
            <option>Wave</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Numéro du bénéficiaire</label>
          <input value={withdrawForm.beneficiary} onChange={(e) => setWithdrawForm({ ...withdrawForm, beneficiary: e.target.value })} placeholder="Numéro du bénéficiaire" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <div className="flex justify-between"><span>Frais de retrait</span><span>{formatCurrency(fee)}</span></div>
          <div className="mt-2 flex justify-between"><span>Montant net</span><span>{formatCurrency(net)}</span></div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {wallet.availableBalance <= 0 ? 'Aucun fond disponible.' : `Solde disponible : ${formatCurrency(wallet.availableBalance)}`}
        </div>

        <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white">Confirmer le retrait</button>
      </form>
    </div>
  );
}

function TransactionsPage({ deposits, withdrawals }: { deposits: any[]; withdrawals: any[] }) {
  return (
    <div className="space-y-8 pb-24">
      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="text-2xl font-black">Historique des transactions</div>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="mb-4 text-xl font-black">Historique des dépôts</div>
        <div className="space-y-3">
          {deposits.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
              <div>
                <div className="font-bold">{formatCurrency(item.amount)}</div>
                <div className="text-sm text-slate-500">{item.network} • {item.reference}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-600">{item.status}</div>
                <div className="text-xs text-slate-400">{formatDate(item.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="mb-4 text-xl font-black">Historique des retraits</div>
        <div className="space-y-3">
          {withdrawals.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
              <div>
                <div className="font-bold">{formatCurrency(item.amount)}</div>
                <div className="text-sm text-slate-500">Net {formatCurrency(item.net)} • {item.network}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-slate-600">{item.status}</div>
                <div className="text-xs text-slate-400">{formatDate(item.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsPage({ notifications, markSeen }: { notifications: any[]; markSeen: (id: string) => void }) {
  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="text-2xl font-black">Centre de notifications</div>
      </div>

      <div className="space-y-3">
        {notifications.map((item) => (
          <div key={item.id} onClick={() => markSeen(item.id)} className={`rounded-[28px] border p-4 shadow-soft ${item.seen ? 'border-slate-200 bg-white' : 'border-brand-blue/20 bg-blue-50'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-bold">{item.title}</div>
                <div className="mt-1 text-sm text-slate-600">{item.message}</div>
              </div>
              <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${item.type === 'success' ? 'bg-green-100 text-green-700' : item.type === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                {item.type}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400">{formatDate(item.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-2xl font-black text-white">AS</div>
          <div>
            <div className="text-2xl font-black">{profile.fullName}</div>
            <div className="text-sm text-slate-500">{countryLabels[profile.country]} • {profile.phone}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[28px] bg-white p-5 shadow-soft">
          <div className="mb-4 text-lg font-black">Mon portefeuille</div>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between"><span>Solde disponible</span><span>{formatCurrency(wallet.availableBalance)}</span></div>
            <div className="flex justify-between"><span>Fonds réservés</span><span>{formatCurrency(wallet.reservedBalance)}</span></div>
            <div className="flex justify-between"><span>Total dépôts</span><span>{formatCurrency(wallet.totalDeposits)}</span></div>
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-5 shadow-soft">
          <div className="mb-4 text-lg font-black">Parrainage</div>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between"><span>Code</span><span>{profile.referralCode}</span></div>
            <div className="flex justify-between"><span>Filleuls</span><span>{referrals.length}</span></div>
            <div className="flex justify-between"><span>Commission validée</span><span>{formatCurrency(referrals.reduce((sum, item) => sum + item.commission, 0))}</span></div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="mb-4 text-lg font-black">Mes demandes de dépôt</div>
        <div className="space-y-3">
          {depositRequests.filter((d) => d.userId === profile.id).map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
              <div>
                <div className="font-bold">{formatCurrency(item.amount)}</div>
                <div className="text-sm text-slate-500">{item.network} • {item.reference}</div>
              </div>
              <div className="text-right text-sm font-medium text-amber-600">{item.status}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-bold text-white"><LogOut size={18} /> Déconnexion</button>
    </div>
  );
}

function AdminPage({
  deposits,
  withdrawals,
  products,
  setProducts,
  productForm,
  setProductForm,
  approveDeposit,
  rejectDeposit,
  approveWithdrawal,
  rejectWithdrawal,
  adminTab,
  setAdminTab,
}: {
  deposits: any[];
  withdrawals: any[];
  products: any[];
  setProducts: any;
  productForm: any;
  setProductForm: any;
  approveDeposit: (id: string) => void;
  rejectDeposit: (id: string) => void;
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string) => void;
  adminTab: 'deposits' | 'withdrawals';
  setAdminTab: (tab: 'deposits' | 'withdrawals') => void;
}) {
  return (
    <div className="space-y-8 pb-24">
      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="text-2xl font-black">Back-office Total Énergie</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Utilisateurs', value: '1 284' },
          { label: 'Dépôts en attente', value: String(deposits.filter((d) => d.status === 'En attente').length) },
          { label: 'Retraits en attente', value: String(withdrawals.filter((w) => w.status === 'En attente').length) },
          { label: 'Produits actifs', value: String(products.length) },
        ].map((item) => (
          <div key={item.label} className="rounded-[28px] bg-white p-5 shadow-soft">
            <div className="text-sm text-slate-500">{item.label}</div>
            <div className="mt-3 text-3xl font-black text-slate-900">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="mb-4 text-xl font-black">DEMANDES EN ATTENTE</div>
        <div className="mb-4 flex gap-2 rounded-xl bg-slate-100 p-1">
          <button onClick={() => setAdminTab('deposits')} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${adminTab === 'deposits' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
            Dépôts
          </button>
          <button onClick={() => setAdminTab('withdrawals')} className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${adminTab === 'withdrawals' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
            Retraits
          </button>
        </div>

        {adminTab === 'deposits' ? (
          <div className="space-y-3">
            {deposits.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-3">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="font-bold">{item.userName}</div>
                    <div className="text-sm text-slate-500">{item.network} • {item.reference}</div>
                  </div>
                  <div className="text-right text-sm font-medium text-slate-700">{item.status}</div>
                </div>
                <div className="mt-3 flex justify-between text-sm text-slate-600">
                  <span>{formatCurrency(item.amount)}</span>
                  <span>{item.country}</span>
                </div>
                {item.proof && <div className="mt-3 text-xs text-slate-500">Preuve : {item.proof}</div>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => approveDeposit(item.id)} className="flex-1 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white">Approuver</button>
                  <button onClick={() => rejectDeposit(item.id)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold">Rejeter</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawals.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 p-3">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="font-bold">{item.userName}</div>
                    <div className="text-sm text-slate-500">{item.network} • {item.beneficiaryNumber}</div>
                  </div>
                  <div className="text-right text-sm font-medium text-slate-700">{item.status}</div>
                </div>
                <div className="mt-3 flex justify-between text-sm text-slate-600">
                  <span>{formatCurrency(item.amount)}</span>
                  <span>{item.country}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => approveWithdrawal(item.id)} className="flex-1 rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white">Approuver</button>
                  <button onClick={() => rejectWithdrawal(item.id)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold">Rejeter</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[28px] bg-white p-5 shadow-soft">
        <div className="mb-4 text-xl font-black">Gestion des produits</div>
        <div className="space-y-3">
          <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Nom du produit" />
          <input type="number" value={productForm.amount} onChange={(e) => setProductForm({ ...productForm, amount: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Montant" />
          <input type="number" value={productForm.dailyYield} onChange={(e) => setProductForm({ ...productForm, dailyYield: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Rendement quotidien" />
          <input value={productForm.duration} onChange={(e) => setProductForm({ ...productForm, duration: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Durée" />
          <textarea value={productForm.conditions} onChange={(e) => setProductForm({ ...productForm, conditions: e.target.value })} className="min-h-[100px] w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Conditions" />
          <button onClick={() => setProducts((current: any[]) => [{ id: `P-${Date.now()}`, ...productForm, active: true, image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=900&q=80' }, ...current])} className="w-full rounded-xl bg-brand-blue px-4 py-3 font-bold text-white">Ajouter le produit</button>
        </div>
      </div>
    </div>
  );
}

export default App;
