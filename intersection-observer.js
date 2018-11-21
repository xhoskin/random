const queryString = 'm-object';
const observables = Array.from(document.querySelectorAll(`.${queryString}`));

const options = {
    root: null,
    rootMargin: '0px',
    threshold: [],
};

function buildThresholdList(startPoint, numSteps) {
    const thresholds = [];

    for (let i = startPoint; i <= numSteps; i++) {
        const ratio = i / numSteps;
        thresholds.push(ratio);
    }

    thresholds.push(0);
    return thresholds;
}

const scaleOut = (event, observer) => {
    const { target } = event[0];
    const header = target.querySelector('h3');
    const intersectionRatio = Math.floor(event[0].intersectionRatio * 100);
    header.style.transform = `scale(${intersectionRatio / 100})`;
};

const cbRotate = (event, observer) => {
    const target = event[0].target;
    const header = target.querySelector('h3');

    if (event[0].boundingClientRect.y < 0) {
        header.style.transform = `rotate(${Math.round(
            event[0].intersectionRatio * 360
        )}deg)`;
    } else {
        header.style.transform = 'rotate(360deg)';
    }
};

const cbParallax = (event, observer) => {
    const { target } = event[0];
    const headers = Array.from(target.querySelectorAll('h3'));
    const ratio = event[0].intersectionRatio * 100 - 50;
    if (
        event[0].boundingClientRect.y <=
        event[0].boundingClientRect.height / 2
    ) {
        if (headers.length) {
            headers[0].style.transform = `translateY(${ratio * 0.5}px)`;
            headers[1].style.transform = `translateY(${ratio * 3}px)`;
        }
    }
};

const cbFinal = event => {
    const { target } = event[0];
    const header = target.querySelector('h3');
    const ratio = Math.ceil(event[0].intersectionRatio * 100);
    const col = Math.ceil((ratio - 100) * -1 * 2.55);
    
    header.style.transform = `scale(${ratio / 100})`;
    header.querySelector('a').style.color = `rgba(${col}, ${col}, ${col}, 1)`;
    if (event[0].boundingClientRect.y < 150) {
        if (!target.classList.contains('is-active')) {
            target.classList.add('is-active');
        }
    }
};

observables.forEach((observable, i) => {
    const itemClass = observable.classList;
    let obs;
    switch( true ) {
        case itemClass.contains(`${queryString}--observe`):
            options.threshold = buildThresholdList(1.0, 100.0);
            obs = new IntersectionObserver(scaleOut, options);
            obs.observe(observable);
            break;
        case itemClass.contains(`${queryString}--rotate`):
            options.threshold = buildThresholdList(1.0, 360.0);
            obs = new IntersectionObserver(cbRotate, options);
            obs.observe(observable);
            break;
        case itemClass.contains(`${queryString}--parallax`):
            options.threshold = buildThresholdList(0.5, 100.0);
            obs = new IntersectionObserver(cbParallax, options);
            obs.observe(observable);
            break;
        case itemClass.contains(`${queryString}--final`):
            options.threshold = buildThresholdList(1.0, 100.0);
            obs = new IntersectionObserver(cbFinal, options);
            obs.observe(observable);
            break;
        default:
            obs = new IntersectionObserver(callback, options);
            obs.observe(observable);
    }
});
