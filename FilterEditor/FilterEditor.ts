import {ChangeEventHandler, MouseEventHandler, PureComponent} from "react";
import {message} from "antd";
import {SwitchChangeEventHandler} from "antd/lib/switch";
import Template from "./FilterEditorTemplate";
import {Props, State} from "./FilterEditorShapes";
import Channel from "../../interfaces/Channel";
import Filter, {FilterEmpty} from "../../interfaces/Filter";
import ChannelModel from "../../models/ChannelModel";
import FilterModel from "../../models/FilterModel";

export class FilterEditor extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            item: null,
            channels: [],
            channelsSelected: {},
            isLoading: true,
        };
    }

    componentDidMount() {
        this.filterLoad()
            .catch(err => console.error(err));

        this.channelsLoadFromServer()
            .catch(err => console.error(err));
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
        if (prevProps.itemId !== this.props.itemId) {
            this.filterLoad()
                .catch(err => console.error(err));
        }
    }


    filterLoad = async () => {
        try {
            const item = this.props.itemId
                ? await FilterModel.getById(this.props.itemId)
                : await FilterModel.createBlank();

            const channelsSelected: State['channelsSelected'] = {};

            item.channels.forEach((channel) => {
                channelsSelected[channel.id] = channel;
            });

            this.setState(state => ({...state, item, channelsSelected}));

        } catch (err) {
            message.error('При загрузке данных произошла ошибка');
            console.error(err);
        }
    };

    isFilter = (value: Filter | FilterEmpty): value is Filter => {
        return value.id != null;
    }

    filterSubmit: MouseEventHandler<HTMLElement> = async () => {
        if (this.state.item) {
            try {

                const item: Filter = this.isFilter(this.state.item)
                    ? await FilterModel.update({
                        ...this.state.item,
                        channels: Object.values(this.state.channelsSelected)
                    })
                    : await FilterModel.create({
                        ...this.state.item,
                        channels: Object.values(this.state.channelsSelected)
                    });

                this.props.onSubmit(item);

            } catch (err) {
                message.error('При сохранении фильтра возникла ошибка');
                console.error(err);
            }
        }
    };

    filterCancel: MouseEventHandler<HTMLElement> = (e) => {
        this.props.onCancel(e);
    };


    filterTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (this.state.item) {
            const title: string = e.currentTarget.value;
            const item: Filter | FilterEmpty = {...this.state.item, title};

            this.setState(state => ({...state, item}));
        }
    };

    filterStatusChange: SwitchChangeEventHandler = (isActive) => {
        if (this.state.item) {
            const item: Filter | FilterEmpty = {...this.state.item, isActive};

            this.setState(state => ({...state, item}));
        }
    };

    channelsLoadFromServer = async () => {
        try {
            const channels = await ChannelModel.getAll();
            this.channelsUpdateInList(channels.filter(el => el.isActive));
        } catch (err) {
            message.error('При загрузке списка telegram-каналов произошла ошибка');
            console.error(err);
        }
    };

    channelsUpdateInList = (channels: Channel[]) => {
        this.setState(state => ({...state, channels}));
    };

    channelClick = (channel: Channel) => {
        const channelsSelected = {...this.state.channelsSelected};

        if (channelsSelected.hasOwnProperty(channel.id)) {
            delete channelsSelected[channel.id];
        } else {
            channelsSelected[channel.id] = channel;
        }

        this.setState(state => ({...state, channelsSelected}));
    };


    render() {
        return Template({
            ...this.state,
            onFilterSubmit: this.filterSubmit,
            onFilterCancel: this.filterCancel,
            onChannelClick: this.channelClick,
            onTitleChange: this.filterTitleChange,
            onStatusChange: this.filterStatusChange,
        });
    };
}

export default FilterEditor;