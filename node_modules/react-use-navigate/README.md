# react-use-navigate

Easy, flexible, and expressive hook based navigation in React.

## Features
- Tiny. Simple. Expressive. 1.5kb gzipped.
- TypeScript ready
- React framework agnostic (Next.js, Gatsby, React Router, Reach Router, etc.)
- Glob pattern matching support

## Motivation
Often times we want to navigate pages conditionally. This can easily turn into a bunch of if else statements and regex matching. Here's some code that redirects a logged out user to `/login` if they on a page under the `/app` directory. If they are logged in but not in the app, they are redirected to the app dashboard.

```
useEffect(() => {
  const inApp = new RegEx(`/${location.hostname}\/app\/([0-9A-Za-z]+\/?)+/`)
  if(!isLoggedIn && inApp) {
    return goTo('/login')
  }
  if(isLoggedIn && !inApp) {
    return goTo('/app/dashboard')
  }
}, [isLoggedIn])
```

Not complicated to follow (aside from the regex), but for something so easy to express in words, it sure doesn't look it. Using the `useNavigate()` hook, here's what the same code would look like:

```
const { replace } = useNavigate()

useEffect(() => {
  replace({
    goTo: '/login',
    when: !isLoggedIn,
    onPaths: ['/app/**'], // glob pattern matching goodness
    otherwiseGoTo: '/app/dashboard', // this will only trigger if when === false AND path requirements fail
  })
}, [isLoggedIn])
```
This can almost be read as sentence, roughly translating to, "go to `/login` when user is not logged in while on any app directory. Otherwise, go to the app dashboard."

But what if we want to navigate a user when they *aren't* on a page in a particular directory? For example, maybe we have multiple apps like `/analytics` and `/editor`. Perhaps we want to just be general and say "send the user to login if they aren't on a marketing page". No problem, here's the same code as above with a slight modification:

```
const { replace } = useNavigate()

useEffect(() => {
  replace({
    goTo: '/login',
    when: !isLoggedIn,
    notOnPaths: ['/marketing/**'], // navigates when a user isn't on a matching page
  })
}, [isLoggedIn])
```

## Installation
```
yarn add react-use-navigate
npm install react-use-navigate
```
This package has a peer dependency on React and React DOM > 16.8.0 (basically you need react hooks).

## Setup
This hook doesn't care *how* navigation works, it just asks that you provide the logic for the basic navigation methods `push`, `replace`, and `back`.

This can be done with a config object in the `NavigateProvider`. Below are a few examples in different frameworks.

### Using React Router 

```
import { NavigateProvider } from 'react-use-navigate'

const App = () => {
  const history = useHistory()
  
  const config = {
    push: history.push,
    back: history.back,
    replace: history.replace
  }

  return (
    <NavigateProvider {...config}>
      <RootComponent/>
    </NavigateProvider>
  )
}
```

### Using Next.js

```
import { NavigateProvider } from 'react-use-navigate'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  const config = {
    push: router.push,
    back: router.back,
    replace: router.replace
  }

  return (
    <NavigateProvider {...config}>
      <Component {...pageProps} />
    </NavigateProvider>
  )
}
```

## API Reference

### useNavigate()
`const { push, back, replace } = useNavigate()`

Each navigation method uses the same paramters:

```
type UseNavigateProps = {
  when?: boolean
  goTo?: string
  onPaths?: string[] // array of globs
  notOnPaths?: string[]
  otherwiseGoTo?: string
}
```
| Property      | Description                                                                                                                                                         | type     | required |   |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|----------|---|
| when          | base condition that must be met to navigate                                                                                                                         | boolean  | false    |   |
| goTo          | the link to go to                                                                                                                                                   | string   | true     |   |
| onPaths       | navigation will occur only if a user is on one of the specified paths. Will take precedence over `notOnPaths` field                                                 | string[] | false    |   |
| notOnPaths    | navigation will occur only if a user is not on any of the specified paths.                                                                                          | string[] | false    |   |
| otherwiseGoTo | The link to go to if `when === false` and `onPaths` or `notOnPaths` is also false. If the latter two fields aren't specified, it will navigate if `when === false`. | string   | false    |   |
```

