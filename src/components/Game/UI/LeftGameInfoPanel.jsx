import React, { memo } from "react";

const LeftGameInfoPanel = memo(({ children }) => {

    return children ? ( 
        <div className="left-box">
            { children }
        </div>
    ) : null
});

export default LeftGameInfoPanel;
