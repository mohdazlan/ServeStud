import { useState, useEffect } from 'react'
import {
  SQL_ACTIVITIES,
  RESEARCH_STUDY_INFO,
} from './data/sqlCurriculum.js'
import { createSessionDatabase, executeSqlQuery, checkActivityAnswer } from './engine/sqlEngine.js'
import { generateGenAiFeedback } from './engine/aiTutorEngine.js'
import { soundEffects } from './engine/soundEffects.js'

import { TopNav } from './components/TopNav.jsx'
import { LeftPanelTasks } from './components/LeftPanelTasks.jsx'
import { SchemaViewer } from './components/SchemaViewer.jsx'
import { SqlEditor } from './components/SqlEditor.jsx'
import { ResultDisplay } from './components/ResultDisplay.jsx'
import { AiFeedbackPanel } from './components/AiFeedbackPanel.jsx'
import { ResearchHub } from './components/ResearchHub.jsx'
import { SqlCheatSheet } from './components/SqlCheatSheet.jsx'
import { AiSettingsModal } from './components/AiSettingsModal.jsx'
import { ResearchStudyModal } from './components/ResearchStudyModal.jsx'

import { Sparkles, Layers, Code2, Bot, ExternalLink } from 'lucide-react'
import './sqlGuru.css'

export function SQLGuruApp({
  onSwitchToServeStud,
  onSwitchToRegExSifu,
  onSwitchToTopic3,
}) {
  const [activeTab, setActiveTab] = useState('playground') // 'playground' | 'cheatsheet' | 'research'
  const [selectedActivityId, setSelectedActivityId] = useState(SQL_ACTIVITIES[0].id)
  const [mobileSubTab, setMobileSubTab] = useState('editor') // 'tasks' | 'editor' | 'schema' | 'ai'

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false)

  // Activities completion tracking
  const [completedActivityIds, setCompletedActivityIds] = useState(() => {
    try {
      const saved = localStorage.getItem('sql_guru_completed_activities')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // User Code Buffer per activity
  const [userCodes, setUserCodes] = useState(() => {
    const initial = {}
    SQL_ACTIVITIES.forEach((act) => {
      initial[act.id] = act.starterCode
    })
    return initial
  })

  // Hint Levels per activity (0 = none, 1 = tier 1, 2 = tier 2, 3 = tier 3)
  const [hintTiers, setHintTiers] = useState({})

  // Execution & AI Feedback States
  const [dbState, setDbState] = useState(() => createSessionDatabase('dreamhome'))
  const [execResult, setExecResult] = useState(null)
  const [evaluationResult, setEvaluationResult] = useState(null)
  const [aiFeedbackData, setAiFeedbackData] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)

  const currentActivity =
    SQL_ACTIVITIES.find((a) => a.id === selectedActivityId) || SQL_ACTIVITIES[0]

  const currentCode = userCodes[selectedActivityId] || currentActivity.starterCode
  const currentHintTier = hintTiers[selectedActivityId] || 0

  // Update document title
  useEffect(() => {
    const origTitle = document.title
    document.title = 'SQL-Guru // AI Tutor Pangkalan Data Relasi (IUCEL 2025)'
    return () => {
      document.title = origTitle
    }
  }, [])

  // Sync DB state whenever activity changes
  useEffect(() => {
    setDbState(createSessionDatabase(currentActivity.dbKey))
    setExecResult(null)
    setEvaluationResult(null)
    setAiFeedbackData(null)
  }, [selectedActivityId, currentActivity.dbKey])

  const handleSelectActivity = (id) => {
    setSelectedActivityId(id)
    setMobileSubTab('editor')
  }

  const handleUpdateCode = (newCode) => {
    setUserCodes((prev) => ({
      ...prev,
      [selectedActivityId]: newCode,
    }))
  }

  const handleResetCode = () => {
    handleUpdateCode(currentActivity.starterCode)
    setHintTiers((prev) => ({
      ...prev,
      [selectedActivityId]: 0,
    }))
    setExecResult(null)
    setEvaluationResult(null)
    setAiFeedbackData(null)
  }

  // 1. Run SQL execution
  const handleRunSql = () => {
    const res = executeSqlQuery(currentCode, dbState)
    setExecResult(res)
    if (res.success) {
      soundEffects.playSuccess()
    } else {
      soundEffects.playError()
    }
  }

  // 2. Check Answer validation
  const handleCheckAnswer = () => {
    setIsEvaluating(true)
    const evalRes = checkActivityAnswer(currentCode, currentActivity)
    setEvaluationResult(evalRes)

    if (evalRes.passed) {
      soundEffects.playSuccess()
      if (!completedActivityIds.includes(currentActivity.id)) {
        const nextCompleted = [...completedActivityIds, currentActivity.id]
        setCompletedActivityIds(nextCompleted)
        try {
          localStorage.setItem(
            'sql_guru_completed_activities',
            JSON.stringify(nextCompleted)
          )
        } catch {
          // LocalStorage fallback
        }
      }
    } else {
      soundEffects.playError()
    }
    setIsEvaluating(false)
  }

  // 3. Request Contextual Hint
  const handleRequestHint = () => {
    const max = currentActivity.hints ? currentActivity.hints.length : 3
    const nextTier = Math.min(max, currentHintTier + 1)
    setHintTiers((prev) => ({
      ...prev,
      [selectedActivityId]: nextTier,
    }))
  }

  // 4. Request GenAI Feedback
  const handleRequestAiFeedback = async () => {
    setIsGeneratingAi(true)
    try {
      const savedProvider = localStorage.getItem('sql_guru_ai_provider') || 'local'
      const savedOrKey = localStorage.getItem('sql_guru_openrouter_key') || ''
      const savedGeminiKey = localStorage.getItem('sql_guru_gemini_key') || ''
      const savedModel = localStorage.getItem('sql_guru_model') || 'google/gemini-2.5-flash'

      const activeKey = savedProvider === 'openrouter' ? savedOrKey : savedGeminiKey

      const aiRes = await generateGenAiFeedback({
        userSql: currentCode,
        activity: currentActivity,
        apiKey: activeKey,
        apiProvider: savedProvider,
        selectedModel: savedModel,
      })

      setAiFeedbackData(aiRes)
      soundEffects.playSuccess()
      if (window.innerWidth < 1024) {
        setMobileSubTab('ai')
      }
    } catch (err) {
      console.error('Error in GenAI Feedback:', err)
      soundEffects.playError()
    } finally {
      setIsGeneratingAi(false)
    }
  }

  const handleApplyImprovedCode = (code) => {
    if (code) {
      handleUpdateCode(code)
      soundEffects.playSuccess()
      setMobileSubTab('editor')
    }
  }

  const activeHints = (currentActivity.hints || []).filter(
    (h) => h.level <= currentHintTier
  )

  return (
    <div className="sql-guru-theme min-h-screen flex flex-col bg-[#070e17] text-slate-100 antialiased">
      {/* Top App Header */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          window.scrollTo({ top: 0, behavior: 'instant' })
        }}
        onOpenSurvey={() => setIsSurveyModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSwitchToServeStud={onSwitchToServeStud}
        onSwitchToRegExSifu={onSwitchToRegExSifu}
        onSwitchToTopic3={onSwitchToTopic3}
      />

      {/* Top Banner: Invitation to Participate in Usability Evaluation */}
      <div className="bg-gradient-to-r from-[#0d1e38] via-[#102a4a] to-[#0d1e38] border-b border-[#1c3961] px-3 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <p className="text-slate-300">
            <strong className="text-amber-300">Kajian Usability Tutor AI (IUCEL 2025):</strong> Sertai kajian penilaian kebolehgunaan AI SQL Tutor bersama UTP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSurveyModalOpen(true)}
            className="text-amber-300 hover:text-amber-200 underline font-semibold flex items-center gap-1"
          >
            <span>Panduan & Info Kajian</span>
          </button>
          <span className="text-slate-600">·</span>
          <a
            href={RESEARCH_STUDY_INFO.surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1 transition-colors"
          >
            <span>📝 Isi Borang Soal Selidik</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Main Views */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === 'playground' && (
          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[280px_1fr_360px] xl:grid-cols-[300px_1fr_380px] min-h-0">
            {/* Left Column: Activity Selector */}
            <LeftPanelTasks
              activities={SQL_ACTIVITIES}
              selectedActivityId={selectedActivityId}
              onSelectActivity={handleSelectActivity}
              completedActivityIds={completedActivityIds}
              className={`h-[calc(100vh-95px)] ${
                mobileSubTab === 'tasks' ? 'flex' : 'hidden lg:flex'
              }`}
            />

            {/* Center Column: Scenario Description, Schema Viewer & SQL Editor */}
            <div
              className={`flex-1 flex flex-col min-h-0 h-[calc(100vh-95px)] overflow-y-auto sql-guru-scrollbar p-3 sm:p-4 space-y-3.5 ${
                mobileSubTab === 'editor' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              {/* Activity Scenario Card */}
              <div className="rounded-xl bg-[#0b1320] border border-[#1e314f] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                    {currentActivity.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Tahap: <strong className="text-slate-200">{currentActivity.level}</strong>
                  </span>
                </div>

                <h2 className="text-sm font-bold text-white leading-snug">
                  {currentActivity.title}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentActivity.scenario}
                </p>

                <div className="pt-2 border-t border-[#182840] flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Sasaran: <strong className="text-emerald-300">{currentActivity.targetGoal}</strong>
                  </span>
                </div>
              </div>

              {/* Schema & Data Viewer */}
              <SchemaViewer
                dbKey={currentActivity.dbKey}
                onInsertColumnName={(col) => {
                  handleUpdateCode(currentCode + ` ${col}`)
                  soundEffects.playClick()
                }}
              />

              {/* Interactive SQL Editor */}
              <SqlEditor
                sql={currentCode}
                onChangeSql={handleUpdateCode}
                onRunSql={handleRunSql}
                onCheckAnswer={handleCheckAnswer}
                onRequestHint={handleRequestHint}
                onRequestAiFeedback={handleRequestAiFeedback}
                onResetCode={handleResetCode}
                isEvaluating={isEvaluating}
                isGeneratingAi={isGeneratingAi}
                activeHintTier={currentHintTier}
                maxHints={currentActivity.hints ? currentActivity.hints.length : 3}
              />

              {/* Results & Evaluation Display */}
              <ResultDisplay
                execResult={execResult}
                evaluationResult={evaluationResult}
                activeHints={activeHints}
              />
            </div>

            {/* Right Column: GenAI Feedback & Learning Coach */}
            <div
              className={`h-[calc(100vh-95px)] overflow-y-auto sql-guru-scrollbar p-3 sm:p-4 space-y-3.5 border-l border-[#1e314f] bg-[#09111c] ${
                mobileSubTab === 'ai' ? 'flex flex-col' : 'hidden lg:flex flex-col'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#1b2c45]">
                <div className="flex items-center gap-1.5">
                  <Bot size={16} className="text-indigo-400" />
                  <h3 className="text-xs font-bold text-slate-200">
                    Panel Bimbingan GenAI Tutor
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-[10px] text-indigo-300 hover:underline"
                >
                  Tukar Model
                </button>
              </div>

              {aiFeedbackData ? (
                <AiFeedbackPanel
                  feedbackData={aiFeedbackData}
                  onApplyImprovedCode={handleApplyImprovedCode}
                />
              ) : (
                <div className="p-4 rounded-xl bg-[#0b1424] border border-[#1a2d48] text-center space-y-3 text-xs text-slate-400">
                  <div className="size-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-300">
                    <Bot size={20} />
                  </div>
                  <h4 className="font-bold text-slate-200">Belum Ada Maklum Balas AI</h4>
                  <p className="text-[11px] leading-relaxed">
                    Tekan butang <strong className="text-indigo-300">"Tanya Tutor AI"</strong> di bawah editor SQL untuk menerima semakan semantik pintar mengikut format kajian UTP.
                  </p>
                  <button
                    type="button"
                    onClick={handleRequestAiFeedback}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors inline-flex items-center gap-1.5"
                  >
                    <Sparkles size={13} />
                    <span>Minta Maklum Balas AI Sekarang</span>
                  </button>
                </div>
              )}

              {/* Quick Info on TAM Usability Research */}
              <div className="p-3 rounded-xl bg-[#0e1829] border border-[#1b2d48] space-y-1.5 text-xs text-slate-300">
                <span className="font-bold text-emerald-400 block text-[11px]">
                  Refleksi Kajian:
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Berdasarkan kajian, petunjuk bertingkat membolehkan pelajar membina kemahiran penyelesaian masalah secara kendiri tanpa bergantung kepada jawapan serta-merta (*"I want help, not the answer!"*).
                </p>
              </div>
            </div>

            {/* Mobile Bottom Mode Bar (<1024px) */}
            <nav
              className="lg:hidden sticky bottom-0 z-30 border-t border-[#1e314f] bg-[#070e17]/95 backdrop-blur px-2 py-1.5 flex items-center justify-around"
              aria-label="Mobile Navigation"
            >
              <button
                type="button"
                onClick={() => setMobileSubTab('tasks')}
                className={`px-3 py-1 flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  mobileSubTab === 'tasks'
                    ? 'text-emerald-400 bg-emerald-950/60 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers size={16} />
                <span className="text-[10px] mt-0.5">Latihan</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileSubTab('editor')}
                className={`px-3 py-1 flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  mobileSubTab === 'editor'
                    ? 'text-emerald-400 bg-emerald-950/60 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 size={16} />
                <span className="text-[10px] mt-0.5">Editor & SQL</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileSubTab('ai')}
                className={`px-3 py-1 flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  mobileSubTab === 'ai'
                    ? 'text-indigo-400 bg-indigo-950/60 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bot size={16} />
                <span className="text-[10px] mt-0.5">AI Tutor</span>
              </button>
            </nav>
          </div>
        )}

        {activeTab === 'cheatsheet' && <SqlCheatSheet />}

        {activeTab === 'research' && <ResearchHub />}
      </div>

      {/* AI Settings Modal */}
      <AiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Research Usability Study Modal */}
      <ResearchStudyModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
      />
    </div>
  )
}
