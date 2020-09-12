import React, { memo } from "react";
import { useSelector } from 'react-redux';

// Components
import GameInfoBlock from './GameInfoBlock';

// images
import botSrc from '../../../assets/sprites/animations/bot/bot_0_0.2s.png';

const UserActionInfo = memo(() => {

    const { userAction } = useSelector(state => state.map);

    return (
        <GameInfoBlock>
            <div className="hover-box">
                { 
                    userAction && <>
                        <div>{ userAction.x && `x: ${JSON.stringify(userAction.x)}` }</div>
                        <div>{ userAction.y && `y: ${JSON.stringify(userAction.y)}` }</div>
                        <div>{ userAction.objectType && `type: ${JSON.stringify(userAction.objectType)}` }</div>
                        <div>{ userAction.actionType && `action: ${JSON.stringify(userAction.actionType)}` }</div>
                        <div>{ userAction.data && `damage: ${JSON.stringify(userAction.data.stats.damage)}` }</div>
                        <div>{ userAction.data && `health: ${JSON.stringify(userAction.data.stats.health)}` }</div>
                        {
                            userAction.data && <>
                                {
                                    <div>
                                        { userAction.data.name && `name: ${JSON.stringify(userAction.data.name)}` }
                                    </div>
                                }
                                { 
                                    userAction.data.src && <div className="img-wrapper">
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
