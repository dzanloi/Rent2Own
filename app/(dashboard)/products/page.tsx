'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import {
  User,
  MessageSquare,
  Trash2,
  AlertCircle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [renterName, setRenterName] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [daysToPay, setDaysToPay] = useState('');
  const [dailyRate, setDailyRate] = useState('');

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login');
    }
  }, [sessionStatus, router]);

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
      if (data.length > 0) {
        setSelectedProductId(data[0]._id);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
      alert('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Add Product
  const handleAddProducts = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          renterName,
          productName,
          price: +price,
          daysToPay: +daysToPay,
          dailyRate: +dailyRate,
        }),
      });

      if (!res.ok) {
        alert('Failed to add product');
        return;
      }

      alert('✅ Product added!');
      setRenterName('');
      setProductName('');
      setPrice('');
      setDaysToPay('');
      setDailyRate('');

      // ✅ Refetch after adding
      await fetchProducts();
    } catch (error) {
      console.error('Failed to add product', error);
      alert('Error adding product');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Loading state
  if (sessionStatus === 'loading' || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Products Management</h1>
            <p className="text-slate-400 text-sm">Manage your products</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {products.length} Products
            </Badge>

            {/* ✅ Add Product Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/50">
                  Add Product
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add Product</AlertDialogTitle>
                  <AlertDialogDescription>Enter product details</AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleAddProducts} className="space-y-4">
                  <input value={renterName} onChange={e => setRenterName(e.target.value)} placeholder="Renter Name" required />
                  <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Product Name" required />
                  <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Total Price" type="number" required />
                  <input value={daysToPay} onChange={e => setDaysToPay(e.target.value)} placeholder="Days to Pay" type="number" required />
                  <input value={dailyRate} onChange={e => setDailyRate(e.target.value)} placeholder="Daily Rate" type="number" required />

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        Add Product
                      </button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* ✅ Products List */}
      <div className="px-6 py-6">
        {products.length > 0 ? (
          <Tabs value={selectedProductId} onValueChange={setSelectedProductId}>
            <TabsList className="bg-slate-800/50 border-slate-700 w-full h-10 mb-6">
              {products.map(product => (
                <TabsTrigger
                  key={product._id}
                  value={product._id}
                  className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-400 hover:text-white"
                >
                  {product.productName}
                </TabsTrigger>
              ))}
            </TabsList>
            {products.map(product => (
              <TabsContent key={product._id} value={product._id}>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white">{product.productName}</h3>
                  <p className="text-slate-400">Renter: {product.renterName}</p>
                  <p className="text-slate-400">Price: ₱{product.price}</p>
                  <p className="text-slate-400">Days to Pay: {product.daysToPay}</p>
                  <p className="text-slate-400">Daily Rate: ₱{product.dailyRate}</p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
            <p className="text-slate-400">Please add products</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
