
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    return redirect('/admin_dashboard')
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto pt-24 min-h-screen">
      <div className="mb-8 flex flex-col items-center gap-4">
        <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-3xl">lock</span>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-700">دخول المشرف (Admin Login)</h1>
        <p className="text-sm text-slate-500 text-center">قم بتسجيل الدخول للوصول إلى لوحة التحكم الخاصة بمنصة توني بليس</p>
      </div>

      <form
        className="animate-in flex-1 flex flex-col w-full justify-start gap-4 text-foreground bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl"
        action={signIn}
      >
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="email">
            البريد الإلكتروني (Email)
            </label>
            <input
            className="rounded-lg px-4 py-3 bg-slate-50 dark:bg-slate-800 border mb-4 border-slate-200 dark:border-slate-700 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            name="email"
            placeholder="you@example.com"
            required
            />
        </div>
        
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="password">
            كلمة المرور (Password)
            </label>
            <input
            className="rounded-lg px-4 py-3 bg-slate-50 dark:bg-slate-800 border mb-6 border-slate-200 dark:border-slate-700 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            type="password"
            name="password"
            placeholder="••••••••"
            required
            />
        </div>

        <button className="bg-primary text-white rounded-lg px-4 py-3 text-foreground font-bold hover:scale-[1.02] hover:shadow-lg transition-all flex items-center justify-center gap-2">
            تسجيل الدخول (Sign In)
             <span className="material-symbols-outlined text-sm">login</span>
        </button>

        <p className="text-center text-sm text-slate-500 mt-4">
          ليس لديك حساب؟{' '}
          <a href="/signup" className="text-primary font-bold hover:underline">إنشاء حساب</a>
        </p>

        {message && (
          <p className="mt-4 p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-sm text-center font-bold">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
