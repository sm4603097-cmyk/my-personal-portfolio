import type { LucideIcon } from 'lucide-react';
import { Layers, Code, Smartphone, Cpu, Shield } from 'lucide-react';

export type ProjectCategory = 'web' | 'android' | 'ai' | 'security';

export type ProjectFilter = 'all' | ProjectCategory;

export type ProjectFilterLabelKey =
  | 'filterAll'
  | 'filterWeb'
  | 'filterAndroid'
  | 'filterAI'
  | 'filterSecurity';

export interface ProjectCategoryMeta {
  key: ProjectCategory;
  labelKey: Exclude<ProjectFilterLabelKey, 'filterAll'>;
  icon: LucideIcon;
  badge: string;
  border: string;
}

export interface ProjectFilterMeta {
  key: ProjectFilter;
  labelKey: ProjectFilterLabelKey;
  icon: LucideIcon;
}

const CATEGORY_META: Record<ProjectCategory, ProjectCategoryMeta> = {
  web: {
    key: 'web',
    labelKey: 'filterWeb',
    icon: Code,
    badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    border: 'hover:border-cyan-500/40',
  },
  android: {
    key: 'android',
    labelKey: 'filterAndroid',
    icon: Smartphone,
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    border: 'hover:border-emerald-500/40',
  },
  ai: {
    key: 'ai',
    labelKey: 'filterAI',
    icon: Cpu,
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    border: 'hover:border-amber-500/40',
  },
  security: {
    key: 'security',
    labelKey: 'filterSecurity',
    icon: Shield,
    badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    border: 'hover:border-indigo-500/40',
  },
};

export const PROJECT_CATEGORY_ORDER: ProjectCategory[] = ['web', 'android', 'ai', 'security'];

export const PROJECT_FILTERS: ProjectFilterMeta[] = [
  { key: 'all', labelKey: 'filterAll', icon: Layers },
  ...PROJECT_CATEGORY_ORDER.map((category) => {
    const meta = CATEGORY_META[category];
    return { key: meta.key, labelKey: meta.labelKey, icon: meta.icon };
  }),
];

export const getCategoryMeta = (category: ProjectCategory): ProjectCategoryMeta =>
  CATEGORY_META[category];

export function filterProjectsByCategory<T extends { category: ProjectCategory }>(
  projects: readonly T[],
  filter: ProjectFilter,
): T[] {
  if (filter === 'all') return projects.slice();
  return projects.filter((project) => project.category === filter);
}