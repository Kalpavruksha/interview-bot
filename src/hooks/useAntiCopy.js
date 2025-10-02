import { useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'

// Custom hook to prevent copying and cheating
const useAntiCopy = (enabled = true) => {
  const dispatch = useDispatch()
  const tabSwitchCount = useRef(0)
  const lastFocusTime = useRef(Date.now())
  const timeAnomalyDetected = useRef(false)
  const flagged = useRef(false)

  useEffect(() => {
    if (!enabled) return

    // Function to prevent text selection
    const preventSelection = (e) => {
      e.preventDefault()
      return false
    }

    // Function to prevent context menu
    const preventContextMenu = (e) => {
      e.preventDefault()
      return false
    }

    // Function to prevent keyboard shortcuts for copying
    const preventKeyboardCopy = (e) => {
      // Prevent Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A, Ctrl+U, F12
      if (
        e.ctrlKey && 
        (
          e.keyCode === 67 || // C
          e.keyCode === 88 || // X
          e.keyCode === 86 || // V
          e.keyCode === 65 || // A
          e.keyCode === 85 || // U
          e.keyCode === 83    // S
        )
      ) {
        e.preventDefault()
        return false
      }
      
      // Prevent F12 (developer tools)
      if (e.keyCode === 123) {
        e.preventDefault()
        return false
      }
      
      // Prevent Ctrl+Shift+I (developer tools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault()
        return false
      }
      
      // Prevent Ctrl+Shift+J (console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault()
        return false
      }
    }

    // Function to prevent drag and drop
    const preventDrag = (e) => {
      e.preventDefault()
      return false
    }

    // Function to detect developer tools
    const detectDevTools = () => {
      // This is a simple detection, more sophisticated methods exist
      const threshold = 160
      let devtools = {
        open: false,
        orientation: null
      }
      
      const emitEvent = (isOpen, orientation) => {
        devtools.open = isOpen
        devtools.orientation = orientation
      }
      
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            emitEvent(true, 'vertical')
            toast.error('Developer tools detected! This may be considered cheating.', {
              duration: 5000
            })
          }
        } else {
          if (devtools.open) {
            emitEvent(false, null)
          }
        }
      }, 500)
    }

    // Tab switch detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        tabSwitchCount.current += 1
        toast.error(`Tab switch detected! Warning ${tabSwitchCount.current}/3`, {
          duration: 3000
        })
        
        // After 3 warnings, consider it cheating and flag the candidate
        if (tabSwitchCount.current >= 3 && !flagged.current) {
          flagged.current = true
          toast.error('Multiple tab switches detected. Candidate has been flagged for review.', {
            duration: 5000
          })
          
          // Dispatch action to flag the candidate
          dispatch({ 
            type: 'UPDATE_CURRENT_CANDIDATE', 
            payload: { flagged: true, flaggedReason: 'Multiple tab switches detected' } 
          })
        }
      } else {
        // Tab is visible again, check for time anomalies
        const currentTime = Date.now()
        const timeDiff = currentTime - lastFocusTime.current
        
        // If the time difference is significantly larger than expected, it might be a time anomaly
        if (timeDiff > 30000 && !timeAnomalyDetected.current) { // 30 seconds
          timeAnomalyDetected.current = true
          toast.error('Time anomaly detected! This may be considered cheating.', {
            duration: 5000
          })
        }
        
        lastFocusTime.current = currentTime
      }
    }

    // Screenshot detection (basic implementation)
    const handleScreenshotDetection = () => {
      // This is a basic detection method - more sophisticated methods exist
      let lastPrintPress = 0
      
      document.addEventListener('keydown', (e) => {
        // Detect Print Screen key
        if (e.keyCode === 44) {
          const now = Date.now()
          // If Print Screen is pressed multiple times in quick succession
          if (now - lastPrintPress < 1000) {
            toast.error('Screenshot attempt detected! This may be considered cheating.', {
              duration: 5000
            })
          }
          lastPrintPress = now
        }
        
        // Detect Ctrl+P (print)
        if (e.ctrlKey && e.keyCode === 80) {
          e.preventDefault()
          toast.error('Print attempt detected! This may be considered cheating.', {
            duration: 3000
          })
          return false
        }
      })
    }

    // Add event listeners
    document.addEventListener('copy', preventSelection)
    document.addEventListener('cut', preventSelection)
    document.addEventListener('paste', preventSelection)
    document.addEventListener('contextmenu', preventContextMenu)
    document.addEventListener('keydown', preventKeyboardCopy)
    document.addEventListener('dragstart', preventDrag)
    document.addEventListener('selectstart', preventSelection)
    document.addEventListener('mouseup', preventSelection)
    document.addEventListener('mousedown', preventSelection)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Start developer tools detection
    detectDevTools()
    
    // Start screenshot detection
    handleScreenshotDetection()

    // Cleanup event listeners
    return () => {
      document.removeEventListener('copy', preventSelection)
      document.removeEventListener('cut', preventSelection)
      document.removeEventListener('paste', preventSelection)
      document.removeEventListener('contextmenu', preventContextMenu)
      document.removeEventListener('keydown', preventKeyboardCopy)
      document.removeEventListener('dragstart', preventDrag)
      document.removeEventListener('selectstart', preventSelection)
      document.removeEventListener('mouseup', preventSelection)
      document.removeEventListener('mousedown', preventSelection)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, dispatch])
}

export default useAntiCopy