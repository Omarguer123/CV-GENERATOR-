// create.js - Builds the CV Generator project on your Desktop
// Run: node create.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = path.join(require('os').homedir(), 'Desktop', 'cv-generator');

// Delete if exists
if (fs.existsSync(projectDir)) {
  fs.rmSync(projectDir, { recursive: true, force: true });
}

// Create folder structure
const dirs = [
  '', 'components', 'components/CvEditor', 'components/templates',
  'lib', 'pages', 'pages/editor', 'pages/api', 'pages/api/cvs',
  'pages/api/payments', 'pages/api/subscriptions', 'styles', 'public'
];
dirs.forEach(d => fs.mkdirSync(path.join(projectDir, d), { recursive: true }));

// Helper to write a file
function writeFile(filePath, content) {
  const fullPath = path.join(projectDir, filePath);
  // Ensure parent directory exists
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

// ========== package.json ==========
writeFile('package.json', JSON.stringify({
  name: 'cv-generator',
  version: '1.0.0',
  private: true,
  scripts: {
    dev: 'next dev',
    build: 'next build',
    start: 'next start',
    lint: 'next lint'
  },
  dependencies: {
    '@supabase/auth-helpers-nextjs': '^0.8.0',
    '@supabase/supabase-js': '^2.39.0',
    'micro': '^10.0.1',
    'next': '14.1.0',
    'raw-body': '^3.0.0',
    'react': '^18.2.0',
    'react-dom': '^18.2.0'
  },
  devDependencies: {
    '@types/node': '^20.10.0',
    '@types/react': '^18.2.0',
    '@types/react-dom': '^18.2.0',
    'autoprefixer': '^10.4.0',
    'eslint': '^8.56.0',
    'eslint-config-next': '14.1.0',
    'postcss': '^8.4.0',
    'tailwindcss': '^3.4.0',
    'typescript': '^5.3.0'
  }
}, null, 2));

// ========== tsconfig.json ==========
writeFile('tsconfig.json', JSON.stringify({
  compilerOptions: {
    target: 'es5',
    lib: ['dom', 'dom.iterable', 'esnext'],
    allowJs: true,
    skipLibCheck: true,
    strict: true,
    forceConsistentCasingInFileNames: true,
    noEmit: true,
    esModuleInterop: true,
    module: 'esnext',
    moduleResolution: 'node',
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: 'preserve',
    incremental: true,
    baseUrl: '.',
    paths: { '@/*': ['./*'] }
  },
  include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
  exclude: ['node_modules']
}, null, 2));

// ========== next.config.js ==========
writeFile('next.config.js', '/** @type {import("next").NextConfig} */\nconst nextConfig = {};\nmodule.exports = nextConfig;\n');

// ========== tailwind.config.js ==========
writeFile('tailwind.config.js', '/** @type {import("tailwindcss").Config} */\nmodule.exports = {\n  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],\n  theme: { extend: {} },\n  plugins: [],\n};\n');

// ========== postcss.config.js ==========
writeFile('postcss.config.js', 'module.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n');

// ========== .env.local ==========
writeFile('.env.local', `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
PAYPAL_WEBHOOK_ID=your-webhook-id
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_PLAN_PRO_ID=P-XXXXXXXX
PAYPAL_PLAN_BUSINESS_ID=P-YYYYYYYY
NEXT_PUBLIC_BASE_URL=http://localhost:3000`);

// ========== styles/globals.css ==========
writeFile('styles/globals.css', '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');

// ========== styles/cv-print.css ==========
writeFile('styles/cv-print.css', `@page { size: A4; margin: 20mm; }
html, body { width: 210mm; min-height: 297mm; font-family: 'Inter', sans-serif; font-size: 10.5pt; line-height: 14pt; color: #000; background: #fff; margin:0; padding:0; }
.cv-page { width: 170mm; margin: 0 auto; padding: 20mm; }
.cv-name { font-size: 22pt; font-weight: 700; margin-bottom: 6mm; }
.section-title { font-size: 12pt; font-weight: 600; border-bottom: 0.5pt solid #333; padding-bottom: 2mm; margin-bottom: 2mm; text-transform: uppercase; }
.two-col { display: grid; grid-template-columns: 40mm 4mm 126mm; }
.tag { display: inline-block; background: #f0f0f0; padding: 1mm 3mm; border-radius: 2mm; font-size: 9.5pt; }
@media print { .no-print { display: none !important; } }`);

// ========== All template files (in components/templates/) ==========
const templates = {
  'harvard.ts': `export const harvard = {
  id: 'harvard_mba', name: 'Harvard / MBA', pagesMax: 1, accentColor: '#1E3A5F', photo: false, columns: 1 as const,
  sections: [
    { id: 'header', type: 'header', heightMm: 35, components: ['name','contact_row'] },
    { id: 'summary', type: 'text_block', maxLines: 4, label: 'Professional Summary' },
    { id: 'experience', type: 'repeatable_list', label: 'Professional Experience', maxItems: 4, itemSchema: ['jobTitle','company','dates','bullets'], maxBulletsPerItem: 4 },
    { id: 'education', type: 'repeatable_list', label: 'Education', maxItems: 4, itemSchema: ['degree','university','year','details'] },
    { id: 'skills', type: 'tag_grid', label: 'Skills & Interests', maxTags: 12, columns: 3 }
  ]
};`,
  'modernMinimal.ts': `export const modernMinimal = {
  id: 'modern_minimal', name: 'Modern Minimal', pagesMax: 2, accentColor: '#2B5B84', photo: false, columns: 2 as const,
  leftColumnWidthMm: 40, columnGapMm: 4,
  sections: [
    { id: 'header', type: 'header', heightMm: 30, components: ['name','title_line','contact_icons'] },
    { id: 'summary', type: 'text_block', maxLines: 6, label: 'Profile' },
    { id: 'experience', type: 'repeatable_list', label: 'Experience', maxItems: 5, itemSchema: ['jobTitle','company','dates','bullets'], maxBulletsPerItem: 3 },
    { id: 'skills_left_col', type: 'tag_grid', label: 'Expertise', maxTags: 8, columns: 1, position: 'left_column' },
    { id: 'languages_left_col', type: 'tag_list', label: 'Languages', position: 'left_column' },
    { id: 'education', type: 'repeatable_list', label: 'Education', maxItems: 3, itemSchema: ['degree','university','year'] }
  ]
};`,
  'creative.ts': `export const creative = {
  id: 'creative', name: 'Creative / Portfolio', pagesMax: 2, accentColor: 'user_pick_6', photo: true, photoSizeMm: { width: 25, height: 25 },
  columns: 2 as const, leftColumnWidthMm: 60, columnGapMm: 4,
  sections: [
    { id: 'photo_and_contact_left_col', type: 'composite', position: 'left_column', components: ['photo','contact_details','skills_bars','languages'] },
    { id: 'name_title_right_col', type: 'header', position: 'right_column', components: ['name','title_line'] },
    { id: 'profile_right', type: 'text_block', maxLines: 5, label: 'About Me', position: 'right_column' },
    { id: 'experience_right', type: 'repeatable_list', label: 'Experience', maxItems: 4, itemSchema: ['jobTitle','company','dates','bullets'], maxBulletsPerItem: 3, position: 'right_column' },
    { id: 'education_right', type: 'repeatable_list', label: 'Education', maxItems: 3, itemSchema: ['degree','university','year'], position: 'right_column' }
  ]
};`,
  'europass.ts': `export const europass = {
  id: 'europass_official', name: 'Europass (Official EU)', pagesMax: 4, accentColor: '#0E47A1', photo: true, columns: 1 as const, usesTables: true,
  sections: [
    { id: 'personal_information', type: 'table_block', rows: ['first_name','last_name','email','phone','address','nationality','date_of_birth'] },
    { id: 'work_experience', type: 'repeatable_table', label: 'Work Experience', columns: ['dates','occupation','employer','main_activities'] },
    { id: 'education_training', type: 'repeatable_table', label: 'Education and Training', columns: ['dates','qualification','institution','eqf_level'] },
    { id: 'skills', type: 'skill_grid_table', label: 'Personal Skills', subsections: ['mother_tongue','other_languages','digital_skills','communication_skills','organisational_skills'] }
  ]
};`,
  'classic.ts': `export const classic = {
  id: 'classic_conservative', name: 'Classic Conservative', pagesMax: 2, accentColor: '#4A4A4A', photo: false, ruleLines: true, columns: 1 as const,
  sections: [
    { id: 'header', type: 'header', heightMm: 30, components: ['name','contact_row'] },
    { id: 'summary', type: 'text_block', maxLines: 5, label: 'Profile' },
    { id: 'experience', type: 'repeatable_list', label: 'Professional Experience', maxItems: 5, itemSchema: ['jobTitle','company','dates','bullets'], maxBulletsPerItem: 4 },
    { id: 'education', type: 'repeatable_list', label: 'Education', maxItems: 4, itemSchema: ['degree','university','year','details'] },
    { id: 'memberships', type: 'text_block', maxLines: 3, label: 'Professional Memberships' }
  ]
};`,
  'chronological.ts': `export const chronological = {
  id: 'chronological', name: 'Chronological (Plain)', pagesMax: 2, accentColor: '#000000', photo: false, columns: 1 as const,
  sections: [
    { id: 'header', type: 'header', heightMm: 30, components: ['name','contact_row'] },
    { id: 'summary', type: 'text_block', maxLines: 4, label: 'Summary' },
    { id: 'experience', type: 'repeatable_list', label: 'Work History', maxItems: 6, itemSchema: ['jobTitle','company','dates','bullets'], maxBulletsPerItem: 4 },
    { id: 'education', type: 'repeatable_list', label: 'Education', maxItems: 4, itemSchema: ['degree','university','year'] },
    { id: 'skills', type: 'tag_list', label: 'Additional Skills' }
  ]
};`,
  'functional.ts': `export const functional = {
  id: 'functional', name: 'Functional / Skills-Based', pagesMax: 2, accentColor: '#2E7D32', photo: false, columns: 1 as const,
  sections: [
    { id: 'header', type: 'header', heightMm: 30, components: ['name','contact_row'] },
    { id: 'skills_summary', type: 'tag_grid', label: 'Core Competencies', maxTags: 12, columns: 2 },
    { id: 'achievements', type: 'repeatable_list', label: 'Key Achievements', maxItems: 6, itemSchema: ['achievement_bullet'], maxBulletsPerItem: 1 },
    { id: 'work_history_compact', type: 'compact_list', label: 'Career Timeline', maxItems: 6, itemSchema: ['jobTitle','company','dates'] },
    { id: 'education', type: 'repeatable_list', label: 'Education', maxItems: 4, itemSchema: ['degree','university','year'] }
  ]
};`
};
for (const [name, content] of Object.entries(templates)) {
  writeFile(`components/templates/${name}`, content);
}

// registry.ts
writeFile('components/templates/registry.ts', `import { harvard } from './harvard';
import { modernMinimal } from './modernMinimal';
import { creative } from './creative';
import { europass } from './europass';
import { classic } from './classic';
import { chronological } from './chronological';
import { functional } from './functional';
const templates: Record<string, any> = {
  harvard_mba: harvard,
  modern_minimal: modernMinimal,
  creative,
  europass_official: europass,
  classic_conservative: classic,
  chronological,
  functional,
};
export default templates;`);

// ========== lib files ==========
writeFile('lib/templateEngine.ts', `import templates from '@/components/templates/registry';
export interface CvData {
  personal: { fullName: string; email: string; phone: string; address?: string; linkedin?: string; title?: string; photo?: string; };
  summary: string;
  experience: { jobTitle: string; company: string; dates: string; bullets: string[] }[];
  education: { degree: string; university: string; year: string; details?: string }[];
  skills: string[];
  languages?: string[];
  certifications?: string[];
  memberships?: string;
  personalInfo?: Record<string, string>;
}
export function getTemplate(id: string) { return (templates as any)[id]; }
export function getTemplateIds() { return Object.keys(templates); }`);

writeFile('lib/supabase.ts', `import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);`);

writeFile('lib/auth.tsx', `import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';
interface AuthContextType {
  user: User | null; session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}
const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); setUser(session?.user ?? null); setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); setUser(session?.user ?? null);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);
  const signIn = async (email: string, password: string) => { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; };
  const signUp = async (email: string, password: string) => { const { error } = await supabase.auth.signUp({ email, password }); if (error) throw error; };
  const signOut = async () => { await supabase.auth.signOut(); };
  return (<AuthContext.Provider value={{ user, session, signIn, signUp, signOut, loading }}>{children}</AuthContext.Provider>);
}
export const useAuth = () => useContext(AuthContext);`);

writeFile('lib/paypal.ts', `const PAYPAL_API = process.env.NODE_ENV === 'production' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(\`\${process.env.PAYPAL_CLIENT_ID}:\${process.env.PAYPAL_CLIENT_SECRET}\`).toString('base64');
  const res = await fetch(\`\${PAYPAL_API}/v1/oauth2/token\`, {
    method: 'POST', headers: { 'Authorization': \`Basic \${auth}\`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}
export async function createSubscription(planId: string, subscriberEmail: string) {
  const accessToken = await getAccessToken();
  const res = await fetch(\`\${PAYPAL_API}/v1/billing/subscriptions\`, {
    method: 'POST', headers: { 'Authorization': \`Bearer \${accessToken}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan_id: planId, subscriber: { email_address: subscriberEmail },
      application_context: {
        brand_name: 'CV Generator Pro', locale: 'en-US',
        shipping_preference: 'NO_SHIPPING', user_action: 'SUBSCRIBE_NOW',
        return_url: \`\${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?subscription=success\`,
        cancel_url: \`\${process.env.NEXT_PUBLIC_BASE_URL}/pricing?subscription=cancelled\`,
      }
    }),
  });
  const data = await res.json();
  const approvalURL = data.links?.find((l: any) => l.rel === 'approve')?.href;
  if (!approvalURL) throw new Error('No approval URL');
  return { subscriptionID: data.id, approvalURL };
}
export async function verifyWebhookSignature(headers: any, body: string): Promise<boolean> {
  const accessToken = await getAccessToken();
  const res = await fetch(\`\${PAYPAL_API}/v1/notifications/verify-webhook-signature\`, {
    method: 'POST', headers: { 'Authorization': \`Bearer \${accessToken}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_algo: headers['paypal-auth-algo'], cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: process.env.PAYPAL_WEBHOOK_ID, webhook_event: JSON.parse(body),
    }),
  });
  const data = await res.json();
  return data.verification_status === 'SUCCESS';
}`);

// ========== pages/_app.tsx ==========
writeFile('pages/_app.tsx', `import type { AppProps } from 'next/app';
import { AuthProvider } from '@/lib/auth';
import '@/styles/globals.css';
export default function MyApp({ Component, pageProps }: AppProps) {
  return <AuthProvider><Component {...pageProps} /></AuthProvider>;
}`);

// ========== pages/index.tsx (Landing) ==========
writeFile('pages/index.tsx', `import Head from 'next/head';
import Link from 'next/link';
import PayPalSubscribeButton from '@/components/PayPalSubscribeButton';
const plans = [
  { name: 'Free', price: '€0', features: ['1 CV','2 basic templates','Watermarked PDF','Basic editing'], cta: 'Get Started Free', planId: 'free' },
  { name: 'Pro', price: '€7.99', period: '/month', features: ['10 CVs','All 7 premium templates','PDF & DOCX','ATS check','AI suggestions','No watermarks'], cta: 'Subscribe', planId: 'pro', highlighted: true },
  { name: 'Business', price: '€19.99', period: '/month', features: ['Unlimited CVs','All + custom branding','PDF, DOCX, JSON','Advanced ATS','Team sharing (5)','Priority support'], cta: 'Subscribe', planId: 'business' },
];
export default function LandingPage() {
  return (
    <>
      <Head><title>CV Generator Pro</title></Head>
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Your CV, Employer-Ready in Minutes</h1>
        <p className="text-xl mb-8">7 recruiter-accredited templates. Pixel-perfect, ATS-friendly.</p>
        <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-semibold">Create Your CV Free</Link>
      </section>
      <section id="pricing" className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
          {plans.map(plan => (
            <div key={plan.name} className={\`border rounded-xl p-6 flex flex-col \${plan.highlighted ? 'border-blue-500 scale-105' : ''}\`}>
              {plan.highlighted && <span className="text-blue-600 font-semibold mb-2">Most Popular</span>}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4"><span className="text-3xl font-bold">{plan.price}</span>{plan.period && <span className="text-gray-500">{plan.period}</span>}</div>
              <ul className="flex-1 space-y-2 mb-6">{plan.features.map(f => <li key={f} className="flex gap-2 text-sm"><span className="text-green-500">✓</span>{f}</li>)}</ul>
              {plan.planId === 'free' ? <Link href="/signup" className="w-full bg-gray-100 hover:bg-gray-200 text-center py-2 rounded-lg">{plan.cta}</Link> : <PayPalSubscribeButton plan={plan.planId as 'pro' | 'business'} />}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}`);

// ========== pages/dashboard.tsx ==========
writeFile('pages/dashboard.tsx', `import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';
export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [cvs, setCvs] = useState<any[]>([]);
  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (user) fetch('/api/cvs/list').then(r=>r.json()).then(setCvs).catch(console.error);
  }, [user, loading]);
  const createNew = async () => {
    const res = await fetch('/api/cvs/save', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title:'New CV', template_id:'harvard_mba', data:{ personal:{ fullName:'', email:'', phone:'' }, summary:'', experience:[], education:[], skills:[] } }) });
    const cv = await res.json();
    router.push('/editor/' + cv.id);
  };
  if (loading) return <div className="p-8">Loading...</div>;
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My CVs</h1>
          <div className="flex gap-4">
            <button onClick={createNew} className="bg-blue-600 text-white px-4 py-2 rounded">+ New CV</button>
            <button onClick={signOut} className="text-gray-600">Sign Out</button>
          </div>
        </div>
        {cvs.length===0 ? <p>No CVs yet. Create one!</p> : (
          <div className="grid gap-4">
            {cvs.map(cv => (
              <Link key={cv.id} href={'/editor/' + cv.id}>
                <div className="bg-white p-4 rounded shadow hover:shadow-md cursor-pointer flex justify-between">
                  <div><h3 className="font-semibold">{cv.title}</h3><p className="text-sm text-gray-500">{cv.template_id}</p></div>
                  <p className="text-sm text-gray-400">{new Date(cv.updated_at).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}`);

// ========== pages/editor/[id].tsx ==========
writeFile('pages/editor/[id].tsx', `import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CvEditor from '@/components/CvEditor/CvEditor';
import CvPreview from '@/components/CvEditor/CvPreview';
import { CvData } from '@/lib/templateEngine';
import { useAuth } from '@/lib/auth';
export default function EditorPage() {
  const router = useRouter(); const { id } = router.query;
  const { user, loading } = useAuth();
  const [cvData, setCvData] = useState<CvData>({ personal: { fullName: '', email: '', phone: '' }, summary: '', experience: [], education: [], skills: [] });
  const [templateId, setTemplateId] = useState('harvard_mba');
  const [title, setTitle] = useState('Untitled CV');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (loading || !user) return;
    if (id && id !== 'new') fetch('/api/cvs/' + id).then(r=>r.json()).then(cv => { setCvData(cv.data); setTemplateId(cv.template_id); setTitle(cv.title); });
  }, [id, user, loading]);
  const handleSave = async () => { setSaving(true); await fetch('/api/cvs/save', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: id==='new'?undefined:id, title, template_id: templateId, data: cvData }) }); setSaving(false); };
  const handleExportPdf = () => { window.print(); };
  if (loading) return <div className="p-8">Loading...</div>;
  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4 overflow-auto no-print">
        <input value={title} onChange={e=>setTitle(e.target.value)} className="text-xl font-bold mb-4 block" />
        <CvEditor cvData={cvData} onChange={setCvData} templateId={templateId} onTemplateChange={setTemplateId} />
        <div className="mt-4 flex gap-2">
          <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded">{saving?'Saving...':'Save'}</button>
          <button onClick={handleExportPdf} className="bg-blue-600 text-white px-4 py-2 rounded">Export PDF</button>
        </div>
      </div>
      <div className="w-1/2 bg-gray-100 p-4"><CvPreview cvData={cvData} templateId={templateId} /></div>
    </div>
  );
}`);

// ========== pages/login.tsx ==========
writeFile('pages/login.tsx', `import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
export default function Login() {
  const { signIn } = useAuth(); const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { await signIn(email, password); router.push('/dashboard'); } catch (err: any) { setError(err.message); } };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Log In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border p-2 mb-4 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full border p-2 mb-4 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Log In</button>
        <p className="mt-4 text-center"><Link href="/signup" className="text-blue-600">Don't have an account? Sign up</Link></p>
      </form>
    </div>
  );
}`);

// ========== pages/signup.tsx ==========
writeFile('pages/signup.tsx', `import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
export default function Signup() {
  const { signUp } = useAuth(); const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { await signUp(email, password); router.push('/dashboard'); } catch (err: any) { setError(err.message); } };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full border p-2 mb-4 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full border p-2 mb-4 rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Sign Up</button>
        <p className="mt-4 text-center"><Link href="/login" className="text-blue-600">Already have an account? Log in</Link></p>
      </form>
    </div>
  );
}`);

// ========== Components ==========
writeFile('components/CvEditor/CvEditor.tsx', `import { CvData } from '@/lib/templateEngine';
import TemplateSelector from './TemplateSelector';
import { getTemplateIds } from '@/lib/templateEngine';
interface Props { cvData: CvData; onChange: (data: CvData) => void; templateId: string; onTemplateChange: (id: string) => void; }
export default function CvEditor({ cvData, onChange, templateId, onTemplateChange }: Props) {
  return (
    <div>
      <TemplateSelector selected={templateId} onChange={onTemplateChange} templateIds={getTemplateIds()} />
      <label className="block mt-4">Full Name <input value={cvData.personal.fullName} onChange={e=>onChange({...cvData, personal:{...cvData.personal, fullName: e.target.value}})} className="w-full border p-2 rounded mt-1" /></label>
      <label className="block mt-4">Email <input value={cvData.personal.email} onChange={e=>onChange({...cvData, personal:{...cvData.personal, email: e.target.value}})} className="w-full border p-2 rounded mt-1" /></label>
      <label className="block mt-4">Phone <input value={cvData.personal.phone} onChange={e=>onChange({...cvData, personal:{...cvData.personal, phone: e.target.value}})} className="w-full border p-2 rounded mt-1" /></label>
      <label className="block mt-4">Summary <textarea value={cvData.summary} onChange={e=>onChange({...cvData, summary: e.target.value})} rows={4} className="w-full border p-2 rounded mt-1" /></label>
      <div className="mt-4"><h3 className="font-semibold">Experience</h3>
        {cvData.experience.map((exp,i)=>(
          <div key={i} className="border p-2 rounded mt-2">
            <input placeholder="Job Title" value={exp.jobTitle} onChange={e=>{ const n=[...cvData.experience]; n[i].jobTitle=e.target.value; onChange({...cvData,experience:n}); }} className="w-full border p-1 rounded mb-1" />
            <input placeholder="Company" value={exp.company} onChange={e=>{ const n=[...cvData.experience]; n[i].company=e.target.value; onChange({...cvData,experience:n}); }} className="w-full border p-1 rounded mb-1" />
            <input placeholder="Dates" value={exp.dates} onChange={e=>{ const n=[...cvData.experience]; n[i].dates=e.target.value; onChange({...cvData,experience:n}); }} className="w-full border p-1 rounded mb-1" />
          </div>
        ))}
        <button onClick={()=>onChange({...cvData, experience: [...cvData.experience, { jobTitle:'', company:'', dates:'', bullets:[] }]})} className="text-blue-600 mt-2">+ Add Experience</button>
      </div>
      <div className="mt-4"><h3 className="font-semibold">Education</h3>
        {cvData.education.map((edu,i)=>(
          <div key={i} className="border p-2 rounded mt-2">
            <input placeholder="Degree" value={edu.degree} onChange={e=>{ const n=[...cvData.education]; n[i].degree=e.target.value; onChange({...cvData,education:n}); }} className="w-full border p-1 rounded mb-1" />
            <input placeholder="University" value={edu.university} onChange={e=>{ const n=[...cvData.education]; n[i].university=e.target.value; onChange({...cvData,education:n}); }} className="w-full border p-1 rounded mb-1" />
            <input placeholder="Year" value={edu.year} onChange={e=>{ const n=[...cvData.education]; n[i].year=e.target.value; onChange({...cvData,education:n}); }} className="w-full border p-1 rounded mb-1" />
          </div>
        ))}
        <button onClick={()=>onChange({...cvData, education: [...cvData.education, { degree:'', university:'', year:'' }]})} className="text-blue-600 mt-2">+ Add Education</button>
      </div>
      <label className="block mt-4">Skills (comma separated) <input value={cvData.skills.join(',')} onChange={e=>onChange({...cvData, skills: e.target.value.split(',')})} className="w-full border p-2 rounded mt-1" /></label>
    </div>
  );
}`);

writeFile('components/CvEditor/TemplateSelector.tsx', `interface Props { selected: string; onChange: (id: string) => void; templateIds: string[]; }
export default function TemplateSelector({ selected, onChange, templateIds }: Props) {
  return <select value={selected} onChange={e=>onChange(e.target.value)} className="border p-2 rounded">{templateIds.map(id=><option key={id} value={id}>{id}</option>)}</select>;
}`);

writeFile('components/CvEditor/CvPreview.tsx', `import { useMemo } from 'react';
import { getTemplate, CvData } from '@/lib/templateEngine';
interface Props { cvData: CvData; templateId: string; }
export default function CvPreview({ cvData, templateId }: Props) {
  const template = useMemo(() => getTemplate(templateId), [templateId]);
  if (!template) return <p>Template not found</p>;
  return (
    <div className="cv-page">
      <h1 className="cv-name">{cvData.personal.fullName || 'Your Name'}</h1>
      <div className="cv-contact">{cvData.personal.email} · {cvData.personal.phone}</div>
      {cvData.summary && <><h2 className="section-title">Summary</h2><p>{cvData.summary}</p></>}
      {cvData.experience.length>0 && (<div><h2 className="section-title">Experience</h2>{cvData.experience.map((exp,i)=>(<div key={i} className="repeatable-list-item"><div className="item-header"><span className="job-title">{exp.jobTitle}</span><span className="dates">{exp.dates}</span></div><div className="company">{exp.company}</div></div>))}</div>)}
      {cvData.education.length>0 && (<div><h2 className="section-title">Education</h2>{cvData.education.map((edu,i)=>(<div key={i} className="repeatable-list-item"><div className="item-header"><span className="degree-title">{edu.degree}</span><span className="dates">{edu.year}</span></div><div className="university">{edu.university}</div></div>))}</div>)}
      {cvData.skills.length>0 && (<div><h2 className="section-title">Skills</h2><div className="tag-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>{cvData.skills.map((s,i)=><span key={i} className="tag">{s}</span>)}</div></div>)}
    </div>
  );
}`);

writeFile('components/PayPalSubscribeButton.tsx', `interface Props { plan: 'pro' | 'business'; onError?: (error: any) => void; }
export default function PayPalSubscribeButton({ plan, onError }: Props) {
  const handleSubscribe = async () => {
    try {
      const res = await fetch('/api/payments/create-subscription', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ plan }) });
      const data = await res.json();
      if (data.approvalURL) window.location.href = data.approvalURL;
      else throw new Error('No approval URL');
    } catch (err) { onError?.(err); }
  };
  return <button onClick={handleSubscribe} className="w-full bg-[#0070ba] hover:bg-[#003087] text-white font-bold py-2 rounded-lg">Subscribe with PayPal</button>;
}`);

// ========== API routes ==========
writeFile('pages/api/cvs/save.ts', `import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method === 'POST') {
    const { id, title, template_id, data } = req.body;
    const userId = session.user.id;
    let cv;
    if (id) {
      const { data: updated, error } = await supabase.from('cvs').update({ title, template_id, data, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', userId).select().single();
      if (error) return res.status(500).json({ error: error.message });
      cv = updated;
    } else {
      const { data: inserted, error } = await supabase.from('cvs').insert({ user_id: userId, title, template_id, data }).select().single();
      if (error) return res.status(500).json({ error: error.message });
      cv = inserted;
    }
    await supabase.from('cv_versions').insert({ cv_id: cv.id, data, template_id });
    return res.status(200).json(cv);
  }
  return res.status(405).end();
}`);

writeFile('pages/api/cvs/list.ts', `import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('cvs').select('id, title, template_id, updated_at').eq('user_id', session.user.id).order('updated_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }
  return res.status(405).end();
}`);

writeFile('pages/api/cvs/[id].ts', `import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const { id } = req.query;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('cvs').select('*, versions:cv_versions(*)').eq('id', id).single();
    if (error) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(data);
  }
  if (req.method === 'DELETE') {
    const { error } = await supabase.from('cvs').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }
  return res.status(405).end();
}`);

writeFile('pages/api/payments/create-subscription.ts', `import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createSubscription } from '@/lib/paypal';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const { plan } = req.body;
  const planId = plan==='pro' ? process.env.PAYPAL_PLAN_PRO_ID : process.env.PAYPAL_PLAN_BUSINESS_ID;
  if (!planId) return res.status(400).json({ error: 'Invalid plan' });
  try {
    const { subscriptionID, approvalURL } = await createSubscription(planId, session.user.email!);
    await supabase.from('subscriptions').insert({ user_id: session.user.id, paypal_subscription_id: subscriptionID, plan, status: 'pending' });
    return res.status(200).json({ approvalURL });
  } catch (error: any) { return res.status(500).json({ error: error.message }); }
}`);

writeFile('pages/api/payments/webhook.ts', `import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { verifyWebhookSignature } from '@/lib/paypal';
import { buffer } from 'micro';
export const config = { api: { bodyParser: false } };
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const rawBody = (await buffer(req)).toString('utf8');
  const isValid = await verifyWebhookSignature(req.headers, rawBody);
  if (!isValid) return res.status(403).json({ error: 'Invalid signature' });
  const event = JSON.parse(rawBody);
  const subscriptionId = event.resource?.id;
  if (!subscriptionId) return res.status(400).end();
  if (event.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
    await supabaseAdmin.from('subscriptions').update({ status: 'active', paypal_data: event.resource }).eq('paypal_subscription_id', subscriptionId);
    const { data: sub } = await supabaseAdmin.from('subscriptions').select('user_id, plan').eq('paypal_subscription_id', subscriptionId).single();
    if (sub) await supabaseAdmin.from('profiles').update({ plan: sub.plan, subscription_status: 'active' }).eq('id', sub.user_id);
  }
  return res.status(200).json({ received: true });
}`);

writeFile('pages/api/subscriptions/current.ts', `import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const { data, error } = await supabase.from('subscriptions').select('plan, status').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(1).single();
  if (error || !data) return res.status(200).json({ plan: 'free', status: 'inactive' });
  return res.status(200).json(data);
}`);

console.log('✅ Project created at: ' + projectDir);
console.log('Next steps:');
console.log('1. Open PowerShell and run:  cd ' + projectDir);
console.log('2. Run:  npm install');
console.log('3. After that, zip the folder and upload to GitHub, then import to Vercel.');