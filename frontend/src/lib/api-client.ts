// frontend/src/lib/api-client.ts
import { ApiResponse } from 'shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('we_credit_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to parse JSON response' },
    }));

    if (!response.ok || !data.success) {
      const errorMsg = data.error?.message || response.statusText || 'An error occurred';
      const errorDetails = data.error?.details;
      
      const error = new Error(errorMsg) as any;
      error.status = response.status;
      error.code = data.error?.code || 'UNKNOWN_ERROR';
      error.details = errorDetails;
      
      throw error;
    }

    return data.data as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
