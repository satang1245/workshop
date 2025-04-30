const $images = [
	{src: './images/img_1.jpg', thumb: './images/img_1_thum.jpg', subHtml: ''},
	{src: './images/img_2.jpg', thumb: './images/img_2_thum.jpg', subHtml: ''},
	{video: {source: [{ src: './videos/IMG_3450.mp4',type: 'video/mp4' }]}, poster: './images/img_13.jpg', thumb: './images/img_2_thum.jpg', subHtml: ''},
	{src: './images/img_3.jpg', thumb: './images/img_3_thum.jpg', subHtml: ''},
	{src: './images/img_4.jpg', thumb: './images/img_4_thum.jpg', subHtml: ''},
	{src: './images/img_5.jpg', thumb: './images/img_5_thum.jpg', subHtml: ''},
	// {src: './images/img_6.jpg', thumb: './images/img_6_thum.jpg', subHtml: ''},
	{src: './images/img_7.jpg', thumb: './images/img_7_thum.jpg', subHtml: ''},
	{src: './images/img_8.jpg', thumb: './images/img_8_thum.jpg', subHtml: ''},
	{src: './images/img_9.jpg', thumb: './images/img_9_thum.jpg', subHtml: ''},
	{src: './images/img_10.jpg', thumb: './images/img_10_thum.jpg', subHtml: ''},
	{src: './images/img_11.jpg', thumb: './images/img_11_thum.jpg', subHtml: ''},
	{src: './images/img_12.jpg', thumb: './images/img_12_thum.jpg', subHtml: ''},
	{src: './images/img_15.jpg', thumb: './images/img_15_thum.jpg', subHtml: ''},
	// {src: './images/img_13.jpg', thumb: './images/img_13_thum.jpg', subHtml: ''},
	{src: './images/img_17.jpg', thumb: './images/img_17_thum.jpg', subHtml: ''},
	{src: './images/img_16.jpg', thumb: './images/img_16_thum.jpg', subHtml: ''},
	{src: './images/img_18.jpg', thumb: './images/img_18_thum.jpg', subHtml: ''},
	{src: './images/img_19.jpg', thumb: './images/img_19_thum.jpg', subHtml: ''},
	{src: './images/img_20.jpg', thumb: './images/img_20_thum.jpg', subHtml: ''},
	{src: './images/img_21.jpg', thumb: './images/img_21_thum.jpg', subHtml: ''},
	{src: './images/img_22.jpg', thumb: './images/img_22_thum.jpg', subHtml: ''}
];

const container = document.getElementById('map');
const $ul = document.querySelector('#photos > ul');
const $fragment = document.createDocumentFragment();
let $photos = null;
let drawImageCount = 0,
	num = 0,
	totalImageLength = $images.length;

const basecampPosition = {Ma:37.528551, La:126.993087};
const options = {
	center: new kakao.maps.LatLng(37.532380, 126.993324),
	level: 4
};

const map = new kakao.maps.Map(container, options);
(function baseCampMarker() {
	const imageSrc = './flag.png', // 마커이미지의 주소입니다    
		imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
		imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
		
	// 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
	const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
		markerPosition = new kakao.maps.LatLng(basecampPosition.Ma, basecampPosition.La); // 마커가 표시될 위치입니다

	// 마커를 생성합니다
	const marker = new kakao.maps.Marker({
		position: markerPosition, 
		image: markerImage // 마커이미지 설정 
	});

	// 마커가 지도 위에 표시되도록 설정합니다
	marker.setMap(map);  
	// marker.setZIndex(10);
}());


function setImageMaker() {
	const exifLong = EXIF.getTag(this, "GPSLongitude");
	const exifLat = EXIF.getTag(this, "GPSLatitude");
	const exifLongRef = EXIF.getTag(this, "GPSLongitudeRef");
	const exifLatRef = EXIF.getTag(this, "GPSLatitudeRef");
	let latitude, longitude;
	
	if ( !exifLat || !exifLong ) {
		return false;
	}

	if (exifLatRef == "S") {
		latitude = (exifLat[0]*-1) + (( (exifLat[1]*-60) + (exifLat[2]*-1) ) / 3600);						
	} else {
		latitude = exifLat[0] + (( (exifLat[1]*60) + exifLat[2] ) / 3600);
	}

	if (exifLongRef == "W") {
		longitude = (exifLong[0]*-1) + (( (exifLong[1]*-60) + (exifLong[2]*-1) ) / 3600);						
	} else {
		longitude = exifLong[0] + (( (exifLong[1]*60) + exifLong[2] ) / 3600);
	}

	const imageSrc = this.getAttribute('src');
	const imageThumnail = imageSrc.replace('_md.jpg', '_thum.jpg');
	const imageSize = new kakao.maps.Size(40, 40); // 마커이미지의 크기입니다
	const imageOption = {offset: new kakao.maps.Point(27, 40)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

	const markerImage = new kakao.maps.MarkerImage(imageThumnail, imageSize, imageOption);
	const markerPosition  = new kakao.maps.LatLng(latitude, longitude); 
	const marker = new kakao.maps.Marker({
		position: markerPosition,
		image: markerImage
	});
	const infowindow = new kakao.maps.InfoWindow({
        content: '<figure><img src="'+imageSrc+'" width="180" /></figure>' // 인포윈도우에 표시할 내용
	});
	
	// marker.uuid = 'uuid-' + imageSrc.split('/').pop().split('.').shift();
	marker.index = this.index;
	marker.setMap(map);
	
	kakao.maps.event.addListener(marker, 'mouseover', function() {
		marker.setZIndex(2);
		infowindow.open(map, marker);
	});

	kakao.maps.event.addListener(marker, 'mouseout', function() {
		marker.setZIndex(1);
		infowindow.close();
	});

	kakao.maps.event.addListener(marker, 'click', function() {
		$photos.openGallery(marker.index);
	});
	// kakao.maps.event.addListener(map, 'click', function(e) {
	// 	var latlng = e.latLng;
	// 	console.log(latlng);
	// });
}


function goIntro() {
	// document.querySelector('#loading .car').classList.add('on');
	setTimeout(function() {
		document.documentElement.classList.remove('lock');
		document.getElementById('loading').classList.add('finish');
		setTimeout(function() {
			document.querySelector('#car').classList.add('on');
		}, 1000);
	}, 1800)
}

function drawImage() {
	const $li = document.createElement('li');
	const $clone = this.cloneNode(true);
	$li.appendChild(this);
	$li.appendChild($clone);
	$li.classList.add('photo-item');
	$li.classList.toggle('wide', this.width > this.height);
	// $li.classList.toggle('video', this.video);
	if ( this.video ) {
		$li.innerHTML += '<svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="m11.97 22c5.5228 0 10-4.4772 10-10 0-5.52285-4.4772-10-10-10-5.52288 0-10.00003 4.47715-10.00003 10 0 5.5228 4.47715 10 10.00003 10z"/><path d="m8.73999 12.2299v-1.67c0-2.08002 1.47001-2.93002 3.27001-1.89002l1.45.84 1.45.84002c1.8 1.04 1.8 2.74 0 3.78l-1.45.84-1.45.84c-1.8 1.04-3.27001.19-3.27001-1.89z" stroke-miterlimit="6"/></g></svg>';
	}
	$li.order = $li.style.order = this.index;
	$li.addEventListener('click', function () {
		$photos.openGallery(this.order);
	});
	$fragment.appendChild($li);

	EXIF.getData(this, setImageMaker);

	drawImageCount++;

	var v = (drawImageCount/$images.length) * window.innerWidth;
	document.querySelector('#loading > .car').style.transform = 'translateX('+ v +'px)';

	if (totalImageLength == drawImageCount) {
		$ul.appendChild($fragment);
		goIntro();
	}
}


for (let i = 0; i < $images.length; i+=1) {
	const $o = new Image();
	const _src = $images[i].poster?.replace('.jpg', '_md.jpg') || $images[i].src.replace('.jpg', '_md.jpg');
	$o.src = _src;
	if ( $images[i].poster ) $o.video = true;
	$o.index = i;
	$o.addEventListener('load', drawImage);
}
$photos = lightGallery($ul, {
	// lgZoom, 
	plugins: [lgThumbnail, lgVideo],
	videojs: true,
	licensekey: '0000-0000-000-0000',
	dynamic: true, dynamicEl: $images
});

const $car = document.querySelector('#car');
const carMoveHeight = window.innerHeight - 40 - 60; // 위아래 여백 20*2 - 카 사이즈

window.addEventListener('scroll', function () {
	const contentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
	$car.style.transform  = 'translateY('+  +'px) rotate(270deg)';
})