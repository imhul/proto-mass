import React, { memo } from "react";

const RightGameInfoPanel = memo(({ children }) => {

    return (
        <div className="right-box">
            { children }
        </div>
    )
});

export default RightGameInfoPanel;
