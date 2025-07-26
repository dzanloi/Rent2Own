'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import {
  User,
  MessageSquare,
  Trash2,
  AlertCircle,
  CalendarIcon,
  Plus,
  Calculator
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format, differenceInDays, addDays } from 'date-fns';

const Page = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form States
  const [renterName, setRenterName] = useState('');
  const [productName, setProductName] = useState('Battery');
  const [productPrice, setProductPrice] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Calculated values
  const totalDays = startDate && endDate ? Math.abs(differenceInDays(endDate, startDate)) + 1 : 0;
  const calculatedTotal = dailyRate && totalDays > 0 ? (parseFloat(dailyRate) * totalDays).toFixed(2) : '0.00';

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

  // ✅ Reset form
  const resetForm = () => {
    setRenterName('');
    setProductName('Battery');
    setProductPrice('');
    setDailyRate('');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  // ✅ Add Product
  const handleAddProducts = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (!renterName.trim()) {
      alert("Please enter renter's name");
      return;
    }

    if (endDate && startDate && endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          renterName: renterName.trim(),
          productName,
          price: parseFloat(productPrice || calculatedTotal),
          daysToPay: totalDays,
          dailyRate: parseFloat(dailyRate),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed to add product: ${errorData.message || 'Unknown error'}`);
        return;
      }

      alert('✅ Product added successfully!');
      resetForm();
      setIsDialogOpen(false);

      // ✅ Refetch after adding
      await fetchProducts();
    } catch (error) {
      console.error('Failed to add product', error);
      alert('Error adding product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle daily rate change and auto-calculate total
  const handleDailyRateChange = (value: string) => {
    setDailyRate(value);
    // If user hasn't manually set a product price, use calculated total
    if (!productPrice) {
      // The calculatedTotal will be updated automatically due to the dependency
    }
  };

  // ✅ Loading state
  if (sessionStatus === 'loading') {
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
            <p className="text-slate-400 text-sm">Manage your rental products</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
              {products.length} Product{products.length !== 1 ? 's' : ''}
            </Badge>

            {/* ✅ Improved Add Product Dialog */}
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="max-w-2xl bg-slate-900 border-slate-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add New Rental Product
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    Fill in the rental details below. The total will be calculated automatically.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleAddProducts} className="space-y-6">
                  {/* Renter Information */}
                  <div className="space-y-2">
                    <Label htmlFor="renterName" className="text-white flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Renter's Name
                    </Label>
                    <Input
                      id="renterName"
                      value={renterName}
                      onChange={(e) => setRenterName(e.target.value)}
                      placeholder="Enter renter's full name"
                      required
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    />
                  </div>

                  {/* Product Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="productSelect" className="text-white">
                      Product Type
                    </Label>
                    <select
                      id="productSelect"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full rounded-md border border-slate-600 bg-slate-800 text-white p-3 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Battery">Battery</option>
                      <option value="E-Trike">E-Trike</option>
                      <option value="Wheels">Wheels</option>
                    </select>
                  </div>

                  {/* Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div className="space-y-2">
                      <Label className="text-white">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-between bg-slate-800 border-slate-600 text-white hover:bg-slate-700",
                              !startDate && "text-slate-400"
                            )}
                          >
                            {startDate ? format(startDate, 'MMM dd, yyyy') : "Select start date"}
                            <CalendarIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                      <Label className="text-white">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-between bg-slate-800 border-slate-600 text-white hover:bg-slate-700",
                              !endDate && "text-slate-400"
                            )}
                          >
                            {endDate ? format(endDate, 'MMM dd, yyyy') : "Select end date"}
                            <CalendarIcon className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Rental Duration Display */}
                  {totalDays > 0 && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-blue-300 text-sm flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Rental Duration: <span className="font-semibold">{totalDays} day{totalDays !== 1 ? 's' : ''}</span>
                      </p>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dailyRate" className="text-white">
                        Daily Rate (₱)
                      </Label>
                      <Input
                        id="dailyRate"
                        value={dailyRate}
                        onChange={(e) => handleDailyRateChange(e.target.value)}
                        placeholder="0.00"
                        type="text"
                        step="0.01"
                        min="0"
                        required
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productPrice" className="text-white">
                        Total Price (₱)
                      </Label>
                      <div className="relative">
                        <Input
                          id="productPrice"
                          value={productPrice || calculatedTotal}
                          onChange={(e) => setProductPrice(e.target.value)}
                          placeholder="Auto-calculated"
                          type="text"
                          step="0.01"
                          min="0"
                          className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                        />
                        {!productPrice && calculatedTotal !== '0.00' && (
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <span className="text-xs text-green-400">Auto</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <AlertDialogFooter className="gap-3">
                    <AlertDialogCancel
                      onClick={resetForm}
                      className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Adding...' : 'Add Product'}
                      </Button>
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
        {isLoading && products.length === 0 ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-400">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <Tabs value={selectedProductId} onValueChange={setSelectedProductId}>
            <TabsList className="bg-slate-800/50 border-slate-700 w-full h-12 mb-6">
              {products.map(product => (
                <TabsTrigger
                  key={product._id}
                  value={product._id}
                  className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 text-slate-400 hover:text-white transition-colors"
                >
                  {product.productName} - {product.renterName}
                </TabsTrigger>
              ))}
            </TabsList>

            {products.map(product => (
              <TabsContent key={product._id} value={product._id}>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{product.productName}</h3>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Active Rental
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-slate-500 text-sm">Renter</p>
                      <p className="text-white font-medium">{product.renterName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500 text-sm">Total Price</p>
                      <p className="text-white font-medium">₱{product.price?.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500 text-sm">Duration</p>
                      <p className="text-white font-medium">{product.daysToPay} day{product.daysToPay !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500 text-sm">Daily Rate</p>
                      <p className="text-white font-medium">₱{product.dailyRate?.toLocaleString()}</p>
                    </div>
                  </div>

                  {product.startDate && product.endDate && (
                    <div className="border-t border-slate-700 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-slate-500 text-sm">Start Date</p>
                          <p className="text-white">{format(new Date(product.startDate), 'MMM dd, yyyy')}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-500 text-sm">End Date</p>
                          <p className="text-white">{format(new Date(product.endDate), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                    </div>
                  )}
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
            <p className="text-slate-400 mb-4">Get started by adding your first rental product</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
