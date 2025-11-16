const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const RPC_URL = import.meta.env.VITE_GENLAYER_RPC || 'https://studio.genlayer.com';

export async function callContractMethod(
  method: string,
  args: any[] = []
): Promise<any> {
  try {
    const response = await fetch(`${RPC_URL}/api/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [
          {
            to: CONTRACT_ADDRESS,
            data: JSON.stringify({ method, args }),
          },
        ],
        id: 1,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const result = data.result;

    if (typeof result === 'string') {
      try {
        return JSON.parse(result);
      } catch {
        return result;
      }
    }
    return result;
  } catch (error) {
    console.error(`Error calling ${method}:`, error);
    throw error;
  }
}

export async function writeContractMethod(
  method: string,
  args: any[] = []
): Promise<any> {
  try {
    const response = await fetch(`${RPC_URL}/api/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_sendTransaction',
        params: [
          {
            to: CONTRACT_ADDRESS,
            data: JSON.stringify({ method, args }),
          },
        ],
        id: 1,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.result;
  } catch (error) {
    console.error(`Error writing ${method}:`, error);
    throw error;
  }
}
