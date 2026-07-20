import { DEFAULT_PROJECTS, DEFAULT_EXPERIENCES, DEFAULT_SKILLS, DEFAULT_NOW_BUILDING, DEFAULT_LEARNING } from '../utils/constants';
export type { Project, Experience, SkillCategory, NowBuildingItem, LearningItem } from '../types/index';
import type { Project, Experience, SkillCategory, NowBuildingItem, LearningItem } from '../types/index';



// LocalStorage helpers
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    return defaultValue
  }
}

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new Event('pushkaros-data-change'))
  } catch (e) {
    console.error('LocalStorage write failed:', e)
  }
}

// HTTP Request helper
const request = async (url: string, options: RequestInit = {}) => {
  const token = sessionStorage.getItem('pushkaros_jwt_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        sessionStorage.removeItem('pushkaros_jwt_token');
        window.dispatchEvent(new Event('pushkaros-auth-logout'));
      }
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Backend request failed for ${url}:`, err);
    throw err;
  }
};

export const portfolioApi = {
  // Check auth state
  isAuthenticated: (): boolean => {
    return sessionStorage.getItem('pushkaros_cms_authenticated') === 'true' || 
           !!sessionStorage.getItem('pushkaros_jwt_token');
  },

  // Log in — only fall back to local auth on genuine network failure (TypeError),
  // not on real rejections like 401 from a reachable backend.
  login: async (password: string): Promise<boolean> => {
    try {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password })
      });
      if (data.token) {
        sessionStorage.setItem('pushkaros_jwt_token', data.token);
        sessionStorage.setItem('pushkaros_cms_authenticated', 'true');
        window.dispatchEvent(new Event('pushkaros-data-change'));
        return true;
      }
      return false;
    } catch (err) {
      // Only fall back to local auth on genuine network failure, not a real rejection.
      if (!(err instanceof TypeError)) throw err;
      const localPassword = getStorageItem('pushkaros_cms_password', '');
      if (localPassword && password === localPassword) {
        sessionStorage.setItem('pushkaros_cms_authenticated', 'true');
        window.dispatchEvent(new Event('pushkaros-data-change'));
        return true;
      }
      throw err;
    }
  },

  // Log out
  logout: () => {
    sessionStorage.removeItem('pushkaros_jwt_token');
    sessionStorage.removeItem('pushkaros_cms_authenticated');
    window.dispatchEvent(new Event('pushkaros-data-change'));
    window.dispatchEvent(new Event('pushkaros-auth-logout'));
  },

  // Change password — only fall back to local on genuine network failure.
  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await request('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword })
      });
      return true;
    } catch (err) {
      // Only fall back to local on genuine network failure, not a real rejection.
      if (!(err instanceof TypeError)) throw err;
      const localPassword = getStorageItem('pushkaros_cms_password', '');
      if (localPassword && oldPassword === localPassword) {
        setStorageItem('pushkaros_cms_password', newPassword);
        return true;
      }
      throw err;
    }
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    try {
      const data = await request('/api/projects');
      return data;
    } catch (err) {
      return getStorageItem('pushkaros_projects', DEFAULT_PROJECTS);
    }
  },

  saveProject: async (project: Project): Promise<void> => {
    try {
      await request('/api/projects', {
        method: 'POST',
        body: JSON.stringify(project)
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;
      const current = getStorageItem<Project[]>('pushkaros_projects', DEFAULT_PROJECTS);
      const index = current.findIndex(p => p.id === project.id);
      if (index >= 0) {
        current[index] = project;
      } else {
        current.push(project);
      }
      setStorageItem('pushkaros_projects', current);
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    try {
      await request(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;
      const current = getStorageItem<Project[]>('pushkaros_projects', DEFAULT_PROJECTS);
      const filtered = current.filter(p => p.id !== id);
      setStorageItem('pushkaros_projects', filtered);
    }
  },

  // Experiences
  getExperiences: async (): Promise<Experience[]> => {
    try {
      const data = await request('/api/experience');
      return data;
    } catch (err) {
      return getStorageItem('pushkaros_experiences', DEFAULT_EXPERIENCES);
    }
  },

  saveExperience: async (experience: Experience): Promise<void> => {
    try {
      await request('/api/experience', {
        method: 'POST',
        body: JSON.stringify(experience)
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;
      const current = getStorageItem<Experience[]>('pushkaros_experiences', DEFAULT_EXPERIENCES);
      const index = current.findIndex(e => e.id === experience.id);
      if (index >= 0) {
        current[index] = experience;
      } else {
        current.push(experience);
      }
      setStorageItem('pushkaros_experiences', current);
    }
  },

  deleteExperience: async (id: string): Promise<void> => {
    try {
      await request(`/api/experience/${id}`, {
        method: 'DELETE'
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;
      const current = getStorageItem<Experience[]>('pushkaros_experiences', DEFAULT_EXPERIENCES);
      const filtered = current.filter(e => e.id !== id);
      setStorageItem('pushkaros_experiences', filtered);
    }
  },

  // Skills
  getSkills: async (): Promise<SkillCategory[]> => {
    try {
      const data = await request('/api/skills');
      return data;
    } catch (err) {
      return getStorageItem('pushkaros_skills', DEFAULT_SKILLS);
    }
  },

  saveSkills: async (skills: SkillCategory[]): Promise<void> => {
    try {
      await request('/api/skills', {
        method: 'POST',
        body: JSON.stringify(skills)
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;
      setStorageItem('pushkaros_skills', skills);
    }
  },

  // Settings
  getStatusText: async (): Promise<string> => {
    try {
      const data = await request('/api/settings');
      return data.statusText || 'Building RepoSage v2.0';
    } catch (err) {
      return getStorageItem('pushkaros_status_text', 'Building RepoSage v2.0');
    }
  },

  saveStatusText: async (text: string): Promise<void> => {
    try {
      await request('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ statusText: text })
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;
      setStorageItem('pushkaros_status_text', text);
    }
  },

  // Coffee count — uses the new public /coffee-count route (no auth required).
  getCoffeeCount: async (): Promise<number> => {
    try {
      const data = await request('/api/settings/coffee-count');
      return data.count ?? 0;
    } catch (err) {
      const today = new Date().toDateString();
      if (getStorageItem('pushkaros_coffee_date', '') !== today) {
        return 0;
      }
      return getStorageItem('pushkaros_coffee_count', 0);
    }
  },

  saveCoffeeCount: async (): Promise<number> => {
    try {
      // POST to the public atomic-increment endpoint — no auth required.
      const data = await request('/api/settings/coffee-count', { method: 'POST' });
      return data.count ?? 0;
    } catch (err) {
      // Offline fallback: increment locally.
      const today = new Date().toDateString();
      const savedDate = getStorageItem('pushkaros_coffee_date', '');
      const current = savedDate === today ? getStorageItem('pushkaros_coffee_count', 0) : 0;
      const next = current + 1;
      setStorageItem('pushkaros_coffee_count', next);
      setStorageItem('pushkaros_coffee_date', today);
      return next;
    }
  },

  // GitHub stats — prs may be null when the search API fails.
  getGithubStats: async (): Promise<{ repos: number; stars: number; streak: string; prs: number | null }> => {
    try {
      const data = await request('/api/github');
      return data;
    } catch (err) {
      return { repos: 42, stars: 180, streak: '28d', prs: null };
    }
  },

  // NowBuilding — stored as a native array in MongoDB (Mixed type), no JSON.stringify needed.
  getNowBuilding: async (): Promise<NowBuildingItem[]> => {
    try {
      const data = await request('/api/settings');
      if (Array.isArray(data.nowBuilding)) {
        return data.nowBuilding as NowBuildingItem[];
      }
      // Legacy: old data may have been JSON.stringify'd — try to parse it gracefully.
      if (typeof data.nowBuilding === 'string') {
        try { return JSON.parse(data.nowBuilding); } catch { /* fall through */ }
      }
      return getStorageItem('pushkaros_now_building', DEFAULT_NOW_BUILDING);
    } catch (err) {
      return getStorageItem('pushkaros_now_building', DEFAULT_NOW_BUILDING);
    }
  },

  saveNowBuilding: async (items: NowBuildingItem[]): Promise<void> => {
    try {
      // Store as a native array — MongoDB Mixed type handles this without JSON.stringify.
      await request('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ nowBuilding: items })
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;
      setStorageItem('pushkaros_now_building', items);
    }
  },

  // LearningLog — stored as a native array in MongoDB (Mixed type), no JSON.stringify needed.
  getLearningLog: async (): Promise<LearningItem[]> => {
    try {
      const data = await request('/api/settings');
      if (Array.isArray(data.learningLog)) {
        return data.learningLog as LearningItem[];
      }
      // Legacy: old data may have been JSON.stringify'd — try to parse it gracefully.
      if (typeof data.learningLog === 'string') {
        try { return JSON.parse(data.learningLog); } catch { /* fall through */ }
      }
      return getStorageItem('pushkaros_learning_log', DEFAULT_LEARNING);
    } catch (err) {
      return getStorageItem('pushkaros_learning_log', DEFAULT_LEARNING);
    }
  },

  saveLearningLog: async (items: LearningItem[]): Promise<void> => {
    try {
      // Store as a native array — MongoDB Mixed type handles this without JSON.stringify.
      await request('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ learningLog: items })
      });
      window.dispatchEvent(new Event('pushkaros-data-change'));
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;
      setStorageItem('pushkaros_learning_log', items);
    }
  },

  // Send message
  sendMessage: async (name: string, email: string, message: string): Promise<void> => {
    await request('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email, message })
    });
  }
}
