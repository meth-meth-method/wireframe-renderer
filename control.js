export function meshControl(mesh) {
    const inputs = document.querySelectorAll('input.mesh');
    [...inputs].forEach(input => {
        const [prop, axis] = input.name.split('.');
        input.addEventListener('input', event => {
            mesh[prop][axis] = parseFloat(event.target.value);
        });
    });
}

export function cameraControl(camera) {
    const inputs = document.querySelectorAll('input.camera');
    [...inputs].forEach(input => {
        const trail = input.name.split('.');
        const prop = trail.pop();
        const obj = trail.reduce((obj, prop) => {
            return obj[prop];
        }, camera);

        input.addEventListener('input', event => {
            obj[prop] = parseFloat(event.target.value);
        });
    });
}
