'use client'

import { useState } from 'react'
import BlogFormModal from './BlogFormModal'
import { deleteBlogPost } from '@/app/admin/actions'

interface Post {
  id: string
  title: string
  category: string
  status: 'published' | 'draft'
  thumbnail_url: string
  excerpt: string
  content: string
  author: string
  created_at: string
}

export default function BlogManager({ initialPosts }: { initialPosts: Post[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | undefined>()

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingPost(undefined)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteBlogPost(id)
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Delete failed')
      }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 dark:text-white text-lg">Recent Blog Posts</h3>
        <button 
          onClick={handleCreate}
          className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span> New Post
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold">Title</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {initialPosts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                      {post.thumbnail_url && (
                        <img className="w-full h-full object-cover" src={post.thumbnail_url} alt={post.title} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{post.title}</p>
                      <p className="text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString()} • By {post.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 italic">{post.category}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold ${
                    post.status === 'published'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {post.status?.toUpperCase() || 'DRAFT'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(post)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {initialPosts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No blog posts yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <BlogFormModal 
          post={editingPost} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}
