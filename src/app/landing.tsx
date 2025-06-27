import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-yellow-400 to-gray-900 text-black py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">RAWRK - L'automobile d'exception, importée et préparée pour vous</h1>
        <p className="text-lg md:text-2xl mb-8">Importation, customisation et livraison de véhicules premium partout en France et Outre-mer, avec un accompagnement 100% personnalisé.</p>
        <Link href="/shop" className="bg-black text-yellow-400 px-8 py-4 rounded-full font-bold text-xl hover:bg-yellow-500 hover:text-black transition">Découvrir la boutique</Link>
      </section>
      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Mes services</h2>
          <ul className="space-y-3 text-lg">
            <li>🚗 Importation de véhicules neufs et d'occasion</li>
            <li>🛠️ Customisation & préparation sur-mesure</li>
            <li>🚚 Livraison France & Outre-mer</li>
            <li>🔒 Accompagnement administratif & logistique</li>
            <li>⭐ Expertise individuelle, relation directe</li>
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center">
          <img src="/public/images/RAWRK-LOGO.png" alt="RAWRK Logo" className="w-64 h-64 object-contain" />
        </div>
      </section>
      <section className="bg-gray-100 py-12 px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Mon engagement</h2>
        <div className="max-w-3xl mx-auto text-center text-lg text-gray-700">
          <p>Je m'engage à offrir à chaque client une expérience unique, basée sur la confiance, la transparence et la passion de l'automobile. Chaque projet est suivi personnellement, du choix du véhicule à la livraison finale.</p>
        </div>
      </section>
      <section className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Pourquoi choisir RAWRK ?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-2">Expertise</h3>
            <p>Des années d'expérience dans l'import et la préparation automobile haut de gamme, gérées de A à Z par une seule personne.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-2">Relation directe</h3>
            <p>Un interlocuteur unique, à l'écoute de vos besoins, pour un accompagnement sur-mesure et sans intermédiaire.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-2">Sérénité</h3>
            <p>Gestion complète, de l'achat à la livraison, avec transparence et sécurité.</p>
          </div>
        </div>
      </section>
      <section className="bg-yellow-400 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Prêt à vivre l'expérience RAWRK ?</h2>
        <Link href="/models" className="bg-black text-yellow-400 px-8 py-4 rounded-full font-bold text-xl hover:bg-white hover:text-black transition">Voir tous les modèles</Link>
      </section>
    </div>
  );
} 