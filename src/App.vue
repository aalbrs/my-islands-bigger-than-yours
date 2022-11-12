<template>
    <div id="app">

        <div id="nav">
            <div id="nav1">
                <div class="nav1-inner">
                    <div class="title">My Island's Bigger Than Yours</div>
                    <!-- to add, sync map scale toggle button -->
                    <!-- <div class="button">Sync</div> -->
                </div>
            </div>
            <div id="nav2">
                <div class="columns">
                    <div class="column">
                        <div id="search1" class="search-wrapper" />
                    </div>
                    <div class="column">
                        <div id="search2" class="search-wrapper" />
                    </div>
                </div>
            </div>
        </div>

        <div id="main">
            <div class="columns map-columns is-gapless">
                <div class="column">
                    <map-part
                        v-bind:ready="ready"
                        map-id="map1"
                        search-node="search1"
                        search-placeholder="Location 1"
                    ></map-part>
                </div>
                <div class="column">
                    <map-part
                        v-bind:ready="ready"
                        map-id="map2"
                        search-node="search2"
                        search-placeholder="Location 2"
                    ></map-part>
                </div>
            </div>
        </div>

        <!-- router view not currently used -->
        <!-- <router-view/> -->

    </div>
</template>


<script>
// @ is an alias to /src
import MapPart from "@/parts/MapPart.vue";

// load esri modules
// load esri styles for version 4.x using loadCss
import { loadCss } from "esri-loader";
loadCss('4.23');
import mapUtils from "@/utils/mapUtils";
// start loading esri modules for performance,
// called again in created to ensure loading happens before other logic.
// esri-loader *should* ensure no double-loading happens...
var apiOptions = {
    version: '4.23'
}
mapUtils.loadEsriModules(apiOptions).then(() => {});


export default {
    name: "app",
    components: {
        MapPart
    },
    data: function() {
        return {
            ready: false
        };
    },
    created() {
        // preload esri modules and attach to window
        // esri maps can initialise after this
        mapUtils.loadEsriModules(apiOptions).then(() => {
            // esri modules have loaded here
            this.ready = true;
        });

    },
    methods: {
        
    },

};

</script>


<style lang="scss">
// CSS framework
@import "bulma";
//@import "./style.scss";

$navHeight: 90px;
$navHeightMobile: 110px;

$colourHeader: #FFF;
$colourHeaderBackground: #0072C6;
$colour: #444;
$colourBackground: white;


html,
body,
#app {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
}

#app {
    position: relative;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: $colour;
    background-color: $colourBackground;

    #nav {
        position: relative;
        height: $navHeight;
        width: 100%;

        #nav1 {
            position: relative;
            width: 100%;
            height: 50%;

            .nav1-inner {
                margin-left: 16px;
                width: 100%;
                max-width: 500px;
            }

            div {
                display: inline-block;
            }
            .title {
                font-size: 22px;
                line-height: 45px; 
                vertical-align: middle;
                font-weight: normal;
                color: #3f6aaf;
            }
            .button {
                float: right;
                margin: 4px 4px;
            }
        }

        #nav2 {
            position: relative;
            width: 100%;
            height: 50%;

        }

        .search-wrapper {
            width: 70%;
            height: 100%;
            margin-left: 8px;
        }
    }

    #main {
        position: absolute;
        bottom: 0;
        top: $navHeight;
        left: 0;
        right: 0;
    }

    .columns.map-columns {
        height: 100%;

        .column {
            height: 100%; 
        }

    }

  // tablet breakpoint used by bulma
@media screen and (max-width: 768px) {

    #nav {
        height: $navHeightMobile;

        #nav1 {
            height: 10%;
            visibility: hidden;
        }

        #nav2 {
            height: 90%;
        }

    }

    #main {
        top: $navHeightMobile;
    }

    .columns.map-columns .column {
        height: 50%;
    }

}



    

}
</style>
