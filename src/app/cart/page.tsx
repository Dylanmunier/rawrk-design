"use client";
import dynamic from 'next/dynamic'

const CartPageClient = dynamic(() => import('@/components/CartPageClient'), { 
    ssr: false,
    loading: () => <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[60vh]"><p>Loading cart...</p></div>
})

export default function CartPage() {
    return <CartPageClient />
}
