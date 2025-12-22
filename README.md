### Updates
##### v1.8.3
- Limit the maximum height of Side Memo and add an overflow fade effect (overflow can be scrolled to view)
- Disable Side Memo in the flashcard interface
##### v1.8.2
- Side Memo now supports parsing inline and block Markdown LaTeX formulas
- Side Memo code blocks support syntax highlighting
- Side Memo is supported in the search interface
- Disable Side Memo in some panels such as the backlinks panel
##### v1.8.0
- 💫 New feature: Side Memo — when enabled, inline notes or block notes can be shown on the right side of the editor
   - Click the title area (first line) of a Side Memo card to open the note editor
   - Long-press a Side Memo card for 1s, then drag to resize the Side Memo width
   - Supports basic Markdown parsing
   - Supports inline HTML
   - Note 1: Position calculation relies on Siyuan v3.4.0 — this feature may not work correctly on earlier versions
   - Note 2: Conflicts with the Asri theme's full-width display — disable if necessary
- Vertical Tabs switched to a hook-trigger to improve performance
### Usage
- Click the <span data-type="kbd">Appearance Mode</span> button in the top bar to open the Asri theme settings menu. All plugin options are configured under the <span data-type="kbd">More Presets</span> and <span data-type="kbd">More</span> sections.
- This plugin is designed specifically for the Asri theme. Disable it when using other themes to avoid style issues.
### More Preset Color Schemes
Adds many additional preset color schemes on top of Asri's original palettes:
- Inspiration palettes: Oxygen, Wilderness, Glitch, Sakura
- Ported from the QYL theme: Amber, Wilderness, Midnight
- Ported from the Savor theme: Salt
- Ported from the Obsidian theme: Golden Topaz
- Ported from the VSCode theme: Rosé Pine
- Ported from the Vim theme: Gruvbox
### Improved Editing Experience
Introduces useful editing features that the base Asri theme does not yet provide:
- Slash menu arrow-key navigation (enabled automatically)
- Typewriter mode
- List bullet lines
- Vertical Tabs (cannot be enabled at the same time as Top Bar Fusion+; only affects the top-left tab bar)
- Side Memo (shows inline or block notes on the right side of the editor)
   - Click the title area (first line) of a Side Memo card to open the note editor
   - Long-press a Side Memo card for 1s, then drag to resize the Side Memo width
   - Supports basic Markdown parsing
   - Supports inline HTML
   - Note: Position calculation relies on Siyuan v3.4.0 and may not work on older versions
### Theme Detail Adjustments
Fine-grained style adjustments consistent with the Asri theme:
- Sidebar Top Sticky — remove the sidebar top collapse/expand animation so the top area remains visible
- Cover image fade
- Paper texture
- Colored headings
- Heading level hint
- Colored file tree
- Hide tab header & breadcrumb (only effective when Top Bar Fusion+ is enabled; recommended to use with progressive blur)
- More animations