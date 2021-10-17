import React, { memo } from 'react';
import { useSelector } from 'react-redux';

// Components
import GameInfoBlock from './GameInfoBlock';
import { Divider } from 'antd';

// Selectors
import { userActionSelector } from '../../../selectors/map';
import { colonyNameSelector } from '../../../selectors/game';

// images
import botSrc from '../../../assets/sprites/animations/bot/bot_0_0.2s.png';

const UserActionInfo = memo(() => {
    const userAction = useSelector(userActionSelector);
    const colonyName = useSelector(colonyNameSelector);

    const damage =
        userAction &&
        userAction.data &&
        userAction.data.stats &&
        userAction.data.stats.damage &&
        userAction.data.stats.damage > 0
            ? userAction.data.stats.damage
            : null;

    const health =
        userAction && userAction.data && userAction.data.stats && userAction.data.stats.health
            ? userAction.data.stats.health
            : null;

    const healthPoints =
        userAction && userAction.data && userAction.data.stats && userAction.data.stats.healthPoints
            ? userAction.data.stats.healthPoints
            : null;

    return (
        <GameInfoBlock>
            <div className="hover-box">
                <Divider plain>{colonyName}</Divider>
                {userAction && (
                    <>
                        <div>{userAction.x && `x: ${JSON.stringify(userAction.x)}`}</div>
                        <div>{userAction.y && `y: ${JSON.stringify(userAction.y)}`}</div>
                        <div>
                            {userAction.objectType &&
                                `type: ${JSON.stringify(userAction.objectType)}`}
                        </div>
                        <div>
                            {userAction.actionType &&
                                `action: ${JSON.stringify(userAction.actionType)}`}
                        </div>
                        <div>{damage ? `damage: ${JSON.stringify(damage)}` : null}</div>
                        <div>
                            {health && healthPoints
                                ? `health: ${JSON.stringify(health)}/${JSON.stringify(
                                      healthPoints
                                  )}`
                                : null}
                        </div>
                        {userAction.data && (
                            <>
                                {
                                    <div>
                                        {userAction.data.name &&
                                            `name: ${JSON.stringify(userAction.data.name)}`}
                                    </div>
                                }
                                {userAction.data.src && (
                                    <div className="img-wrapper">
                                        <img
                                            src={
                                                userAction.objectType === 'unit'
                                                    ? botSrc
                                                    : userAction.data.src
                                            }
                                            alt={`game ${userAction.objectType}`}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </GameInfoBlock>
    );
});

export default UserActionInfo;
