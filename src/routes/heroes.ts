import config from '../../config';
import * as Router from 'koa-router';
import * as ctrl from '../controllers/heroes';
import * as compose from 'koa-compose';

const router = new Router({
    prefix: `${config.api.baseURL}/heroes`,
});

router.get('/', ctrl.getAll);
router.post('/', ctrl.save);
router.delete('/:id', ctrl.deleteHero);
router.post('/:id', ctrl.save);

const routes = router.routes();
export default compose([routes]);