// backend/admin/controllers/TestController.js

class TestController {
    constructor(req, res) {
        //console.log(res.query);
        this.res = res
    }

    index() {
        return this.res.json({method:'index'});
    }

    show(params = {}) {
        const {id = 1} = params;
        return this.res.json({method:`show: ${id}`});
    }

}

export {TestController}