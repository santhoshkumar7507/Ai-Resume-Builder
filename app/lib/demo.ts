
export const DEMO_RESUME = {
    id: "demo",
    companyName: "Google",
    jobTitle: "Senior Software Engineer",
    imagePath: "/images/resume-sample.png",
    resumePath: "/sample.pdf",
    feedback: {
        overallScore: 88,
        ATS: {
            score: 92,
            tips: [
                { type: "good", tip: "Excellent use of keywords relevant to Distributed Systems." },
                { type: "good", tip: "Consistent date formatting throughout the document." },
                { type: "improve", tip: "Add more quantifiable metrics (e.g., 'reduced latency by 30%')." },
                { type: "improve", tip: "Ensure your LinkedIn profile link is clickable." }
            ]
        },
        toneAndStyle: {
            score: 85,
            tips: [
                { type: "good", tip: "Professional and authoritative tone.", explanation: "The language conveys confidence and expertise without being boastful." },
                { type: "improve", tip: "Avoid using first-person pronouns.", explanation: "Resumes should generally be written in the third person to maintain professional distance." }
            ]
        },
        content: {
            score: 90,
            tips: [
                { type: "good", tip: "Strong project descriptions.", explanation: "Each project clearly outlines the problem, solution, and impact." },
                { type: "improve", tip: "Expand on your contributions to Open Source.", explanation: "Mentioning specific repositories or communities adds significant value." }
            ]
        },
        structure: {
            score: 95,
            tips: [
                { type: "good", tip: "Perfect reverse-chronological order.", explanation: "The layout makes it very easy for recruiters to see your most recent progression." },
                { type: "good", tip: "Clear, distinct sections.", explanation: "Using white space effectively separates Skills, Experience, and Education." }
            ]
        },
        skills: {
            score: 82,
            tips: [
                { type: "good", tip: "Strong technical stack (Go, Kubernetes, AWS).", explanation: "These are high-demand skills for Senior roles." },
                { type: "improve", tip: "Group skills into categories.", explanation: "Categorizing by 'Languages', 'Frameworks', and 'Tools' improves readability." }
            ]
        }
    }
};
