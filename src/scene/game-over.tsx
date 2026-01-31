import UIElement from "../components/ui-element"
import { useControls } from "../hooks/use-controls"
import { useSceneManager } from "../components/scene-manager/use-scene-manager"
import { Skull } from "lucide-react"

export default function GameOver() {
  const { switchScene } = useSceneManager()

  useControls({
    keyboard: {
      " ": () => switchScene("start"),
      Enter: () => switchScene("start"),
    },
  })

  return (
    <UIElement>
      <div className='flex flex-col justify-evenly items-center h-full'>
        <header>
          <section className='flex justify-center gap-1 py-3 items-center'>
            <div className='w-20 border-b-2 border-white'></div>
            <Skull size={48} />
            <div className='w-20 border-b-2 border-white'></div>
          </section>
          <h1 className='text-center uppercase text-8xl tracking-wide font-bold text-white drop-shadow-lg py-5'>
            Game Over
          </h1>
          <section className='flex justify-center gap-3 py-3 items-center'>
            <div className='h-2 w-2 rounded-[50%] bg-white'></div>

            <h2 className='text-3xl font-light drop-shadow-lg uppercase tracking-wide'>
              You died
            </h2>
            <div className='h-2 w-2 rounded-[50%] bg-white opacity-85'></div>
          </section>
        </header>

        {/* <div className='flex gap-8'>
          <button
            onClick={() => switchScene("game")}
            onTouchEnd={() => switchScene("game")}
            className='group relative border-2 border-white/30 bg-white/5 hover:bg-white/20 hover:border-white/60 transition-all duration-300 px-8 py-4 rounded-lg backdrop-blur-sm cursor-pointer flex flex-col justify-center items-center'
          >
            <div className='text-2xl font-light uppercase tracking-wider text-center'>
              Try Again
            </div>
            <div className='absolute inset-0 rounded-lg bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300'></div>
          </button>

          <button
            onClick={() => switchScene("menu")}
            onTouchEnd={() => switchScene("menu")}
            className='group relative border-2 border-white/30 bg-white/5 hover:bg-white/20 hover:border-white/60 transition-all duration-300 px-8 py-4 rounded-lg backdrop-blur-sm cursor-pointer flex flex-col justify-center items-center'
          >
            <div className='text-2xl font-light uppercase tracking-wider text-center'>
              Back to Menu
            </div>
            <div className='absolute inset-0 rounded-lg bg-linear-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300'></div>
          </button>
        </div> */}

        <p className='text-2xl font-extralight text-white/60'>
          Press Space to return to start
        </p>
      </div>
    </UIElement>
  )
}
