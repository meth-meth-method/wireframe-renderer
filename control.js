function findProp(address, target) {
    const trail = address.split('.');
    const prop = trail.pop();
    const object = trail.reduce((object, prop) => {
        return object[prop];
    }, target);
    return {object, prop}
}

export function meshControl(mesh) {
    const inputs = document.querySelectorAll('input.mesh');
    [...inputs].forEach(input => {
        const {prop, object} = findProp(input.name, mesh);
        input.addEventListener('input', event => {
            object[prop] = parseFloat(event.target.value);
        });
    });
}

export function cameraControl(camera) {
    const inputs = document.querySelectorAll('input.camera');
    [...inputs].forEach(input => {
        const {prop, object} = findProp(input.name, camera);
        input.addEventListener('input', event => {
            object[prop] = parseFloat(event.target.value);
        });
    });
}
