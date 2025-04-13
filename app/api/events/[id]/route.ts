import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const event = await db.collection("events").findOne({ _id: new ObjectId(params.id) })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...event,
      _id: event._id.toString(),
    })
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const eventData = await request.json()

    // Remove _id from the update data
    const { _id, ...updateData } = eventData

    const result = await db
      .collection("events")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { ...updateData, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const updatedEvent = await db.collection("events").findOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({
      ...updatedEvent,
      _id: updatedEvent?._id.toString(),
    })
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id // Get the ID from params

  if (!id) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
  }

  try {
    const { db } = await connectToDatabase()
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID format" }, { status: 400 })
    }

    const result = await db.collection("events").deleteOne({ 
      _id: new ObjectId(id) 
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      id: id 
    })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
