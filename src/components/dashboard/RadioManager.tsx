'use client'

import { useState } from 'react'
import { updateRadioSettings, upsertScheduleSlot, deleteScheduleSlot } from '@/app/admin/actions'

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

interface ScheduleSlot {
  id: string
  time_slot: string
  show_name: string
  host: string
  is_current: boolean
}

export default function RadioManager({ 
  initialSettings, 
  initialSchedule 
}: { 
  initialSettings: RadioSettings, 
  initialSchedule: ScheduleSlot[] 
}) {
  const [loading, setLoading] = useState(false)
  const [liveType, setLiveType] = useState<'audio' | 'facebook' | 'meeting'>(initialSettings.live_type || 'audio')

  const handleUpdateSettings = async (formData: FormData) => {
    setLoading(true)
    try {
      await updateRadioSettings(formData)
      alert('Settings updated successfully')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSlot = async (id: string) => {
    if (confirm('Delete this schedule slot?')) {
      try {
        await deleteScheduleSlot(id)
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Delete failed')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Radio Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">sensors</span> Session Settings
        </h3>
        <form action={handleUpdateSettings} className="space-y-4">
          <input type="hidden" name="id" value={initialSettings.id} />
          
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button 
              type="button"
              onClick={() => setLiveType('audio')}
              className={`flex-1 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all ${liveType === 'audio' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              Audio
            </button>
            <button 
              type="button"
              onClick={() => setLiveType('facebook')}
              className={`flex-1 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all ${liveType === 'facebook' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              Facebook
            </button>
            <button 
              type="button"
              onClick={() => setLiveType('meeting')}
              className={`flex-1 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all ${liveType === 'meeting' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              Meeting
            </button>
            <input type="hidden" name="live_type" value={liveType} />
          </div>

          <div className="space-y-4">
            <div className={liveType === 'audio' ? 'block' : 'hidden'}>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Stream URL</label>
              <input 
                name="stream_url"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" 
                type="text" 
                defaultValue={initialSettings.stream_url} 
                placeholder="https://..."
              />
            </div>
            
            <div className={liveType === 'facebook' ? 'block' : 'hidden'}>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Facebook Video URL</label>
              <input 
                name="facebook_url"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" 
                type="text" 
                defaultValue={initialSettings.facebook_url} 
                placeholder="https://www.facebook.com/watch/live/?v=..."
              />
            </div>

            <div className={liveType === 'meeting' ? 'block' : 'hidden'}>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Meeting / External Link (Zoom, Meet, etc.)</label>
              <input 
                name="meeting_url"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" 
                type="text" 
                defaultValue={initialSettings.meeting_url} 
                placeholder="https://meet.google.com/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Current Show</label>
              <input 
                id="current_show_input"
                name="current_show"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" 
                type="text" 
                defaultValue={initialSettings.current_show} 
                placeholder="Show Name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Current Host</label>
              <input 
                id="current_host_input"
                name="current_host"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" 
                type="text" 
                defaultValue={initialSettings.current_host} 
                placeholder="Host Name"
              />
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800 mt-2 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Is Live Now</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_live" 
                    value="true" 
                    defaultChecked={initialSettings.is_live} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => {
                const currentSlot = initialSchedule.find(s => s.is_current);
                if (currentSlot) {
                  const showInput = document.getElementById('current_show_input') as HTMLInputElement;
                  const hostInput = document.getElementById('current_host_input') as HTMLInputElement;
                  if (showInput) showInput.value = currentSlot.show_name;
                  if (hostInput) hostInput.value = currentSlot.host || 'صوت الاغتراب';
                } else {
                  alert('No current schedule slot found.');
                }
              }}
              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
            >
              Sync with Schedule
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            {loading ? 'Updating...' : 'Update Settings'}
          </button>
        </form>
      </div>


      {/* Schedule */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">calendar_month</span> Schedule
        </h3>
        <div className="space-y-3">
          {initialSchedule.map((slot) => (
            <div key={slot.id} className={`flex items-start gap-3 p-3 rounded-lg group ${
              slot.is_current
                ? 'border border-primary/20 bg-primary/5'
                : 'bg-slate-50 dark:bg-slate-800'
            }`}>
              <div className={`text-xs font-bold ${slot.is_current ? 'text-primary' : 'text-slate-400'}`}>{slot.time_slot}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{slot.show_name}</p>
                <p className="text-xs text-slate-500">{slot.host ? `Host: ${slot.host}` : 'Auto-Playlist'}</p>
              </div>
              <button 
                onClick={() => handleDeleteSlot(slot.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Add/Edit Schedule
        </button>
      </div>
    </div>
  )
}
