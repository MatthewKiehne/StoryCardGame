export interface DataConverter<T, F> {
    convert(data: T, additionalData: any): F
}
