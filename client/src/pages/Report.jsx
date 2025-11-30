import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, Upload, AlertTriangle, FileText, User } from 'lucide-react';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const Report = () => {
    const [step, setStep] = useState(1);
    const [auth, setAuth] = useState({
        roblox: null,
        discord: null
    });
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Auth Handlers
    const handleRobloxAuth = () => {
        // Just validate username is not empty
        if (auth.roblox?.username) {
            sessionStorage.setItem('roblox_auth', JSON.stringify(auth.roblox));
            setStep(2);
        } else {
            alert('Inserisci il tuo nome utente Roblox');
        }
    };

    const handleDiscordAuth = () => {
        // Redirect to Backend OAuth
        window.location.href = 'http://localhost:3000/api/auth/discord/login';
    };

    // Check for Discord Callback & Restore Roblox Auth on Mount
    useEffect(() => {
        // Restore Roblox Auth
        const savedRoblox = sessionStorage.getItem('roblox_auth');
        let robloxUser = null;
        if (savedRoblox) {
            try {
                robloxUser = JSON.parse(savedRoblox);
                setAuth(prev => ({ ...prev, roblox: robloxUser }));
            } catch (e) {
                console.error('Failed to parse saved roblox data', e);
            }
        }

        // Handle Discord Callback
        const params = new URLSearchParams(window.location.search);
        const discordData = params.get('discord_auth');
        if (discordData) {
            try {
                const user = JSON.parse(decodeURIComponent(discordData));
                setAuth(prev => ({
                    ...prev,
                    discord: user,
                    roblox: robloxUser || prev.roblox // Ensure roblox is preserved/restored
                }));

                // Only skip to step 3 if we have BOTH
                if (robloxUser) {
                    setStep(3);
                } else {
                    // If we have discord but lost roblox, go to step 1
                    setStep(1);
                }

                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {
                console.error('Failed to parse discord data', e);
            }
        } else if (savedRoblox) {
            // If we have roblox but no discord yet, go to step 2
            setStep(2);
        }
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (!auth.discord || !auth.roblox) {
                setError('Autenticazione mancante. Per favore ricarica la pagina e riprova.');
                setIsSubmitting(false);
                return;
            }

            const data = new FormData();
            data.append('discordId', auth.discord.id);
            data.append('discordUsername', auth.discord.username);
            data.append('robloxUsername', auth.roblox.username);
            data.append('title', formData.title);
            data.append('description', formData.description);
            files.forEach(file => {
                data.append('evidence', file);
            });

            await api.post('/report/submit', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Clear session storage on success
            sessionStorage.removeItem('roblox_auth');
            setIsSuccess(true);
        } catch (err) {
            console.error('Submission failed', err);
            const errorMessage = err.response?.data?.error || 'Si è verificato un errore durante l\'invio della segnalazione. Riprova.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <div className="bg-agency-gray p-8 rounded-lg border border-green-500/30 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Segnalazione Inviata</h2>
                    <p className="text-gray-400 mb-6">
                        La tua segnalazione è stata registrata con successo nei nostri sistemi sicuri.
                    </p>
                    <div className="bg-agency-dark p-4 rounded mb-6 text-left">
                        <p className="text-sm text-gray-500 mb-2">PROSSIMI PASSI:</p>
                        <p className="text-white text-sm">
                            Assicurati di essere nel server Discord del dipartimento per visualizzare il tuo ticket.
                        </p>
                        <a href="https://discord.gg/mpHka7NDtc" target="_blank" rel="noopener noreferrer" className="text-agency-accent hover:underline text-sm block mt-2">
                            Unisciti al Server Discord &rarr;
                        </a>
                    </div>
                    <button onClick={() => window.location.reload()} className="text-gray-400 hover:text-white text-sm">
                        Torna alla Home
                    </button>
                </div>
            </div>
        );
    }

    // Error Modal
    if (error) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-agency-gray p-8 rounded-lg border border-red-500/30 max-w-md w-full text-center"
                >
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Attenzione</h2>
                    <p className="text-gray-300 mb-8 text-sm leading-relaxed">
                        {error}
                    </p>
                    <button
                        onClick={() => setError(null)}
                        className="w-full py-3 bg-agency-accent hover:bg-red-700 text-white font-bold rounded transition-colors"
                    >
                        Chiudi
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Nuova Segnalazione</h1>
                    <p className="text-gray-400">Compila il modulo sottostante per inviare una segnalazione sicura all'agenzia.</p>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10"></div>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-agency-accent text-white' : 'bg-agency-gray text-gray-500 border border-white/10'}`}>
                            {s}
                        </div>
                    ))}
                </div>

                <div className="bg-agency-gray border border-white/5 rounded-xl p-8 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <User className="text-agency-accent" /> Identificazione Roblox
                                </h2>
                                <p className="text-gray-400 mb-8">Inserisci il tuo nome utente Roblox per procedere.</p>
                                <input
                                    type="text"
                                    placeholder="Nome Utente Roblox"
                                    className="w-full bg-agency-dark border border-white/10 rounded p-4 text-white mb-6 focus:border-agency-accent focus:outline-none"
                                    onChange={(e) => setAuth(prev => ({ ...prev, roblox: { username: e.target.value } }))}
                                />
                                <button
                                    onClick={handleRobloxAuth}
                                    className="w-full py-4 bg-[#000000] hover:bg-gray-900 text-white font-bold rounded flex items-center justify-center gap-3 transition-colors border border-white/10"
                                >
                                    Conferma Nome Utente
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <User className="text-[#5865F2]" /> Autenticazione Discord
                                </h2>
                                <p className="text-gray-400 mb-8">Verifica il tuo account Discord per continuare.</p>
                                {auth.discord ? (
                                    <div className="bg-green-500/20 border border-green-500/50 p-4 rounded mb-6 flex items-center gap-3">
                                        <Check className="text-green-500" />
                                        <span className="text-white">Connesso come {auth.discord.username}</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleDiscordAuth}
                                        className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded flex items-center justify-center gap-3 transition-colors"
                                    >
                                        Connetti con Discord
                                    </button>
                                )}
                                {auth.discord && (
                                    <button
                                        onClick={() => setStep(3)}
                                        className="w-full py-4 bg-agency-accent hover:bg-red-700 text-white font-bold rounded transition-colors mt-4"
                                    >
                                        Avanti
                                    </button>
                                )}
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <FileText className="text-agency-accent" /> Dettagli Segnalazione
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Titolo Segnalazione</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-agency-dark border border-white/10 rounded p-3 text-white focus:border-agency-accent focus:outline-none"
                                            placeholder="Es. Comportamento sospetto in gioco"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Descrizione Dettagliata</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-agency-dark border border-white/10 rounded p-3 text-white h-32 focus:border-agency-accent focus:outline-none"
                                            placeholder="Descrivi l'accaduto nei dettagli..."
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (formData.title && formData.description) setStep(4);
                                            else alert('Compila tutti i campi');
                                        }}
                                        className="w-full py-3 bg-agency-accent hover:bg-red-700 text-white font-bold rounded transition-colors"
                                    >
                                        Avanti
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Upload className="text-agency-accent" /> Prove e Allegati
                                </h2>
                                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 md:p-12 text-center hover:border-agency-accent transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-300 font-medium">Clicca o trascina i file qui</p>
                                    <p className="text-gray-500 text-sm mt-2">Supporta immagini e documenti</p>
                                </div>
                                {files.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {files.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-300 bg-white/5 p-2 rounded">
                                                <FileText className="w-4 h-4" /> {f.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <button
                                    onClick={() => {
                                        if (files.length > 0) setStep(5);
                                        else alert('Allega almeno una prova');
                                    }}
                                    className="w-full mt-6 py-3 bg-agency-accent hover:bg-red-700 text-white font-bold rounded transition-colors"
                                >
                                    Avanti
                                </button>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-xl font-bold text-white mb-6">Riepilogo e Invio</h2>
                                <div className="bg-agency-dark p-6 rounded border border-white/10 space-y-4 mb-6">
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Utente Roblox</span>
                                        <p className="text-white">{auth.roblox?.username}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Utente Discord</span>
                                        <p className="text-white">{auth.discord?.username}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Titolo</span>
                                        <p className="text-white">{formData.title}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-xs uppercase">Prove</span>
                                        <p className="text-white">{files.length} file allegati</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-yellow-500/10 p-4 rounded border border-yellow-500/20 mb-6">
                                    <AlertTriangle className="text-yellow-500 w-6 h-6 flex-shrink-0" />
                                    <p className="text-yellow-200 text-sm">
                                        Inviando questa segnalazione, confermi che tutte le informazioni sono veritiere. L'abuso di questo sistema comporterà sanzioni.
                                    </p>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded transition-colors flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <LoadingSpinner size="sm" text="" />
                                            <span>Invio in corso...</span>
                                        </>
                                    ) : (
                                        'Invia Segnalazione'
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Report;
