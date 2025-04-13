import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Goal, Task } from "@/lib/types"

interface GoalsState {
  goals: Goal[]
  tasks: Task[]
  selectedGoal: Goal | null
  loading: boolean
  error: string | null
}

const initialState: GoalsState = {
  goals: [],
  tasks: [],
  selectedGoal: null,
  loading: false,
  error: null,
}

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
  const response = await fetch("/api/goals")
  if (!response.ok) {
    throw new Error("Failed to fetch goals")
  }
  return response.json()
})

export const fetchTasks = createAsyncThunk("goals/fetchTasks", async (goalId: string) => {
  const response = await fetch(`/api/goals/${goalId}/tasks`)
  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }
  return response.json()
})

export const deleteAllGoals = createAsyncThunk("goals/deleteAllGoals", async () => {
  const response = await fetch("/api/goals", {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete all goals")
  }
  return response.json()
})

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    selectGoal: (state, action: PayloadAction<Goal>) => {
      state.selectedGoal = action.payload
    },
    clearAllGoals: (state) => {
      state.goals = []
      state.tasks = []
      state.selectedGoal = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch goals
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.loading = false
        state.goals = action.payload
        if (action.payload.length > 0 && !state.selectedGoal) {
          state.selectedGoal = action.payload[0]
        }
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch goals"
      })

      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false
        state.tasks = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch tasks"
      })

      // Delete all goals
      .addCase(deleteAllGoals.fulfilled, (state) => {
        state.goals = []
        state.tasks = []
        state.selectedGoal = null
      })
  },
})

export const { selectGoal, clearAllGoals } = goalsSlice.actions
export default goalsSlice.reducer
