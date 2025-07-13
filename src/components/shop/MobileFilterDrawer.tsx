import React from 'react';
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai';
import { useShopFilter } from '@/context/ShopFilterContext';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          ></div>
          
          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            
            {/* Mobile filters content here - similar to sidebar but adapted for mobile */}
            <div className="space-y-6">
              {/* This would contain the same filter components as FilterSidebar */}
              <p className="text-gray-500">Mobile filters will go here (same as sidebar)</p>
              
              <button 
                className="bg-gray-900 text-white w-full rounded py-3 text-sm hover:bg-gray-800 transition mt-4"
                onClick={onClose}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilterDrawer; 