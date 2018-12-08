import {mount} from 'enzyme'
import React from 'react'
import { WithMedia, useMedia, withMedia } from ".";

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

describe('react-with-media', () => {
  let listener: () => void
  let media: Mutable<MediaQueryList> = {} as MediaQueryList

  const init = () => {
    media.matches = false,
    media.addListener = jest.fn((l) => {listener = l}) as (l: any) => void,
    media.removeListener = jest.fn() as (l: any) => void,
    window.matchMedia = jest.fn().mockReturnValue(media)
  }

  init()
  beforeEach(init)

  describe('useMedia', () => {
    const ShowMessage = () => {
      const matches = useMedia('(max-width: 500px)')
          return matches
        ? <span>Is mobile</span>
        : <span>Is desktop</span>
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
      listener()
      expect(target.text()).toEqual('Is mobile')
    })

    it('should reregister if the query changes', async () => {
      const ShowMessage = (props) => {
        const matches = useMedia(props.query)
            return matches
          ? <span>Is mobile</span>
          : <span>Is desktop</span>
      }

      const target = mount(<ShowMessage query='(max-width: 500px)' />)
      target.mount()

      expect(media.addListener).toHaveBeenCalledTimes(1)
      expect(media.removeListener).toHaveBeenCalledTimes(0)
      target.setProps({query: '(min-width: 500px)'})
      await new Promise(resolve => setTimeout(resolve))

      expect(media.addListener).toHaveBeenCalledTimes(2)
      expect(media.removeListener).toHaveBeenCalledTimes(1)
    })

    it('should update matches when the query changes', () => {
      const ShowMessage = (props) =>
        <WithMedia query={props.query}>
          {matches => matches
            ? <span>Is mobile</span>
            : <span>Is desktop</span>
          }
        </WithMedia>

      const target = mount(<ShowMessage query='(max-width: 500px)' />)
      target.mount()

      expect(target.text()).toEqual('Is desktop')
      media.matches = true
      target.setProps({query: '(min-width: 500px)'})

      expect(target.text()).toEqual('Is mobile')
    })

    it('should unregister on unmount', () => {
      const target = mount(<ShowMessage />)
      expect(media.removeListener).toHaveBeenCalledTimes(0)
      target.unmount()
      expect(media.removeListener).toHaveBeenCalledTimes(1)
    })
  })

  describe('withMedia', () => {
    const ShowMessage = withMedia('(max-width: 500px)')(({matches}) =>
      matches
        ? <span>Is mobile</span>
        : <span>Is desktop</span>
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

    it('should unregister on unmount', () => {
      const target = mount(<ShowMessage />)
      expect(media.removeListener).toHaveBeenCalledTimes(0)
      target.unmount()
      expect(media.removeListener).toHaveBeenCalledTimes(1)
    })
  })

  describe('WithMedia', () => {
    const ShowMessage = () =>
      <WithMedia query='(max-width: 500px)'>
        {matches => matches
          ? <span>Is mobile</span>
          : <span>Is desktop</span>
        }
      </WithMedia>

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
      const ShowMessage = (props) =>
        <WithMedia query={props.query}>
          {matches => matches
            ? <span>Is mobile</span>
            : <span>Is desktop</span>
          }
        </WithMedia>

      const target = mount(<ShowMessage query='(max-width: 500px)' />)
      target.mount()

      expect(media.addListener).toHaveBeenCalledTimes(1)
      expect(media.removeListener).toHaveBeenCalledTimes(0)
      target.setProps({query: '(min-width: 500px)'})

      expect(media.addListener).toHaveBeenCalledTimes(2)
      expect(media.removeListener).toHaveBeenCalledTimes(1)
    })

    it('should update matches when the query changes', () => {
      const ShowMessage = (props) =>
        <WithMedia query={props.query}>
          {matches => matches
            ? <span>Is mobile</span>
            : <span>Is desktop</span>
          }
        </WithMedia>

      const target = mount(<ShowMessage query='(max-width: 500px)' />)
      target.mount()

      expect(target.text()).toEqual('Is desktop')
      media.matches = true
      target.setProps({query: '(min-width: 500px)'})

      expect(target.text()).toEqual('Is mobile')
    })

    it('should unregister on unmount', () => {
      const target = mount(<ShowMessage />)
      expect(media.removeListener).toHaveBeenCalledTimes(0)
      target.unmount()
      expect(media.removeListener).toHaveBeenCalledTimes(1)
    })
  })
})
