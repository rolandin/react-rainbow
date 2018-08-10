import React from 'react';
import iconContainer from './../../IconContainer';
import iconPropTypes from './../propTypes';
import iconDefaultProps from './../defaultProps';

function Ai(props) {
    const { className, style } = props;

    return (
        <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 64">
            <path d="m5.1 0c-2.8 0-5.1 2.3-5.1 5.1v53.8c0 2.8 2.3 5.1 5.1 5.1h45.8c2.7 0 5-2.3 5-5.1v-38.6l-18.9-20.3h-31.9z" fillRule="evenodd" clipRule="evenodd" fill="#FFC35E" />
            <path d="m55.9 20.4v1h-12.8s-6.3-1.3-6.1-6.8c0 0 0.2 5.8 6 5.8h12.9z" fillRule="evenodd" clipRule="evenodd" fill="#FFB446" />
            <path d="m37 0v14.6c0 1.6 1.1 5.8 6.1 5.8h12.8l-18.9-20.4z" opacity=".5" fillRule="evenodd" clipRule="evenodd" fill="#fff" />
            <path d="m20.1 53.9c-0.3 0-0.6-0.2-0.7-0.5l-0.9-2.2h-6l-0.9 2.2c-0.1 0.3-0.4 0.5-0.7 0.5-0.4 0-0.8-0.4-0.8-0.8 0-0.1 0-0.2 0.1-0.3l4.1-10.3c0.2-0.5 0.7-0.8 1.2-0.8 0.6 0 1 0.3 1.2 0.8l4.2 10.3c0 0.1 0 0.2 0 0.3 0 0.4-0.3 0.8-0.8 0.8z m-4.6-10.5l-2.5 6.4h5.1l-2.6-6.4z m8.5 10.5c-0.4 0-0.7-0.3-0.7-0.7v-10.8c0-0.4 0.3-0.7 0.8-0.7 0.4 0 0.7 0.3 0.7 0.7v10.8c0 0.4-0.3 0.7-0.8 0.7z" fill="#fff" />
        </svg>
    );
}

Ai.propTypes = iconPropTypes;
Ai.defaultProps = iconDefaultProps;

export default iconContainer(Ai);
