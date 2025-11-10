import axios, { AxiosInstance } from 'axios';
import { Server, ServerDetail, Disk, Process, NetworkInterface, MetricDataPoint } from '../types';

class ApiService {
  private client: AxiosInstance | null = null;
  private apiKey: string = '';

  configure(apiUrl: string, apiPort: string, apiKey: string) {
    const baseURL = `${apiUrl}:${apiPort}/api/v1`;
    this.apiKey = apiKey;

    this.client = axios.create({
      baseURL,
      headers: {
        'X-API-Key': apiKey,
      },
      timeout: 10000,
    });
  }

  private ensureConfigured() {
    if (!this.client) {
      throw new Error('API service not configured. Please configure settings first.');
    }
  }

  async verifyAuth(): Promise<boolean> {
    this.ensureConfigured();
    try {
      const response = await this.client!.post('/auth/verify');
      return response.data.success;
    } catch (error) {
      console.error('Auth verification failed:', error);
      return false;
    }
  }

  async getServers(): Promise<Server[]> {
    this.ensureConfigured();
    try {
      const response = await this.client!.get('/servers');
      return response.data.servers;
    } catch (error) {
      console.error('Failed to fetch servers:', error);
      throw error;
    }
  }

  async getServerDetail(serverId: string): Promise<ServerDetail> {
    this.ensureConfigured();
    try {
      const response = await this.client!.get(`/servers/${serverId}`);
      return response.data.server;
    } catch (error) {
      console.error('Failed to fetch server detail:', error);
      throw error;
    }
  }

  async getServerHistory(serverId: string, duration: string = '20m'): Promise<MetricDataPoint[]> {
    this.ensureConfigured();
    try {
      const response = await this.client!.get(`/servers/${serverId}/history`, {
        params: { duration },
      });
      return response.data.history;
    } catch (error) {
      console.error('Failed to fetch server history:', error);
      throw error;
    }
  }

  async getDisks(serverId: string): Promise<Disk[]> {
    this.ensureConfigured();
    try {
      const response = await this.client!.get(`/servers/${serverId}/disks`);
      return response.data.disks;
    } catch (error) {
      console.error('Failed to fetch disks:', error);
      throw error;
    }
  }

  async getProcesses(serverId: string, sortBy: 'cpu' | 'memory' = 'cpu', limit: number = 20): Promise<Process[]> {
    this.ensureConfigured();
    try {
      const response = await this.client!.get(`/servers/${serverId}/processes`, {
        params: { sortBy, limit },
      });
      return response.data.processes;
    } catch (error) {
      console.error('Failed to fetch processes:', error);
      throw error;
    }
  }

  async getNetwork(serverId: string): Promise<NetworkInterface[]> {
    this.ensureConfigured();
    try {
      const response = await this.client!.get(`/servers/${serverId}/network`);
      return response.data.interfaces;
    } catch (error) {
      console.error('Failed to fetch network interfaces:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
