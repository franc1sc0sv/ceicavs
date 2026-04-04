import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useApolloClient } from '@apollo/client/react'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Sun, Moon } from 'lucide-react'
import { ROUTES } from '@/lib/routes'
import { Button } from '@/components/ui/button'
import { useTheme, Theme } from '@/hooks/use-theme'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/context/auth.context'
import {
  LoginDocument,
  MeDocument,
  type LoginMutation,
  type LoginMutationVariables,
  type MeQuery,
} from '@/generated/graphql'

export function LoginPage() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const client = useApolloClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const [login, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    {
      async onCompleted(data) {
        localStorage.setItem('accessToken', data.login.accessToken)
        localStorage.setItem('refreshToken', data.login.refreshToken)
        try {
          const meResult = await client.query<MeQuery>({
            query: MeDocument,
            fetchPolicy: 'network-only',
          })
          if (meResult.data) setUser(meResult.data.me)
          navigate(ROUTES.DASHBOARD)
        } catch {
          setErrorVisible(true)
        }
      },
      onError() {
        setErrorVisible(true)
      },
    },
  )

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorVisible(false)
    login({ variables: { input: { email, password } } })
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="absolute right-4 top-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === Theme.Dark ? t('common.lightMode') : t('common.darkMode')}
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="size-5" />
              </div>
              <CardTitle className="text-xl font-display">
                {t('auth.login')}
              </CardTitle>
              <CardDescription>{t('common.schoolName')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} noValidate>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">{t('auth.email')}</FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder={t('common.emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">
                      {t('auth.password')}
                    </FieldLabel>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword
                            ? t('common.hidePassword')
                            : t('common.showPassword')
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </Field>

                  {errorVisible && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertDescription>
                          {t('auth.loginError')}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading && (
                        <Loader2 className="size-4 animate-spin" />
                      )}
                      {t('auth.loginButton')}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          <p className="text-balance text-center text-xs text-muted-foreground">
            CEICAVS &middot; {t('common.tagline')}
          </p>
        </div>
      </motion.div>
    </main>
  )
}

