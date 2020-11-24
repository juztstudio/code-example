import {ChangeEventHandler, MouseEventHandler} from "react";
import {SwitchChangeEventHandler} from "antd/lib/switch";
import Filter, {FilterEmpty} from "../../interfaces/Filter";
import Channel from "../../interfaces/Channel";

export interface Props {
    itemId?: Filter['id'],
    onSubmit: (item: Filter) => void,
    onCancel: MouseEventHandler<HTMLElement>,
}

export interface State {
    item: Filter | FilterEmpty | null,
    channels: Channel[],
    channelsSelected: { [key: number]: Channel },
    isLoading: boolean,
}

export interface TemplateProps extends State {
    onTitleChange: ChangeEventHandler<HTMLInputElement>,
    onStatusChange: SwitchChangeEventHandler,
    onFilterSubmit: MouseEventHandler<HTMLElement>,
    onFilterCancel: MouseEventHandler<HTMLElement>,
    onChannelClick: (channel: Channel, checked: boolean) => void,
}