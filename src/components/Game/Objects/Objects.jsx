import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IsometricObject } from "react-isometric-tilemap";

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
            frames={[require("../../../assets/sprites/tree.png")]}
            active
        />
    )
};

export default Objects;