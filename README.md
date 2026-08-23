# My Island's Bigger Than Yours


A simple tool for visually comparing between two maps. When zooming, maps synchronise to the same scale and relative areas can be seen (approximately). 

https://www.myislandsbiggerthanyours.com/

Built with:
- [Vite](https://vitejs.dev/)
- [The ArcGIS Maps SDK for Javascript](https://developers.arcgis.com/javascript/latest/)


## Project setup
```
npm install
```

### Configuration

Create a local `.env.local` file and add your ArcGIS API key:

```env
VITE_ARCGIS_API_KEY=your-api-key
```

For release, add a GitHub Actions secret `ARCGIS_API_KEY`.

### Develop
```
npm run dev
```

