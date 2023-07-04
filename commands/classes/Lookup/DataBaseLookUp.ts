class DataBaseLookUp {
    static Collections: Map<string, DataBaseCollection<any>>
}

interface DataBaseCollection<T> {
    data: T[]
    indexedData: Map<number, T>
    nameToIndex: Map<string, number>
    nameToData: Map<string, T>
}

export { DataBaseCollection, DataBaseLookUp }
