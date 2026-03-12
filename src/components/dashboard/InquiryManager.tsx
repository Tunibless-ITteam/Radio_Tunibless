'use client'

import { toggleInquiryRead } from '@/app/admin/actions'

interface Inquiry {
  id: string
  name: string
  message: string
  initials: string
  created_at: string
  is_read: boolean
}

export default function InquiryManager({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      await toggleInquiryRead(id, currentStatus)
    } catch (error) {
      alert('Failed to update inquiry status')
    }
  }

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">chat</span> Contact Inquiries
      </h3>
      <div className="space-y-4">
        {initialInquiries.map((inquiry) => (
          <div 
            key={inquiry.id} 
            onClick={() => handleToggleRead(inquiry.id, inquiry.is_read)}
            className={`flex items-center gap-4 p-4 rounded-xl transition-colors group cursor-pointer border ${
              inquiry.is_read 
                ? 'bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-700' 
                : 'bg-primary/5 border-primary/20'
            }`}
          >
            <div className={`size-12 rounded-full flex items-center justify-center font-bold ${
              inquiry.is_read ? 'bg-slate-100 dark:bg-slate-700 text-slate-500' : 'bg-primary text-white'
            }`}>
              {inquiry.initials}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className={`text-sm ${inquiry.is_read ? 'font-bold' : 'font-black text-primary'}`}>{inquiry.name}</h4>
                <div className="flex items-center gap-2">
                  {!inquiry.is_read && <span className="size-2 rounded-full bg-primary animate-pulse"></span>}
                  <span className="text-[10px] text-slate-400">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className={`text-xs ${inquiry.is_read ? 'text-slate-500' : 'text-slate-700 dark:text-slate-200 font-medium'} line-clamp-1`}>
                {inquiry.message}
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
              {inquiry.is_read ? 'check_circle' : 'mark_chat_unread'}
            </span>
          </div>
        ))}
        {initialInquiries.length === 0 && (
          <p className="text-center text-slate-400 py-4">No inquiries yet.</p>
        )}
      </div>
    </div>
  )
}
