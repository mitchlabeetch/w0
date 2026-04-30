# StatusLine Setup Agent

## Agent Configuration

- **name**: statusline-setup
- **subagent_type**: statusline-setup
- **prompt**: Configure my statusLine from my shell PS1 configuration

## Purpose

This agent configures a statusline (like tmux statusline, zsh/bash prompt, or terminal status bar) by parsing and interpreting shell PS1/PROMPT configurations.

## Capabilities

1. **Parse PS1 Components**
   - Extract git branch indicators
   - Identify directory truncation patterns
   - Parse color codes (ANSI, 256-color, truecolor)
   - Extract custom prompt elements (time, user, host)

2. **Convert to StatusLine Format**
   - Transform bash/zsh prompts to tmux statusline format
   - Map ANSI colors to statusline color codes
   - Handle special characters and escape sequences

3. **Configuration Presets**
   - Git-aware statusline
   - Minimal statusline
   - Powerline-style statusline
   - Custom statusline with selected modules

## Supported Formats

### Input Formats
- Bash PS1
- Zsh prompt
- Oh-My-Zsh themes
- Powerlevel10k config
- Starship config

### Output Formats
- tmux statusline
- GNU screen hardstatus
- terminal-strips statusbar
- custom shell prompt

## Example Usage

```bash
# Parse existing PS1
statusline-setup --parse-ps1 '$PS1'

# Generate tmux statusline from PS1
statusline-setup --from-ps1 '$PS1' --format tmux

# Create git-aware statusline
statusline-setup --preset git-aware --format tmux

# Apply custom colors
statusline-setup --preset git-aware --colors "green:#00ff00,red:#ff0000"
```

## PS1 Parsing Rules

| PS1 Element | StatusLine Equivalent |
|------------|---------------------|
| `\u` | #S (username) |
| `\h` | #h (hostname) |
| `\w` | #/ (cwd) |
| `\W` | #F (basename) |
| `\$(git branch)` | #(git branch) |
| `\t` | %H:%M (time) |
| `\[\e[...\]` | Color codes |
| `\n` | newline |

## Color Mapping

| ANSI Code | Color Name | Hex |
|-----------|-----------|-----|
| 30-37 | Standard | Various |
| 90-97 | Bright | Various |
| 1 | Bold | +bold suffix |
| 4 | Underline | +underline suffix |

## Configuration Schema

```yaml
statusline:
  left:
    - module: directory
      max_length: 50
      truncation: start
    - module: git_branch
      color: green
    - module: git_status
      symbols: [?,+,*]

  right:
    - module: time
      format: "%H:%M"
    - module: date
      format: "%Y-%m-%d"

  colors:
    bg: "#1e1e1e"
    fg: "#cccccc"
    git_added: "#4caf50"
    git_modified: "#ff9800"
    git_conflict: "#f44336"
```
