import { el } from "redom";
export class RobotPenIcon {
    constructor(canvas) {
      //this.canvas = canvas;
      this.el = el("img.zm-sketchpad-robopen-icon",{ 
        src : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDcvMDcvMTUv3CSZAAACQ0lEQVRYhb3XP2saYRzA8a96t0kpJQ5dhIDUIDkiOrVCbIMeaEKSPRLM1qVrh+5Bim/AF1Bfg4VmCmRoKJbuHbqlfyBNqp4aPX9d7uTSnPVP7vzBLerj5/s8x4EiIizjAh4B74Am8HL8+pLwJ8AnYAgI0ALeiAgB6wO+TSAQiAGnwGOXt1/7vfN1a7dSq9VkdXVVrBOwr57fuBGNRn+vrKyIpmnSaDQkFos5Az77iffi8fiVaZrSbDYlFApJPB6Xer0uiqKYwAWw7geeAHpra2vXnU5H7Dk/P5dIJCKqqg6BP8Azz58CC+9qmnZtGIb8O5qm/QAGwNPxGq/xjY2NVr/fv4NnMpnv1n1/fmudV3gwGOwlk8m2G57NZn9a+Is7az3EO2741tbWL7edexJg46lUquuG53K5SwvfnPgd98XT6XTPDdd1/WoavnCAjR8cHLgeu67r17PgCwXYeKlUcj32QqHQnhWfOwBIhEKh/iS8WCwa8+BzBdj44eHhjRu+vb3dnRefOcDGy+Xy0A3f2dnpL4LPFDAN393dHSyKTw1w4KYf+H8DgISiKDdHR0ejCfjwvvjEgGn43t6e6QXuGuDAxW/8TgCQUFV1MAnf398feYnfCpgBF6/xcQDwIBwOG/l8fqm4M6AIyPHx8VJxZ8Bb+6dypVJZGm7ZpIEz5x+GarUqpVLJd9wO2AQunQGABIPBkaqqWT9xEUEBXgEPAQP4Gg6Hv7Tb7Q+j0ejENM0LfB4F+AZ8BN4DJ61W68xv1Dl/AQ+g4z6prP8/AAAAAElFTkSuQmCC',
        style: {
          position:'absolute',
          zIndex:'10',
          left: '0px',
          top: '-32px',
          transform: `translate(${-1000}px, ${-1000}px)`
        } });
        //"position:absolute;z-index:1;display:none;min-width:100px;border:none;padding:0px;margin:0px;overflow:hidden;background:none;resize:none;height:fit-content;"
    }
    onmount() {
      
  
    }
}