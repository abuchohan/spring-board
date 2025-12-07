import { PageWrapper } from '@/layouts/PageWrapper'
import { memo, useCallback, useState, type ChangeEvent } from 'react'

// this is app
const TransactionsPage = () => {
    const [items, setItems] = useState<{ id: string; name: string }[]>([])
    const [value, setValue] = useState<string>('')

    const addTaskHandler = () => {
        if (!value) return
        setItems((prev) => [...prev, { id: crypto.randomUUID(), name: value }])
        setValue('')
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    const onRemoveHandler = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }, [])

    return (
        <PageWrapper title="Transactions">
            <input
                onChange={handleInputChange}
                value={value}
                placeholder="add task"
            />
            <button onClick={addTaskHandler}>Add Task</button>

            <Tasks items={items} onRemove={onRemoveHandler} />
        </PageWrapper>
    )
}

const Tasks = ({
    items,
    onRemove,
}: {
    onRemove: (id: string) => void
    items: { id: string; name: string }[]
}) => {
    return items.length == 0 ? (
        'there are no tasks'
    ) : (
        <>
            <p>
                You have {items.length} task{items.length > 1 ? `'s` : ''} left
                to complete
            </p>
            <ul>
                {items.map((item) => (
                    <Task
                        key={item.id}
                        name={item.name}
                        id={item.id}
                        onRemove={onRemove}
                    />
                ))}
            </ul>
        </>
    )
}

const Task = memo(function Task({
    name,
    id,
    onRemove,
}: {
    name: string
    id: string
    onRemove: (id: string) => void
}) {
    return (
        <li>
            {name}
            <button className="pl-5" onClick={() => onRemove(id)}>
                Remove
            </button>
        </li>
    )
})

export default TransactionsPage
