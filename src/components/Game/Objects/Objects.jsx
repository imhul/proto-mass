import React from 'react';
// import React, { useState, useEffect, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import IsometricObject from '../Map/IsometricObject';

// Utils
import { mockedObjects } from '../../../utils';

const Objects = ({ width, height }) => {
    
    return mockedObjects.map(({x,y}, index) => 
        <IsometricObject
            key={`object${index}`}
            x={x}
            y={y}
            z={1}
            width={width}
            height={height}
            frames={[require("../../../assets/sprites/deadtree3_00.png")]}
            active={true}
            style={{ zIndex: x + 10 }}
        />
    )
};

export default Objects;