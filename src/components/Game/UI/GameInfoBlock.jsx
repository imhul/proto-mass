import React, { memo } from "react";

const GameInfoBlock = memo(({ children }) => {

    return (
        <div className="info-block">
            { children }
        </div>
    )
});

export default GameInfoBlock;
