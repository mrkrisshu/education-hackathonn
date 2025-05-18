// Flashcards data
export const flashcardsData = [
  {
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
    deck: "Geography",
    lastReviewed: new Date('2023-03-10').toISOString(),
    nextReview: new Date('2023-03-13').toISOString(),
    difficulty: 1, // 1-5 scale, 1 being easiest
    repetitions: 3,
  },
  {
    id: 2,
    question: "What is the powerhouse of the cell?",
    answer: "Mitochondria",
    deck: "Biology",
    lastReviewed: new Date('2023-03-11').toISOString(),
    nextReview: new Date('2023-03-15').toISOString(),
    difficulty: 2,
    repetitions: 2,
  },
  {
    id: 3,
    question: "What is the formula for calculating the area of a circle?",
    answer: "πr²",
    deck: "Mathematics",
    lastReviewed: new Date('2023-03-09').toISOString(),
    nextReview: new Date('2023-03-12').toISOString(),
    difficulty: 3,
    repetitions: 1,
  },
  {
    id: 4,
    question: "What does HTML stand for?",
    answer: "HyperText Markup Language",
    deck: "Web Development",
    lastReviewed: new Date('2023-03-08').toISOString(),
    nextReview: new Date('2023-03-11').toISOString(),
    difficulty: 1,
    repetitions: 4,
  },
  {
    id: 5,
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
    deck: "Literature",
    lastReviewed: new Date('2023-03-07').toISOString(),
    nextReview: new Date('2023-03-14').toISOString(),
    difficulty: 1,
    repetitions: 5,
  },
];

// Quiz data
export const quizzesData = [
  {
    id: 1,
    title: "Introduction to JavaScript",
    description: "Test your knowledge of JavaScript basics",
    topic: "Programming",
    estimatedTime: 15, // minutes
    difficulty: "beginner", // beginner, intermediate, advanced
    questions: [
      {
        id: 1,
        question: "Which of the following is not a JavaScript data type?",
        options: ["String", "Boolean", "Integer", "Object"],
        correctAnswer: "Integer",
        difficulty: "easy",
      },
      {
        id: 2,
        question: "What does the '===' operator do in JavaScript?",
        options: [
          "Assigns a value",
          "Compares values and types",
          "Compares only values",
          "Logical AND operation"
        ],
        correctAnswer: "Compares values and types",
        difficulty: "medium",
      },
      {
        id: 3,
        question: "Which method adds an element to the end of an array?",
        options: ["push()", "pop()", "unshift()", "shift()"],
        correctAnswer: "push()",
        difficulty: "easy",
      },
    ],
    completions: 145,
    averageScore: 72,
  },
  {
    id: 2,
    title: "Advanced CSS Techniques",
    description: "Test your knowledge of advanced CSS concepts",
    topic: "Web Development",
    estimatedTime: 20,
    difficulty: "advanced",
    questions: [
      {
        id: 1,
        question: "Which CSS property is used for creating a grid layout?",
        options: ["display: grid", "display: flex", "position: grid", "layout: grid"],
        correctAnswer: "display: grid",
        difficulty: "medium",
      },
      {
        id: 2,
        question: "What does the 'z-index' property control?",
        options: [
          "Horizontal position",
          "Vertical position",
          "Stacking order",
          "Element size"
        ],
        correctAnswer: "Stacking order",
        difficulty: "medium",
      },
      {
        id: 3,
        question: "Which is NOT a valid CSS positioning value?",
        options: ["static", "relative", "absolute", "external"],
        correctAnswer: "external",
        difficulty: "easy",
      },
    ],
    completions: 92,
    averageScore: 68,
  },
];

// Habits data
export const habitsData = [
  {
    id: 1,
    title: "Study for 1 hour",
    description: "Dedicated study time with no distractions",
    frequency: "daily",
    streak: 7,
    completedDates: [
      "2023-03-05",
      "2023-03-06",
      "2023-03-07",
      "2023-03-08",
      "2023-03-09",
      "2023-03-10",
      "2023-03-11",
    ],
    category: "Education",
    color: "#4F46E5", // primary color
  },
  {
    id: 2,
    title: "Review flashcards",
    description: "Review due flashcards for 15 minutes",
    frequency: "daily",
    streak: 4,
    completedDates: [
      "2023-03-08",
      "2023-03-09",
      "2023-03-10",
      "2023-03-11",
    ],
    category: "Education",
    color: "#0EA5E9", // secondary color
  },
  {
    id: 3,
    title: "Read a book chapter",
    description: "Read at least one chapter from current book",
    frequency: "daily",
    streak: 2,
    completedDates: [
      "2023-03-10",
      "2023-03-11",
    ],
    category: "Reading",
    color: "#8B5CF6", // accent color
  },
  {
    id: 4,
    title: "Complete one quiz",
    description: "Take at least one practice quiz",
    frequency: "weekly",
    streak: 3,
    completedDates: [
      "2023-02-25",
      "2023-03-04",
      "2023-03-11",
    ],
    category: "Practice",
    color: "#22C55E", // success color
  },
];

// Courses data
export const coursesData = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning algorithms and applications",
    topic: "Data Science",
    estimatedTime: 40, // hours
    difficulty: "intermediate",
    instructor: "Dr. Sarah Chen",
    rating: 4.8,
    reviews: 326,
    enrollments: 1892,
    image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600",
    chapters: [
      "Introduction to ML",
      "Supervised Learning",
      "Unsupervised Learning",
      "Neural Networks",
      "Practical Applications",
    ],
    progress: 0, // 0-100
  },
  {
    id: 2,
    title: "Web Development Bootcamp",
    description: "Comprehensive course covering HTML, CSS, JavaScript, React, and Node.js",
    topic: "Web Development",
    estimatedTime: 60,
    difficulty: "beginner",
    instructor: "Michael Johnson",
    rating: 4.9,
    reviews: 512,
    enrollments: 3241,
    image: "https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=600",
    chapters: [
      "HTML Basics",
      "CSS Fundamentals",
      "JavaScript Essentials",
      "Introduction to React",
      "Backend with Node.js",
      "Full Stack Projects",
    ],
    progress: 35,
  },
  {
    id: 3,
    title: "Advanced Python Programming",
    description: "Take your Python skills to the next level with advanced concepts and techniques",
    topic: "Programming",
    estimatedTime: 30,
    difficulty: "advanced",
    instructor: "James Wilson",
    rating: 4.7,
    reviews: 218,
    enrollments: 1453,
    image: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600",
    chapters: [
      "Advanced Data Structures",
      "Decorators and Generators",
      "Concurrency and Parallelism",
      "Design Patterns in Python",
      "Performance Optimization",
    ],
    progress: 72,
  },
  {
    id: 4,
    title: "Digital Marketing Fundamentals",
    description: "Learn essential digital marketing strategies and tools",
    topic: "Marketing",
    estimatedTime: 25,
    difficulty: "beginner",
    instructor: "Emma Williams",
    rating: 4.6,
    reviews: 189,
    enrollments: 2134,
    image: "https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=600",
    chapters: [
      "Digital Marketing Overview",
      "SEO Essentials",
      "Social Media Marketing",
      "Email Marketing",
      "Analytics and Reporting",
    ],
    progress: 100, // completed
  },
];

// Reading logs data
export const readingLogsData = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    dateStarted: "2023-02-15",
    dateFinished: "2023-03-05",
    rating: 5,
    progress: 100, // percentage
    notes: "Excellent book on writing maintainable code. Key concepts: meaningful names, small functions, clear organization.",
    coverImage: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    title: "Algorithms to Live By",
    author: "Brian Christian & Tom Griffiths",
    genre: "Computer Science",
    dateStarted: "2023-03-01",
    dateFinished: null,
    rating: 4,
    progress: 68,
    notes: "Fascinating connection between computer algorithms and daily life decisions.",
    coverImage: "https://images.pexels.com/photos/4960438/pexels-photo-4960438.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Productivity",
    dateStarted: "2023-02-10",
    dateFinished: "2023-02-28",
    rating: 5,
    progress: 100,
    notes: "Great insights on focusing in a distracted world. Practical strategies for achieving deep concentration.",
    coverImage: "https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt & David Thomas",
    genre: "Programming",
    dateStarted: "2023-03-07",
    dateFinished: null,
    rating: 0, // not rated yet
    progress: 25,
    notes: "Just started. Looks promising with practical advice for software developers.",
    coverImage: "https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

// Notes data
export const notesData = [
  {
    id: 1,
    title: "React Hooks Overview",
    content: "# React Hooks\n\nHooks are functions that let you \"hook into\" React state and lifecycle features from function components.\n\n## useState\n\n```jsx\nconst [state, setState] = useState(initialState);\n```\n\n## useEffect\n\n```jsx\nuseEffect(() => {\n  // Side effect code\n  return () => {\n    // Cleanup code\n  };\n}, [dependencies]);\n```\n\n## useContext\n\n```jsx\nconst value = useContext(MyContext);\n```",
    createdAt: "2023-03-05T14:22:18Z",
    updatedAt: "2023-03-10T09:15:42Z",
    tags: ["React", "JavaScript", "Frontend"],
    category: "Programming",
  },
  {
    id: 2,
    title: "CSS Grid Cheatsheet",
    content: "# CSS Grid Layout\n\n## Container Properties\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  grid-template-rows: 100px auto 100px;\n  gap: 10px;\n  grid-template-areas: \n    \"header header header\"\n    \"sidebar main main\"\n    \"footer footer footer\";\n}\n```\n\n## Item Properties\n\n```css\n.item {\n  grid-column: 1 / 3; /* from line 1 to line 3 */\n  grid-row: 2 / 4; /* from line 2 to line 4 */\n  /* OR */\n  grid-area: main;\n}\n```",
    createdAt: "2023-03-08T16:04:33Z",
    updatedAt: "2023-03-08T16:04:33Z",
    tags: ["CSS", "Grid", "Layout", "Frontend"],
    category: "Web Development",
  },
  {
    id: 3,
    title: "Machine Learning Concepts",
    content: "# Machine Learning Basics\n\n## Types of Machine Learning\n\n1. **Supervised Learning**\n   - Classification\n   - Regression\n\n2. **Unsupervised Learning**\n   - Clustering\n   - Dimensionality Reduction\n\n3. **Reinforcement Learning**\n   - Learning from environment through rewards/penalties\n\n## Common Algorithms\n\n- Linear Regression\n- Logistic Regression\n- Decision Trees\n- Support Vector Machines (SVM)\n- K-Means Clustering\n- Neural Networks\n\n## Evaluation Metrics\n\n- Accuracy\n- Precision\n- Recall\n- F1 Score\n- Mean Squared Error (MSE)",
    createdAt: "2023-03-02T11:30:15Z",
    updatedAt: "2023-03-09T14:22:45Z",
    tags: ["Machine Learning", "AI", "Data Science"],
    category: "Data Science",
  },
];

// Videos data
export const videosData = [
  {
    id: 1,
    title: "JavaScript Event Loop Explained",
    url: "https://youtu.be/8aGhZQkoFbQ",
    thumbnail: "https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=600",
    duration: "26:52",
    creator: "Jake Archibald",
    description: "A deep dive into the JavaScript event loop and how asynchronous code execution works in JS.",
    lastWatched: "2023-03-09T15:32:22Z",
    progress: 75, // percentage watched
    category: "Programming",
    tags: ["JavaScript", "Web Development", "Asynchronous"],
    comments: [
      {
        id: 1,
        user: "Alex Johnson",
        timestamp: "00:05:32",
        text: "Great explanation of the call stack!",
        createdAt: "2023-03-10T08:15:30Z",
      },
      {
        id: 2,
        user: "Sarah Miller",
        timestamp: "00:15:47",
        text: "The visualization really helps understanding the concept.",
        createdAt: "2023-03-10T10:22:15Z",
      },
    ],
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    url: "https://youtu.be/9vZtxJYWH6I",
    thumbnail: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600",
    duration: "42:18",
    creator: "Tech with Tim",
    description: "An introduction to machine learning concepts and applications for beginners.",
    lastWatched: "2023-03-07T20:15:40Z",
    progress: 100,
    category: "Data Science",
    tags: ["Machine Learning", "AI", "Data Science"],
    comments: [
      {
        id: 1,
        user: "Alex Johnson",
        timestamp: "00:12:05",
        text: "This cleared up my confusion about supervised vs. unsupervised learning!",
        createdAt: "2023-03-08T13:40:22Z",
      },
    ],
  },
  {
    id: 3,
    title: "Advanced React Patterns",
    url: "https://youtu.be/kT6yYSwK1oI",
    thumbnail: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600",
    duration: "36:24",
    creator: "Kent C. Dodds",
    description: "Learn advanced React patterns for building scalable and maintainable components.",
    lastWatched: "2023-03-11T09:45:12Z",
    progress: 30,
    category: "Web Development",
    tags: ["React", "JavaScript", "Frontend"],
    comments: [],
  },
  
  {
    id: 4,
    title: "Programming Tutorial",
    url: "https://www.youtube.com/watch?v=ix9cRaBkVe0&t=16328s",
    thumbnail: "https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=600",
    duration: "4:32:08",
    creator: "Programming with Mosh",
    description: "Comprehensive programming tutorial covering fundamentals and advanced topics.",
    lastWatched: new Date().toISOString(),
    progress: 0,
    category: "Programming",
    tags: ["Tutorial", "Programming", "Development"],
    comments: []
  },
];


// Lessons data
export const lessonsData = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "Introduction to JavaScript syntax and core concepts",
    scheduledDate: "2023-03-15T10:00:00Z",
    duration: 90, // minutes
    status: "scheduled", // scheduled, completed, rescheduled, missed
    category: "Programming",
    priority: "high",
    prerequisites: [],
    resources: [
      {
        type: "video",
        title: "JavaScript Crash Course",
        url: "https://youtu.be/hdI2bqOjy3c",
      },
      {
        type: "article",
        title: "JavaScript Fundamentals",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
      },
    ],
  },
  {
    id: 2,
    title: "HTML & CSS Fundamentals",
    description: "Learn the basics of HTML and CSS for web development",
    scheduledDate: "2023-03-13T14:00:00Z",
    duration: 60,
    status: "completed",
    category: "Web Development",
    priority: "medium",
    prerequisites: [],
    resources: [
      {
        type: "video",
        title: "HTML & CSS Crash Course",
        url: "https://youtu.be/hu-q2zYwEYs",
      },
    ],
  },
  {
    id: 3,
    title: "React Components",
    description: "Learn about React components and props",
    scheduledDate: "2023-03-16T15:30:00Z",
    duration: 120,
    status: "scheduled",
    category: "Web Development",
    priority: "high",
    prerequisites: [1], // JavaScript Basics
    resources: [
      {
        type: "documentation",
        title: "React Documentation",
        url: "https://reactjs.org/docs/components-and-props.html",
      },
    ],
  },
  {
    id: 4,
    title: "Python Data Structures",
    description: "Deep dive into Python lists, dictionaries, sets, and tuples",
    scheduledDate: "2023-03-14T09:00:00Z",
    duration: 90,
    status: "scheduled",
    category: "Programming",
    priority: "medium",
    prerequisites: [],
    resources: [
      {
        type: "article",
        title: "Python Data Structures",
        url: "https://docs.python.org/3/tutorial/datastructures.html",
      },
    ],
  },
  {
    id: 5,
    title: "Database Design",
    description: "Introduction to relational database design and normalization",
    scheduledDate: "2023-03-18T11:00:00Z",
    duration: 150,
    status: "scheduled",
    category: "Databases",
    priority: "medium",
    prerequisites: [],
    resources: [
      {
        type: "article",
        title: "Database Design Basics",
        url: "https://www.guru99.com/database-design.html",
      },
    ],
  },
];