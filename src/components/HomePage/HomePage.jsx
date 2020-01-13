import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout } from 'antd';

// Utils
import WindowSizeListener from 'react-window-size-listener';

// Gifs
// import stars from '../../assets/img/2.gif';
// import stars3 from '../../assets/img/3.gif';
import explo1 from '../../assets/img/explo01.gif';
import explo2 from '../../assets/img/explo02.gif';
import explo4 from '../../assets/img/explo04.webp';
import explo5 from '../../assets/img/explo05.webp';

const HomePage = () => {

    const dispatch = useDispatch();
    const { size } = useSelector(state => state.stage);

    const getRandom = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const rondomArr = new Array(getRandom(20, 40)).fill({'type': 1}, 0);

    const starsStyles = {
        position: 'absolute',
        width: '100%',
        top: 64,
        left: 0,
        opacity: 0.4,
    };

    return <WindowSizeListener
                onResize={output => dispatch({ type: 'RESIZE', payload: output })}
            >
                <Layout>
                    {/* <img src={stars} className="stars-bg" style={starsStyles} />
                    <img src={stars3} className="stars-bg" style={starsStyles} /> */}
                    <h1 className="hero">proto-mass</h1>
                    <h2 className="hero-desc">sandbox</h2>
                    <div className="home-scene">
                        { 
                            rondomArr.map((item, i) => {
                                const getTop = getRandom(1, ((size.height / 100) * 40));
                                const styles = {
                                    top: getTop,
                                    width: getTop / 3,
                                    position: 'absolute',
                                    animationDuration: `${getRandom(1, 10)}s`,
                                    left: getRandom(40, (size.width - 40)),
                                };
                                return <img className="show" key={i + 1} src={explo1} style={styles} />
                            })
                        }
                        { 
                            rondomArr.map((item, i) => {
                                const getTop = getRandom(1, ((size.height / 100) * 40));  
                                const styles = {
                                    top: getTop,
                                    width: getTop / 3,
                                    position: 'absolute',
                                    animationDuration: `${getRandom(1, 10)}s`,
                                    left: getRandom(40, (size.width - 40)),
                                };
                                return <img className="show" key={i + 2} src={explo2} style={styles} />
                            })
                        }
                        { 
                            rondomArr.map((item, i) => {
                                const getTop = getRandom(1, ((size.height / 100) * 40));  
                                const styles = {
                                    top: getTop,
                                    width: getTop / 3,
                                    position: 'absolute',
                                    animationDuration: `${getRandom(1, 10)}s`,
                                    left: getRandom(40, (size.width - 40)),
                                };
                                return <img className="show" key={i + 4} src={explo4} style={styles} />
                            })
                        }
                        { 
                            rondomArr.map((item, i) => {
                                const getTop = getRandom(1, ((size.height / 100) * 40));  
                                const styles = {
                                    top: getTop,
                                    width: getTop / 3,
                                    position: 'absolute',
                                    animationDuration: `${getRandom(1, 10)}s`,
                                    left: getRandom(40, (size.width - 40)),
                                };
                                return <img className="show" key={i + 5} src={explo5} style={styles} />
                            })
                        }
                    </div>
                </Layout>
    </WindowSizeListener>
}

export default HomePage;
