class DataBaseLookUp {
    public static readonly cardDataName: string = 'card';
    public static readonly statBlockDataName: string = 'statBlock';
    public static readonly battleMapDataName: string = 'battleMaps';
    public static readonly eventsDataName: string = 'events';

    public static Collections: Map<string, DataBaseCollection<any>>;

    public static getAs<T>(dataName: string): DataBaseCollection<T> {
        return this.Collections.get(dataName) as DataBaseCollection<T>;
    }
}

interface DataBaseCollection<T> {
    data: T[];
    indexedData: Map<number, T>;
    nameToIndex: Map<string, number>;
    nameToData: Map<string, T>;
}

export { DataBaseCollection, DataBaseLookUp };
