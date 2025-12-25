### Updates
##### v1.8.6
- Added detail adjustment option: Single-column slash menu
##### v1.8.5
- Fixed an issue where Side Memo sometimes failed to render KaTeX formulas and syntax highlighting
- Right-click the title area (first line) of a Side Memo card to temporarily collapse that note
- When Side Memo is active for the current editor, hovering over an unfolded inline note will no longer show a tooltip (panels where tooltips are still appropriate — e.g., backlinks panel, flashcard interface — remain unaffected)
### Usage
- Click the top-bar `Appearance Mode` button to open the Asri theme settings menu. All plugin features are configurable under the `More Preset Palettes` and `More` options.
- This plugin is only compatible with the Asri theme. Disable it when using other themes to avoid style conflicts.
### More Preset Palettes
Adds many additional preset color schemes on top of Asri's original palettes:
- Inspiration palettes: Oxygen, Tree-lined, Glitch, Sakura
- Ported from the QYL theme: Amber, Wilderness, Midnight
- Ported from the Savor theme: Salt
- Ported from the Obsidian theme: Golden Topaz
- Ported from the VSCode theme: Rosé Pine
- Ported from the Vim theme: Gruvbox
### Editing Experience Improvements
Introduces useful editing features not yet available in the base Asri theme:
- Slanted menu arrow-key navigation (enabled automatically)
- Typewriter mode
- List bullet lines
- Vertical Tabs (cannot be enabled together with Top Bar Fusion+; only affects the top-left tab bar)
- Side Memo (displays inline or block notes on the right side of the editor)
    - Left-click the title area (first line) of a Side Memo card to open the note editor
    - Right-click the title area (first line) of a Side Memo card to temporarily collapse the note
    - Long-press a Side Memo card for 1s, then drag to resize the Side Memo width
    - Supports parsing Markdown
    - Supports parsing HTML
        - `Note: This conflicts with the Asri theme's full-width display. Disable the full-width setting if necessary.`
### Theme Detail Adjustments
Fine-grained adjustments that follow the Asri theme's style:
- Sidebar top sticky — remove the Asri theme's sidebar-top collapse/expand animation so the top area remains visible
- Cover image fade
- Paper texture
- Colored headings
- Heading level hints
- Colored document tree
- Hide tabs/breadcrumbs (only effective when Top Bar Fusion+ is enabled; recommended to use with progressive blur)
- More animations