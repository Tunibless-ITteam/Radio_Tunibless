import { createClient } from '@/utils/supabase/server'
import LiveVideo from '@/components/LiveVideo'

export default async function Page() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('radio_settings').select('*').single()

  return (
    <div className="bg-background-dark text-white min-h-screen">
      {/* Header Overlay */}
      <header className="absolute top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40">
            <span className="material-symbols-outlined text-background-dark font-black">radio</span>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">TuniBless</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-10">
          <a className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="#">Home</a>
          <a className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="#schedule">Schedule</a>
          <a className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="#news">News</a>
          <button className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Join Us
          </button>
        </nav>

        <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      <main>
        {/* Cinematic Hero */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Background Image / Placeholder */}
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
                /* Standard Audio Play Icon - Large Center */
                <button 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary/90 text-background-dark flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-3xl shadow-primary/30 group relative"
                  onClick={() => {
                    // This will be handled by the sticky player globally
                    // but we can trigger a message or just rely on the player bar
                    const playBtn = document.querySelector('[data-player-toggle]') as HTMLButtonElement
                    if (playBtn) playBtn.click()
                  }}
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

        {/* News / Feed Section */}
        <section className="py-24 bg-background-dark relative" id="news">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex justify-between items-end mb-16">
              <div>
                <span className="text-primary font-black uppercase tracking-widest text-xs mb-4 block">Latest Updates</span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter">News Feed</h2>
              </div>
              <a href="#" className="hidden md:flex items-center gap-2 font-black uppercase tracking-widest text-xs hover:text-primary transition-colors">
                View All <span className="material-symbols-outlined">arrow_right_alt</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature News */}
              <div className="md:col-span-2 group cursor-pointer relative rounded-3xl overflow-hidden aspect-video">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbfNgmg67iFiDiuemEWmEraxrj6x4RtwMbHdIYwmGynG6M1O2M9RZj8cOISVMvZj2nWLVOzI4u-4siQWb7Yq1opvjUP8qebwdLAiL0zdzP0yiTvHQwQfO4gWnV7iIpOCGeQNh030DbmXFPnkyb3p0Nfsa77CQKfcrDgEgEyOikCf2dhpnzSY7H89CJgRsQODk7n4MTHANDZIVJcFyWHeMauoFRZaZAuW_gB2ExSOkanRfr23ML1dQZ34FPm0z7kVyflANr3UCHU3Rz" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="News" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <span className="bg-primary text-black text-[10px] font-black px-2 py-1 rounded w-fit mb-4 uppercase">Expat Life</span>
                  <h3 className="text-3xl font-black mb-4 leading-tight">Mastering the German Job Interview: Tips for Tunesians</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                    <span>MAR 12, 2026</span>
                    <span>•</span>
                    <span>BY HASSAN ALI</span>
                  </div>
                </div>
              </div>

              {/* Smaller News */}
              <div className="flex flex-col gap-8">
                <div className="group cursor-pointer">
                  <div className="h-40 rounded-2xl overflow-hidden mb-4">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-LeEKInlxHYm_wYKRQ85SlxzDEXhrRfd46Fxq4rfDE1H2wvTN4D6w7C4m8f2xiPyFNSC5CVhra6knn2uJAb320T0fVoEFBpsuL7AYWZ3s0tS44aKdlFvpgkDZnzf5YIFVobKvbP0mN1QTRuO8xwuKX6Kzg3ungnXSdJL2L0ALYY7Zul_-dJwtyZCZaBWow10zdbq7VeeFdhiML5oVu0lrk90nuJ7hT3MGJ_AuIEhSQJebgkg1SwSzySZ2yHImZk6m8n0LfpPOSuaV" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Study" />
                  </div>
                  <h4 className="font-black hover:text-primary transition-colors mb-2">Top 5 Cities for International Students in Germany</h4>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Education</span>
                </div>
                <div className="group cursor-pointer">
                  <div className="h-40 rounded-2xl overflow-hidden mb-4">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoZYpN_Z2Y7ISkvE6Fin7qyCuAdXhLS7sIXLG02ym0gZDpWnnqJ2TXZmtFDj9ge4KfyTfux3IOMoSUBpZcuDdl_oaWsJi3WJtlZ1_EiT-w82bxRmxcCpIWw0Rw_sJi603Dlms7dxn67S-h31iQW-8xq69qUILBA_ia2EH2WJqrRAirLok3f11TYmX_Gpj4F_36nT6LqBJgA0CEZCPwWCb19s2AbMLbKl4z_RZwi342Rh0xCdvU1-AKR0n7jOrDDmx7L-IhC4dezrKV" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Finance" />
                  </div>
                  <h4 className="font-black hover:text-primary transition-colors mb-2">Understanding German Health Insurance</h4>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Utility</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Catchy Footer / Join Section */}
        <section className="py-32 bg-slate-950 border-t border-white/5">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-5xl font-black mb-8 leading-none tracking-tighter">NEVER MISS A BEAT</h2>
            <p className="text-slate-400 mb-12 text-lg">Subscribe to our newsletter and join thousands of Tunisians building their dreams together.</p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto p-2 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
              <input 
                className="flex-1 bg-transparent px-6 py-4 outline-none font-bold text-white placeholder:text-slate-600" 
                placeholder="EMAIL ADDRESS" 
                type="email"
              />
              <button className="bg-primary text-background-dark font-black px-10 py-4 rounded-2xl hover:bg-white transition-colors uppercase tracking-widest text-sm">
                Join
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-black border-t border-white/5 px-6 pb-40">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-[10px] font-black tracking-widest uppercase">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <span>/</span>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <span>/</span>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div>© 2026 TUNIBLESS ASSOCIATION. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary transition-colors">FB</a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary transition-colors">IG</a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary transition-colors">TW</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
  