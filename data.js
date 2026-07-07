// Default initial data for the portfolio website.
// If localStorage is empty, these default values will be loaded.
const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: "Tamagna Mondal",
    title: "Data Scientist & B.Tech Student",
    bio: "Hi! I'm Tamagna Mondal, a passionate first-year B.Tech student at VIT-AP University, specializing in Computer Science and Engineering. I'm deeply interested in Data Science, Machine Learning, and Data Analysis. I love turning raw data into meaningful insights and building intelligent solutions. Currently exploring the intersection of hardware and software, working with tools like Vivado and Multisim alongside my programming journey in Python, Java, and more.",
    location: "Amaravati, India",
    latitude: "16.5062° N",
    longitude: "80.6480° E",
    university: "VIT-AP University",
    degree: "B.Tech CSE",
    degreeDetail: "First Year Student",
    focusArea: "Data Science",
    focusDetail: "ML & Data Analysis",
    status: "actively learning & building",
    systemName: "SYSTEM_ONLINE // PORTFOLIO_v1.0"
  },
  skills: [
    { id: "s1", name: "Python", category: "Languages", level: 90 },
    { id: "s2", name: "Java", category: "Languages", level: 75 },
    { id: "s3", name: "C / C++", category: "Languages", level: 80 },
    { id: "s4", name: "Machine Learning", category: "Data Science", level: 85 },
    { id: "s5", name: "Data Analysis", category: "Data Science", level: 88 },
    { id: "s6", name: "SQL", category: "Data Science", level: 80 },
    { id: "s7", name: "NumPy & Pandas", category: "Data Science", level: 85 },
    { id: "s8", name: "Vivado", category: "Hardware & Tools", level: 70 },
    { id: "s9", name: "Multisim", category: "Hardware & Tools", level: 75 },
    { id: "s10", name: "Git", category: "Hardware & Tools", level: 80 },
    { id: "s11", name: "VS Code", category: "Hardware & Tools", level: 90 }
  ],
  projects: [
    {
      id: "p1",
      title: "Student Group Matcher",
      description: "An intelligent platform designed to revolutionize in-campus collaboration by matching students based on skills, project interests, and compatibility vectors. Features a clean, vector-based matchmaking dashboard.",
      tags: ["Python", "Algorithms", "Data Structs"],
      github: "https://github.com",
      live: "https://example.com"
    },
    {
      id: "p2",
      title: "Crop Yield Prediction Engine",
      description: "A machine learning pipeline utilizing regression models to forecast agricultural crop yields based on historic soil pH, rainfall levels, temperature telemetry, and fertilizer usage data.",
      tags: ["ML Pipeline", "Pandas", "Scikit-Learn"],
      github: "https://github.com",
      live: "https://example.com"
    },
    {
      id: "p3",
      title: "Digital Logic Simulator Interface",
      description: "A custom UI dashboard that visualizes Boolean algebra outputs and circuits, built to reinforce Multisim logical operations and simulation outputs programmatically.",
      tags: ["Python", "Tkinter", "Logisim"],
      github: "https://github.com",
      live: "https://example.com"
    }
  ],
  certifications: [
    {
      id: "c1",
      name: "Supervised Machine Learning: Regression and Classification",
      issuer: "DeepLearning.AI & Stanford University",
      date: "2025-11",
      link: "https://coursera.org"
    },
    {
      id: "c2",
      name: "Python for Data Science and AI",
      issuer: "IBM",
      date: "2025-08",
      link: "https://coursera.org"
    },
    {
      id: "c3",
      name: "Advanced SQL for Analytics",
      issuer: "Google Cloud",
      date: "2026-02",
      link: "https://coursera.org"
    }
  ],
  contact: {
    email: "mondaltamagna6@gmail.com",
    phone: "+91 99078 53434",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    discordUsername: "Tamagna#1234"
  }
};
