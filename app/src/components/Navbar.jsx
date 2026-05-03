import React from 'react';
import { Menu } from 'lucide-react';

const Navbar = ({ title }) => {
  return (
    <header className="h-16 border-b border-black/10 flex items-center px-8 sticky top-0 z-10 bg-white dark:bg-[#111] dark:border-white/10">
      <button className="lg:hidden p-2 -ml-2 mr-3 text-black/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10">
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-bold font-display text-black dark:text-white">{title}</h1>
    </header>
  );
};

export default Navbar;
