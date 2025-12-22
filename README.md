### Updates
##### v1.8.2
- Side Memo now supports parsing inline and block LaTeX formulas
- Side Memo code blocks now support syntax highlighting
- Side Memo is supported in the search interface
- Side Memo is disabled in some panels such as the backlinks panel
##### v1.8.0
- 💫 New feature: Side Memo — when enabled, inline notes or block notes can be shown at the right side of the editor
   - Click the title area (first line) of a side memo card to open the note editor
   - Long-press a side memo card for 1s, then drag to resize the side memo width
   - Supports basic Markdown parsing
   - Supports inline HTML
   - Note 1: Position calculation relies on Siyuan v3.4.0; this feature may not work correctly on earlier versions
   - Note 2: Conflicts with Asri theme's full-width display — disable if necessary
- Vertical Tabs switched to hook-based trigger for improved performance
### Usage
- Click the <span data-type="kbd">Appearance Mode</span> button in the top bar to open the Asri theme settings menu. All plugin features are configured in the <span data-type="kbd">More Presets</span> and <span data-type="kbd">More</span> sections.
- This plugin is designed specifically for the Asri theme. Disable it when using other themes to avoid style issues.
### More Preset Color Schemes
Adds many additional preset color schemes on top of Asri's original palettes
- Inspiration palettes: Oxygen, Wilderness, Glitch, Sakura
- Ported from QYL theme: Amber, Wilderness, Midnight
- Ported from Savor theme: Salt
- Ported from Obsidian theme: Golden Topaz
- Ported from VSCode theme: Rosé Pine
- Ported from Vim theme: Gruvbox
### Improved Editing Experience
Introduces useful editing features not yet provided by the Asri theme
- Slash menu arrow-key navigation (enabled automatically)
- Typewriter mode
- List bullet lines
- Vertical tab (cannot be enabled at the same time as Top Bar Fusion+; only affects the top-left tab bar)
- Side Memo (shows inline or block notes on the right side of the editor)
   - Click the title area (first line) of a side memo card to open the note editor
   - Long-press a side memo card for 1s, then drag to resize the side memo width
   - Supports basic Markdown parsing
   - Supports inline HTML
   - Note: Position calculation relies on Siyuan v3.4.0 and may not work on older versions
### Theme Detail Adjustments
Fine-grained adjustments kept in the Asri theme style
- Sidebar Top Sticky — remove the sidebar top collapse/expand animation so the top area remains visible
- Cover image fade
- Paper texture
- Colored headings
- Heading level hint
- Colored file tree
- Hide tab header & breadcrumb (only effective when Top Bar Fusion+ is enabled; recommended to use with progressive blur)
- More animations
