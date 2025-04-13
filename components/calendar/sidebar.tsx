"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useDrag } from "react-dnd"
import { Home, Trash2 } from "lucide-react"
import { selectGoal, fetchTasks, deleteAllGoals } from "@/lib/redux/slices/goals-slice"
import type { RootState, AppDispatch } from "@/lib/redux/store"
import type { Goal, Task } from "@/lib/types"
import { Button } from "@/components/ui/button"

const goalColors: Record<string, string> = {
  "Be fit": "bg-red-100 hover:bg-red-200",
  "Academics": "bg-blue-100 hover:bg-blue-200",
  "LEARN": "bg-purple-100 hover:bg-purple-200",
  "Sports": "bg-green-100 hover:bg-green-200",
}

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { goals, tasks, selectedGoal, loading } = useSelector((state: RootState) => state.goals)

  useEffect(() => {
    if (selectedGoal) {
      dispatch(fetchTasks(selectedGoal._id))
    }
  }, [dispatch, selectedGoal])

  const handleGoalClick = (goal: Goal) => {
    dispatch(selectGoal(goal))
  }

  const handleDeleteAllGoals = () => {
    if (window.confirm("Are you sure you want to delete all goals and their tasks? This action cannot be undone.")) {
      dispatch(deleteAllGoals())
    }
  }

  return (
    <div className="w-64 border-r bg-gray-50 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-gray-700">GOALS</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteAllGoals}
          className="h-8 w-8 text-gray-500 hover:text-red-500"
          title="Delete all goals"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-auto flex-1">
        <div className="p-2 space-y-1">
          {goals.map((goal) => (
            <GoalItem
              key={goal._id}
              goal={goal}
              isSelected={selectedGoal?._id === goal._id}
              onClick={() => handleGoalClick(goal)}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-b">
        <h2 className="font-semibold text-gray-700">TASKS</h2>
      </div>
      <div className="overflow-auto flex-1">
        <div className="p-2 space-y-1">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              goalColor={selectedGoal ? goalColors[selectedGoal.title] : "bg-gray-100"}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface GoalItemProps {
  goal: Goal
  isSelected: boolean
  onClick: () => void
}

const GoalItem = ({ goal, isSelected, onClick }: GoalItemProps) => {
  const baseColor = goalColors[goal.title]?.split(" ")[0] || "bg-gray-100"
  const hoverColor = goalColors[goal.title]?.split(" ")[1] || "hover:bg-gray-200"
  
  return (
    <div
      className={`flex items-center p-2 rounded-md cursor-pointer ${baseColor} ${hoverColor} ${
        isSelected ? "ring-2 ring-offset-2 ring-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <Home className="h-4 w-4 mr-2 text-gray-500" />
      <span>{goal.title}</span>
    </div>
  )
}

interface TaskItemProps {
  task: Task
  goalColor: string
}

const TaskItem = ({ task, goalColor }: TaskItemProps) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "task",
    item: { 
      type: "task", 
      task,
      goalColor: goalColor.split(" ")[0].replace("bg-", "") // Convert 'bg-red-100' to 'red'
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={dragRef}
      className={`flex items-center p-2 rounded-md cursor-move ${goalColor} ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Home className="h-4 w-4 mr-2 text-gray-500" />
      <span>{task.title}</span>
    </div>
  )
}

export default Sidebar
