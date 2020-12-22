import {mount} from 'enzyme'
import * as React from 'react'
import { act } from 'react-dom/test-utils'
import {WithMedia, useMedia} from '.'

type Mutable<T> = {-readonly [P in keyof T]: T[P]}

describe('react-with-media', () => {
  let listener: () => void
  let media: Mutable<MediaQueryList> = {} as MediaQueryList

  const init = () => {
    ;(media.matches = false),
      (media.addEventListener = jest.fn((_e, l) => {
        listener = l
      }) as (e: string, l: any) => void),
      (media.removeEventListener = jest.fn() as (e: string, l: any) => void),
      (window.matchMedia = jest.fn().mockReturnValue(media))
  }

  init()
  beforeEach(init)

  describe('useMedia', () => {
    const ShowMessage = () => {
      const matches = useMedia('(max-width: 500px)')
      return matches ? <span>Is mobile</span> : <span>Is desktop</span>
    }

    it('should return false initially if the media does not match', () => {
      const target = mount(<ShowMessage />)
      expect(target.text()).toEqual('Is desktop')
    })

    it('should return true initially if the media does match', () => {
      media.matches = true
      const target = mount(<ShowMessage />)
      expect(target.text()).toEqual('Is mobile')
    })

    it('should update when matching changes', () => {
      const target = mount(<ShowMessage />)
      target.mount()

      expect(target.text()).toEqual('Is desktop')
      media.matches = true
      act(() => {
        listener()
      })
      expect(target.text()).toEqual('Is mobile')
    })

    it('should reregister if the query changes', async () => {
      const ShowMessage = props => {
        const matches = useMedia(props.query)
        return matches ? <span>Is mobile</span> : <span>Is desktop</span>
      }

      const target = mount(<ShowMessage query="(max-width: 500px)" />)
      target.mount()

      expect(media.addEventListener).toHaveBeenCalledTimes(1)
      expect(media.removeEventListener).toHaveBeenCalledTimes(0)
      target.setProps({query: '(min-width: 500px)'})
      await new Promise(resolve => setTimeout(resolve))

      expect(media.addEventListener).toHaveBeenCalledTimes(2)
      expect(media.removeEventListener).toHaveBeenCalledTimes(1)
    })

    it('should update matches when the query changes', () => {
      const ShowMessage = props => (
        <WithMedia query={props.query}>
          {matches =>
            matches ? <span>Is mobile</span> : <span>Is desktop</span>
          }
        </WithMedia>
      )

      const target = mount(<ShowMessage query="(max-width: 500px)" />)
      target.mount()

      expect(target.text()).toEqual('Is desktop')
      media.matches = true
      target.setProps({query: '(min-width: 500px)'})

      expect(target.text()).toEqual('Is mobile')
    })

    it('should unregister on unmount', () => {
      const target = mount(<ShowMessage />)
      expect(media.removeEventListener).toHaveBeenCalledTimes(0)
      target.unmount()
      expect(media.removeEventListener).toHaveBeenCalledTimes(1)
    })
  })

  describe('WithMedia', () => {
    const ShowMessage = () => (
      <WithMedia query="(max-width: 500px)">
        {matches =>
          matches ? <span>Is mobile</span> : <span>Is desktop</span>
        }
      </WithMedia>
    )

    it('should return false initially if the media does not match', () => {
      const target = mount(<ShowMessage />)
      expect(target.text()).toEqual('Is desktop')
    })

    it('should return true initially if the media does match', () => {
      media.matches = true
      const target = mount(<ShowMessage />)
      expect(target.text()).toEqual('Is mobile')
    })

    it('should update when matching changes', () => {
      const target = mount(<ShowMessage />)
      target.mount()

      expect(target.text()).toEqual('Is desktop')
      media.matches = true
      listener()
      expect(target.text()).toEqual('Is mobile')
    })

    it('should reregister if the query changes', () => {
      const ShowMessage = props => (
        <WithMedia query={props.query}>
          {matches =>
            matches ? <span>Is mobile</span> : <span>Is desktop</span>
          }
        </WithMedia>
      )

      const target = mount(<ShowMessage query="(max-width: 500px)" />)
      target.mount()

      expect(media.addEventListener).toHaveBeenCalledTimes(1)
      expect(media.removeEventListener).toHaveBeenCalledTimes(0)
      target.setProps({query: '(min-width: 500px)'})

      expect(media.addEventListener).toHaveBeenCalledTimes(2)
      expect(media.removeEventListener).toHaveBeenCalledTimes(1)
    })

    it('should update matches when the query changes', () => {
      const ShowMessage = props => (
        <WithMedia query={props.query}>
          {matches =>
            matches ? <span>Is mobile</span> : <span>Is desktop</span>
          }
        </WithMedia>
      )

      const target = mount(<ShowMessage query="(max-width: 500px)" />)
      target.mount()

      expect(target.text()).toEqual('Is desktop')
      media.matches = true
      target.setProps({query: '(min-width: 500px)'})

      expect(target.text()).toEqual('Is mobile')
    })

    it('should unregister on unmount', () => {
      const target = mount(<ShowMessage />)
      expect(media.removeEventListener).toHaveBeenCalledTimes(0)
      target.unmount()
      expect(media.removeEventListener).toHaveBeenCalledTimes(1)
    })
  })
})
