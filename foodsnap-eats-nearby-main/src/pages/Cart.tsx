import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ChevronRight, PencilIcon } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCart } from '@/context/CartContext';

// Mock cart data
const mockCartItems = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    price: 9.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    notes: "No pickles, extra cheese",
    restaurantId: "1",
    restaurantName: "Burger Palace"
  },
  {
    id: 2,
    name: "French Fries",
    price: 3.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    notes: "",
    restaurantId: "1",
    restaurantName: "Burger Palace"
  },
  {
    id: 3,
    name: "Chocolate Milkshake",
    price: 4.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    notes: "Extra whipped cream",
    restaurantId: "1",
    restaurantName: "Burger Palace"
  }
];

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, updateNotes, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedNote, setEditedNote] = useState("");

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const discount = appliedPromo?.discount || 0;
  const total = subtotal + deliveryFee - discount;

  // Apply promo code
  const applyPromoCode = () => {
    // Mock promo code validation
    if (promoCode.toUpperCase() === "WELCOME20") {
      setAppliedPromo({ code: "WELCOME20", discount: subtotal * 0.2 });
    } else if (promoCode.toUpperCase() === "FREESHIP") {
      setAppliedPromo({ code: "FREESHIP", discount: deliveryFee });
    } else {
      alert("Invalid promo code");
    }
  };

  // Open edit notes dialog
  const openEditNotes = (id: number, currentNote: string) => {
    setEditingNoteId(id);
    setEditedNote(currentNote);
  };

  // Save edited notes
  const saveNotes = () => {
    if (editingNoteId !== null) {
      updateNotes(editingNoteId, editedNote);
      setEditingNoteId(null);
      setEditedNote("");
    }
  };

  // Get restaurant ID for linking
  const restaurantId = cartItems.length > 0 ? cartItems[0].restaurantId : "";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
          {cartItems.length > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-foodsnap-lightText">
                Items from {cartItems[0].restaurantName}
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={clearCart}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
          
          {cartItems.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 p-3 rounded-md mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <p className="text-sm">You can only order from one restaurant at a time. Adding items from a different restaurant will clear your current cart.</p>
            </div>
          )}
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                  
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id}>
                        <div className="flex gap-4">
                          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{item.name}</h3>
                              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center border rounded-md">
                                <button 
                                  className="px-2 py-1 text-gray-500 hover:text-foodsnap-orange"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-3 py-1">{item.quantity}</span>
                                <button 
                                  className="px-2 py-1 text-gray-500 hover:text-foodsnap-orange"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-foodsnap-teal hover:text-foodsnap-teal/80 hover:bg-foodsnap-teal/10"
                                  onClick={() => openEditNotes(item.id, item.notes)}
                                >
                                  <PencilIcon size={16} />
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </div>
                            
                            {item.notes && (
                              <p className="text-gray-500 text-sm mt-2">Note: {item.notes}</p>
                            )}
                          </div>
                        </div>
                        <Separator className="mt-4" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                {/* Promotions */}
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Promo Code</h2>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-grow"
                      />
                      <Button 
                        variant="outline" 
                        className="border-foodsnap-teal text-foodsnap-teal hover:bg-foodsnap-teal hover:text-white"
                        onClick={applyPromoCode}
                      >
                        Apply
                      </Button>
                    </div>
                    
                    {appliedPromo && (
                      <div className="flex justify-between items-center mt-4 p-2 bg-foodsnap-teal/10 text-foodsnap-teal rounded">
                        <div className="flex items-center">
                          <Tag size={16} className="mr-2" />
                          <span>{appliedPromo.code}</span>
                        </div>
                        <span>-${appliedPromo.discount.toFixed(2)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Order Summary */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-foodsnap-teal">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-6 bg-foodsnap-orange hover:bg-foodsnap-orange/90">
                      Proceed to Checkout
                    </Button>
                    
                    <Link to={`/restaurant/${restaurantId}`} className="block text-center mt-4 text-foodsnap-teal">
                      <span className="flex items-center justify-center">
                        Add more items
                        <ChevronRight size={16} className="ml-1" />
                      </span>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-foodsnap-lightText mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/">
              <Button className="bg-foodsnap-orange hover:bg-foodsnap-orange/90">
                Browse Restaurants
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />

      {/* Edit Notes Dialog */}
      <Dialog open={editingNoteId !== null} onOpenChange={() => setEditingNoteId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Special Instructions</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="E.g., No onions, extra spicy, etc."
              value={editedNote}
              onChange={(e) => setEditedNote(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditingNoteId(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveNotes}
              className="bg-foodsnap-orange hover:bg-foodsnap-orange/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart; 