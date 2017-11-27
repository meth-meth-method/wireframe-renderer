export function meshControl(mesh) {
    const inputs = document.querySelectorAll('input.mesh');
    [...inputs].forEach(input => {
        const [prop, axis] = input.name.split('.');
        input.addEventListener('input', event => {
            mesh[prop][axis] = parseFloat(event.target.value);
        });
    });
}
