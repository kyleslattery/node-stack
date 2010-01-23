var sys = require("sys");

exports.Stack = function() {
	var stack = this;
	
	stack.callbacks = {
		request: [],
		response: []
	};
	stack.endpoint = null;
	
	// A new one of these gets created for each request, and it keeps track of
	// which layer the stack is currently on.
	stack.Runner = function() {
		var runner = this;

		runner.currentRequestCallback = -1;
		runner.currentResponseCallback = -1;
		
		runner.start = function(request, httpResponse) {
			runner.httpResponse = httpResponse;
			runner.request(request);
		}
		
		runner.request = function(request) {			
			// Check if there are still stacks to run
			if(runner.currentRequestCallback + 1 < stack.callbacks.request.length) {
				// Increase current index
				runner.currentRequestCallback += 1;
			
				// Call layer
				sys.puts("Calling Layer #" + runner.currentRequestCallback);
				stack.callbacks.request[runner.currentRequestCallback](runner, request);
			} else {
				// No more layers to run, so call the endpoint
				stack.endpoint(runner, request);
			}
		}
		
		runner.respond = function(response) {
			// Check if there are still stacks to run
			if(runner.currentResponseCallback + 1 < stack.callbacks.response.length) {
				// Increase current index
				runner.currentResponseCallback += 1;
			
				// Call layer
				sys.puts("Calling Layer #" + runner.currentResponseCallback);
				stack.callbacks.response[runner.currentResponseCallback](runner, response);
			} else {
				// No more layers to run, so return data to user
				runner.httpResponse.sendHeader(response.statusCode, response.headers);
				runner.httpResponse.sendBody(response.body);
				runner.httpResponse.finish();
			}
		}
	}
	
	// Add layer
	stack.add = function(layer) {
		layer(stack);
	}
	
	// Add request callback to stack
	stack.addRequestCallback = function(callback) {
		stack.callbacks.request.push(callback);
	}
	
	stack.addResponseCallback = function(callback) {
		// Add to the front of the array, since callbacks run in reverse
		stack.callbacks.response.splice(0, 0, callback);
	}
	
	// Set Endpoint
	stack.setEndpoint = function(endpoint) {
		stack.endpoint = endpoint;
	}
	
	// Run the stack for a request
	stack.run = function(request, response) {
		var runner = new stack.Runner();
		runner.start(request,response);
	}
}