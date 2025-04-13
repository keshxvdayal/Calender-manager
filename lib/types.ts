export interface Event {
  _id: string
  title: string
  category: string
  startTime: string
  endTime: string
  goalColor?: string
  goalId?: string
}

export interface Goal {
  _id: string
  title: string
  color: string
}

export interface Task {
  _id: string
  title: string
  goalId: string
}
