import React, { memo } from "react";

const LeftGameInfoPanel = memo(({ children }) => {

    return (
        <div className="left-box">
            { children }
        </div>
    )
});

export default LeftGameInfoPanel;
