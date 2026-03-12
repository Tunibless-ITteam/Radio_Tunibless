import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '@/app/actions'
import DashboardClient from '@/components/dashboard/DashboardClient'
import BlogManager from '@/components/dashboard/BlogManager'
import RadioManager from '@/components/dashboard/RadioManager'
import InquiryManager from '@/components/dashboard/InquiryManager'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Auth check — redirect to login if not logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // RBAC check — uses SECURITY DEFINER function to bypass RLS
  const { data: userRole } = await supabase.rpc('get_user_role', { uid: user.id })

  if (!userRole || userRole !== 'admin') {
    redirect('/')
  }

  // Fetch profile
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Fetch blog posts (cast to any for simplicity in the mapping, but types are defined in components)
  const { data: blogPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch counts
  const { count: totalPosts } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true })
  const { count: totalInquiries } = await supabase.from('contact_inquiries').select('*', { count: 'exact', head: true })

  // Fetch animators
  const { data: animators } = await supabase.from('animators').select('*')

  // Fetch contact inquiries
  const { data: inquiries } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  // Fetch radio settings
  const { data: radioSettings } = await supabase.from('radio_settings').select('*').single()

  // Fetch radio schedule
  const { data: schedule } = await supabase.from('radio_schedule').select('*').order('time_slot', { ascending: true })

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Admin'

  return (
    <>
      <DashboardClient />
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-20">
          <div className="p-6 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">radio</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">Tunibless</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admin Control Panel</p>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20" href="/admin_dashboard">
              <span className="material-symbols-outlined text-xl">dashboard</span>
              <span>Dashboard Overview</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
              <span className="material-symbols-outlined text-xl">article</span>
              <span>Manage Blog Posts</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
              <span className="material-symbols-outlined text-xl">settings_input_antenna</span>
              <span>Radio Stream Settings</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
              <span className="material-symbols-outlined text-xl">mail</span>
              <span>Contact Inquiries</span>
              <span className="ml-auto bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">{totalInquiries || 0}</span>
            </a>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 p-2">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {userName.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{userName}</p>
                <p className="text-xs text-slate-500 truncate">Super Admin</p>
              </div>
              <form action={signOut}>
                <button className="text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-72 p-8 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
          <header className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time statistics and backend management.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 bg-white dark:bg-slate-800">
                <span className="material-symbols-outlined text-lg">download</span> Export Report
              </button>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Total Views', value: '48,294', icon: 'analytics' },
              { label: 'Listeners', value: '1,402', icon: 'podcasts' },
              { label: 'Blog Posts', value: totalPosts || 0, icon: 'history_edu' },
              { label: 'Inquiries', value: totalInquiries || 0, icon: 'forum' }
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02] duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Blog Posts Manager */}
            <div className="lg:col-span-2 space-y-6">
              <BlogManager initialPosts={blogPosts || []} />
            </div>

            {/* Radio Manager */}
            <div className="space-y-6">
              <RadioManager 
                initialSettings={radioSettings || { id: '', stream_url: '', is_live: false, current_show: '', current_host: '' }} 
                initialSchedule={schedule || []} 
              />
            </div>
          </div>

          {/* Inquiry Manager */}
          <InquiryManager initialInquiries={inquiries || []} />
        </main>
      </div>
    </>
  )
}