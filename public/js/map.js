
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: list.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 2 // starting zoom
    });

        const marker1 = new mapboxgl.Marker({color: 'red'})
        .setLngLat(list.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`${list.title}<p>Exact location provided after booking</p>`))
        .addTo(map);