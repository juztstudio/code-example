import BaseModel from "./BaseModel";
import ENDPOINTS from "../constants/Endpoints";
import Filter, {FilterEmpty} from "../interfaces/Filter";


class FilterModel extends BaseModel<Filter, FilterEmpty> {

    getInstanceId(item: Filter): number | null {
        return item.id;
    }

    public createBlank = async (): Promise<FilterEmpty> => {
        const item: FilterEmpty = {
            title: '',
            isActive: true,
            isDeleted: false,
            products: [],
            channels: [],
        }
        return Promise.resolve(item)
            .then(result => this.enrichItem<FilterEmpty>(result));
    }
}

export default new FilterModel(ENDPOINTS.filter);