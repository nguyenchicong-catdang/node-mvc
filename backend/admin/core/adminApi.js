// backend/admin/core/adminApi.js

function adminApi() {
    return async (req, res, next) => {
        //console.log(req.query);
        await validateApiRequest(req, res);
        //return res.send(`adminApi ${req.method} querystring`)
        // After validation, check if a response has already been sent
        // If not, proceed to the next middleware
        if (!res.headersSent) {
            next();
        }
    }
}

// Hàm 1: Validate (kiểm tra hợp lệ) tham số từ query string
async function validateApiRequest(req, res) {
    // Get an array of all keys from the query object
    const queryKeys = Object.keys(req.query);
    if (queryKeys.length > 0) {
        // Bước 1: Trích xuất chuỗi controller và method
        const controllerMethodString = queryKeys[0];
        //const params = queryKeys.slice(1);
        const params = {};
        for (const [key, value] of Object.entries(req.query).slice(1)) {
            params[key] = value
        }
        if (controllerMethodString.includes('@')) {
            const [controllerName, methodName] = controllerMethodString.split('@');
            const controllerFile = `../controllers/${controllerName}.js`;

            try {
                const module = await import(controllerFile);
                if (!module[controllerName]) {
                    return res.json({error: `Không tồn tại: ${controllerName}`});
                }
                const controllerInstance = new module[controllerName](req, res);
                if (typeof controllerInstance[methodName] !== 'function') {
                    return res.json({error: `Không tìm thấy: ${methodName}`});
                }
                return controllerInstance[methodName](params);
            } catch (e) {
                console.error(e);
                // Biểu thức chính quy để tìm chuỗi đến dấu / cuối cùng
                // const regex = /^.*[\\/]/;
                // const filename = e.url.replace(regex, '');
                return res.json({error: `Không tìm thấy: ${controllerName}`})
            }
            //console.log(controllerName, methodName);
        }
        //console.log(controllerMethodString);
        // console.log(params);
        // return res.json({dev: queryKeys})
        // const { c: controllerName, method: methodName } = req.query;
        // const params = {};
        // for (const [key, value] of Object.entries(req.query)) {
        //     if (key !== 'c' && key !=='method') {
        //         params[key] = value;
        //     }
        // }
        // const controllerFile = `../controllers/${controllerName}.js`;
        // try {
        //   const module = await import(controllerFile);
        //   if (!module[controllerName]) {
        //     return res.json({error: `Controller "${controllerName}" không tồn tại`})
        //   }

        //   const controllerInstance = new module[controllerName](req, res);
        //   if (typeof controllerInstance[methodName] !== 'function') {
        //     return res.json({error: `method: "${methodName}" không tồn tài`});
        //   }
        //   return controllerInstance[methodName](params);
        //   //console.log(module)
        //   //return res.json({success: 'ok'});
        // } catch (e) {
        //   console.error(e);
        //   return res.json({error:`Lỗi queryString`})
        // }
    } else {
        return res.json({error: 'Lỗi querystring'});
    }
}


export {adminApi}