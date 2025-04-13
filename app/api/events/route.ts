import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const events = await db.collection("events").find({}).toArray()

    return NextResponse.json(
      events.map((event) => ({
        ...event,
        _id: event._id.toString(),
      })),
    )
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const eventData = await request.json()

    const result = await db.collection("events").insertOne({
      ...eventData,
      createdAt: new Date(),
    })

    const newEvent = await db.collection("events").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        ...newEvent,
        _id: newEvent?._id.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
