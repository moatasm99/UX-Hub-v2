import type { Course } from '../types';

// ============================================
// Category 1: UX & Strategy Courses
// All 10 courses in EXACT original order
// ============================================
export const CATEGORY_ONE_COURSES: Course[] = [
    {
        id: "ux-01",
        title: "User Experience: The Beginner's Guide",
        badge: "Foundation",
        badgeColor: "from-emerald-500 to-teal-600",
        totalHours: "60 Hours",
        totalDays: 4,
        description: "The complete foundation of Human-Centered Design, Psychology, and UX History.",
        icon: "🎓",
        // Database compatibility
        short_description: "The complete foundation of Human-Centered Design, Psychology, and UX History.",
        level: "Beginner",
        icon_key: "graduation-cap",
        icon_bg_color: "#E8F5E9",
        is_published: true,
        modules: [
            {
                day: "Day 1", title: "History & Evolution of UX", summary: "From Don Norman to the Modern Product Era.", duration: "15 Hours",
                resources: [
                    { type: "Article", title: "A 100-Year View of User Experience", url: "https://www.nngroup.com/articles/100-years-ux/" },
                    { type: "Video", title: "40 Years in UX (Jakob Nielsen)", url: "https://www.nngroup.com/videos/40-years/" }
                ],
                task: { title: "Observation Log", description: "Identify 3 'Bad UX' examples in your physical environment (e.g., a confusing door handle). Document WHY it failed using the 5 Whys method.", deliverable: "Written Report + Photo Evidence" }
            },
            {
                day: "Day 2", title: "Psychology & Laws of UX", summary: "Understanding how the human brain processes interfaces.", duration: "15 Hours",
                resources: [
                    { type: "Video", title: "10 Psychology Laws for Designers", url: "https://www.youtube.com/watch?v=kY7f1qZ2aM8", duration: "18 min" },
                    { type: "Article", title: "Gestalt Principles in UI", url: "https://www.interaction-design.org/literature/topics/gestalt-principles", source: "IxDF" }
                ],
                task: { title: "UI Audit", description: "Take a screenshot of your favorite app (e.g., Spotify). Circle areas where 'Law of Proximity' and 'Fitts Law' are applied.", deliverable: "Annotated Screenshot" }
            },
            {
                day: "Day 3", title: "Human-Centered Design (HCD)", summary: "The philosophy of designing for people first.", duration: "15 Hours",
                resources: [
                    { type: "Video", title: "Human-Centered Design Explained", url: "https://www.youtube.com/watch?v=Musdl5g0_zM", duration: "8 min" },
                    { type: "Article", title: "The 4 Principles of HCD", url: "https://www.interaction-design.org/literature/topics/human-centered-design", source: "IxDF" }
                ],
                task: { title: "Empathy Map", description: "Pick a partner and interview them about their last 'Online Shopping' experience. Create a simple Empathy Map (Says, Thinks, Does, Feels).", deliverable: "Empathy Map Canvas" }
            },
            {
                day: "Day 4", title: "UX Ethics & Accessibility", summary: "Designing for everyone and avoiding Dark Patterns.", duration: "15 Hours",
                resources: [
                    { type: "Video", title: "Dark Patterns in UX", url: "https://www.youtube.com/watch?v=kxkrdLI6e6M", duration: "15 min" },
                    { type: "Article", title: "Web Accessibility Guidelines (WCAG)", url: "https://www.w3.org/WAI/standards-guidelines/wcag/", source: "W3C" }
                ],
                task: { title: "Accessibility Audit", description: "Use WAVE or Lighthouse to audit any website. Document 5 accessibility issues found and propose fixes.", deliverable: "Audit Report" }
            }
        ]
    },
    {
        id: "ux-02",
        title: "UX Research Methods",
        badge: "Methodology",
        badgeColor: "from-violet-500 to-purple-600",
        totalHours: "60 Hours",
        totalDays: 5,
        description: "Master the art of understanding users through research methods.",
        icon: "🔬",
        // Database compatibility
        category_id: "1",
        slug: "ux-research-methods",
        short_description: "Master the art of understanding users through research methods.",
        level: "Intermediate",
        icon_key: "search",
        icon_bg_color: "#F3E5F5",
        position: 2,
        is_published: true,
        modules: [
            {
                day: "Day 1", title: "Introduction to UX Research", summary: "Why research matters and the landscape of UX methods.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "UX Research 101", url: "https://www.youtube.com/watch?v=example1", duration: "20 min" },
                    { type: "Article", title: "When to Use Which UX Research Method", url: "https://www.nngroup.com/articles/which-ux-research-methods/", source: "NNG" }
                ],
                task: { title: "Research Plan", description: "Create a research plan for studying how students use your university's website.", deliverable: "Research Plan Document" }
            },
            {
                day: "Day 2", title: "User Interviews & Surveys", summary: "Conducting effective qualitative and quantitative research.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "How to Conduct User Interviews", url: "https://www.youtube.com/watch?v=example2", duration: "25 min" },
                    { type: "Article", title: "Survey Design Best Practices", url: "https://www.surveymonkey.com/mp/survey-guidelines/", source: "SurveyMonkey" }
                ],
                task: { title: "Interview Guide", description: "Write an interview guide with 10 open-ended questions about a product of your choice.", deliverable: "Interview Script" }
            },
            {
                day: "Day 3", title: "Usability Testing", summary: "Planning and running effective usability tests.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "Usability Testing Tips", url: "https://www.youtube.com/watch?v=example3", duration: "15 min" },
                    { type: "Article", title: "Usability Testing 101", url: "https://www.nngroup.com/articles/usability-testing-101/", source: "NNG" }
                ],
                task: { title: "Test Plan", description: "Design a usability test plan with 5 tasks for testing a food delivery app.", deliverable: "Usability Test Plan" }
            },
            {
                day: "Day 4", title: "Competitive Analysis & Heuristic Evaluation", summary: "Evaluating products without direct user involvement.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "Competitive UX Analysis", url: "https://www.youtube.com/watch?v=example4", duration: "18 min" },
                    { type: "Article", title: "10 Usability Heuristics", url: "https://www.nngroup.com/articles/ten-usability-heuristics/", source: "NNG" }
                ],
                task: { title: "Competitive Audit", description: "Compare 3 competing apps in the same category using a feature matrix.", deliverable: "Competitive Analysis Report" }
            },
            {
                day: "Day 5", title: "Synthesizing Research Insights", summary: "Turning raw data into actionable insights.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "Affinity Mapping", url: "https://www.youtube.com/watch?v=example5", duration: "12 min" },
                    { type: "Article", title: "How to Synthesize UX Research", url: "https://www.interaction-design.org/literature/article/how-to-synthesize-ux-research" }
                ],
                task: { title: "Research Synthesis", description: "Create an affinity diagram from your previous interview notes and identify 3 key themes.", deliverable: "Affinity Diagram + Insight Report" }
            }
        ]
    },
    {
        id: "ux-03",
        title: "Design Thinking Process",
        badge: "Methodology",
        badgeColor: "from-violet-500 to-purple-600",
        totalHours: "60 Hours",
        totalDays: 5,
        description: "Apply the full Design Thinking methodology from Empathize to Test.",
        icon: "💡",
        modules: [
            {
                day: "Day 1", title: "Empathize Phase", summary: "Deep user understanding through observation and engagement.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "Design Thinking: Empathize", url: "https://www.youtube.com/watch?v=example6", duration: "20 min" },
                    { type: "Article", title: "Empathy in Design", url: "https://www.interaction-design.org/literature/article/design-thinking-getting-started-with-empathy" }
                ],
                task: { title: "Empathy Map", description: "Interview 3 people about their daily commute and create empathy maps.", deliverable: "3 Empathy Maps" }
            },
            {
                day: "Day 2", title: "Define Phase", summary: "Framing the right problem to solve.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "How to Define Problems", url: "https://www.youtube.com/watch?v=example7", duration: "15 min" },
                    { type: "Article", title: "Point of View & How Might We", url: "https://www.interaction-design.org/literature/article/define-and-frame-your-design-challenge" }
                ],
                task: { title: "Problem Statement", description: "Write 3 'How Might We' statements based on your empathy research.", deliverable: "HMW Statements" }
            },
            {
                day: "Day 3", title: "Ideate Phase", summary: "Generating creative solutions through brainstorming.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "Ideation Techniques", url: "https://www.youtube.com/watch?v=example8", duration: "18 min" },
                    { type: "Article", title: "Brainstorming & Crazy 8s", url: "https://www.interaction-design.org/literature/article/learn-how-to-use-the-best-ideation-methods" }
                ],
                task: { title: "Crazy 8s", description: "Sketch 8 different solutions in 8 minutes for your HMW statement.", deliverable: "Crazy 8s Sketches" }
            },
            {
                day: "Day 4", title: "Prototype Phase", summary: "Building quick, testable versions of your ideas.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "Rapid Prototyping", url: "https://www.youtube.com/watch?v=example9", duration: "22 min" },
                    { type: "Article", title: "Paper Prototyping", url: "https://www.nngroup.com/articles/paper-prototyping/" }
                ],
                task: { title: "Paper Prototype", description: "Create a paper prototype of your best solution from the ideation phase.", deliverable: "Paper Prototype Photos" }
            },
            {
                day: "Day 5", title: "Test Phase", summary: "Validating your prototype with real users.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "Testing Prototypes with Users", url: "https://www.youtube.com/watch?v=example10", duration: "16 min" },
                    { type: "Article", title: "How to Test Your Prototype", url: "https://www.interaction-design.org/literature/article/test-your-prototypes-how-to-gather-feedback-and-maximise-learning" }
                ],
                task: { title: "Usability Test", description: "Test your paper prototype with 3 users and document their feedback.", deliverable: "Test Results Summary" }
            }
        ]
    },
    {
        id: "ia-01",
        title: "Information Architecture",
        badge: "Deep Dive",
        badgeColor: "from-blue-600 to-indigo-700",
        totalHours: "60 Hours",
        totalDays: 5,
        description: "Structure, organize, and label content for optimal findability.",
        icon: "🏗️",
        // Database compatibility
        category_id: "1",
        slug: "information-architecture",
        short_description: "Structure, organize, and label content for optimal findability.",
        level: "Intermediate",
        icon_key: "layout",
        icon_bg_color: "#E3F2FD",
        position: 4,
        is_published: true,
        modules: [
            {
                day: "Day 1", title: "IA Fundamentals", summary: "Core concepts of information architecture.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "What is Information Architecture?", url: "https://www.youtube.com/watch?v=example11", duration: "14 min" },
                    { type: "Article", title: "IA Basics", url: "https://www.nngroup.com/articles/ia-vs-navigation/", source: "NNG" }
                ],
                task: { title: "Content Inventory", description: "Create a content inventory for any e-commerce website with at least 20 items.", deliverable: "Content Inventory Spreadsheet" }
            },
            {
                day: "Day 2", title: "Card Sorting & Tree Testing", summary: "User-centered methods for organizing information.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "Card Sorting Explained", url: "https://www.youtube.com/watch?v=example12", duration: "12 min" },
                    { type: "Article", title: "Card Sorting Guide", url: "https://www.nngroup.com/articles/card-sorting-definition/", source: "NNG" }
                ],
                task: { title: "Card Sort", description: "Conduct an open card sort with 5 participants using Optimal Workshop or physical cards.", deliverable: "Card Sort Results" }
            },
            {
                day: "Day 3", title: "Sitemaps & Navigation Design", summary: "Creating clear paths through content.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "Designing Sitemaps", url: "https://www.youtube.com/watch?v=example13", duration: "10 min" },
                    { type: "Article", title: "Navigation Design Patterns", url: "https://www.nngroup.com/articles/navigation-ia/" }
                ],
                task: { title: "Sitemap", description: "Create a visual sitemap for a university website with at least 3 levels of depth.", deliverable: "Visual Sitemap" }
            },
            {
                day: "Day 4", title: "Taxonomies & Metadata", summary: "Labeling and categorizing for scalable systems.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "Taxonomy in UX", url: "https://www.youtube.com/watch?v=example14", duration: "16 min" },
                    { type: "Article", title: "Metadata & Controlled Vocabularies", url: "https://www.nngroup.com/articles/search-and-you-may-find/" }
                ],
                task: { title: "Taxonomy Design", description: "Design a taxonomy for a recipe website with categories, tags, and filters.", deliverable: "Taxonomy Document" }
            },
            {
                day: "Day 5", title: "Search & Findability", summary: "Making information discoverable and searchable.", duration: "12 Hours",
                resources: [
                    { type: "Video", title: "Search UX Design", url: "https://www.youtube.com/watch?v=example15", duration: "20 min" },
                    { type: "Article", title: "Search Usability", url: "https://www.nngroup.com/articles/search-visible-and-simple/" }
                ],
                task: { title: "Search Design", description: "Design the search experience for an e-commerce app including filters, autocomplete, and results page.", deliverable: "Search UX Wireframes" }
            }
        ]
    },
    {
        id: "test-01",
        title: "Usability Testing Mastery",
        badge: "Expert",
        badgeColor: "from-amber-500 to-orange-600",
        totalHours: "60 Hours",
        totalDays: 4,
        description: "The complete validation toolkit: From Guerrilla Testing to Heuristic Evaluation and Formal Reporting.",
        icon: "🧪",
        // Database compatibility
        category_id: "1",
        slug: "usability-testing-mastery",
        short_description: "The complete validation toolkit: From Guerrilla Testing to Heuristic Evaluation and Formal Reporting.",
        level: "Advanced",
        icon_key: "beaker",
        icon_bg_color: "#FFF3E0",
        position: 5,
        is_published: true,
        modules: [
            { day: "Day 1", title: "1. Usability vs. Utility", summary: "It's not enough to work (Utility); it must be easy to use (Usability).", duration: "2 Hours", resources: [{ type: "Video", title: "Utility vs Usability Explained", url: "https://www.youtube.com/watch?v=1UefsA5a6kA", duration: "10 min" }, { type: "Article", title: "Introduction to Usability", url: "https://www.nngroup.com/articles/usability-101-introduction-to-usability/", source: "NN/g" }], task: { title: "Critique", description: "Find a product that has high Utility (solves a problem) but low Usability (hard to use). Write a 1-paragraph critique.", deliverable: "Product Critique" } },
            { day: "Day 1", title: "2. User Testing vs. Usability Testing", summary: "Validating the 'Idea' vs Validating the 'Interface'.", duration: "2 Hours", resources: [{ type: "Article", title: "Usability 101", url: "https://www.nngroup.com/articles/usability-101-introduction-to-usability/" }, { type: "Video", title: "Usability Testing Basics", url: "https://www.nngroup.com/videos/context-adds-value-ux-artifacts/" }], task: { title: "Test Goals", description: "Scenario: You are building a new fitness app. Write 1 question for 'User Testing' and 1 task for 'Usability Testing'.", deliverable: "Testing Goals Definition" } },
            { day: "Day 1", title: "3. Writing the Test Plan", summary: "Defining Scope, Objectives, Schedule, and Metrics.", duration: "2 Hours", resources: [{ type: "Article", title: "Usability Test Plan Template", url: "https://www.nngroup.com/articles/usability-test-plan/", source: "NN/g" }, { type: "Video", title: "How to Plan a Usability Test", url: "https://www.youtube.com/watch?v=XQZ3Z3Z3Z3Z", duration: "10 min" }], task: { title: "Test Plan Draft", description: "Draft a 1-Page Test Plan for testing the 'Checkout Flow' of Amazon. Define the Goal and 3 Success Metrics.", deliverable: "1-Page Test Plan" } },
            { day: "Day 1", title: "4. Scenarios & Tasks", summary: "Writing realistic scenarios without 'Leading' the user.", duration: "2 Hours", resources: [{ type: "Article", title: "Task Scenarios for Testing", url: "https://www.nngroup.com/articles/task-scenarios-usability-testing/" }, { type: "Video", title: "Writing Test Scripts", url: "https://www.youtube.com/watch?v=5y7H1jZ3w_I" }], task: { title: "Task Rewrite", description: "Rewrite this bad task: 'Click the red button to buy'. Convert it into a realistic Scenario (e.g., 'You want to purchase...').", deliverable: "Rewritten Scenario" } },
            { day: "Day 1", title: "5. Recruiting & Screening", summary: "Finding the right participants and filtering them.", duration: "2 Hours", resources: [{ type: "Article", title: "Recruiting for Usability Testing", url: "https://www.nngroup.com/articles/recruiting-users/", source: "NN/g" }, { type: "Video", title: "How to Recruit Users", url: "https://www.youtube.com/watch?v=XZ3Z3Z3Z3Z3", duration: "10 min" }], task: { title: "Screener Design", description: "Write a 'Screener' to find users for a 'Dog Walking App'. Ensure you filter out people who don't own dogs.", deliverable: "Screener Questionnaire" } },
            { day: "Day 2", title: "6. The 'No Budget' Mindset", summary: "Paul Boag's philosophy: Testing with anyone is better than no one.", duration: "2 Hours", resources: [{ type: "Video", title: "Guerilla Usability Testing", url: "https://www.youtube.com/watch?v=0ylnzM95sZE", duration: "5 min" }, { type: "Article", title: "The Art of Guerrilla Testing", url: "https://www.smashingmagazine.com/2014/06/the-art-of-guerrilla-usability-testing/", source: "Smashing Mag" }], task: { title: "Coffee Shop Test", description: "Go to a coffee shop (or ask a family member). Ask them to perform 1 simple task on your phone. Record friction points.", deliverable: "Test Notes" } },
            { day: "Day 2", title: "7. The 5-Second Test", summary: "Testing the 'First Impression' and clarity of value proposition.", duration: "2 Hours", resources: [{ type: "Video", title: "Running 5-Second Tests", url: "https://www.youtube.com/watch?v=0ylnzM95sZE", duration: "5 min" }, { type: "Article", title: "5-Second Test Guide", url: "https://usabilityhub.com/guides/five-second-testing", source: "UsabilityHub" }], task: { title: "5-Second Impression", description: "Show a landing page to a friend for 5 seconds. Hide it. Ask: 'What does this company do?' and 'What can you do here?'", deliverable: "Impression Notes" } },
            { day: "Day 2", title: "8. Top Tasks Analysis", summary: "Identifying the critical 5% of tasks that matter most (Gerry McGovern).", duration: "2 Hours", resources: [{ type: "Article", title: "Top Tasks Management", url: "https://alistapart.com/article/getting-started-with-top-tasks/", source: "A List Apart" }, { type: "Video", title: "Gerry McGovern on Top Tasks", url: "https://www.youtube.com/watch?v=qT_1O2O_Sbs", duration: "10 min" }], task: { title: "Top Tasks Vote", description: "List 20 potential features for a Banking App. Ask 3 people to pick their 'Top 5'. Identify the overlap.", deliverable: "Top Tasks List" } },
            { day: "Day 3", title: "9. Heuristics 1-3: System Status & Control", summary: "Visibility of System Status, Match between System & Real World, User Control.", duration: "2 Hours", resources: [{ type: "Video", title: "Heuristics 1-3 Explained", url: "https://www.youtube.com/watch?v=hWc0d0g6Z68", duration: "12 min" }, { type: "Article", title: "10 Usability Heuristics", url: "https://www.nngroup.com/articles/ten-usability-heuristics/", source: "NN/g" }], task: { title: "Heuristic Check 1-3", description: "Audit Gmail's 'Undo Send' feature. Which Heuristic does it support? Write a 1-sentence justification.", deliverable: "Heuristic Analysis Part 1" } },
            { day: "Day 3", title: "10. Heuristics 4-6: Consistency & Errors", summary: "Consistency & Standards, Error Prevention, Recognition rather than Recall.", duration: "2 Hours", resources: [{ type: "Video", title: "Heuristics 4-6 Explained", url: "https://www.youtube.com/watch?v=hWc0d0g6Z68", duration: "12 min" }, { type: "Article", title: "Error Prevention Strategies", url: "https://www.nngroup.com/articles/slips/", source: "NN/g" }], task: { title: "Heuristic Check 4-6", description: "Find a form that validates input *before* you click submit (e.g., password strength). Explain how it prevents errors.", deliverable: "Heuristic Analysis Part 2" } },
            { day: "Day 3", title: "11. Heuristics 7-10: Aesthetics & Help", summary: "Flexibility, Minimalist Design, Error Recovery, Help & Documentation.", duration: "2 Hours", resources: [{ type: "Video", title: "Heuristics 7-10 Explained", url: "https://www.youtube.com/watch?v=hWc0d0g6Z68", duration: "12 min" }, { type: "Article", title: "Aesthetic and Minimalist Design", url: "https://www.nngroup.com/articles/aesthetic-minimalist-design/", source: "NN/g" }], task: { title: "Heuristic Check 7-10", description: "Compare the Google Homepage to Yahoo. How does Google apply 'Minimalist Design'? List 3 distractions removed.", deliverable: "Heuristic Analysis Part 3" } },
            { day: "Day 3", title: "12. Conducting a Heuristic Review", summary: "How to perform a systematic audit using the 10 rules.", duration: "2 Hours", resources: [{ type: "Article", title: "How to Conduct a Heuristic Evaluation", url: "https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/", source: "NN/g" }, { type: "Video", title: "Heuristic Evaluation Demo", url: "https://www.youtube.com/watch?v=5y2g7h5y5y5", duration: "15 min" }], task: { title: "Mini-Audit", description: "Perform a 'Mini-Audit' on a flight booking site. Identify 3 violations of Nielsen's Heuristics and name them.", deliverable: "Audit Report" } },
            { day: "Day 4", title: "13. Moderating the Session", summary: "The art of silence and 'Think Aloud'.", duration: "2 Hours", resources: [{ type: "Video", title: "Moderating Usability Tests", url: "https://www.youtube.com/watch?v=6Bw-6j2a6z4", duration: "10 min" }, { type: "Article", title: "Talking with Participants", url: "https://www.nngroup.com/articles/talking-to-users/", source: "NN/g" }], task: { title: "Moderation Roleplay", description: "Roleplay: Moderate a 5-minute session with a friend. Practice speaking only when absolutely necessary.", deliverable: "Self-Reflection Notes" } },
            { day: "Day 4", title: "14. Analyzing Findings (Rainbow Sheet)", summary: "Organizing data and assigning Severity Scores.", duration: "2 Hours", resources: [{ type: "Article", title: "Severity Ratings for Problems", url: "https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/" }, { type: "Video", title: "Rating Severity", url: "https://www.nngroup.com/videos/severity-usability-problems/" }], task: { title: "Rainbow Spreadsheet", description: "Create a 'Rainbow Spreadsheet' for your session. Log 5 observations and rate their severity (1 = Cosmetic, 4 = Catastrophe).", deliverable: "Rainbow Sheet" } },
            { day: "Day 4", title: "15. The Usability Report", summary: "Writing an Executive Summary and actionable recommendations.", duration: "2 Hours", resources: [{ type: "Article", title: "Usability Test Reports", url: "https://www.nngroup.com/articles/usability-test-reports/", source: "NN/g" }, { type: "Video", title: "Presenting Findings", url: "https://www.youtube.com/watch?v=M5QjT4Th6Mw", duration: "12 min" }], task: { title: "Key Findings", description: "Write the 'Key Findings' slide for your report. Highlight the top 3 issues that need immediate fixing.", deliverable: "Key Findings Slide" } },
            { day: "Day 4", title: "16. Evaluating Navigation", summary: "Auditing Primary vs Secondary Nav and Layout width.", duration: "2 Hours", resources: [{ type: "Article", title: "Navigation IA Tests", url: "https://www.nngroup.com/articles/navigation-ia-tests/", source: "NN/g" }, { type: "Video", title: "Evaluating Navigation", url: "https://www.youtube.com/watch?v=qT_1O2O_Sbs", duration: "10 min" }], task: { title: "Menu Audit", description: "Audit a mega-menu (e.g., Amazon). Is the hierarchy clear? Does the 'Logo' link to home?", deliverable: "Audit Notes" } },
            { day: "Day 4", title: "17. Remote & Unmoderated Testing", summary: "Using tools like Maze for asynchronous testing.", duration: "2 Hours", resources: [{ type: "Article", title: "Remote Usability Testing", url: "https://www.nngroup.com/articles/live-intercept-remote-test/" }, { type: "Video", title: "Remote Moderated Tests", url: "https://www.nngroup.com/videos/remote-moderated-usability-tests/" }], task: { title: "Remote Test Setup", description: "Set up a free test on Maze/Useberry. Create one mission and share the link.", deliverable: "Test Link" } },
            { day: "Day 4", title: "18. Course Wrap-up & Project", summary: "Applying everything to a final case study.", duration: "4 Hours", resources: [{ type: "Article", title: "Writing a Usability Case Study", url: "https://uxdesign.cc/how-to-write-a-usability-testing-case-study-6587c6c40608", source: "UX Collective" }, { type: "Video", title: "Portfolio Case Study Review", url: "https://www.youtube.com/watch?v=v=v=v=v", duration: "15 min" }], task: { title: "Final Case Study", description: "Final Project: Compile a full Usability Report (Plan + Script + findings + Recommendations) for a product of your choice.", deliverable: "Full Usability Report" } }
        ]
    },
    {
        id: "data-01",
        title: "UX Analytics & Tracking",
        badge: "Data Driven",
        badgeColor: "from-cyan-500 to-blue-600",
        totalHours: "15 Hours",
        totalDays: 2,
        description: "Understanding the numbers behind the design. Tracking user behavior and making data-informed decisions.",
        icon: "📊",
        // Database compatibility
        category_id: "1",
        slug: "ux-analytics-tracking",
        short_description: "Understanding the numbers behind the design. Tracking user behavior and making data-informed decisions.",
        level: "Intermediate",
        icon_key: "bar-chart",
        icon_bg_color: "#E1F5FE",
        position: 6,
        is_published: true,
        modules: [
            { day: "Day 1", title: "1. Vanity vs. Actionable Metrics", summary: "Why 'Page Views' don't matter, and what actually drives decisions.", duration: "2 Hours", resources: [{ type: "Video", title: "Vanity Metrics vs Actionable Metrics", url: "https://www.youtube.com/watch?v=yYJ4hL9jX_o", duration: "8 min" }, { type: "Article", title: "The Guide to Product Metrics", url: "https://mixpanel.com/blog/product-metrics/", source: "Mixpanel" }], task: { title: "Metric Audit", description: "Audit: Look at a dashboard (or imagine one). Identify 1 'Vanity Metric' to ignore and 1 'Actionable Metric' to track.", deliverable: "Audit Notes" } },
            { day: "Day 1", title: "2. The Google HEART Framework", summary: "Happiness, Engagement, Adoption, Retention, Task Success.", duration: "2 Hours", resources: [{ type: "Article", title: "Google's HEART Framework", url: "https://www.dtelepathy.com/blog/design/ux-metrics-heart-method", source: "D.Telepathy" }, { type: "Video", title: "HEART Framework Explained", url: "https://www.youtube.com/watch?v=L4NWDxL3Z-M", duration: "10 min" }], task: { title: "HEART Application", description: "Apply HEART: Define 1 Goal, 1 Signal, and 1 Metric for the 'Engagement' category of a Music Streaming App.", deliverable: "HEART Table" } },
            { day: "Day 1", title: "3. KPIs & ROI of Design", summary: "Translating UX improvements into Business Value ($$$).", duration: "2 Hours", resources: [{ type: "Video", title: "The ROI of User Experience", url: "https://www.youtube.com/watch?v=O94kYXFNU_A", duration: "12 min" }, { type: "Article", title: "Calculating ROI of UX", url: "https://www.nngroup.com/articles/roi-ux/", source: "NN/g" }], task: { title: "ROI Calculation", description: "Calculation: If a UX fix increases conversion by 1% and the site makes $1M/year, how much extra revenue did you generate?", deliverable: "ROI Calculation" } },
            { day: "Day 2", title: "4. Heatmaps Analysis", summary: "Click, Move, and Scroll maps. Seeing where users actually look.", duration: "2 Hours", resources: [{ type: "Video", title: "How to Analyze Heatmaps", url: "https://www.youtube.com/watch?v=7X8X8X8X8X8", duration: "8 min" }, { type: "Article", title: "8 Heatmap Case Studies", url: "https://www.hotjar.com/heatmaps/examples/", source: "Hotjar" }], task: { title: "Heatmap Analysis", description: "Analysis: Look at a sample 'Scroll Map'. If only 20% of users reach the footer, where should you move the 'Contact Us' button?", deliverable: "Analysis Note" } },
            { day: "Day 2", title: "5. Session Recordings", summary: "Watching users interact with your product like a movie.", duration: "2 Hours", resources: [{ type: "Video", title: "Watching Session Recordings", url: "https://www.youtube.com/watch?v=4J4X4X4X4X4", duration: "10 min" }, { type: "Article", title: "How to Analyze Recordings", url: "https://www.hotjar.com/session-recordings/", source: "Hotjar" }], task: { title: "Recording Observation", description: "Observation: Watch 3 session recordings (use a demo account if needed). Identify one 'Rage Click' moment where the user got frustrated.", deliverable: "Observation Log" } },
            { day: "Day 2", title: "6. Google Analytics 4 (GA4) Basics", summary: "Users, Sessions, Events, and Conversions.", duration: "2 Hours", resources: [{ type: "Video", title: "GA4 for UX Designers", url: "https://www.youtube.com/watch?v=zn7nO-D3f-k", duration: "15 min" }, { type: "Article", title: "GA4 Guide for Designers", url: "https://uxdesign.cc/google-analytics-4-for-ux-designers-123456", source: "UX Collective" }], task: { title: "GA4 Definitions", description: "Definitions: Explain the difference between a 'User' and a 'Session' in 1 sentence each.", deliverable: "Definitions" } },
            { day: "Day 2", title: "7. Conversion Funnels", summary: "Visualizing drop-off rates step-by-step.", duration: "2 Hours", resources: [{ type: "Video", title: "Funnel Analysis Explained", url: "https://www.youtube.com/watch?v=ReM1uqmVfP0", duration: "10 min" }, { type: "Article", title: "Funnels in UX Design", url: "https://www.nngroup.com/articles/funnel-visualization/", source: "NN/g" }], task: { title: "Funnel Sketch", description: "Draw a Funnel: Sketch the 'Checkout Funnel' (Cart -> Address -> Payment -> Success). Estimate the % drop-off at each step.", deliverable: "Funnel Diagram" } },
            { day: "Day 2", title: "8. A/B Testing Fundamentals", summary: "Validating design changes with statistical significance.", duration: "2 Hours", resources: [{ type: "Article", title: "A/B Testing Guide", url: "https://www.optimizely.com/optimization-glossary/ab-testing/", source: "Optimizely" }, { type: "Video", title: "When to use A/B Testing", url: "https://www.youtube.com/watch?v=0ZNdDoHKDdQ", duration: "8 min" }], task: { title: "A/B Hypothesis", description: "Hypothesis: Write an A/B Test Hypothesis (e.g., 'Changing the button color from Gray to Green will increase clicks by 10%').", deliverable: "Test Hypothesis" } }
        ]
    },
    {
        id: "agile-01",
        title: "Agile for UX Designers",
        badge: "Management",
        badgeColor: "from-blue-700 to-indigo-800",
        totalHours: "30 Hours",
        totalDays: 4,
        description: "Surviving and thriving in Agile environments. Scrum, Kanban, User Stories, and Dual Track Agile.",
        icon: "🔄",
        modules: [
            { day: "Day 1", title: "1. Agile vs. Waterfall", summary: "Why we stopped building software like factories. The Agile Manifesto.", duration: "3 Hours", resources: [{ type: "Video", title: "Agile Product Ownership in a Nutshell", url: "https://www.youtube.com/watch?v=502ILHjX9EE", duration: "15 min" }, { type: "Article", title: "Agile UX: The Complete Guide", url: "https://www.nngroup.com/articles/agile-ux-updates/", source: "NN/g" }], task: { title: "Process Reflection", description: "Reflection: Compare a past project (or imagine one). How would 'shipping every 2 weeks' change your design decisions compared to 'shipping after 6 months'?", deliverable: "Reflection Note" } },
            { day: "Day 1", title: "2. The Scrum Framework", summary: "Understanding the Rituals: Standup, Planning, Review, and Retro.", duration: "3 Hours", resources: [{ type: "Article", title: "Scrum Events Guide", url: "https://www.atlassian.com/agile/scrum/ceremonies", source: "Atlassian" }, { type: "Video", title: "Scrum Guide Visualized", url: "https://www.youtube.com/watch?v=TRcReyRYIMg", duration: "10 min" }], task: { title: "Standup Sim", description: "Simulation: Record a 1-minute video for a 'Daily Standup'. Answer: 1. What did you do yesterday? 2. What will you do today? 3. Any blockers?", deliverable: "Video/Script" } },
            { day: "Day 2", title: "3. Integrating UX in Scrum (The Struggle)", summary: "How to fit 'Big Picture' design into 'Small Sprints'.", duration: "2 Hours", resources: [{ type: "Article", title: "UXers as Product Leaders", url: "https://www.nngroup.com/articles/fuego-product-leaders/" }, { type: "Video", title: "Successful Projects Collaboration", url: "https://www.nngroup.com/videos/7-steps-collaboration/" }], task: { title: "Staggered Sprints", description: "Strategy: Create a timeline showing 'Sprint N' (Devs building login) and 'Sprint N+1' (Designers researching Dashboard). This is 'Staggered Sprints'.", deliverable: "Timeline Visual" } },
            { day: "Day 2", title: "4. Writing User Stories", summary: "The currency of Agile. 'As a [User], I want [Action], so that [Benefit]'.", duration: "3 Hours", resources: [{ type: "Article", title: "How to Write User Stories", url: "https://uxdesign.cc/how-to-write-a-good-user-story-practical-approach-b9bed439f97d" }, { type: "Video", title: "Story of User Stories", url: "https://www.youtube.com/watch?v=5y7H1jZ3w_I" }], task: { title: "User Story Authoring", description: "Write: Convert this feature request: 'We need a search bar' into a User Story. Add 3 'Acceptance Criteria' (e.g., 'Must handle typos').", deliverable: "User Story Card" } },
            { day: "Day 3", title: "5. Dual Track Agile", summary: "Separating 'Discovery' (Research) from 'Delivery' (Coding).", duration: "2 Hours", resources: [{ type: "Article", title: "Dual Track Agile Explained", url: "https://www.svpg.com/dual-track-agile/", source: "Marty Cagan" }, { type: "Video", title: "Discovery vs Delivery", url: "https://www.youtube.com/watch?v=DualTrack", duration: "10 min" }], task: { title: "Track Separation", description: "Diagram: Draw two parallel tracks. Track 1: Interviewing users about 'Payment'. Track 2: Devs building the 'Cart' designed last week.", deliverable: "Dual Track Diagram" } },
            { day: "Day 3", title: "6. Estimation & Story Points", summary: "How teams guess effort. Why Design is hard to estimate.", duration: "2 Hours", resources: [{ type: "Video", title: "Story Points vs Hours", url: "https://www.youtube.com/watch?v=StoryPoints", duration: "8 min" }, { type: "Article", title: "Estimating Design Work", url: "https://www.nngroup.com/articles/estimating-ux-work/", source: "NN/g" }], task: { title: "Planning Poker", description: "Poker: Assign Fibonacci points (1, 2, 3, 5, 8) to these tasks: 1. Change Button Color. 2. Redesign Checkout Flow. Justify the complexity.", deliverable: "Estimation Log" } },
            { day: "Day 4", title: "7. The Definition of Done (DoD)", summary: "When is a design 'Finished'? No more 'Just one small tweak'.", duration: "2 Hours", resources: [{ type: "Article", title: "Definition of Done for UX", url: "https://www.scrum.org/resources/blog/definition-done-ux", source: "Scrum.org" }, { type: "Video", title: "DoD vs Acceptance Criteria", url: "https://www.youtube.com/watch?v=DoDVideo", duration: "10 min" }], task: { title: "DoD Checklist", description: "Checklist: Create a 'Design DoD' checklist. (e.g., 1. Mobile & Desktop mockups ready? 2. Assets exported? 3. Accessibility checked?).", deliverable: "Checklist" } },
            { day: "Day 4", title: "8. Design Sprints (Google Ventures)", summary: "Solving big problems in 5 days. Map, Sketch, Decide, Prototype, Test.", duration: "3 Hours", resources: [{ type: "Video", title: "The Design Sprint in 90 Seconds", url: "https://www.youtube.com/watch?v=K2vSQPh6MHCQ", duration: "2 min" }, { type: "Article", title: "The Design Sprint Guide", url: "https://www.gv.com/sprint/", source: "GV" }], task: { title: "Sprint Plan", description: "Plan: You have a 5-day sprint for a new feature. Assign a specific goal for Monday (Map), Wednesday (Decide), and Friday (Test).", deliverable: "Sprint Agenda" } }
        ]
    },
    {
        id: "ba-ux-01",
        title: "Integration: BA & UX",
        badge: "Collaboration",
        badgeColor: "from-lime-500 to-green-600",
        totalHours: "20 Hours",
        totalDays: 4,
        description: "Aligning Business Goals with User Needs. From BRD to Wireframes.",
        icon: "🤝",
        modules: [
            { day: "Day 1", title: "1. The Overlap: BA vs UX", summary: "Who does what? Where Requirements meet Empathy.", duration: "3 Hours", resources: [{ type: "Article", title: "UX & BA Collaboration", url: "https://www.nngroup.com/articles/ux-deliverables-collaboration/" }, { type: "Video", title: "Better Collaboration", url: "https://www.nngroup.com/videos/7-steps-collaboration/" }], task: { title: "Roles Venn Diagram", description: "Venn Diagram: Draw two circles (BA & UX). List 3 tasks unique to each, and 3 tasks they share (e.g., User Research, Prototyping).", deliverable: "Diagram" } },
            { day: "Day 1", title: "2. Translating Requirements (BRD to Design)", summary: "How to read a Business Requirement Document (BRD) without falling asleep.", duration: "3 Hours", resources: [{ type: "Article", title: "From Requirements to Wireframes", url: "https://uxdesign.cc/from-requirements-to-wireframes-55555", source: "UX Design" }, { type: "Video", title: "Reading a PRD for Designers", url: "https://www.youtube.com/watch?v=PRDVideo", duration: "10 min" }], task: { title: "Req Translation", description: "Translation: Take this Requirement: 'System must validate age > 18'. Turn it into a UI Sketch (Date Picker + Error Message).", deliverable: "UI Sketch" } },
            { day: "Day 2", title: "3. User Story Mapping (The Joint Activity)", summary: "The best workshop for BAs and UXers to do together.", duration: "3 Hours", resources: [{ type: "Video", title: "User Story Mapping with Jeff Patton", url: "https://www.youtube.com/watch?v=UserStoryMap", duration: "10 min" }, { type: "Article", title: "Guide to User Story Mapping", url: "https://www.nngroup.com/articles/user-story-mapping/", source: "NN/g" }], task: { title: "Story Map", description: "Workshop: Create a User Story Map for an 'Email App'. Top layer: User Activities (Compose, Read). Bottom layer: Details (Attach file, Reply all).", deliverable: "Map Visualization" } },
            { day: "Day 2", title: "4. Process Flows vs. User Journeys", summary: "BPMN (Business Logic) vs CJM (User Emotion). Merging them via Service Blueprints.", duration: "3 Hours", resources: [{ type: "Article", title: "Service Blueprints: The Bridge", url: "https://www.nngroup.com/articles/service-blueprints-definition/", source: "NN/g" }, { type: "Video", title: "Process Mapping for UX", url: "https://www.youtube.com/watch?v=ProcessMap", duration: "10 min" }], task: { title: "Blueprint Creation", description: "Blueprint: Map the 'Pizza Order' process. Line of Interaction: What the user sees. Line of Visibility: What the kitchen (Backend) does.", deliverable: "Service Blueprint" } },
            { day: "Day 3", title: "5. Data-Driven Design Decisions", summary: "Using BA data (Conversion Rates, Churn) to justify UX improvements.", duration: "2 Hours", resources: [{ type: "Video", title: "Using Data to Persuade Stakeholders", url: "https://www.youtube.com/watch?v=DataUX", duration: "10 min" }, { type: "Article", title: "Analytics for UX Designers", url: "https://www.nngroup.com/articles/analytics-user-experience/", source: "NN/g" }], task: { title: "Data Hypothesis", description: "Case: The BA says 'Registration is dropping by 20%'. As a UXer, hypothesize 3 design reasons why (e.g., Form too long, No social login).", deliverable: "Hypothesis List" } },
            { day: "Day 3", title: "6. Handling Constraints (Technical & Business)", summary: "When the BA says 'We can't build that'. Negotiation skills.", duration: "2 Hours", resources: [{ type: "Article", title: "Designing with Constraints", url: "https://uxplanet.org/designing-with-constraints-55555", source: "UX Planet" }, { type: "Video", title: "Negotiating with Stakeholders", url: "https://www.youtube.com/watch?v=Negotiation", duration: "10 min" }], task: { title: "Negotiation Roleplay", description: "Roleplay: You designed a fancy animated dashboard. The BA says 'Too expensive to build'. Propose a 'Phase 1' (MVP) version.", deliverable: "MVP Proposal" } },
            { day: "Day 4", title: "7. The Feedback Loop", summary: "Validating designs against requirements BEFORE development.", duration: "2 Hours", resources: [{ type: "Video", title: "Design Reviews with BAs", url: "https://www.youtube.com/watch?v=DesignReview", duration: "8 min" }, { type: "Article", title: "Acceptance Criteria for Design", url: "https://www.scrum.org/resources/blog/acceptance-criteria-ux", source: "Scrum.org" }], task: { title: "Review checklist", description: "Checklist: Create a 'Design Review Checklist' for the BA. (e.g., 'Does this screen cover the Edge Case of a banned user?').", deliverable: "QA Checklist" } },
            { day: "Day 4", title: "8. Documentation Handoff", summary: "Combining UI Specs with Functional Specs.", duration: "2 Hours", resources: [{ type: "Article", title: "Functional Specifications vs UX Specs", url: "https://uxdesign.cc/functional-specs-vs-ux-specs-55555", source: "UX Design" }, { type: "Video", title: "Documenting Interactions", url: "https://www.youtube.com/watch?v=DocUX", duration: "12 min" }], task: { title: "Feature Spec", description: "Project: Create a 'Feature Spec' page in Figma. Place the UI on the left, and the BA's logic rules (e.g., 'If x > 5, show error') on the right.", deliverable: "Spec Page" } }
        ]
    },
    {
        id: "ai-design-01",
        title: "Embracing AI in UI/UX in 2026",
        badge: "Future Skills",
        badgeColor: "from-purple-600 to-pink-600",
        totalHours: "30 Hours",
        totalDays: 4,
        description: "The ultimate guide to AI tools. From Synthetic Research to Generative UI and Automated Testing.",
        icon: "🤖",
        modules: [
            { day: "Day 1", title: "1. Prompt Engineering for UX Research", summary: "Stop asking basic questions. Using 'Chain of Thought' prompting to build Personas and User Journeys.", duration: "3 Hours", resources: [{ type: "Article", title: "AI for UX: Getting Started", url: "https://www.nngroup.com/articles/ai-ux-getting-started/" }, { type: "Video", title: "Your AI UX Intern", url: "https://www.youtube.com/watch?v=wmCXIPlllpA" }], task: { title: "Persona Gen", description: "Prompting: Use ChatGPT to act as a 'Senior UX Researcher'. Ask it to generate a detailed 'User Journey Map' for a Fintech app user who doesn't trust digital banking. Export the data to a table.", deliverable: "AI Research Log" } },
            { day: "Day 1", title: "2. Synthetic Users & Competitive Analysis", summary: "Simulating user feedback before you have users. Analyzing competitors instantly.", duration: "2 Hours", resources: [{ type: "Article", title: "Using AI for UX Work", url: "https://www.nngroup.com/articles/ai-work-study-guide/" }, { type: "Video", title: "AI in Research Analysis", url: "https://www.youtube.com/watch?v=wmCXIPlllpA" }], task: { title: "AI SWOT", description: "Analysis: Copy the text from 3 competitor websites. Paste it into an AI tool (Claude/ChatGPT) and ask for a 'SWOT Analysis' comparing their Value Propositions.", deliverable: "SWOT Table" } },
            { day: "Day 2", title: "3. AI-Powered Information Architecture (Relume)", summary: "Generating Sitemaps and Wireframes in seconds, not days.", duration: "2 Hours", resources: [{ type: "Video", title: "Relume Library AI Workflow", url: "https://www.youtube.com/watch?v=RelumeAI", duration: "8 min" }, { type: "Article", title: "AI for Information Architecture", url: "https://medium.com/relume-ai-sitemaps", source: "Relume Blog" }], task: { title: "Relume Speed Run", description: "Build: Use 'Relume AI' (or similar) to generate a Sitemap for a 'Real Estate Platform'. Convert that sitemap into a Wireframe inside Figma automatically.", deliverable: "Auto-Wireframe" } },
            { day: "Day 2", title: "4. Text-to-UI (Galileo & Uizard)", summary: "Generating high-fidelity screens from text descriptions. The end of the blank canvas.", duration: "3 Hours", resources: [{ type: "Video", title: "Galileo AI Demo & Best Practices", url: "https://www.youtube.com/watch?v=GalileoAI", duration: "10 min" }, { type: "Article", title: "The State of Generative UI", url: "https://uxplanet.org/generative-ui-tools-review-55555", source: "UX Planet" }], task: { title: "GenUI Critique", description: "Generate: Use Galileo AI (or Uizard) to generate a 'Dashboard for a Crypto Wallet'. Critique the result: What did the AI get right? What did it fail at?", deliverable: "Critique Notes" } },
            { day: "Day 3", title: "5. Midjourney for UI Inspiration", summary: "Creating moodboards and wild concepts. Parameters (--v 6, --ar 16:9).", duration: "3 Hours", resources: [{ type: "Article", title: "Midjourney for UI Designers", url: "https://uxdesign.cc/midjourney-for-ui-design-55555", source: "UX Design" }, { type: "Video", title: "Advanced Midjourney Prompting", url: "https://www.youtube.com/watch?v=bAqvK29t7z0", duration: "15 min" }], task: { title: "AI Moodboard", description: "Moodboard: Generate 4 distinct UI styles for a 'Meditation App' using Midjourney. One 'Minimalist', one 'Cyberpunk', one 'Nature-inspired'. Use these as a moodboard.", deliverable: "Inspiration Board" } },
            { day: "Day 3", title: "6. Adobe Firefly & Generative Fill", summary: "Editing images inside the design. Expanding backgrounds and generating vectors.", duration: "2 Hours", resources: [{ type: "Video", title: "Adobe Firefly in Workflow", url: "https://www.youtube.com/watch?v=FireflyTips", duration: "8 min" }, { type: "Article", title: "Generative Fill for Web Design", url: "https://helpx.adobe.com/photoshop/using/generative-fill.html", source: "Adobe" }], task: { title: "Gen Fill Fix", description: "Edit: Take a hero image that is too small. Use 'Generative Expand' to widen it to fit a desktop screen without stretching.", deliverable: "Expanded Asset" } },
            { day: "Day 4", title: "7. AI for Design Systems & Tokens", summary: "Automating the boring stuff. Generating color palettes and naming tokens.", duration: "2 Hours", resources: [{ type: "Video", title: "AI in Design Systems", url: "https://www.youtube.com/watch?v=DesignSystemsAI", duration: "10 min" }, { type: "Article", title: "Using Khroma for Color Palettes", url: "https://www.khroma.co/about", source: "Khroma" }], task: { title: "Auto-Tokens", description: "System: Use 'Khroma' (AI Color tool) to generate an accessible color palette. Ask ChatGPT to write the documentation for how to use the 'Secondary Color'.", deliverable: "AI Docs" } },
            { day: "Day 4", title: "8. Figma AI Plugins (Magician & More)", summary: "Magic inside Figma. Generating icons, copy, and images on the fly.", duration: "2 Hours", resources: [{ type: "Video", title: "Top 5 AI Plugins for Figma", url: "https://www.youtube.com/watch?v=FigmaPluginsAI", duration: "8 min" }, { type: "Article", title: "Magician Plugin Guide", url: "https://magician.design/", source: "Magician" }], task: { title: "Plugin Speed Run", description: "Speed Run: Design a 'Login Card'. Use 'Magician' to generate the icon, the copy text, and a unique background pattern.", deliverable: "Instant UI" } },
            { day: "Day 4", title: "9. Predictive Eye Tracking (Attention Insight)", summary: "Testing usability without users. Predicting heatmaps.", duration: "2 Hours", resources: [{ type: "Article", title: "Predictive Eye Tracking Validity", url: "https://www.attentioninsight.com/validity/", source: "AttentionInsight" }, { type: "Video", title: "How Attention Insight Works", url: "https://www.youtube.com/watch?v=bAqvK29t7z0", duration: "5 min" }], task: { title: "AI Audit", description: "Audit: Upload your design to an AI Heatmap tool (like Attention Insight or a free alternative). Does the AI look at the CTA button? If not, redesign it.", deliverable: "Heatmap Report" } },
            { day: "Day 4", title: "10. The Ethics of AI in Design", summary: "Bias, Copyright, and the 'Human in the Loop'. Will AI replace us?", duration: "2 Hours", resources: [{ type: "Video", title: "AI Will Not Replace You", url: "https://www.youtube.com/watch?v=FutureOfDesign", duration: "15 min" }, { type: "Article", title: "Ethics of Generative AI", url: "https://www.nngroup.com/articles/ai-design-ethics/", source: "NN/g" }], task: { title: "Ethics Essay", description: "Essay: Write a 1-paragraph stance on 'AI Disclosure'. Should we tell users when an interface was designed by AI? Why or why not?", deliverable: "Position Statement" } },
            { day: "Bonus Module", title: "Designing for AI", summary: "Supplemental resources added via update.", duration: "Self-paced", resources: [{ type: "Article", title: "Trust with AI", url: "https://www.nngroup.com/articles/smarts-emotion-trust-ai/" }, { type: "Video", title: "Machine Learning UX", url: "https://www.nngroup.com/articles/machine-learning-ux/" }], task: { title: "Review", description: "Review the attached resources.", deliverable: "N/A" } }
        ]
    },
    {
        id: "ai-dt-01",
        title: "AI Design Thinking Workshop",
        badge: "Methodology",
        badgeColor: "from-violet-500 to-purple-600",
        totalHours: "20 Hours",
        totalDays: 4,
        description: "Reinventing the Double Diamond. How to co-create with AI to solve complex problems faster.",
        icon: "💡",
        modules: [
            { day: "Day 1", title: "1. AI-Empowered Empathy", summary: "Using NLP to analyze thousands of user reviews instantly. Beyond manual coding.", duration: "3 Hours", resources: [{ type: "Article", title: "AI for User Research Analysis", url: "https://www.nngroup.com/articles/ai-user-research-analysis/", source: "NN/g" }, { type: "Video", title: "Synthesizing Data with AI", url: "https://www.youtube.com/watch?v=AIResearchData", duration: "10 min" }], task: { title: "Sentiment Analysis", description: "Workshop: Upload a CSV of 500 App Store reviews to ChatGPT (Code Interpreter). Ask it to 'Identify the top 3 emotional pain points' and visualize them in a chart.", deliverable: "Sentiment Report" } },
            { day: "Day 1", title: "2. Reframing the Problem with LLMs", summary: "Generating 'How Might We' (HMW) questions to widen the scope.", duration: "3 Hours", resources: [{ type: "Article", title: "Reframing Problems with AI", url: "https://hbr.org/2023/04/how-generative-ai-can-augment-human-creativity", source: "HBR" }, { type: "Video", title: "The Art of HMW Questions", url: "https://www.youtube.com/watch?v=HMWVideo", duration: "8 min" }], task: { title: "HMW Generator", description: "Activity: Feed a problem statement to Claude 2 (e.g., 'Users hate waiting'). Ask it to generate 10 radical 'How Might We' questions using the 'SCAMPER' technique.", deliverable: "HMW List" } },
            { day: "Day 2", title: "3. Divergent Thinking with AI", summary: "Brainstorming 100 ideas in 10 minutes. Overcoming 'Designer's Block'.", duration: "2 Hours", resources: [{ type: "Video", title: "Brainstorming with ChatGPT", url: "https://www.youtube.com/watch?v=IdeationAI", duration: "10 min" }, { type: "Article", title: "Generative AI for Ideation", url: "https://www.boardofinnovation.com/blog/ai-in-design-thinking/", source: "Board of Innovation" }], task: { title: "Crazy 8s AI", description: "Mash-up: Use the 'Random Word' technique with AI. Ask AI to combine 'Banking App' with 'Tinder Interface'. What crazy ideas come out?", deliverable: "Idea Sketch" } },
            { day: "Day 2", title: "4. Storyboarding with Midjourney", summary: "Visualizing the 'Future State' scenario without drawing skills.", duration: "2 Hours", resources: [{ type: "Article", title: "Storyboarding with Generative AI", url: "https://uxdesign.cc/storyboarding-with-ai-55555", source: "UX Design" }, { type: "Video", title: "Midjourney for Storytelling", url: "https://www.youtube.com/watch?v=MidjourneyStory", duration: "15 min" }], task: { title: "Storyboard Gen", description: "Visual Narrative: Generate a 4-panel storyboard showing a user solving their problem using your new idea. Use consistent characters.", deliverable: "Storyboard" } },
            { day: "Day 3", title: "5. The 'Wizard of Oz' Prototype", summary: "Faking complex AI features using simple tools to test demand.", duration: "3 Hours", resources: [{ type: "Video", title: "Wizard of Oz Prototyping", url: "https://www.youtube.com/watch?v=WizardOfOz", duration: "10 min" }, { type: "Article", title: "Prototyping AI Experiences", url: "https://alistapart.com/article/prototyping-ai/", source: "A List Apart" }], task: { title: "WoZ Simulation", description: "Build: Create a 'Fake AI Chatbot' in Figma. Manually type the responses during a user test to simulate a super-smart AI.", deliverable: "Prototype Record" } },
            { day: "Day 3", title: "6. AI-Simulated User Testing", summary: "Using 'Synthetic Personas' to critique your solution before humans see it.", duration: "2 Hours", resources: [{ type: "Article", title: "Synthetic Users: Pros & Cons", url: "https://www.nngroup.com/articles/synthetic-users/", source: "NN/g" }, { type: "Video", title: "Simulating Feedback with AI", url: "https://www.youtube.com/watch?v=SyntheticFeedback", duration: "10 min" }], task: { title: "Synthetic Critique", description: "Critique: Show your value proposition to ChatGPT acting as 'A skeptical 60-year-old user'. Ask it to list 3 reasons why it wouldn't use your product.", deliverable: "Feedback Log" } },
            { day: "Day 4", title: "7. Responsible AI Design", summary: "Bias, Hallucinations, and the 'Black Box' problem.", duration: "2 Hours", resources: [{ type: "Video", title: "Human-Centered AI Guidelines (Google)", url: "https://www.youtube.com/watch?v=PAIRGuide", duration: "15 min" }, { type: "Article", title: "Microsoft HAX Toolkit", url: "https://www.microsoft.com/en-us/haxtoolkit/", source: "Microsoft" }], task: { title: "Risk Audit", description: "Audit: Review your AI-generated ideas. Do they exclude any demographic? Are they relying on biased training data? Write a 'Risk Assessment'.", deliverable: "Audit Report" } }
        ]
    }
];
