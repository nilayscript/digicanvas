const NODE_ENV = new URLSearchParams(window.location.search).get('env') || 'local';

const API = {
    LOCAL: 'http://localhost:8000/api/v1/',
    STAGING: 'http://localhost:8000/api/v1/',
    PROD: 'https://api.v2.digisigns.in/api/v1/',
};

const DOMAIN = {
    LOCAL: 'localhost',
    STAGING: 'localhost',
    PROD: 'digisigns.in',
};

const TOKEN_EXPIRE = 1;

export const config = (() => {
    switch (NODE_ENV) {
        case 'staging':
            return {
                api: API.STAGING,
                domain: DOMAIN.STAGING,
                tokenExpire: TOKEN_EXPIRE,
            };
        case 'production':
            return {
                api: API.PROD,
                domain: DOMAIN.PROD,
                tokenExpire: TOKEN_EXPIRE,
            };
        default:
            return {
                api: API.LOCAL,
                domain: DOMAIN.LOCAL,
                tokenExpire: TOKEN_EXPIRE,
            };
    }
})();
