import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserGifts } from '../firebase/gift-service';

interface Gift {
  id: string;
  name: string;
  price: number;
  giver: string;
  occasion: string;
  date: string;
  thankYouSent: boolean;
  acknowledged: boolean;
  acknowledgedDate?: string;
  reminderDate?: string;
  reminderSet: boolean;
  notes?: string;
  userId?: string;
}

interface GiverHistory {
  giver: string;
  gifts: Gift[];
  totalGiven: number;
  lastGiftDate: string;
  occasions: string[];
}

const GiftHistory: React.FC = () => {
  const { user } = useAuth();
  const [givers, setGivers] = useState<Map<string, GiverHistory>>(new Map());
  const [selectedGiver, setSelectedGiver] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [giftIdeas, setGiftIdeas] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadGiftHistory();
    }
  }, [user]);

  const loadGiftHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        setError('Please log in to view gift history');
        return;
      }

      const gifts = await getUserGifts(user.id);
      
      // Process gifts to organize by giver
      const giversMap = new Map<string, GiverHistory>();
      
      gifts.forEach(gift => {
        const giver = gift.giver.trim();
        if (!giver) return; // Skip gifts with no giver
        
        if (!giversMap.has(giver)) {
          giversMap.set(giver, {
            giver,
            gifts: [],
            totalGiven: 0,
            lastGiftDate: '',
            occasions: []
          });
        }
        
        const giverHistory = giversMap.get(giver)!;
        giverHistory.gifts.push(gift);
        giverHistory.totalGiven += gift.price || 0;
        
        // Track unique occasions
        if (gift.occasion && !giverHistory.occasions.includes(gift.occasion)) {
          giverHistory.occasions.push(gift.occasion);
        }
        
        // Update last gift date if this gift is more recent
        if (!giverHistory.lastGiftDate || new Date(gift.date) > new Date(giverHistory.lastGiftDate)) {
          giverHistory.lastGiftDate = gift.date;
        }
      });
      
      setGivers(giversMap);
      
      // If there are givers, select the first one by default
      if (giversMap.size > 0) {
        setSelectedGiver(Array.from(giversMap.keys())[0]);
      }
    } catch (err: any) {
      console.error('Error loading gift history:', err);
      setError(err.message || 'Failed to load gift history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGiverSelect = (giver: string) => {
    setSelectedGiver(giver);
    generateGiftIdeas(giver);
  };

  const generateGiftIdeas = (giver: string) => {
    const giverData = givers.get(giver);
    if (!giverData) return;
    
    // Simple algorithm to suggest gift ideas based on past gifts and occasions
    const ideas: string[] = [];
    
    // Check occasions they've given gifts for
    const occasions = giverData.occasions;
    
    // Check types of gifts they've given (basic categorization)
    const giftTypes = new Set<string>();
    giverData.gifts.forEach(gift => {
      // Simple categorization based on gift name
      const name = gift.name.toLowerCase();
      if (name.includes('book') || name.includes('novel')) giftTypes.add('books');
      if (name.includes('shirt') || name.includes('sweater') || name.includes('jacket')) giftTypes.add('clothing');
      if (name.includes('game') || name.includes('puzzle')) giftTypes.add('games');
      if (name.includes('gift card') || name.includes('voucher')) giftTypes.add('gift cards');
      if (name.includes('jewelry') || name.includes('necklace') || name.includes('bracelet')) giftTypes.add('jewelry');
    });
    
    // Generate ideas based on their gift-giving patterns
    if (giftTypes.has('books')) {
      ideas.push('A bestselling novel');
      ideas.push('A cookbook for their favorite cuisine');
    }
    
    if (giftTypes.has('clothing')) {
      ideas.push('A stylish accessory');
      ideas.push('A quality sweater or jacket');
    }
    
    if (giftTypes.has('games')) {
      ideas.push('A new board game');
      ideas.push('A puzzle or brain teaser');
    }
    
    if (giftTypes.has('gift cards')) {
      ideas.push('A gift card to their favorite store');
      ideas.push('A subscription service related to their interests');
    }
    
    if (giftTypes.has('jewelry')) {
      ideas.push('A tasteful piece of jewelry');
      ideas.push('A watch or other elegant accessory');
    }
    
    // If we don't have enough specific ideas, add some generic ones
    if (ideas.length < 3) {
      ideas.push('A personalized item with their name or initials');
      ideas.push('An experience gift like concert tickets or a class');
      ideas.push('A high-quality version of something they use daily');
    }
    
    // Consider occasion patterns
    if (occasions.includes('birthday')) {
      ideas.push('A birthday experience like tickets to an event');
    }
    
    if (occasions.includes('wedding')) {
      ideas.push('A home décor item they would appreciate');
    }
    
    if (occasions.includes('holiday')) {
      ideas.push('A seasonal decoration or festive item');
    }
    
    setGiftIdeas(ideas.slice(0, 5)); // Limit to 5 ideas
  };

  const filteredGivers = searchTerm
    ? Array.from(givers.keys()).filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase()))
    : Array.from(givers.keys());

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Gift History by Person</h2>
      
      {isLoading ? (
        <div className="flex justify-center">
          <p className="text-gray-500">Loading gift history...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      ) : givers.size === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
          No gift history found. Add gifts with givers to see their history.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar - giver list */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search givers..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredGivers.map(giver => {
                  const giverData = givers.get(giver)!;
                  return (
                    <button
                      key={giver}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedGiver === giver ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
                      onClick={() => handleGiverSelect(giver)}
                    >
                      <div className="font-medium">{giver}</div>
                      <div className="text-sm text-gray-500">
                        {giverData.gifts.length} gift{giverData.gifts.length !== 1 ? 's' : ''} · ${giverData.totalGiven.toFixed(2)} total
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Right content - gift details */}
          {selectedGiver && (
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-2">{selectedGiver}</h3>
                <p className="text-gray-600 mb-6">Last gift: {givers.get(selectedGiver)?.lastGiftDate ? new Date(givers.get(selectedGiver)!.lastGiftDate).toLocaleDateString() : 'N/A'}</p>
                
                {/* Gift history table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gift</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occasion</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanked</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {givers.get(selectedGiver)?.gifts.map(gift => (
                        <tr key={gift.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{gift.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{gift.occasion}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(gift.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${gift.price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {gift.thankYouSent ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                No
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Gift ideas section */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-3">Gift Ideas for {selectedGiver}</h4>
                  {giftIdeas.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {giftIdeas.map((idea, index) => (
                        <li key={index} className="text-gray-700">{idea}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No personalized gift ideas available yet. Add more gifts to generate ideas.</p>
                  )}
                </div>
                
                {/* Re-gifting warning section */}
                <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <h4 className="text-md font-semibold flex items-center text-yellow-800">
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Re-gifting Prevention
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Avoid re-gifting something {selectedGiver} has given you, especially recent items or items of sentimental value.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GiftHistory;
