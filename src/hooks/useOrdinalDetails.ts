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

export enum ContentType {
  Image = 'image',
  Video = 'video',
  HTML = 'html',
  Text = 'text',
  Unknown = 'unkown',
}

interface MediaContent {
  type: ContentType;
  data?: string | null;
}
const baseURL = 'https://ord.xverse.app';

const useOrdinalDetails = (address: string, inscriptionId: string) => {
  const [inscriptionDetails, setInscriptionDetails] =
    useState<InscriptionDetails | null>(null);
  const [content, setContent] = useState<any>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetailsAndContent = async () => {
      try {
        const detailsResponse = await fetch(
          `https://api-3.xverse.app/v1/address/${address}/ordinals/inscriptions/${inscriptionId}`,
        );
        if (!detailsResponse.ok) throw new Error('Failed to fetch details');
        const detailsData = await detailsResponse.json();
        setInscriptionDetails(detailsData);

        const contentResponse = await fetch(
          `https://ord.xverse.app/content/${inscriptionId}`,
        );
        if (!contentResponse.ok) throw new Error('Failed to fetch content');
        const contentType = contentResponse.headers.get('content-type');
        let contentData: MediaContent = {type: ContentType.Unknown, data: null};

        if (contentType?.includes('text/html')) {
          let htmlContent = await contentResponse.text();
          const regexPatterns = [
            /data-collection="([^"]+)"/,
            /data-src="([^"]+)"/,
            /data-p="([^"]+)"/,
            /src="([^"]+)"/,
          ];

          let imgUrl;
          for (let regex of regexPatterns) {
            const match = regex.exec(htmlContent);
            if (match) {
              imgUrl = match[1];
              if (!imgUrl.startsWith('http')) {
                if (imgUrl.startsWith('/content/')) {
                  imgUrl = `${baseURL}${imgUrl}`;
                } else {
                  imgUrl = `${baseURL}/content/${imgUrl}`;
                }
              }
              break;
            }
          }
          if (imgUrl) {
            contentData = {type: ContentType.Image, data: imgUrl};
          } else {
            contentData = {type: ContentType.HTML, data: htmlContent};
          }
        } else if (contentType?.includes('image')) {
          contentData = {type: ContentType.Image, data: contentResponse.url};
        } else if (contentType?.includes('video')) {
          contentData = {type: ContentType.Video, data: contentResponse.url};
        } else {
          const textContent = await contentResponse.text();
          contentData = {type: ContentType.Text, data: textContent};
        }
        setContent(contentData);
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Failed to fetch content');
      }
      setLoading(false);
    };

    fetchDetailsAndContent();
  }, [address, inscriptionId]);

  return {inscriptionDetails, content, loading, error};
};

export default useOrdinalDetails;
