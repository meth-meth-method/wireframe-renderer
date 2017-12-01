function findProp(address, target) {
    const trail = address.split('.');
    const prop = trail.pop();
    const object = trail.reduce((object, prop) => {
        return object[prop];
    }, target);
    return {object, prop}
}

export function control(targets, callback) {
    const inputs = document.querySelectorAll('.controls input');
    [...inputs].forEach(input => {
        const {prop, object} = findProp(input.name, targets);
        input.addEventListener('input', event => {
            const value = parseFloat(event.target.value);
            object[prop] = value;
            console.log('Setting %s to %f', prop, value);
            if (callback) {
                callback();
            }
        });
        input.value = object[prop];
    });
}
