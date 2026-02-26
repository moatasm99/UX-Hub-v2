import type { Course } from '../types';

// ============================================
// Category 4: Development for Designers Courses
// 1 course in EXACT original order
// ============================================
export const CATEGORY_FOUR_COURSES: Course[] = [
    {
        id: "frontend-01",
        title: "Creative Front-End & Low-Code",
        badge: "Technical Skills",
        badgeColor: "from-fuchsia-500 to-purple-600",
        totalHours: "45 Hours",
        totalDays: 4,
        description: "Bridging the gap. Mastering the code concepts behind Figma (HTML/CSS) and building live sites with Low-Code tools.",
        icon: "🎨",
        // Database compatibility
        short_description: "Bridging the gap. Mastering the code concepts behind Figma (HTML/CSS) and building live sites with Low-Code tools.",
        level: "Intermediate",
        icon_key: "code",
        icon_bg_color: "#F3E5F5",
        is_published: true,
        category_id: "4",
        slug: "creative-front-end-low-code",
        position: 1,
        modules: [
            // PART 1: THE SKELETON (HTML5 & SEMANTICS)
            {
                day: "Day 1",
                title: "1. HTML5: Thinking in Boxes",
                summary: "It's not just text. It's a tree structure (DOM). Semantic tags for Accessibility.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "HTML Basics for Designers", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics", source: "MDN" },
                    { type: "Video", title: "Semantic HTML Explained", url: "https://www.youtube.com/watch?v=kCwNqRBZjuM", duration: "10 min" }
                ],
                task: {
                    title: "Semantics Code",
                    description: "Code: Write a simple HTML page using correct semantic tags: <header>, <nav>, <main>, <article>, and <footer>. No DIV soup!",
                    deliverable: "HTML File"
                }
            },
            {
                day: "Day 1",
                title: "2. Accessibility in Code (ARIA)",
                summary: "Why Alt text and Aria-Labels matter. How screen readers see your code.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Web Accessibility for Designers", url: "https://www.youtube.com/watch?v=20SHvU2PKsM", duration: "10 min" },
                    { type: "Article", title: "Intro to ARIA", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA", source: "MDN" }
                ],
                task: {
                    title: "ARIA Audit",
                    description: "Audit: Use the Chrome Inspector on a popular site. Find a button with an 'aria-label' and explain why it's there.",
                    deliverable: "Audit Note"
                }
            },
            // PART 2: THE STYLING (CSS3 & LAYOUT)
            {
                day: "Day 2",
                title: "3. The Box Model (Padding vs Margin)",
                summary: "The physics of the web. Understanding Border-Box vs Content-Box.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "The CSS Box Model", url: "https://web.dev/learn/css/box-model/", source: "web.dev" },
                    { type: "Video", title: "Box Model Explained", url: "https://www.youtube.com/watch?v=rIO5326GpQ", duration: "8 min" }
                ],
                task: {
                    title: "Box Experiment",
                    description: "Experiment: Open CodePen. Create two boxes. Give one 'Padding' and the other 'Margin'. See how they push against each other differently.",
                    deliverable: "CodePen Link"
                }
            },
            {
                day: "Day 2",
                title: "4. Flexbox & Grid (The Real Auto Layout)",
                summary: "How Figma's Auto Layout actually works in the browser. 1D vs 2D layouts.",
                duration: "3 Hours",
                resources: [
                    { type: "Article", title: "A Complete Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", source: "CSS-Tricks" },
                    { type: "Video", title: "CSS Grid vs Flexbox", url: "https://www.youtube.com/watch?v=hs3piaN4b5I", duration: "12 min" }
                ],
                task: {
                    title: "CSS Layout",
                    description: "Recreate: Take a Figma Auto Layout card. Recreate it exactly in CSS using `display: flex`, `gap`, and `align-items`.",
                    deliverable: "CSS File"
                }
            },
            {
                day: "Day 2",
                title: "5. CSS Variables (Design Tokens)",
                summary: "Connecting your Figma Variables to CSS Custom Properties.",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "CSS Variables Tutorial", url: "https://www.youtube.com/watch?v=PHO6TbL-EDg", duration: "10 min" },
                    { type: "Article", title: "Using CSS Custom Properties", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties", source: "MDN" }
                ],
                task: {
                    title: "Token System",
                    description: "System: Define your brand colors in CSS :root (e.g., --primary-color: #0000FF). Use this variable to style a button.",
                    deliverable: "CSS Tokens"
                }
            },
            // PART 3: FRAMEWORKS & LOGIC (BOOTSTRAP & JS)
            {
                day: "Day 3",
                title: "6. Bootstrap & Tailwind (Frameworks)",
                summary: "Why developers use frameworks. The 12-column grid in code.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "Bootstrap Grid System", url: "https://getbootstrap.com/docs/5.3/layout/grid/", source: "Bootstrap" },
                    { type: "Video", title: "Tailwind CSS for Designers", url: "https://www.youtube.com/watch?v=_9mTJ84uL1Q", duration: "15 min" }
                ],
                task: {
                    title: "Bootstrap Comp",
                    description: "Build: Copy a Bootstrap 'Navbar' component code. Paste it into your project. Change the colors to match your brand.",
                    deliverable: "Modded Code"
                }
            },
            {
                day: "Day 3",
                title: "7. JavaScript Interactions (Basics)",
                summary: "Adding life. Class toggling (Dark Mode) and basic click events.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "JavaScript for Designers", url: "https://www.youtube.com/watch?v=JSforDesigners", duration: "20 min" },
                    { type: "Article", title: "DOM Manipulation Guide", url: "https://www.freecodecamp.org/news/what-is-the-dom-document-object-model-meaning-in-javascript/", source: "freeCodeCamp" }
                ],
                task: {
                    title: "JS Interaction",
                    description: "Interact: Write a simple JS script: When the user clicks a button, add the class '.dark-mode' to the body tag.",
                    deliverable: "JS Script"
                }
            },
            // PART 4: LOW-CODE REVOLUTION (WEBFLOW)
            {
                day: "Day 3",
                title: "8. Intro to Webflow (Visual Coding)",
                summary: "Writing HTML/CSS visually. The interface mapping (Navigator = DOM, Style Panel = CSS).",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Webflow 101 Crash Course", url: "https://university.webflow.com/courses/webflow-101", duration: "30 min" },
                    { type: "Article", title: "From Figma to Webflow", url: "https://university.webflow.com/lesson/figma-to-webflow", source: "Webflow Univ" }
                ],
                task: {
                    title: "Webflow Hero",
                    description: "Setup: Create a free Webflow account. Build a simple Hero Section using Containers, Divs, and Headings.",
                    deliverable: "Webflow Link"
                }
            },
            {
                day: "Day 3",
                title: "9. Responsive Design in Webflow",
                summary: "Handling Breakpoints visually. Cascading styles (Desktop -> Tablet -> Mobile).",
                duration: "2 Hours",
                resources: [
                    { type: "Video", title: "Webflow Breakpoints", url: "https://university.webflow.com/lesson/breakpoints", duration: "10 min" },
                    { type: "Article", title: "Responsive Design Best Practices", url: "https://webflow.com/blog/responsive-web-design", source: "Webflow Blog" }
                ],
                task: {
                    title: "Responsive Fix",
                    description: "Adapt: Make your Hero Section responsive. On Mobile Portrait, stack the flex items vertically and reduce the font size.",
                    deliverable: "Responsive Page"
                }
            },
            {
                day: "Day 4",
                title: "10. CMS & Dynamic Content",
                summary: "Building a Blog or Portfolio without writing databases.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Webflow CMS Tutorial", url: "https://university.webflow.com/courses/cms-and-dynamic-content", duration: "20 min" },
                    { type: "Article", title: "Designing with Real Data", url: "https://webflow.com/blog/cms", source: "Webflow Blog" }
                ],
                task: {
                    title: "CMS Setup",
                    description: "Database: Create a 'Projects' Collection in Webflow (Name, Image, Description). Design a Template Page that pulls this data automatically.",
                    deliverable: "CMS Page"
                }
            },
            {
                day: "Day 4",
                title: "11. Interactions & Animations (Low Code)",
                summary: "Parallax, Scroll Animations, and Hover effects without JavaScript.",
                duration: "3 Hours",
                resources: [
                    { type: "Video", title: "Webflow Interactions 2.0", url: "https://university.webflow.com/courses/interactions-and-animations", duration: "25 min" },
                    { type: "Article", title: "Scroll Animations Guide", url: "https://webflow.com/interactions/scroll", source: "Webflow Blog" }
                ],
                task: {
                    title: "Scroll Trigger",
                    description: "Animate: Create a 'Reveal on Scroll' effect. As the user scrolls down, make your project cards fade in and move up.",
                    deliverable: "Interaction"
                }
            },
            {
                day: "Day 4",
                title: "12. Publishing & SEO",
                summary: "Going live. Meta tags, Open Graph images, and connecting a domain.",
                duration: "2 Hours",
                resources: [
                    { type: "Article", title: "SEO Checklist for Webflow", url: "https://university.webflow.com/lesson/seo-checklist", source: "Webflow Univ" },
                    { type: "Video", title: "Publishing Your Site", url: "https://university.webflow.com/lesson/publish", duration: "5 min" }
                ],
                task: {
                    title: "Go Live",
                    description: "Launch: Optimize your site for Google. Add a Meta Title and Description. Publish it to the .webflow.io staging domain.",
                    deliverable: "Live Site URL"
                }
            }
        ]
    }
];
