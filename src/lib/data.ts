export const profile = {
  name: "Sharaaf Nazeer",
  greeting: "Bonjour",
  roles: ["Software Engineer", "Tech Enthusiast", "Blogger", "Tutor"],
  email: "hello@sharaafnazeer.com",
  resumeUrl: "/resume",
  /** Direct download URL for the latest CV PDF. */
  resumePdfUrl: "/files/sharaaf-nazeer-resume.pdf",
  location: "Singapore",
  available: true,
  bio: "Sharaaf Nazeer is an experienced Software Engineer with around 9 years of expertise in full-stack development, enterprise software engineering, and cross-functional team leadership. He has delivered scalable, secure solutions across fintech, e-commerce, content management & publishing, banking, telecom, and enterprise systems — collaborating with globally distributed teams across Asia, Europe, and North America. Passionate about building high-quality systems, AI applications, mentoring engineers, and aligning technology delivery with business goals.",
  social: {
    github: "https://github.com/sharaafnazeer",
    linkedin: "https://www.linkedin.com/in/sharaaf-nazeer/",
    twitter: "https://x.com/sharaafnazeer",
    instagram: "https://www.instagram.com/tech_with_sharaaf/",
  },
}

export type Service = {
  title: string
  description: string
  iconKey: "code" | "phone" | "palette" | "cloud" | "agent"
}

export const services: Service[] = [
  {
    title: "Web Development",
    description:
      "Forge exceptionally responsive web applications leveraging the forefront of cutting-edge technologies.",
    iconKey: "code",
  },
  {
    title: "App Development",
    description:
      "Architects and engineers meticulously craft mobile applications that are intuitive, user-centric, and engaging across Android and iOS.",
    iconKey: "phone",
  },
  {
    title: "UX/UI Design",
    description:
      "By cultivating a deep understanding of user empathy, we engineer designs that afford profoundly meaningful experiences.",
    iconKey: "palette",
  },
  {
    title: "Cloud & Architecture",
    description:
      "Design scalable, resilient cloud-native systems with a focus on performance, security and developer ergonomics.",
    iconKey: "cloud",
  },
  {
    title: "Agentic AI Development",
    description:
      "Design and ship production-grade agentic AI systems — autonomous agents, RAG pipelines, tool-using LLMs and multi-agent workflows wired into real product surfaces.",
    iconKey: "agent",
  },
]

export type Experience = {
  role: string
  company: string
  location?: string
  period: string
  description?: string
  /**
   * Optional list of notable clients / projects worked on while at this company.
   * Rendered as a richer bullet list on the resume page; the homepage timeline
   * only uses `description`.
   */
  highlights?: { name: string; summary: string }[]
}

export const experiences: Experience[] = [
  {
    role: "Lead Software Engineer",
    company: "TI&M Singapore",
    location: "Singapore",
    period: "Dec 2025 — Present",
    description:
      "Leading backend engineering on Bank Julius Baer's CLM/CRM platform — designing onboarding services in Java + Spring Boot, modernising legacy modules, and shipping features aligned with APAC regulatory requirements.",
    highlights: [
      {
        name: "Bank Julius Baer — CLM / CRM",
        summary:
          "Client relationship management platform powering client onboarding and lifecycle management for Asia operations. Streamlines KYC, regulatory compliance, and client data across jurisdictions.",
      },
    ],
  },
  {
    role: "Technical Lead — KYC",
    company: "Crédit Agricole CIB",
    location: "Singapore",
    period: "Sep 2023 — Dec 2025",
    description:
      "Led design and delivery for the KYC team — Java/Spring/Hibernate services, Spring Batch extraction jobs, GitLab CI migration, and Kubernetes-deployed REST APIs consumed across the bank. Ran AI proof-of-concepts for the customer KYC flow and contributed to the on-prem → GCP migration study.",
  },
  {
    role: "Associate Technical Lead",
    company: "ConceptVines / Verdentra",
    period: "May 2022 — Aug 2023",
    description:
      "Technical lead across two parallel platforms — a multi-custodian fintech middleware for Inveniam (USA) and Cowrie's AI-powered knowledge platform — owning architecture, AWS infrastructure-as-code, and GenAI chatbot delivery.",
    highlights: [
      {
        name: "Inveniam USA — CHUB Multi-Custodian",
        summary:
          "Generic interface to communicate with multiple custodians (Anchorage Digital) and clients (OPM). Refactored microservices, built CodePipeline CI/CD, and provisioned AWS infra (VPC, Route 53, Lambda, DynamoDB) via CloudFormation.",
      },
      {
        name: "Cowrie SA — Cowrie",
        summary:
          "Single secure source-of-truth platform combining tradition with AI chatbots/agents. Led microservices in Java + Spring Boot + GoLang, integrated Keycloak auth, and shipped a GenAI chatbot using Python/Flask, OpenAI, LangChain and Pinecone Vector DB.",
      },
    ],
  },
  {
    role: "Associate Technical Lead",
    company: "Axiata Digital Labs",
    period: "Dec 2021 — May 2022",
    description:
      "Co-led the Chatbot CX platform for Axiata clients (Celcom, Dialog Axiata, Ncell) during COVID-19. Designed backend in Java/Spring Boot + GoLang, integrated Dialogflow, Zendesk and Yellow Messenger, and deployed on Kubernetes / GCP.",
  },
  {
    role: "Senior Software Engineer — Full Stack",
    company: "Just In Time Technologies",
    period: "Aug 2019 — Dec 2021",
    description:
      "Built and shipped four large platforms across content authoring, telco analytics, data anonymisation and enterprise ERP — full-stack work spanning Java/Spring, C#/.NET, Angular, React and GCP.",
    highlights: [
      {
        name: "Author-it Software — Author-it",
        summary:
          "CCMS authoring tool for documentation + eLearning. Built backend modules in Java/Spring Boot and C#/.NET, a new Angular frontend, and contributed to the monolith → microservices study.",
      },
      {
        name: "Axiata Digital Labs — Consumer Insights Explorer",
        summary:
          "Audience-building tool built on XACT (ADA's DMP). Designed reusable React + Redux UI components, integrated REST APIs and managed deployment on GCP.",
      },
      {
        name: "Axiata Digital Labs — Inkognito",
        summary:
          "Data anonymisation platform with near real-time + batch pipelines. Built GoLang/Spring Boot microservices, Apache NiFi integration, and a React/Redux/Material UI front-end secured with Keycloak.",
      },
      {
        name: "Hayleys Advantis — Logiventures ERP & AMUS",
        summary:
          "Two enterprise systems for Hayleys Group subsidiaries: an ERP/workflow platform (Java/Spring + Angular) and an asset maintenance & utilisation system (C#/.NET + Angular) with custom auth.",
      },
    ],
  },
  {
    role: "Software Engineer — Full Stack",
    company: "Findmyfare",
    period: "Jan 2017 — Jul 2019",
    description:
      "Built the booking flow and B2B platform for one of Sri Lanka's leading OTAs, plus the RetailGenius e-commerce marketplace — full-stack work across Laravel/PHP, Java/Spring Boot, Node.js and Angular.",
    highlights: [
      {
        name: "RetailGenius — Marketplace, EPOS, CRM",
        summary:
          "Online marketplace connecting vendors and customers with cart, reviews and island-wide delivery. Built the loyalty module, admin panel and CRM in Laravel/CodeIgniter + Node.js + Angular, plus the EPOS POS system and Node.js APIs for mobile.",
      },
      {
        name: "Findmyfare — Flights, Hotels, Buses",
        summary:
          "Online travel partner for flights, hotels and bus bookings. Implemented core modules in Laravel/PHP, Java/Spring Boot, Node.js and Angular, integrated multiple flight scheduling systems, and built bus booking + admin portals.",
      },
    ],
  },
]

export type Education = {
  degree: string
  school: string
  period: string
  details?: string
}

export const education: Education[] = [
  {
    degree: "Master of Computer Science",
    school: "University of Colombo School of Computing, Sri Lanka",
    period: "2019 — 2021",
  },
  {
    degree: "BSc in Information Technology",
    school: "Sri Lanka Institute of Information Technology",
    period: "2014 — 2017",
    details: "Second Class Upper Division · GPA 3.52",
  },
]

export type Certification = {
  name: string
  issuer?: string
  period: string
}

export const certifications: Certification[] = [
  {
    name: "GCP Certified Professional Cloud Architect",
    issuer: "Google Cloud",
    period: "May 2025 — Present",
  },
  {
    name: "AWS Certified Developer — Associate",
    issuer: "Amazon Web Services",
    period: "Dec 2024 — Present",
  },
]

export type SkillGroup = {
  title: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages & Frameworks",
    skills: [
      "Java",
      "Spring Boot",
      "Node.js",
      "Go",
      "Python",
      "TypeScript",
      "Angular",
      "React",
      "Next.js",
      "NestJS",
      "React Native",
    ],
  },
  {
    title: "Cloud & DevOps",
    skills: [
      "AWS",
      "GCP",
      "Kubernetes",
      "Docker",
      "Terraform",
      "Helm",
      "ArgoCD",
      "GitLab CI",
      "Jenkins",
    ],
  },
  {
    title: "Data & Messaging",
    skills: [
      "PostgreSQL",
      "MySQL",
      "MSSQL",
      "MongoDB",
      "Kafka",
      "IBM MQ",
      "Pinecone",
      "Firebase",
    ],
  },
  {
    title: "AI / LLM",
    skills: ["LangChain", "OpenAI", "GenAI", "MCP", "Dialogflow"],
  },
  {
    title: "Architecture & Practices",
    skills: [
      "Clean Architecture",
      "Microservices",
      "REST",
      "gRPC",
      "GraphQL",
      "TDD",
      "DevSecOps",
    ],
  },
]

export const navLinks = [
  { href: "/#about", label: "About" },
  // Hidden until the projects relaunch — uncomment to restore the link in
  // both the navbar and the footer (they both read from this array).
  // { href: "/projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
]
