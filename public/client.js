var images = [];
var count = 0;
var code = getURLParameter('code');

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function getPhotosByTag(token,hashtag,num_photos){	
	console.log("Access token: "+token);
	console.log("Searching for "+hashtag+ " pictures");
	$.ajax({
		url: 'https://api.instagram.com/v1/tags/'+hashtag+'/media/recent',
		dataType: 'jsonp',
		type: 'GET',
		data: {access_token: token, count: num_photos},
		success: function(data){
			console.log(data);
			images = data.data;
			console.log(images);
			$('.slider ul.images').append('<li><img src="'+images[count].images.standard_resolution.url+'"></li>');
			// for(x in data.data){
			// 	images = data.data;
			// 	$('.slider ul.images').append('<li><img src="'+data.data[x].images.standard_resolution.url+'"></li>');  
			// }
			setTimeout(function(){
				startSlider();
			}, 5000);
		},
		error: function(data){
			console.log(data);
		}
	});
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function checkCookie() {
    var access_token = getCookie("access_token");
    if (access_token != "") {
        console.log("Access token cookie exists");
        getPhotosByTag(access_token,"happilyeverhiatt2016",18);
    } else {
    	tradeCodeForToken();
    }
}

function tradeCodeForToken(){
	$.get("/get-token-with-code?code="+code, function(response) {
	 	var access_token = response.access_token;
	 	getPhotosByTag(access_token,"happilyeverhiatt2016",18);
	 	//save code in a cookie
		setCookie("access_token", access_token, 30);

	})
	.fail(function(error,errorResponse){
		console.log("There was an error");
		console.log(error);
	});
}




if(code) {
	console.log("Code exists");
	checkCookie();
}
else {
	console.log("Code does not exist");

	$.get("/", function(response) {
	  //get code
	  window.location = response.instaLink;	
	})
	.fail(function(error,errorResponse){
		console.log("There was an error");
		console.log(error);
	});
}
	


// var leftPos;
// var slideWidth = $(".slider ul li").width();
// var slideCount = $(".slider ul li").length;
// var sliderTotalWidth = slideCount * slideWidth;
// $(".slider ul").css({width:sliderTotalWidth, marginLeft: 0});

function startSlider() {

	if(count < images.length - 1) {
		count = count+1;
	}
	else {
		count = 0;
	}

	$('.slider ul.images li img').fadeOut(500,function(){
	    $(this).attr("src", images[count].images.standard_resolution.url).fadeIn(500);
	});	

	setTimeout(function(){
		startSlider();
	},8000);

	//leftPos = leftPos - slideWidth;
	//$(".slider ul").animate({left: leftPos + 'px'});
	//$(".slider ul").css({width:sliderTotalWidth, marginLeft: - slideWidth});
}





