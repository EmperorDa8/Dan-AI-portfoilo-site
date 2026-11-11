/* Single source for facts that appear in more than one component. Everything
   here mirrors the canonical CV (Dan_Usman_CV_AI_Product_Engineer_2026-09) —
   update the CV first, then this file, never the other way round. */

export const CV_URL = '/Dan_Usman_CV_AI_Product_Engineer_2026-09.pdf';
export const EMAIL = 'uabdul88@gmail.com';
export const LINKEDIN = 'https://www.linkedin.com/in/dan-usman-b87282134';
export const GITHUB = 'https://github.com/EmperorDa8';

export type Status = 'Live' | 'Launched' | 'Client' | 'Open source' | 'Prototype';

export type Product = {
    id: string;
    name: string;
    kind: string;
    blurb: string;
    status: Status;
    tags: ('AI' | 'Agents' | 'Full-stack' | 'Extension' | 'Client')[];
    stack: string[];
    href?: string;
    github?: string;
    img?: string;
    video?: string;
};

/* Only products that appear on the CV with something a reviewer can open.
   Unverifiable older prototypes (PricePal, Galaxyflow, subkit, YouRev, the
   voice-banking demo, PDF gallery) were removed in Sep 2026. */
export const PRODUCTS: Product[] = [
    {
        id: 'xamio',
        name: 'Xamio',
        kind: 'Founder · solo builder',
        blurb: 'Upload any exam timetable — PDF, photo, spreadsheet or Word — and AI extracts every exam, matches it to your registered courses and syncs it to Google Calendar with reminders.',
        status: 'Launched',
        tags: ['AI', 'Full-stack'],
        stack: ['React', 'FastAPI', 'Supabase', 'Google OAuth', 'LLM extraction'],
        href: 'https://xamio.app',
        github: 'https://github.com/EmperorDa8/xamio',
        img: '/xamio_thumbnail.webp',
    },
    {
        id: 'veridic',
        name: 'Veridic',
        kind: 'Founder · Chrome extension · Web Store',
        blurb: 'Restates contracts, policies and forms in plain English and quotes the exact wording, so every point can be checked against the source. On-device AI where the hardware allows; 16 languages; refuses medical documents rather than guessing.',
        status: 'Live',
        tags: ['Extension', 'AI', 'Full-stack'],
        stack: ['Chrome MV3', 'Supabase Edge Functions', 'Chrome built-in AI', 'Payments'],
        href: 'https://chromewebstore.google.com/detail/veridic-plain-english-doc/bonhakihihahncfdkeckopmfeblflmak',
        img: '/veridic_thumbnail.webp',
    },
    {
        id: 'tasker',
        name: 'Tasker',
        kind: 'Chrome extension · Web Store',
        blurb: 'Privacy-first extension that turns browsing time into shareable daily and monthly PDF reports, with optional Google Drive backup. No account; data stays on the device.',
        status: 'Live',
        tags: ['Extension', 'AI'],
        stack: ['Chrome MV3', 'Google Drive API', 'OAuth', 'Gemini'],
        href: 'https://chromewebstore.google.com/detail/tasker-activity-tracker-g/nfdjclnanladapnhofbmnhclkhlndeak',
        github: 'https://github.com/EmperorDa8/tasker',
        img: '/tasker_thumbnail.webp',
        video: '/studio/tasker-promo.mp4',
    },
    {
        id: 'aitrainingplan',
        name: 'aitrainingplan.app',
        kind: 'AI adoption planner',
        blurb: 'Tell it your role and team size; get a concrete four-week AI adoption plan with one deliverable per week.',
        status: 'Live',
        tags: ['AI', 'Full-stack'],
        stack: ['LLM structured output', 'TypeScript', 'Vercel'],
        href: 'https://aitrainingplan-chi.vercel.app',
        github: 'https://github.com/EmperorDa8/aitrainingplan',
        img: '/aitrainingplan_thumbnail.webp',
    },
    {
        id: 'venturescout',
        name: 'VentureScout',
        kind: 'LLM startup risk scoring',
        blurb: 'Scores early-stage startup risk with a structured LLM rubric and explainable verdicts. Idea to live MVP in about nine days.',
        status: 'Live',
        tags: ['AI'],
        stack: ['Lovable', 'Claude Code', 'Supabase', 'Prompt rubric'],
        href: 'https://venuturescout.lovable.app',
        img: '/venturescout_thumbnail.webp',
    },
    {
        id: 'xbot',
        name: 'Agentic X Bot',
        kind: 'Autonomous social agent',
        blurb: "Always-on agent that replies on X in a brand's own voice, grounded in the brand's website content.",
        status: 'Open source',
        tags: ['Agents', 'AI'],
        stack: ['Tool calling', 'Grounding', 'Python'],
        github: 'https://github.com/EmperorDa8/agentic-x-bot',
    },
];
