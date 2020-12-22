import {
  Component,
  ReactNode,
  useEffect,
  useState,
} from 'react'

/**
 * A hook for watching media queries.
 *
 * It returns whenever the media query matches or not
 *
 * Example:
 * ```typescript
 * const ShowMessage = () => {
 *   const matches = useMedia('(max-width: 500px)')
 *
 *   return matches
 *     ? <span>Is mobile</span>
 *     : <span>Is desktop</span>
 * }
 * ```
 */
export function useMedia(query: string, {ssrMatches = false} = {}) {
  if (typeof window === 'undefined') return ssrMatches

  const media = window.matchMedia(query)
  const [matches, setMatches] = useState(media.matches)
  const mediaListener = () => setMatches(media.matches)

  useEffect(
    () => {
      media.addEventListener('change', mediaListener)

      return () => media.removeEventListener('change', mediaListener)
    },
    [query],
  )

  return matches
}

/**
 * A render prop component for watching media queries.
 *
 * It provides a matches argument to the children function.
 *
 * Example:
 * ```typescript
 * const ShowMessage = () =>
 *   <WithMedia query='(max-width: 500px)'>
 *     {matches => matches
 *       ? <span>Is mobile</span>
 *       : <span>Is desktop</span>
 *     }
 *   </WithMedia>
 * ```
 */
export class WithMedia extends Component<
  {
    query: string
    children: (matches: boolean) => ReactNode
    ssrMatches?: boolean
  },
  {matches: boolean}
> {
  media =
    typeof window === 'undefined'
      ? ({matches: this.props.ssrMatches} as MediaQueryList)
      : window.matchMedia(this.props.query)
  state = {matches: this.media.matches}
  mediaListener = () => {
    if (this.state.matches !== this.media.matches) {
      this.setState({matches: this.media.matches})
    }
  }

  componentDidMount() {
    if (this.state.matches !== this.media.matches) {
      this.setState({matches: this.media.matches})
    }
    this.media.addEventListener('change', this.mediaListener)
  }

  componentDidUpdate(prevProps: this['props']) {
    if (this.props.query !== prevProps.query) {
      this.media.removeEventListener('change', this.mediaListener)
      this.media = window.matchMedia(this.props.query)
      if (this.state.matches !== this.media.matches) {
        this.setState({matches: this.media.matches})
      }
      this.media.addEventListener('change', this.mediaListener)
    }
  }

  componentWillUnmount() {
    this.media.removeEventListener('change', this.mediaListener)
  }

  render() {
    return this.props.children(this.state.matches) as any
  }
}
