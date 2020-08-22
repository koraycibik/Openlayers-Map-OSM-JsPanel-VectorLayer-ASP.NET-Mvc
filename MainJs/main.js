var _Map, _Draw, _Source, _Layer;

InitializeMap = () => {

    _Source = new ol.source.Vector({ wrapX: false });

    _Layer = new ol.layer.Vector({
        source: _Source,
    });

    _Map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            _Layer
        ],
        view: new ol.View({
            center: [3875337.272593909, 4673762.797695817],
            zoom: 7
        })
    });
}


AddInteraction = () => {

    _Draw = new ol.interaction.Draw({
        source: _Source,
        type: "Point"
    });

    _Map.addInteraction(_Draw);

    _Draw.setActive(false);

    _Draw.on(
        "drawend",
        (_event) => {

            var datas = _event.feature.getGeometry().getCoordinates();  
            
            _Draw.setActive(false);

            var panel = jsPanel.modal.create({    
                
                theme: {                    
                    bgContent: '#333333',
                    colorHeader: '#333333',
                    colorContent: '#F2EFE9',
                    border: 'thin #b24406 solid'
                },                
                headerTitle: 'Save Point Panel',
                position: 'center',
                contentSize: '250 150',
                content: '<div class="container" style="padding-left:40px"><div class="row text-left" style="padding-top:20px;"> <div class="col" style="padding-left:20px">   <label style="color:white;">İsim    : </label><input  id="isim" style="color:black;" type="text"/></div></div><div class="row text-left" style="padding-top:20px;"><div class="col" style="padding-left:2px">Numara : <input id="numara" style="color:black;" type="number"/></div></div><div class="row text-left" style="padding-top:20px;"><div class="col" style="padding-left:80px"><button style="height:40px;width:60px" onclick="javascript:addDraw();" class="btn btn-primary">Ekle</button></div></div></div>'                
            });

            addDraw = () => {

                var _isim = $('#isim').val();
                var _numara = $('#numara').val();

                if (_numara.length < 1 || _isim == null) {

                    alertify.success('Bilgiler Hatalı Veya Eksik Var');  
                    return;
                }

                var _data = {

                    x: datas[0],
                    y: datas[1],
                    no: _numara,
                    name: _isim
                };              
                
                $.ajax({
                    type: "POST",
                    url: "/Home/LocationSaveJsPanelModal",
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    dataType: 'json',
                    data: JSON.stringify(_data),                  
                    success: function (message) {

                        alertify.success('Kayıtlar Json Dosyasına Eklendi');                        
                        _Draw.setActive(false);
                        panel.close();
                    },
                    error: function (response) {

                        alertify.error('Kayıt Durumunda Hata Oluştu : '+ response.message);  
                    },
                    onbeforeclose: function () {

                        return onbeforeclose();
                    },
                });
            }
        });
}

AddPoint = () => {

    _Draw.setActive(true);

}

ListDataViewBootstrapTable = () => {

    var temp = "";

    var theadF = '<table class="table"><thead><tr> <th scope="col">Number</th> <th scope="col">Name</th> <th scope="col">Latitude</th> <th scope="col">Longitude</th></tr></thead>';

    $.ajax({
        type: "POST",
        url: "/Home/ListDataViewBootstrapTable",        
        dataType: 'json',
        data: {},
        success: function (resp) {    
            
            temp = theadF;
            
            $.each(JSON.parse(resp), function (i, item) {  
                
                temp += '<tbody><tr><td>' + item.Number + '</td><td>' + item.Name + '</td><td>' + item.Latitude + '</td><td>' + item.Longitude + '</td></tr></tbody>';   
            });

            alertify.success('Kayıtlı Tüm Bilgiler Alındı..');

            theadF = '</table>';;

            jsPanel.modal.create({
                theme: {
                    bgContent: '#333333',
                    colorHeader: '#333333',
                    colorContent: `#F2EFE9`,
                    border: 'thin #b24406 solid'
                },   
                headerTitle: 'Eklenmiş Lokasyon Listesi',
                position: 'center',
                contentSize: '400 250',
                content: temp                
            });
        },  
        error: function (response) {

            jsPanel.modal.create({
                theme: 'error',
                headerTitle: 'Eklenmiş Lokasyon Listesi',
                position: 'center',
                contentSize: '400 250',
                content: '<p>Gösterilecek Data Bulunamadı. Hata Kodu : '+response.message+'</p>'                
            });

        },
        onbeforeclose: function () {

            return onbeforeclose();
        },
    });            
}

GetLocationPointFromData = () => {   

    function PointStyle(feature) {

        var style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                stroke: new ol.style.Stroke({
                    color: 'white',
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: 'green'
                })

            })

        });

        return [style];
    }

    $.ajax({
        type: "POST",
        url: "/Home/ListDataViewBootstrapTable",
        dataType: 'json',
        data: {},
        success: function (resp) {  
            
            $.each(JSON.parse(resp), function (i, item) { 
                
                var point_feature = new ol.Feature({});

                var point_geom = new ol.geom.Point([parseFloat(item.Latitude), parseFloat(item.Longitude)]);

                point_feature.setGeometry(point_geom);

                var linestring_feature = new ol.Feature({
                    geometry: new ol.geom.LineString(
                        [[10, 20], [20, 10], [30, 20]]
                    )
                });

                var vector_layer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [point_feature, linestring_feature]
                    }), style: PointStyle
                });

                _Map.addLayer(vector_layer); 
                
            });           

            alertify.success('Kayıtlı Kordinatlar Ekranda Point Olarak Gösterildi.');             
        },
        error: function (response) {

            alertify.error('Hata Alındı : ' + response.message);     
        },
        onbeforeclose: function () {
            return onbeforeclose();
        },
    });
}


