import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/report', label: 'Segnalazioni' }
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-agency-dark/90 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="https://media.discordapp.net/attachments/1249805234843156521/1443689918663491636/image.png?ex=692d4843&is=692bf6c3&hm=0a037f74f7032e603eac37277a1b2b0b2073bb6faa411ae5863312df269d1b8d&=&format=webp&quality=lossless&width=960&height=960"
                            alt="DIS Logo"
                            className="h-10 w-10 transition-transform group-hover:scale-110"
                        />
                        <span className="text-white font-bold text-lg tracking-wide hidden md:block">
                            Dipartimento delle Informazione per la Sicurezza
                        </span>
                        <span className="text-white font-bold text-lg tracking-wide md:hidden">
                            D.I.S.
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8">
                        {navLinks.map(({ path, label }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`relative text-sm font-medium uppercase tracking-widest transition-colors ${isActive(path)
                                    ? 'text-white'
                                    : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                {label}
                                {isActive(path) && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-agency-accent"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white hover:text-agency-accent transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-agency-gray/95 backdrop-blur-lg border-t border-white/10"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map(({ path, label }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-sm font-medium uppercase tracking-widest transition-colors ${isActive(path)
                                        ? 'text-white bg-agency-accent/20 border-l-4 border-agency-accent'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
