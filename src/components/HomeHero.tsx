'use client'

import LiveVideo from './LiveVideo'

interface HomeHeroProps {
  settings: any
}

export default function HomeHero({ settings }: HomeHeroProps) {
  const handleHeroPlay = () => {
    const playBtn = document.querySelector('[data-player-toggle]') as HTMLButtonElement
    if (playBtn) playBtn.click()
  }

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-radio.png" 
          alt="Radio Studio" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-black/40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full">
          <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
          <span className="text-xs font-black uppercase tracking-widest text-primary">Live Now</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none uppercase">
          {settings?.current_show || 'Radio TuniBless'}
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          {settings?.current_host ? `With ${settings.current_host}` : 'Your voice abroad. Connecting Tunisia to the world through premium music and culture.'}
        </p>

        {/* Main Action Area */}
        <div className="flex flex-col items-center gap-8">
          {settings?.live_type === 'facebook' ? (
            <div className="w-full max-w-3xl">
               <LiveVideo facebookUrl={settings.facebook_url || ''} title={settings.current_show} />
            </div>
          ) : settings?.live_type === 'meeting' ? (
            <a 
              href={settings.meeting_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-4 bg-primary text-background-dark px-12 py-6 rounded-3xl font-black text-2xl hover:scale-105 transition-all shadow-2xl shadow-primary/40 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              <span className="material-symbols-outlined text-4xl">video_chat</span>
              <span className="relative">Join Session</span>
            </a>
          ) : (
            <button 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/90 text-background-dark flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-3xl shadow-primary/30 group relative"
              onClick={handleHeroPlay}
            >
              <div className="absolute inset-x-[-20px] inset-y-[-20px] rounded-full border border-primary/20 animate-[ping_3s_infinite]"></div>
              <span className="material-symbols-outlined text-6xl md:text-7xl group-hover:fill-1 transition-all">play_arrow</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 animate-bounce">
        <span className="text-[10px] font-black uppercase tracking-widest">Scroll Down</span>
        <span className="material-symbols-outlined">expand_more</span>
      </div>
    </section>
  )
}
