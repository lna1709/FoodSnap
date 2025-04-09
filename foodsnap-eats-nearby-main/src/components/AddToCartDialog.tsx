import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus } from 'lucide-react';
import { useCart, CartItem } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';

interface AddToCartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: number;
    name: string;
    price: number;
    image: string;
    restaurantId: string;
    restaurantName: string;
  };
}

const AddToCartDialog = ({ isOpen, onClose, item }: AddToCartDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const { addToCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...item,
      notes
    }, quantity);
    
    toast({
      title: "Item added to cart",
      description: `${quantity} × ${item.name} added to your cart.`,
    });
    
    // Reset and close
    onClose();
    setQuantity(1);
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Cart</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.restaurantName}</p>
              <p className="font-medium text-foodsnap-orange">${item.price.toFixed(2)}</p>
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Special Instructions (Optional)
            </label>
            <Textarea
              id="notes"
              placeholder="E.g., No onions, extra spicy, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center border rounded-md w-fit">
              <button 
                className="px-3 py-2 text-gray-500 hover:text-foodsnap-orange"
                onClick={() => handleQuantityChange(quantity - 1)}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button 
                className="px-3 py-2 text-gray-500 hover:text-foodsnap-orange"
                onClick={() => handleQuantityChange(quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <div className="hidden sm:block font-medium">
            Total: ${(item.price * quantity).toFixed(2)}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddToCart} 
              className="flex-1 sm:flex-initial bg-foodsnap-orange hover:bg-foodsnap-orange/90"
            >
              Add to Cart
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartDialog; 