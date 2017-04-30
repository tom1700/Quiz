
let ajaxService = (() => {

    let service = {};

    // private properties
    // public properties
    // private methods
    // public methods
    service.get = (url) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.send(null);

        return new Promise((resolve,reject) => {
            xhr.onreadystatechange = () => {
                const DONE = 4;
                const OK = 200;
                if (xhr.readyState === DONE) {
                    if (xhr.status === OK) {
                        resolve(xhr.responseText);
                    }
                    else {
                        reject(xhr.status);
                    }
                }
            }
        });
    }
    return service;
})();