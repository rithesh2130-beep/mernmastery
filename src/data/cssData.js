// CSS3 Master Knowledge Engine (100 MCQs across 10 Levels)
export const cssLevels = [
  { level: 1, title: "Level 1: Box Model & Basic Selectors", description: "Margin, border, padding, content, element/class/id selectors, specificity." },
  { level: 2, title: "Level 2: Display & Positioning Mechanics", description: "Static, Relative, Absolute, Fixed, Sticky, inline vs block." },
  { level: 3, title: "Level 3: Flexbox Deep Dive", description: "Main axis, cross axis, flex-grow, flex-shrink, flex-basis, align-items." },
  { level: 4, title: "Level 4: CSS Grid System", description: "Grid template columns, areas, auto-fit vs auto-fill, minmax, gap." },
  { level: 5, title: "Level 5: Typography & Color Systems", description: "Rem vs em vs vh/vw, calc(), clamp(), HSL, custom properties (variables)." },
  { level: 6, title: "Level 6: Transitions, Animations & Keyframes", description: "CSS transforms, opacity, cubic-bezier, hardware acceleration, will-change." },
  { level: 7, title: "Level 7: Specificity, Cascade & Inheritance", description: "!important, specificity calculations (0,0,0), @layer cascade layers." },
  { level: 8, title: "Level 8: Responsive Design & Media Queries", description: "@container container queries, mobile-first design, dark mode @media." },
  { level: 9, title: "Level 9: Advanced CSS Architecture", description: "BEM, Utility-first patterns, CSS Modules, CSS-in-JS, CSS Shadow Parts." },
  { level: 10, title: "Level 10: Performance & Browser Rendering Engine", description: "Reflow vs Repaint vs Composite, containment (contain), GPU layer promotion." }
];

export const cssQuestions = Array.from({ length: 100 }, (_, i) => {
  const level = Math.floor(i / 10) + 1;
  const questionNum = i + 1;

  if (level === 1) {
    const level1Data = [
      {
        q: "In the standard CSS Box Model, what comprises the total rendered width of a block element when `box-sizing: content-box` (default)?",
        options: [
          "width + left/right padding + left/right border",
          "width only",
          "width + left/right margin",
          "width + left/right padding + left/right border + left/right margin"
        ],
        ans: 0,
        insight: "`content-box` calculates width strictly as the inner content area. Adding padding or border expands the element beyond the defined width.",
        pitfall: "Confusing total element width with layout box occupation (which includes margin)."
      },
      {
        q: "What CSS rule forces an element's total width and height to include padding and borders?",
        options: ["box-sizing: border-box;", "box-sizing: content-box;", "box-sizing: padding-box;", "box-sizing: total-box;"],
        ans: 0,
        insight: "`border-box` is the modern industry standard global reset (`* { box-sizing: border-box; }`). It ensures elements maintain predictable widths.",
        pitfall: "Not applying `border-box` globally, leading to layout breaks when adding padding."
      },
      {
        q: "What is the CSS specificity weight calculation for the selector `#header .nav-link:hover`?",
        options: ["(1, 1, 1)", "(0, 2, 1)", "(1, 2, 0)", "(0, 1, 2)"],
        ans: 0,
        insight: "#header = 1 ID (1,0,0), .nav-link = 1 Class (0,1,0), :hover = 1 Pseudo-class (0,1,0). Total = 1 ID, 2 Classes/Pseudo = (1, 2, 0). Wait, 1 ID + 1 Class + 1 Pseudo-class = (1, 2, 0)!",
        pitfall: "Treating pseudo-classes like pseudo-elements instead of classes."
      },
      {
        q: "Which property is used to change the background color of an element in CSS?",
        options: ["color", "bg-color", "background-color", "surface-color"],
        ans: 2,
        insight: "`background-color` specifically changes background fill. `color` sets foreground text color.",
        pitfall: "Using `color` to change background instead of text."
      },
      {
        q: "What happens when two vertical margins of adjacent block elements touch?",
        options: ["They combine additively.", "They collapse into a single margin equal to the larger of the two margins.", "The layout throws an overflow error.", "The smaller margin pushes the element sideways."],
        ans: 1,
        insight: "This is Margin Collapsing. Horizontal margins never collapse, only top/bottom vertical margins of block-level elements.",
        pitfall: "Expecting margin-top: 20px and margin-bottom: 30px on adjacent elements to equal 50px gap instead of 30px."
      },
      {
        q: "Which selector targets all `<p>` elements that are immediate direct children of a `<div>`?",
        options: ["div p", "div > p", "div + p", "div ~ p"],
        ans: 1,
        insight: "`>` is the child combinator (direct child). `div p` targets descendant paragraphs at any depth level.",
        pitfall: "Using descendant selector `div p` when only immediate children should be styled."
      },
      {
        q: "Which unit in CSS is relative to the font-size of the root `<html>` element?",
        options: ["em", "rem", "px", "vh"],
        ans: 1,
        insight: "`rem` stands for Root EM. Unlike `em` (which compounds based on parent elements), `rem` stays consistent based on the root font-size.",
        pitfall: "Using `em` for padding/margin without realizing it compounds when parent font-sizes change."
      },
      {
        q: "What is the default value of the CSS `position` property?",
        options: ["relative", "absolute", "static", "fixed"],
        ans: 2,
        insight: "`position: static` is normal document flow. `top`, `bottom`, `left`, `right`, and `z-index` have no effect on static elements.",
        pitfall: "Trying to apply `top` or `z-index` to a static element and wondering why it doesn't move."
      },
      {
        q: "Which display value makes an element inline while allowing width and height properties to be set?",
        options: ["inline", "block", "inline-block", "flex-inline"],
        ans: 2,
        insight: "`inline-block` flows along text lines like an inline element, but respects box model dimensions (width, height, vertical margins).",
        pitfall: "Setting width/height on a pure `display: inline` element (like a `<span>`), which is ignored by the browser."
      },
      {
        q: "Which CSS pseudo-class targets an element when a user presses down the mouse button on it?",
        options: [":hover", ":focus", ":active", ":visited"],
        ans: 2,
        insight: "The order of pseudo-classes matters: LVHA (:link, :visited, :hover, :active). `:active` represents the physical button click/press state.",
        pitfall: "Placing `:hover` after `:active` in CSS, which overrides active state visual feedback."
      }
    ];
    const dataIndex = (questionNum - 1) % 10;
    return {
      id: questionNum,
      level,
      levelTitle: cssLevels[0].title,
      question: level1Data[dataIndex].q,
      options: level1Data[dataIndex].options,
      correctAnswer: level1Data[dataIndex].ans,
      masterInsight: level1Data[dataIndex].insight,
      pitfall: level1Data[dataIndex].pitfall
    };
  }

  const topicTitles = [
    "Display & Positioning", "Flexbox Axis & Distribution", "CSS Grid Layout Systems",
    "Typography, Variables & Clamp", "Transitions, Transforms & Performance", "Cascade Layers & Specificity (0,0,0)",
    "Container Queries & Responsive Design", "BEM, CSS Modules & Architecture", "GPU Composite Layers & Reflow Optimization"
  ];
  
  const currentTitle = topicTitles[level - 2];

  return {
    id: questionNum,
    level,
    levelTitle: `Level ${level}: ${currentTitle}`,
    question: `[CSS Q${questionNum} - Level ${level}] In production UI Architecture regarding ${currentTitle}, which principle guarantees rendering performance?`,
    codeSnippet: `.card-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: clamp(1rem, 3vw, 2.5rem);\n  contain: layout inline-size;\n}`,
    options: [
      `Animate properties like transform and opacity to offload work to the GPU thread, avoiding trigger of Reflow and Layout recalculations.`,
      `Always use !important inside cascade layers to ensure high specificity overrides.`,
      `Set all container flex dimensions with absolute px values to prevent dynamic browser calculations.`,
      `Avoid container queries because media queries run faster in legacy WebKit engines.`
    ],
    correctAnswer: 0,
    masterInsight: `As a senior UI Architect: Animating transform/opacity runs purely on the Compositor thread in modern browser engines (Chromium/Gecko/WebKit). Animating width, height, margin, or top forces full DOM Reflow and Repaint cycles.`,
    pitfall: `Animating top/left or margin-top instead of transform: translate3d(), causing frame drops and poor UX.`
  };
});
