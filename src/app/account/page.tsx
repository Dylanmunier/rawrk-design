"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type VehicleService = {
  id: string;
  type: string;
  statut: string;
  description?: string;
};
type Payment = {
  id: string;
  statut: string;
};
type Vehicle = {
  id: string;
  nom?: string;
  statut?: string;
  droits?: any;
  vehicle_services?: VehicleService[];
  payments?: Payment[];
};

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      setOrdersLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("id, total, date, items")
        .eq("client_email", user.email)
        .order("date", { ascending: false });
      if (!error && data) setOrders(data);
      setOrdersLoading(false);
    };
    if (user?.email) fetchOrders();
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const { data: vehicles } = await supabase
          .from('vehicles')
          .select('*, vehicle_services(*), payments(*), pending_orders(*)')
          .eq('user_id', user.id);
        setVehicles(vehicles || []);
      }
    }
    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-yellow-400">Chargement...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="bg-white/95 p-8 rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Mon espace client</h1>
        <div className="mb-4 text-lg text-gray-700">Bienvenue, <span className="font-bold text-yellow-500">{user?.email}</span></div>
        <button onClick={handleLogout} className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-6 rounded font-bold transition mb-8">Se déconnecter</button>
        <h2 className="text-xl font-bold mb-4 text-gray-900">Mes commandes</h2>
        {ordersLoading ? (
          <div className="text-yellow-400">Chargement des commandes...</div>
        ) : orders.length === 0 ? (
          <div className="text-gray-400">Aucune commande trouvée.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-900/80 rounded-xl shadow border border-gray-800 text-left">
              <thead>
                <tr className="border-b border-gray-700 text-yellow-400">
                  <th className="p-3">#</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Articles</th>
                  <th className="p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition">
                    <td className="p-3 text-white">{orders.length - idx}</td>
                    <td className="p-3 text-gray-300">{order.date}</td>
                    <td className="p-3 text-white">
                      <ul className="list-disc pl-4">
                        {order.items && Array.isArray(order.items) ? order.items.map((item: any) => (
                          <li key={item.id}>{item.name} x{item.quantity}</li>
                        )) : null}
                      </ul>
                    </td>
                    <td className="p-3 text-yellow-400 font-bold">{order.total} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900">Mon Garage</h2>
        {vehicles.length === 0 ? (
          <div>Aucun véhicule enregistré.</div>
        ) : (
          vehicles.map(vehicle => (
            <div key={vehicle.id} className="border rounded-lg p-4 mb-6 bg-white shadow">
              <h2 className="text-xl font-semibold">{vehicle.nom || 'Véhicule #' + vehicle.id.slice(0, 6)}</h2>
              <div className="text-gray-600">Statut : <b>{vehicle.statut}</b></div>
              <div className="text-gray-600">Droits : <b>{vehicle.droits ? JSON.stringify(vehicle.droits) : 'Standard'}</b></div>
              <div className="mt-2">
                <b>Services associés :</b>
                <ul className="list-disc ml-6">
                  {vehicle.vehicle_services?.map(service => (
                    <li key={service.id} className="mb-1">
                      {service.type} - {service.statut}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <b>Paiement :</b> {vehicle.payments?.[0]?.statut || 'Non payé'}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Service après-vente</button>
                <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Service automobile</button>
                <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Service usager</button>
                <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Service prestige</button>
                <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Révision</button>
                <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Événementiel</button>
                <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Certificat</button>
                <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Urgence</button>
                <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">Assurance tiers</button>
                <button className="bg-blue-500 px-3 py-1 rounded text-white hover:bg-blue-600">Mettre en salon prestige/événementiel</button>
              </div>
              <div className="mt-4 text-xs text-gray-400">Page expérimentale - affichage véhicule et services personnalisés</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 