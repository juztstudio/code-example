import ApiService from "../services/ApiService";
import {SYSTEM_PER_PAGE} from "../constants/SystemConfig";
import RequestOptions from "../interfaces/RequestOptions";


abstract class BaseModel<T, TEmpty, TCreate = TEmpty> extends ApiService {

    protected endpointList: string;

    protected endpointSingle: string;

    constructor(endpointUrl: string) {
        super();
        this.endpointList = endpointUrl;
        this.endpointSingle = endpointUrl;
    }

    abstract getInstanceId(item: T): number | null;

    public getAll = async (page: number = 1, perPage: number = SYSTEM_PER_PAGE, options: RequestOptions = {}): Promise<T[]> => {
        const url = this.endpointList;

        return this.get<T[]>(url, {params: {page, perPage, ...options}})
            .then((items: T[]) => this.enrichList(items));
    }

    public getById = async (itemId: number): Promise<T> => {
        const url = `${this.endpointSingle}/${itemId}`;

        return this.get<T>(url)
            .then((item: T) => this.enrichItem(item));
    }


    public create = async (item: TCreate): Promise<T> => {
        const url = this.endpointList;

        const itemPrepared = this.prepareForSave<TCreate>(item);

        return this.post<T>(url, itemPrepared)
            .then((item: T) => this.enrichItem<T>(item));
    }

    public update = async (item: T): Promise<T> => {
        const itemId = this.getInstanceId(item);
        const url = `${this.endpointSingle}/${itemId}`;

        const itemPrepared = this.prepareForSave(item);

        return this.put<T>(url, itemPrepared)
            .then((item: T) => this.enrichItem<T>(item));
    };


    public remove = async (itemId: number): Promise<T> => {
        const url = `${this.endpointSingle}/${itemId}`;

        return this.delete(url);
    }

    public abstract createBlank: () => Promise<TEmpty>;

    public enrichList = (items: T[]) => {
        return items.map(item => this.enrichItem<T>(item));
    }

    public enrichItem = <X extends T | TEmpty>(item: X): X => {
        return item;
    };


    protected prepareForSave = <X extends T | TEmpty | TCreate>(item: X): X => {
        return item;
    };

}

export default BaseModel;
