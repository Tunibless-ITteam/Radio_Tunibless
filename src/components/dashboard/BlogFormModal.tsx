'use client'

import { useState } from 'react'
import { upsertBlogPost } from '@/app/admin/actions'

interface Post {
  id?: string
  title: string
  category: string
  status: 'published' | 'draft'
  thumbnail_url: string
  excerpt: string
  content: string
}

export default function BlogFormModal({ 
  post, 
  onClose 
}: { 
  post?: Post, 
  onClose: () => void 
}) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      await upsertBlogPost(formData)
      onClose()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-xl font-bold">{post ? 'Edit Post' : 'New Blog Post'}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form action={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {post?.id && <input type="hidden" name="id" value={post.id} />}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
              <input 
                name="title" 
                defaultValue={post?.title} 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                required 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
              <input 
                name="category" 
                defaultValue={post?.category} 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
              <select 
                name="status" 
                defaultValue={post?.status || 'draft'} 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Thumbnail URL</label>
              <input 
                name="thumbnail_url" 
                defaultValue={post?.thumbnail_url} 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Excerpt</label>
            <textarea 
              name="excerpt" 
              defaultValue={post?.excerpt} 
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Content (Markdown)</label>
            <textarea 
              name="content" 
              defaultValue={post?.content} 
              rows={6}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none" 
              required 
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <span className="material-symbols-outlined text-lg">save</span>
              )}
              {post ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
