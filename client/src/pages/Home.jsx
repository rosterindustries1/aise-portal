import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Shield, Zap, Lock, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className="border-b border-white/10 overflow-hidden"
            initial={false}
        >
            <button
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-white group-hover:text-agency-accent transition-colors">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="text-agency-accent" />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <div className="pb-6 text-gray-400 leading-relaxed">
                    {answer}
                </div>
            </motion.div>
        </motion.div>
    );
};

const Counter = ({ target, label }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const isPercentage = label.includes('%');
        const numericTarget = isPercentage ? parseInt(target) : target;

        if (typeof numericTarget !== 'number') {
            setCount(target);
            return;
        }

        const duration = 2000;
        const steps = 60;
        const increment = numericTarget / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numericTarget) {
                setCount(numericTarget);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [target, label]);

    return (
        <div className="text-center p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="text-4xl font-bold text-agency-accent mb-2">
                {typeof count === 'number' ? count : count}{label.includes('%') ? '%' : ''}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">{label.replace('%', '')}</div>
        </div>
    );
};

const Home = () => {
    return (
        <div className="min-h-screen pt-16">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-agency-dark via-agency-dark/50 to-agency-dark"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(196,30,58,0.1),transparent_50%)]"></div>
                    <div className="w-full h-full bg-[url('https://media.discordapp.net/attachments/1249805234843156521/1443689918663491636/image.png?ex=692bf6c3&is=692aa543&hm=b67722e02e03e8c6e5099bc819d478ecfb6aab32a3cef6c1ad7c56364bc22af0&=&format=webp&quality=lossless&width=960&height=960')] bg-cover bg-center opacity-10 blur-sm"></div>

                    {/* Animated particles effect */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-agency-accent/30 rounded-full"
                                initial={{
                                    x: Math.random() * window.innerWidth,
                                    y: Math.random() * window.innerHeight
                                }}
                                animate={{
                                    y: [null, -100],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                        src="https://media.discordapp.net/attachments/1249805234843156521/1443688347922075802/erasebg-transformed_29-1.png?ex=692bf54c&is=692aa3cc&hm=320e26ac732a0a60ed398262751cbbfe59a92c4ecf728141a6c77dbd3119910c&=&format=webp&quality=lossless&width=960&height=960"
                        alt="AISE Logo"
                        className="w-56 h-56 mx-auto mb-12 drop-shadow-2xl"
                    />
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tighter leading-tight"
                    >
                        AGENZIA INFORMAZIONI E{' '}
                        <span className="text-agency-accent bg-clip-text">
                            SICUREZZA ESTERNA
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light"
                    >
                        Proteggere gli interessi nazionali attraverso l'intelligence e la sicurezza operativa.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link to="/report">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-8 py-4 bg-agency-accent hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-agency-accent/50 hover:shadow-agency-accent/80 flex items-center gap-2"
                            >
                                <span>Apri Segnalazione</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                        <a href="https://discord.gg/mpHka7NDtc" target="_blank" rel="noopener noreferrer">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-all duration-300 border border-white/20 backdrop-blur-sm"
                            >
                                Unisciti al Server
                            </motion.button>
                        </a>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-white/50 cursor-pointer"
                    >
                        <ChevronDown className="w-8 h-8" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-agency-gray border-y border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Counter target="24/7" label="Sorveglianza" />
                        <Counter target={100} label="% Dedizione" />
                        <Counter target="100" label="Sicurezza" />
                        <Counter target="∞" label="Vigilanza" />
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-24 bg-agency-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-6 border-l-4 border-agency-accent pl-6">
                                CHI SIAMO
                            </h2>
                            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                                L'A.I.S.E. è l'agenzia di intelligence responsabile della salvaguardia della sicurezza nazionale contro le minacce provenienti dall'estero. Operiamo con discrezione, precisione e dedizione assoluta.
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                Il nostro mandato include lo spionaggio, il controspionaggio e le operazioni speciali volte a neutralizzare le minacce prima che possano colpire.
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid grid-cols-2 gap-6"
                        >
                            {[
                                { icon: Shield, label: 'Protezione' },
                                { icon: Eye, label: 'Sorveglianza' },
                                { icon: Lock, label: 'Sicurezza' },
                                { icon: Zap, label: 'Risposta Rapida' }
                            ].map(({ icon: Icon, label }, i) => (
                                <motion.div
                                    key={label}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-agency-accent/50 transition-all duration-300 text-center group"
                                >
                                    <Icon className="w-12 h-12 text-agency-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <p className="text-white font-medium">{label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-agency-gray">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-center text-white mb-16"
                    >
                        DOMANDE FREQUENTI
                    </motion.h2>
                    <div className="space-y-2">
                        <FAQItem
                            question="Come posso entrare nell'agenzia?"
                            answer="Il reclutamento avviene tramite selezione rigorosa. Unisciti al nostro server Discord per monitorare le aperture dei bandi di concorso."
                        />
                        <FAQItem
                            question="Cosa devo fare se ho informazioni sensibili?"
                            answer="Utilizza la sezione 'Segnalazioni' di questo sito. Tutte le comunicazioni sono criptate e gestite con la massima riservatezza."
                        />
                        <FAQItem
                            question="Quali sono i requisiti minimi?"
                            answer="Essere nel gruppo roblox del server di MMI, non essere blacklistato e avere una testa."
                        />
                        <FAQItem
                            question="Come posso contattare l'agenzia?"
                            answer="Attraverso il sistema di segnalazioni presente su questo sito."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-16 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Shield className="h-8 w-8 text-agency-accent" />
                                <span className="text-white font-bold text-xl">A.I.S.E.</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Agenzia Informazioni e Sicurezza Esterna - Proteggendo gli interessi nazionali 24/7.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Collegamenti</h4>
                            <div className="space-y-2">
                                <Link to="/" className="block text-gray-400 hover:text-white transition-colors text-sm">Home</Link>
                                <Link to="/report" className="block text-gray-400 hover:text-white transition-colors text-sm">Segnalazioni</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Community</h4>
                            <div className="space-y-2">
                                <a href="https://discord.gg/mpHka7NDtc" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-[#5865F2] transition-colors text-sm">
                                    Discord Server
                                </a>
                                <a href="https://www.roblox.com/communities/33906662/GC-Servizi-Segreti-Marittimi#!/about" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition-colors text-sm">
                                    Roblox Group
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-8">
                        <p className="text-center text-gray-600 text-sm">
                            © 2025 A.I.S.E. - Agenzia Informazioni e Sicurezza Esterna. Tutti i diritti riservati.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
