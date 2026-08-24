import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { login } from '@/api/auth.ts'
import { LoginCharacters } from '@/components/LoginCharacters.tsx'
import { LoginHoverButton } from '@/components/LoginHoverButton.tsx'
import { getErrorMessage } from '@/lib/error.ts'
import { paths } from '@/lib/paths.ts'
import { useAuthHydrated, useAuthStore } from '@/stores/authStore.ts'
import logo from '@/assets/images/logo.png'

function safeRedirectPath(value: unknown) {
  if (typeof value !== 'string') {
    return null
  }
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith(paths.adminLogin)) {
    return null
  }
  return value
}

function EyeIcon({ off }: { off?: boolean }) {
  if (off) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c5.5 0 9.5 4.5 10.5 7-.3.8-1 2-2.1 3.3" />
        <path d="M6.6 6.6C4.4 8.2 3 10.2 2.5 12c1 2.5 5 7 9.5 7 1.6 0 3.1-.4 4.4-1.1" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M2.5 12C3.5 9.5 7.5 5 12 5s8.5 4.5 9.5 7c-1 2.5-5 7-9.5 7s-8.5-4.5-9.5-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function AdminLoginPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const hydrated = useAuthHydrated()
  const token = useAuthStore((state) => state.token)
  const setSession = useAuthStore((state) => state.setSession)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState<{
    username?: string
    password?: string
  }>({})

  const redirectTo = useMemo(() => {
    const fromState = location.state
    if (fromState && typeof fromState === 'object' && 'from' in fromState) {
      const from = safeRedirectPath(fromState.from)
      if (from) {
        return from
      }
    }
    return safeRedirectPath(searchParams.get('from')) ?? paths.adminArticles
  }, [location.state, searchParams])

  if (hydrated && token) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextUsername = username.trim()
    const nextErrors: { username?: string; password?: string } = {}
    if (!nextUsername) {
      nextErrors.username = '请输入用户名'
    } else if (nextUsername.length > 50) {
      nextErrors.username = '用户名最多 50 字'
    }
    if (password.length < 6) {
      nextErrors.password = '密码至少 6 位'
    } else if (password.length > 100) {
      nextErrors.password = '密码最多 100 位'
    }
    setFieldError(nextErrors)
    if (nextErrors.username || nextErrors.password) {
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const result = await login(nextUsername, password)
      setSession(result.token, result.user)
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-svh max-h-svh overflow-hidden lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 p-12 text-white lg:flex">
        <div className="relative z-20">
          <Link to={paths.home} className="flex items-center gap-2 text-lg font-semibold">
            <img
              src={logo}
              alt=""
              className="h-8 w-8 rounded-lg bg-white/10 p-1 backdrop-blur-sm"
            />
            <span>博客后台</span>
          </Link>
        </div>

        <div className="relative z-20 flex h-[500px] items-end justify-center">
          <LoginCharacters
            isTyping={isTyping}
            showPassword={showPassword}
            passwordLength={password.length}
          />
        </div>

        <div className="relative z-20 flex items-center gap-8 text-sm text-gray-600">
          <Link to={paths.home} className="transition-colors hover:text-gray-900">
            返回首页
          </Link>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="pointer-events-none absolute top-1/4 right-1/4 size-64 rounded-full bg-gray-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 left-1/4 size-96 rounded-full bg-gray-300/20 blur-3xl" />
      </div>

      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-[420px]">
          <Link
            to={paths.home}
            className="mb-12 flex items-center justify-center gap-2 text-lg font-semibold lg:hidden"
          >
            <img src={logo} alt="" className="h-8 w-8" />
            <span>博客后台</span>
          </Link>

          <div className="mb-10 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">欢迎回来</h1>
            <p className="text-sm text-[#737373]">请输入你的账号信息</p>
          </div>

          <form className="space-y-5" onSubmit={(event) => void handleSubmit(event)}>
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                用户名
              </label>
              <input
                id="username"
                name="username"
                autoComplete="off"
                placeholder="admin"
                maxLength={50}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                className="h-12 w-full rounded-md border border-black/15 bg-white px-3 outline-none transition-colors focus:border-[#09f]"
              />
              {fieldError.username && (
                <p className="text-sm text-[#e5484d]">{fieldError.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  maxLength={100}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-md border border-black/15 bg-white px-3 pr-10 outline-none transition-colors focus:border-[#09f]"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#737373] transition-colors hover:text-[#171717]"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
              {fieldError.password && (
                <p className="text-sm text-[#e5484d]">{fieldError.password}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-[#e5484d]/30 bg-[#e5484d]/10 p-3 text-sm text-[#e5484d]">
                {error}
              </div>
            )}

            <LoginHoverButton
              type="submit"
              text={submitting ? '登录中…' : '登录'}
              className="h-12 text-base font-medium"
              disabled={submitting}
            />
          </form>
        </div>
      </div>
    </div>
  )
}
