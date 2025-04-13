"use client"
import { Provider } from "react-redux"
import Calendar from "@/components/calendar/calendar"
import { store } from "@/lib/redux/store"

export default function Home() {
  return (
    <Provider store={store}>
      <main className="flex min-h-screen flex-col">
        <Calendar />
      </main>
    </Provider>
  )
}
