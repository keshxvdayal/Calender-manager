import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Sample data for seeding the database
const goals = [
  { title: "Be fit", color: "red" },
  { title: "Academics", color: "blue" },
  { title: "LEARN", color: "purple" },
  { title: "Sports", color: "green" },
]

const tasks = [
  { title: "AI based agents", goalId: "" },
  { title: "MLE", goalId: "" },
  { title: "DE related", goalId: "" },
  { title: "Basics", goalId: "" },
]

const events = [
  {
    title: "Monday Wake-Up Hour",
    category: "exercise",
    startTime: "2025-04-22T08:00:00",
    endTime: "2025-04-22T09:00:00",
  },
  {
    title: "All-Team Kickoff",
    category: "work",
    startTime: "2025-04-22T09:00:00",
    endTime: "2025-04-22T10:00:00",
  },
  {
    title: "Financial Update",
    category: "work",
    startTime: "2025-04-22T10:00:00",
    endTime: "2025-04-22T11:00:00",
  },
  {
    title: "Design Review",
    category: "work",
    startTime: "2025-04-22T13:00:00",
    endTime: "2025-04-22T14:00:00",
  },
  {
    title: "1:1 with Jon",
    category: "work",
    startTime: "2025-04-22T14:00:00",
    endTime: "2025-04-22T15:00:00",
  },
  {
    title: "Design Review: Acme Marketing",
    category: "work",
    startTime: "2025-04-23T09:00:00",
    endTime: "2025-04-23T10:00:00",
  },
  {
    title: "Design System Kickoff Lunch",
    category: "work",
    startTime: "2025-04-23T12:00:00",
    endTime: "2025-04-23T13:00:00",
  },
  {
    title: "Concept Design Review II",
    category: "work",
    startTime: "2025-04-23T14:00:00",
    endTime: "2025-04-23T15:00:00",
  },
  {
    title: "Design Team Happy Hour",
    category: "social",
    startTime: "2025-04-23T16:00:00",
    endTime: "2025-04-23T17:00:00",
  },
  {
    title: "Webinar: Figma Advanced",
    category: "work",
    startTime: "2025-04-24T09:00:00",
    endTime: "2025-04-24T10:00:00",
  },
  {
    title: "MVP Prioritization Workshop",
    category: "work",
    startTime: "2025-04-24T13:00:00",
    endTime: "2025-04-24T14:00:00",
  },
  {
    title: "Design Review",
    category: "work",
    startTime: "2025-04-24T13:00:00",
    endTime: "2025-04-24T14:00:00",
  },
  {
    title: "Coffee Chat",
    category: "social",
    startTime: "2025-04-24T09:00:00",
    endTime: "2025-04-24T10:00:00",
  },
  {
    title: "Health Benefits Walkthrough",
    category: "work",
    startTime: "2025-04-25T10:00:00",
    endTime: "2025-04-25T11:00:00",
  },
  {
    title: "Onboarding Presentation",
    category: "work",
    startTime: "2025-04-24T11:00:00",
    endTime: "2025-04-24T12:00:00",
  },
  {
    title: "Coffee",
    category: "social",
    startTime: "2025-04-26T09:00:00",
    endTime: "2025-04-26T10:00:00",
  },
  {
    title: "Marketing Meet-and-Greet",
    category: "social",
    startTime: "2025-04-26T12:00:00",
    endTime: "2025-04-26T13:00:00",
  },
  {
    title: "1:1 with Manager",
    category: "work",
    startTime: "2025-04-26T14:00:00",
    endTime: "2025-04-26T15:00:00",
  },
  {
    title: "Happy Hour",
    category: "social",
    startTime: "2025-04-26T16:00:00",
    endTime: "2025-04-26T17:00:00",
  },
]

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Clear existing data
    await db.collection("goals").deleteMany({})
    await db.collection("tasks").deleteMany({})
    await db.collection("events").deleteMany({})

    // Insert goals
    const insertedGoals = await db.collection("goals").insertMany(goals)

    // Get the inserted goal IDs
    const goalIds = Object.values(insertedGoals.insertedIds).map((id) => id.toString())

    // Assign the LEARN goal ID to all tasks
    const learnGoalId = goalIds[2] // Index 2 is LEARN
    const tasksWithGoalId = tasks.map((task) => ({
      ...task,
      goalId: learnGoalId,
    }))

    // Insert tasks
    await db.collection("tasks").insertMany(tasksWithGoalId)

    // Insert events
    await db.collection("events").insertMany(events)

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      data: {
        goals: goalIds.length,
        tasks: tasks.length,
        events: events.length,
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
