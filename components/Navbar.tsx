'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Home, Zap, BookOpen, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              AlgoViz
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/?category=sorting"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Sorting
            </Link>
            <Link
              href="/?category=searching"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              Search
            </Link>
            <Link
              href="/?category=graph"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              Graphs
            </Link>
            <Link
              href="/?category=dp"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              DP
            </Link>
            <Link
              href="/?mode=interview"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Briefcase className="w-4 h-4" />
              Interview Prep
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary/50 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronDown
              className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border/50 mt-4 pt-4">
            <Link
              href="/"
              className="block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/?category=sorting"
              className="block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Sorting
            </Link>
            <Link
              href="/?category=searching"
              className="block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Searching
            </Link>
            <Link
              href="/?category=graph"
              className="block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Graphs
            </Link>
            <Link
              href="/?category=dp"
              className="block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dynamic Programming
            </Link>
            <Link
              href="/?category=string"
              className="block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              String Matching
            </Link>
            <Link
              href="/?mode=interview"
              className="block px-4 py-2 rounded-lg hover:bg-secondary/50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Interview Prep
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
