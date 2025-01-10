import {WebContainer} from '@webcontainer/api'

let WebContainerInstance = null;

export const GetWebContainer = async () => {
    if (!WebContainerInstance) {
        WebContainerInstance = await WebContainer.boot();
    }
    return WebContainerInstance;
}