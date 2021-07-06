import { mount } from 'redom';
import { App } from './app';
import { api } from './api';
import { init as initRoboPen, hideRoboPen as hideRoboPenNew} from './robopen'
import { makeUUID } from './util';


export const zmSketchPad = window.zmSketchPad = (dom, dataCb, resizeCb, options) => {
    
    const app = new App(dataCb,dom, resizeCb,options);
    api(app);
    mount(dom, app);
    return app;
}

export const roboPenDataPush = (data,whiteInstance) => {
    initRoboPen(data,whiteInstance)
    //{nStatus, nX = 0, nY = 0, nPress=1} 
}
export const hideRoboPen = () => {
    hideRoboPenNew()
}
export const makeUid = () => {
    return makeUUID();
}


