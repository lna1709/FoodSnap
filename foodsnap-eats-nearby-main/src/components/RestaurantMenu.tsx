import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import AddToCartDialog from "./AddToCartDialog";
import { useParams } from "react-router-dom";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

interface RestaurantMenuProps {
  menu: MenuCategory[];
  highlightedDishId?: string | null;
  restaurantName: string;
}

const RestaurantMenu = ({ menu, highlightedDishId, restaurantName }: RestaurantMenuProps) => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const highlightedDishRef = useRef<HTMLDivElement | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Scroll to highlighted dish if dishId is provided
  useEffect(() => {
    if (highlightedDishId && highlightedDishRef.current) {
      highlightedDishRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedDishId, highlightedDishRef]);

  const handleAddToCart = (item: MenuItem) => {
    setSelectedItem({
      id: parseInt(item.id),
      name: item.name,
      price: item.price,
      image: item.image || 'https://placehold.co/600x400?text=No+Image',
      restaurantId: restaurantId || '1',
      restaurantName: restaurantName
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {menu.map((category, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
            {category.category}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.items.map((item) => {
              const isHighlighted = item.id === highlightedDishId;
              return (
                <div 
                  key={item.id} 
                  ref={isHighlighted ? highlightedDishRef : null}
                >
                  <Card 
                    className={`overflow-hidden transition-all duration-300 ${
                      isHighlighted 
                        ? 'ring-2 ring-foodsnap-teal ring-offset-2 shadow-lg animate-pulse' 
                        : ''
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="flex-1 p-4">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                            <span className="font-medium text-foodsnap-orange">${item.price.toFixed(2)}</span>
                          </div>
                          
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-foodsnap-teal hover:text-foodsnap-teal/80 hover:bg-foodsnap-teal/10 p-0 h-auto"
                            onClick={() => handleAddToCart(item)}
                          >
                            <PlusCircle size={16} className="mr-1" /> Add to cart
                          </Button>
                        </div>
                        
                        {item.image && (
                          <div className="w-24 h-24 flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {selectedItem && (
        <AddToCartDialog 
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          item={selectedItem}
        />
      )}
    </div>
  );
};

export default RestaurantMenu;
