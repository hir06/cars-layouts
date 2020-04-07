window.addEventListener('DOMContentLoaded', (event) => {

});

function Cars() {
        this.cities = [];
        this.filterdData = [];
        this.searchText = '';
        this.isHd = '';
        this.isOneway = '';
        this.renderCard = (data) => {
            let parent;
            if (data.popular) parent = document.getElementById('popular');
            else parent = document.getElementById('others');
            let row = document.createElement('div');
            row.setAttribute('class', 'card');
            let img = document.createElement('img');
            img.setAttribute('src', data.icon);
            img.setAttribute('alt', 'No Image found');
            let title = document.createElement('div');
            title.setAttribute('class', 'title');
            title.textContent = data.name;
            row.appendChild(img);
            row.appendChild(title);
            parent.appendChild(row);
        }
        this.fetchData = () => {
        //this.showLoader();   
        fetch('https://api.zoomcar.com/v4/cities?platform=web').then(function (response) {
            // The API call was successful!
            return response.json();
        }).then((data) => {
            setTimeout(() => {
                this.hideLoader();
                if (data.cities) {
                    this.cities = data.cities
                    for (let i = 0; i < this.cities.length; i++) {
                        this.renderCard(this.cities[i])
                    }
                }
                else {
                    console.warn('No Data Found', err);
                }
            },1000)
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
    }
}
Cars.prototype.filterCities = function(event) {
    console.log(this);
    if (event.type == 'checkbox') {
        if (event.checked) {
            this.isHd = event.id == 'hd' ? true : this.isHd;
            this.isOneway = event.id == 'oneWay' ? true : this.isOneway;
        }
        else {
            // handling unselect part here
            this.isHd = event.id == 'hd' ? '' : this.isHd;
            this.isOneway = event.id == 'oneWay' ? '' : this.isOneway;
        }
    }
    else {
        this.searchText = event;
    }
    this.filterdData = this.cities.filter((d) =>
        d.name.toLowerCase().includes(this.searchText) &&
        (this.isHd ? d.hd_enabled == this.isHd : [true, false].includes(d.hd_enabled)) &&
        (this.isOneway ? d.one_way_enabled == this.isOneway : [true, false].includes(d.one_way_enabled))
    );
    document.getElementById('popular').textContent = '';
    document.getElementById('others').textContent = '';
    for (let i = 0; i < this.filterdData.length; i++) {
       this.renderCard(this.filterdData[i]);
    }
    console.log(this.filterdData);
}
Cars.prototype.showLoader = function() {
    let loader = document.getElementsByClassName('loader')[0];
    loader.removeAttribute('class','hide');
    document.getElementsByClassName('cont')[0].setAttribute('class','hide');
}
Cars.prototype.hideLoader = function() {
   document.getElementsByClassName('cont')[0].removeAttribute('class','hide');
   document.getElementsByClassName('loader')[0].setAttribute('class','hide');
}
var op = new Cars();
function debounce(fn, duration) {
    let timer;
    return function (args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(args);
        }, duration)
    }
}
const fn = debounce(op.filterCities.bind(op), 200);
op.fetchData();
