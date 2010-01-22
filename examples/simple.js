var sys        = require("sys"),
	http       = require("http"),
	middleware = require("../lib/middleware");
	
var md = new middleware.Middleware();

md.addCallback("request", function(request) {
	// Do something with request
	request.headers["X-Middlewared"] = 'true';
	
	// Must return request object
	return request;
});

md.addCallback("response", function(response) {
	// Do something with response
	response.body += "<!-- MIDDLEWARED! -->";
	response.headers["Content-Length"] = response.body.length;
	
	// Must return response object
	return response;
});
	
middleware.add(md);

http.createServer(function(request, response) {
	
}).listen(8000);