// backend/admin/core/adminApi.js

function adminApi() {
    return async (req, res, next) => {
        console.log(req.query);
        await validateApiRequest(req, res);
        //return res.send(`adminApi ${req.method} querystring`)
    }
}

// Hàm 1: Validate (kiểm tra hợp lệ) tham số từ query string
async function validateApiRequest(req, res) {
    if (req.query && Object.keys(req.query).length > 0) {
        const { c: controllerName, method: methodName } = req.query;
        const params = {};
        for (const [key, value] of Object.entries(req.query)) {
            if (key !== 'c' && key !=='method') {
                params[key] = value;
            }
        }
        const controllerFile = `../controllers/${controllerName}.js`;
        try {
          const module = await import(controllerFile);
          if (!module[controllerName]) {
            return res.json({error: `Controller "${controllerName}" không tồn tại`})
          }

          const controllerInstance = new module[controllerName](req, res);
          if (typeof controllerInstance[methodName] !== 'function') {
            return res.json({error: `method: "${methodName}" không tồn tài`});
          }
          return controllerInstance[methodName](params);
          //console.log(module)
          //return res.json({success: 'ok'});
        } catch (e) {
          console.error(e);
          return res.json({error:`Lỗi queryString`})
        }
    }
}


export {adminApi}