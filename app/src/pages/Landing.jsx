import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, CheckCircle, BarChart3, Users, Layout, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="h-20 flex items-center justify-between px-8 md:px-24 bg-white z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black flex items-center justify-center rounded-lg shadow-lg shadow-black/10">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskFlow</span>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/login" className="bg-[#111] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition-all shadow-lg shadow-black/5">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-32 px-8 md:px-24 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-left"
          >

            
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8">
              The intelligent task manager <br /> for modern teams
            </h1>
            
            <p className="text-lg text-black/50 leading-relaxed mb-10 max-w-lg">
              Manage complex projects, track tasks with multiple assignees, and filter through your workload with zero friction. Built for teams that demand precision.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 mb-12">
              <Link to="/login" className="bg-[#111] text-white px-8 py-4 rounded-xl text-[15px] font-bold flex items-center justify-center group hover:bg-black transition-all shadow-xl shadow-black/10">
                Get Started <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center space-x-2 text-[15px] font-bold text-black/60 hover:text-black transition-colors group">
                <span>Learn More</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-4 border-white overflow-hidden bg-gray-100 flex items-center justify-center`}>
                     <Users className="w-4 h-4 text-black/20" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-black/40 font-medium">
                Trusted by high-performance teams globally.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative bg-black/5 p-2 rounded-[2rem] shadow-2xl">
              <img 
                src="/images/hero_new.png" 
                alt="TaskFlow Dashboard" 
                className="w-full rounded-[1.5rem] shadow-sm border border-black/5"
              />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-2xl border border-black/5 max-w-[180px] hidden md:block"
              >
                <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold mb-1">Task Completion</p>
                <div className="flex items-baseline space-x-1 mb-2">
                  <span className="text-3xl font-bold">100%</span>
                </div>
                <div className="flex items-center text-[11px] font-bold text-black">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span>Real-time Sync Active</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section Title */}
      <section className="py-24 border-t border-black/5 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-black/40 mb-6 block">Optimised Workflow</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Built for team productivity</h2>
          <p className="text-black/50 text-lg max-w-2xl mx-auto">All the essentials in one place — designed for speed and clarity.</p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="pb-32 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Layout, title: "Dynamic Boards", desc: "Interactive Kanban boards with real-time status updates and smooth transitions.", color: "bg-black" },
            { icon: Users, title: "Team Collaboration", desc: "Assign multiple members to a single task and manage team workloads seamlessly.", color: "bg-black" },
            { icon: Zap, title: "Smart Filters", desc: "Advanced client-side filtering by project, priority, and assignee for instant focus.", color: "bg-black" }
          ].map((f, i) => (
            <div key={i} className="p-10 bg-white border border-black/5 rounded-3xl hover:shadow-xl hover:border-black/10 transition-all group">
              <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-black/5`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{f.title}</h3>
              <p className="text-black/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-black/10 px-8 md:px-24 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black flex items-center justify-center rounded-md">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-black">TaskFlow</span>
          </div>
          <p className="text-sm text-black/40">© 2026 TaskFlow. Engineered for teams.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
