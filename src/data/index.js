import { htmlLevels, htmlQuestions } from './htmlData.js';
import { cssLevels, cssQuestions } from './cssData.js';
import { jsLevels, jsQuestions } from './jsData.js';
import { reactLevels, reactQuestions } from './reactData.js';
import { mongoLevels, mongoQuestions } from './mongoData.js';
import { nodeLevels, nodeQuestions } from './nodeData.js';
import { expressLevels, expressQuestions } from './expressData.js';
import { interviewBank } from './interviewData.js';

export const DOMAINS = {
  html: {
    id: "html",
    name: "HTML5 & Web Semantics",
    short: "HTML5",
    icon: "🌐",
    color: "#E07A5F",
    bgColor: "rgba(224, 122, 95, 0.12)",
    levels: htmlLevels,
    questions: htmlQuestions,
    interviews: interviewBank.html
  },
  css: {
    id: "css",
    name: "CSS3 & Modern Styling",
    short: "CSS3",
    icon: "🎨",
    color: "#3D405B",
    bgColor: "rgba(61, 64, 91, 0.12)",
    levels: cssLevels,
    questions: cssQuestions,
    interviews: interviewBank.css
  },
  js: {
    id: "js",
    name: "JavaScript (ES6+ & V8)",
    short: "JavaScript",
    icon: "⚡",
    color: "#F2CC8F",
    bgColor: "rgba(242, 204, 143, 0.18)",
    levels: jsLevels,
    questions: jsQuestions,
    interviews: interviewBank.js
  },
  react: {
    id: "react",
    name: "React.js & Concurrent Fiber",
    short: "React.js",
    icon: "⚛️",
    color: "#61DAFB",
    bgColor: "rgba(97, 218, 251, 0.12)",
    levels: reactLevels,
    questions: reactQuestions,
    interviews: interviewBank.react
  },
  mongo: {
    id: "mongo",
    name: "MongoDB & Aggregation",
    short: "MongoDB",
    icon: "🍃",
    color: "#81B29A",
    bgColor: "rgba(129, 178, 154, 0.15)",
    levels: mongoLevels,
    questions: mongoQuestions,
    interviews: interviewBank.mongo
  },
  node: {
    id: "node",
    name: "Node.js & Libuv Runtime",
    short: "Node.js",
    icon: "🟢",
    color: "#43A047",
    bgColor: "rgba(67, 160, 71, 0.15)",
    levels: nodeLevels,
    questions: nodeQuestions,
    interviews: interviewBank.node
  },
  express: {
    id: "express",
    name: "Express.js & REST API",
    short: "Express.js",
    icon: "🚂",
    color: "#9E9E9E",
    bgColor: "rgba(158, 158, 158, 0.15)",
    levels: expressLevels,
    questions: expressQuestions,
    interviews: interviewBank.express
  }
};
