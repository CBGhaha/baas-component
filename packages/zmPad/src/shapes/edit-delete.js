import {
    Shape
} from '../shape';
export class EditDeleteShape extends Shape {
    constructor(stage, style, clientid, toolname, showtype, data) {
        super(stage, style, clientid, toolname, showtype, data);
        this.data = data;
    }
    pushPoint(point) {

        const uids = this.data;
        //console.log('pushPoint pushPoint', point, uids);
        const cacheDataInstance = this.stage.canvasaction.cacheDataInstance;
        const currentLayerData = cacheDataInstance.layerCachData[cacheDataInstance.currentLayerId];
        const deleteIds = [];
        if (currentLayerData) {
            const filterData = currentLayerData.filter((it) => {
                if (it[6] && it[6][0] && uids.includes(it[6][0])) {
                    deleteIds.push(it[2]);
                    const shape = this.showlayer.findOne(`#${it[6][0]}`);
                    if (shape) {
                        if (shape.me) shape.me.unfireEdit(shape);
                        shape.remove()
                    }
                }
                return !deleteIds.includes(it[2])
            })
            this.endDraw();
            // cacheDataInstance.layerCachData[cacheDataInstance.currentLayerId] = filterData;

        }

    }

    startDataTemp(point) {
        return null
    }
    centerDataTemp(point) {
        return null;
    }
    endDataTemp(point) {
        return null;
    }
    draw() {

    }
    endDraw() {
        //if (this.showtype !== 'replayData') this.templayer.batchDraw();
    }
    changeRegular() {

    }

}