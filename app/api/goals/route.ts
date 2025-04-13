import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const goals = await db.collection("goals").find({}).toArray()

    return NextResponse.json(
      goals.map((goal) => ({
        ...goal,
        _id: goal._id.toString(),
      })),
    )
  } catch (error) {
    console.error("Error fetching goals:", error)
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const { db } = await connectToDatabase()
    
    // Delete all tasks first (since they reference goals)
    await db.collection("tasks").deleteMany({})
    
    // Then delete all goals
    await db.collection("goals").deleteMany({})
    
    return NextResponse.json({ message: "All goals and tasks deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete goals" }, { status: 500 })
  }
}
