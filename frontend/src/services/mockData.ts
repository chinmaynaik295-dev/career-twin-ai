import { CareerPath, DigitalCareerTwin, LearningRoadmap } from '../types';

export const INITIAL_CAREERS: CareerPath[] = [
  {
    id: "ai-ml-engineer",
    title: "AI/ML Engineer",
    tagline: "Architect intelligent systems, neural networks, and generative AI pipelines",
    description: "Designs, builds, and deploys machine learning models and deep neural networks to solve complex predictive and generative problems.",
    category: "Artificial Intelligence",
    market_outlook: "High Growth (+38% projected demand)",
    average_salary_range: "$125,000 - $185,000",
    required_skills: [
      { name: "Python", category: "technical", importance: 5, min_proficiency: 3, target_proficiency: 5, description: "Core language for ML workflows" },
      { name: "Machine Learning", category: "technical", importance: 5, min_proficiency: 3, target_proficiency: 4, description: "Supervised & unsupervised models" },
      { name: "Mathematics", category: "technical", importance: 4, min_proficiency: 3, target_proficiency: 4, description: "Linear algebra, calculus, stats" },
      { name: "SQL", category: "technical", importance: 3, min_proficiency: 2, target_proficiency: 3, description: "Relational data querying" },
      { name: "Deep Learning & PyTorch", category: "technical", importance: 4, min_proficiency: 2, target_proficiency: 4, description: "Neural networks & architectures" },
      { name: "MLOps & Model Deployment", category: "technical", importance: 3, min_proficiency: 2, target_proficiency: 4, description: "FastAPI, Docker & model serving" },
      { name: "Problem Solving", category: "soft", importance: 4, min_proficiency: 3, target_proficiency: 5, description: "Algorithmic thinking" },
      { name: "Communication", category: "soft", importance: 3, min_proficiency: 2, target_proficiency: 4, description: "Explaining ML insights to stakeholders" }
    ],
    recommended_projects: [
      {
        id: "proj-ai-1",
        title: "Autonomous Agent with Tool Calling & RAG",
        description: "Build an agentic assistant that indexes technical documentation, plans multistep workflows, and invokes external search tools.",
        difficulty: "Intermediate",
        estimated_hours: 35,
        skills_targeted: ["Python", "Machine Learning", "MLOps & Model Deployment"]
      },
      {
        id: "proj-ai-2",
        title: "End-to-End Predictive Maintenance Pipeline",
        description: "Train an anomaly detection model on time-series telemetry data and serve real-time predictions via FastAPI.",
        difficulty: "Advanced",
        estimated_hours: 45,
        skills_targeted: ["Machine Learning", "Mathematics", "SQL", "MLOps & Model Deployment"]
      }
    ]
  },
  {
    id: "cybersecurity-engineer",
    title: "Cybersecurity Engineer",
    tagline: "Protect infrastructure, conduct threat modeling, and fortify digital perimeters",
    description: "Safeguards networks, cloud environments, and application architectures against vulnerabilities, breaches, and adversarial attacks.",
    category: "Security & Defense",
    market_outlook: "Critical Demand (+32% projected growth)",
    average_salary_range: "$115,000 - $170,000",
    required_skills: [
      { name: "Networking", category: "technical", importance: 5, min_proficiency: 3, target_proficiency: 5, description: "TCP/IP, routing, firewalls" },
      { name: "Linux", category: "technical", importance: 5, min_proficiency: 3, target_proficiency: 4, description: "Kernel, shell scripting, hardening" },
      { name: "Cybersecurity", category: "technical", importance: 5, min_proficiency: 3, target_proficiency: 5, description: "Threat modeling & OWASP Top 10" },
      { name: "Python", category: "technical", importance: 3, min_proficiency: 2, target_proficiency: 4, description: "Security tooling and automation" },
      { name: "Security Auditing & SIEM", category: "technical", importance: 4, min_proficiency: 2, target_proficiency: 4, description: "Log ingestion & incident response" },
      { name: "Problem Solving", category: "soft", importance: 4, min_proficiency: 3, target_proficiency: 5, description: "Root-cause incident forensics" },
      { name: "Ethical Judgment", category: "soft", importance: 5, min_proficiency: 4, target_proficiency: 5, description: "Compliance and ethical disclosure" }
    ],
    recommended_projects: [
      {
        id: "proj-sec-1",
        title: "Automated Vulnerability Scanner & SIEM Alert Hub",
        description: "Develop a lightweight network port scanner and log analysis dashboard that correlates auth failures.",
        difficulty: "Intermediate",
        estimated_hours: 30,
        skills_targeted: ["Networking", "Linux", "Cybersecurity", "Python"]
      }
    ]
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    tagline: "Uncover behavioral patterns, build statistical simulations, and derive strategic intelligence",
    description: "Applies statistical modeling, hypothesis testing, and machine learning to analyze large datasets and guide strategic decisions.",
    category: "Data & Analytics",
    market_outlook: "High Demand (+35% projected growth)",
    average_salary_range: "$110,000 - $165,000",
    required_skills: [
      { name: "Python", category: "technical", importance: 5, min_proficiency: 3, target_proficiency: 5, description: "Data manipulation with Pandas & NumPy" },
      { name: "SQL", category: "technical", importance: 5, min_proficiency: 3, target_proficiency: 5, description: "Complex aggregations & optimization" },
      { name: "Mathematics", category: "technical", importance: 5, min_proficiency: 3, target_proficiency: 4, description: "Hypothesis testing and regression" },
      { name: "Machine Learning", category: "technical", importance: 4, min_proficiency: 2, target_proficiency: 4, description: "Ensemble trees & clustering" },
      { name: "Data Visualization", category: "technical", importance: 4, min_proficiency: 2, target_proficiency: 4, description: "Interactive dashboards" },
      { name: "Communication", category: "soft", importance: 5, min_proficiency: 3, target_proficiency: 5, description: "Translating data into strategy" }
    ],
    recommended_projects: [
      {
        id: "proj-ds-1",
        title: "Customer Churn Prediction with Explainable AI",
        description: "Build an end-to-end churn model using XGBoost and SHAP values with an interactive visualization dashboard.",
        difficulty: "Intermediate",
        estimated_hours: 28,
        skills_targeted: ["Python", "SQL", "Machine Learning", "Data Visualization"]
      }
    ]
  },
  {
    id: "software-developer",
    title: "Software Developer",
    tagline: "Engineer robust applications, modular APIs, and scalable distributed architectures",
    description: "Designs, codes, tests, and maintains full-stack software applications and services.",
    category: "Software Engineering",
    market_outlook: "Stable High (+25% projected growth)",
    average_salary_range: "$105,000 - $160,000",
    required_skills: [
      { name: "Python", category: "technical", importance: 4, min_proficiency: 3, target_proficiency: 4, description: "Backend APIs & async design" },
      { name: "C", category: "technical", importance: 3, min_proficiency: 2, target_proficiency: 3, description: "Data structures & memory execution" },
      { name: "SQL", category: "technical", importance: 4, min_proficiency: 2, target_proficiency: 4, description: "Schema normalization & indexing" },
      { name: "Web Technologies", category: "technical", importance: 4, min_proficiency: 2, target_proficiency: 4, description: "React, REST & fullstack integration" },
      { name: "Problem Solving", category: "soft", importance: 5, min_proficiency: 3, target_proficiency: 5, description: "Algorithms and debugging" },
      { name: "Team Collaboration", category: "soft", importance: 4, min_proficiency: 2, target_proficiency: 4, description: "Git workflows & agile delivery" }
    ],
    recommended_projects: [
      {
        id: "proj-sw-1",
        title: "Full-Stack Collaborative Workspace Application",
        description: "Create a responsive app with real-time state synchronization, authentication, and RESTful APIs.",
        difficulty: "Intermediate",
        estimated_hours: 32,
        skills_targeted: ["Python", "SQL", "Web Technologies", "Problem Solving"]
      }
    ]
  },
  {
    id: "cloud-engineer",
    title: "Cloud Engineer",
    tagline: "Design resilient multi-cloud architectures, automate deployments, and optimize reliability",
    description: "Provisions, manages, and automates scalable cloud infrastructure, container orchestrations, and DevOps pipelines.",
    category: "Infrastructure & Cloud",
    market_outlook: "High Demand (+30% projected growth)",
    average_salary_range: "$120,000 - $175,000",
    required_skills: [
      { name: "Linux", category: "technical", importance: 5, min_proficiency: 3, target_proficiency: 5, description: "Server administration & bash" },
      { name: "Networking", category: "technical", importance: 4, min_proficiency: 3, target_proficiency: 4, description: "VPCs, DNS, and load balancing" },
      { name: "Cloud Platforms (AWS/GCP/Azure)", category: "technical", importance: 5, min_proficiency: 2, target_proficiency: 5, description: "Compute, storage, and IAM" },
      { name: "Containers & Kubernetes", category: "technical", importance: 4, min_proficiency: 2, target_proficiency: 4, description: "Docker & cluster management" },
      { name: "Infrastructure as Code", category: "technical", importance: 4, min_proficiency: 1, target_proficiency: 4, description: "Terraform automation" },
      { name: "Problem Solving", category: "soft", importance: 4, min_proficiency: 3, target_proficiency: 4, description: "Disaster recovery & latency triage" }
    ],
    recommended_projects: [
      {
        id: "proj-cld-1",
        title: "Automated Multi-Region Kubernetes Microservice Cluster",
        description: "Deploy a containerized application with Terraform, automated ingress TLS, and Prometheus monitoring.",
        difficulty: "Advanced",
        estimated_hours: 36,
        skills_targeted: ["Linux", "Networking", "Cloud Platforms (AWS/GCP/Azure)", "Containers & Kubernetes"]
      }
    ]
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    tagline: "Build scalable data pipelines, stream ingestion architectures, and analytical warehouses",
    description: "Constructs robust data extraction, transformation, and loading pipelines to feed analytics and machine learning engines.",
    category: "Data Architecture",
    market_outlook: "High Demand (+31% projected growth)",
    average_salary_range: "$115,000 - $170,000",
    required_skills: [
      { name: "Python", category: "technical", importance: 5, min_proficiency: 3, target_proficiency: 5, description: "ETL pipelines & Airflow DAGs" },
      { name: "SQL", category: "technical", importance: 5, min_proficiency: 3, target_proficiency: 5, description: "Joins, window queries, indexing" },
      { name: "Distributed Computing (Spark/Kafka)", category: "technical", importance: 4, min_proficiency: 2, target_proficiency: 4, description: "Stream ingestion & partitions" },
      { name: "Linux", category: "technical", importance: 3, min_proficiency: 2, target_proficiency: 3, description: "Cron jobs & CLI automation" },
      { name: "Data Warehousing", category: "technical", importance: 4, min_proficiency: 2, target_proficiency: 4, description: "Snowflake & star schema modeling" },
      { name: "Problem Solving", category: "soft", importance: 4, min_proficiency: 3, target_proficiency: 4, description: "Data drift and pipeline debugging" }
    ],
    recommended_projects: [
      {
        id: "proj-de-1",
        title: "Real-Time Streaming Analytics Pipeline with Kafka & Spark",
        description: "Stream transactional events, compute sliding window metrics, and store transformed records in an analytical warehouse.",
        difficulty: "Advanced",
        estimated_hours: 40,
        skills_targeted: ["Python", "SQL", "Distributed Computing (Spark/Kafka)", "Data Warehousing"]
      }
    ]
  }
];

export const DEMO_ALEX_TWIN: DigitalCareerTwin = {
  user_id: "demo-user-alex",
  name: "Alex",
  institution: "National Institute of Engineering",
  academic_year: "Second year",
  degree: "Computer Science & Engineering",
  skills: {
    Python: 3.0,
    C: 3.0,
    Mathematics: 3.0,
    SQL: 1.0,
    "Machine Learning": 1.0,
    Linux: 1.0,
    Networking: 1.0,
    "Problem Solving": 3.0
  },
  soft_skills: ["Problem Solving", "Analytical Thinking", "Continuous Learning"],
  interests: ["Artificial Intelligence", "Cybersecurity", "Software Development"],
  career_goals: ["ai-ml-engineer", "cybersecurity-engineer"],
  primary_readiness_score: 41.5,
  readiness_by_career: {
    "ai-ml-engineer": { career_title: "AI/ML Engineer", score: 41.5, category: "Artificial Intelligence" },
    "cybersecurity-engineer": { career_title: "Cybersecurity Engineer", score: 32.0, category: "Security & Defense" },
    "data-scientist": { career_title: "Data Scientist", score: 38.0, category: "Data & Analytics" },
    "software-developer": { career_title: "Software Developer", score: 52.0, category: "Software Engineering" },
    "cloud-engineer": { career_title: "Cloud Engineer", score: 26.5, category: "Infrastructure & Cloud" },
    "data-engineer": { career_title: "Data Engineer", score: 34.0, category: "Data Architecture" }
  },
  top_missing_skills: [
    {
      skill: "Machine Learning",
      category: "technical",
      user_level: 1.0,
      target_level: 4.0,
      min_level: 3.0,
      gap: 3.0,
      importance: 5,
      priority: "High",
      description: "Supervised and unsupervised models",
      suggested_action: "Elevate proficiency from 1.0 to 4.0 (+3.0 pts)"
    },
    {
      skill: "Deep Learning & PyTorch",
      category: "technical",
      user_level: 0.0,
      target_level: 4.0,
      min_level: 2.0,
      gap: 4.0,
      importance: 4,
      priority: "High",
      description: "Neural network architectures",
      suggested_action: "Elevate proficiency from 0.0 to 4.0 (+4.0 pts)"
    },
    {
      skill: "MLOps & Model Deployment",
      category: "technical",
      user_level: 0.0,
      target_level: 4.0,
      min_level: 2.0,
      gap: 4.0,
      importance: 3,
      priority: "Medium",
      description: "FastAPI, Docker & model serving",
      suggested_action: "Elevate proficiency from 0.0 to 4.0 (+4.0 pts)"
    },
    {
      skill: "SQL",
      category: "technical",
      user_level: 1.0,
      target_level: 3.0,
      min_level: 2.0,
      gap: 2.0,
      importance: 3,
      priority: "Medium",
      description: "Querying & data extraction",
      suggested_action: "Elevate proficiency from 1.0 to 3.0 (+2.0 pts)"
    }
  ],
  projects: [
    {
      title: "Sorting Algorithm Visualizer",
      description: "Interactive CLI and graphics program in C and Python demonstrating quicksort, mergesort, and complexity graphs.",
      skills_used: ["C", "Python", "Problem Solving"]
    }
  ],
  certifications: ["Intro to Python & Data Structures"],
  evolution_history: [
    {
      timestamp: "2026-10-15T09:00:00Z",
      event: "Digital Career Twin Initialized",
      details: "Baseline established for 2nd Year Engineering Student."
    },
    {
      timestamp: "2026-10-28T14:30:00Z",
      event: "Completed Python Object-Oriented Design Module",
      details: "Boosted Python skill from 2.5 to 3.0 (+0.5 pts)."
    }
  ],
  simulations_count: 2,
  last_updated: "2026-11-04T18:00:00Z"
};
