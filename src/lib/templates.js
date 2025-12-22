import { generateId } from './tree-utils'

function createTemplateTree(title, description, nodes) {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title,
    description,
    version: '1.0.0',
    metadata: {
      created_at: now,
      updated_at: now,
      tags: []
    },
    root_node: {
      id: generateId(),
      title: 'Root',
      content: '',
      examples: [],
      children: nodes.map(node => createNodeRecursive(node))
    }
  }
}

function createNodeRecursive(node) {
  return {
    id: generateId(),
    title: node.title,
    content: node.content || '',
    examples: node.examples || [],
    children: (node.children || []).map(child => createNodeRecursive(child))
  }
}

export const TEMPLATE_CATEGORIES = {
  General: ['Blank'],
  Career: ['Job Application Optimizer', 'Technical Portfolio Piece', 'Interview Prep Guide'],
  Business: ['Marketing Campaign', 'Data Analysis Report', 'Consulting Proposal', 'Meeting Prep'],
  Engineering: ['DevOps CI/CD Pipeline', 'Code Review Checklist', 'Technical Documentation', 'Code Review Request'],
  Security: ['Cybersecurity Incident Response', 'Phishing Analysis Report', 'Security Audit Scope'],
  Product: ['Product Requirements'],
  AI: ['AI Agent Prompt', 'Customer Support Bot', 'System Prompt Builder', 'Ollama Modelfile Builder', 'Multi-Agent Orchestration'],
  Creative: ['Music Production Brief', 'Guitar Lesson Plan', 'Album Concept Document'],
  Marketing: ['LinkedIn Post Builder'],
  Coparenting: ['Weekly Handoff Notes', 'Co-Parent Communication'],
  Deployment: ['Vercel Deploy Checklist', 'API Endpoint Documentation']
}

export const TEMPLATES = {
  'Blank': {
    icon: '📄',
    category: 'General',
    description: 'Start with a clean slate',
    create: () => createTemplateTree('New Prompt Tree', 'A structured prompt tree', [])
  },

  'Cybersecurity Incident Response': {
    icon: '🛡️',
    category: 'Security',
    description: 'NIST-aligned incident response framework',
    create: () => createTemplateTree(
      'Incident Response Plan',
      'Structured approach for cybersecurity incident handling',
      [
        {
          title: 'Preparation',
          content: 'Establish incident response capability and maintain readiness',
          children: [
            { title: 'Team Roles', content: 'Define CSIRT roles and responsibilities' },
            { title: 'Tools & Resources', content: 'Inventory of forensic and response tools' }
          ]
        },
        {
          title: 'Detection & Analysis',
          content: 'Identify and validate potential security incidents',
          children: [
            { title: 'Alert Triage', content: 'Initial assessment of security alerts' },
            { title: 'Severity Classification', content: 'P1-P4 incident classification criteria' }
          ]
        },
        {
          title: 'Containment',
          content: 'Limit the scope and impact of the incident',
          children: [
            { title: 'Short-term', content: 'Immediate containment actions' },
            { title: 'Long-term', content: 'Sustained containment strategies' }
          ]
        },
        {
          title: 'Recovery',
          content: 'Restore systems to normal operation',
          children: [
            { title: 'Eradication', content: 'Remove threat artifacts' },
            { title: 'Restoration', content: 'Bring systems back online' }
          ]
        },
        {
          title: 'Post-Incident',
          content: 'Learn from the incident and improve defenses',
          children: [
            { title: 'Lessons Learned', content: 'Document findings and recommendations' }
          ]
        }
      ]
    )
  },

  'Marketing Campaign': {
    icon: '📢',
    category: 'Business',
    description: 'End-to-end marketing campaign planning',
    create: () => createTemplateTree(
      'Marketing Campaign Plan',
      'Comprehensive marketing campaign structure',
      [
        {
          title: 'Campaign Overview',
          content: 'Define campaign objectives and success metrics',
          children: [
            { title: 'Goals', content: 'Specific, measurable campaign objectives' },
            { title: 'Target Audience', content: 'Detailed buyer persona and segmentation' }
          ]
        },
        {
          title: 'Content Strategy',
          content: 'Content themes and messaging framework',
          children: [
            { title: 'Key Messages', content: 'Core value propositions and talking points' },
            { title: 'Content Calendar', content: 'Timeline of content deliverables' }
          ]
        },
        {
          title: 'Channels',
          content: 'Distribution channels and tactics',
          children: [
            { title: 'Paid Media', content: 'Advertising platforms and budgets' },
            { title: 'Owned Media', content: 'Website, email, social media strategy' },
            { title: 'Earned Media', content: 'PR and influencer outreach' }
          ]
        },
        {
          title: 'Measurement',
          content: 'KPIs and reporting framework',
          children: [
            { title: 'KPIs', content: 'Key performance indicators to track' },
            { title: 'Reporting', content: 'Dashboard and reporting cadence' }
          ]
        }
      ]
    )
  },

  'DevOps CI/CD Pipeline': {
    icon: '🔧',
    category: 'Engineering',
    description: 'CI/CD pipeline configuration checklist',
    create: () => createTemplateTree(
      'CI/CD Pipeline Design',
      'Infrastructure and deployment automation framework',
      [
        {
          title: 'Source Control',
          content: 'Git branching and commit strategies',
          children: [
            { title: 'Branch Strategy', content: 'GitFlow, trunk-based, or feature branches' },
            { title: 'Code Review', content: 'PR requirements and approval process' }
          ]
        },
        {
          title: 'Build Stage',
          content: 'Compilation and artifact creation',
          children: [
            { title: 'Dependencies', content: 'Package management and caching' },
            { title: 'Build Triggers', content: 'When builds are triggered' }
          ]
        },
        {
          title: 'Test Stage',
          content: 'Automated testing requirements',
          children: [
            { title: 'Unit Tests', content: 'Coverage requirements and frameworks' },
            { title: 'Integration Tests', content: 'End-to-end and API testing' },
            { title: 'Security Scans', content: 'SAST, DAST, dependency scanning' }
          ]
        },
        {
          title: 'Deploy Stage',
          content: 'Environment promotion strategy',
          children: [
            { title: 'Environments', content: 'Dev, staging, production configuration' },
            { title: 'Rollback', content: 'Rollback procedures and triggers' }
          ]
        }
      ]
    )
  },

  'Product Requirements': {
    icon: '📋',
    category: 'Product',
    description: 'Product requirements document template',
    create: () => createTemplateTree(
      'Product Requirements Document',
      'Structured product specification',
      [
        {
          title: 'Problem Statement',
          content: 'Define the problem being solved',
          children: [
            { title: 'User Pain Points', content: 'Specific problems users face' },
            { title: 'Business Impact', content: 'Why this matters to the business' }
          ]
        },
        {
          title: 'Solution Overview',
          content: 'High-level solution approach',
          children: [
            { title: 'Proposed Solution', content: 'How we will solve the problem' },
            { title: 'Success Criteria', content: 'How we measure success' }
          ]
        },
        {
          title: 'User Stories',
          content: 'User-centric requirements',
          children: [
            { title: 'Must Have', content: 'P0 requirements for MVP' },
            { title: 'Should Have', content: 'P1 requirements for v1' },
            { title: 'Nice to Have', content: 'P2 future enhancements' }
          ]
        },
        {
          title: 'Technical Requirements',
          content: 'Non-functional requirements',
          children: [
            { title: 'Performance', content: 'Response time, throughput requirements' },
            { title: 'Security', content: 'Authentication, authorization, data protection' }
          ]
        }
      ]
    )
  },

  'AI Agent Prompt': {
    icon: '🤖',
    category: 'AI',
    description: 'System prompt structure for AI agents',
    create: () => createTemplateTree(
      'AI Agent System Prompt',
      'Comprehensive system prompt for AI assistants',
      [
        {
          title: 'Role Definition',
          content: 'Define the AI agent\'s identity and expertise',
          examples: ['You are an expert data analyst...', 'You are a helpful coding assistant...']
        },
        {
          title: 'Capabilities',
          content: 'What the agent can do',
          children: [
            { title: 'Core Skills', content: 'Primary capabilities and strengths' },
            { title: 'Limitations', content: 'What the agent cannot or should not do' }
          ]
        },
        {
          title: 'Instructions',
          content: 'How the agent should behave',
          children: [
            { title: 'Communication Style', content: 'Tone, format, level of detail' },
            { title: 'Response Format', content: 'Structure of outputs' }
          ]
        },
        {
          title: 'Context',
          content: 'Background information for the agent',
          children: [
            { title: 'Domain Knowledge', content: 'Relevant expertise and facts' },
            { title: 'Constraints', content: 'Rules and guardrails' }
          ]
        },
        {
          title: 'Examples',
          content: 'Few-shot examples of desired behavior',
          examples: ['User: "..." → Agent: "..."']
        }
      ]
    )
  },

  'Code Review Checklist': {
    icon: '🔍',
    category: 'Engineering',
    description: 'Structured code review process',
    create: () => createTemplateTree(
      'Code Review Checklist',
      'Systematic approach to code review',
      [
        {
          title: 'Functionality',
          content: 'Does the code work as intended?',
          children: [
            { title: 'Requirements', content: 'Does it meet the acceptance criteria?' },
            { title: 'Edge Cases', content: 'Are edge cases handled?' }
          ]
        },
        {
          title: 'Code Quality',
          content: 'Is the code clean and maintainable?',
          children: [
            { title: 'Readability', content: 'Is the code easy to understand?' },
            { title: 'DRY Principle', content: 'Is there unnecessary duplication?' },
            { title: 'Naming', content: 'Are variables and functions well-named?' }
          ]
        },
        {
          title: 'Testing',
          content: 'Is the code adequately tested?',
          children: [
            { title: 'Unit Tests', content: 'Are there sufficient unit tests?' },
            { title: 'Test Coverage', content: 'Is coverage adequate?' }
          ]
        },
        {
          title: 'Security',
          content: 'Are there security concerns?',
          children: [
            { title: 'Input Validation', content: 'Is user input validated?' },
            { title: 'Sensitive Data', content: 'Are secrets properly handled?' }
          ]
        },
        {
          title: 'Performance',
          content: 'Are there performance concerns?',
          children: [
            { title: 'Efficiency', content: 'Is the algorithm efficient?' },
            { title: 'Resource Usage', content: 'Memory and CPU considerations' }
          ]
        }
      ]
    )
  },

  'Customer Support Bot': {
    icon: '💬',
    category: 'AI',
    description: 'AI chatbot for customer service',
    create: () => createTemplateTree(
      'Customer Support Bot',
      'System prompt for customer service AI assistant',
      [
        {
          title: 'Identity',
          content: 'You are a friendly and professional customer support representative for [Company Name]. Your goal is to help customers resolve issues quickly while maintaining a positive experience.',
          children: [
            { title: 'Personality', content: 'Warm, patient, empathetic, solution-oriented. Never defensive or dismissive.' },
            { title: 'Voice', content: 'Professional but conversational. Use simple language, avoid jargon.' }
          ]
        },
        {
          title: 'Knowledge Base',
          content: 'Information the bot should know',
          children: [
            { title: 'Products/Services', content: 'Core offerings, pricing, features, and limitations' },
            { title: 'Common Issues', content: 'Frequent problems and their solutions' },
            { title: 'Policies', content: 'Refund policy, shipping times, warranty information' }
          ]
        },
        {
          title: 'Response Guidelines',
          content: 'How to handle different situations',
          children: [
            { title: 'Greetings', content: 'Acknowledge the customer, ask how you can help' },
            { title: 'Problem Solving', content: 'Ask clarifying questions, provide step-by-step solutions' },
            { title: 'Escalation', content: 'When to transfer to human agent: billing disputes, complex technical issues, angry customers' },
            { title: 'Closing', content: 'Confirm resolution, ask if anything else is needed, thank the customer' }
          ]
        },
        {
          title: 'Constraints',
          content: 'What the bot should NOT do',
          children: [
            { title: 'Never', content: 'Make promises you cannot keep, share internal information, argue with customers' },
            { title: 'Always', content: 'Protect customer privacy, verify identity before account changes, log interactions' }
          ]
        }
      ]
    )
  },

  'Technical Documentation': {
    icon: '📚',
    category: 'Engineering',
    description: 'README and documentation structure',
    create: () => createTemplateTree(
      'Technical Documentation',
      'Comprehensive documentation template for software projects',
      [
        {
          title: 'Overview',
          content: 'What this project does and why it exists',
          children: [
            { title: 'Description', content: 'One paragraph explaining the project purpose and key benefits' },
            { title: 'Features', content: 'Bullet list of main capabilities' },
            { title: 'Demo', content: 'Link to live demo, screenshots, or GIF showing the project in action' }
          ]
        },
        {
          title: 'Getting Started',
          content: 'How to install and run the project',
          children: [
            { title: 'Prerequisites', content: 'Required software, versions, and dependencies' },
            { title: 'Installation', content: 'Step-by-step setup instructions with code blocks' },
            { title: 'Quick Start', content: 'Minimal example to get something working immediately' }
          ]
        },
        {
          title: 'Usage',
          content: 'How to use the project',
          children: [
            { title: 'Basic Usage', content: 'Common use cases with examples' },
            { title: 'Configuration', content: 'Available options and environment variables' },
            { title: 'API Reference', content: 'Function signatures, parameters, return values' }
          ]
        },
        {
          title: 'Development',
          content: 'Information for contributors',
          children: [
            { title: 'Architecture', content: 'High-level system design and folder structure' },
            { title: 'Contributing', content: 'How to submit issues and pull requests' },
            { title: 'Testing', content: 'How to run tests and add new ones' }
          ]
        },
        {
          title: 'Additional Info',
          content: 'Supporting information',
          children: [
            { title: 'Troubleshooting', content: 'Common problems and solutions' },
            { title: 'License', content: 'License type and terms' },
            { title: 'Credits', content: 'Acknowledgments and dependencies' }
          ]
        }
      ]
    )
  },

  'Data Analysis Report': {
    icon: '📊',
    category: 'Business',
    description: 'Structure for data analysis findings',
    create: () => createTemplateTree(
      'Data Analysis Report',
      'Framework for presenting data analysis and insights',
      [
        {
          title: 'Executive Summary',
          content: 'Key findings and recommendations in 2-3 paragraphs for stakeholders who won\'t read the full report',
          children: [
            { title: 'Key Findings', content: '3-5 most important discoveries from the analysis' },
            { title: 'Recommendations', content: 'Actionable next steps based on the data' }
          ]
        },
        {
          title: 'Methodology',
          content: 'How the analysis was conducted',
          children: [
            { title: 'Data Sources', content: 'Where the data came from, time period covered' },
            { title: 'Analysis Methods', content: 'Statistical techniques, tools used, assumptions made' },
            { title: 'Limitations', content: 'Data quality issues, gaps, caveats to consider' }
          ]
        },
        {
          title: 'Findings',
          content: 'Detailed results of the analysis',
          children: [
            { title: 'Trend Analysis', content: 'How metrics have changed over time' },
            { title: 'Segment Comparison', content: 'Differences between groups (regions, demographics, etc.)' },
            { title: 'Correlations', content: 'Relationships between variables' },
            { title: 'Anomalies', content: 'Unexpected patterns or outliers discovered' }
          ]
        },
        {
          title: 'Visualizations',
          content: 'Charts and graphs supporting the findings',
          children: [
            { title: 'Chart Descriptions', content: 'What each visualization shows and why it matters' },
            { title: 'Data Tables', content: 'Supporting numerical data' }
          ]
        },
        {
          title: 'Conclusions',
          content: 'Synthesis and next steps',
          children: [
            { title: 'Summary', content: 'What the data tells us overall' },
            { title: 'Action Items', content: 'Specific recommendations with owners and timelines' },
            { title: 'Future Analysis', content: 'Questions raised that warrant further investigation' }
          ]
        }
      ]
    )
  },

  'Job Application Optimizer': {
    icon: '🎯',
    category: 'Career',
    description: 'Cover letter + resume tailoring for specific roles',
    create: () => createTemplateTree(
      'Job Application Optimizer',
      'Tailor your application materials for a specific role',
      [
        {
          title: 'Target Role Analysis',
          content: 'Understand what the employer is looking for',
          children: [
            { title: 'Job Title & Company', content: '[Role] at [Company]' },
            { title: 'Key Requirements', content: 'Must-have skills and experience from job posting' },
            { title: 'Nice-to-Haves', content: 'Preferred qualifications that differentiate candidates' },
            { title: 'Company Context', content: 'Industry, size, culture, recent news, tech stack' }
          ]
        },
        {
          title: 'My Relevant Experience',
          content: 'Map your background to their needs',
          children: [
            { title: 'Direct Matches', content: 'Skills/experience that exactly match requirements' },
            { title: 'Transferable Skills', content: 'Related experience that demonstrates capability' },
            { title: 'Quantified Achievements', content: 'Metrics and outcomes (%, $, time saved)' },
            { title: 'Gap Mitigation', content: 'How to address missing requirements' }
          ]
        },
        {
          title: 'Cover Letter Framework',
          content: 'Structure for compelling narrative',
          children: [
            { title: 'Hook', content: 'Opening that grabs attention - why this role, why now' },
            { title: 'Value Proposition', content: '2-3 key reasons you\'re the right fit' },
            { title: 'Proof Points', content: 'Specific examples demonstrating each claim' },
            { title: 'Close', content: 'Call to action and enthusiasm for next steps' }
          ]
        },
        {
          title: 'Resume Customization',
          content: 'Adjustments for this specific application',
          children: [
            { title: 'Summary Rewrite', content: 'Tailored professional summary for this role' },
            { title: 'Keyword Optimization', content: 'Terms from job posting to incorporate' },
            { title: 'Experience Prioritization', content: 'Which roles/projects to emphasize' },
            { title: 'Skills Reorder', content: 'Most relevant skills first' }
          ]
        }
      ]
    )
  },

  'Technical Portfolio Piece': {
    icon: '🏆',
    category: 'Career',
    description: 'Present a project to employers or clients',
    create: () => createTemplateTree(
      'Technical Portfolio Piece',
      'Structure for presenting a technical project',
      [
        {
          title: 'Project Overview',
          content: 'The elevator pitch',
          children: [
            { title: 'One-Liner', content: 'What it does in one sentence' },
            { title: 'Problem Solved', content: 'The pain point this addresses' },
            { title: 'Live Demo', content: 'URL or video link' },
            { title: 'Source Code', content: 'GitHub repo link' }
          ]
        },
        {
          title: 'Technical Decisions',
          content: 'Show your engineering thinking',
          children: [
            { title: 'Tech Stack', content: 'Languages, frameworks, services used and WHY' },
            { title: 'Architecture', content: 'High-level system design' },
            { title: 'Interesting Challenges', content: 'Problems you solved and how' },
            { title: 'Trade-offs Made', content: 'Decisions and their reasoning' }
          ]
        },
        {
          title: 'Results & Impact',
          content: 'Quantify the outcome',
          children: [
            { title: 'Metrics', content: 'Performance, usage, or business metrics' },
            { title: 'User Feedback', content: 'Quotes or testimonials if available' },
            { title: 'What I Learned', content: 'Skills gained, mistakes made' }
          ]
        },
        {
          title: 'Future Roadmap',
          content: 'Where this could go',
          children: [
            { title: 'Planned Features', content: 'What\'s next on the backlog' },
            { title: 'Scaling Considerations', content: 'How it would handle growth' }
          ]
        }
      ]
    )
  },

  'Interview Prep Guide': {
    icon: '🎤',
    category: 'Career',
    description: 'Prepare for interviews at specific companies',
    create: () => createTemplateTree(
      'Interview Prep Guide',
      'Comprehensive preparation for a specific interview',
      [
        {
          title: 'Company Research',
          content: 'Know who you\'re talking to',
          children: [
            { title: 'Mission & Values', content: 'What the company stands for' },
            { title: 'Recent News', content: 'Funding, launches, acquisitions, challenges' },
            { title: 'Tech Stack', content: 'Technologies they use' },
            { title: 'Interview Process', content: 'What to expect (Glassdoor, Blind)' }
          ]
        },
        {
          title: 'Role Alignment',
          content: 'Connect your experience to their needs',
          children: [
            { title: 'Why This Role', content: 'Your genuine interest and fit' },
            { title: 'Why This Company', content: 'Specific reasons beyond generic praise' },
            { title: 'Value I Bring', content: 'Unique contribution you can make' }
          ]
        },
        {
          title: 'STAR Stories',
          content: 'Prepared behavioral examples',
          children: [
            { title: 'Leadership', content: 'Situation, Task, Action, Result' },
            { title: 'Conflict Resolution', content: 'Situation, Task, Action, Result' },
            { title: 'Technical Challenge', content: 'Situation, Task, Action, Result' },
            { title: 'Failure & Learning', content: 'Situation, Task, Action, Result' }
          ]
        },
        {
          title: 'Questions to Ask',
          content: 'Show engagement and evaluate fit',
          children: [
            { title: 'Role Questions', content: 'Day-to-day, success metrics, challenges' },
            { title: 'Team Questions', content: 'Structure, collaboration, culture' },
            { title: 'Growth Questions', content: 'Learning opportunities, career path' }
          ]
        }
      ]
    )
  },

  'Consulting Proposal': {
    icon: '📝',
    category: 'Business',
    description: 'Scope, deliverables, and pricing for client work',
    create: () => createTemplateTree(
      'Consulting Proposal',
      'Structure for client engagement proposals',
      [
        {
          title: 'Executive Summary',
          content: 'One-page overview for decision makers',
          children: [
            { title: 'Client Challenge', content: 'The problem in their words' },
            { title: 'Proposed Solution', content: 'How we\'ll solve it' },
            { title: 'Investment', content: 'Total cost and timeline' },
            { title: 'Expected Outcome', content: 'What success looks like' }
          ]
        },
        {
          title: 'Scope of Work',
          content: 'Detailed deliverables',
          children: [
            { title: 'In Scope', content: 'Exactly what\'s included' },
            { title: 'Out of Scope', content: 'What\'s explicitly NOT included' },
            { title: 'Deliverables', content: 'Tangible outputs with descriptions' },
            { title: 'Milestones', content: 'Key checkpoints and dates' }
          ]
        },
        {
          title: 'Approach & Timeline',
          content: 'How the work will be done',
          children: [
            { title: 'Phase 1: Discovery', content: 'Research, interviews, analysis' },
            { title: 'Phase 2: Development', content: 'Building the solution' },
            { title: 'Phase 3: Delivery', content: 'Handoff, training, documentation' }
          ]
        },
        {
          title: 'Investment',
          content: 'Pricing structure',
          children: [
            { title: 'Pricing Model', content: 'Fixed, hourly, retainer, or hybrid' },
            { title: 'Cost Breakdown', content: 'Line items by phase or deliverable' },
            { title: 'Payment Terms', content: 'Schedule, invoicing, accepted methods' }
          ]
        },
        {
          title: 'Terms & Conditions',
          content: 'Protect both parties',
          children: [
            { title: 'Assumptions', content: 'Dependencies on client' },
            { title: 'Change Process', content: 'How scope changes are handled' },
            { title: 'IP Ownership', content: 'Who owns the deliverables' }
          ]
        }
      ]
    )
  },

  'Meeting Prep': {
    icon: '📅',
    category: 'Business',
    description: 'Agenda, notes, and action items structure',
    create: () => createTemplateTree(
      'Meeting Prep',
      'Run effective meetings with clear outcomes',
      [
        {
          title: 'Meeting Info',
          content: 'Basic details',
          children: [
            { title: 'Purpose', content: 'Why are we meeting? Decision, brainstorm, update?' },
            { title: 'Attendees', content: 'Who needs to be there and why' },
            { title: 'Duration', content: 'Timebox for the meeting' }
          ]
        },
        {
          title: 'Agenda',
          content: 'What we\'ll cover',
          children: [
            { title: 'Topic 1', content: '[5 min] Description - Owner' },
            { title: 'Topic 2', content: '[10 min] Description - Owner' },
            { title: 'Topic 3', content: '[10 min] Description - Owner' },
            { title: 'Open Discussion', content: '[5 min] Questions and parking lot items' }
          ]
        },
        {
          title: 'Pre-Read Materials',
          content: 'What attendees should review beforehand',
          children: [
            { title: 'Documents', content: 'Links to relevant docs' },
            { title: 'Context', content: 'Background needed for discussion' }
          ]
        },
        {
          title: 'Meeting Notes',
          content: 'Capture during the meeting',
          children: [
            { title: 'Key Decisions', content: 'What was decided' },
            { title: 'Discussion Points', content: 'Important context shared' },
            { title: 'Parking Lot', content: 'Items for later' }
          ]
        },
        {
          title: 'Action Items',
          content: 'What happens next',
          children: [
            { title: 'Action 1', content: '[Owner] Task - Due date' },
            { title: 'Action 2', content: '[Owner] Task - Due date' },
            { title: 'Follow-up Meeting', content: 'Next meeting if needed' }
          ]
        }
      ]
    )
  },

  'Code Review Request': {
    icon: '🔬',
    category: 'Engineering',
    description: 'Context for getting AI help debugging',
    create: () => createTemplateTree(
      'Code Review Request',
      'Get better help by providing complete context',
      [
        {
          title: 'Problem Statement',
          content: 'What\'s happening',
          children: [
            { title: 'Expected Behavior', content: 'What should happen' },
            { title: 'Actual Behavior', content: 'What\'s actually happening' },
            { title: 'Error Messages', content: 'Exact error text, stack traces' }
          ]
        },
        {
          title: 'Context',
          content: 'Environment and setup',
          children: [
            { title: 'Tech Stack', content: 'Language, framework, versions' },
            { title: 'Relevant Files', content: 'Which files are involved' },
            { title: 'Recent Changes', content: 'What changed before this broke' }
          ]
        },
        {
          title: 'Code',
          content: 'The relevant code',
          children: [
            { title: 'Problematic Code', content: 'The code that\'s not working' },
            { title: 'Related Code', content: 'Other relevant functions/components' },
            { title: 'Config Files', content: 'Relevant configuration' }
          ]
        },
        {
          title: 'What I\'ve Tried',
          content: 'Debugging attempts so far',
          children: [
            { title: 'Attempted Solutions', content: 'What you\'ve already tried' },
            { title: 'Research Done', content: 'Stack Overflow, docs consulted' },
            { title: 'Hypotheses', content: 'What you think might be wrong' }
          ]
        }
      ]
    )
  },

  'System Prompt Builder': {
    icon: '🧠',
    category: 'AI',
    description: 'Meta-template for building AI personas',
    create: () => createTemplateTree(
      'System Prompt Builder',
      'Framework for creating effective AI system prompts',
      [
        {
          title: 'Identity',
          content: 'Who is this AI?',
          children: [
            { title: 'Role', content: 'You are a [specific expert/assistant type]' },
            { title: 'Expertise', content: 'Deep knowledge in [domains]' },
            { title: 'Personality', content: 'Communication style, tone, demeanor' }
          ]
        },
        {
          title: 'Core Instructions',
          content: 'How should it behave?',
          children: [
            { title: 'Primary Directive', content: 'The main goal of every interaction' },
            { title: 'Response Format', content: 'How to structure outputs' },
            { title: 'Thinking Process', content: 'How to approach problems' }
          ]
        },
        {
          title: 'Domain Knowledge',
          content: 'What does it know?',
          children: [
            { title: 'Key Facts', content: 'Essential information to have' },
            { title: 'Terminology', content: 'Domain-specific vocabulary' },
            { title: 'Best Practices', content: 'Standards and conventions' }
          ]
        },
        {
          title: 'Constraints',
          content: 'What should it NOT do?',
          children: [
            { title: 'Boundaries', content: 'Topics to avoid or redirect' },
            { title: 'Limitations', content: 'What it should admit it can\'t do' },
            { title: 'Safety Rails', content: 'Guardrails for sensitive topics' }
          ]
        },
        {
          title: 'Examples',
          content: 'Show desired behavior',
          children: [
            { title: 'Good Response Example', content: 'User: "..." Assistant: "..."' },
            { title: 'Edge Case Handling', content: 'How to handle tricky situations' }
          ]
        }
      ]
    )
  },

  'Music Production Brief': {
    icon: '🎸',
    category: 'Creative',
    description: 'Song structure, harmonic architecture, production notes',
    create: () => createTemplateTree(
      'Music Production Brief',
      'Document song ideas and production direction',
      [
        {
          title: 'Song Overview',
          content: 'The big picture',
          children: [
            { title: 'Working Title', content: 'Song name' },
            { title: 'Concept/Theme', content: 'What is this song about emotionally/lyrically' },
            { title: 'Reference Tracks', content: 'Songs that inspire the vibe' },
            { title: 'Target Duration', content: 'Approximate length' }
          ]
        },
        {
          title: 'Musical Foundation',
          content: 'Harmonic and rhythmic framework',
          children: [
            { title: 'Key & Scale', content: 'E minor, A Phrygian, etc.' },
            { title: 'Tempo & Time Signature', content: 'BPM, 4/4, 6/8, etc.' },
            { title: 'Chord Progression', content: 'Main progressions for each section' },
            { title: 'Tuning', content: 'Standard, Drop D, etc.' }
          ]
        },
        {
          title: 'Song Structure',
          content: 'Arrangement map',
          children: [
            { title: 'Intro', content: 'Duration, feel, instrumentation' },
            { title: 'Verse', content: 'Duration, feel, instrumentation' },
            { title: 'Chorus', content: 'Duration, feel, instrumentation' },
            { title: 'Bridge/Breakdown', content: 'Duration, feel, instrumentation' },
            { title: 'Outro', content: 'Duration, feel, instrumentation' }
          ]
        },
        {
          title: 'Production Notes',
          content: 'Sound design direction',
          children: [
            { title: 'Guitar Tones', content: 'Clean, crunch, high gain, effects' },
            { title: 'Drum Sound', content: 'Acoustic, electronic, hybrid, samples' },
            { title: 'Bass Approach', content: 'Pick, fingers, synth, tone' },
            { title: 'Additional Elements', content: 'Synths, samples, orchestration' }
          ]
        },
        {
          title: 'Technical Notes',
          content: 'Recording considerations',
          children: [
            { title: 'Guitar Parts', content: 'Riffs, leads, layers needed' },
            { title: 'Difficult Sections', content: 'Parts that need practice' },
            { title: 'Mix Notes', content: 'Balance, panning, effects ideas' }
          ]
        }
      ]
    )
  },

  'LinkedIn Post Builder': {
    icon: '💼',
    category: 'Marketing',
    description: 'Thought leadership post structure',
    create: () => createTemplateTree(
      'LinkedIn Post Builder',
      'Create engaging professional content',
      [
        {
          title: 'Hook',
          content: 'First 2 lines - must stop the scroll',
          children: [
            { title: 'Opening Line', content: 'Contrarian take, surprising stat, or bold claim' },
            { title: 'Promise', content: 'What the reader will get from this post' }
          ]
        },
        {
          title: 'Body',
          content: 'The meat of the post',
          children: [
            { title: 'Context/Story', content: 'Set up the situation or share experience' },
            { title: 'Key Insight', content: 'The main lesson or takeaway' },
            { title: 'Supporting Points', content: '3-5 bullets that reinforce the insight' },
            { title: 'Proof', content: 'Data, example, or credibility builder' }
          ]
        },
        {
          title: 'Call to Action',
          content: 'Drive engagement',
          children: [
            { title: 'Question', content: 'Ask something that prompts comments' },
            { title: 'Next Step', content: 'What should reader do? (follow, DM, link)' }
          ]
        },
        {
          title: 'Formatting Notes',
          content: 'Make it scannable',
          children: [
            { title: 'Line Breaks', content: 'Short paragraphs, 1-2 sentences each' },
            { title: 'Emojis', content: 'Use sparingly as bullet points or emphasis' },
            { title: 'Hashtags', content: '3-5 relevant hashtags at the end' }
          ]
        }
      ]
    )
  },

  'Ollama Modelfile Builder': {
    icon: '🦙',
    category: 'AI',
    description: 'Create custom Ollama model personas',
    create: () => createTemplateTree(
      'Ollama Modelfile Builder',
      'Structure for creating custom Ollama modelfiles',
      [
        {
          title: 'Model Foundation',
          content: 'Base model and parameters',
          children: [
            { title: 'FROM', content: 'Base model: llama3.2:3b, qwen2.5-coder:7b, mistral:7b' },
            { title: 'PARAMETER temperature', content: '0.7 (creative) or 0.3 (precise)' },
            { title: 'PARAMETER top_p', content: '0.9' },
            { title: 'PARAMETER num_ctx', content: '4096 or 8192 for longer context' }
          ]
        },
        {
          title: 'SYSTEM Prompt',
          content: 'The core identity and instructions',
          children: [
            { title: 'Identity', content: 'You are [specific expert]. You specialize in [domain].' },
            { title: 'Expertise Areas', content: 'List 3-5 specific knowledge domains' },
            { title: 'Communication Style', content: 'Tone, format preferences, verbosity level' },
            { title: 'Key Behaviors', content: 'Always do X, never do Y, prefer Z approach' }
          ]
        },
        {
          title: 'Domain Knowledge',
          content: 'Bake in specific facts',
          children: [
            { title: 'Core Facts', content: 'Essential information the model should "know"' },
            { title: 'Terminology', content: 'Domain-specific vocabulary to use correctly' },
            { title: 'Common Patterns', content: 'Typical problems and solutions in this domain' }
          ]
        },
        {
          title: 'Output Format',
          content: 'How responses should be structured',
          children: [
            { title: 'Default Format', content: 'Bullets, paragraphs, code blocks, JSON' },
            { title: 'Length Guidance', content: 'Concise vs. detailed, when to elaborate' }
          ]
        },
        {
          title: 'Example Usage',
          content: 'Test prompts for validation',
          children: [
            { title: 'Test Prompt 1', content: 'Simple query to verify basic functionality' },
            { title: 'Test Prompt 2', content: 'Complex query to test expertise depth' },
            { title: 'Edge Case', content: 'Query that should trigger specific behavior' }
          ]
        }
      ]
    )
  },

  'Multi-Agent Orchestration': {
    icon: '🎭',
    category: 'AI',
    description: 'Design multi-model pipelines like Mirador',
    create: () => createTemplateTree(
      'Multi-Agent Orchestration',
      'Architecture for coordinating multiple AI models',
      [
        {
          title: 'Pipeline Overview',
          content: 'What this orchestration accomplishes',
          children: [
            { title: 'Goal', content: 'End-to-end outcome this pipeline produces' },
            { title: 'Input', content: 'What triggers the pipeline, expected format' },
            { title: 'Output', content: 'Final deliverable format and destination' }
          ]
        },
        {
          title: 'Agent Roster',
          content: 'Models in the pipeline',
          children: [
            { title: 'Agent 1: Router', content: 'Model, role: classify input and route to specialists' },
            { title: 'Agent 2: Specialist A', content: 'Model, role: handle [specific task type]' },
            { title: 'Agent 3: Specialist B', content: 'Model, role: handle [other task type]' },
            { title: 'Agent 4: Synthesizer', content: 'Model, role: combine outputs, ensure coherence' },
            { title: 'Agent 5: Validator', content: 'Model, role: check quality, request revisions' }
          ]
        },
        {
          title: 'Flow Logic',
          content: 'How data moves between agents',
          children: [
            { title: 'Routing Rules', content: 'If [condition] → Agent X, else → Agent Y' },
            { title: 'Handoff Format', content: 'JSON schema for inter-agent communication' },
            { title: 'Feedback Loops', content: 'When/how to send back for revision' },
            { title: 'Termination Conditions', content: 'When pipeline is "done"' }
          ]
        },
        {
          title: 'Error Handling',
          content: 'What happens when things go wrong',
          children: [
            { title: 'Timeout Handling', content: 'Max wait time, fallback behavior' },
            { title: 'Quality Failures', content: 'If validator rejects, then...' },
            { title: 'Model Unavailable', content: 'Fallback models or graceful degradation' }
          ]
        },
        {
          title: 'Observability',
          content: 'Monitoring and debugging',
          children: [
            { title: 'Logging Points', content: 'What to log at each stage' },
            { title: 'Metrics', content: 'Latency, success rate, token usage per agent' },
            { title: 'Debug Mode', content: 'How to trace a request through the pipeline' }
          ]
        }
      ]
    )
  },

  'Phishing Analysis Report': {
    icon: '🎣',
    category: 'Security',
    description: 'Document phishing campaigns for PhishGuard',
    create: () => createTemplateTree(
      'Phishing Analysis Report',
      'Structured analysis of phishing attempts',
      [
        {
          title: 'Sample Overview',
          content: 'Basic information about the phishing attempt',
          children: [
            { title: 'Date Received', content: 'When the sample was captured' },
            { title: 'Delivery Method', content: 'Email, SMS, social media, etc.' },
            { title: 'Impersonated Brand', content: 'Who they\'re pretending to be' },
            { title: 'Target Audience', content: 'Who this campaign targets' }
          ]
        },
        {
          title: 'Technical Indicators',
          content: 'IOCs for detection',
          children: [
            { title: 'Sender Info', content: 'Email address, display name, headers' },
            { title: 'URLs', content: 'All links in the message, where they actually go' },
            { title: 'Domains', content: 'Registered domains, WHOIS info, hosting' },
            { title: 'Attachments', content: 'File names, hashes, types' }
          ]
        },
        {
          title: 'Deception Techniques',
          content: 'How they trick victims',
          children: [
            { title: 'Urgency Tactics', content: 'Time pressure, threats, fear' },
            { title: 'Authority Claims', content: 'Logos, titles, official language' },
            { title: 'Credential Harvesting', content: 'What info they\'re trying to steal' },
            { title: 'Evasion Methods', content: 'How they bypass filters' }
          ]
        },
        {
          title: 'Risk Assessment',
          content: 'Severity and impact',
          children: [
            { title: 'Sophistication Level', content: 'Low/Medium/High - why?' },
            { title: 'Potential Impact', content: 'What happens if someone falls for it' },
            { title: 'Detection Difficulty', content: 'How hard to spot for average user' }
          ]
        },
        {
          title: 'Recommendations',
          content: 'What to do about it',
          children: [
            { title: 'Immediate Actions', content: 'Block, report, alert users' },
            { title: 'Detection Rules', content: 'Signatures, filters, YARA rules' },
            { title: 'User Education', content: 'What to tell employees about this type' }
          ]
        }
      ]
    )
  },

  'Security Audit Scope': {
    icon: '🔐',
    category: 'Security',
    description: 'Define security review boundaries',
    create: () => createTemplateTree(
      'Security Audit Scope',
      'Scope document for security assessments',
      [
        {
          title: 'Audit Overview',
          content: 'What we\'re reviewing',
          children: [
            { title: 'Target System', content: 'Application, repo, infrastructure being audited' },
            { title: 'Audit Type', content: 'Code review, pentest, config review, full audit' },
            { title: 'Timeline', content: 'Start date, end date, report due' }
          ]
        },
        {
          title: 'In Scope',
          content: 'What will be tested',
          children: [
            { title: 'Components', content: 'Specific services, repos, endpoints' },
            { title: 'Attack Surfaces', content: 'Web app, API, auth, file upload, etc.' },
            { title: 'Test Types', content: 'OWASP Top 10, auth bypass, injection, etc.' }
          ]
        },
        {
          title: 'Out of Scope',
          content: 'What will NOT be tested',
          children: [
            { title: 'Excluded Systems', content: 'Third-party services, prod data, etc.' },
            { title: 'Excluded Tests', content: 'DoS, social engineering, physical' },
            { title: 'Reason for Exclusions', content: 'Why these are out of scope' }
          ]
        },
        {
          title: 'Credentials & Access',
          content: 'What access is provided',
          children: [
            { title: 'Test Accounts', content: 'Credentials for different user roles' },
            { title: 'Environment', content: 'Staging URL, VPN access, etc.' },
            { title: 'Source Code', content: 'Repo access, branch to review' }
          ]
        },
        {
          title: 'Deliverables',
          content: 'What the audit produces',
          children: [
            { title: 'Report Format', content: 'PDF, markdown, JIRA tickets' },
            { title: 'Severity Ratings', content: 'Critical/High/Medium/Low/Info' },
            { title: 'Remediation Guidance', content: 'Fix recommendations per finding' }
          ]
        }
      ]
    )
  },

  'Guitar Lesson Plan': {
    icon: '🎸',
    category: 'Creative',
    description: 'Structure guitar lessons and practice sessions',
    create: () => createTemplateTree(
      'Guitar Lesson Plan',
      'Structured approach to teaching or learning guitar',
      [
        {
          title: 'Lesson Overview',
          content: 'What this lesson covers',
          children: [
            { title: 'Topic', content: 'Scale, technique, song, or concept' },
            { title: 'Skill Level', content: 'Beginner, intermediate, advanced' },
            { title: 'Duration', content: 'Expected time to complete' },
            { title: 'Prerequisites', content: 'What student should already know' }
          ]
        },
        {
          title: 'Theory Component',
          content: 'The "why" behind the technique',
          children: [
            { title: 'Musical Concept', content: 'Scale theory, chord construction, etc.' },
            { title: 'Fretboard Visualization', content: 'Patterns, shapes, positions' },
            { title: 'Ear Training', content: 'How to hear and recognize this' }
          ]
        },
        {
          title: 'Technical Exercises',
          content: 'The "how" - physical technique',
          children: [
            { title: 'Warm-up', content: 'Finger exercises, stretches' },
            { title: 'Exercise 1', content: 'Slow, isolated technique work' },
            { title: 'Exercise 2', content: 'Building speed/fluency' },
            { title: 'Common Mistakes', content: 'What to watch for and correct' }
          ]
        },
        {
          title: 'Application',
          content: 'Using it in real music',
          children: [
            { title: 'Lick/Riff', content: 'Musical phrase using the concept' },
            { title: 'Song Example', content: 'Real song that uses this' },
            { title: 'Improvisation Prompt', content: 'Backing track + constraints' }
          ]
        },
        {
          title: 'Practice Plan',
          content: 'How to practice this week',
          children: [
            { title: 'Daily Routine', content: '15-30 min breakdown' },
            { title: 'Tempo Goals', content: 'BPM targets for exercises' },
            { title: 'Mastery Checklist', content: 'How to know when you\'ve got it' }
          ]
        }
      ]
    )
  },

  'Album Concept Document': {
    icon: '💿',
    category: 'Creative',
    description: 'Plan a cohesive album or EP',
    create: () => createTemplateTree(
      'Album Concept Document',
      'Creative direction for a music release',
      [
        {
          title: 'Album Identity',
          content: 'The big picture vision',
          children: [
            { title: 'Working Title', content: 'Album name' },
            { title: 'Core Concept', content: 'Thematic thread connecting all songs' },
            { title: 'Emotional Arc', content: 'Journey from track 1 to final track' },
            { title: 'Reference Albums', content: 'Albums that inspire the direction' }
          ]
        },
        {
          title: 'Sonic Palette',
          content: 'The sound of the album',
          children: [
            { title: 'Guitar Tones', content: 'Clean, crunch, lead sounds to use' },
            { title: 'Production Style', content: 'Raw, polished, ambient, aggressive' },
            { title: 'Key Instruments', content: 'What\'s featured beyond guitar' },
            { title: 'Reference Tones', content: 'Specific songs/albums for sound' }
          ]
        },
        {
          title: 'Track List',
          content: 'Song-by-song overview',
          children: [
            { title: 'Track 1: Opener', content: 'Title, key, tempo, role in album' },
            { title: 'Track 2', content: 'Title, key, tempo, role in album' },
            { title: 'Track 3', content: 'Title, key, tempo, role in album' },
            { title: 'Track 4', content: 'Title, key, tempo, role in album' },
            { title: 'Track 5: Closer', content: 'Title, key, tempo, role in album' }
          ]
        },
        {
          title: 'Visual Identity',
          content: 'Album artwork and branding',
          children: [
            { title: 'Cover Concept', content: 'Visual direction for album art' },
            { title: 'Color Palette', content: 'Colors that represent the album' },
            { title: 'Typography', content: 'Font style for title/text' }
          ]
        },
        {
          title: 'Release Strategy',
          content: 'How to put it out',
          children: [
            { title: 'Format', content: 'Digital, vinyl, CD, Bandcamp' },
            { title: 'Singles', content: 'Which tracks to release first' },
            { title: 'Timeline', content: 'Recording, mixing, mastering, release dates' }
          ]
        }
      ]
    )
  },

  'Weekly Handoff Notes': {
    icon: '📋',
    category: 'Coparenting',
    description: 'Transition notes between co-parents',
    create: () => createTemplateTree(
      'Weekly Handoff Notes',
      'Smooth transitions between households',
      [
        {
          title: 'This Week Summary',
          content: 'What happened during your time',
          children: [
            { title: 'Highlights', content: 'Good moments, achievements, fun activities' },
            { title: 'Challenges', content: 'Any difficulties or issues that came up' },
            { title: 'Mood/Behavior', content: 'General emotional state during the week' }
          ]
        },
        {
          title: 'Health & Wellness',
          content: 'Physical health updates',
          children: [
            { title: 'Sleep', content: 'Bedtime, wake time, any issues' },
            { title: 'Eating', content: 'Appetite, new foods tried, any concerns' },
            { title: 'Medications', content: 'What was given, when, any reactions' },
            { title: 'Health Notes', content: 'Illness, injuries, doctor visits' }
          ]
        },
        {
          title: 'School/Activities',
          content: 'Educational and extracurricular updates',
          children: [
            { title: 'Homework', content: 'Completed, in progress, due dates' },
            { title: 'School Events', content: 'Upcoming events, forms needed' },
            { title: 'Activities', content: 'Practice schedules, equipment needed' }
          ]
        },
        {
          title: 'Upcoming',
          content: 'What\'s coming next week',
          children: [
            { title: 'Appointments', content: 'Doctor, dentist, therapy, etc.' },
            { title: 'Events', content: 'Parties, playdates, school events' },
            { title: 'Reminders', content: 'Things to remember or prepare for' }
          ]
        },
        {
          title: 'Items Sent',
          content: 'What\'s in the bag',
          children: [
            { title: 'Clothes', content: 'What\'s packed, what needs washing' },
            { title: 'School Items', content: 'Backpack contents, projects' },
            { title: 'Comfort Items', content: 'Stuffed animals, blankets, etc.' }
          ]
        }
      ]
    )
  },

  'Co-Parent Communication': {
    icon: '🤝',
    category: 'Coparenting',
    description: 'Structure difficult co-parent conversations',
    create: () => createTemplateTree(
      'Co-Parent Communication',
      'Framework for productive co-parent discussions',
      [
        {
          title: 'Topic',
          content: 'What needs to be discussed',
          children: [
            { title: 'Issue Summary', content: 'Clear, factual description of the topic' },
            { title: 'Why Now', content: 'Why this needs to be addressed' },
            { title: 'Desired Outcome', content: 'What resolution would look like' }
          ]
        },
        {
          title: 'My Perspective',
          content: 'Your view using I-statements',
          children: [
            { title: 'Observations', content: 'What I\'ve noticed (facts, not judgments)' },
            { title: 'Feelings', content: 'How this affects me/child (I feel...)' },
            { title: 'Needs', content: 'What I/child need in this situation' }
          ]
        },
        {
          title: 'Proposed Solutions',
          content: 'Options to consider',
          children: [
            { title: 'Option A', content: 'First possibility and its trade-offs' },
            { title: 'Option B', content: 'Alternative approach' },
            { title: 'Compromise', content: 'Middle ground if needed' }
          ]
        },
        {
          title: 'Child Focus',
          content: 'Keep the focus on what matters',
          children: [
            { title: 'Child\'s Best Interest', content: 'How each option affects the child' },
            { title: 'Child\'s Voice', content: 'What has the child expressed about this' },
            { title: 'Consistency', content: 'How to maintain stability between homes' }
          ]
        },
        {
          title: 'Next Steps',
          content: 'Moving forward',
          children: [
            { title: 'Decision', content: 'What we agreed to' },
            { title: 'Timeline', content: 'When this starts/happens' },
            { title: 'Follow-up', content: 'When to check in on how it\'s going' }
          ]
        }
      ]
    )
  },

  'Vercel Deploy Checklist': {
    icon: '▲',
    category: 'Deployment',
    description: 'Pre-flight checks for Vercel deployments',
    create: () => createTemplateTree(
      'Vercel Deploy Checklist',
      'Ensure successful Vercel deployments',
      [
        {
          title: 'Pre-Deploy Checks',
          content: 'Before running vercel --prod',
          children: [
            { title: 'Build Locally', content: 'npm run build succeeds without errors' },
            { title: 'Preview Locally', content: 'npm run preview looks correct' },
            { title: 'Environment Variables', content: 'All VITE_ vars set for build, not just dashboard' },
            { title: 'Git Status', content: 'All changes committed, nothing unexpected' }
          ]
        },
        {
          title: 'Configuration',
          content: 'Verify project setup',
          children: [
            { title: 'vercel.json', content: 'SPA rewrites in place for React Router' },
            { title: 'Framework Preset', content: 'Vite detected automatically' },
            { title: 'Build Command', content: 'Uses correct command (npm run build)' },
            { title: 'Output Directory', content: 'Points to dist/ for Vite' }
          ]
        },
        {
          title: 'Assets',
          content: 'Static files and images',
          children: [
            { title: 'OG Image', content: 'public/og-image.png exists, 1200x630' },
            { title: 'Favicon', content: 'public/favicon.ico exists' },
            { title: 'Meta Tags', content: 'Absolute URLs in index.html for social' },
            { title: 'public/ Added', content: 'git add public/ - assets committed' }
          ]
        },
        {
          title: 'Post-Deploy Verification',
          content: 'After deployment completes',
          children: [
            { title: 'HTTP 200', content: 'curl -s -o /dev/null -w "%{http_code}" URL' },
            { title: 'Playwright Screenshot', content: 'Visual verification of SPA rendering' },
            { title: 'Auth Settings', content: 'Deployment Protection disabled if public' },
            { title: 'Domain Config', content: 'Custom domain pointing correctly' }
          ]
        },
        {
          title: 'Rollback Plan',
          content: 'If something goes wrong',
          children: [
            { title: 'Previous Deploy', content: 'vercel rollback or redeploy from dashboard' },
            { title: 'Git Revert', content: 'Commit to revert if code issue' }
          ]
        }
      ]
    )
  },

  'API Endpoint Documentation': {
    icon: '🔌',
    category: 'Deployment',
    description: 'Document Render/Railway API endpoints',
    create: () => createTemplateTree(
      'API Endpoint Documentation',
      'Structured docs for backend APIs',
      [
        {
          title: 'API Overview',
          content: 'What this API does',
          children: [
            { title: 'Base URL', content: 'https://your-api.onrender.com' },
            { title: 'Purpose', content: 'What problem this API solves' },
            { title: 'Authentication', content: 'API key, OAuth, none' },
            { title: 'Rate Limits', content: 'Requests per minute/hour' }
          ]
        },
        {
          title: 'Endpoints',
          content: 'Available routes',
          children: [
            { title: 'GET /health', content: 'Health check - returns {"status": "ok"}' },
            { title: 'GET /endpoint1', content: 'Description, params, response shape' },
            { title: 'POST /endpoint2', content: 'Description, request body, response' },
            { title: 'PUT /endpoint3', content: 'Description, params, response' }
          ]
        },
        {
          title: 'Request/Response Examples',
          content: 'Copy-paste examples',
          children: [
            { title: 'Curl Example', content: 'curl -X GET "https://api/endpoint"' },
            { title: 'Success Response', content: 'JSON shape for 200 response' },
            { title: 'Error Response', content: 'JSON shape for 4xx/5xx errors' }
          ]
        },
        {
          title: 'Deployment Notes',
          content: 'Platform-specific details',
          children: [
            { title: 'Platform', content: 'Render, Railway, or other' },
            { title: 'Start Command', content: 'uvicorn main:app --host 0.0.0.0 --port $PORT' },
            { title: 'Cold Start', content: 'Free tier spins down after 15min, ~30s restart' },
            { title: 'Environment Variables', content: 'Required env vars and their purpose' }
          ]
        },
        {
          title: 'Integration Guide',
          content: 'How to use from frontend',
          children: [
            { title: 'CORS', content: 'Allowed origins, headers' },
            { title: 'Frontend Example', content: 'fetch() code for calling the API' },
            { title: 'Error Handling', content: 'How frontend should handle failures' }
          ]
        }
      ]
    )
  }
}

export function getTemplate(name) {
  const template = TEMPLATES[name]
  if (!template) return null
  return template.create()
}

export function getTemplateInfo(name) {
  const template = TEMPLATES[name]
  if (!template) return null
  return {
    name,
    icon: template.icon,
    category: template.category,
    description: template.description
  }
}

export function getAllTemplateNames() {
  return Object.keys(TEMPLATES)
}
