import './style.css'
import { MapPart, setupMap } from './parts/map-part.ts'
import MapView from "@arcgis/core/views/MapView";
import Extent from "@arcgis/core/geometry/Extent";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import esriConfig from "@arcgis/core/config";

// SVGs:
// import typescriptLogo from './typescript.svg'

let map1Loaded = false;
let map2Loaded = false;


function main() {
    // add API key
    esriConfig.apiKey = "AAPK3c865ec2c71f41e49052418a024ede58EAJZkVFI10QNlSKXOKRfBcnbudmUXrJlllvN6PZnHjnEb70aK58blgWOrziGedkm";

    let mapNode1 = document.querySelector<HTMLDivElement>('#map1');
    let mapNode2 = document.querySelector<HTMLDivElement>('#map2');
    let searchNode1 = document.querySelector<HTMLDivElement>('#search1');
    let searchNode2 = document.querySelector<HTMLDivElement>('#search2');

    let mapPart1 = setupMap(mapNode1!, searchNode1!, 'Search for an island or place');
    let mapPart2 = setupMap(mapNode2!, searchNode2!, 'Compare with another place');

    mapPart1.view.when(() => {
        map1Loaded = true;
        onMapsReady(mapPart1, mapPart2);
    });

    mapPart2.view.when(() => {
        map2Loaded = true;
        onMapsReady(mapPart1, mapPart2);
    });
}

function onMapsReady(mapPart1: MapPart, mapPart2: MapPart) {
    if (!map1Loaded || !map2Loaded) {
        return
    }

    let scaleNode1 = document.querySelector<HTMLDivElement>('#scale1')!;
    let scaleNode2 = document.querySelector<HTMLDivElement>('#scale2')!;

    parseUrlOnStart(mapPart1.view, mapPart2.view);

    mapPart1.view.watch("scale", () => {
        // show scale of zoomed map
        setScaleTexts(scaleNode1, mapPart1.view, scaleNode2, mapPart2.view);
    });

    mapPart2.view.watch("scale", () => {
        setScaleTexts(scaleNode1, mapPart1.view, scaleNode2, mapPart2.view);
    });

    reactiveUtils.when(() => mapPart1.view.stationary, async () => {
        // set scale of second map to match
        await setMapToScale(mapPart1.view.zoom, mapPart2.view);
        updateUrlParams(mapPart1.view, mapPart2.view);
    });

    reactiveUtils.when(() => mapPart2.view.stationary, async () => {
        await setMapToScale(mapPart2.view.zoom, mapPart1.view);
        updateUrlParams(mapPart1.view, mapPart2.view);
    });

}

async function parseUrlOnStart(view1: MapView, view2: MapView) {
    let hash = window.location.hash.replace("#", "");
    let paramStrings = hash.split("&");
    let params = {} as any;
    paramStrings.forEach((s) => {
        let key = s.split("=")[0];
        let value = s.split("=")[1]
        params[key] = decodeURIComponent(value);
    });
    setMapExtentFromParam(params.extent1, view1);
    setMapExtentFromParam(params.extent2, view2);
}

async function setMapExtentFromParam(extentParam: string, view: MapView) {
    if (extentParam) {
        let extent = new Extent(JSON.parse(extentParam));
        await view.goTo(extent);
    }
    Promise.resolve();
}

function setScaleTexts(
    scaleNode1: HTMLDivElement,
    view1: MapView,
    scaleNode2: HTMLDivElement,
    view2: MapView) {

    let className = 'scale-text-label';
    if (scalesAreEqual(view1.zoom, view2.zoom)) {
        className += " scales-equal";
    }

    scaleNode1.innerText = getScaleTextLabel(view1);
    scaleNode2.innerText = getScaleTextLabel(view2);
    scaleNode1.className = className;
    scaleNode2.className = className;
}

function getScaleTextLabel(view: MapView): string {
    const roundedScale = view.scale.toFixed();
    return `1:${roundedScale}`;
}

async function setMapToScale(scaleLevel: number, esriMap: MapView) {
    if (esriMap != null && scaleLevel != null) {
        if (scalesAreEqual(esriMap.zoom, scaleLevel)) {
            // a guess that the map has already synched, scale level is the same
            return;
        }
        console.warn(`mibty: setting ${esriMap.container.id} zoom to ${scaleLevel}`);
        await esriMap.goTo({
            zoom: scaleLevel
        });
    }
}

function scalesAreEqual(scaleLevel1: number, scaleLevel2: number) {
    var diff = scaleLevel1 - scaleLevel2;
    return diff > -0.1 && diff < 0.1;
}

function updateUrlParams(view1: MapView, view2: MapView) {
    let extent1 = encodeURIComponent(JSON.stringify(view1.extent.toJSON()));
    let extent2 = encodeURIComponent(JSON.stringify(view2.extent.toJSON()));
    window.location.hash = `extent1=${extent1}&extent2=${extent2}`;
}


window.onload = main;