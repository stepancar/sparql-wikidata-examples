import * as React from 'react';
import {getPlacesByGeoFrame, GeoFrame} from '../queries';
declare var google: any;

export class PlacesInFrame extends React.Component<{}, {}> {
    private frame: GeoFrame = {
        minLatitude: 0,
        maxLatitude: 40,
        minLongetude: 0,
        maxLongitude: 50
    };
    private markers = [];
    private map: any;
    componentDidMount() {
        this.map = new (window as any).google.maps.Map(document.getElementById('gmap'), {
            center: { lat: 40, lng: 0 },
            zoom: 1
        });
        let rectangle = new google.maps.Rectangle({
            bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(this.frame.minLatitude, this.frame.minLongetude),
                new google.maps.LatLng(this.frame.maxLatitude, this.frame.maxLongitude)
            ),
            editable: true,
            draggable: true
        });
        rectangle.addListener('bounds_changed', () => {
            let bounds = rectangle.getBounds();
            this.frame = {
                maxLatitude: bounds.getNorthEast().lat(),
                minLatitude: bounds.getSouthWest().lat(),
                maxLongitude: bounds.getNorthEast().lng(),
                minLongetude: bounds.getSouthWest().lng()
            };
        });

        rectangle.setMap(this.map);
        this.search();
    }
    clearMarkers() {
        this.markers.forEach((marker) => {
            marker.setMap(null);
        });
        this.markers = [];
    }
    search() {
        getPlacesByGeoFrame(this.frame, 40, (places) => {
            this.clearMarkers();
            for (let place of places) {
                const coords = [parseFloat(place.lat.value), parseFloat(place.long.value)];
                let marker = new google.maps.Marker({
                    position: { lat: coords[0], lng: coords[1] },
                    map: this.map,
                    title: 'Hello World!'
                });
                this.markers.push(marker);
            }
        });
    }
    render() {
        return (
            <div>
                <button onClick={() => this.search() }>Search</button>
                <div id="gmap" style={{ width: '600px', height: '400px' }}></div>
            </div>
        );
    }
}