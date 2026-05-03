import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, BarChart3, Users, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="h-20 border-b border-black/5 flex items-center justify-between px-8 md:px-16 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight">TeamSync</span>
        </div>
        <div className="flex items-center space-x-8">
          <Link to="/login" className="text-sm font-medium hover:text-black/60 transition-colors">Login</Link>
          <Link to="/login" className="bg-black text-white px-5 py-2 text-sm font-bold hover:bg-black/80 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-8 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 bg-black/5 border border-black/10 text-xs font-bold uppercase tracking-widest mb-6">
              Productivity Redefined
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-[1.1] mb-8">
              Manage your tasks <br />
              <span className="text-black/40">with precision.</span>
            </h1>
            <p className="text-xl text-black/60 leading-relaxed mb-10 max-w-lg">
              The minimalist workspace for modern teams. Track projects, assign tasks, and collaborate in real-time with zero friction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="bg-black text-white px-8 py-4 text-lg font-bold flex items-center justify-center hover:gap-3 transition-all group">
                Try for Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 text-lg font-bold border border-black/10 hover:bg-black/5 transition-colors">
                View Demo
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-black/5 p-4 rounded-xl shadow-2xl">
              <img 
                src="/images/hero.png" 
                alt="App Dashboard" 
                className="w-full rounded-lg shadow-sm border border-black/5"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-8 -left-8 bg-white border border-black/10 p-6 shadow-xl hidden md:block max-w-[200px]">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-black" />
                <span className="text-sm font-bold">12 Tasks Done</span>
              </div>
              <p className="text-xs text-black/50">Your team is 40% more productive this week.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-black/2 px-8 md:px-16 border-y border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-6 text-black">Built for high-performance teams</h2>
            <p className="text-black/50 max-w-2xl mx-auto text-lg">Everything you need to ship faster and keep everyone in sync.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Layout, title: "Kanban Boards", desc: "Visualize progress with intuitive drag-and-drop boards." },
              { icon: Users, title: "Team Management", desc: "Manage roles, permissions and workload effortlessly." },
              { icon: BarChart3, title: "Deep Analytics", desc: "Track performance metrics and project health in real-time." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 border border-black/5 bg-white hover:border-black/20 transition-all shadow-sm"
              >
                <div className="w-12 h-12 bg-black flex items-center justify-center mb-6">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{f.title}</h3>
                <p className="text-black/50 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-32 px-8 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 order-2 lg:order-1">
            <div className="bg-black/5 p-4 rounded-xl shadow-lg rotate-1">
              <img 
                src="/images/feature.png" 
                alt="Feature Overview" 
                className="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-8 leading-tight">Focus on what matters, <br />we'll handle the rest.</h2>
            <ul className="space-y-6">
              {[
                "Real-time updates and notifications",
                "Multiple assignees per task",
                "Advanced filtering and search",
                "Mobile responsive design"
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-3 group">
                  <div className="w-6 h-6 bg-black/5 border border-black/10 flex items-center justify-center rounded-full group-hover:bg-black group-hover:text-white transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-medium text-black/70">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/login" className="inline-block mt-12 px-8 py-4 bg-black text-white font-bold hover:bg-black/80 transition-colors">
              Experience it Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-black/10 px-8 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black flex items-center justify-center">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-black">TeamSync</span>
          </div>
          <div className="flex space-x-10 text-sm font-medium text-black/50">
            <a href="#" className="hover:text-black">Features</a>
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Terms</a>
            <a href="#" className="hover:text-black">Contact</a>
          </div>
          <p className="text-sm text-black/40">© 2026 TeamSync. Built by Ankush.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
