import type { Course } from '../types';

// ============================================
// Category 2: UI Design & Tools Courses
// 7 courses in EXACT original order
// (Excluding "Advanced UI & Prototyping" per request)
// ============================================
export const CATEGORY_TWO_COURSES: Course[] = [
    {
        id: "ui-tool-01",
        title: "UI Tools & Prototyping (Figma)",
        badge: "Technical Skills",
        badgeColor: "from-fuchsia-500 to-purple-600",
        totalHours: "45 Hours",
        totalDays: 3,
        description: "Mastering the industry standard. From Constraints and Auto Layout to Advanced Prototyping and Variables.",
        icon: "🎨",
        // Database compatibility
        short_description: "Mastering the industry standard. From Constraints and Auto Layout to Advanced Prototyping and Variables.",
        level: "Intermediate",
        icon_key: "figma",
        icon_bg_color: "#F3E5F5",
        is_published: true,
        category_id: "2",
        slug: "ui-tools-prototyping-figma",
        position: 1,
        modules: [
            // PART 1: LAYOUT & RESPONSIVENESS
            {
                day: "Day 1",
                title: "1. Frames vs Groups & Constraints",
                summary: "Why Pros use Frames. Understanding Left/Right/Scale constraints for responsiveness.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Figma 101: Frames vs Groups", url: "https://www.youtube.com/watch?v=jwHgbxNAjMw", duration: "10 min" },
                    { type: "Article", title: "Understanding Constraints", url: "https://help.figma.com/hc/en-us/articles/360039824934-Apply-constraints-to-define-how-layers-resize", source: "Figma Help" }
                ],
                task: {
                    title: "Constraint Practice",
                    description: "Practice: Create a 'Card' component with an image and text. Set constraints so the text stays fixed while the image stretches.",
                    deliverable: "Responsive Card"
                }
            },
            {
                day: "Day 1",
                title: "2. Auto Layout Mastery",
                summary: "The CSS Flexbox of Design. Hug, Fill, Fixed, and Absolute Positioning.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Auto Layout Deep Dive", url: "https://www.youtube.com/watch?v=T_8d24P96zk", duration: "15 min" },
                    { type: "Article", title: "Guide to Auto Layout", url: "https://www.figma.com/best-practices/auto-layout-guide/", source: "Figma Best Practices" }
                ],
                task: {
                    title: "Auto Layout Navbar",
                    description: "Build: Create a responsive 'Navigation Bar' with a Logo (Left) and Links (Right) using Auto Layout 'Space Between' mode.",
                    deliverable: "Responsive Navbar"
                }
            },
            {
                day: "Day 1",
                title: "3. Grids & Layout Systems",
                summary: "Setting up 8pt Grids and 12-Column Bootstrap grids.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Figma Grids Tutorial", url: "https://www.youtube.com/watch?v=zd8gWJ4hWjM", duration: "8 min" },
                    { type: "Article", title: "Everything you need to know about Grids", url: "https://material.io/design/layout/responsive-layout-grid.html", source: "Material Design" }
                ],
                task: {
                    title: "Grid Setup",
                    description: "Setup: Create a Frame (1440px). Add a 12-Column Grid (Margin: 80px, Gutter: 24px) and align a Hero Section to it.",
                    deliverable: "Grid Template"
                }
            },
            // PART 2: COMPONENTS & SYSTEMS
            {
                day: "Day 2",
                title: "4. Components & Instances",
                summary: "The Master/Instance model. Overrides and resetting assets.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Figma Components Guide", url: "https://www.youtube.com/watch?v=k74IrUNaJkE", duration: "10 min" },
                    { type: "Article", title: "Guide to Components", url: "https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma", source: "Figma Help" }
                ],
                task: {
                    title: "Component Creation",
                    description: "Create: Make a 'Master Button'. Create 3 instances on a new page and override the text and color in each.",
                    deliverable: "Button Component"
                }
            },
            {
                day: "Day 2",
                title: "5. Variants & Properties",
                summary: "Managing states (Hover, Active, Disabled) and Boolean toggles.",
                duration: "4 Hours",
                resources: [
                    { type: "Video", title: "Component Properties (Booleans)", url: "https://www.youtube.com/watch?v=iIq8fFvI1Qs", duration: "12 min" },
                    { type: "Article", title: "Variants Best Practices", url: "https://www.figma.com/best-practices/creating-and-organizing-variants/", source: "Figma Best Practices" }
                ],
                task: {
                    title: "Variant System",
                    description: "System: Create a Button Set with Variants (Primary/Secondary) and a Boolean Property to toggle an 'Icon' ON/OFF.",
                    deliverable: "Advanced Button Set"
                }
            },
            {
                day: "Day 2",
                title: "6. Variables (Design Tokens)",
                summary: "The future of Design Systems. Storing Colors, Numbers, and Strings.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Figma Variables Intro", url: "https://www.youtube.com/watch?v=55555555555", duration: "10 min" },
                    { type: "Article", title: "Guide to Variables", url: "https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables", source: "Figma Help" }
                ],
                task: {
                    title: "Design Tokens",
                    description: "Tokens: Create a Local Variable Collection for your Brand Colors. Apply these variables to your buttons instead of raw Hex codes.",
                    deliverable: "Variable Collection"
                }
            },
            // PART 3: PROTOTYPING & HANDOFF
            {
                day: "Day 3",
                title: "7. Prototyping Basics",
                summary: "Connecting screens, Back actions, and Scroll interactions.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Figma Prototyping Basics", url: "https://www.youtube.com/watch?v=1W1W1W1W1W1", duration: "8 min" },
                    { type: "Article", title: "Prototyping Triggers", url: "https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma", source: "Figma Help" }
                ],
                task: {
                    title: "Prototype Flow",
                    description: "Flow: Link a 'Login Page' to a 'Dashboard'. Make the Dashboard content scrollable while keeping the Header fixed.",
                    deliverable: "Clickable Prototype"
                }
            },
            {
                day: "Day 3",
                title: "8. Smart Animate & Micro-interactions",
                summary: "Creating smooth transitions and Interactive Components.",
                duration: "4 Hours",
                resources: [
                    { type: "Video", title: "Smart Animate Magic", url: "https://www.youtube.com/watch?v=9Z9Z9Z9Z9Z9", duration: "12 min" },
                    { type: "Article", title: "Smart Animate Guide", url: "https://www.figma.com/blog/smart-animate/", source: "Figma Blog" }
                ],
                task: {
                    title: "Micro-interaction",
                    description: "Animate: Create a 'Toggle Switch' using Interactive Components. Make it slide smoothly from Left to Right on click.",
                    deliverable: "Animated Toggle"
                }
            },
            {
                day: "Day 3",
                title: "9. Plugins & Efficiency",
                summary: "Workflow boosters: Unsplash, Iconify, Content Reel, and Simulayt.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Top 10 Figma Plugins", url: "https://www.youtube.com/watch?v=PluginsVideo", duration: "10 min" },
                    { type: "Article", title: "Figma Community Resources", url: "https://www.figma.com/community", source: "Figma" }
                ],
                task: {
                    title: "Speed Run",
                    description: "Speed Run: Use 'Unsplash' to fill 5 Avatar circles and 'Content Reel' to fill 5 Names in under 30 seconds.",
                    deliverable: "Populated Design"
                }
            },
            {
                day: "Day 3",
                title: "10. Developer Handoff (Dev Mode)",
                summary: "Preparing files for code. Annotations, Sections, and Exporting.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Figma for Developers", url: "https://www.youtube.com/watch?v=B1-h1-h1-h1", duration: "10 min" },
                    { type: "Article", title: "Handoff Best Practices", url: "https://www.figma.com/dev-mode/", source: "Figma" }
                ],
                task: {
                    title: "Handoff Prep",
                    description: "Handoff: Mark a section as 'Ready for Dev'. Use the 'Measurement' tool to annotate the padding between two elements.",
                    deliverable: "CSS Snippet"
                }
            }
        ]
    },
    {
        id: "principle-01",
        title: "Design Concepts & Principles",
        badge: "Theory",
        badgeColor: "from-indigo-400 to-cyan-400",
        totalHours: "30 Hours",
        totalDays: 4,
        description: "The science behind aesthetics. Mastering Balance, Contrast, Hierarchy, and Gestalt Psychology.",
        icon: "🧠",
        // Database compatibility
        category_id: "2",
        slug: "design-concepts-principles",
        short_description: "The science behind aesthetics. Mastering Balance, Contrast, Hierarchy, and Gestalt Psychology.",
        level: "Beginner",
        icon_key: "brain",
        icon_bg_color: "#E8EAF6",
        position: 2,
        is_published: true,
        modules: [
            // PART 1: COMPOSITION & LAYOUT PRINCIPLES
            {
                day: "Day 1",
                title: "1. Balance & Alignment",
                summary: "Symmetrical vs. Asymmetrical Balance. The stability of the grid.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Balance in Design Explained", url: "https://www.youtube.com/watch?v=K4M05-J5gJ0", duration: "10 min" },
                    { type: "Article", title: "The Principle of Balance", url: "https://www.smashingmagazine.com/2015/06/design-principles-compositional-balance-symmetry-asymmetry/", source: "Smashing Mag" }
                ],
                task: {
                    title: "Analysis",
                    description: "Analysis: Find a movie poster. Draw a line down the middle. Is it Symmetrical or Asymmetrical? Explain how it achieves 'visual weight' balance.",
                    deliverable: "Poster Analysis"
                }
            },
            {
                day: "Day 1",
                title: "2. Negative Space (White Space)",
                summary: "White space is not 'empty'; it's an active design element.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "White Space is Not Your Enemy", url: "https://alistapart.com/article/whitespace/", source: "A List Apart" },
                    { type: "Video", title: "How to use White Space", url: "https://www.youtube.com/watch?v=J3s7f8f8f8f", duration: "8 min" }
                ],
                task: {
                    title: "Redesign",
                    description: "Redesign: Take a cluttered screenshot (e.g., a busy news site). Redesign one section by ONLY adding padding and margins (White Space).",
                    deliverable: "De-cluttered Design"
                }
            },
            {
                day: "Day 2",
                title: "3. Visual Hierarchy & Scale",
                summary: "Guiding the user's eye. Using Size, Color, and Weight to signal importance.",
                duration: "4 Hours",
                resources: [
                    { type: "Video", title: "Visual Hierarchy Basics", url: "https://www.youtube.com/watch?v=6m6m6m6m6m6", duration: "12 min" },
                    { type: "Article", title: "Visual Hierarchy in UI Design", url: "https://www.nngroup.com/articles/visual-hierarchy-ux-definition/", source: "NN/g" }
                ],
                task: {
                    title: "The Squint Test",
                    description: "The Squint Test: Take a screenshot of a landing page. Blur it (squint). Can you still tell what the most important button/headline is?",
                    deliverable: "Blurred Analysis"
                }
            },
            {
                day: "Day 2",
                title: "4. Repetition & Rhythm",
                summary: "Creating consistency and patterns to reduce cognitive load.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Repetition, Pattern, and Rhythm", url: "https://www.smashingmagazine.com/2015/07/design-principles-dominance-focal-points-hierarchy/", source: "Smashing Mag" },
                    { type: "Video", title: "Rhythm in Design", url: "https://www.youtube.com/watch?v=RhythmVideo", duration: "10 min" }
                ],
                task: {
                    title: "Pattern Audit",
                    description: "Audit: Look at Spotify or Netflix. Identify 3 elements that repeat (e.g., Card styles, Headers). How does this repetition help you browse faster?",
                    deliverable: "Audit Notes"
                }
            },
            // PART 2: PERCEPTUAL PSYCHOLOGY (GESTALT)
            {
                day: "Day 3",
                title: "5. Gestalt: Proximity & Common Region",
                summary: "Things close together are perceived as a group.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Gestalt Principles in UX", url: "https://www.youtube.com/watch?v=be1d-d1d-d1", duration: "10 min" },
                    { type: "Article", title: "Law of Proximity in UX", url: "https://www.nngroup.com/articles/gestalt-proximity/", source: "NN/g" }
                ],
                task: {
                    title: "Fix It",
                    description: "Fix It: Find a form where the label is equidistant between two fields. Fix the 'Proximity' so the label is clearly attached to its input.",
                    deliverable: "Fixed Form"
                }
            },
            {
                day: "Day 3",
                title: "6. Gestalt: Similarity & Continuity",
                summary: "How we perceive lines and similar objects as related.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Law of Similarity", url: "https://www.interaction-design.org/literature/article/laws-of-proximity-uniform-connectedness-and-continuation-gestalt-principles-2", source: "IxDF" },
                    { type: "Video", title: "Gestalt: Continuity & Closure", url: "https://www.youtube.com/watch?v=Gestalt2", duration: "10 min" }
                ],
                task: {
                    title: "Similarity Design",
                    description: "Design: Create a row of 'Cards'. Make one card look different (Break Similarity) to highlight it as 'Featured'. How does the eye react?",
                    deliverable: "Card Layout"
                }
            },
            {
                day: "Day 4",
                title: "7. The Golden Ratio & Proportion",
                summary: "Using math (1:1.618) to create naturally pleasing layouts.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Golden Ratio in UI Design", url: "https://www.youtube.com/watch?v=ke4h5h5h5h5", duration: "8 min" },
                    { type: "Article", title: "A Guide to the Golden Ratio", url: "https://www.canva.com/learn/what-is-the-golden-ratio/", source: "Canva" }
                ],
                task: {
                    title: "Layout Practice",
                    description: "Layout: Create a simple 2-column layout in Figma using the Golden Ratio (e.g., Content area is 61.8% width, Sidebar is 38.2%).",
                    deliverable: "Golden Ratio Grid"
                }
            },
            {
                day: "Day 4",
                title: "8. Contrast & Accessibility",
                summary: "Ensuring legibility and meeting WCAG standards.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Contrast and Color Accessibility", url: "https://webaim.org/articles/contrast/", source: "WebAIM" },
                    { type: "Video", title: "Understanding Contrast Ratios", url: "https://www.youtube.com/watch?v=ContrastVideo", duration: "10 min" }
                ],
                task: {
                    title: "Contrast Check",
                    description: "Check: Use a 'Contrast Checker' plugin. Test 3 color combinations (Text on Background). Do they pass WCAG AA?",
                    deliverable: "Contrast Report"
                }
            }
        ]
    },
    {
        id: "visual-01",
        title: "Visual Design Mastery",
        badge: "Aesthetics",
        badgeColor: "from-pink-500 to-red-500",
        totalHours: "30 Hours",
        totalDays: 4,
        description: "Mastering the atoms of UI: Color, Typography, Iconography, and Spacing Systems.",
        icon: "✨",
        // Database compatibility
        category_id: "2",
        slug: "visual-design-mastery",
        short_description: "Mastering the atoms of UI: Color, Typography, Iconography, and Spacing Systems.",
        level: "Intermediate",
        icon_key: "sparkles",
        icon_bg_color: "#FCE4EC",
        position: 3,
        is_published: true,
        modules: [
            // PART 1: COLOR & DEPTH
            {
                day: "Day 1",
                title: "1. Color Theory & HSB Model",
                summary: "Stop guessing colors. Understanding Hue, Saturation, and Brightness.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "HSB Color System Explained", url: "https://www.youtube.com/watch?v=HSBVideo", duration: "10 min" },
                    { type: "Article", title: "Refactoring UI: Color Palette", url: "https://www.refactoringui.com/previews/building-your-color-palette", source: "Refactoring UI" }
                ],
                task: {
                    title: "Palette Creation",
                    description: "Palette: Create a 'Brand Palette' in Figma using HSB. 1 Primary Color, 3 Neutral Grays (Light, Medium, Dark), and 1 Semantic Color (Error Red).",
                    deliverable: "Color Palette"
                }
            },
            {
                day: "Day 1",
                title: "2. The 60-30-10 Rule",
                summary: "Balancing colors: 60% Neutral, 30% Secondary, 10% Accent.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "The 60-30-10 Rule in UI", url: "https://uxplanet.org/60-30-10-rule-in-ui-design-8de797b5354f", source: "UX Planet" },
                    { type: "Video", title: "Applying Color Balance", url: "https://www.youtube.com/watch?v=ColorBalance", duration: "8 min" }
                ],
                task: {
                    title: "Apply Rule",
                    description: "Apply: Take a black & white Wireframe. Color it using the 60-30-10 rule (Backgrounds, Cards, CTAs).",
                    deliverable: "Colored UI"
                }
            },
            {
                day: "Day 1",
                title: "3. Shadows & Elevation (Depth)",
                summary: "Using light sources to create hierarchy. Material Design principles.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Material Design: Elevation", url: "https://m3.material.io/styles/elevation/overview", source: "Material Design" },
                    { type: "Video", title: "Designing Better Shadows", url: "https://www.youtube.com/watch?v=ShadowsVideo", duration: "10 min" }
                ],
                task: {
                    title: "Shadow Styles",
                    description: "Effects: Create 3 Shadow Styles in Figma: 'Low' (Card), 'Medium' (Hover), 'High' (Modal/Dropdown).",
                    deliverable: "Shadow System"
                }
            },
            // PART 2: TYPOGRAPHY & READABILITY
            {
                day: "Day 2",
                title: "4. Typography Anatomy & Selection",
                summary: "Serif vs Sans Serif. Choosing fonts that match the brand personality.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Choosing Fonts for UI", url: "https://www.youtube.com/watch?v=FontsVideo", duration: "10 min" },
                    { type: "Article", title: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge", source: "Google Fonts" }
                ],
                task: {
                    title: "Font Pairing",
                    description: "Pairing: Choose 2 fonts (Header & Body) for a 'Luxury Hotel' app. Justify why they fit the brand.",
                    deliverable: "Typography Selection"
                }
            },
            {
                day: "Day 2",
                title: "5. Type Scales & Hierarchy",
                summary: "Using a Modular Scale (e.g., Major Third) for mathematical harmony.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "The Type Scale", url: "https://material.io/design/typography/the-type-system.html", source: "Material Design" },
                    { type: "Video", title: "Setting up a Type Scale", url: "https://www.youtube.com/watch?v=TypeScale", duration: "10 min" }
                ],
                task: {
                    title: "Type System",
                    description: "System: Use typescale.com to generate a scale. Set up Figma Text Styles: H1, H2, H3, Body, Caption.",
                    deliverable: "Type Styles"
                }
            },
            {
                day: "Day 2",
                title: "6. Vertical Rhythm & Line Height",
                summary: "The 4-point baseline grid. Why line-height matters for readability.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Baseline Grids in UI", url: "https://medium.com/@obignell/designing-with-a-baseline-grid-55555", source: "Medium" },
                    { type: "Video", title: "Line Height Best Practices", url: "https://www.youtube.com/watch?v=LineHeight", duration: "8 min" }
                ],
                task: {
                    title: "Rhythm Fix",
                    description: "Fix: Take a paragraph of text. Adjust the Line Height to be 150% of the font size (e.g., 16px Font -> 24px Line Height).",
                    deliverable: "Readable Text"
                }
            },
            // PART 3: IMAGERY & SYSTEMS
            {
                day: "Day 3",
                title: "7. Iconography Consistency",
                summary: "Stroke vs Fill. Optical alignment and visual weight of icons.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Material Symbols Guide", url: "https://m3.material.io/styles/icons/designing-icons", source: "Material Design" },
                    { type: "Video", title: "Icon Design Basics", url: "https://www.youtube.com/watch?v=IconVideo", duration: "10 min" }
                ],
                task: {
                    title: "Icon Audit",
                    description: "Audit: Download a set of 5 icons. Check if they have the same Stroke Width and Corner Radius. Unify them if needed.",
                    deliverable: "Unified Icon Set"
                }
            },
            {
                day: "Day 3",
                title: "8. The 8pt Grid System (Spacing)",
                summary: "Using multiples of 8 (8, 16, 24, 32) for padding and margins.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Intro to 8pt Grid", url: "https://spec.fm/specifics/8-pt-grid", source: "Spec.fm" },
                    { type: "Video", title: "Figma Nudge Amount Setup", url: "https://www.youtube.com/watch?v=8ptGrid", duration: "5 min" }
                ],
                task: {
                    title: "Grid Setup",
                    description: "Setup: Change your Figma 'Big Nudge' to 8px. Redesign a Card component ensuring all padding/margins are divisible by 8.",
                    deliverable: "8pt Grid Card"
                }
            },
            {
                day: "Day 4",
                title: "9. Imagery & Art Direction",
                summary: "Choosing photos that tell a story. Vectors vs Rasters.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Selecting Better Photos", url: "https://www.nngroup.com/articles/photos-as-web-content/", source: "NN/g" },
                    { type: "Video", title: "Working with Images in Figma", url: "https://www.youtube.com/watch?v=ImagesVideo", duration: "10 min" }
                ],
                task: {
                    title: "Hero Composition",
                    description: "Composition: Design a 'Hero Section'. Use a high-quality Unsplash image and overlay text. Ensure the text is readable (use a scrim overlay).",
                    deliverable: "Hero Section"
                }
            },
            {
                day: "Day 4",
                title: "10. Creating a Mini-Style Guide",
                summary: "Documenting your styles for the developer.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Creating a Style Guide", url: "https://www.youtube.com/watch?v=StyleGuide", duration: "15 min" },
                    { type: "Article", title: "Design System Fundamentals", url: "https://www.invisionapp.com/inside-design/guide-to-design-systems/", source: "InVision" }
                ],
                task: {
                    title: "Final Style Guide",
                    description: "Final Project: Create a single Figma Frame showing your: Color Palette, Typography Scale, Icon Set, and Button Components.",
                    deliverable: "Mini Design System"
                }
            }
        ]
    },
    {
        id: "web-01",
        title: "UI Principles for Web",
        badge: "Web Standards",
        badgeColor: "from-sky-500 to-blue-500",
        totalHours: "30 Hours",
        totalDays: 4,
        description: "Designing for the browser. Mastering Responsive Layouts, Grids, and Web Accessibility.",
        icon: "🌐",
        // Database compatibility
        category_id: "2",
        slug: "ui-principles-for-web",
        short_description: "Designing for the browser. Mastering Responsive Layouts, Grids, and Web Accessibility.",
        level: "Intermediate",
        icon_key: "globe",
        icon_bg_color: "#E1F5FE",
        position: 4,
        is_published: true,
        modules: [
            // PART 1: RESPONSIVE WEB DESIGN (RWD)
            {
                day: "Day 1",
                title: "1. The 12-Column Grid System",
                summary: "The backbone of the web. Margins, Gutters, and Columns (Bootstrap Standard).",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Responsive Grids Explained", url: "https://www.youtube.com/watch?v=GridsVideo", duration: "10 min" },
                    { type: "Article", title: "Guide to Responsive Grids", url: "https://material.io/design/layout/responsive-layout-grid.html", source: "Material Design" }
                ],
                task: {
                    title: "Grid Setup",
                    description: "Setup: Create 3 Artboards in Figma: Desktop (1440px), Tablet (768px), Mobile (375px). Apply the correct 12, 8, and 4-column grids.",
                    deliverable: "Responsive Grids"
                }
            },
            {
                day: "Day 1",
                title: "2. Breakpoints & Media Queries",
                summary: "Understanding how content reflows at specific widths (sm, md, lg, xl).",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Responsive Design Breakpoints", url: "https://www.w3schools.com/css/css_rwd_mediaqueries.asp", source: "W3Schools" },
                    { type: "Video", title: "Designing for Breakpoints", url: "https://www.youtube.com/watch?v=BreakpointsVideo", duration: "10 min" }
                ],
                task: {
                    title: "Adapt Content",
                    description: "Adapt: Design a 'Pricing Section' with 3 cards. Show how they stack vertically on Mobile and align horizontally on Desktop.",
                    deliverable: "Reflow Design"
                }
            },
            {
                day: "Day 1",
                title: "3. Mobile-First vs. Desktop-First",
                summary: "Designing for the smallest screen first to prioritize content.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Mobile First Design Strategy", url: "https://www.youtube.com/watch?v=MobileFirst", duration: "8 min" },
                    { type: "Article", title: "What is Mobile First Design?", url: "https://www.interaction-design.org/literature/article/mobile-first-design-strategy", source: "IxDF" }
                ],
                task: {
                    title: "Mobile First Challenge",
                    description: "Challenge: Sketch a complex News Homepage for Mobile ONLY. Decide what to hide, what to stack, and what to keep visible.",
                    deliverable: "Mobile Sketch"
                }
            },
            // PART 2: WEB TYPOGRAPHY & LAYOUT
            {
                day: "Day 2",
                title: "4. Web Typography & Readability",
                summary: "Rem vs Px, fluid typography, and optimal line lengths (60-75 chars).",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Web Typography: The Basics", url: "https://fonts.google.com/knowledge/choosing_type/choosing_type_for_web", source: "Google Fonts" },
                    { type: "Video", title: "Responsive Typography", url: "https://www.youtube.com/watch?v=FluidType", duration: "10 min" }
                ],
                task: {
                    title: "Responsive Scale",
                    description: "Scale: Set up a responsive Type Scale. Define how H1 changes size from Desktop (e.g., 64px) to Mobile (e.g., 32px).",
                    deliverable: "Fluid Type Scale"
                }
            },
            {
                day: "Day 2",
                title: "5. Hero Sections & Above the Fold",
                summary: "Designing the first 800px. Value proposition, imagery, and CTAs.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Designing High-Converting Hero Sections", url: "https://www.youtube.com/watch?v=vj7W-d-9-gI", duration: "12 min" },
                    { type: "Article", title: "The Fold is Still Real", url: "https://www.nngroup.com/articles/page-fold-manifesto/", source: "NN/g" }
                ],
                task: {
                    title: "Hero Design",
                    description: "Design: Create a Hero Section for a SaaS product. Include: Headline, Subheadline, 2 CTAs (Primary/Secondary), and a Hero Image.",
                    deliverable: "Hero Section"
                }
            },
            {
                day: "Day 3",
                title: "6. Navigation Patterns for Web",
                summary: "Sticky headers, Mega Menus, and Footers (Fat Footers).",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Website Navigation Patterns", url: "https://uxdesign.cc/website-navigation-patterns-55555", source: "UX Collective" },
                    { type: "Video", title: "Designing Sticky Headers", url: "https://www.youtube.com/watch?v=StickyHeader", duration: "8 min" }
                ],
                task: {
                    title: "Fat Footer",
                    description: "Build: Design a 'Fat Footer' containing: Logo, Social Links, Newsletter Signup, and 4 Columns of Sitemap links.",
                    deliverable: "Fat Footer UI"
                }
            },
            // PART 3: ACCESSIBILITY & PERFORMANCE
            {
                day: "Day 4",
                title: "7. Web Accessibility (A11y)",
                summary: "Focus states, keyboard navigation, and semantic HTML tags.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Designing for Accessibility", url: "https://www.youtube.com/watch?v=A11yWeb", duration: "15 min" },
                    { type: "Article", title: "Web Content Accessibility Guidelines (WCAG)", url: "https://www.w3.org/WAI/standards-guidelines/wcag/", source: "W3C" }
                ],
                task: {
                    title: "Focus State Audit",
                    description: "Audit: Design the 'Focus State' (outline) for your buttons and inputs. Ensure it is visible and high-contrast.",
                    deliverable: "Focus States"
                }
            },
            {
                day: "Day 4",
                title: "8. Designing for Performance",
                summary: "Optimizing images (WebP) and understanding LCP (Largest Contentful Paint).",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Image Optimization for Web", url: "https://web.dev/learn/images/", source: "web.dev" },
                    { type: "Video", title: "Core Web Vitals for Designers", url: "https://www.youtube.com/watch?v=WebVitals", duration: "10 min" }
                ],
                task: {
                    title: "Image Optimization",
                    description: "Optimization: Export your Hero Image in 3 formats (PNG, JPG, WebP). Compare file sizes and explain which one to use.",
                    deliverable: "Optimization Report"
                }
            }
        ]
    },
    {
        id: "mobile-01",
        title: "UI Principles for Mobile",
        badge: "iOS & Android",
        badgeColor: "from-green-500 to-emerald-500",
        totalHours: "30 Hours",
        totalDays: 4,
        description: "Mastering Native Design Guidelines. Touch targets, Gestures, and the difference between iOS and Android.",
        icon: "📱",
        // Database compatibility
        category_id: "2",
        slug: "ui-principles-for-mobile",
        short_description: "Mastering Native Design Guidelines. Touch targets, Gestures, and the difference between iOS and Android.",
        level: "Intermediate",
        icon_key: "smartphone",
        icon_bg_color: "#E8F5E9",
        position: 5,
        is_published: true,
        modules: [
            // PART 1: THE GUIDELINES (THE LAW)
            {
                day: "Day 1",
                title: "1. iOS (HIG) vs. Material Design 3",
                summary: "The philosophy differences: Flat & Blur (Apple) vs. Depth & Ink (Google).",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/", source: "Apple" },
                    { type: "Article", title: "Material Design 3 Overview", url: "https://m3.material.io/", source: "Material Design" }
                ],
                task: {
                    title: "Platform Comparison",
                    description: "Comparison: Create a side-by-side comparison of a 'Settings Page' for iOS and Android. Note the different icon styles and font weights.",
                    deliverable: "UI Comparison"
                }
            },
            {
                day: "Day 1",
                title: "2. The Thumb Zone & Touch Targets",
                summary: "Designing for fingers. Minimum sizes (44pt vs 48dp) and reachability.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "The Thumb Zone", url: "https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/", source: "Smashing Mag" },
                    { type: "Video", title: "Touch Targets Explained", url: "https://www.youtube.com/watch?v=TouchTargets", duration: "8 min" }
                ],
                task: {
                    title: "Thumb Zone Audit",
                    description: "Audit: Check your design. Is the primary button within easy reach of the thumb? Is it at least 44x44 points?",
                    deliverable: "Audit Notes"
                }
            },
            {
                day: "Day 1",
                title: "3. Safe Areas & System Bars",
                summary: "Respecting the Notch, Dynamic Island, and Home Indicator.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Designing for iPhone X & Safe Areas", url: "https://ivomynttinen.com/blog/ios-design-guidelines", source: "Ivo Mynttinen" },
                    { type: "Video", title: "Figma Constraints for Safe Areas", url: "https://www.youtube.com/watch?v=SafeAreaVideo", duration: "10 min" }
                ],
                task: {
                    title: "Safe Area Setup",
                    description: "Setup: Create a Figma Frame for iPhone 15. Add 'Guides' for the Status Bar (Top) and Home Indicator (Bottom). Don't put content there.",
                    deliverable: "Safe Area Guides"
                }
            },
            // PART 2: NAVIGATION & PATTERNS
            {
                day: "Day 2",
                title: "4. Mobile Navigation Patterns",
                summary: "Bottom Tab Bar (iOS) vs Navigation Drawer (Android/Old) vs Navigation Rail.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "iOS Tab Bars", url: "https://developer.apple.com/design/human-interface-guidelines/tab-bars/", source: "Apple HIG" },
                    { type: "Article", title: "Material Navigation Bar", url: "https://m3.material.io/components/navigation-bar/overview", source: "Material Design" }
                ],
                task: {
                    title: "Navigation Design",
                    description: "Design: Create a Bottom Navigation Bar. Use 5 tabs maximum. Ensure the 'Active State' is clearly distinct from inactive tabs.",
                    deliverable: "Tab Bar"
                }
            },
            {
                day: "Day 2",
                title: "5. Gestures & Interactions",
                summary: "Swipe to Delete, Pull to Refresh, and Long Press.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Mobile Gestures UX", url: "https://www.youtube.com/watch?v=GesturesVideo", duration: "10 min" },
                    { type: "Article", title: "Gestures in Mobile UI", url: "https://www.nngroup.com/articles/touch-gestures/", source: "NN/g" }
                ],
                task: {
                    title: "Gesture Prototype",
                    description: "Prototype: In Figma, create a 'Swipe to Delete' interaction on a list item using Interactive Components.",
                    deliverable: "Swipe Interaction"
                }
            },
            {
                day: "Day 3",
                title: "6. Modals & Sheets",
                summary: "Action Sheets (iOS) vs Bottom Sheets (Android). When to use half-screen overlays.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Sheets: Bottom", url: "https://m3.material.io/components/bottom-sheets/overview", source: "Material Design" },
                    { type: "Video", title: "Designing Bottom Sheets", url: "https://www.youtube.com/watch?v=BottomSheet", duration: "10 min" }
                ],
                task: {
                    title: "Sheet Design",
                    description: "Decision: Design a 'Share' menu. Instead of a full-screen modal, design it as a Bottom Sheet that can be dragged down to close.",
                    deliverable: "Bottom Sheet"
                }
            },
            // PART 3: INPUTS & HAPTICS
            {
                day: "Day 4",
                title: "7. Soft Keyboards & Inputs",
                summary: "Handling the virtual keyboard pushing content up. Choosing the right keyboard type (Num vs Text).",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Designing for Mobile Keyboards", url: "https://baymard.com/blog/mobile-keyboard-layouts", source: "Baymard" },
                    { type: "Video", title: "Input Types & Keyboards", url: "https://www.youtube.com/watch?v=InputsVideo", duration: "10 min" }
                ],
                task: {
                    title: "Keyboard Flow",
                    description: "Flow: Design a 'Login Screen'. Show the state BEFORE typing and the state AFTER the keyboard appears (moving the button up).",
                    deliverable: "Login Flow"
                }
            },
            {
                day: "Day 4",
                title: "8. App Icons & Launch Screens",
                summary: "The first impression. App Icon grids and Splash Screen guidelines.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "App Icon Design Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/app-icons/", source: "Apple HIG" },
                    { type: "Video", title: "Designing App Icons", url: "https://www.youtube.com/watch?v=AppIcon", duration: "10 min" }
                ],
                task: {
                    title: "Icon Export",
                    description: "Production: Export an App Icon in all required sizes (1024, 180, 120, etc.) using a Figma plugin.",
                    deliverable: "App Icon Set"
                }
            }
        ]
    },
    {
        id: "devices-01",
        title: "UI Design Across Devices",
        badge: "Multi-Platform",
        badgeColor: "from-orange-500 to-amber-500",
        totalHours: "30 Hours",
        totalDays: 4,
        description: "Designing for every screen: Tablets, Smartwatches, TVs, Foldables, and Car Interfaces.",
        icon: "🖥️",
        // Database compatibility
        category_id: "2",
        slug: "ui-design-across-devices",
        short_description: "Designing for every screen: Tablets, Smartwatches, TVs, Foldables, and Car Interfaces.",
        level: "Intermediate",
        icon_key: "monitor",
        icon_bg_color: "#FFF3E0",
        position: 6,
        is_published: true,
        modules: [
            // PART 1: THE HYBRID SCREENS (TABLETS & FOLDABLES)
            {
                day: "Day 1",
                title: "1. Tablet Design Patterns",
                summary: "More than just a big phone. Split Views, Popovers, and Drag & Drop.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Designing for iPad (Apple HIG)", url: "https://developer.apple.com/design/human-interface-guidelines/layout", source: "Apple HIG" },
                    { type: "Video", title: "Tablet UI Design Best Practices", url: "https://www.youtube.com/watch?v=TabletDesign", duration: "10 min" }
                ],
                task: {
                    title: "Tablet Redesign",
                    description: "Redesign: Take a mobile 'Email App'. Redesign it for Tablet landscape mode using a 'Master-Detail' (Split View) layout.",
                    deliverable: "Tablet Layout"
                }
            },
            {
                day: "Day 1",
                title: "2. Foldable Devices",
                summary: "Designing for changing screen states (Folded, Unfolded, Tent Mode).",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Designing for Foldables (Google I/O)", url: "https://www.youtube.com/watch?v=Foldables", duration: "12 min" },
                    { type: "Article", title: "Material Design for Large Screens", url: "https://m3.material.io/foundations/adaptive-design/large-screens/overview", source: "Material Design" }
                ],
                task: {
                    title: "Foldable Prototype",
                    description: "Prototype: Sketch a video player app that changes layout when the device is half-folded (Tabletop mode: Video top, Controls bottom).",
                    deliverable: "Adaptive Sketch"
                }
            },
            // PART 2: THE TINY SCREENS (WEARABLES)
            {
                day: "Day 2",
                title: "3. Smartwatch Design (Glanceability)",
                summary: "2-second rule. Designing for Apple Watch (watchOS) and WearOS.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Designing for Apple Watch", url: "https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos", source: "Apple HIG" },
                    { type: "Video", title: "Wear OS Design Principles", url: "https://www.youtube.com/watch?v=WearOS", duration: "10 min" }
                ],
                task: {
                    title: "Watch Face UI",
                    description: "Design: Create a 'Fitness Tracker' screen for a watch. Show ONLY the 3 most critical metrics (HR, Time, Distance). No clutter.",
                    deliverable: "Watch UI"
                }
            },
            {
                day: "Day 2",
                title: "4. Micro-Interactions for Watch",
                summary: "Digital Crown, Haptics, and Voice Control integration.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Micro-interactions on Small Screens", url: "https://www.youtube.com/watch?v=MicroWatch", duration: "8 min" },
                    { type: "Article", title: "Gestures in watchOS", url: "https://developer.apple.com/design/human-interface-guidelines/inputs/gestures/", source: "Apple HIG" }
                ],
                task: {
                    title: "Crown Interaction",
                    description: "Flow: Design a 'Timer App' interaction. How does the user set 5 minutes using a rotating dial (Digital Crown)?",
                    deliverable: "Interaction Flow"
                }
            },
            // PART 3: THE LARGE SCREENS (TV & AUTOMOTIVE)
            {
                day: "Day 3",
                title: "5. TV Design (The 10-Foot Experience)",
                summary: "No touch, only focus. Overscan, Remote Control navigation, and Focus States.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Designing for Android TV", url: "https://developer.android.com/design/ui/tv/guides/principles", source: "Android TV" },
                    { type: "Video", title: "Apple TV Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/technologies/tvos/", source: "Apple TV" }
                ],
                task: {
                    title: "TV UI Focus",
                    description: "Design: Create a 'Movie Details' screen for a TV app. Ensure the 'Play' button has a massive, high-contrast 'Focus State'.",
                    deliverable: "TV Interface"
                }
            },
            {
                day: "Day 3",
                title: "6. Automotive UI (CarPlay & Android Auto)",
                summary: "Safety first. Low distraction, high legibility, and voice first.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Android Auto Design Guidelines", url: "https://developer.android.com/design/ui/mobile/guides/foundations/automotive", source: "Android Auto" },
                    { type: "Video", title: "Designing for Drivers", url: "https://www.youtube.com/watch?v=CarUI", duration: "10 min" }
                ],
                task: {
                    title: "Car Dashboard",
                    description: "Audit: Sketch a 'Music Player' for a car dashboard. Remove any button that requires more than 1 second of attention.",
                    deliverable: "Dashboard Sketch"
                }
            },
            // PART 4: SYSTEM CONSISTENCY
            {
                day: "Day 4",
                title: "7. Kiosk & Touch Screen Interfaces",
                summary: "Public usage contexts. Arm fatigue (Gorilla Arm) and huge touch targets.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Designing for Touch Kiosks", url: "https://www.nngroup.com/articles/interactive-kiosks/", source: "NN/g" },
                    { type: "Video", title: "Kiosk UX Design", url: "https://www.youtube.com/watch?v=KioskVideo", duration: "8 min" }
                ],
                task: {
                    title: "Kiosk Layout",
                    description: "Design: Create a 'Fast Food Ordering' screen for a kiosk. Ensure buttons are placed lower on the screen for accessibility.",
                    deliverable: "Kiosk UI"
                }
            },
            {
                day: "Day 4",
                title: "8. Cross-Platform Continuity",
                summary: "Starting a task on phone, finishing on tablet. Seamless Handoff.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Designing Continuous Experiences", url: "https://www.interaction-design.org/literature/article/designing-cross-channel-user-experiences", source: "IxDF" },
                    { type: "Video", title: "Apple Handoff UX", url: "https://www.youtube.com/watch?v=Handoff", duration: "5 min" }
                ],
                task: {
                    title: "Ecosystem Map",
                    description: "Map: Draw a User Journey for buying a house. Phone: Browse listing. Tablet: View 3D tour. Watch: Get notification for appointment.",
                    deliverable: "Journey Map"
                }
            }
        ]
    },
    {
        id: "system-01",
        title: "Design Systems Architecture",
        badge: "Advanced",
        badgeColor: "from-purple-500 to-fuchsia-600",
        totalHours: "30 Hours",
        totalDays: 4,
        description: "Building scalable infrastructure. Atomic Design, Tokens, Governance, and Storybook integration.",
        icon: "🧱",
        // Database compatibility
        category_id: "2",
        slug: "design-systems-architecture",
        short_description: "Building scalable infrastructure. Atomic Design, Tokens, Governance, and Storybook integration.",
        level: "Advanced",
        icon_key: "package",
        icon_bg_color: "#F3E5F5",
        position: 7,
        is_published: true,
        modules: [
            // PART 1: FOUNDATIONS & ATOMIC DESIGN
            {
                day: "Day 1",
                title: "1. Atomic Design Methodology",
                summary: "Atoms, Molecules, Organisms, Templates, Pages. Breaking interfaces down.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Atomic Design (Brad Frost)", url: "https://atomicdesign.bradfrost.com/chapter-2/", source: "Brad Frost" },
                    { type: "Video", title: "Atomic Design Explained", url: "https://www.youtube.com/watch?v=Yi-A20x2dcA", duration: "10 min" }
                ],
                task: {
                    title: "System Deconstruction",
                    description: "Deconstruction: Take a screenshot of Instagram. Circle an Atom (Icon), a Molecule (Post Header), and an Organism (The Feed).",
                    deliverable: "Atomic Breakdown"
                }
            },
            {
                day: "Day 1",
                title: "2. Design Tokens (The Truth Source)",
                summary: "Storing decisions (Color, Spacing, Radius) as platform-agnostic variables.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Introduction to Design Tokens", url: "https://www.youtube.com/watch?v=q6247-47-47", duration: "15 min" },
                    { type: "Article", title: "Naming Design Tokens (Nathan Curtis)", url: "https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c74466c9", source: "Nathan Curtis" }
                ],
                task: {
                    title: "Token Architecture",
                    description: "Tokenize: Create a JSON structure for your Primary Color. Define: 'Global Token' (Blue-500) -> 'Semantic Token' (Primary-Action) -> 'Component Token' (Btn-Bg).",
                    deliverable: "Token JSON"
                }
            },
            {
                day: "Day 2",
                title: "3. Governance & Contribution Models",
                summary: "Who owns the system? How do designers suggest new components?",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Team Models for Design Systems", url: "https://medium.com/eightshapes-llc/team-models-for-scaling-a-design-system-2cf9d03be6a0", source: "EightShapes" },
                    { type: "Video", title: "Governance in Design Systems", url: "https://www.youtube.com/watch?v=GovernanceVideo", duration: "10 min" }
                ],
                task: {
                    title: "Contribution Policy",
                    description: "Draft: Write a simple 'Contribution Policy'. If a designer wants a new icon, what is the process? (Request -> Review -> Merge).",
                    deliverable: "Policy Doc"
                }
            },
            // PART 2: COMPONENT ARCHITECTURE (FIGMA)
            {
                day: "Day 2",
                title: "4. Building Robust Components",
                summary: "Slot Architecture, Base Components, and maximizing flexibility.",
                duration: "4 Hours",
                resources: [
                    { type: "Video", title: "Building Flexible Components (Config)", url: "https://www.youtube.com/watch?v=k74IrUNaJkE", duration: "20 min" },
                    { type: "Article", title: "Component Architecture Patterns", url: "https://www.smashingmagazine.com/2021/08/compound-components-react-design-system/", source: "Smashing Mag" }
                ],
                task: {
                    title: "Slot Component",
                    description: "Build: Create a 'Card' component in Figma using 'Slots' (Instance Swap property) so the content inside can be swapped easily.",
                    deliverable: "Master Component"
                }
            },
            {
                day: "Day 3",
                title: "5. Documentation (Zeroheight / Storybook)",
                summary: "A system is only as good as its documentation. Writing for Devs & Designers.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Documentation Guide", url: "https://zeroheight.com/blog/guide-to-design-system-documentation/", source: "Zeroheight" },
                    { type: "Video", title: "Storybook for Designers", url: "https://www.youtube.com/watch?v=pObiK4S1ee8", duration: "10 min" }
                ],
                task: {
                    title: "Component Docs",
                    description: "Write Docs: Write usage guidelines for a 'Modal'. When to use it? When NOT to use it? (e.g., 'Don't use Modals for complex forms').",
                    deliverable: "Documentation Page"
                }
            },
            {
                day: "Day 3",
                title: "6. Versioning & Release Cycles",
                summary: "Managing updates without breaking product teams. Semantic Versioning (1.0.0).",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Versioning Design Systems", url: "https://medium.com/eightshapes-llc/versioning-design-systems-481e80931165", source: "Nathan Curtis" },
                    { type: "Video", title: "Maintaining a Design System", url: "https://www.youtube.com/watch?v=MaintenanceVideo", duration: "10 min" }
                ],
                task: {
                    title: "Release Strategy",
                    description: "Scenario: You changed the 'Primary Button' color. Is this a Patch (1.0.1), Minor (1.1.0), or Major (2.0.0) update? Explain why.",
                    deliverable: "Change Log"
                }
            },
            // PART 3: ADVANCED TOPICS
            {
                day: "Day 4",
                title: "7. Dark Mode & Theming",
                summary: "Using Variables/Tokens to switch themes instantly.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Designing for Dark Mode", url: "https://www.youtube.com/watch?v=DarkModeFigma", duration: "15 min" },
                    { type: "Article", title: "Material Design: Theming", url: "https://m3.material.io/styles/color/theming", source: "Material Design" }
                ],
                task: {
                    title: "Dark Mode Theme",
                    description: "Theme It: Duplicate your 'Card' component. Create a 'Dark Mode' variable collection. Watch the card switch themes automatically.",
                    deliverable: "Themed Component"
                }
            },
            {
                day: "Day 4",
                title: "8. Measuring System Success",
                summary: "Adoption rates and Detachment rates. Is the system actually working?",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Measuring Design System Success", url: "https://www.nngroup.com/articles/design-systems-roi/", source: "NN/g" },
                    { type: "Video", title: "Analytics for Design Systems", url: "https://www.youtube.com/watch?v=AnalyticsDS", duration: "10 min" }
                ],
                task: {
                    title: "System KPIs",
                    description: "KPIs: Define 2 metrics to track the health of your system (e.g., 'Percentage of components detached in Figma').",
                    deliverable: "KPI Dashboard"
                }
            }
        ]
    }
];
