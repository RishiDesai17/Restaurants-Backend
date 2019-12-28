const express = require('express');
const router = express.Router();
const MenuContoller = require('../controllers/menuitems');
const checkAuth = require('../middleware/check-auth');

router.get('/', MenuContoller.get_all_menuitems);

router.post('/',checkAuth, MenuContoller.create_menuitem);

router.get('/:menuId', MenuContoller.get_menuitem);

router.patch('/:menuId',checkAuth, MenuContoller.update_menuitem);

router.delete('/:menuId',checkAuth, MenuContoller.delete_menuitem);

module.exports = router;
