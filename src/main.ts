import './style.css'
import { setupMap } from './parts/map-part.ts'
// import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import esriConfig from "@arcgis/core/config";
// SVGs:
// import typescriptLogo from './typescript.svg'



function main() {
    // add API key
    esriConfig.apiKey = "AAPK3c865ec2c71f41e49052418a024ede58EAJZkVFI10QNlSKXOKRfBcnbudmUXrJlllvN6PZnHjnEb70aK58blgWOrziGedkm";

    let mapNode1 = document.querySelector<HTMLDivElement>('#map1');
    let mapNode2 = document.querySelector<HTMLDivElement>('#map2');
    let searchNode1 = document.querySelector<HTMLDivElement>('#search1');
    let searchNode2 = document.querySelector<HTMLDivElement>('#search2');
    let scaleNode1 = document.querySelector<HTMLDivElement>('#scale1')!;
    let scaleNode2 = document.querySelector<HTMLDivElement>('#scale2')!;

    let mapPart1 = setupMap(mapNode1!, searchNode1!, 'Search for an island or place');
    let mapPart2 = setupMap(mapNode2!, searchNode2!, 'Compare with another place');

    mapPart1.view.watch("scale", () => {
        // show scale of zoomed map
        scaleNode1.innerText = getScaleText(mapPart1.view);
    });

    mapPart2.view.watch("scale", () => {
        scaleNode2.innerText = getScaleText(mapPart2.view);
    });

    reactiveUtils.when(() => mapPart1.view.stationary, async () => {
        // set scale of second map to match
        await setScale(mapPart1.view.zoom, mapPart2.view);
    });

    reactiveUtils.when(() => mapPart2.view.stationary, async () => {
        await setScale(mapPart2.view.zoom, mapPart1.view);
    });
}

function getScaleText(view: SceneView): string {
    const roundedScale = view.scale.toFixed();
    return `1:${roundedScale}`;
}

async function setScale(scaleLevel: number, esriMap: SceneView) {
    if (esriMap != null && scaleLevel != null) {
        
        var diff = esriMap.zoom - scaleLevel;
        if (diff > -0.1 && diff < 0.1) {
            // a guess that the map has already synched, scale level is the same
            return;
        }
        console.warn(`mibty: setting ${esriMap.container.id} zoom to ${scaleLevel}`);
        await esriMap.goTo({
            zoom: scaleLevel
        });
    }
}

window.onload = main;