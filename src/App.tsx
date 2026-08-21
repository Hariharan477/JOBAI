import React, { useState, useMemo, useEffect } from 'react';
import { Navigation, ScreenTab } from './components/Navigation';
import { OverviewScreen } from './components/OverviewScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OpportunitiesScreen } from './components/OpportunitiesScreen';
import { CareerPathScreen } from './components/CareerPathScreen';
import { WhatIfSimulatorScreen } from './components/WhatIfSimulatorScreen';
import { AIStrategistScreen } from './components/AIStrategistScreen';
import { AddSkillModal } from './components/AddSkillModal';
import { EvidenceDetailModal } from './components/EvidenceDetailModal';
import { JobMatchDetailModal } from './components/JobMatchDetailModal';
import { Footer } from './components/Footer';

import { DEMO_CANDIDATE, SEEDED_JOBS } from './data/seedData';
import { matchAllJobs, computeSkillGapAnalysis } from './utils/matcher';
import { CandidateProfile, JobMatchResult, SkillItem, SkillEvidenceItem } from './types';
import { Bot } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('overview');
  
  // Central State: Candidate Profile (Persisted or reset to DEMO_CANDIDATE)
  const [candidate, setCandidate] = useState<CandidateProfile>(() => {
    try {
      const saved = localStorage.getItem('jobai_candidate_profile');
      if (saved) {
        return JSON.parse(saved);
      }
      return DEMO_CANDIDATE;
    } catch {
      return DEMO_CANDIDATE;
    }
  });

  // Global Theme System (Persisted in localStorage, defaults to clean light mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('jobai_theme');
      if (saved) return saved === 'dark';
      return false; // Default to clean professional light theme
    } catch {
      return false;
    }
  });

  // Selected Skill for Evidence Detail Modal
  const [inspectingSkill, setInspectingSkill] = useState<SkillItem | null>(null);

  // Selected Job for Deep Dive Modal
  const [selectedJobMatch, setSelectedJobMatch] = useState<JobMatchResult | null>(null);

  // Add Skill Modal State
  const [isAddSkillOpen, setIsAddSkillOpen] = useState<boolean>(false);
  const [addSkillInitialName, setAddSkillInitialName] = useState<string>('');

  // What-If Simulator Initial Skill Target
  const [whatIfTargetSkill, setWhatIfTargetSkill] = useState<string>('TypeScript');

  // Recently verified skill banner state
  const [recentlyVerifiedSkill, setRecentlyVerifiedSkill] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('jobai_theme', isDarkMode ? 'dark' : 'light');
    } catch (e) {}

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('jobai_candidate_profile', JSON.stringify(candidate));
    } catch (e) {}
  }, [candidate]);

  // Compute deterministic matches based on central candidate profile state
  const jobMatches = useMemo(() => {
    return matchAllJobs(candidate, SEEDED_JOBS);
  }, [candidate]);

  // Compute dynamic skill gaps
  const gapAnalysis = useMemo(() => {
    return computeSkillGapAnalysis(candidate, jobMatches);
  }, [candidate, jobMatches]);

  // Reset to original Alex Morgan demo
  const handleResetDemo = () => {
    try {
      localStorage.removeItem('jobai_candidate_profile');
    } catch (e) {}
    setCandidate(DEMO_CANDIDATE);
    setCurrentTab('overview');
    setSelectedJobMatch(null);
    setInspectingSkill(null);
    setRecentlyVerifiedSkill(null);
    setWhatIfTargetSkill('TypeScript');
  };

  const handleOpenAddSkill = (skillName?: string) => {
    setAddSkillInitialName(skillName || '');
    setIsAddSkillOpen(true);
  };

  const handleAddSkillWithEvidence = (newSkill: SkillItem, evidence: SkillEvidenceItem) => {
    setCandidate(prev => {
      // Check if skill already exists in profile
      const existsIndex = prev.skills.findIndex(s => s.name.toLowerCase() === newSkill.name.toLowerCase());
      let updatedSkills: SkillItem[];

      if (existsIndex >= 0) {
        const existing = prev.skills[existsIndex];
        const mergedEvidence = [...(existing.evidenceItems || []), evidence];
        const mergedTimeline = [
          ...(existing.timeline || []),
          {
            date: new Date().toISOString().split('T')[0],
            action: 'Evidence Verified',
            note: evidence.title,
          },
        ];

        const updated: SkillItem = {
          ...existing,
          level: newSkill.level,
          claimedLevel: newSkill.claimedLevel || existing.claimedLevel,
          verifiedLevel: newSkill.verifiedLevel,
          verificationStatus: 'verified',
          confidence: newSkill.confidence,
          evidence: {
            ...existing.evidence,
            aiAssessment: true,
            usedInProject: true,
            verifiedLevel: newSkill.verifiedLevel,
            verifiedScore: newSkill.confidence,
            lastValidated: `Verified (${newSkill.confidence}% confidence)`,
          },
          evidenceItems: mergedEvidence,
          timeline: mergedTimeline,
          confidenceBreakdown: newSkill.confidenceBreakdown,
        };

        updatedSkills = [...prev.skills];
        updatedSkills[existsIndex] = updated;
      } else {
        updatedSkills = [...prev.skills, newSkill];
      }

      return {
        ...prev,
        skills: updatedSkills,
      };
    });

    setRecentlyVerifiedSkill(newSkill.name);
  };

  const handleNavigateToWhatIf = (skillName?: string) => {
    if (skillName) {
      setWhatIfTargetSkill(skillName);
    }
    setCurrentTab('whatif');
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-[#0a0f1a] text-[#0f172a] dark:text-[#f1f5f9] flex flex-col font-sans antialiased transition-colors">
      
      {/* Top Application Shell Navigation & Global Mobile Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        candidate={candidate}
        onResetDemo={handleResetDemo}
        onOpenAddSkill={() => handleOpenAddSkill()}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />

      {/* Main Screen Router with safe padding on mobile so nothing is hidden behind the bottom bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        
        {currentTab === 'overview' && (
          <OverviewScreen
            candidate={candidate}
            jobMatches={jobMatches}
            gapAnalysis={gapAnalysis}
            onSelectTab={setCurrentTab}
            onOpenAddSkill={handleOpenAddSkill}
            onSelectJob={(match) => setSelectedJobMatch(match)}
            onNavigateToWhatIf={handleNavigateToWhatIf}
            recentlyVerifiedSkill={recentlyVerifiedSkill}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            candidate={candidate}
            onOpenAddSkill={handleOpenAddSkill}
            onOpenEvidenceDetail={(skill) => setInspectingSkill(skill)}
            onNavigateToWhatIf={handleNavigateToWhatIf}
            onNavigateToOpportunities={() => setCurrentTab('opportunities')}
          />
        )}

        {currentTab === 'opportunities' && (
          <OpportunitiesScreen
            jobMatches={jobMatches}
            onSelectJob={(match) => setSelectedJobMatch(match)}
            onProveSkill={(skillName) => handleOpenAddSkill(skillName)}
          />
        )}

        {currentTab === 'career-path' && (
          <CareerPathScreen
            candidate={candidate}
            jobMatches={jobMatches}
            gapAnalysis={gapAnalysis}
            onOpenAddSkill={handleOpenAddSkill}
            onNavigateToWhatIf={handleNavigateToWhatIf}
          />
        )}

        {currentTab === 'whatif' && (
          <WhatIfSimulatorScreen
            candidate={candidate}
            onOpenAddSkill={handleOpenAddSkill}
            initialSimulatedSkill={whatIfTargetSkill}
          />
        )}

        {currentTab === 'strategist' && (
          <AIStrategistScreen
            candidate={candidate}
            jobMatches={jobMatches}
            gapAnalysis={gapAnalysis}
            onSelectTab={setCurrentTab}
            onOpenAddSkill={handleOpenAddSkill}
            onSelectJob={(match) => setSelectedJobMatch(match)}
            onNavigateToWhatIf={handleNavigateToWhatIf}
          />
        )}

      </main>

      {/* Add Skill & Evidence Review Modal */}
      {isAddSkillOpen && (
        <AddSkillModal
          isOpen={isAddSkillOpen}
          onClose={() => setIsAddSkillOpen(false)}
          onAddSkillWithEvidence={handleAddSkillWithEvidence}
          initialSkillName={addSkillInitialName}
        />
      )}

      {/* Skill Evidence Detail Modal */}
      {inspectingSkill && (
        <EvidenceDetailModal
          skill={inspectingSkill}
          onClose={() => setInspectingSkill(null)}
          onAddMoreEvidence={(name) => {
            setInspectingSkill(null);
            handleOpenAddSkill(name);
          }}
        />
      )}

      {/* Job Match Detail Modal */}
      {selectedJobMatch && (
        <JobMatchDetailModal
          jobMatch={selectedJobMatch}
          candidate={candidate}
          onClose={() => setSelectedJobMatch(null)}
          onNavigateToWhatIf={handleNavigateToWhatIf}
          onNavigateToSkillGap={() => {
            setSelectedJobMatch(null);
            setCurrentTab('career-path');
          }}
        />
      )}

      {/* Desktop/Tablet Floating AI Strategist Quick Launcher (Hidden on mobile and hidden on strategist tab) */}
      {currentTab !== 'strategist' && (
        <button
          onClick={() => setCurrentTab('strategist')}
          className="hidden md:flex fixed bottom-6 right-6 z-30 px-4 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-lg items-center gap-2 cursor-pointer transition-all hover:scale-105"
          title="Ask AI Career Strategist"
        >
          <Bot className="w-4 h-4" />
          <span>AI Strategist</span>
        </button>
      )}

      {/* Desktop Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onResetDemo={handleResetDemo}
      />

    </div>
  );
}
