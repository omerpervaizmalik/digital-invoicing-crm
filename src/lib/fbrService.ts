import { HttpsProxyAgent } from 'https-proxy-agent';
import fetch from 'node-fetch';

interface FbrConfig {
  posId: string;
  fbrToken: string;
  environment: 'SANDBOX' | 'PRODUCTION';
}

const getAgent = () => {
  const proxyUrl = process.env.PROXY_URL;
  return proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;
};

const getBaseUrl = (environment: string) => {
  return environment === 'PRODUCTION'
    ? 'https://gw.fbr.gov.pk/di_data/v1/di'
    : 'https://gw.fbr.gov.pk/di_data/v1/di'; // Same base URL according to docs, routing handled by token
};

/**
 * Pings the FBR Sandbox to verify the static IP and token are working.
 */
export async function testFbrConnection(config: FbrConfig): Promise<boolean> {
  // Using the /provinces GET endpoint as a simple auth check
  const url = `https://gw.fbr.gov.pk/pdi/v1/provinces`; 

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.fbrToken}`,
        'Content-Type': 'application/json',
      },
      agent: getAgent(),
    });

    if (!response.ok) {
      console.error(`FBR Auth Error: ${response.status} ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('FBR Connection Error:', error);
    return false;
  }
}

/**
 * Maps and transmits the Invoice payload to the FBR /postinvoicedata endpoint.
 */
export async function transmitInvoiceToFBR(config: FbrConfig, payload: any): Promise<any> {
  const endpoint = config.environment === 'PRODUCTION' 
    ? 'postinvoicedata' 
    : 'postinvoicedata_sb';
    
  const url = `${getBaseUrl(config.environment)}/${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.fbrToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      agent: getAgent(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`FBR Transmit Error: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error('FBR Transmission Error:', error);
    throw error;
  }
}
