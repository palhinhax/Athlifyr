# GitHub Copilot Agents

This directory contains specialized agent instructions for GitHub Copilot to perform specific tasks within the Athlifyr project.

## What are Agents?

Agents are specialized AI assistants with domain-specific knowledge and expertise. Each agent is designed to handle a particular type of task with high quality and consistency.

## Available Agents

### 1. Event Seed Generator Agent
**File:** `event-seed-generator.md`

**Purpose:** Generate complete Prisma seed files for sports events with full multilingual support.

**When to use:**
- Creating new event seed files
- Need to populate database with event data
- Require translations in all 6 supported languages

**Capabilities:**
- Generates TypeScript seed files following project patterns
- Provides translations in all 6 languages (pt, en, es, fr, de, it)
- Ensures European Portuguese is used (never Brazilian)
- Supports event variants (multiple race distances/categories)
- Includes pricing phases
- Handles SEO meta tags
- Validates data structure and types

**Example usage:**
```
@event-seed-generator Create a seed file for the Lisbon Marathon 2026 
happening on October 15, 2026. It has three distances: 42km marathon, 
21km half marathon, and 10km run. Registration opens January 1, 2026 
with early bird pricing at €60 until March 31.
```

## How to Use Agents

### In GitHub Copilot Chat

1. **Tag the agent** by referencing its name or file:
   ```
   @event-seed-generator [your request]
   ```

2. **Provide context** about what you need:
   - Event name and date
   - Location details
   - Sport type(s)
   - Race variants/distances
   - Pricing information
   - Any special requirements

3. **Review the output** - agents generate production-ready code but always review before committing

### Best Practices

- **Be specific** - provide as much detail as possible
- **Ask questions** - if you're unsure, ask the agent what information it needs
- **Validate output** - always review generated code for accuracy
- **Iterative refinement** - you can ask the agent to modify its output
- **Follow project standards** - agents follow project conventions but verify the output

## Agent Guidelines

All agents in this directory must:

1. ✅ Follow project coding standards and conventions
2. ✅ Support all 6 languages (pt, en, es, fr, de, it)
3. ✅ Use European Portuguese (pt-PT) for Portuguese translations
4. ✅ Generate TypeScript code with proper types
5. ✅ Include comprehensive error handling
6. ✅ Provide clear documentation and examples
7. ✅ Follow Conventional Commits for any file changes
8. ✅ Maintain consistency with existing codebase patterns

## Creating New Agents

To create a new agent:

1. Create a new `.md` file in this directory
2. Name it descriptively (e.g., `translation-validator.md`)
3. Include the following sections:
   - Agent description and expertise
   - Requirements and constraints
   - Data structure specifications
   - Template/example code
   - Usage instructions
   - Error prevention guidelines
4. Update this README with agent information
5. Test the agent with realistic scenarios

## Agent Structure Template

```markdown
# [Agent Name]

You are a specialized agent expert in [domain/task].

## Your Expertise
[Description of what the agent specializes in]

## Critical Requirements
[List of mandatory requirements]

## Data Structure
[Expected input/output structures]

## Template/Example
[Code templates and examples]

## How to Use This Agent
[Step-by-step usage instructions]

## Error Prevention
[Common mistakes to avoid]

## Quality Checks
[Validation checklist]
```

## Support

If you encounter issues with an agent:

1. Check if you provided all required information
2. Review the agent's documentation and examples
3. Try being more specific in your request
4. Ask the agent what information it needs
5. Report persistent issues to the development team

## Contributing

When modifying agents:

- Maintain backward compatibility
- Update documentation
- Test with realistic scenarios
- Follow project commit conventions
- Update this README if adding new agents

---

**Note:** Agents are tools to assist development. Always review and validate their output before committing to the repository.
