"use client";
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from 'next/navigation';

function saveOrder(order: any) {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const router = useRouter();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [checkout, setCheckout] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order = {
      id: Date.now(),
      client: form,
      items: cart,
      total,
      date: new Date().toLocaleString(),
    };
    saveOrder(order);
    setOrderSent(true);
    clearCart();
  };

  function handleCheckout() {
    router.push('/checkout');
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8 text-yellow-400">Mon Panier</h1>
      {orderSent ? (
        <div className="text-center text-green-500">
          <h2 className="text-2xl font-bold mb-4">Merci pour votre commande !</h2>
          <p>Un email de confirmation vous sera envoyé prochainement.</p>
          <Link href="/shop" className="mt-6 inline-block text-yellow-400 underline">Retourner à la boutique</Link>
        </div>
      ) : checkout ? (
        <form onSubmit={handleOrder} className="max-w-lg mx-auto bg-gray-900/80 rounded-xl shadow border border-gray-800 p-8">
          <h2 className="text-xl font-bold mb-6 text-yellow-400">Informations de livraison</h2>
          <div className="mb-4">
            <label className="block text-white mb-1">Nom complet</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full p-2 rounded border-2 border-yellow-400 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full p-2 rounded border-2 border-yellow-400 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Téléphone</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className="w-full p-2 rounded border-2 border-yellow-400 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-1">Adresse de livraison</label>
            <input name="address" value={form.address} onChange={handleChange} required className="w-full p-2 rounded border-2 border-yellow-400 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg text-white">Total : <span className="text-yellow-400 font-bold">{total} €</span></span>
            <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-xl">Confirmer la commande</Button>
          </div>
          <Button type="button" variant="outline" onClick={() => setCheckout(false)}>Retour au panier</Button>
        </form>
      ) : cart.length === 0 ? (
        <div className="text-center text-gray-400">
          <p className="mb-4">Votre panier est vide.</p>
          <Link href="/shop" className="text-yellow-400 underline">Retourner à la boutique</Link>
        </div>
      ) : (
        <div className="bg-gray-900/80 rounded-xl shadow border border-gray-800 p-6">
          <table className="w-full mb-6">
            <thead>
              <tr className="text-yellow-400 border-b border-gray-700">
                <th className="p-3 text-left">Produit</th>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Prix</th>
                <th className="p-3 text-left">Quantité</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition">
                  <td className="p-3"><Image src={item.image} alt={item.name} width={80} height={50} className="rounded shadow border border-gray-700" /></td>
                  <td className="p-3 text-white font-semibold">{item.name}</td>
                  <td className="p-3 text-yellow-300 font-bold">{item.price} €</td>
                  <td className="p-3 text-white">
                    <input type="number" min={1} value={item.quantity} onChange={e => updateQuantity(item.id, Number(e.target.value))} className="w-16 border rounded px-2 py-1" />
                  </td>
                  <td className="p-3 text-yellow-400 font-bold">{item.price * item.quantity} €</td>
                  <td className="p-3 text-center">
                    <Button variant="destructive" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center">
            <div>
              <Button variant="outline" onClick={clearCart}>Vider le panier</Button>
            </div>
            <div className="text-2xl font-bold text-yellow-400">Total : {total} €</div>
          </div>
          <div className="mt-8 text-right">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-xl" onClick={handleCheckout}>Passer la commande</Button>
          </div>
        </div>
      )}
    </div>
  );
} 