import React from 'react';
import './HoverCard.css'
import cross from '../../images/cards/cross.png'
import check from '../../images/cards/check.png'
import download from '../../images/cards/download.png'
import favorite from '../../images/cards/favorite.png'
import chat from '../../images/cards/chat_bubble.png'


const HoverCard = ({ featureProps, selectedCrossingFilters, filterNames }) => {
    let { district, area, cadastral, address, square, ...stats } = featureProps

    const removeUnderscoresAndLower = (obj) => {
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = key.replace(/_/g, '').toLowerCase();
                newObj[newKey] = obj[key];
            }
        }
        return newObj;
    };
    const trimBrackets = (text) => {
        const trimmedText = text.trim();
        if (trimmedText.startsWith('(') && trimmedText.endsWith(')')) {
            return trimmedText.slice(1, -1);
        }
        
        return text;
    };
    const getPercent = (key) => {
        const newKey = key.replace('cnt', 'share')
        if (stats[newKey] * 100 < 1) { return '< 1' }
        return parseInt(stats[newKey] * 100)
    }



    filterNames = removeUnderscoresAndLower(filterNames)
    selectedCrossingFilters = removeUnderscoresAndLower(selectedCrossingFilters)
    stats = removeUnderscoresAndLower(stats)

    const getCase = (count) => {
        if (count % 10 === 1 && count % 100 !== 11) {
            return 'пересечение';
        } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
            return 'пересечения';
        } else {
            return 'пересечений';
        }
    }

    return (
        <div className='hovercard__container'>
            <div className='header_block'>
                <div className='first_row'>
                    <h1>Участок</h1>
                    <div className='header_buttons'>
                        <img src={download} alt="download" />
                        <img src={favorite} alt="favorite" />
                        <img src={chat} alt="chat" />
                    </div>
                </div>
                <div className='second_row'>
                    <h1>{cadastral}</h1>
                    <p className='address'>{trimBrackets(address)}</p>
                </div>
            </div>

            <hr />

            <div>
                <div className='square_block'>
                    <h1>Площадь</h1>
                    <p>{(square / 100000).toFixed(2)} км<sup>2</sup></p>
                </div>
                <div className='intersections_block'>
                    <h1>Пересечения</h1>
                    <div>
                        {Object.keys(selectedCrossingFilters)
                            .filter(key => key !== 'ismsk' && key !== 'iszpo')
                            .map(key => (
                            <div className='intersections' key={key}>
                                <p>{filterNames[key]} </p>
                                <p>{stats[key]} {getCase(stats[key])}, {getPercent(key)}%</p>
                            </div>
                        ))}
                        {['ismsk', 'iszpo'].map(key => (
                            <div className='intersections' key={key}>
                                <p>{filterNames[key]}</p>
                                {stats[key] === true ?
                                    <img src={check} alt="mark" />
                                    : <img src={cross} alt="cross" />
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <hr />

            <div className='footer_block'>
                <h1>Комментарии</h1>
                <div className='comments_block'>
                    <div className='flexbox'>
                        <div className='circle'>
                            <p>M.K.</p>
                        </div>
                        <div className='comment_title'>
                            <h1>Попова М.К.</h1>
                            <p>23 июня 2023</p>
                        </div>
                    </div>
                    <p className='comment_body'>Эту территорию занял ПКРО под свой дом</p>
                </div>
            </div>
        </div>
    );
};

export default HoverCard;