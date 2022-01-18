import { mostChangedBalance } from './etherApi.js'

const route = (app) => {
    app.get("/mostChangedBalance", async (req, res, next) => {
        try {
            const balance = await mostChangedBalance(100);
            res.json(balance);
        } catch (error) {
            return next(error);
        }

    });

};

export default route;