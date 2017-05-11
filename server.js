var express = require('express');
var request = require('request');
var app = express();

//serve to files in public folder
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function (){
	console.log( "Listening on "+ server_ip_address+ ",server_port " + server_port);
})

// app.listen(4000, function (){
// 	console.log( "Listening on localhost:4000" );
// })

var clientId = 	"6fa44e4e17a84d26af0968b8aaa04fde";
var redirect_uri = "http://scottandneha-weddinginsta.rhcloud.com/gallery.html";
var instaLink = "https://api.instagram.com/oauth/authorize/?client_id="+clientId+"&redirect_uri="+redirect_uri+"&response_type=code&scope=public_content";
var client_secret = "300b6f24980743db94a5b8383ead094e";


//make initial redirect route
app.get('/',function(req,res){
	//res.redirect(instaLink);
	res.json({instaLink:instaLink});
})


//exchange code for token
app.get('/get-token-with-code',function(req,response) {	
	var code = req.query.code;
	console.log("Trading code: "+code+" for access token");


	var url = "https://api.instagram.com/oauth/access_token";
	var options = {
		url: url,
		method: "POST",
		form: {
			client_id : clientId,
			client_secret : client_secret,
			grant_type: 'authorization_code',
			redirect_uri: redirect_uri,
			code: code
		},
		json: true
	}


	request(options, function(err,res,body){
		var instagram_response = body;
		var token = instagram_response.access_token;
		response.json({access_token:token});
	})

})


//client side (public folder)
app.get('/gallery',function(req,response) {
	response.sendFile(__dirname + "/public/gallery.html");
});




