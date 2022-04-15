export class ApplicationException extends Error {
    constructor(msg = '') {
        super(msg);
        this.name = this.constructor.name;
    }
}

// hack do System.js para que a função tenha acesso à definição da classe
const exception = ApplicationException;

export function isApplicationException(err) {
    return err instanceof exception || 
      Object.getPrototypeOf(err) instanceof exception 
}

export function getExceptionMessage(err) {
    if(isApplicationException(err)) {
        return err.message;
    } else {
        console.log(err);
        return 'Não foi possível realizar a operação.';
    }
}