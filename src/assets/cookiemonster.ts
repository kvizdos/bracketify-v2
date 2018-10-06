let getCookie = (cname) => {
    let cookies = document.cookie.split(";");
    let foundCookie = false;
    for(let cookie in cookies) {
        let newCookie = cookies[cookie].split("=");
        if(newCookie[0] == cname) {
            foundCookie = true;
            return newCookie[1];
        }
    }

    if(!foundCookie) {
        return undefined;
    }
}

function setCookie(name, data, expire_days, path) {
    var expireOn = new Date();

    if(expire_days !== undefined) {
        if(expire_days !== "never") {
            expireOn.setTime(expireOn.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        } else {
            expireOn.setTime(99999999999999);
        }
    }

    document.cookie = `${name}=${data}; expires=${expireOn}; path=${path}`;
}

// You could call this deleting a cookie...
function eatCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

export { getCookie, setCookie, eatCookie }