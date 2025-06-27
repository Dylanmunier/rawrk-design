import Link from "next/link";

export default function CommercialDashboard() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Commercial</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/commercial/orders" className="p-6 border rounded shadow hover:bg-gray-50">
          Commandes
        </Link>
        <Link href="/commercial/customers" className="p-6 border rounded shadow hover:bg-gray-50">
          Clients
        </Link>
        <Link href="/commercial/vendors" className="p-6 border rounded shadow hover:bg-gray-50">
          Fournisseurs
        </Link>
        <Link href="/commercial/products" className="p-6 border rounded shadow hover:bg-gray-50">
          Modèles personnalisés
        </Link>
        <Link href="/commercial/dropshipping" className="p-6 border rounded shadow hover:bg-gray-50">
          Dropshipping
        </Link>
      </div>
    </div>
  );
} 