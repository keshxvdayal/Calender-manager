import { configureStore } from "@reduxjs/toolkit"
import eventsReducer from "./slices/events-slice"
import goalsReducer from "./slices/goals-slice"

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    goals: goalsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
