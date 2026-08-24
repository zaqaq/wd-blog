import { useEffect, useRef, useState, type RefObject } from 'react'

type Point = { x: number; y: number }

type LoginCharactersProps = {
  isTyping?: boolean
  showPassword?: boolean
  passwordLength?: number
}

function usePointer() {
  const [point, setPoint] = useState<Point>({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      setPoint({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return point
}

function lookOffset(
  ref: RefObject<HTMLDivElement | null>,
  pointer: Point,
  maxDistance: number,
  forceLook?: Point,
) {
  if (forceLook) {
    return forceLook
  }
  const node = ref.current
  if (!node) {
    return { x: 0, y: 0 }
  }
  const box = node.getBoundingClientRect()
  const centerX = box.left + box.width / 2
  const centerY = box.top + box.height / 2
  const deltaX = pointer.x - centerX
  const deltaY = pointer.y - centerY
  const distance = Math.min(Math.hypot(deltaX, deltaY), maxDistance)
  const angle = Math.atan2(deltaY, deltaX)
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  }
}

function faceFollow(ref: RefObject<HTMLDivElement | null>, pointer: Point) {
  const node = ref.current
  if (!node) {
    return { faceX: 0, faceY: 0, bodySkew: 0 }
  }
  const box = node.getBoundingClientRect()
  const centerX = box.left + box.width / 2
  const centerY = box.top + box.height / 3
  const deltaX = pointer.x - centerX
  const deltaY = pointer.y - centerY
  return {
    faceX: Math.max(-15, Math.min(15, deltaX / 20)),
    faceY: Math.max(-10, Math.min(10, deltaY / 30)),
    bodySkew: Math.max(-6, Math.min(6, -deltaX / 120)),
  }
}

function Pupil({
  pointer,
  size = 12,
  maxDistance = 5,
  forceLook,
}: {
  pointer: Point
  size?: number
  maxDistance?: number
  forceLook?: Point
}) {
  const ref = useRef<HTMLDivElement>(null)
  const offset = lookOffset(ref, pointer, maxDistance, forceLook)

  return (
    <div
      ref={ref}
      className="rounded-full bg-[#2D2D2D]"
      style={{
        width: size,
        height: size,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  )
}

function EyeBall({
  pointer,
  size = 18,
  pupilSize = 7,
  maxDistance = 5,
  blinking = false,
  forceLook,
}: {
  pointer: Point
  size?: number
  pupilSize?: number
  maxDistance?: number
  blinking?: boolean
  forceLook?: Point
}) {
  const ref = useRef<HTMLDivElement>(null)
  const offset = lookOffset(ref, pointer, maxDistance, forceLook)

  return (
    <div
      ref={ref}
      className="flex items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-150"
      style={{
        width: size,
        height: blinking ? 2 : size,
      }}
    >
      {!blinking && (
        <div
          className="rounded-full bg-[#2D2D2D]"
          style={{
            width: pupilSize,
            height: pupilSize,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  )
}

export function LoginCharacters({
  isTyping = false,
  showPassword = false,
  passwordLength = 0,
}: LoginCharactersProps) {
  const pointer = usePointer()
  const [purpleBlink, setPurpleBlink] = useState(false)
  const [blackBlink, setBlackBlink] = useState(false)
  const [lookingAtEachOther, setLookingAtEachOther] = useState(false)
  const [peeking, setPeeking] = useState(false)
  const purpleRef = useRef<HTMLDivElement>(null)
  const blackRef = useRef<HTMLDivElement>(null)
  const orangeRef = useRef<HTMLDivElement>(null)
  const yellowRef = useRef<HTMLDivElement>(null)
  const hidingPassword = passwordLength > 0 && !showPassword
  const watchingPassword = passwordLength > 0 && showPassword
  const shy = isTyping || hidingPassword
  const purplePos = faceFollow(purpleRef, pointer)
  const blackPos = faceFollow(blackRef, pointer)
  const orangePos = faceFollow(orangeRef, pointer)
  const yellowPos = faceFollow(yellowRef, pointer)
  const hideLook = watchingPassword ? { x: -5, y: -4 } : undefined
  const peekLook = watchingPassword
    ? { x: peeking ? 4 : -4, y: peeking ? 5 : -4 }
    : lookingAtEachOther
      ? { x: 3, y: 4 }
      : undefined
  const blackLook = watchingPassword
    ? { x: -4, y: -4 }
    : lookingAtEachOther
      ? { x: 0, y: -4 }
      : undefined

  useEffect(() => {
    let timeoutId = 0
    const schedule = () => {
      timeoutId = window.setTimeout(
        () => {
          setPurpleBlink(true)
          window.setTimeout(() => {
            setPurpleBlink(false)
            schedule()
          }, 150)
        },
        Math.random() * 4000 + 3000,
      )
    }
    schedule()
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    let timeoutId = 0
    const schedule = () => {
      timeoutId = window.setTimeout(
        () => {
          setBlackBlink(true)
          window.setTimeout(() => {
            setBlackBlink(false)
            schedule()
          }, 150)
        },
        Math.random() * 4000 + 3000,
      )
    }
    schedule()
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (!isTyping) {
      setLookingAtEachOther(false)
      return
    }
    setLookingAtEachOther(true)
    const timer = window.setTimeout(() => setLookingAtEachOther(false), 800)
    return () => window.clearTimeout(timer)
  }, [isTyping])

  useEffect(() => {
    if (!watchingPassword) {
      setPeeking(false)
      return
    }
    const timeoutId = window.setTimeout(
      () => {
        setPeeking(true)
        window.setTimeout(() => setPeeking(false), 800)
      },
      Math.random() * 3000 + 2000,
    )
    return () => window.clearTimeout(timeoutId)
  }, [watchingPassword, peeking])

  return (
    <div className="relative h-[400px] w-[550px]">
      <div
        ref={purpleRef}
        className="absolute bottom-0 z-[1] rounded-t-[10px] bg-[#6C3FF5] transition-all duration-700 ease-in-out"
        style={{
          left: 70,
          width: 180,
          height: shy ? 440 : 400,
          transform: watchingPassword
            ? 'skewX(0deg)'
            : shy
              ? `skewX(${purplePos.bodySkew - 12}deg) translateX(40px)`
              : `skewX(${purplePos.bodySkew}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-700 ease-in-out"
          style={{
            left: watchingPassword
              ? 20
              : lookingAtEachOther
                ? 55
                : 45 + purplePos.faceX,
            top: watchingPassword
              ? 35
              : lookingAtEachOther
                ? 65
                : 40 + purplePos.faceY,
          }}
        >
          <EyeBall pointer={pointer} blinking={purpleBlink} forceLook={peekLook} />
          <EyeBall pointer={pointer} blinking={purpleBlink} forceLook={peekLook} />
        </div>
      </div>

      <div
        ref={blackRef}
        className="absolute bottom-0 z-[2] rounded-t-[8px] bg-[#2D2D2D] transition-all duration-700 ease-in-out"
        style={{
          left: 240,
          width: 120,
          height: 310,
          transform: watchingPassword
            ? 'skewX(0deg)'
            : lookingAtEachOther
              ? `skewX(${blackPos.bodySkew * 1.5 + 10}deg) translateX(20px)`
              : shy
                ? `skewX(${blackPos.bodySkew * 1.5}deg)`
                : `skewX(${blackPos.bodySkew}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-700 ease-in-out"
          style={{
            left: watchingPassword
              ? 10
              : lookingAtEachOther
                ? 32
                : 26 + blackPos.faceX,
            top: watchingPassword
              ? 28
              : lookingAtEachOther
                ? 12
                : 32 + blackPos.faceY,
          }}
        >
          <EyeBall
            pointer={pointer}
            size={16}
            pupilSize={6}
            maxDistance={4}
            blinking={blackBlink}
            forceLook={blackLook}
          />
          <EyeBall
            pointer={pointer}
            size={16}
            pupilSize={6}
            maxDistance={4}
            blinking={blackBlink}
            forceLook={blackLook}
          />
        </div>
      </div>

      <div
        ref={orangeRef}
        className="absolute bottom-0 left-0 z-[3] h-[200px] w-[240px] rounded-t-[120px] bg-[#FF9B6B] transition-all duration-700 ease-in-out"
        style={{
          transform: watchingPassword
            ? 'skewX(0deg)'
            : `skewX(${orangePos.bodySkew}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-200 ease-out"
          style={{
            left: watchingPassword ? 50 : 82 + orangePos.faceX,
            top: watchingPassword ? 85 : 90 + orangePos.faceY,
          }}
        >
          <Pupil pointer={pointer} forceLook={hideLook} />
          <Pupil pointer={pointer} forceLook={hideLook} />
        </div>
      </div>

      <div
        ref={yellowRef}
        className="absolute bottom-0 z-[4] h-[230px] w-[140px] rounded-t-[70px] bg-[#E8D754] transition-all duration-700 ease-in-out"
        style={{
          left: 310,
          transform: watchingPassword
            ? 'skewX(0deg)'
            : `skewX(${yellowPos.bodySkew}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-200 ease-out"
          style={{
            left: watchingPassword ? 20 : 52 + yellowPos.faceX,
            top: watchingPassword ? 35 : 40 + yellowPos.faceY,
          }}
        >
          <Pupil pointer={pointer} forceLook={hideLook} />
          <Pupil pointer={pointer} forceLook={hideLook} />
        </div>
        <div
          className="absolute h-1 w-20 rounded-full bg-[#2D2D2D] transition-all duration-200 ease-out"
          style={{
            left: watchingPassword ? 10 : 40 + yellowPos.faceX,
            top: watchingPassword ? 88 : 88 + yellowPos.faceY,
          }}
        />
      </div>
    </div>
  )
}
