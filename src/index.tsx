import {
  Component,
  ComponentClass,
  ComponentType,
  ReactNode,
  createElement,
  useEffect,
  useState,
} from 'react'
import {wrapDisplayName} from 'recompose'

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
export function useMedia(query: string) {
  const media = window.matchMedia(query)
  const [matches, setMatches] = useState(media.matches)
  const mediaListener = () => setMatches(media.matches)

  useEffect(() => {
    media.addListener(mediaListener)

    // if (matches !== medi)

    return () => media.removeListener(mediaListener)
  }, [query])

  return matches
}

/**
 * A HOC for watching media queries.
 *
 * It provides a matches prop to the wrapped component.
 * The 'matches' prop can be renamed by passing a name property as a second parameter
 *
 * Example:
 * ```typescript
 * const ShowMessage = withMedia('(max-width: 500px)')(({matches}) =>
 *   matches
 *     ? <span>Is mobile</span>
 *     : <span>Is desktop</span>
 *   )
 * ```
 */
export function withMedia<P>(
  query: string,
  {name = 'matches'} = {},
): (
  WrappedComponent: ComponentType<P & {matches: boolean}>,
) => ComponentClass<P> {
  return WrappedComponent => {
    const media = window.matchMedia(query)

    return class extends Component<P, {matches: boolean}> {
      static displayName = wrapDisplayName(WrappedComponent, 'withMedia')
      state = {matches: media.matches}
      mediaListener = () => this.setState({matches: media.matches})

      componentDidMount() {
        media.addListener(this.mediaListener)
      }

      componentWillUnmount() {
        media.removeListener(this.mediaListener)
      }

      render() {
        return createElement(WrappedComponent, {
          ...(this.props as any),
          [name]: this.state.matches,
        })
      }
    }
  }
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
  {query: string; children: (matches: boolean) => ReactNode},
  {matches: boolean}
> {
  media = window.matchMedia(this.props.query)
  state = {matches: this.media.matches}
  mediaListener = () => this.setState({matches: this.media.matches})

  componentDidMount() {
    if (this.state.matches !== this.media.matches) {
      this.setState({matches: this.media.matches})
    }
    this.media.addListener(this.mediaListener)
  }

  componentDidUpdate(prevProps: this['props']) {
    if (this.props.query !== prevProps.query) {
      this.media.removeListener(this.mediaListener)
      this.media = window.matchMedia(this.props.query)
      if (this.state.matches !== this.media.matches) {
        this.setState({matches: this.media.matches})
      }
      this.media.addListener(this.mediaListener)
    }
  }

  componentWillUnmount() {
    this.media.removeListener(this.mediaListener)
  }

  render() {
    return this.props.children(this.state.matches) as any
  }
}
