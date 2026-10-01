import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { decrement, increment } from '@/features/counter/counterSlice'

function Home() {
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-900">Klestar Mart</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(decrement())}
          className="rounded bg-gray-200 px-4 py-2 font-medium hover:bg-gray-300"
        >
          -
        </button>
        <span className="text-xl font-bold">{count}</span>
        <button
          onClick={() => dispatch(increment())}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default Home
