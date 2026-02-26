import confetti from "canvas-confetti"
import { useRef } from "react"
import { Sparkles } from "lucide-react"

export function UltraCelebrationButton() {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const triggerCelebration = () => {
        // Play sound
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(() => { })
        }

        // Firework multi-burst animation
        const duration = 2500
        const end = Date.now() + duration

        const frame = () => {
            confetti({
                particleCount: 6,
                angle: 60,
                spread: 70,
                origin: { x: 0 },
                colors: ['#ec4899', '#eab308', '#a855f7']
            })

            confetti({
                particleCount: 6,
                angle: 120,
                spread: 70,
                origin: { x: 1 },
                colors: ['#ec4899', '#eab308', '#a855f7']
            })

            confetti({
                particleCount: 10,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#ec4899', '#eab308', '#a855f7']
            })

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }

        frame()
    }

    return (
        <>
            <button
                onClick={triggerCelebration}
                aria-label="Celebrate"
                className="
          fixed bottom-10 right-10 z-[100]
          flex items-center gap-4
          px-10 py-5
          rounded-3xl
          text-xl font-bold
          bg-primary text-primary-foreground
          shadow-[0_0_40px_rgba(147,51,234,0.5)]
          hover:scale-105
          hover:shadow-[0_0_60px_rgba(147,51,234,0.8)]
          active:scale-95
          transition-all duration-300
          animate-[fadeInUp_0.6s_ease-out_forwards]
        "
                style={{
                    animation: 'fadeInUp 0.6s ease-out forwards, float 4s ease-in-out infinite 0.6s'
                }}
            >
                <Sparkles className="w-7 h-7 animate-pulse" />
                مبسوطين يولاد؟
            </button>

            <audio
                ref={audioRef}
                src="/sounds/celebration.mp3"
                preload="auto"
            />
        </>
    )
}
