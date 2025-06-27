"use client";
import { useState, useEffect } from "react";
import { MODELS_DATA, ModelData } from "@/lib/models-data";
import { supabase } from '@/lib/supabaseClient';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminCrudSection from '@/components/admin-crud-section';

const ADMIN_PASSWORD = "admin123"; // À changer pour la prod !

const mockStats = {
  revenue: 12450,
  orders: 87,
  products: MODELS_DATA.length,
  users: 4,
};

const mockOrders = [
  { id: 101, product: "RAWRK Alpha Strÿk Edition", status: "Livré", amount: 85000 },
  { id: 102, product: "RAWRK Royal Shadow Edition", status: "En cours", amount: 90000 },
];

// Ajout d'un champ stock fictif pour la démo
const withStock = MODELS_DATA.map(m => ({ ...m, stock: Math.floor(Math.random()*10)+1 }));

const sidebarLinks = [
  { key: "dashboard", label: "Vue d'ensemble", icon: "📊" },
  { key: "products", label: "Modèles", icon: "🚗" },
  { key: "orders", label: "Commandes", icon: "📦" },
  { key: "clients", label: "Clients", icon: "👤" },
  { key: "admin", label: "Administration", icon: "⚙️" },
];

const mockClients = [
  { id: 1, name: "Alice Martin", email: "alice@email.com", phone: "06 12 34 56 78", registered: "2024-05-01" },
  { id: 2, name: "Bob Dupont", email: "bob@email.com", phone: "06 98 76 54 32", registered: "2024-05-10" },
  { id: 3, name: "Chloé Bernard", email: "chloe@email.com", phone: "07 11 22 33 44", registered: "2024-05-15" },
  { id: 4, name: "David Leroy", email: "david@email.com", phone: "07 55 66 77 88", registered: "2024-05-20" },
];

interface User {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  role: string;
  created_at: string;
}

const TABS = [
  { key: 'clients', label: 'Clients' },
  { key: 'fournisseurs', label: 'Fournisseurs' },
  { key: 'commandes', label: 'Commandes véhicules' },
  { key: 'importations', label: 'Importations' },
  { key: 'preparations', label: 'Préparations' },
  { key: 'livraisons', label: 'Livraisons' },
  { key: 'exportations', label: 'Exportations' },
  { key: 'roles', label: 'Rôles & Permissions' },
  { key: 'modeles', label: 'Modèles' },
];

function ExportButton({ data, filename, format = 'csv' }: { data: any[], filename: string, format?: string }) {
  function handleExport() {
    if (format === 'csv') {
      const csv = [Object.keys(data[0] || {}).join(',')].concat(data.map(row => Object.values(row).join(','))).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename + '.csv';
      a.click();
    }
    // PDF export: à implémenter si besoin
  }
  return <button onClick={handleExport} className="bg-gray-200 px-2 py-1 rounded text-xs ml-2">Exporter {format.toUpperCase()}</button>;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [error, setError] = useState("");
  const [section, setSection] = useState("dashboard");
  const [models, setModels] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState(mockClients);
  const [editId, setEditId] = useState<string|null>(null);
  const [editModel, setEditModel] = useState<Partial<ModelData & {stock:number}>>({});
  const [editClientId, setEditClientId] = useState<number|null>(null);
  const [editClient, setEditClient] = useState<any>({});
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });
  const [liveOrders, setLiveOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifLoading, setNotifLoading] = useState(false);
  const [tab, setTab] = useState('clients');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [vehicleOrders, setVehicleOrders] = useState<any[]>([]);
  const [vehicleImports, setVehicleImports] = useState<any[]>([]);
  const [vehiclePreps, setVehiclePreps] = useState<any[]>([]);
  const [vehicleDeliveries, setVehicleDeliveries] = useState<any[]>([]);
  const [vehicleExports, setVehicleExports] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [editSupplier, setEditSupplier] = useState<any|null>(null);
  const [editOrder, setEditOrder] = useState<any|null>(null);
  const [editPrep, setEditPrep] = useState<any|null>(null);
  const [editDelivery, setEditDelivery] = useState<any|null>(null);
  const [showChart, setShowChart] = useState(false);
  const [newModel, setNewModel] = useState({ nom: '', description: '', prix: '', image_url: '' });
  const [addingModel, setAddingModel] = useState(false);
  const [addError, setAddError] = useState('');
  const [newSupplier, setNewSupplier] = useState({ nom: '', pays: '', ville: '', adresse: '', telephone: '', email: '', type: '' });
  const [editingSupplier, setEditingSupplier] = useState<any|null>(null);
  const [supplierError, setSupplierError] = useState('');
  const [addingSupplier, setAddingSupplier] = useState(false);

  useEffect(() => {
    function fetchOrders() {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      setLiveOrders(orders.reverse());
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (tab === 'fournisseurs') fetchSuppliers();
    if (tab === 'commandes') fetchVehicleOrders();
    if (tab === 'importations') fetchVehicleImports();
    if (tab === 'preparations') fetchVehiclePreps();
    if (tab === 'livraisons') fetchVehicleDeliveries();
    if (tab === 'exportations') fetchVehicleExports();
    if (tab === 'roles') { fetchRoles(); fetchPermissions(); }
    if (tab === 'modeles') fetchModels();
  }, [tab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLogged(true);
      setError("");
    } else {
      setError("Mot de passe incorrect");
    }
  };

  const handleEdit = (model: ModelData & {stock:number}) => {
    setEditId(model.id);
    setEditModel(model);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    setEditModel({ ...editModel, [e.target.name]: e.target.value });
  };

  const handleEditStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditModel({ ...editModel, stock: Number(e.target.value) });
  };

  const handleSaveEdit = () => {
    setModels(models.map(m => m.id === editId ? { ...m, ...editModel } : m));
    setEditId(null);
    setEditModel({});
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditModel({});
  };

  // --- CLIENTS ---
  const handleEditClient = (client: any) => {
    setEditClientId(client.id);
    setEditClient(client);
  };
  const handleEditClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditClient({ ...editClient, [e.target.name]: e.target.value });
  };
  const handleSaveEditClient = () => {
    setClients(clients.map(c => c.id === editClientId ? { ...c, ...editClient } : c));
    setEditClientId(null);
    setEditClient({});
  };
  const handleCancelEditClient = () => {
    setEditClientId(null);
    setEditClient({});
  };
  const handleDeleteClient = (id: number) => {
    setClients(clients.filter(c => c.id !== id));
  };
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email || !newClient.phone) return;
    setClients([
      ...clients,
      { id: Date.now(), ...newClient, registered: new Date().toISOString().slice(0,10) },
    ]);
    setNewClient({ name: "", email: "", phone: "" });
  };

  // Calcul stats dynamiques
  const totalRevenue = liveOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = liveOrders.length;
  const totalClients = clients.length;

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from('users').select('*');
    setUsers(data || []);
    setLoading(false);
  }

  async function handleSelectUser(user: User) {
    setSelectedUser(user);
    // Fetch vehicles, orders, services, payments for this user
    const { data: vehicles } = await supabase.from('vehicles').select('*').eq('user_id', user.id);
    setVehicles(vehicles || []);
    const { data: orders } = await supabase.from('orders').select('*').eq('user_id', user.id);
    setOrders(orders || []);
    const { data: services } = await supabase.from('vehicle_services').select('*').in('vehicle_id', vehicles?.map(v => v.id) || []);
    setServices(services || []);
    const { data: payments } = await supabase.from('payments').select('*').eq('user_id', user.id);
    setPayments(payments || []);
    const { data: activityLogs } = await supabase.from('activity_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setActivityLogs(activityLogs || []);
    const { data: notifications } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setNotifications(notifications || []);
    const { data: addresses } = await supabase.from('addresses').select('*').eq('user_id', user.id);
    setAddresses(addresses || []);
    const { data: reviews } = await supabase.from('reviews').select('*').eq('user_id', user.id);
    setReviews(reviews || []);
  }

  async function handleRoleChange(user: User, newRole: string) {
    await supabase.from('users').update({ role: newRole }).eq('id', user.id);
    fetchUsers();
    if (selectedUser && selectedUser.id === user.id) setSelectedUser({ ...selectedUser, role: newRole });
  }

  async function handleDeleteUser(user: User) {
    if (!window.confirm('Supprimer ce client ?')) return;
    await supabase.from('users').delete().eq('id', user.id);
    fetchUsers();
    setSelectedUser(null);
  }

  async function handleDisableUser(user: User) {
    await supabase.from('users').update({ role: 'disabled' }).eq('id', user.id);
    fetchUsers();
    if (selectedUser && selectedUser.id === user.id) setSelectedUser({ ...selectedUser, role: 'disabled' });
  }
  async function handleEnableUser(user: User) {
    await supabase.from('users').update({ role: 'client' }).eq('id', user.id);
    fetchUsers();
    if (selectedUser && selectedUser.id === user.id) setSelectedUser({ ...selectedUser, role: 'client' });
  }
  async function handleSendNotification(user: User) {
    if (!notifMessage) return;
    setNotifLoading(true);
    await supabase.from('notifications').insert({ user_id: user.id, titre: 'Message admin', message: notifMessage });
    setNotifMessage('');
    setNotifLoading(false);
    handleSelectUser(user);
  }

  async function fetchSuppliers() {
    const { data } = await supabase.from('suppliers').select('*');
    setSuppliers(data || []);
  }
  async function fetchVehicleOrders() {
    const { data } = await supabase.from('vehicle_orders').select('*');
    setVehicleOrders(data || []);
  }
  async function fetchVehicleImports() {
    const { data } = await supabase.from('vehicle_imports').select('*');
    setVehicleImports(data || []);
  }
  async function fetchVehiclePreps() {
    const { data } = await supabase.from('vehicle_preparations').select('*');
    setVehiclePreps(data || []);
  }
  async function fetchVehicleDeliveries() {
    const { data } = await supabase.from('vehicle_deliveries').select('*');
    setVehicleDeliveries(data || []);
  }
  async function fetchVehicleExports() {
    const { data } = await supabase.from('vehicle_exports').select('*');
    setVehicleExports(data || []);
  }
  async function fetchRoles() {
    const { data } = await supabase.from('roles').select('*');
    setRoles(data || []);
  }
  async function fetchPermissions() {
    const { data } = await supabase.from('permissions').select('*');
    setPermissions(data || []);
  }

  // Actions avancées exemples :
  async function handleDeleteSupplier(id: string) {
    if (!window.confirm('Supprimer ce fournisseur ?')) return;
    await supabase.from('suppliers').delete().eq('id', id);
    fetchSuppliers();
  }
  async function handleEditSupplierSubmit(s: any) {
    await supabase.from('suppliers').update(s).eq('id', s.id);
    setEditSupplier(null);
    fetchSuppliers();
  }

  // Dashboard analytique (exemple commandes par mois)
  const commandesParMois = vehicleOrders.reduce((acc, o) => {
    const mois = o.date_commande ? o.date_commande.slice(0,7) : 'N/A';
    acc[mois] = (acc[mois] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const chartData = {
    labels: Object.keys(commandesParMois),
    datasets: [{ label: 'Commandes véhicules', data: Object.values(commandesParMois), backgroundColor: '#facc15' }]
  };

  async function fetchModels() {
    const { data } = await supabase.from('models').select('*');
    setModels(data || []);
  }

  async function handleImportDefaultModels() {
    const { data: existing } = await supabase.from('models').select('id');
    const existingIds = (existing || []).map((m: any) => m.id);
    for (const model of MODELS_DATA) {
      if (!existingIds.includes(model.id)) {
        await supabase.from('models').insert({
          id: model.id,
          nom: model.name,
          description: model.description,
          prix: model.basePrice,
          image_url: model.images[0]?.src,
        });
      }
    }
    fetchModels();
  }

  // Fonctions CRUD pour fournisseurs
  const supplierFields = [
    { name: 'nom', label: 'Nom', required: true },
    { name: 'pays', label: 'Pays' },
    { name: 'ville', label: 'Ville' },
    { name: 'adresse', label: 'Adresse' },
    { name: 'telephone', label: 'Téléphone' },
    { name: 'email', label: 'Email' },
    { name: 'type', label: 'Type' },
  ];
  const fetchSuppliersCrud = async () => {
    const { data } = await supabase.from('suppliers').select('*');
    return data || [];
  };
  const addSupplier = async (row: any) => {
    const { error } = await supabase.from('suppliers').insert(row);
    if (error) throw error;
  };
  const updateSupplier = async (row: any) => {
    const { error } = await supabase.from('suppliers').update(row).eq('id', row.id);
    if (error) throw error;
  };
  const deleteSupplier = async (id: string) => {
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) throw error;
  };

  // Fonctions CRUD pour modèles
  const modelFields = [
    { name: 'nom', label: 'Nom', required: true },
    { name: 'description', label: 'Description' },
    { name: 'prix', label: 'Prix', type: 'number', required: true },
    { name: 'image_url', label: 'Image (URL)' },
  ];
  const fetchModelsCrud = async () => {
    const { data } = await supabase.from('models').select('*');
    return data || [];
  };
  const addModel = async (row: any) => {
    const { error } = await supabase.from('models').insert({ ...row, prix: Number(row.prix) });
    if (error) throw error;
  };
  const updateModel = async (row: any) => {
    const { error } = await supabase.from('models').update({ ...row, prix: Number(row.prix) }).eq('id', row.id);
    if (error) throw error;
  };
  const deleteModel = async (id: string) => {
    const { error } = await supabase.from('models').delete().eq('id', id);
    if (error) throw error;
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <form onSubmit={handleLogin} className="bg-white/95 p-8 rounded-xl shadow-2xl w-80 border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">Admin Login</h1>
          <input
            type="password"
            placeholder="Mot de passe admin"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">Se connecter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      {/* Sidebar */}
      <aside className="w-60 min-h-screen bg-black/95 text-white flex flex-col py-8 px-4 shadow-2xl">
        <h2 className="text-2xl font-extrabold mb-10 text-center tracking-widest text-yellow-400">RAWRK Admin</h2>
        <nav className="flex flex-col gap-2">
          {sidebarLinks.map(link => (
            <button
              key={link.key}
              onClick={() => setSection(link.key)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-lg font-medium transition-all duration-150 ${section===link.key ? "bg-yellow-400 text-black shadow-lg" : "hover:bg-gray-800/80 hover:text-yellow-400"}`}
            >
              <span>{link.icon}</span> {link.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setIsLogged(false)} className="mt-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition">Déconnexion</button>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-10">
        {section === "dashboard" && (
          <div>
            <h1 className="text-3xl font-extrabold mb-8 text-yellow-400">Vue d'ensemble</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div className="bg-gray-900/80 rounded-xl shadow p-6 text-center border border-gray-800">
                <div className="text-lg font-semibold text-gray-300">Revenu</div>
                <div className="text-3xl font-bold text-yellow-400">{totalRevenue} €</div>
              </div>
              <div className="bg-gray-900/80 rounded-xl shadow p-6 text-center border border-gray-800">
                <div className="text-lg font-semibold text-gray-300">Commandes</div>
                <div className="text-3xl font-bold text-yellow-400">{totalOrders}</div>
              </div>
              <div className="bg-gray-900/80 rounded-xl shadow p-6 text-center border border-gray-800">
                <div className="text-lg font-semibold text-gray-300">Modèles</div>
                <div className="text-3xl font-bold text-yellow-400">{models.length}</div>
              </div>
              <div className="bg-gray-900/80 rounded-xl shadow p-6 text-center border border-gray-800">
                <div className="text-lg font-semibold text-gray-300">Utilisateurs</div>
                <div className="text-3xl font-bold text-yellow-400">{totalClients}</div>
              </div>
            </div>
            <p className="text-gray-300">Bienvenue sur le dashboard e-commerce administratif du projet.</p>
          </div>
        )}
        {section === "products" && (
          <div>
            <h1 className="text-3xl font-extrabold mb-8 text-yellow-400">Gestion des modèles</h1>
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-900/80 rounded-xl shadow border border-gray-800">
                <thead>
                  <tr className="border-b border-gray-700 text-yellow-400">
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Nom</th>
                    <th className="p-3 text-left">Prix</th>
                    <th className="p-3 text-left">Stock</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((m) => (
                    <tr key={m.id} className="border-b border-gray-800 align-top hover:bg-gray-800/60 transition">
                      <td className="p-3"><img src={m.images[0]?.src} alt={m.name} className="w-24 h-16 object-cover rounded shadow border border-gray-700" /></td>
                      {editId === m.id ? (
                        <>
                          <td className="p-3"><input name="name" value={editModel.name as string} onChange={handleEditChange} className="border-2 border-yellow-400 bg-gray-800 text-white p-1 rounded w-40 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></td>
                          <td className="p-3"><input name="basePrice" type="number" value={editModel.basePrice as number} onChange={handleEditChange} className="border-2 border-yellow-400 bg-gray-800 text-white p-1 rounded w-24 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></td>
                          <td className="p-3"><input name="stock" type="number" value={editModel.stock as number} onChange={handleEditStock} className="border-2 border-yellow-400 bg-gray-800 text-white p-1 rounded w-16 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></td>
                          <td className="p-3"><textarea name="description" value={editModel.description as string} onChange={handleEditChange} className="border-2 border-yellow-400 bg-gray-800 text-white p-1 rounded w-56 focus:outline-none focus:ring-2 focus:ring-yellow-400" /></td>
                          <td className="p-3 text-center flex flex-col gap-2">
                            <button onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded font-semibold shadow transition">Enregistrer</button>
                            <button onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded font-semibold shadow transition">Annuler</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-white font-semibold">{m.name}</td>
                          <td className="p-3 text-yellow-300 font-bold">{m.basePrice} €</td>
                          <td className="p-3 text-white">{m.stock}</td>
                          <td className="p-3 max-w-xs truncate text-gray-300" title={m.description}>{m.description}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => handleEdit(m)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-semibold shadow transition">Modifier</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {section === "orders" && (
          <div>
            <h1 className="text-3xl font-extrabold mb-8 text-yellow-400">Commandes</h1>
            {liveOrders.length === 0 ? (
              <div className="text-gray-400">Aucune commande pour le moment.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-gray-900/80 rounded-xl shadow border border-gray-800">
                  <thead>
                    <tr className="border-b border-gray-700 text-yellow-400">
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Client</th>
                      <th className="p-3 text-left">Contact</th>
                      <th className="p-3 text-left">Adresse</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Articles</th>
                      <th className="p-3 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveOrders.map((order, idx) => (
                      <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition">
                        <td className="p-3 text-white">{liveOrders.length - idx}</td>
                        <td className="p-3 text-white font-semibold">{order.client.name}</td>
                        <td className="p-3 text-yellow-300 font-mono">
                          <a href={`mailto:${order.client.email}`} className="underline hover:text-yellow-400">{order.client.email}</a><br/>
                          <a href={`tel:${order.client.phone}`} className="underline hover:text-yellow-400">{order.client.phone}</a>
                        </td>
                        <td className="p-3 text-white">{order.client.address}</td>
                        <td className="p-3 text-gray-300">{order.date}</td>
                        <td className="p-3 text-white">
                          <ul className="list-disc pl-4">
                            {order.items.map((item: any) => (
                              <li key={item.id}>{item.name} x{item.quantity}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="p-3 text-yellow-400 font-bold">{order.total} €</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {section === "clients" && (
          <div>
            <h1 className="text-3xl font-extrabold mb-8 text-yellow-400">Gestion des clients</h1>
            <input
              type="text"
              placeholder="Rechercher par email, nom, prénom..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border px-3 py-2 rounded mb-4 w-full"
            />
            {loading ? <div>Chargement...</div> : (
              <table className="w-full border mb-8">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Email</th>
                    <th className="p-2">Nom</th>
                    <th className="p-2">Prénom</th>
                    <th className="p-2">Téléphone</th>
                    <th className="p-2">Rôle</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u =>
                    u.email.toLowerCase().includes(search.toLowerCase()) ||
                    (u.nom || '').toLowerCase().includes(search.toLowerCase()) ||
                    (u.prenom || '').toLowerCase().includes(search.toLowerCase())
                  ).map(user => (
                    <tr key={user.id} className="border-b hover:bg-yellow-50 cursor-pointer" onClick={() => handleSelectUser(user)}>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.nom}</td>
                      <td className="p-2">{user.prenom}</td>
                      <td className="p-2">{user.telephone}</td>
                      <td className="p-2">
                        <select value={user.role} onChange={e => handleRoleChange(user, e.target.value)} className="border rounded px-2 py-1">
                          <option value="client">Client</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <button onClick={e => { e.stopPropagation(); handleDeleteUser(user); }} className="text-red-600 hover:underline">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {selectedUser && (
              <div className="bg-white border rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-2">Détail du client</h2>
                <div><b>Email :</b> {selectedUser.email}</div>
                <div><b>Nom :</b> {selectedUser.nom}</div>
                <div><b>Prénom :</b> {selectedUser.prenom}</div>
                <div><b>Téléphone :</b> {selectedUser.telephone}</div>
                <div><b>Adresse :</b> {selectedUser.adresse}, {selectedUser.ville}, {selectedUser.code_postal}, {selectedUser.pays}</div>
                <div><b>Rôle :</b> {selectedUser.role}</div>
                <div className="mt-4 flex gap-2">
                  {selectedUser.role !== 'disabled' ? (
                    <button onClick={() => handleDisableUser(selectedUser!)} className="bg-red-500 text-white px-3 py-1 rounded">Désactiver le compte</button>
                  ) : (
                    <button onClick={() => handleEnableUser(selectedUser!)} className="bg-green-500 text-white px-3 py-1 rounded">Réactiver le compte</button>
                  )}
                  <input type="text" placeholder="Message notification..." value={notifMessage} onChange={e => setNotifMessage(e.target.value)} className="border px-2 py-1 rounded" />
                  <button onClick={() => handleSendNotification(selectedUser!)} disabled={notifLoading || !notifMessage} className="bg-blue-500 text-white px-3 py-1 rounded">Envoyer notification</button>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Véhicules</h3>
                  <ul className="list-disc ml-6">
                    {vehicles.map(v => (
                      <li key={v.id}>
                        {v.nom || v.id} - Statut : {v.statut}
                        <button className="ml-2 text-xs bg-yellow-400 px-2 py-1 rounded" onClick={async () => { await supabase.from('vehicles').update({ statut: v.statut === 'payé' ? 'en salon' : 'payé' }).eq('id', v.id); handleSelectUser(selectedUser!); }}>Changer statut</button>
                        <button className="ml-2 text-xs bg-gray-300 px-2 py-1 rounded" onClick={async () => { await supabase.from('vehicles').update({ droits: { ...v.droits, prestige: true } }).eq('id', v.id); handleSelectUser(selectedUser!); }}>Attribuer droit prestige</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Adresses secondaires</h3>
                  <ul className="list-disc ml-6">
                    {addresses.map(a => (
                      <li key={a.id}>{a.label} : {a.adresse}, {a.ville}, {a.code_postal}, {a.pays} ({a.telephone})</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Services</h3>
                  <ul className="list-disc ml-6">
                    {services.map(s => (
                      <li key={s.id}>{s.type} - {s.statut}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Commandes</h3>
                  <ul className="list-disc ml-6">
                    {orders.map(o => (
                      <li key={o.id}>Commande #{o.id.slice(0, 6)} - Total : {o.total}€ - Statut : {o.statut}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Paiements</h3>
                  <ul className="list-disc ml-6">
                    {payments.map(p => (
                      <li key={p.id}>Paiement {p.amount}€ - Statut : {p.statut}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Notifications</h3>
                  <ul className="list-disc ml-6">
                    {notifications.map(n => (
                      <li key={n.id}>{n.titre} : {n.message} ({n.lu ? 'lu' : 'non lu'})</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Avis laissés</h3>
                  <ul className="list-disc ml-6">
                    {reviews.map(r => (
                      <li key={r.id}>Note : {r.note}/5 - {r.commentaire}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Historique d'activité</h3>
                  <ul className="list-disc ml-6">
                    {activityLogs.map(l => (
                      <li key={l.id}>{l.action} - {l.created_at}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
        {section === "admin" && (
          <div>
            <h1 className="text-3xl font-extrabold mb-8 text-yellow-400">Administration</h1>
            <ul className="mb-6 text-white">
              <li>Projet : <b>RAWRK Configurator</b></li>
              <li>Version : <b>1.0.0</b></li>
              <li>Contact : <b>admin@rawrk.com</b></li>
            </ul>
            <p className="text-gray-300">Espace réservé à l'administration générale du projet.</p>
          </div>
        )}
        {section === "modeles" && (
          <AdminCrudSection
            title="Modèles de véhicules"
            table="models"
            fields={modelFields}
            fetchRows={fetchModelsCrud}
            addRow={addModel}
            updateRow={updateModel}
            deleteRow={deleteModel}
          />
        )}
        {tab === 'fournisseurs' && (
          <AdminCrudSection
            title="Fournisseurs / Concessionnaires"
            table="suppliers"
            fields={supplierFields}
            fetchRows={fetchSuppliersCrud}
            addRow={addSupplier}
            updateRow={updateSupplier}
            deleteRow={deleteSupplier}
          />
        )}
      </main>
    </div>
  );
} 