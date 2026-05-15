export type DocCategory = 'automation' | 'strategy' | 'research'

export type StrategyDocument = {
  slug: string
  filename: string
  title: string
  blurb: string
  category: DocCategory
}

export const STRATEGY_DOCUMENTS: StrategyDocument[] = [
  {
    slug: 'intake-classifier',
    filename: 'axxiom_intake_classifier_stepper.html',
    title: 'Intake & AI classifier',
    blurb: 'Channels, normalisation, classifier output, work orders, and edge cases.',
    category: 'automation',
  },
  {
    slug: 'compliance-gate',
    filename: 'axxiom_compliance_gate.html',
    title: 'Compliance gate',
    blurb: 'Four sequential checks before technician assignment.',
    category: 'automation',
  },
  {
    slug: 'dispatch-architecture',
    filename: 'axxiom_dispatch_agent_architecture.html',
    title: 'Dispatch agent architecture',
    blurb: 'Dynamics-native layers, stack, and rollout phases.',
    category: 'automation',
  },
  {
    slug: 'predictive-maintenance',
    filename: 'axxiom_predictive_maintenance_ai.html',
    title: 'Predictive maintenance AI',
    blurb: 'Data sources, risk model, alerts, workflows, and revenue hooks.',
    category: 'automation',
  },
  {
    slug: 'ai-automation-map',
    filename: 'axxiom_ai_automation_map.html',
    title: 'AI automation map',
    blurb: 'Eight high-impact systems across ops and marketing.',
    category: 'automation',
  },
  {
    slug: 'ghl-automations',
    filename: 'axxiom_ghl_automations.html',
    title: 'GoHighLevel automations',
    blurb:
      'Ten GHL workflows — lead nurture, client retention, reviews, revenue signals, and dual pipelines for a multi-market elevator operator.',
    category: 'automation',
  },
  {
    slug: 'ai-agents-automations',
    filename: 'axxiom_ai_agents_automations.html',
    title: 'AI agents & automations',
    blurb:
      'End-to-end architecture: GHL, Dynamics, FieldBoss, Google Analytics, and Power BI — marketing agents, ops agents, data model, and BI layer.',
    category: 'automation',
  },
  {
    slug: 'data-foundation',
    filename: 'axxiom_data_foundation_execution.html',
    title: 'Data foundation execution',
    blurb: 'Six-phase audit through automated pipeline.',
    category: 'strategy',
  },
  {
    slug: 'week-one',
    filename: 'axxiom_week1_execution.html',
    title: 'Week 1 execution',
    blurb: 'Day-by-day war plan for the engagement kickoff.',
    category: 'strategy',
  },
  {
    slug: 'three-year-positioning',
    filename: 'axxiom_3year_positioning.html',
    title: '3-year positioning',
    blurb: 'Operator → intelligence → platform arc, moats, and risks.',
    category: 'strategy',
  },
  {
    slug: 'trusted-data-company',
    filename: 'axxiom_trusted_data_company_strategy.html',
    title: 'Trusted data company',
    blurb: 'Five pillars from data asset to owning the standard.',
    category: 'strategy',
  },
  {
    slug: 'data-cleaning-playbook',
    filename: 'axxiom_data_cleaning_playbook.html',
    title: 'Data cleaning playbook',
    blurb: 'Practical playbook for cleaning elevator service data.',
    category: 'strategy',
  },
  {
    slug: 'marketing-strategy',
    filename: 'axxiom_marketing_strategy.html',
    title: 'Marketing strategy',
    blurb: 'Marketing narrative and channel guidance.',
    category: 'strategy',
  },
  {
    slug: 'company-size-snapshot',
    filename: 'axxiom_company_size_snapshot.html',
    title: 'Company size snapshot',
    blurb: 'Scale and structure reference.',
    category: 'research',
  },
  {
    slug: 'competitor-analysis',
    filename: 'axxiom_competitor_analysis.html',
    title: 'Competitor analysis',
    blurb: 'Competitive landscape notes.',
    category: 'research',
  },
]

export function getDocumentBySlug(slug: string | undefined): StrategyDocument | undefined {
  return STRATEGY_DOCUMENTS.find((d) => d.slug === slug)
}

export const categoryLabel: Record<DocCategory, string> = {
  automation: 'Automation',
  strategy: 'Strategy & execution',
  research: 'Research',
}
