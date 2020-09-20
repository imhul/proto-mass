import React, { memo } from 'react';
import { useSelector } from 'react-redux';

// Selectors
import { unitsSelector } from '../../../selectors/units';
import { fakePathSelector } from '../../../selectors/objects';

// Hooks
import { useGetUnit, useGetTask } from '../../../hooks';

// Components
import Unit from './Unit';

// utils
import { getRandomInt } from '../../../utils';

const Units = memo(props => {
    // selectors
    const unitList = useSelector(unitsSelector);
    const fakePath = useSelector(fakePathSelector);

    // generators
    const newUnit = {
        name: `bot01101-${unitList.length + 1}`,
        isEnemy: false,
    };

    const newEnemy = {
        name: `enemy01101-${unitList.length + 1}`,
        isEnemy: true,
    };

    // mock
    const fakeTask = {
        limit: 5,
        profession: "collector",
        type: "collect",
        position: fakePath[getRandomInt(0, 50)],
    };

    // synthesizing hooks
    useGetUnit(newUnit || newEnemy);
    useGetTask(fakeTask);

    return (unitList && unitList.length) && unitList.map(unit => <Unit {...props} unitId={unit.id} key={unit.id} />)
});

export default Units;
