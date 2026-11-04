import axios from 'axios';
import { 
  User, CareerPath, SkillGapAnalysis, 
  SimulationResult, LearningRoadmap, DigitalCareerTwin 
} from '../types';
import { INITIAL_CAREERS, DEMO_ALEX_TWIN } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('careertwin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth
  async register(data: { email: string; password: string; name: string }) {
    try {
      const res = await apiClient.post('/auth/register', data);
      return res.data;
    } catch (e) {
      throw e;
    }
  },

  async login(data: { email: string; password: string }) {
    try {
      const res = await apiClient.post('/auth/login', data);
      return res.data;
    } catch (e) {
      throw e;
    }
  },

  async demoLogin() {
    try {
      const res = await apiClient.post('/auth/demo');
      return res.data;
    } catch (e) {
      // Local fallback token for demo offline mode
      return {
        access_token: 'mock-demo-jwt-alex-2026',
        token_type: 'bearer',
        user_id: 'demo-user-alex',
        name: 'Alex',
        email: 'alex@careertwin.ai'
      };
    }
  },

  async getMe(): Promise<User> {
    try {
      const res = await apiClient.get('/auth/me');
      return res.data;
    } catch (e) {
      return { id: 'demo-user-alex', name: 'Alex', email: 'alex@careertwin.ai' };
    }
  },

  // Careers
  async getCareers(): Promise<CareerPath[]> {
    try {
      const res = await apiClient.get('/careers');
      return res.data;
    } catch (e) {
      return INITIAL_CAREERS;
    }
  },

  async getCareer(id: string): Promise<CareerPath> {
    try {
      const res = await apiClient.get(`/careers/${id}`);
      return res.data;
    } catch (e) {
      const found = INITIAL_CAREERS.find((c) => c.id === id);
      if (!found) throw new Error('Career not found');
      return found;
    }
  },

  async analyzeCareer(careerId: string): Promise<SkillGapAnalysis> {
    try {
      const res = await apiClient.post('/career/analyze', { career_id: careerId });
      return res.data;
    } catch (e) {
      // Deterministic client fallback calculation
      const career = INITIAL_CAREERS.find((c) => c.id === careerId) || INITIAL_CAREERS[0];
      const skills = DEMO_ALEX_TWIN.skills;
      const gaps = career.required_skills.map((req) => {
        const userLevel = skills[req.name] || 0;
        const gap = Math.max(0, req.target_proficiency - userLevel);
        const priority: 'High' | 'Medium' | 'Low' = gap >= 2 && req.importance >= 4 ? 'High' : gap > 0 ? 'Medium' : 'Low';
        return {
          skill: req.name,
          category: req.category,
          user_level: userLevel,
          target_level: req.target_proficiency,
          min_level: req.min_proficiency,
          gap,
          importance: req.importance,
          priority,
          description: req.description,
          suggested_action: `Elevate proficiency from ${userLevel} to ${req.target_proficiency} (+${gap} pts)`
        };
      });
      return {
        career_id: career.id,
        career_title: career.title,
        readiness_score: DEMO_ALEX_TWIN.primary_readiness_score,
        total_competencies: career.required_skills.length,
        existing_skills_count: gaps.filter(g => g.user_level > 0).length,
        missing_skills_count: gaps.filter(g => g.user_level === 0).length,
        skill_gaps: gaps,
        existing_skills: gaps.filter(g => g.user_level > 0),
        missing_skills: gaps.filter(g => g.user_level === 0)
      };
    }
  },

  async compareCareers(careerId1: string, careerId2: string) {
    try {
      const res = await apiClient.post('/career/compare', {
        career_id_1: careerId1,
        career_id_2: careerId2,
      });
      return res.data;
    } catch (e) {
      const c1 = await this.analyzeCareer(careerId1);
      const c2 = await this.analyzeCareer(careerId2);
      return {
        career_1: { career: INITIAL_CAREERS.find(c => c.id === careerId1), readiness_score: c1.readiness_score, skill_gaps: c1.skill_gaps, missing_count: c1.missing_skills_count },
        career_2: { career: INITIAL_CAREERS.find(c => c.id === careerId2), readiness_score: c2.readiness_score, skill_gaps: c2.skill_gaps, missing_count: c2.missing_skills_count },
        higher_readiness_career: c1.readiness_score >= c2.readiness_score ? c1.career_title : c2.career_title,
        score_difference: Math.abs(c1.readiness_score - c2.readiness_score)
      };
    }
  },

  // Digital Twin
  async getTwin(): Promise<DigitalCareerTwin> {
    try {
      const res = await apiClient.get('/twin');
      return res.data;
    } catch (e) {
      return DEMO_ALEX_TWIN;
    }
  },

  async updateTwin(payload: { task_title: string; skill_boosts: Record<string, number>; evidence?: string }) {
    try {
      const res = await apiClient.put('/twin/update', payload);
      return res.data;
    } catch (e) {
      return { message: 'Updated in local demo mode', updated_skills: DEMO_ALEX_TWIN.skills };
    }
  },

  async getEvolution() {
    try {
      const res = await apiClient.get('/twin/evolution');
      return res.data;
    } catch (e) {
      return {
        user_id: DEMO_ALEX_TWIN.user_id,
        name: DEMO_ALEX_TWIN.name,
        primary_career: "AI/ML Engineer",
        current_readiness_score: DEMO_ALEX_TWIN.primary_readiness_score,
        current_skills: DEMO_ALEX_TWIN.skills,
        evolution_timeline: DEMO_ALEX_TWIN.evolution_history,
        total_milestones_logged: DEMO_ALEX_TWIN.evolution_history.length
      };
    }
  },

  // Simulation Lab
  async runSimulation(payload: {
    career_id: string;
    scenario_name: string;
    learning_actions: Array<{ skill_name: string; added_proficiency: number; hours?: number }>;
  }): Promise<SimulationResult> {
    try {
      const res = await apiClient.post('/simulation/run', payload);
      return res.data;
    } catch (e) {
      // Deterministic mock fallback
      const initial = DEMO_ALEX_TWIN.primary_readiness_score;
      const boostSum = payload.learning_actions.reduce((acc, a) => acc + a.added_proficiency * 4.5, 0);
      const simulated = Math.min(100, Math.round((initial + boostSum) * 10) / 10);
      return {
        scenario_name: payload.scenario_name,
        career_id: payload.career_id,
        career_title: "AI/ML Engineer",
        initial_readiness_score: initial,
        simulated_readiness_score: simulated,
        readiness_delta: Math.round((simulated - initial) * 10) / 10,
        total_estimated_learning_hours: payload.learning_actions.length * 25,
        skills_improved: payload.learning_actions.map(a => ({
          skill: a.skill_name,
          previous_level: DEMO_ALEX_TWIN.skills[a.skill_name] || 1,
          simulated_level: Math.min(5, (DEMO_ALEX_TWIN.skills[a.skill_name] || 1) + a.added_proficiency),
          gain: a.added_proficiency,
          estimated_hours: (a.hours || 25)
        })),
        remaining_gaps_count: 2,
        remaining_high_priority_gaps: 1,
        recommended_next_action: "Focus on Machine Learning projects to bridge remaining gap.",
        is_hypothetical: true,
        disclaimer: "This projection is a deterministic learning simulation for strategic planning."
      };
    }
  },

  async compareScenarios(payload: {
    career_id: string;
    scenarios: Array<{ name: string; actions: Array<{ skill_name: string; added_proficiency: number }> }>;
  }) {
    try {
      const res = await apiClient.post('/simulation/compare', payload);
      return res.data;
    } catch (e) {
      return {
        career_id: payload.career_id,
        scenarios_evaluated: payload.scenarios.length,
        scenarios: payload.scenarios.map(sc => ({
          scenario_name: sc.name,
          career_id: payload.career_id,
          career_title: "AI/ML Engineer",
          initial_readiness_score: 41.5,
          simulated_readiness_score: 55.0,
          readiness_delta: 13.5,
          total_estimated_learning_hours: 40,
          skills_improved: sc.actions.map(a => ({ skill: a.skill_name, previous_level: 1, simulated_level: 3, gain: 2, estimated_hours: 36 })),
          remaining_gaps_count: 2,
          remaining_high_priority_gaps: 1,
          recommended_next_action: "Proceed with Scenario A",
          is_hypothetical: true,
          disclaimer: "Hypothetical projection."
        })),
        highest_readiness_scenario: payload.scenarios[0]?.name || "Scenario A",
        comparison_summary: "Scenario yields substantial readiness improvement."
      };
    }
  },

  // Roadmap
  async getRoadmap(): Promise<LearningRoadmap> {
    try {
      const res = await apiClient.get('/roadmap/current');
      return res.data;
    } catch (e) {
      return {
        career_id: "ai-ml-engineer",
        career_title: "AI/ML Engineer",
        target_weeks: 8,
        total_estimated_hours: 80,
        initial_readiness: 41.5,
        projected_readiness: 76.5,
        progress_percentage: 25,
        milestones: [
          {
            week_number: 1,
            title: "Week 1: Foundations of Machine Learning & Statistics",
            focus_skill: "Machine Learning",
            estimated_hours: 10,
            is_completed: true,
            tasks: [
              { id: "w1_t1", description: "Review linear algebra: matrix multiplications & eigenvalues", completed: true, hours: 3 },
              { id: "w1_t2", description: "Implement linear & logistic regression from scratch in NumPy", completed: true, hours: 4 },
              { id: "w1_t3", description: "Explore bias-variance tradeoff & cross-validation", completed: true, hours: 3 }
            ]
          },
          {
            week_number: 2,
            title: "Week 2: Advanced Feature Engineering & Scikit-Learn",
            focus_skill: "Machine Learning",
            estimated_hours: 10,
            is_completed: false,
            tasks: [
              { id: "w2_t1", description: "Data imputation, categorical encoding, and scaling pipelines", completed: false, hours: 4 },
              { id: "w2_t2", description: "Tree ensembles: Random Forests and XGBoost tuning", completed: false, hours: 3 },
              { id: "w2_t3", description: "Model evaluation: ROC-AUC, Precision-Recall, F1 scoring", completed: false, hours: 3 }
            ]
          },
          {
            week_number: 3,
            title: "Week 3: Deep Learning Architectures & PyTorch Foundations",
            focus_skill: "Deep Learning & PyTorch",
            estimated_hours: 10,
            is_completed: false,
            tasks: [
              { id: "w3_t1", description: "PyTorch tensor operations, autograd, and GPU acceleration", completed: false, hours: 4 },
              { id: "w3_t2", description: "Construct Multilayer Perceptrons for classification", completed: false, hours: 3 },
              { id: "w3_t3", description: "Loss functions and optimizers (AdamW, SGD with momentum)", completed: false, hours: 3 }
            ]
          },
          {
            week_number: 4,
            title: "Week 4: Convolutional Neural Networks & Computer Vision",
            focus_skill: "Deep Learning & PyTorch",
            estimated_hours: 10,
            is_completed: false,
            tasks: [
              { id: "w4_t1", description: "Convolutions, pooling, batch norm, and residual skip connections", completed: false, hours: 4 },
              { id: "w4_t2", description: "Fine-tune pre-trained ResNet on custom image dataset", completed: false, hours: 3 },
              { id: "w4_t3", description: "Data augmentation strategies with Torchvision", completed: false, hours: 3 }
            ]
          }
        ]
      };
    }
  },

  async updateTask(taskId: string, completed: boolean, evidence?: string) {
    try {
      const res = await apiClient.put(`/roadmap/task/${taskId}`, { completed, evidence });
      return res.data;
    } catch (e) {
      return { message: "Task updated locally", completed };
    }
  },

  async generateRoadmap(payload: { career_id: string; target_weeks?: number; weekly_hours?: number }) {
    try {
      const res = await apiClient.post('/roadmap/generate', payload);
      return res.data;
    } catch (e) {
      return this.getRoadmap();
    }
  },

  // Agent Chat
  async chatWithAgent(message: string, conversationHistory: Array<{ role: string; content: string }>) {
    try {
      const res = await apiClient.post('/agent/chat', {
        message,
        conversation_history: conversationHistory
      });
      return res.data;
    } catch (e) {
      return {
        reply: "I am your CareerTwin AI Agentic Mentor. Based on your Digital Career Twin, you have strong foundations in Python and Mathematics. Your highest readiness path is AI/ML Engineer (41.5%) followed by Cybersecurity Engineer (32.0%). To boost your readiness by +15%, tackle practical machine learning projects and master relational SQL!",
        tool_executed: { tool: "analyze_user_profile" },
        provider: "local-agent-fallback",
        suggested_prompts: [
          "What skills am I missing for Cybersecurity?",
          "Simulate learning Python and SQL for 60 hours",
          "Which practical portfolio project should I build next?",
          "Compare AI/ML vs Data Scientist"
        ]
      };
    }
  },

  // Profile Onboarding
  async createProfile(data: any) {
    try {
      const res = await apiClient.post('/profile', data);
      return res.data;
    } catch (e) {
      return { message: "Profile saved locally", profile: data };
    }
  }
};
