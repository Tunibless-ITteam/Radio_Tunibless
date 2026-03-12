'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'

interface RadioSettings {
  id: string
  stream_url: string
  is_live: boolean
  current_show: string
  current_host: string
  live_type: 'audio' | 'facebook' | 'meeting'
  facebook_url?: string
  meeting_url?: string
}

export default function RadioPlayer({ initialSettings }: { initialSettings: RadioSettings }) {
  const [settings, setSettings] = useState<RadioSettings>(initialSettings)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [volume, setVolume] = useState(0.7)
  const [isVisible, setIsVisible] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Reset error when URL changes
    setError(null)
  }, [settings.stream_url])

  useEffect(() => {
    // Subscribe to real-time changes
    const channel = supabase
      .channel('radio_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'radio_settings',
        },
        (payload) => {
          console.log('Radio settings updated:', payload)
          setSettings(payload.new as RadioSettings)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
    
    // If it's a Facebook Live or Meeting, pause any running audio
    if ((settings.live_type === 'facebook' || settings.live_type === 'meeting') && audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [volume, settings.live_type, isPlaying])

  const togglePlay = () => {
    if (!audioRef.current) return
    
    // Don't play if it's a meeting or facebook session
    if (settings.live_type === 'facebook' || settings.live_type === 'meeting') {
      alert('البث متوقف حالياً لوجود جلسة مباشرة. يرجى الانضمام للجلسة أعلاه.')
      return
    }

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      setError(null)
      // Refresh the stream source to reduce latency if it's been paused for a while
      const currentSrc = audioRef.current.src
      audioRef.current.src = ''
      audioRef.current.src = currentSrc
      audioRef.current.load()
      audioRef.current.play().catch(err => {
        console.error('Playback failed:', err)
        setError('تعذر تشغيل البث. يرجى التحقق من الرابط.')
      })
    }
    setIsPlaying(!isPlaying)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-black/80 backdrop-blur-3xl border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] px-6 py-4 md:px-12">
      <audio 
        ref={audioRef} 
        src={settings.stream_url} 
        onPlay={() => setIsPlaying(true)} 
        onPause={() => setIsPlaying(false)}
        onError={() => {
          console.error('Audio error occurred')
          setError('رابط البث غير صالح أو غير مدعوم.')
          setIsPlaying(false)
        }}
      />
      
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-8">
        <div className="flex items-center gap-6 overflow-hidden flex-1">
          {/* Mosaique Style Status Badge */}
          <div className="hidden lg:flex items-center gap-2 bg-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20">
             <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
             Direct
          </div>

          <div className="flex items-center gap-4 min-w-0">
            <div className="relative w-14 h-14 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
              <img 
                alt="Show" 
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${(isPlaying && !error) ? 'animate-[pulse_4s_infinite]' : ''}`}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHUrsoqANA_f1tQcBgLE0oIyCNTTXStXSQP7q00C69VzQoa6q2xNoBL4PpHzR_dMdX88zdPZE2keW4i9Tndxzkrr6CuG6t4SnczpRHzXENAesDXfCSXZQF37c9HJGLe3UD_nrvzitA5qytpFyuSM1lPy9vBHaD5nX-nUiJeiTYnxELd7casDyWauK0Iopa5Yc9BNRlGBKWNJcnjfUyu9G-xBM3O48wShIMnhjAO27OEI7ywZEsmT2SwY_UMm3d5RKWe4NjIIabivUZ" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white">info</span>
              </div>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Listen Live • استمع مباشرة</span>
              <h5 className="text-base font-black truncate text-white tracking-tight leading-none mb-1">
                {settings.current_show || 'Radio TuniBless'}
              </h5>
              <p className="text-xs text-slate-400 truncate font-semibold">
                {settings.current_host || 'صوت الاغتراب'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-6">
            <button className="text-slate-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">favorite</span>
            </button>
            
            <button 
              data-player-toggle
              onClick={togglePlay}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 shadow-[0_0_30px_rgba(204,1,1,0.3)] transition-all active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              <span className="material-symbols-outlined text-3xl md:text-4xl font-black relative">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>

            <button className="text-slate-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-2xl">share</span>
            </button>
          </div>
          
          <div className="hidden lg:flex items-center gap-4 w-40">
            <span className="material-symbols-outlined text-xl text-slate-500">
              {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
            </span>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="h-1 flex-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary border-none"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => setIsVisible(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-slate-500"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-6 py-2 rounded-full shadow-2xl animate-bounce">
          {error}
        </div>
      )}
    </div>
  )
}
