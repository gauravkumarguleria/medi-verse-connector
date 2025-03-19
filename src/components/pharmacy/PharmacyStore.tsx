
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  X, 
  ShoppingBag 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PharmacyProduct, pharmacyProducts } from '@/data/pharmacyProducts';

const PharmacyStore: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{product: PharmacyProduct; quantity: number}[]>([]);
  
  // Calculate total items in cart
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate total price
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Filter products based on search and category
  const filteredProducts = pharmacyProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Add product to cart
  const addToCart = (product: PharmacyProduct) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Product already in cart, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Add new product to cart
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  // Update cart item quantity
  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };
  
  // Checkout
  const checkout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Order placed successfully!",
      description: "Your order has been placed and will be delivered soon.",
    });
    
    setCart([]);
  };
  
  // Get unique categories
  const categories = ['all', ...new Set(pharmacyProducts.map(product => product.category))];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pharmacy Store</h1>
          <p className="text-muted-foreground">Browse and purchase medications and health products</p>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button className="mt-4 md:mt-0 relative" variant="outline">
              <ShoppingCart className="mr-2 h-5 w-5" />
              <span>Cart</span>
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Your Cart
              </SheetTitle>
            </SheetHeader>
            
            {cart.length > 0 ? (
              <>
                <ScrollArea className="h-[65vh] my-4 pr-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between py-4 border-b">
                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 ml-2"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                
                <div className="space-y-4">
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={clearCart} variant="outline" className="flex-1">
                      Clear Cart
                    </Button>
                    <Button onClick={checkout} className="flex-1">
                      Checkout
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <SheetTrigger asChild>
                  <Button>Start Shopping</Button>
                </SheetTrigger>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <div className="aspect-square relative bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="object-cover w-full h-full" 
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-500">
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mr-2">
                    {product.category}
                  </Badge>
                  {product.prescription ? (
                    <Badge variant="secondary">Prescription Required</Badge>
                  ) : null}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center pt-2">
                <div className="font-medium">
                  ${product.price.toFixed(2)}
                </div>
                <Button onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default PharmacyStore;
