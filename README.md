# Qodo Agent Reference Implementations

> **🚧 PROJECT STATUS**: This repository is under active development. Most agents listed are **planned features** and not yet implemented. Only agents marked with ✅ are currently available. We welcome contributions to help build these agents!

A curated collection of reference agent implementations for the [Qodo CLI](https://github.com/qodo-ai/qodo-gen-cli) framework, showcasing best practices and common patterns for building AI-powered development workflows.

## What are Qodo Agents?

Qodo Agents are configurable AI workflows that combine:
- **Instructions**: Natural language prompts that define the agent's behavior
- **Tools**: MCP servers and external integrations the agent can use
- **Arguments**: Configurable parameters for customization
- **Execution Strategy**: How the agent approaches tasks (plan vs act)
- **Output Schema**: Structured output format for integration
- **Exit Expressions**: Success/failure conditions for CI/CD

## 🌟 Reference Agents

These agents demonstrate core patterns and best practices for the Qodo framework.

### Development Workflow Agents
- **[Code Review](agents/code-review/)** - Comprehensive code review with Qodo Merge integration
- **[Diff Test Generation](agents/diff-test-suite/)** - Automated test suite creation and validation of code changes

## 🤝 Community Agents

Community-contributed agents demonstrating various use cases and integrations.

> **Note:** Community agents are maintained by their respective authors and should be used at your own discretion.


---

## 📚 Agent Categories

### By Execution Strategy
- **Planning Agents** - Multi-step strategic approaches
- **Action Agents** - Direct execution patterns

### By Integration Type
- **MCP-Based** - Leveraging Model Context Protocol servers
- **API-Based** - Direct API integrations
- **Tool-Based** - Command-line tool integrations

### By Output Type
- **Structured Data** - JSON/YAML output for automation
- **Reports** - Human-readable analysis
- **Actions** - Direct system modifications

## 🚀 Getting Started

### Prerequisites
- [Qodo CLI](https://github.com/qodo-ai/qodo-gen-cli) installed
- Node.js 18+ and npm
- Git for version control

### Quick Start

1. **Clone this repository:**
   ```bash
   git clone https://github.com/qodo-ai/agent-reference-implementations.git
   cd agent-reference-implementations
   ```

2. **Choose an agent:**
   ```bash
   # Copy a reference agent to your project
   cp -r src/code-review/ /path/to/your/project/agents/
   ```

3. **Configure the agent:**
   ```bash
   # Edit the agent configuration
   vim /path/to/your/project/agents/code-review/agent.toml
   ```

4. **Run the agent:**
   ```bash
   cd /path/to/your/project
   qodo code-review --agent-file=agents/code-review/agent.toml
   ```

### Using Reference Agents

Each reference agent includes:
- **Configuration file** (`agent.toml` or `agent.yaml`)
- **README** with usage instructions and examples
- **Test cases** demonstrating expected behavior
- **Integration examples** for common scenarios

## 🛠️ Creating Your Own Agent

### Basic Agent Structure

```toml
# agent.toml
version = "1.0"
[commands.my_agent]
description = "Detailed description for users"
instructions = """
Your agent's behavior instructions here.
Be specific about the task and expected outcomes.
"""

# Optional: Define arguments
arguments = [
   { name = "input_file", type = "string", required = true, description = "Input file path" },
   { name = "threshold", type = "number", required = false, default = 0.8, description = "Quality threshold" }
]

# Optional: MCP servers your agent uses
mcpServers = """
{
    "shell": {
      "command": "uvx",
      "args": [
        "mcp-shell-server"
      ],
      "env": {
        "ALLOW_COMMANDS": "..."
      }
    },
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ]
    }
}
"""

# Optional: Define available tools
available_tools = ["filesystem", "git", "shell", "github"]

# Optional: Define execution strategy: "plan" for multi-step, "act" for direct execution
execution_strategy = "act"

# Optional: Define expected output structure
output_schema = """
{
    "properties": {
        "success": {"type": "boolean"},
        "results": {"type": "array", "items": {"type": "string"}},
        "score": {"type": "number"}
    }
}
"""

# Optional: Success condition for CI/CD
exit_expression = "success"
```

### Agent Development Guidelines

1. **Clear Instructions**: Write specific, actionable instructions
2. **Proper Tool Selection**: Choose appropriate MCP servers and tools
3. **Error Handling**: Include error scenarios in instructions
4. **Testing**: Provide test cases and expected outputs
5. **Documentation**: Include comprehensive README and examples

### Testing Your Agent

```bash
# Test with sample data
qodo my_agent --input_file=test/sample.txt --threshold=0.9

# Validate output schema
qodo my_agent --input_file=test/sample.txt | jq '.success'

# CI/CD integration test
qodo my_agent --ci --input_file=test/sample.txt
```

## 📖 Documentation

### Agent Configuration Reference
- [Basic Agent Tutorial](https://docs.qodo.ai/qodo-documentation/qodo-gen/cli/creating-and-managing-agents) ✅ - Creating and managing agents
- [MCP Server Integration](https://modelcontextprotocol.io/introduction) ✅ - Model Context Protocol documentation
- [CI/CD Integration](https://docs.qodo.ai/qodo-documentation/qodo-gen/cli/ci-and-automation) ✅ - CI and automation with Qodo CLI
- [Output Schema Design](docs/output-schema.md) 🚧 *Not yet available*

### Best Practices
- [Agent Design Patterns](docs/design-patterns.md) 🚧 *Not yet available*
- [Performance Optimization](docs/performance.md) 🚧 *Not yet available*
- [Security Considerations](docs/security.md) 🚧 *Not yet available*

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute

1. **Reference Agents**: Submit well-documented, tested agents
2. **Community Agents**: Share your specialized use cases
3. **Documentation**: Improve guides and examples
4. **Bug Reports**: Report issues with existing agents

### Contribution Guidelines

- Follow the [Agent Development Guidelines](#agent-development-guidelines)
- Include comprehensive tests and documentation
- Ensure compatibility with latest Qodo CLI version
- Add your agent to the appropriate category in this README

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Qodo CLI](https://github.com/qodo-ai/qodo-gen-cli) - The main Qodo CLI framework
- [Model Context Protocol](https://modelcontextprotocol.io/) - Protocol for AI tool integration
- [MCP Servers](https://github.com/modelcontextprotocol/servers) - Reference MCP server implementations

## 💬 Community

- [GitHub Discussions](https://github.com/qodo-ai/agents/discussions)
- [Discord Server](https://discord.com/invite/SgSxuQ65GF)
- [Documentation](https://docs.qodo.ai/qodo-documentation/qodo-gen/cli)

## ⭐ Support

If you find these agent implementations useful, please consider:
- Starring this repository
- Contributing your own agents
- Sharing feedback and suggestions
- Helping improve documentation

---

**Built with ❤️ by the Qodo community**