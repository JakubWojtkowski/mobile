import { ID, databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand';

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

    newTaskInput: string;
    newTaskType: TypedColumn;
    image: File | null;

    setNewTaskInput: (input: string) => void;
    setNewTaskType: (columnId: TypedColumn) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
    setImage: (image: File | null) => void;

    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: {
        columns: new Map<TypedColumn, Column>(),
    },

    searchString: "",
    newTaskInput: "",
    newTaskType: "todo",
    image: null,

    setSearchString: (searchString: string) => set({ searchString }),

    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board });
    },

    setBoardState: (board) => set({ board }),
    setImage: (image: File | null) => set({ image }),


    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
        const newColumns = new Map(get().board.columns);

        // delete todoId from newColumns
        newColumns.get(id)?.todos.splice(taskIndex, 1);

        set({ board: { columns: newColumns } });

        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }

        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
        )
    },

    setNewTaskInput: (input: string) => set({ newTaskInput: input }),
    setNewTaskType: (columnId: TypedColumn) => set({
        newTaskType: columnId
    }),

    addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
        let file: Image | undefined;

        if (image) {
            const flleUploaded = await uploadImage(image);
            if (flleUploaded) {
                file = {
                    bucketId: flleUploaded.bucketId,
                    fileId: flleUploaded.$id,
                };
            }
        }

        const { $id } = await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                // include image if it exists
                ...(file && { image: JSON.stringify(file) }),
            }
        );

        set({ newTaskInput: "" });

        set((state) => {
            const newColumns = new Map(state.board.columns);

            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                // include image if it exists
                ...(file && { image: file }),
            };

            const column = newColumns.get(columnId);

            if (!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo],
                });
            } else {
                newColumns.get(columnId)?.todos.push(newTodo);
            }

            return {
                board: {
                    columns: newColumns,
                }
            }
        })
    },

    updateTodoInDB: async (todo, colunnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            {
                title: todo.title,
                status: colunnId,
            }
        );
    },
}));