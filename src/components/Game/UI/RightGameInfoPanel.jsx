import React, { memo } from 'react';

const RightGameInfoPanel = memo(({ children }) => {
    return children ? <div className="right-box">{children}</div> : null;
});

export default RightGameInfoPanel;
