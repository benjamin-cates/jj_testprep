import React from "react";

import "../style/tabs.css"

interface Props {
    tab_names: string[]
    set_tab: (str: string) => void,
    active_tab: string,
}

const TabBar: React.FC<Props> = (props: Props) => {
    return <div className="tab_bar">
        {props.tab_names.map((v, i) => {
            return <button key={i} className={"tab" + (props.active_tab == v ? " active" : "")} onClick={() => props.set_tab(v)}>{v}</button>
        })}
    </div>;
}

export { TabBar };