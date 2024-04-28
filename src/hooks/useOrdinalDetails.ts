import {useEffect, useState} from 'react';

export interface InscriptionDetails {
  id: string;
  number: number;
  address: string;
  genesis_address: string;
  genesis_block_height: number;
  genesis_block_hash: string;
  genesis_tx_id: string;
  genesis_fee: number;
  genesis_timestamp: number;
  location: string;
  output: string;
  offset: number;
  sat_ordinal: number;
  sat_rarity: string;
  sat_coinbase_height: number;
  mime_type: string;
  content_type: string;
  content_length: number;
  tx_id: string;
  timestamp: number;
  value: number;
}

const useOrdinalDetails = (address: string, inscriptionId: string) => {
  const [inscriptionDetails, setInscriptionDetails] =
    useState<InscriptionDetails | null>(null);
  const [content, setContent] = useState<any>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInscriptionDetails = async () => {
      try {
        const response = await fetch(
          `https://api-3.xverse.app/v1/address/${address}/ordinals/inscriptions/${inscriptionId}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch inscription details');
        }
        const data = await response.json();
        setInscriptionDetails(data);

        const contentResponse = await fetchInscriptionContent(inscriptionId);
        setContent(contentResponse);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching inscription details:', error);
        setError('Failed to fetch inscription details');
        setLoading(false);
      }
    };

    fetchInscriptionDetails();
    return () => setLoading(false);
  }, [address, inscriptionId]);

  const fetchInscriptionContent = async (inscriptionId: string) => {
    try {
      const response = await fetch(
        `https://ord.xverse.app/content/${inscriptionId}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const content = await response.json();
        return content;
      } else if (contentType?.includes('image')) {
        return response;
      } else if (contentType?.includes('text')) {
        const content = await response.text();
        return content;
      } else if (contentType?.includes('video/mp4')) {
        return response;
      } else {
        console.warn('Unknown content type:', contentType);
        return null;
      }
    } catch (error) {
      console.error('Error fetching inscription content:', error);
      setError('Failed to fetch content');
      return null;
    }
  };

  return {inscriptionDetails, content, loading, error};
};

export default useOrdinalDetails;
