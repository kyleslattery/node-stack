var sys        = require("sys"),
	http       = require("http"),
	stack = require("../lib/stack");
	
var md = function(app, request) {
	// Do something with request
	request.headers["X-Middlewared"] = 'true';
	
	// Request app (runs stack) 
	// Pass request and callback function with response param
	// response will be [statusCode: 200, headers: {}, body: ""}
	app.request(request, function(response) {
		// Do something with response
		response.body += "<!-- MIDDLEWARED -->";
		response.headers["Content-Length"] = response.body.length;
		
		app.respond(response);
	});
};

var mdEndpoint = function(app, request) {
	// This is the final part of the stack, all it does is return a response,
	// it is unable to run another request.
	
	app.respond({
		statusCode: 200,
		headers: {},
		body: "Awesome!";
	})
}

var mdStack = new stack.Stack();

mdStack.add(md);
mdStack.setEndpoint(mdEndpoint);

http.createServer(mdStack.run).listen(8000);