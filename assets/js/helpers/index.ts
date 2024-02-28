export function isObject(data: any) {
    return !Array.isArray(data) && data !== null && typeof data === "object";
}

// camelize
export function camelize(str: string) {
    if(typeof str !== "string") throw new Error("toCamelCase error: argument str must be typeof string");
    return str.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2) {
        if(p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
}

export function camelizeObject(obj: { [key: string]: any  }): { [key: string]: any } {
    return Object.fromEntries(Object.entries(obj).map((item) => {
        const prop = camelize(item[0]),
            value = isObject(item[1]) ? camelizeObject(item[1]) : item[1];
        return [ prop, value ];
    }));
}

//decamelize
export function decamelize(str: string, separator = "_") {
    if(typeof str !== "string") throw new Error("decamelize error: argument str must be typeof string");
    return str
        .replace(/([a-z\d])([A-Z])/g, `$1${separator}$2`)
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, `$1${separator}$2`)
        .toLowerCase();
}

export function decamelizeObject(obj: { [key: string]: any  }): { [key: string]: any } {
    return Object.fromEntries(Object.entries(obj).map((item) => {
        const prop = decamelize(item[0]),
            value = isObject(item[1]) ? decamelizeObject(item[1]) : item[1];
        return [ prop, value ];
    }));
}