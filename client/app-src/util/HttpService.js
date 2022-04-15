export class HttpService {

    _handleErrors(res) {
        // se não estiver ok, lança a exceção
        if(!res.ok) throw new Error(res.statusText);
        // se nenhum exceção foi lançada, retorna a própria resposta
        return res;
    }
    
    get(url) {
        /*return new Promise((resolve, reject) => {
            const xhr = newXMLHttpRequest();
            xhr.open('GET', url);

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        console.log(xhr.responseText);
                        
                        reject(xhr.responseText);
                    }
                }
            };
            xhr.send();
        });*/

        return fetch(url)
            .then(res => this._handleErrors(res))
            .then(res => res.json());
    }
}