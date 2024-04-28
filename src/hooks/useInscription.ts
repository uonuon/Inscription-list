import {useState, useEffect, useCallback} from 'react';

export interface Inscription {
  id: string;
  content_type: string;
}

interface InscriptionResult {
  inscriptions: Inscription[];
}

interface ApiResponse {
  limit: number;
  offset: number;
  total: number;
  results: InscriptionResult[];
}

export type UseInscriptionsResult = {
  inscriptions: Inscription[];
  loading: boolean;
  loadMore: () => void;
  error: string | null;
};

const useInscriptions = (address: string): UseInscriptionsResult => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchInscriptions = useCallback(async () => {
    setLoading(true);
    try {
      if (address) {
        const offset = (page - 1) * 30;
        const response = await fetch(
          `https://api-3.xverse.app/v1/address/${address}/ordinal-utxo?page=${page}&offset=${offset}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data: ApiResponse = await response.json();
        setTotalPages(Math.ceil(data.total / 30));
        const newInscriptions: Inscription[] = [];
        data.results.forEach(result => {
          if (result.inscriptions) {
            result.inscriptions.forEach(inscription => {
              newInscriptions.push(inscription);
            });
          }
        });
        if (page === 1) {
          setInscriptions(newInscriptions);
        } else {
          setInscriptions(prevInscriptions => [
            ...prevInscriptions,
            ...newInscriptions,
          ]);
        }
      } else {
        resetInscription();
      }
    } catch (error) {
      resetInscription();
      setError(
        'Looks like the address is not valid, please try to search for actual bitcoin address',
      );
    } finally {
      setLoading(false);
    }
  }, [address, page]);

  const resetInscription = () => {
    setInscriptions([]);
    setPage(1);
    setTotalPages(0);
    setError('');
  };

  useEffect(() => {
    fetchInscriptions();
  }, [fetchInscriptions, address]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return {inscriptions, loading, error, loadMore};
};

export default useInscriptions;
