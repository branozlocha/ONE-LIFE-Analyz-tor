import React, { useState, useRef } from 'react';
import { Logo } from './components/Logo';
import { analyzePropertyListing } from './services/geminiService';
import { ArrowRight, CheckCircle2, Building2, Sparkles, XCircle, Quote } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState<'input' | 'analyzing' | 'result'>('input');
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setStep('analyzing');
    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const stream = analyzePropertyListing(url);
      
      setStep('result');
      
      for await (const chunk of stream) {
        setAnalysis(prev => prev + chunk);
        if (resultRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        }
      }
    } catch (error) {
      setAnalysis("Ospravedlňujeme sa, ale momentálne sa nepodarilo spojiť s analytickým centrom. Skúste to prosím neskôr alebo skontrolujte správnosť odkazu.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setStep('input');
    setUrl('');
    setAnalysis('');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-200 relative overflow-x-hidden font-sans selection:bg-gold-500/30 selection:text-gold-100">
      
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center min-h-screen relative z-10">
        
        {/* Logo Transition */}
        <div 
          className={`transition-all duration-1000 ease-in-out ${
            step === 'input' ? 'mb-12 md:mb-20 scale-100' : 'mb-8 scale-75 opacity-80'
          }`}
        >
          <Logo />
        </div>

        {/* Input State */}
        {step === 'input' && (
          <div className="w-full max-w-2xl animate-fade-in-up">
            <div className="text-center mb-12">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4 tracking-tight">
                Real Estate <span className="text-gold-400">Intelligence</span>
              </h1>
              <p className="text-slate-400 font-light text-sm md:text-base tracking-wide max-w-md mx-auto leading-relaxed">
                Vložte odkaz na inzerát pre získanie expertnej analýzy nehnuteľnosti v Bratislave.
              </p>
            </div>

            <form onSubmit={handleAnalyze} className="relative group w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-500 to-amber-700 rounded-xl opacity-20 group-hover:opacity-50 blur transition duration-700"></div>
              <div className="relative flex items-center bg-navy-900/90 backdrop-blur-sm rounded-xl p-2 border border-slate-700/50 shadow-2xl transition-all duration-300 focus-within:border-gold-500/50">
                <div className="pl-4 text-gold-500">
                  <Building2 size={20} strokeWidth={1.5} />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.nehnutelnosti.sk/..."
                  className="w-full bg-transparent border-none text-slate-100 placeholder-slate-600 focus:ring-0 py-4 px-4 font-light text-sm md:text-base"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!url || isAnalyzing}
                  className={`
                    px-6 md:px-8 py-3 rounded-lg font-bold text-sm tracking-wide transition-all duration-300 flex items-center gap-2
                    ${url 
                      ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02]' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="hidden md:inline">ANALYZOVAŤ</span>
                  <span className="md:hidden">GO</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
            
            <div className="mt-16 flex justify-center gap-8 md:gap-16 text-[10px] md:text-xs text-slate-500 uppercase tracking-[0.2em] font-medium">
              <span className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <CheckCircle2 size={16} className="text-gold-500"/> 
                Lokalita
              </span>
              <span className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <CheckCircle2 size={16} className="text-gold-500"/> 
                Cena
              </span>
              <span className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <CheckCircle2 size={16} className="text-gold-500"/> 
                Potenciál
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center mt-10 animate-fade-in">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 border-t-2 border-gold-400 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-2 border-gold-600/50 rounded-full animate-spin animation-delay-150"></div>
              <div className="absolute inset-4 border-b-2 border-gold-200/30 rounded-full animate-spin animation-delay-300"></div>
            </div>
            <h2 className="text-xl font-bold text-gold-100 mb-2 tracking-wide">Analyzujem nehnuteľnosť</h2>
            <p className="text-slate-400 text-sm font-light">Zbieram dáta, porovnávam trhové ceny...</p>
          </div>
        )}

        {/* Result State */}
        {(step === 'result' || analysis) && (
          <div ref={resultRef} className="w-full max-w-4xl mt-4 animate-fade-in pb-20">
            <div className="glass-panel rounded-xl md:rounded-2xl p-8 md:p-16 shadow-2xl relative overflow-hidden">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-6 border-b border-slate-700/30 gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gold-500/10 p-3 rounded-full">
                    <Sparkles size={24} className="text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-gold-400 uppercase tracking-[0.2em]">ONE LIFE Report</h3>
                    <p className="text-xs text-slate-500 truncate max-w-[200px] md:max-w-sm font-light mt-1">{url}</p>
                  </div>
                </div>
                <button 
                  onClick={resetApp}
                  className="text-xs border border-slate-700 hover:border-gold-500/50 text-slate-400 hover:text-gold-200 px-6 py-3 rounded-lg uppercase tracking-widest transition-all bg-navy-900/50 font-medium hover:bg-navy-800"
                >
                  Nová Analýza
                </button>
              </div>

              {/* Content */}
              <div className="prose prose-invert prose-lg max-w-none space-y-10">
                 <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => (
                        <div className="mb-10">
                          <h1 className="font-bold text-3xl md:text-4xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-100 to-gold-400 tracking-tight leading-tight" {...props} />
                          <div className="h-1 w-20 bg-gold-500 rounded-full"></div>
                        </div>
                      ),
                      h2: ({node, ...props}) => {
                          const text = String(props.children).toLowerCase();
                          let icon = <div className="w-1.5 h-8 bg-gold-500 mr-4 rounded-full"></div>;
                          let textColor = "text-gold-100";
                          let containerClass = "mt-12 mb-6";
                          
                          if (text.includes('silné') || text.includes('plus')) {
                            icon = <CheckCircle2 size={28} className="text-emerald-500 mr-4" strokeWidth={1.5} />;
                            textColor = "text-emerald-50";
                          } else if (text.includes('slabé') || text.includes('mínus')) {
                            icon = <XCircle size={28} className="text-rose-500 mr-4" strokeWidth={1.5} />;
                            textColor = "text-rose-50";
                          } else if (text.includes('verdikt')) {
                            containerClass = "mt-16 mb-8 pt-8 border-t border-slate-800";
                            icon = <Sparkles size={28} className="text-gold-400 mr-4" />;
                            textColor = "text-gold-200";
                          }

                          return (
                            <div className={`flex items-center ${containerClass}`}>
                              {icon}
                              <h2 className={`font-bold text-2xl md:text-3xl m-0 tracking-tight ${textColor}`} {...props} />
                            </div>
                          )
                      },
                      h3: ({node, ...props}) => <h3 className="font-semibold text-lg text-gold-200 mt-8 mb-3 tracking-wide uppercase text-xs" {...props} />,
                      strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                      p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed font-light mb-6 text-lg text-justify" {...props} />,
                      ul: ({node, ...props}) => <ul className="space-y-4 my-6 bg-navy-900/50 p-6 md:p-8 rounded-2xl border border-slate-800/50 shadow-inner" {...props} />,
                      li: ({node, ...props}) => (
                        <li className="flex items-start text-slate-300 group">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-500 mt-2.5 mr-3 group-hover:scale-150 transition-transform"></span>
                          <span className="leading-relaxed">{props.children}</span>
                        </li>
                      ),
                      blockquote: ({node, ...props}) => (
                        <div className="my-10 relative pl-8 md:pl-12 py-2">
                          <Quote className="absolute left-0 top-0 text-gold-600/30 w-8 h-8 transform -scale-x-100" />
                          <blockquote className="text-xl md:text-2xl font-medium italic text-gold-100 leading-relaxed font-serif border-l-4 border-gold-500 pl-6" {...props} />
                        </div>
                      ),
                      a: ({node, ...props}) => <a className="text-gold-400 underline decoration-gold-500/30 hover:decoration-gold-500 transition-all font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                    }}
                  >
                    {analysis}
                  </ReactMarkdown>
              </div>

              {/* Footer */}
              <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col items-center gap-4">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-medium text-center">
                  ONE LIFE Real Estate Intelligence
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;