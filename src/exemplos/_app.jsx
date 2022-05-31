import { SessionProvider } from "next-auth/react"

export default function App({
    Component,
    pageProps: { session, ...pageProps },
  }) {
    return (
      <SessionProvider session={session}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    )
  }
  
  function Auth({ children }) {
    const { data: session, status } = useSession()
    const isUser = !!session?.user
    React.useEffect(() => {
      if (status === "loading") return // Do nothing while loading
      if (!isUser) signIn() // If not authenticated, force log in
    }, [isUser, status])
  
    if (isUser) {
      return children
    }
  
    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <div>Loading...</div>
  }