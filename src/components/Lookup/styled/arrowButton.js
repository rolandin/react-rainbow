import styled from 'styled-components';
import attachThemeAttrs from '../../../styles/helpers/attachThemeAttrs';

const StyledArrowButton = attachThemeAttrs(styled.div)`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 1rem;
    position: absolute;
    left: 2px;
    right: 2px;
    z-index: 10;
    background: ${props => props.palette.background.main};
    border-radius: 12px;

    &::after {
        content: '';
        position: absolute;
        display: block;
        left: 50%;
        pointer-events: none;
        width: 0.45rem;
        height: 0.45rem;
        border-style: solid;
        color: ${props => props.palette.border.main};
        transform: rotate(135deg);
    }

    ${props =>
        props.arrow === 'up' &&
        `
            top: 2px;
            margin-top: 0.2rem;
            cursor: pointer;

            &::after {
                border-width: 0 0 0.15em 0.15em;
                top: 40%;
            }
    `}

    ${props =>
        props.arrow === 'down' &&
        `
            bottom: 2px;
            margin-bottom: 0.2rem;
            cursor: pointer;

            &::after {
                border-width: 0.15em 0.15em 0 0;
            }
    `}
`;

export default StyledArrowButton;
