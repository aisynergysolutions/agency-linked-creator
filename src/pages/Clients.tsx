import React, { useMemo, useCallback, useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClientCard from '../components/ui/ClientCard';
import LoadingGrid from '../components/common/LoadingGrid';
import AddClientModal from '../components/AddClientModal';
import ClientsSkeleton from '../skeletons/ClientsSkeleton';
import { useSearchAndFilter } from '../hooks/useSearchAndFilter';
import { useClients } from '../context/ClientsContext';
import { ClientCard as ClientCardType } from '../context/ClientsContext';
import { Timestamp } from 'firebase/firestore';

const Clients = () => {
  const { clients: clientCards, loading: isLoading } = useClients();

  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredClients,
    hasResults
  } = useSearchAndFilter({
    items: clientCards,
    searchFields: ['name', 'oneLiner', 'status'],
    filterFn: useCallback((client: ClientCardType, query: string) => {
      return (
        client.name.toLowerCase().includes(query) ||
        client.oneLiner?.toLowerCase().includes(query) ||
        client.status.toLowerCase().includes(query)
      );
    }, [])
  });

  // Onboarding modal state
  const [onboardingModalClient, setOnboardingModalClient] = useState<ClientCardType | null>(null);

  const handleCardClick = (client: ClientCardType) => {
    if (client.status === 'onboarding') {
      setOnboardingModalClient(client);
    }
  };

  const memoizedClientCards = useMemo(() => {
    return filteredClients.map((client) => {
      console.log("Rendering client card:", client); // Debug: client card props
      return (
        <div key={client.id} onClick={() => handleCardClick(client)}>
          <ClientCard
            client={{
              id: client.id,
              clientName: client.name,
              brandBriefSummary: client.oneLiner,
              status: client.status,
              updatedAt: Timestamp.fromMillis(client.updatedAt * 1000),
              onboarding_link: client.onboarding_link,
              industry: '', // placeholder
              contactName: '', // placeholder
              contactEmail: '', // placeholder
              createdAt: Timestamp.fromMillis(0), // placeholder
              agencyId: '', // placeholder
              hard_facts: {}, // placeholder
              subClients: [], // placeholder
              aiTraining: {
                status: 'pending_data',
                lastTrainedAt: Timestamp.fromMillis(0),
                modelVersion: ''
              }
            }}
          />
        </div>
      );
    });
  }, [filteredClients]);

  if (isLoading) {
    return <ClientsSkeleton count={9} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <AddClientModal onAddClient={() => { }}>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Client
          </Button>
        </AddClientModal>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search clients by name, summary, or status..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* No clients message */}
      {!isLoading && clientCards.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg font-medium">No clients yet</p>
          <p className="text-sm mt-2">Get started by adding your first client</p>
        </div>
      )}

      {/* Client cards grid */}
      {clientCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memoizedClientCards}
        </div>
      )}

      {/* No search results message */}
      {!hasResults && searchQuery && clientCards.length > 0 && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-lg font-medium">No clients found</p>
          <p className="text-sm">Try adjusting your search terms or add a new client</p>
        </div>
      )}
    </div>
  );
};

export default Clients;
