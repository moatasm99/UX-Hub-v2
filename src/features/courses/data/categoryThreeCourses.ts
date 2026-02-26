import type { Course } from '../types';

// ============================================
// Category 3: Communication & Delivery Courses
// 2 courses in EXACT original order
// (Excluding "How to evaluate your design" & "Build your portfolio & career" per request)
// ============================================
export const CATEGORY_THREE_COURSES: Course[] = [
    {
        id: "write-01",
        title: "UX Writing Mastery",
        badge: "Communication",
        badgeColor: "from-pink-500 to-rose-600",
        totalHours: "15 Hours",
        totalDays: 3,
        description: "The art of guiding users with words. From Microcopy to Voice & Tone.",
        icon: "✍️",
        // Database compatibility
        category_id: "3",
        slug: "ux-writing-mastery",
        short_description: "The art of guiding users with words. From Microcopy to Voice & Tone.",
        level: "Beginner",
        icon_key: "check",
        icon_bg_color: "#F3E5F5",
        position: 1,
        is_published: true,
        modules: [
            // PART 1: FOUNDATIONS & PSYCHOLOGY
            {
                day: "Day 1",
                title: "1. What is UX Writing?",
                summary: "Defining the role: It's not just 'Content', it's 'Design'.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "What is UX Writing? (CareerFoundry)", url: "https://www.youtube.com/watch?v=cM5K8K3dOys", duration: "10 min" },
                    { type: "Article", title: "UX Writing Study Guide (NNGroup)", url: "https://www.nngroup.com/articles/ux-writing-study-guide/", source: "NN/g" }
                ],
                task: {
                    title: "Copy vs Design",
                    description: "Reflection: Look at an app you use. Find one piece of text that 'guides' you (UX Writing) and one that 'sells' to you (Marketing Copy).",
                    deliverable: "Reflection Notes"
                }
            },
            {
                day: "Day 1",
                title: "2. UX Writer vs. Copywriter",
                summary: "The difference between 'Selling' (Persuasion) and 'Guiding' (Clarity).",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Copywriting vs UX Writing (The Futur)", url: "https://www.youtube.com/watch?v=OpX4473_hxo", duration: "8 min" },
                    { type: "Article", title: "UX Writing vs. Copywriting", url: "https://uxplanet.org/ux-writing-vs-copywriting-whats-the-difference-4e1257125712", source: "UX Planet" }
                ],
                task: {
                    title: "Headline Rewrite",
                    description: "Rewrite: Take a marketing headline like 'Buy our amazing tool now!' and rewrite it as a UX interface button label (e.g., 'Get Started').",
                    deliverable: "Rewritten Copy"
                }
            },
            {
                day: "Day 1",
                title: "3. Psychology of Reading (F & Z Patterns)",
                summary: "How users 'Scan' interfaces instead of reading them.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "F-Shaped Pattern for Reading (NNGroup)", url: "https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/", source: "NN/g" },
                    { type: "Video", title: "How Users Read on the Web", url: "https://www.youtube.com/watch?v=KpK2c2Wp5jI", duration: "10 min" }
                ],
                task: {
                    title: "Scan Pattern Audit",
                    description: "Audit: Look at a landing page. Draw the 'Z-Pattern' over it. Are the important texts (Headlines, CTAs) on the path?",
                    deliverable: "Visual Audit"
                }
            },
            // PART 2: THE COMPONENTS
            {
                day: "Day 2",
                title: "4. Voice & Tone",
                summary: "Defining the Brand Persona. Voice is constant; Tone changes with context.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Voice & Tone Strategy", url: "https://www.youtube.com/watch?v=2Tz8YqZ2Z2Z", duration: "10 min" },
                    { type: "Article", title: "The Four Dimensions of Tone of Voice (NNGroup)", url: "https://www.nngroup.com/articles/tone-of-voice-dimensions/", source: "NN/g" }
                ],
                task: {
                    title: "Tone Shift",
                    description: "Scenario: Write a 'Payment Success' message for 2 brands: 1. A Fun Banking App (Playful Tone). 2. A Government Tax Portal (Serious Tone).",
                    deliverable: "Written Messages"
                }
            },
            {
                day: "Day 2",
                title: "5. Writing Clear Buttons (CTAs)",
                summary: "The art of the 'Call to Action'. Being specific and predictable.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "The Art of the Button", url: "https://uxdesign.cc/the-art-of-the-button-4f7f6f7f6f7f", source: "UX Collective" },
                    { type: "Video", title: "Writing Microcopy for Buttons", url: "https://www.youtube.com/watch?v=3sS4sS4sS4s", duration: "5 min" }
                ],
                task: {
                    title: "Button Fix",
                    description: "Fix It: Rename a button labeled 'Submit' on a 'Book a Flight' form. Make it more descriptive (e.g., 'Confirm Booking').",
                    deliverable: "New Button Label"
                }
            },
            {
                day: "Day 2",
                title: "6. Error Messages (The 4 H's)",
                summary: "Making errors Human, Helpful, Humble, and Hesitation-free.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "How to Write Error Messages (NNGroup)", url: "https://www.youtube.com/watch?v=2p_eK-CqW4k", duration: "8 min" },
                    { type: "Article", title: "Error Message Guidelines (NNGroup)", url: "https://www.nngroup.com/articles/error-message-guidelines/", source: "NN/g" }
                ],
                task: {
                    title: "Error Rewrite",
                    description: "Rewrite: 'Error 404: Bad Request'. Rewrite this to be helpful for a user who is lost (e.g., 'We couldn't find that page. Try searching...').",
                    deliverable: "New Error Message"
                }
            },
            {
                day: "Day 2",
                title: "7. Empty States",
                summary: "Turning 'Zero Data' into an opportunity for education or action.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Empty State Best Practices (Toptal)", url: "https://www.toptal.com/designers/ux/empty-state-design-infographic", source: "Toptal" },
                    { type: "Video", title: "Designing Empty States", url: "https://www.youtube.com/watch?v=0k1l0k1l0k1", duration: "5 min" }
                ],
                task: {
                    title: "Empty State Copy",
                    description: "Draft: Write the copy for an Empty 'Favorites' list. Don't just say 'No Favorites'. Encourage the user to add one.",
                    deliverable: "Empty State Text"
                }
            },
            {
                day: "Day 2",
                title: "8. Onboarding Flows",
                summary: "Teaching the user how the product works without boring them.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Mobile App Onboarding (NNGroup)", url: "https://www.nngroup.com/articles/mobile-app-onboarding/", source: "NN/g" },
                    { type: "Video", title: "User Onboarding Deconstructed", url: "https://www.youtube.com/watch?v=5r5r5r5r5r5", duration: "10 min" }
                ],
                task: {
                    title: "Onboarding Storyboard",
                    description: "Storyboard: Write the headlines for a 3-screen onboarding carousel for a 'ToDo App'. Screen 1: Add, Screen 2: Organize, Screen 3: Complete.",
                    deliverable: "Onboarding Headlines"
                }
            },
            {
                day: "Day 2",
                title: "9. Forms & Labels",
                summary: "Reducing friction. Top-aligned labels vs Placeholders.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Placeholders in Form Fields are Harmful (NNGroup)", url: "https://www.nngroup.com/articles/form-design-placeholders/", source: "NN/g" },
                    { type: "Video", title: "Best Practices for Forms (Google Chrome Devs)", url: "https://www.youtube.com/watch?v=i1O1dGiR3Z8", duration: "8 min" }
                ],
                task: {
                    title: "Form Critique",
                    description: "Critique: Find a form that uses 'Placeholders' instead of 'Labels'. Explain why this is bad for accessibility.",
                    deliverable: "Critique Notes"
                }
            },
            // PART 3: ADVANCED & CAREER
            {
                day: "Day 3",
                title: "10. Accessibility & Alt Text",
                summary: "Writing for Screen Readers and inclusivity.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Writing for Web Accessibility", url: "https://www.youtube.com/watch?v=0f0f0f0f0f0", duration: "10 min" },
                    { type: "Article", title: "How to Write Alt Text (HubSpot)", url: "https://blog.hubspot.com/marketing/image-alt-text", source: "HubSpot" }
                ],
                task: {
                    title: "Alt Text Challenge",
                    description: "Write Alt Text: Describe an image of 'A happy woman holding a credit card' for a screen reader user.",
                    deliverable: "Alt Text"
                }
            },
            {
                day: "Day 3",
                title: "11. Localization & RTL",
                summary: "Writing copy that survives translation (English <-> Arabic).",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "International Usability (NNGroup)", url: "https://www.nngroup.com/articles/international-usability/", source: "NN/g" },
                    { type: "Video", title: "Designing for Global Audiences", url: "https://www.youtube.com/watch?v=GlobalVideo", duration: "8 min" }
                ],
                task: {
                    title: "Translation Check",
                    description: "Compare: Find a button in English (e.g., 'Back') and its Arabic translation. Does the meaning change? Is the space sufficient?",
                    deliverable: "Comparison Notes"
                }
            },
            {
                day: "Day 3",
                title: "12. The Portfolio & Case Studies",
                summary: "How to present your writing work to get hired.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "How to Create a UX Writing Portfolio", url: "https://uxwritinghub.com/ux-writing-portfolio/", source: "UX Writing Hub" },
                    { type: "Video", title: "UX Writing Portfolio Review", url: "https://www.youtube.com/watch?v=PortReview", duration: "15 min" }
                ],
                task: {
                    title: "Case Study Title",
                    description: "Draft a Case Study Title: Choose one of your previous tasks (e.g., The Error Message Rewrite). Write a title and a 'Problem Statement' for it.",
                    deliverable: "Case Study Concept"
                }
            }
        ]
    },
    {
        id: "handoff-01",
        title: "Design-Dev Handoff Process",
        badge: "Collaboration",
        badgeColor: "from-lime-500 to-green-600",
        totalHours: "15 Hours",
        totalDays: 2,
        description: "Stop 'throwing designs over the wall'. Learn to prepare files, annotate behaviors, and speak 'Developer'.",
        icon: "🤝",
        // Database compatibility
        category_id: "3",
        slug: "design-dev-handoff-process",
        short_description: "Stop 'throwing designs over the wall'. Learn to prepare files, annotate behaviors, and speak 'Developer'.",
        level: "Intermediate",
        icon_key: "users",
        icon_bg_color: "#E8F5E9",
        position: 2,
        is_published: true,
        modules: [
            // PART 1: PREPARATION & HYGIENE
            {
                day: "Day 1",
                title: "1. The Handoff Mindset",
                summary: "It's a conversation, not a file transfer. Involving devs early.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Stop Handing Off, Start Collaborating", url: "https://www.youtube.com/watch?v=FjI9q5J2s2s", duration: "10 min" },
                    { type: "Article", title: "The Handoff Guide", url: "https://www.interaction-design.org/literature/article/design-handoff-guide", source: "IxDF" }
                ],
                task: {
                    title: "Intro Message",
                    description: "Scenario: You finished a design. Write a 3-bullet point 'Slack Message' to your developer introducing the feature and asking for a review.",
                    deliverable: "Communication Draft"
                }
            },
            {
                day: "Day 1",
                title: "2. File Hygiene & Organization",
                summary: "Naming layers, removing unused frames, and using Sections.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "Figma File Organization for Handoff", url: "https://www.figma.com/best-practices/file-organization/", source: "Figma Best Practices" },
                    { type: "Video", title: "Preparing Files for Developers", url: "https://www.youtube.com/watch?v=DevModeVideo", duration: "10 min" }
                ],
                task: {
                    title: "File Cleanup",
                    description: "Cleanup: Take a messy Figma file (or create one). Rename all layers (e.g., 'Frame 132' -> 'Hero Section'), delete hidden layers, and group logical sections.",
                    deliverable: "Organized File Screenshot"
                }
            },
            {
                day: "Day 1",
                title: "3. Annotations & Redlining",
                summary: "Explaining 'Behavior', 'States', and 'Edge Cases' that static screens can't show.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "How to Annotate Designs", url: "https://www.youtube.com/watch?v=AnnotateVideo", duration: "8 min" },
                    { type: "Article", title: "The Art of Redlining", url: "https://uxdesign.cc/the-art-of-redlining-55555", source: "UX Collective" }
                ],
                task: {
                    title: "Annotation Practice",
                    description: "Annotate: Use a sticky note plugin in Figma to explain a 'Hover State' and what happens when the user has 'No Internet Connection'.",
                    deliverable: "Annotated Screen"
                }
            },
            // PART 2: TECHNICAL EXECUTION
            {
                day: "Day 2",
                title: "4. Figma Dev Mode & Specs",
                summary: "Using the 'Inspect' panel, Box Model, and copying code (CSS/Swift).",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Mastering Figma Dev Mode", url: "https://www.youtube.com/watch?v=DevModeDeepDive", duration: "15 min" },
                    { type: "Article", title: "Figma for Developers Guide", url: "https://help.figma.com/hc/en-us/articles/15023124644247-Guide-to-Dev-Mode", source: "Figma Help" }
                ],
                task: {
                    title: "Dev Mode Audit",
                    description: "Inspect: Go to Dev Mode. Copy the CSS for a button's shadow and border-radius. Paste it into a text file to check accuracy.",
                    deliverable: "CSS Snippet Validation"
                }
            },
            {
                day: "Day 2",
                title: "5. Assets & Exporting",
                summary: "SVG vs PNG vs JPG. 1x, 2x, 3x. Handling icons and illustrations.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "The Ultimate Guide to Image Exporting", url: "https://www.smashingmagazine.com/2021/03/image-export-guide-ui-designers/", source: "Smashing Mag" },
                    { type: "Video", title: "Exporting Assets in Figma", url: "https://www.youtube.com/watch?v=ExportVideo", duration: "8 min" }
                ],
                task: {
                    title: "Export Kit",
                    description: "Export Kit: Prepare a folder with: 1. The Logo as SVG. 2. The Hero Image as JPG (Compressed). 3. App Icons as PNG (2x and 3x).",
                    deliverable: "Asset Folder Structure"
                }
            },
            {
                day: "Day 2",
                title: "6. Design QA (VQA)",
                summary: "Reviewing the coded build. Spotting 'Visual Bugs' vs 'Functional Bugs'.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "How to do Design QA", url: "https://www.youtube.com/watch?v=QAVideo", duration: "10 min" },
                    { type: "Article", title: "Design QA Checklist", url: "https://www.nngroup.com/articles/design-qa/", source: "NN/g" }
                ],
                task: {
                    title: "Bug Bash",
                    description: "Bug Bash: Compare a coded website (use any site) to its design (imagine the design). Find 3 'Visual Bugs' (e.g., Wrong font size, Misalignment) and screenshot them.",
                    deliverable: "Bug Report"
                }
            }
        ]
    }
];
