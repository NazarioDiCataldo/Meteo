//Mi creo il custom type delle coordinate
export interface Coordinate  {
    country: string,
    lat: string,
    lon: string,
    name: string,
    state: string,
    local_names: {[key: string] : string }
}
