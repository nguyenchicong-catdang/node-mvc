// backend/admin/core/ApiAdmin.js

class ApiAdmin {

    getRouter() {
        return async (req, res, next) => {
            await this.validateApiRequest(req, res);
            if (!res.headersSent) {
                // If not, it means the request was not handled by the API, so move to the next middleware
                next();
            }
        }
    }

    async validateApiRequest(req, res) {
        const queryObject = req.query;
        const controllerMethodString = Object.keys(queryObject)[0];
        const params = {};
        for (const [key, value] of Object.entries(queryObject).slice(1)) {
            params[key] = value;
        }
        if (controllerMethodString && controllerMethodString.includes('@')) {
            const [controllerName, methodName] = controllerMethodString.split('@');
            const controllerFile = `../controllers/${controllerName}.js`;
            try {
                const module = await import(controllerFile);
                if (!module[controllerName]) {
                    return res.json({error: `Không tồn tại class ${controllerName}`})
                }
                const controllerInstance = new module[controllerName](req, res);
                if (typeof controllerInstance[methodName] !== 'function') {
                    return res.json({error: `Không tồn tại: ${methodName}`});
                }
                return controllerInstance[methodName](params);
            } catch (e) {
                console.error(e);
                return res.json({error: `Không tồn tại ${controllerName}`});
            }
        }
        return res.json({mess: 'api admin'})
    }

}

export {ApiAdmin}