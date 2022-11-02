//-------------------------------------------------------------
//  Helper methods
//-------------------------------------------------------------
const HELPERS = {};
const MENU_ROUTER_LINKS = ['dashboard', 'categorys', 'customers', 'vendors', 'jobs', 'services', 'sub-categorys', 'car-brand', 'car-model'];

HELPERS.getParticularRouterLinkName = (index) => {
    return MENU_ROUTER_LINKS[index];
}

export default HELPERS;