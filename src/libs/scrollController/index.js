/* eslint-disable no-param-reassign */
let hasPassiveEvents = false;
if (typeof window !== 'undefined') {
    const passiveTestOptions = {
        get passive() {
            hasPassiveEvents = true;
            return undefined;
        },
    };
    window.addEventListener('testPassive', null, passiveTestOptions);
    window.removeEventListener('testPassive', null, passiveTestOptions);
}

const isIosDevice =
    typeof window !== 'undefined' &&
    window.navigator &&
    window.navigator.platform &&
    /iP(ad|hone|od)/.test(window.navigator.platform);

const eventOptions = { capture: true };
const passiveEventOptions = { passive: false, capture: true };

let locks = [];
let documentListenerAdded = false;
let initialClientY = -1;
let previousBodyOverflowSetting;
let previousBodyPaddingRight;

// returns true if `element` should be allowed to receive touchmove events.
function allowTouchMove(element) {
    return locks.some(lock => {
        if (lock.options.allowTouchMove && lock.options.allowTouchMove(element)) {
            return true;
        }

        return false;
    });
}

function preventDefault(rawEvent) {
    const event = rawEvent || window.event;

    // For the case whereby consumers adds a touchmove event listener to document.
    // Recall that we do document.addEventListener('touchmove', preventDefault, { passive: false })
    // in disableBodyScroll - so if we provide this opportunity to allowTouchMove, then
    // the touchmove event on document will break.
    if (allowTouchMove(event.target)) {
        return true;
    }

    // Do not prevent if the event has more than one touch (usually meaning this is a multi
    // touch gesture like pinch to zoom).
    if (event.touches.length > 1) return true;

    if (event.preventDefault) event.preventDefault();

    return false;
}

function setOverflowHidden(options) {
    // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
    // the responsiveness for some reason. Setting within a setTimeout fixes this.
    setTimeout(() => {
        // If previousBodyPaddingRight is already set, don't set it again.
        if (previousBodyPaddingRight === undefined) {
            const reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
            const scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

            if (reserveScrollBarGap && scrollBarGap > 0) {
                previousBodyPaddingRight = document.body.style.paddingRight;
                document.body.style.paddingRight = `${scrollBarGap}px`;
            }
        }

        // If previousBodyOverflowSetting is already set, don't set it again.
        if (previousBodyOverflowSetting === undefined) {
            previousBodyOverflowSetting = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        }
    });
}

function restoreOverflowSetting() {
    // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
    // the responsiveness for some reason. Setting within a setTimeout fixes this.
    setTimeout(() => {
        if (previousBodyPaddingRight !== undefined) {
            document.body.style.paddingRight = previousBodyPaddingRight;

            // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
            // can be set again.
            previousBodyPaddingRight = undefined;
        }

        if (previousBodyOverflowSetting !== undefined) {
            document.body.style.overflow = previousBodyOverflowSetting;

            // Restore previousBodyOverflowSetting to undefined
            // so setOverflowHidden knows it can be set again.
            previousBodyOverflowSetting = undefined;
        }
    });
}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
function isTargetElementTotallyScrolled(targetElement) {
    if (targetElement) {
        return targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight;
    }
    return false;
}

function handleScroll(event, targetElement) {
    const clientY = event.targetTouches[0].clientY - initialClientY;

    if (allowTouchMove(event.target)) {
        return false;
    }

    if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
        // element is at the top of its scroll.
        return preventDefault(event);
    }

    if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
        // element is at the top of its scroll.
        return preventDefault(event);
    }

    event.stopPropagation();
    return true;
}

export function disableBodyScroll(targetElement, options) {
    if (isIosDevice) {
        // targetElement must be provided, and disableBodyScroll must not have been
        // called on this targetElement before.
        if (!targetElement) {
            // eslint-disable-next-line no-console
            console.error(
                'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.',
            );
            return;
        }

        if (targetElement && !locks.some(lock => lock.targetElement === targetElement)) {
            const lock = {
                targetElement,
                options: options || {},
            };

            locks = [...locks, lock];

            targetElement.ontouchstart = event => {
                if (event.targetTouches.length === 1) {
                    // detect single touch.
                    initialClientY = event.targetTouches[0].clientY;
                }
            };
            targetElement.ontouchmove = event => {
                if (event.targetTouches.length === 1) {
                    // detect single touch.
                    handleScroll(event, targetElement);
                }
            };

            if (!documentListenerAdded) {
                document.addEventListener(
                    'touchmove',
                    preventDefault,
                    hasPassiveEvents ? passiveEventOptions : eventOptions,
                );
                documentListenerAdded = true;
            }
        }
    } else {
        setOverflowHidden(options);
        const lock = {
            targetElement,
            options: options || {},
        };

        locks = [...locks, lock];
    }
}

export function clearAllBodyScrollLocks() {
    if (isIosDevice) {
        // Clear all locks ontouchstart/ontouchmove handlers, and the references.
        locks.forEach(lock => {
            lock.targetElement.ontouchstart = null;
            lock.targetElement.ontouchmove = null;
        });

        if (documentListenerAdded) {
            document.removeEventListener(
                'touchmove',
                preventDefault,
                hasPassiveEvents ? passiveEventOptions : eventOptions,
            );
            documentListenerAdded = false;
        }

        locks = [];

        // Reset initial clientY.
        initialClientY = -1;
    } else {
        restoreOverflowSetting();
        locks = [];
    }
}

export function enableBodyScroll(targetElement) {
    if (isIosDevice) {
        if (!targetElement) {
            // eslint-disable-next-line no-console
            console.error(
                'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.',
            );
            return;
        }

        targetElement.ontouchstart = null;
        targetElement.ontouchmove = null;

        locks = locks.filter(lock => lock.targetElement !== targetElement);

        if (documentListenerAdded && locks.length === 0) {
            document.removeEventListener(
                'touchmove',
                preventDefault,
                hasPassiveEvents ? passiveEventOptions : eventOptions,
            );

            documentListenerAdded = false;
        }
    } else {
        locks = locks.filter(lock => lock.targetElement !== targetElement);
        if (!locks.length) {
            restoreOverflowSetting();
        }
    }
}

export { default as WindowScrolling } from './windowScrolling';
