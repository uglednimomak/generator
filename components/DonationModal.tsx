import React, { useState } from 'react';
import { Coffee, Printer, Heart } from 'lucide-react';

interface Props {
  onClose: () => void;
  onProceed: () => void;
}

const DonationModal: React.FC<Props> = ({ onClose, onProceed }) => {
  const [amount, setAmount] = useState('5');
  const [customAmount, setCustomAmount] = useState('');

  const handleProceed = () => {
    // In a real app, this would process payment. 
    // Here we just acknowledge and print.
    onProceed();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <Coffee size={32} />
          </div>
          <h2 className="text-xl font-bold">Buy me a coffee?</h2>
          <p className="text-amber-50 text-sm mt-1">
            If this tool saved you time, consider supporting its development!
          </p>
        </div>
        
        <div className="p-6 space-y-6">
           <div className="grid grid-cols-3 gap-3">
             {['3', '5', '10'].map((amt) => (
               <button
                 key={amt}
                 onClick={() => { setAmount(amt); setCustomAmount(''); }}
                 className={`py-2 rounded-lg font-bold border-2 transition-all ${
                   amount === amt && !customAmount
                     ? 'border-orange-500 bg-orange-50 text-orange-600' 
                     : 'border-gray-200 text-gray-500 hover:border-orange-200'
                 }`}
               >
                 ${amt}
               </button>
             ))}
           </div>
           
           <div className="relative">
             <span className="absolute left-3 top-2.5 text-gray-500 font-bold">$</span>
             <input 
                type="number" 
                placeholder="Other amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmount(''); }}
                className="w-full pl-8 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none font-bold text-gray-700"
             />
           </div>

           <div className="space-y-3">
             <button
                onClick={handleProceed}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
             >
               <Heart size={18} className="fill-red-500 text-red-500" />
               Support & Print
             </button>
             
             <button
                onClick={onProceed}
                className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
             >
               Skip and just print
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;