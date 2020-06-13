import React, { memo } from "react";

const Stats = memo(({ children }) => {

    return (
        <div className="unit-stats">
            { children }
        </div>
    )
});

export default Stats;