/**
 * @jest-environment node
 */
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {WithMedia, useMedia, withMedia} from '.'

describe('react-with-media', () => {
  describe('useMedia', () => {
    it('should return false by default', () => {
      const ShowMessage = () => {
        const matches = useMedia('(max-width: 500px)')
        return matches ? <span>Is mobile</span> : <span>Is desktop</span>
      }

      const target = renderToStaticMarkup(<ShowMessage />)
      expect(target).toEqual('<span>Is desktop</span>')
    })

    it('should return true if configured', () => {
      const ShowMessage = () => {
        const matches = useMedia('(max-width: 500px)', {ssrMatches: true})
        return matches ? <span>Is mobile</span> : <span>Is desktop</span>
      }

      const target = renderToStaticMarkup(<ShowMessage />)
      expect(target).toEqual('<span>Is mobile</span>')
    })
  })

  describe('withMedia', () => {
    it('should return false by default', () => {
      const ShowMessage = withMedia('(max-width: 500px)')(({matches}) =>
        matches ? <span>Is mobile</span> : <span>Is desktop</span>,
      )

      const target = renderToStaticMarkup(<ShowMessage />)
      expect(target).toEqual('<span>Is desktop</span>')
    })

    it('should return true if configured', () => {
      const ShowMessage = withMedia('(max-width: 500px)', {ssrMatches: true})(
        ({matches}) =>
          matches ? <span>Is mobile</span> : <span>Is desktop</span>,
      )

      const target = renderToStaticMarkup(<ShowMessage />)
      expect(target).toEqual('<span>Is mobile</span>')
    })
  })

  describe('WithMedia', () => {
    it('should return false by default', () => {
      const ShowMessage = () => (
        <WithMedia query="(max-width: 500px)">
          {matches =>
            matches ? <span>Is mobile</span> : <span>Is desktop</span>
          }
        </WithMedia>
      )

      const target = renderToStaticMarkup(<ShowMessage />)
      expect(target).toEqual('<span>Is desktop</span>')
    })

    it('should return true if configured', () => {
      const ShowMessage = () => (
        <WithMedia query="(max-width: 500px)" ssrMatches>
          {matches =>
            matches ? <span>Is mobile</span> : <span>Is desktop</span>
          }
        </WithMedia>
      )

      const target = renderToStaticMarkup(<ShowMessage />)
      expect(target).toEqual('<span>Is mobile</span>')
    })
  })
})
