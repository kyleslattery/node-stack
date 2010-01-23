var sys   = require("sys"),
	http  = require("http"),
	stack = require("../lib/stack");
	
var md = function(stack) {
	var test = "outside";
	
	stack.addRequestCallback(function(app, request) {
		// Do something with request
		request.headers["X-Middlewared"] = 'true';
		test = "inside";
		
		app.request(request);
	})
	
	stack.addResponseCallback(function(app, response) {
		// response will be [statusCode: 200, headers: {}, body: ""}
		// Do something with response
		response.body += "<!-- " + test + " -->";
		app.respond(response);
	});
};

var md2 = function(stack) {
	stack.addResponseCallback(function(app, response) {
		response.body += "<!-- MD2 -->";
		app.respond(response);
	});
}

var mdEndpoint = function(app, request) {
	// This is the final part of the stack, all it does is return a response,
	// it is unable to run another request.
	
	app.respond({
		statusCode: 200,
		headers: {},
		body: "Awesome!"
	})
}

var mdStack = new stack.Stack();

mdStack.add(md);
mdStack.add(md2);

mdStack.setEndpoint(mdEndpoint);

http.createServer(mdStack.run).listen(8000);