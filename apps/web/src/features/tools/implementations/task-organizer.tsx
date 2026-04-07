import { useState, useId } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { Loader2, ClipboardList, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { GET_TASK_ITEMS } from '../graphql/task-items.queries'
import {
  CREATE_TASK_ITEM,
  UPDATE_TASK_ITEM,
  DELETE_TASK_ITEM,
} from '../graphql/task-items.mutations'

export function TaskOrganizer() {
  const [newTaskText, setNewTaskText] = useState('')
  const inputId = useId()

  const { data, loading, error, refetch } = useQuery(GET_TASK_ITEMS)

  const [createTaskItem, { loading: creating }] = useMutation(CREATE_TASK_ITEM, {
    onCompleted: () => {
      refetch()
      setNewTaskText('')
    },
  })

  const [updateTaskItem] = useMutation(UPDATE_TASK_ITEM, {
    onCompleted: () => refetch(),
  })

  const [deleteTaskItem] = useMutation(DELETE_TASK_ITEM, {
    onCompleted: () => refetch(),
  })

  const sortedTasks = [...(data?.taskItems ?? [])].sort(
    (a, b) => (a.order as number) - (b.order as number),
  )

  const completedCount = sortedTasks.filter((t) => t.completed).length
  const totalCount = sortedTasks.length

  function handleAddTask() {
    const trimmed = newTaskText.trim()
    if (trimmed === '') return
    createTaskItem({
      variables: {
        input: {
          text: trimmed,
        },
      },
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAddTask()
  }

  function handleToggleCompleted(id: string, currentCompleted: boolean) {
    updateTaskItem({
      variables: { id, input: { completed: !currentCompleted, text: undefined } },
    })
  }

  function handleDelete(id: string) {
    deleteTaskItem({ variables: { id } })
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center" role="status" aria-label="Cargando tareas">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-destructive">Error al cargar las tareas.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div role="group" aria-label="Agregar nueva tarea" className="flex gap-2">
        <Label htmlFor={inputId} className="sr-only">
          Nueva tarea
        </Label>
        <Input
          id={inputId}
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe una nueva tarea..."
          aria-label="Nueva tarea"
          className="flex-1"
        />
        <Button
          onClick={handleAddTask}
          disabled={newTaskText.trim() === '' || creating}
          aria-label="Agregar tarea"
        >
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Plus className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="ml-1.5">Agregar</span>
        </Button>
      </div>

      {totalCount > 0 && (
        <p className="text-sm text-muted-foreground">
          {completedCount} de {totalCount} {totalCount === 1 ? 'completada' : 'completadas'}
        </p>
      )}

      {totalCount === 0 && (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <ClipboardList className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">Agrega tu primera tarea</p>
        </div>
      )}

      {totalCount > 0 && (
        <ScrollArea className="flex-1">
          <ul className="space-y-1 pr-4" role="list" aria-label="Lista de tareas">
            {sortedTasks.map((task) => {
              const checkboxId = `task-${task.id}`
              return (
                <li key={task.id}>
                  <Card className="group">
                    <CardContent className="flex items-center gap-3 py-3 pl-4 pr-3">
                      <Checkbox
                        id={checkboxId}
                        checked={task.completed as boolean}
                        onCheckedChange={() =>
                          handleToggleCompleted(task.id, task.completed as boolean)
                        }
                        aria-label={`Marcar "${task.text as string}" como ${task.completed ? 'pendiente' : 'completada'}`}
                      />
                      <Label
                        htmlFor={checkboxId}
                        className={`min-w-0 flex-1 cursor-pointer break-all text-sm ${
                          task.completed
                            ? 'text-muted-foreground line-through'
                            : 'text-foreground'
                        }`}
                      >
                        {task.text as string}
                      </Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                        aria-label={`Eliminar tarea "${task.text as string}"`}
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              )
            })}
          </ul>
        </ScrollArea>
      )}
    </div>
  )
}
