import * as compose from 'koa-compose';
import * as Router from 'koa-router';
import ping from './ping';
import heroes from './heroes';

const router = new Router();
const routes = router.routes();
const routesToExport = [routes, ping, heroes];

export default () => compose(routesToExport);
