/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Profile from './components/Profile';
import { 
  Zap, 
  Shield, 
  Layout, 
  Lock, 
  CreditCard, 
  Database, 
  Search, 
  Code2, 
  ChevronRight, 
  Github, 
  Twitter, 
  ExternalLink,
  CheckCircle2,
  Terminal,
  Cpu,
  Layers
} from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "End-to-end Type Safety",
    description: "Full-stack type safety powered by TypeScript and Zod. Catch errors before they reach production."
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Premium UI Components",
    description: "Beautiful, accessible components built with Tailwind CSS and Shadcn/ui. Ready for high-ticket SaaS."
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Pre-configured Auth",
    description: "Secure authentication via NextAuth.js with Google, GitHub, and email providers pre-integrated."
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Stripe Subscriptions",
    description: "Complete billing logic with Stripe Checkout and webhooks. Manage plans and customer portals easily."
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Robust Prisma ORM",
    description: "Type-safe database access with Prisma. Migrations, seeding, and relationship management made simple."
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "SEO Optimized",
    description: "Dynamic sitemaps, metadata API, and structured data built-in for maximum search visibility."
  }
];

const codeSnippets = [
  {
    title: "NextAuth Configuration",
    code: `import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db';

export const authOptions: AuthOptions = {
  // Use Prisma adapter to persist user accounts and sessions
  adapter: PrismaAdapter(prisma),
  providers: [
    // Configure OAuth providers with environment variables
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    })
  ],
  // Use JWT for session management (stateless)
  session: { 
    strategy: 'jwt' 
  },
  // Custom auth pages
  pages: { 
    signIn: '/login' 
  }
};`,
    description: "Secure, scalable NextAuth setup utilizing the Prisma adapter and multiple providers."
  },
  {
    title: "Stripe Checkout Action",
    code: `'use server';

import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Securely generates a Stripe Checkout session for subscriptions.
 * Only accessible to authenticated users.
 */
export async function createCheckoutSession(priceId: string) {
  // 1. Verify user authentication on the server
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  // 2. Create the Stripe checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: session.user.email,
    line_items: [
      { 
        price: priceId, 
        quantity: 1 
      }
    ],
    // Redirect URLs after payment attempt
    success_url: \`\${process.env.APP_URL}/dashboard?success=true\`,
    cancel_url: \`\${process.env.APP_URL}/pricing\`
  });

  return { url: checkoutSession.url };
}`,
    description: "Type-safe Server Action to securely generate a Stripe Checkout session."
  }
];

interface GitHubProfile {
  name: string;
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  bio: string;
}

export default function App() {
  const [activeSnippet, setActiveSnippet] = useState(0);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'profile'>('landing');

  useEffect(() => {
    fetch('/api/github/profile')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProfile(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen font-sans bg-grid">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView('landing')}
          >
            <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">LaunchFast</span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {profile ? (
              <div 
                className={`flex items-center gap-3 px-3 py-1.5 glass rounded-full border-brand-purple/20 cursor-pointer transition-all hover:bg-white/5 ${view === 'profile' ? 'bg-white/10 border-brand-purple/50' : ''}`}
                onClick={() => setView('profile')}
              >
                <img src={profile.avatar_url} alt={profile.name} className="w-6 h-6 rounded-full border border-white/20" referrerPolicy="no-referrer" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold leading-none">{profile.name}</span>
                  <span className="text-[8px] text-white/40 leading-none">@{profile.login}</span>
                </div>
              </div>
            ) : loading ? (
              <div className="w-24 h-8 glass animate-pulse rounded-full" />
            ) : null}
            
            <div className="h-4 w-px bg-white/10 mx-2" />
            
            <div className="flex items-center gap-8 text-sm font-medium text-white/60">
              <button 
                onClick={() => setView('landing')}
                className={`hover:text-white transition-colors ${view === 'landing' ? 'text-white' : ''}`}
              >
                Home
              </button>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <button 
                onClick={() => setView('profile')}
                className={`hover:text-white transition-colors ${view === 'profile' ? 'text-white' : ''}`}
              >
                Profile
              </button>
              <button className="px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {view === 'landing' ? (
          <>
            {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-purple/50 via-transparent to-transparent blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-bold tracking-widest uppercase text-brand-purple mb-6">
              The Premium SaaS Boilerplate
            </span>
            <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
              LAUNCH <span className="text-brand-purple italic">FAST</span>.<br />
              SCALE <span className="text-glow">BEYOND</span>.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-10 leading-relaxed">
              A high-ticket full-stack TypeScript framework designed to save developers hundreds of hours. 
              Next.js 15, Tailwind, Shadcn, NextAuth, Stripe, and Prisma.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-brand-purple text-white rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2">
                Get Instant Access <ChevronRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 glass text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                View Demo <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Futuristic Display Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="aspect-video glass rounded-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full p-8 flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    <div className="ml-4 px-3 py-1 glass rounded text-[10px] font-mono text-white/40">localhost:3000</div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 flex-1">
                    <div className="col-span-3 glass rounded-xl p-4 flex flex-col gap-3">
                      <div className="h-4 w-2/3 bg-white/10 rounded" />
                      <div className="h-4 w-full bg-white/10 rounded" />
                      <div className="h-4 w-1/2 bg-white/10 rounded" />
                      <div className="mt-auto h-10 w-full bg-brand-purple/20 rounded-lg border border-brand-purple/30" />
                    </div>
                    <div className="col-span-9 glass rounded-xl p-6 flex flex-col gap-6">
                      <div className="flex justify-between items-center">
                        <div className="h-8 w-1/3 bg-white/10 rounded" />
                        <div className="h-8 w-20 bg-white/10 rounded-full" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {[1,2,3].map(i => (
                          <div key={i} className="h-32 glass rounded-lg p-4 flex flex-col justify-end gap-2">
                            <div className="h-2 w-1/2 bg-white/10 rounded" />
                            <div className="h-4 w-full bg-white/10 rounded" />
                          </div>
                        ))}
                      </div>
                      <div className="h-32 w-full bg-white/5 rounded-lg border border-white/5" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Tech Badges */}
              <div className="absolute -top-6 -right-6 glass p-4 rounded-2xl shadow-2xl animate-bounce">
                <Cpu className="w-8 h-8 text-brand-cyan" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl shadow-2xl animate-pulse">
                <Layers className="w-8 h-8 text-brand-purple" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Engineered for Excellence</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Everything you need to build, launch, and scale your next big idea with confidence.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="glass p-8 rounded-3xl hover:border-brand-purple/50 transition-all group"
              >
                <div className="w-12 h-12 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-brand-purple mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture & Code */}
      <section id="architecture" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">Modular. Scalable. <br /><span className="text-brand-purple">Type-Safe.</span></h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-brand-cyan" /></div>
                <div>
                  <h4 className="font-bold text-lg">Next.js 15 App Router</h4>
                  <p className="text-white/50">Leveraging Server Components and Actions for maximum performance and security.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-brand-cyan" /></div>
                <div>
                  <h4 className="font-bold text-lg">Feature-Based Architecture</h4>
                  <p className="text-white/50">Strictly separated concerns: UI in components/, business logic in lib/, and data in server/.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-brand-cyan" /></div>
                <div>
                  <h4 className="font-bold text-lg">Zero-Config Deployment</h4>
                  <p className="text-white/50">Optimized for Vercel with automatic edge functions and environment validation.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 glass rounded-2xl border-l-4 border-brand-purple">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-5 h-5 text-brand-purple" />
                <span className="text-sm font-mono font-bold">Performance Strategy</span>
              </div>
              <p className="text-sm text-white/60 italic">"Lighthouse score of 95+ across Performance, Accessibility, Best Practices, and SEO. API endpoints respond in under 200ms."</p>
            </div>
          </div>

          <div className="glass rounded-3xl overflow-hidden border-white/10 shadow-2xl">
            <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border-b border-white/10">
              {codeSnippets.map((snippet, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSnippet(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeSnippet === idx ? 'bg-brand-purple text-white' : 'text-white/40 hover:text-white'}`}
                >
                  {snippet.title}
                </button>
              ))}
            </div>
            <div className="p-8 font-mono text-sm overflow-x-auto">
              <AnimatePresence mode="wait">
                <motion.pre
                  key={activeSnippet}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-white/80"
                >
                  <code>{codeSnippets[activeSnippet].code}</code>
                </motion.pre>
              </AnimatePresence>
            </div>
            <div className="px-8 py-4 bg-black/40 border-t border-white/10">
              <p className="text-xs text-white/40">{codeSnippets[activeSnippet].description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section id="pricing" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-purple/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-3xl mx-auto text-center glass p-12 md:p-20 rounded-[3rem] border-brand-purple/20">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">Ready to Ship?</h2>
          <p className="text-xl text-white/60 mb-12">
            Join 500+ developers launching SaaS products in days, not months. 
            One-time payment. Lifetime updates.
          </p>
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">$199</span>
              <span className="text-white/40 line-through text-2xl">$499</span>
            </div>
            <button className="w-full max-w-sm px-8 py-5 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]">
              Get LaunchFast Now
            </button>
            <p className="text-sm text-white/40 flex items-center gap-2">
              <Shield className="w-4 h-4" /> 14-day money-back guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-brand-purple fill-brand-purple" />
            <span className="font-display font-bold text-lg">LaunchFast</span>
          </div>
          <div className="flex gap-8 text-white/40 text-sm">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Components</a>
            <a href="#" className="hover:text-white transition-colors">License</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="mt-12 text-center text-white/20 text-xs">
          © 2026 LaunchFast TS Framework. Built for high-performance SaaS.
        </div>
      </footer>
          </>
        ) : (
          <Profile />
        )}
      </main>
    </div>
  );
}
