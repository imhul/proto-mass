import React, { memo, useState } from "react";

// Components
import {
    EyeOutlined,
    EyeInvisibleOutlined,
} from '@ant-design/icons';

const GameInfoBlock = memo(({ children }) => {

    const [opacity, setOpacity] = useState(0.5);
    const [visibility, setVisibility] = useState(true);

    return (
        <div 
            className="info-block" 
            style={{opacity: visibility ? 1 : opacity}}
            onMouseOver={() => !visibility && setOpacity(1)}
            onMouseOut={() => !visibility && setOpacity(0.5)}
            onMouseLeave={() => !visibility && setOpacity(0.5)}
        >
            <div className="visibility">
                {
                    !visibility &&
                    <EyeOutlined onClick={() => setVisibility(true)} />
                }
                {
                    visibility &&
                    <EyeInvisibleOutlined onClick={() => setVisibility(false)} />
                }
            </div>
            { children }
        </div>
    )
});

export default GameInfoBlock;
