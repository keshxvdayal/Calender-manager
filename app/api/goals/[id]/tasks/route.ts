import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const tasks = await db.collection("tasks").find({ goalId: params.id }).toArray()

    return NextResponse.json(
      tasks.map((task) => ({
        ...task,
        _id: task._id.toString(),
      })),
    )
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}
