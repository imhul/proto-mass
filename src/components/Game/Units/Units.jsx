import React, { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Selectors
import { unitsSelector, unitsLimitSelector } from '../../../selectors/units'
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
    const unitsLimit = useSelector(unitsLimitSelector);

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
    // if (unitList.length < unitsLimit) {
    //     console.info('synthesizing hook');
    useGetUnit(newUnit || newEnemy);
    useGetTask(fakeTask);
    // }

    return (unitList && unitList.length) && unitList.map(unit =>
        <Unit {...props} unit={unit} key={unit.id} />)
});

export default Units;
