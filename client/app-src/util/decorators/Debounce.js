export function debounce(milissegundos = 500) {
    return function(target, key, descriptor) {

        const metodoOriginal = descriptor.value;

        let timer = 0;

        descriptor.value = function(...args) {

            // MUDANÇA!
            if(event) {
                event.preventDefault();
            }

            clearInterval(timer);
                                                
            // chama metodoOriginal depois de X milissegundos!
            timer = setTimeout(() => metodoOriginal.apply(this, args), milissegundos);
        }

        return descriptor;
    }
}