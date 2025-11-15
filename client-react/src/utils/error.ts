// src/utils/error.ts
// TODO: i hate .unwrap()
export const getErrorMessage = (payload: unknown): string => {
    if (!payload) return 'Something went wrong'

    if (typeof payload === 'string') return payload

    if (typeof payload === 'object') {
        const obj = payload as Record<string, unknown>
        return (
            (obj.message as string) ??
            (obj.error as string) ??
            'Something went wrong'
        )
    }

    return 'Something went wrong'
}
