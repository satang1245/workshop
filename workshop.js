const $images = [
	{
		src: './images/IMG_3402.JPG',
		thumb: './images/IMG_3402.JPG',
		subHtml: '',
	},
	{
		src: './images/004.jpeg',
		thumb: './images/004.jpeg',
		subHtml: '',
	},
	{
		src: './images/IMG_3415.JPG',
		thumb: './images/IMG_3415.JPG',
		subHtml: '',
	},
	{
		src: './images/IMG_3417.JPG',
		thumb: './images/IMG_3417.JPG',
		subHtml: '',
	},
	{
		src: './images/IMG_3433.jpg',
		thumb: './images/IMG_3433.jpg',
		subHtml: '',
	},
	{
		src: './images/IMG_3435.jpg',
		thumb: './images/IMG_3435.jpg',
		subHtml: '',
	},
	{
		src: './images/IMG_3436.jpg',
		thumb: './images/IMG_3436.jpg',
		subHtml: '',
	},
	{
		src: './images/IMG_3441.jpg',
		thumb: './images/IMG_3441.jpg',
		subHtml: '',
	},
	{
		src: './images/IMG_3445.jpg',
		thumb: './images/IMG_3445.jpg',
		subHtml: '',
	},
	{
		src: './images/IMG_3500.JPG',
		thumb: './images/IMG_3500.JPG',
		subHtml: '',
	},
	{
		src: './images/IMG_3505.JPG',
		thumb: './images/IMG_3505.JPG',
		subHtml: '',
	},
	{
		src: './images/IMG_3508.JPG',
		thumb: './images/IMG_3508.JPG',
		subHtml: '',
	}
];
const $imageArr = [];

const container = document.getElementById('map');
const $ul = document.querySelector('#photos > ul');
const $fragment = document.createDocumentFragment();
let $photos = null;
let drawImageCount = 0,
	num = 0,
	totalImageLength = $images.length;

const basecampPosition = {Ma:37.528551, La:126.993087};
const options = {
	center: new kakao.maps.LatLng(basecampPosition.Ma, basecampPosition.La),
	level: 5
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
	marker.setZIndex(10);
}());


function setImageMaker() {
	const exifLong = EXIF.getTag(this, "GPSLongitude");
	const exifLat = EXIF.getTag(this, "GPSLatitude");
	const exifLongRef = EXIF.getTag(this, "GPSLongitudeRef");
	const exifLatRef = EXIF.getTag(this, "GPSLatitudeRef");
	

	if (exifLatRef == "S") {
		var latitude = (exifLat[0]*-1) + (( (exifLat[1]*-60) + (exifLat[2]*-1) ) / 3600);						
	} else {
		var latitude = exifLat[0] + (( (exifLat[1]*60) + exifLat[2] ) / 3600);
	}

	if (exifLongRef == "W") {
		var longitude = (exifLong[0]*-1) + (( (exifLong[1]*-60) + (exifLong[2]*-1) ) / 3600);						
	} else {
		var longitude = exifLong[0] + (( (exifLong[1]*60) + exifLong[2] ) / 3600);
	}

	const imageSrc = this.getAttribute('src');
	const imageSize = new kakao.maps.Size(64, 64); // 마커이미지의 크기입니다
	const imageOption = {offset: new kakao.maps.Point(27, 64)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

	const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
	const markerPosition  = new kakao.maps.LatLng(latitude, longitude); 
	const marker = new kakao.maps.Marker({
		position: markerPosition,
		image: markerImage
	});
	const infowindow = new kakao.maps.InfoWindow({
        content: '<figure><img src="'+imageSrc+'" width="240" /></figure>' // 인포윈도우에 표시할 내용
	});
	
	marker.uuid = 'uuid-' + imageSrc.split('/').pop().split('.').shift();
	marker.index = num++;
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
}

function drawImage() {
	const $li = document.createElement('li');
	const $clone = this.cloneNode(true);
	$li.appendChild(this);
	$li.appendChild($clone);
	$li.classList.add('photo-item');
	$li.classList.toggle('wide', this.width > this.height);
	$li.order = $li.style.order = this.index;
	$li.addEventListener('click', function () {
		$photos.openGallery(this.order);
	});
	$fragment.appendChild($li);

	EXIF.getData(this, setImageMaker);

	drawImageCount++;

	if (totalImageLength == drawImageCount) {
		$ul.appendChild($fragment);
	}
}


for (let i = 0; i < $images.length; i+=1) {
	const $o = new Image();
	$o.src = $images[i].src;
	$o.index = i;
	$o.addEventListener('load', drawImage);
}
$photos = lightGallery($ul, {
	plugins: [lgZoom, lgThumbnail],
	licensekey: '0000-0000-000-0000',
	dynamic: true, dynamicEl: $images
});
