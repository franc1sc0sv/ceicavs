import { useState, useRef, useCallback } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { Loader2, FileText, Plus, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { GET_NOTES } from '../graphql/notes.queries'
import { CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE } from '../graphql/notes.mutations'

type EditingState =
  | { mode: 'idle' }
  | { mode: 'creating' }
  | { mode: 'editing'; noteId: string; originalContent: string }

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
}

export function QuickNotes() {
  const [editingState, setEditingState] = useState<EditingState>({ mode: 'idle' })
  const [draftContent, setDraftContent] = useState('')
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data, loading, error, refetch } = useQuery(GET_NOTES)

  const [createNote, { loading: creating }] = useMutation(CREATE_NOTE, {
    onCompleted: () => {
      refetch()
      setEditingState({ mode: 'idle' })
      setDraftContent('')
    },
  })

  const [updateNote] = useMutation(UPDATE_NOTE, {
    onCompleted: () => refetch(),
  })

  const [deleteNote, { loading: deleting }] = useMutation(DELETE_NOTE, {
    onCompleted: () => {
      refetch()
      setDeleteTargetId(null)
    },
  })

  const sortedNotes = [...(data?.notes ?? [])].sort(
    (a, b) => new Date(b.updatedAt as string).getTime() - new Date(a.updatedAt as string).getTime(),
  )

  function handleNewNote() {
    setEditingState({ mode: 'creating' })
    setDraftContent('')
  }

  function handleEditNote(id: string, content: string) {
    setEditingState({ mode: 'editing', noteId: id, originalContent: content })
    setDraftContent(content)
  }

  function handleCancel() {
    setEditingState({ mode: 'idle' })
    setDraftContent('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }

  function handleSave() {
    if (draftContent.trim() === '') return
    if (editingState.mode === 'creating') {
      createNote({ variables: { input: { content: draftContent.trim() } } })
    } else if (editingState.mode === 'editing') {
      updateNote({
        variables: { id: editingState.noteId, input: { content: draftContent.trim() } },
      })
      setEditingState({ mode: 'idle' })
      setDraftContent('')
    }
  }

  const handleBlurAutoSave = useCallback(
    (noteId: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        if (draftContent.trim() !== '') {
          updateNote({ variables: { id: noteId, input: { content: draftContent.trim() } } })
        }
      }, 500)
    },
    [draftContent, updateNote],
  )

  const isEditing = editingState.mode !== 'idle'

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center" role="status" aria-label="Cargando notas">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-destructive">Error al cargar las notas.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {sortedNotes.length === 0
            ? 'Sin notas'
            : `${sortedNotes.length} ${sortedNotes.length === 1 ? 'nota' : 'notas'}`}
        </span>
        {!isEditing && (
          <Button size="sm" onClick={handleNewNote}>
            <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Nueva nota
          </Button>
        )}
      </div>

      {isEditing && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {editingState.mode === 'creating' ? 'Nueva nota' : 'Editar nota'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              autoFocus
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              onBlur={() => {
                if (editingState.mode === 'editing') {
                  handleBlurAutoSave(editingState.noteId)
                }
              }}
              placeholder="Escribe tu nota aquí..."
              className="min-h-32 resize-none break-all"
              aria-label="Contenido de la nota"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {countWords(draftContent)} {countWords(draftContent) === 1 ? 'palabra' : 'palabras'}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={draftContent.trim() === '' || creating}
                >
                  {creating && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
                  Guardar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isEditing && sortedNotes.length === 0 && (
        <div className="flex h-48 flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          </div>
          <p className="text-sm text-muted-foreground">No tienes notas aún</p>
        </div>
      )}

      {sortedNotes.length > 0 && (
        <ScrollArea className="flex-1">
          <ul className="space-y-2 pr-4" role="list" aria-label="Lista de notas">
            {sortedNotes.map((note) => (
              <li key={note.id}>
                <Card className="group relative overflow-hidden">
                  <CardContent className="min-w-0 py-3 pl-4 pr-20">
                    <p className="line-clamp-3 break-all whitespace-pre-wrap text-sm text-foreground">
                      {note.content as string}
                    </p>
                    <time
                      className="mt-1 block text-xs text-muted-foreground"
                      dateTime={note.updatedAt as string}
                    >
                      {new Date(note.updatedAt as string).toLocaleDateString('es-SV', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </CardContent>
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      aria-label="Editar nota"
                      onClick={() => handleEditNote(note.id, note.content as string)}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      aria-label="Eliminar nota"
                      onClick={() => setDeleteTargetId(note.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}

      <AlertDialog open={deleteTargetId !== null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar nota</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La nota será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={() => {
                if (deleteTargetId) {
                  deleteNote({ variables: { id: deleteTargetId } })
                }
              }}
            >
              {deleting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
