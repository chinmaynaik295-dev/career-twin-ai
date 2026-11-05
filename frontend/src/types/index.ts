export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SkillRequirement {
  name: string;
  category: 'technical' | 'soft';
  importance: number;
  min_proficiency: number;
  target_proficiency: number;
  description: string;
}

export interface CareerProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_hours: number;
  skills_targeted: string[];
}

export interface CareerPath {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  market_outlook: string;
  average_salary_range: string;
  required_skills: SkillRequirement[];
  recommended_projects: CareerProject[];
}

export interface SkillGapItem {
  skill: string;
  category: string;
  user_level: number;
  target_level: number;
  min_level: number;
  gap: number;
  importance: number;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  suggested_action: string;
}

export interface SkillGapAnalysis {
  career_id: string;
  career_title: string;
  readiness_score: number;
  total_competencies: number;
  existing_skills_count: number;
  missing_skills_count: number;
  skill_gaps: SkillGapItem[];
  existing_skills: SkillGapItem[];
  missing_skills: SkillGapItem[];
}

export interface LearningAction {
  skill_name: string;
  added_proficiency: number;
  hours?: number;
}

export interface SimulationResult {
  id?: string;
  scenario_name: string;
  career_id: string;
  career_title: string;
  initial_readiness_score: number;
  simulated_readiness_score: number;
  readiness_delta: number;
  total_estimated_learning_hours: number;
  skills_improved: Array<{
    skill: string;
    previous_level: number;
    simulated_level: number;
    gain: number;
    estimated_hours: number;
  }>;
  remaining_gaps_count: number;
  remaining_high_priority_gaps: number;
  recommended_next_action: string;
  is_hypothetical: boolean;
  disclaimer: string;
}

export interface RoadmapTask {
  id: string;
  description: string;
  completed: boolean;
  hours: number;
}

export interface RoadmapMilestone {
  week_number: number;
  title: string;
  focus_skill: string;
  estimated_hours: number;
  tasks: RoadmapTask[];
  is_completed: boolean;
}

export interface LearningRoadmap {
  id?: string;
  career_id: string;
  career_title: string;
  target_weeks: number;
  total_estimated_hours: number;
  initial_readiness: number;
  projected_readiness: number;
  milestones: RoadmapMilestone[];
  progress_percentage?: number;
}

export interface EvolutionEvent {
  timestamp: string;
  event: string;
  details: string;
  improvements?: Record<string, { previous: number; current: number; boost: number }>;
}

export interface DigitalCareerTwin {
  user_id: string;
  name: string;
  email?: string;
  institution: string;
  academic_year: string;
  degree: string;
  education_background?: string;
  skills: Record<string, number>;
  soft_skills: string[];
  interests: string[];
  career_goals: string[];
  primary_career?: CareerPath;
  primary_readiness_score: number;
  readiness_by_career: Record<string, { career_title: string; score: number; category: string }>;
  top_missing_skills: SkillGapItem[];
  projects: Array<{ title: string; description: string; skills_used: string[] }>;
  certifications: string[];
  evolution_history: EvolutionEvent[];
  simulations_count: number;
  has_twin_configured?: boolean;
  last_updated: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tool_executed?: {
    tool: string;
    params?: any;
    result?: any;
  };
  provider?: string;
  timestamp: string;
}

