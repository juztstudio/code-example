import React from "react";
import {Input, Switch} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {TemplateProps} from "./FilterEditorShapes";
import DrawerPanelFooter from "../DrawerPanel/DrawerPanelFooter";
import TagCheckable from "../TagCheckable/TagCheckable";
import "./FilterEditorStyles.scss";

const FilterEditorTemplate = (props: TemplateProps) => (
    <div className="filter-editor">
        <div className="filter-editor__body">

            <label className="filter-editor__row">
                <span className="filter-editor__label">Название фильтра</span>
                <Input className="filter-editor__input"
                       value={props.item?.title}
                       onChange={props.onTitleChange}/>
            </label>

            <label className="filter-editor__row">
                <span className="filter-editor__label">Статус</span>
                <Switch className="filter-editor__switch"
                        checked={props.item?.isActive}
                        onChange={props.onStatusChange}
                        checkedChildren={<CheckOutlined/>}
                        unCheckedChildren={<CloseOutlined/>}/>
            </label>

            <div className="filter-editor__row">
                <span className="filter-editor__label">Каналы</span>
                <div className="filter-editor__tags">
                    {
                        props.channels &&
                        props.channels.map((channel) => (
                            <TagCheckable
                                key={channel.id}
                                checked={props.channelsSelected.hasOwnProperty(channel.id)}
                                onChange={checked => props.onChannelClick(channel, checked)}>
                                {channel.title}
                            </TagCheckable>
                        ))
                    }
                </div>
            </div>

        </div>

        <div className="filter-editor__foot">
            <DrawerPanelFooter textClose={'Отмена'}
                               textSubmit={'Сохранить'}
                               onSubmit={props.onFilterSubmit}
                               onClose={props.onFilterCancel}/>
        </div>
    </div>
);

export default FilterEditorTemplate;