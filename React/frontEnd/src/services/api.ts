const API_BASE_URL = 'http://localhost:5001/api'



console.log('🚀 Final API_BASE_URL:', API_BASE_URL);

class ApiService {
  async request(endpoint: string, options?: any) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('📡 Making API request to:', url);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response?.ok) {
        console.error('❌ API request failed:', response?.status, response?.statusText);
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const data = await response.json();
      console.log('✅ API request successful:', endpoint);
      return data;
    } catch (error) {
      console.error('💥 API request error:', error);
      console.error('🔗 Failed URL:', url);
      throw error;
    }
  }
  // Auth
  async login(infoAuth: any) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify(infoAuth),
    });
  }

  // Transcriptions
  async getTranscriptions() {
    return this.request('/transcriptions');
  }

  async updateTranscriptionStatus(id: any, updates: any) {
    return this.request(`/transcriptions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async createTranscription(transcription: any) {
    return this.request('/transcriptions', {
      method: 'POST',
      body: JSON.stringify(transcription),
    });
  }

  async getTranscriptionStats() {
    return this.request('/transcriptions/stats');
  }
}

export const apiService = new ApiService();