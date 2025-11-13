export default interface Response<
    TData extends object | null | undefined = undefined
> {
    success: boolean;
    issue?: string;
    message?: string;
    data?: TData;
}
