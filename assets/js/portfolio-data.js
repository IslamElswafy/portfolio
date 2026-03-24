window.PORTFOLIO_DATA = {
    profile: {
        name: "Islam Elswafy",
        headline: "React Native, front-end, and full-stack developer focused on shipping fast, scalable products.",
        about: "I build high-performance mobile and web products with React Native, React, TypeScript, Node.js, and NestJS. Across startup, agency, and product work I focus on reusable UI systems, secure APIs, performance tuning, and production delivery backed by CI/CD.",
        email: "islamelswafy30@gmail.com",
        phone: "+20 1097395409",
        location: "Egypt",
        availability: "Remote, freelance, and product teams",
        linkedin: "https://www.linkedin.com/in/islam-elswifiy-117785246/",
        github: "https://github.com/IslamElswafy",
        contactNote: "Best first contact is email or LinkedIn. I can share deeper private case-study details during a call."
    },
    cvs: [{
            slug: "rn",
            filterClass: "react-native",
            label: "React Native CV",
            shortLabel: "React Native",
            roleTitle: "React Native Mobile Developer",
            file: "./cvs/Islam_Elswafy_RN.pdf",
            summary: "Focused on cross-platform mobile delivery with React Native, TypeScript, Redux, Expo, API integration, and production-ready app performance.",
            highlights: ["4 years in cross-platform delivery", "25% faster load times on Graphinion", "5K+ active users supported"],
            skills: ["React Native", "TypeScript", "Redux", "Expo", "Performance Optimization"]
        },
        {
            slug: "fe",
            filterClass: "front-end",
            label: "Front-End CV",
            shortLabel: "Front-End",
            roleTitle: "Front-End Developer",
            file: "./cvs/Islam_Elswafy_FE.pdf",
            summary: "Focused on responsive UI systems, React and Vite applications, scalable components, Tailwind-based design systems, and measurable performance improvements.",
            highlights: ["4 years of front-end delivery", "35% faster development through a design system", "Improved Lighthouse and load speed"],
            skills: ["React", "TypeScript", "Vite", "Tailwind CSS", "UI Architecture"]
        },
        {
            slug: "fs",
            filterClass: "full-stack",
            label: "Full-Stack CV",
            shortLabel: "Full-Stack",
            roleTitle: "Senior MERN Full-Stack Developer",
            file: "./cvs/Islam_Elswafy_FS.pdf",
            summary: "Focused on product architecture, REST APIs, NestJS and Node.js backends, CI/CD pipelines, Docker deployments, and shipping production-ready systems end to end.",
            highlights: ["40% performance improvement on ERP work", "50% workflow automation", "CI/CD and Docker delivery"],
            skills: ["React", "Node.js", "NestJS", "PostgreSQL", "CI/CD"]
        }
    ],
    projects: [{
            slug: "graphinion",
            title: "Graphinion",
            category: "Social Media Application",
            specialty: "rn",
            company: "Graphinion",
            role: "React Native Developer",
            timeframe: "2022 - 2023",
            summary: "A cross-platform social media product built for scale with React Native, TypeScript, and Redux.",
            challenge: "The product needed a mobile architecture that could support active users, complex state, and a growing feature set without losing performance.",
            solution: "I built the React Native client with a reusable TypeScript component system, Redux-driven state management, and performance-focused screen patterns for iOS and Android.",
            impact: ["5K+ active users supported", "25% faster load times", "Reusable UI system for faster delivery"],
            responsibilities: ["Built the mobile client in React Native and TypeScript", "Implemented Redux architecture and reusable components", "Improved loading performance and navigation flow", "Shipped production-ready features across iOS and Android"],
            techStack: ["React Native", "TypeScript", "Redux", "React Navigation", "Firebase", "AsyncStorage"],
            features: ["Cross-platform app delivery", "Real-time messaging", "Media sharing", "Authentication and profile management"],
            cover: {
                type: "image",
                src: "./wp-content/uploads/sites/11/graphinion/unnamed.png"
            },
            gallery: ["./wp-content/uploads/sites/11/graphinion/unnamed.png", "./wp-content/uploads/sites/11/graphinion/unnamed.webp", "./wp-content/uploads/sites/11/graphinion/unnamed (1).webp", "./wp-content/uploads/sites/11/graphinion/unnamed (2).webp"],
            links: {
                demo: {
                    label: "App Store",
                    url: "https://apps.apple.com/us/app/graphinion/id6503644174"
                }
            }
        },
        {
            slug: "blox",
            title: "Blox",
            category: "Marketplace Platform",
            specialty: "fs",
            company: "Blox",
            role: "Full-Stack Product Developer",
            timeframe: "2024",
            summary: "A marketplace product for car renting and selling with listing, search, and transaction workflows.",
            challenge: "The platform had to make inventory-heavy marketplace flows feel usable on mobile while handling trust, discovery, and transaction steps cleanly.",
            solution: "I delivered a product flow centered on listing management, filtered search, transactions, and marketplace communication with a clean mobile-first experience.",
            impact: ["Marketplace listing and search flows", "Buying, selling, and renting journeys", "Delivery aligned with product and business needs"],
            responsibilities: ["Structured listing and transaction user flows", "Built and refined search and filtering behavior", "Supported end-to-end marketplace delivery", "Shaped the mobile-first product experience"],
            techStack: ["React", "Node.js", "Express", "MongoDB", "Stripe API", "AWS S3"],
            features: ["Listing management", "Search and filtering", "Secure transaction flow", "Chat between buyer and seller"],
            cover: {
                type: "image",
                src: "./wp-content/uploads/sites/11/blox/Screenshot 2025-10-31 165733.png"
            },
            gallery: ["./wp-content/uploads/sites/11/blox/Screenshot 2025-10-31 165733.png", "./wp-content/uploads/sites/11/blox/Screenshot 2025-10-31 165806.png", "./wp-content/uploads/sites/11/blox/icon.png", "./wp-content/uploads/sites/11/blox/splash.png"],
            links: {
                demo: {
                    label: "Project Post",
                    url: "https://www.linkedin.com/posts/islam-elswifiy-117785246_reactnative-blox-marketplaceapp-activity-7196490222585495552-Ohzh?utm_source=share&utm_medium=member_desktop&rcm=ACoAADz7nmMBt5P0ODlhTJi-vlUlyVsdyW9q0gE"
                }
            }
        },
        {
            slug: "savvy",
            title: "Savvy",
            category: "AI Chat Product",
            specialty: "fe",
            company: "Savvy",
            role: "Front-End and Integration Developer",
            timeframe: "2024",
            summary: "A Vite-based AI chat experience paired with API integrations and real-time response delivery.",
            challenge: "The product needed a fast conversational interface that felt responsive while coordinating model responses and external API integrations.",
            solution: "I built the front-end experience around fast rendering, clean chat flows, and backend integration with NestJS so responses stayed quick and contextual.",
            impact: ["Real-time conversational UX", "Context-aware response flows", "Vite front-end paired with service integrations"],
            responsibilities: ["Built the user-facing chat interface", "Integrated APIs and backend conversation flows", "Improved responsiveness and state handling", "Delivered a polished AI product experience"],
            techStack: ["Vite", "NestJS", "TypeScript", "OpenAI API", "WebSocket", "PostgreSQL"],
            features: ["Real-time chat", "Context-aware responses", "Conversation history", "External service integration"],
            cover: {
                type: "image",
                src: "./wp-content/uploads/sites/11/Savvy/Screenshot 2025-10-31 170812.png"
            },
            gallery: ["./wp-content/uploads/sites/11/Savvy/Screenshot 2025-10-31 170812.png", "./wp-content/uploads/sites/11/Savvy/Screenshot 2025-10-31 170725.png", "./wp-content/uploads/sites/11/Savvy/Screenshot 2025-10-31 170828.png", "./wp-content/uploads/sites/11/Savvy/Screenshot 2025-10-31 170851.png", "./wp-content/uploads/sites/11/Savvy/savvy-logo-dark-full-B23lMkpU.svg"],
            links: {
                demo: {
                    label: "Live Site",
                    url: "https://savvyai.info/"
                }
            }
        },
        {
            slug: "elavvocato",
            title: "ElAvvocato",
            category: "Law Firm Management System",
            specialty: "fs",
            company: "ElAvvocato",
            role: "Full-Stack Product Developer",
            timeframe: "2024",
            summary: "A secure management system for law firms covering roles, cases, billing, and protected document workflows.",
            challenge: "The platform had to support multiple legal workflows while protecting confidential case data and documents.",
            solution: "I delivered a system centered on role-based access, secure document handling, and structured case-management flows for daily legal operations.",
            impact: ["Role-based access control", "Secure document workflows", "Case, calendar, and billing coverage"],
            responsibilities: ["Built workflow structure for legal operations", "Implemented secure access and data handling patterns", "Supported case-management and scheduling flows", "Delivered an app-store-ready product experience"],
            techStack: ["React", "Node.js", "Express", "PostgreSQL", "JWT", "AES Encryption"],
            features: ["Case tracking", "Secure document management", "Client portal", "Billing and scheduling"],
            cover: {
                type: "image",
                src: "./wp-content/uploads/sites/11/ElAvvocato/splash.png"
            },
            gallery: ["./wp-content/uploads/sites/11/ElAvvocato/splash.png", "./wp-content/uploads/sites/11/ElAvvocato/icon.png", "./wp-content/uploads/sites/11/ElAvvocato/yariga.png"],
            links: {
                demo: {
                    label: "App Store",
                    url: "https://apps.apple.com/eg/app/elavvocato/id6670542137"
                }
            }
        },
        {
            slug: "taqdum-erp",
            title: "Taqdum ERP",
            category: "ERP and Operations Platform",
            specialty: "fs",
            company: "Taqdum",
            role: "Senior Full-Stack Developer",
            timeframe: "2023 - Present",
            summary: "A private ERP platform focused on workflow automation, reporting, and scalable internal operations.",
            challenge: "The team needed a system that could reduce manual reporting, improve product performance, and support operational workflows across departments.",
            solution: "I led full-stack delivery with React, Vite, Node.js, and NestJS, building secure APIs, automating reporting workflows, and supporting deployment through Docker and CI/CD.",
            impact: ["40% performance improvement", "50% less manual reporting", "CI/CD and Docker-based delivery"],
            responsibilities: ["Led end-to-end product delivery", "Built frontend and backend workflows", "Implemented secure APIs and authentication", "Supported deployment and release automation"],
            techStack: ["React", "Vite", "Node.js", "NestJS", "PostgreSQL", "Docker", "CI/CD"],
            features: ["Workflow automation", "Reporting dashboards", "Authentication and role control", "Internal operations tooling"],
            cover: {
                type: "placeholder",
                eyebrow: "Private Case Study",
                title: "ERP Delivery",
                body: "Internal platform work focused on performance, automation, and product operations."
            },
            gallery: [],
            links: {}
        }
    ],
    experience: [{
            company: "WJL",
            role: "Front-End Developer",
            timeframe: "2025 - Present",
            summary: "Build responsive React, TypeScript, and Vite interfaces with design-system thinking and measurable front-end performance improvements.",
            highlights: ["Tailwind-based design system", "Performance and Lighthouse improvements", "Remote collaboration with product teams"]
        },
        {
            company: "Taqdum",
            role: "Senior Full-Stack Developer",
            timeframe: "2023 - Present",
            summary: "Lead product delivery across React, Vite, Node.js, and NestJS with a focus on secure APIs, workflow automation, and production systems.",
            highlights: ["40% performance improvement", "50% workflow automation", "CI/CD and Docker delivery"]
        },
        {
            company: "Graphinion",
            role: "React Native Developer",
            timeframe: "2022 - 2023",
            summary: "Built the mobile client for a social platform with reusable components, Redux architecture, and performance tuning for growth.",
            highlights: ["5K+ active users supported", "25% faster load times", "Reusable TypeScript UI components"]
        }
    ],
    workingStyle: ["Product-minded implementation with clean tradeoffs", "Reusable components and maintainable system design", "Delivery that accounts for performance, testing, and release readiness"]
};
