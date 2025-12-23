import { useState, useRef, useCallback } from 'react'

const SWIPE_THRESHOLD = 50 // Minimum distance for a swipe
const SWIPE_VELOCITY_THRESHOLD = 0.3 // Minimum velocity (px/ms)

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = SWIPE_THRESHOLD,
  velocityThreshold = SWIPE_VELOCITY_THRESHOLD,
  enabled = true
}) {
  const [swipeState, setSwipeState] = useState({
    swiping: false,
    direction: null,
    deltaX: 0,
    deltaY: 0
  })

  const touchStart = useRef({ x: 0, y: 0, time: 0 })
  const touchCurrent = useRef({ x: 0, y: 0 })

  const handleTouchStart = useCallback((e) => {
    if (!enabled) return

    const touch = e.touches[0]
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
    touchCurrent.current = {
      x: touch.clientX,
      y: touch.clientY
    }
    setSwipeState({
      swiping: true,
      direction: null,
      deltaX: 0,
      deltaY: 0
    })
  }, [enabled])

  const handleTouchMove = useCallback((e) => {
    if (!enabled || !swipeState.swiping) return

    const touch = e.touches[0]
    touchCurrent.current = {
      x: touch.clientX,
      y: touch.clientY
    }

    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y

    // Determine primary direction
    let direction = null
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left'
    } else {
      direction = deltaY > 0 ? 'down' : 'up'
    }

    setSwipeState({
      swiping: true,
      direction,
      deltaX,
      deltaY
    })
  }, [enabled, swipeState.swiping])

  const handleTouchEnd = useCallback((e) => {
    if (!enabled || !swipeState.swiping) return

    const deltaX = touchCurrent.current.x - touchStart.current.x
    const deltaY = touchCurrent.current.y - touchStart.current.y
    const duration = Date.now() - touchStart.current.time
    const velocityX = Math.abs(deltaX) / duration
    const velocityY = Math.abs(deltaY) / duration

    // Determine if it was a valid swipe
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)
    const distance = isHorizontalSwipe ? Math.abs(deltaX) : Math.abs(deltaY)
    const velocity = isHorizontalSwipe ? velocityX : velocityY

    if (distance > threshold || velocity > velocityThreshold) {
      if (isHorizontalSwipe) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }

    setSwipeState({
      swiping: false,
      direction: null,
      deltaX: 0,
      deltaY: 0
    })
  }, [enabled, swipeState.swiping, threshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  const handleTouchCancel = useCallback(() => {
    setSwipeState({
      swiping: false,
      direction: null,
      deltaX: 0,
      deltaY: 0
    })
  }, [])

  return {
    swipeState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel
    }
  }
}
