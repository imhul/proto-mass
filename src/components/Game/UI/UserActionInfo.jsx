import React, { memo } from "react";
import { useSelector } from 'react-redux';

// Components
import GameInfoBlock from './GameInfoBlock';

// images
import botSrc from '../../../assets/sprites/animations/bot/bot_0_0.2s.png';

const UserActionInfo = memo(() => {

    const { userAction } = useSelector(state => state.map)

    return (
        <GameInfoBlock>
            <div className="hover-box">
                { 
                    userAction && <>
                        <div>x: { JSON.stringify(userAction.x) }</div>
                        <div>y: { JSON.stringify(userAction.y) }</div>
                        <div>{ JSON.stringify(userAction.objectType) }</div>
                        <div>{ JSON.stringify(userAction.actionType) }</div>
                        {
                            userAction.data && <>
                                {
                                    userAction.data.name && <div>
                                        { JSON.stringify(userAction.data.name) }
                                    </div>
                                }
                                { 
                                    userAction.data.src && <div>
                                        <img 
                                            src={userAction.objectType === "unit" ? botSrc : userAction.data.src} 
                                            alt={`game ${userAction.objectType}`} 
                                        />
                                    </div>
                                }
                            </>
                        }
                    </>
                }
            </div>
        </GameInfoBlock>
    )
});

export default UserActionInfo;
