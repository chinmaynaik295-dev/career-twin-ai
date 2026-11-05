import axios from 'axios';
import { 
  User, CareerPath, SkillGapAnalysis, 
  SimulationResult, LearningRoadmap, DigitalCareerTwin 
} from '../types';
import { CAREER_TRACKS_CATALOG } from './careerCatalog';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('careertwin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('careertwin_token');
      // If unauthorized on protected routes, redirect cleanly
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication
  async register(data: { email: string; password: string; name: string }) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },

  async forgotPassword(email: string) {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(token: string, newPassword: string) {
    const res = await apiClient.post('/auth/reset-password', { token, new_password: newPassword });
    return res.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await apiClient.put('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return res.data;
  },

  async deleteAccount() {
    const res = await apiClient.delete('/auth/account');
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // Careers Catalog
  async getCareers(): Promise<CareerPath[]> {
    try {
      const res = await apiClient.get('/careers');
      return res.data;
    } catch (e) {
      return CAREER_TRACKS_CATALOG;
    }
  },

  async getCareer(id: string): Promise<CareerPath> {
    try {
      const res = await apiClient.get(`/careers/${id}`);
      return res.data;
    } catch (e) {
      const found = CAREER_TRACKS_CATALOG.find((c) => c.id === id);
      if (!found) throw new Error('Career track not found');
      return found;
    }
  },

  async analyzeCareer(careerId: string): Promise<SkillGapAnalysis> {
    const res = await apiClient.post('/career/analyze', { career_id: careerId });
    return res.data;
  },

  async compareCareers(careerId1: string, careerId2: string) {
    const res = await apiClient.post('/career/compare', {
      career_id_1: careerId1,
      career_id_2: careerId2,
    });
    return res.data;
  },

  // Digital Twin Profile
  async getTwin(): Promise<DigitalCareerTwin> {
    const res = await apiClient.get('/twin');
    return res.data;
  },

  async updateTwin(payload: { task_title: string; skill_boosts: Record<string, number>; evidence?: string }) {
    const res = await apiClient.put('/twin/update', payload);
    return res.data;
  },

  async getEvolution() {
    const res = await apiClient.get('/twin/evolution');
    return res.data;
  },

  async createProfile(data: any) {
    const res = await apiClient.post('/profile', data);
    return res.data;
  },

  async updateProfile(data: any) {
    const res = await apiClient.put('/profile/me', data);
    return res.data;
  },

  // Career Simulation Lab
  async runSimulation(payload: {
    career_id: string;
    scenario_name: string;
    learning_actions: Array<{ skill_name: string; added_proficiency: number; hours?: number }>;
  }): Promise<SimulationResult> {
    const res = await apiClient.post('/simulation/run', payload);
    return res.data;
  },

  async compareScenarios(payload: {
    career_id: string;
    scenarios: Array<{ name: string; actions: Array<{ skill_name: string; added_proficiency: number }> }>;
  }) {
    const res = await apiClient.post('/simulation/compare', payload);
    return res.data;
  },

  // Roadmap & Tasks
  async getRoadmap(): Promise<LearningRoadmap | null> {
    const res = await apiClient.get('/roadmap/current');
    if (res.data?.has_active_roadmap === false) {
      return null;
    }
    return res.data;
  },

  async generateRoadmap(payload: { career_id: string; target_weeks?: number; weekly_hours?: number }): Promise<LearningRoadmap> {
    const res = await apiClient.post('/roadmap/generate', payload);
    return res.data;
  },

  async updateTask(taskId: string, completed: boolean, evidence?: string) {
    const res = await apiClient.put(`/roadmap/task/${taskId}`, { completed, evidence });
    return res.data;
  },

  // AI Mentor
  async chatWithAgent(message: string, conversationHistory: Array<{ role: string; content: string }>) {
    const res = await apiClient.post('/agent/chat', {
      message,
      conversation_history: conversationHistory
    });
    return res.data;
  }
};
