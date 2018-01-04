(function() {
    var $images = document.getElementById('images');
    var $button = document.getElementById('button');
    var $countImages = document.querySelector('.count-images');
    var $kindImages = document.querySelector('.kind-images');
    var $imageFormatControl = document.querySelector('.image-format-control');

    var init = function () {
        $button
            .addEventListener('click', execute);
    };

    var get = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== xhr.DONE) return;
            var status = xhr.status;
            var headers = xhr.getAllResponseHeaders();
            var text = xhr.responseText;
            callback(status, headers, text);
        };
        xhr.send();
    };

    var appendImage = function (url) {
        var imgEl = document.createElement('img');
        imgEl.src = url;
        imgEl.onerror = function () {
            // when image loading failed
            imgEl.classList.add('hidden');
            // added default image => when error
         var defaultImage = document.createElement('img');
         defaultImage.src = 'images/default.jpeg';
         $images.appendChild(defaultImage);
        };
        $images.appendChild(imgEl);
    };
        // choose from inputs
        function execute() {
            var limit = Number($countImages.value);
            var category = $kindImages.value;
            var format = $imageFormatControl.value;
            $images.innerHTML = '';
            if (!category && !limit && !format) {
                getImages();
            } else {
                getImages({
                    category: category,
                    limit: limit,
                    format: format
                })
            }
        }

    function getImages(params){
        params = params || {};
        var url = 'https://www.reddit.com/r/pics/search.json?q=';

        // default images - 100
        params.limit = params.limit || 100;

        // default kind of research - 'cats'
        params.category = params.category || 'cats';

        // default format of images - 'png'
        params.format = params.format || '.png';

        // formation of URL
        url += params.category + params.format + '/&limit=' + params.limit;

        get(url, function (status, headers, body) {
            var response = JSON.parse(body);
            _.each(response.data.children, function (child) {
                var url = child.data.url;
                appendImage(url);
                console.log('ITEM!', child.data.url);
            });

        });
    };

    init();
})();
