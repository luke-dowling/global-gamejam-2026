import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import UIElement from "../components/ui-element"
import { useControls } from "../hooks/use-controls"
import { useSceneManager } from "../components/scene-manager/use-scene-manager"
import { VenetianMask } from "lucide-react"

export default function Start() {
  const { switchScene } = useSceneManager()
  const pressSpaceRef = useRef<HTMLParagraphElement>(null)

  useControls({
    keyboard: {
      // Todo: change game to menu when the game is ready
      " ": () => switchScene("game"),
      Enter: () => switchScene("game"),
    },
  })

  useFrame(({ clock }) => {
    if (pressSpaceRef.current) {
      const fade = Math.sin(clock.getElapsedTime() * 1.5) * 0.35 + 0.65
      pressSpaceRef.current.style.opacity = fade.toString()
    }
  })

  return (
    <UIElement>
      <div className='flex flex-col justify-evenly items-center h-full'>
        <header>
          <section className='flex justify-center gap-1 py-3 items-center'>
            <div className='w-20 border-b-2 border-white'></div>
            <VenetianMask size={48} />
            <div className='w-20 border-b-2 border-white'></div>
          </section>
          <h1 className='text-center uppercase text-8xl  tracking-wide font-bold text-white drop-shadow-lg py-5'>
            Masks
          </h1>
          <section className='flex justify-center gap-3 py-3 items-center'>
            <div className='h-2 w-2 rounded-[50%] bg-white'></div>

            <h2 className='text-3xl font-light drop-shadow-lg uppercase tracking-wide'>
              A 2.5d Adventure
            </h2>
            <div className='h-2 w-2 rounded-[50%] bg-white opacity-85'></div>
          </section>
        </header>
        <p ref={pressSpaceRef} className='text-3xl font-extralight'>
          Press Space to Start
        </p>
      </div>
    </UIElement>
  )
}
