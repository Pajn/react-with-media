import {Component} from 'react'
import wrapDisplayName from 'recompose/wrapDisplayName'

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
export const withMedia: any = (query, {name = 'matches'} = {}) => WrappedComponent => {
  const media = window.matchMedia(query)

  return class extends Component<any, {matches: boolean}> {
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
      return <WrappedComponent {...{...this.props, [name]: this.state.matches}} />
    }
  }
}
