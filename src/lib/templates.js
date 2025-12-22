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
  Security: ['Cybersecurity Incident Response'],
  Business: ['Marketing Campaign'],
  Engineering: ['DevOps CI/CD Pipeline', 'Code Review Checklist'],
  Product: ['Product Requirements'],
  AI: ['AI Agent Prompt']
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
