import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { projectsData } from '../data/portfolioData';
import type { Project } from '../data/portfolioData';
import {
  PROJECT_FILTERS,
  getCategoryMeta,
  filterProjectsByCategory,
} from '../data/projectCategories';
import type { ProjectFilter } from '../data/projectCategories';
import { ProjectModal } from './ProjectModal';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';

import { CARD_STAGGER as GRID_STAGGER, CARD_ITEM as CARD_REVEAL, NO_MOTION_CONTAINER, FADE_ONLY } from '../motion/variants';
import { SectionHeader, EASE_STANDARD, useIsFinePointer } from '../motion';

export const ProjectsSection: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const reducedMotion = useReducedMotion();
  const finePointer = useIsFinePointer();
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const gridContainer = reducedMotion ? NO_MOTION_CONTAINER : GRID_STAGGER;
  const cardReveal = reducedMotion ? FADE_ONLY : CARD_REVEAL;
  const canLift = !reducedMotion && finePointer;

  const filteredProjects = useMemo(
    () => filterProjectsByCategory(projectsData, filter),
    [filter],
  );

  return (
    <section id="projects" className="py-24 sm:py-28 theme-bg-surface-1 relative">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <SectionHeader
          eyebrow={t.projects.badge}
          title={t.projects.title}
          description={t.projects.subtitle}
          className="mb-10 sm:mb-12"
        />

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[var(--border-subtle)]">
          {PROJECT_FILTERS.map((tab) => {
            const Icon = tab.icon;
            const isActive = filter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold flex items-center space-x-2 rtl:space-x-reverse transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent-cyan-dim)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)] shadow-sm'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.projects[tab.labelKey]}</span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <motion.div
          key={filter}
          variants={gridContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.length === 0 ? (
            <div className="col-span-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-10 sm:p-14 text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[var(--bg-surface-2)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border-subtle)]">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-[var(--text-heading)] mb-1.5">
                {t.projects.emptyTitle}
              </p>
              <p className="text-xs font-mono text-[var(--text-muted)] leading-relaxed">
                {t.projects.emptySubtitle}
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const title = isRtl ? project.titleAr : project.titleEn;
              const subtitle = isRtl ? project.subtitleAr : project.subtitleEn;
              const desc = isRtl ? project.descAr : project.descEn;
              const catMeta = getCategoryMeta(project.category);

              return (
                <motion.div
                  key={project.id}
                  variants={cardReveal}
                  layout={reducedMotion ? false : true}
                  onClick={() => setSelectedProject(project)}
                  whileHover={canLift ? { y: -4, transition: { duration: 0.3, ease: EASE_STANDARD } } : undefined}
                  whileTap={canLift ? { scale: 0.985 } : undefined}
                  className={`editorial-card p-6 sm:p-7 flex flex-col justify-between group cursor-pointer relative overflow-hidden ${catMeta.border}`}
                  id={`project-${project.id}`}
                >
                  {/* Header Metadata */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2.5 py-1 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider ${catMeta.badge}`}>
                        {project.category}
                      </span>
                      {project.isFlagship && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                          {t.projects.flagship}
                        </span>
                      )}
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-lg sm:text-xl font-bold font-display text-[var(--text-heading)] group-hover:text-[var(--accent-cyan)] transition-colors mb-1.5">
                      {title}
                    </h3>
                    <p className="text-xs font-mono text-[var(--accent-cyan)] mb-3 line-clamp-1">
                      {subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-6">
                      {desc}
                    </p>
                  </div>

                  {/* Tech Pills & Modal Trigger CTA */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-[var(--bg-surface-2)] text-[10px] font-mono text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="px-2 py-0.5 rounded bg-[var(--bg-surface-2)] text-[10px] font-mono text-[var(--text-muted)]">
                          +{project.tech.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono font-semibold text-[var(--text-secondary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                      <span>{t.projects.viewCaseStudy}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

      </div>

      {/* Project Case Study Deep-Dive Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
